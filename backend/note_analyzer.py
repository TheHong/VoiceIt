import wave
import numpy as np
import pyaudio
import time
import librosa
import matplotlib.pyplot as plt
import librosa.display
from backend.models import NoteResult, Note
RECORDING_PATH = "backend/output.wav"
VOICED_PROB_THRESHOLD = 0.2

#TODO: COMPLETE
BEATS_AND_NOTE_NAME = {
    0.25: "16",
    0.5: "8",
    0.75: "8d",
    1: "q",
    # 1.25: "4~16",
    1.5: "qd",
    1.75: "qdd",
    2: "h",
    # 2.25: "2~16",
    # 2.5: "2~8",
    # 2.75: "2~8~16",
    3: "hd",
    # 3.25: "2.~8",
    3.5: "hdd",
    4: "1"
}
# BEATS_AND_NOTE_NAME = {
#     0.25: "16",
#     0.5: "8",
#     0.75: "8d",
#     1: "q",
#     1.25: "4~16",
#     1.5: "qd",
#     1.75: "qdd",
#     2: "h",
#     2.25: "2~16",
#     2.5: "2~8",
#     2.75: "2~8~16",
#     3: "hd",
#     3.25: "2.~8",
#     3.5: "hdd",
#     4: "1"
# }


def index_of_closest_in_array(array, value):
    return (np.abs(array - value)).argmin()


def beat_name(beat):
    return BEATS_AND_NOTE_NAME[beat[0][1] - beat[0][0]]


def most_common(lst):
    return max(set(lst), key=lst.count)


def transform_note(note_name, note_duration, note_tie):
    name = note_name[0:-1].lower() + "/" + \
        note_name[-1] if note_name != "R" else "b/4"
    duration = BEATS_AND_NOTE_NAME[note_duration]
    if note_name == "R":
        duration += "r"
    return Note(name, duration, note_tie)


def split_note(note):
    # note: name, duration (#beats), tie
    # out list of note: name, duration(string), tie

    if note.duration not in BEATS_AND_NOTE_NAME.keys():
        note_name_list = list(BEATS_AND_NOTE_NAME.keys())
        # print(note_name_list)
        j = len(note_name_list)-1
        remain = note.duration
        notes = []
        while j > -1 and remain > 0:
            # print(notes, note_name_list[j])
            if note_name_list[j] <= remain:
                remain -= note_name_list[j]
                notes.append(transform_note(
                    note.name, note_name_list[j], remain > 0 and note.tie))
            j -= 1
        return notes
    else:
        return [transform_note(note.name, note.duration, note.tie)]


def get_track(notes):
    old_count = 0
    new_count = 0
    track = []
    bar = []
    if notes[0].name == "R":
        notes = notes[1:]
    if notes[-1].name == "R":
        notes = notes[:-1]
    for i in notes:
        # print(counter, [i.duration for i in bar])
        new_count += i.duration
        if new_count < 4:
            bar += split_note(i)
            old_count += i.duration
        elif new_count == 4:
            bar += split_note(i)
            track.append(bar)
            bar = []
            old_count = 0
            new_count = 0
        else:
            # print([i.duration for i in bar])
            bar += split_note(Note(i.name, 4-old_count, i.name != "R"))
            track.append(bar)
            bar = split_note(Note(i.name, new_count-4, i.tie))
            new_count = new_count-4
            old_count = new_count
        # print(new_count, [i.duration for i in bar])

    # fill last bars
    if bar:
        bar+split_note(Note(i.name, 4-new_count, i.tie))
        track.append(bar)

    return track


class NoteAnalyzer():
    def __init__(self, BPM, MUSIC_GRANULARITY, DURATION):
        self.BPM = BPM  # beats per min
        # TIME_SIGNATURE="4/4"
        # BEATS_PER_BAR=request.args.get('beats per bar')
        # BARS=request.args.get('number of bars')
        self.MUSIC_GRANULARITY = MUSIC_GRANULARITY
        self.DURATION = DURATION

    def seconds_to_beats(self, seconds):
        return round(seconds * self.BPM / 60*self.MUSIC_GRANULARITY)/self.MUSIC_GRANULARITY

    def beats_to_seconds(self, beats):
        return beats/self.BPM*60

    def find_beat_times(self, voiced_probs, times):
        beat_indices = []
        voiced = False
        start = 0
        # TODO add deque?

        for (i, prob) in enumerate(voiced_probs):
            #voiced is before, prob is now
            if (prob > VOICED_PROB_THRESHOLD and not voiced) or (prob < VOICED_PROB_THRESHOLD and voiced):
                beat_indices.append([[start, i], voiced])
                start = i
                voiced = prob > VOICED_PROB_THRESHOLD

            if i == len(voiced_probs)-1:
                beat_indices.append([[start, i], voiced])

        beat_times = [[[times[j] for j in i[0]], i[1]] for i in beat_indices]

        cleaned_beat_times = [i for i in beat_times if (
            i[0][1]-i[0][0]) > self.beats_to_seconds(1/self.MUSIC_GRANULARITY)]

        # join rests
        i = 0
        while i < len(cleaned_beat_times)-1:
            if (not cleaned_beat_times[i][1]) and not (cleaned_beat_times[i+1][1]):
                cleaned_beat_times[i][0][1] = cleaned_beat_times[i+1][0][1]
                cleaned_beat_times.pop(i+1)
                i += 1
            i += 1
        cleaned_beat_times[0][0][0] = 0
        cleaned_beat_times[-1][0][0] = beat_times[-1][0][0]
        filled_beat_times = cleaned_beat_times.copy()

        for i in range(len(filled_beat_times)-1):
            # if end of prev!=start of next
            if filled_beat_times[i][0][1] != filled_beat_times[i+1][0][0]:
                mid = (filled_beat_times[i][0][1] +
                       filled_beat_times[i+1][0][0])/2
                filled_beat_times[i][0][1] = mid
                filled_beat_times[i + 1][0][0] = mid

        return filled_beat_times  # [[start, end], voiced]

    def analyze(self):
        y, sr = librosa.load(RECORDING_PATH)
        f0, voiced_flag, voiced_probs = librosa.pyin(
            y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))

        times = librosa.times_like(f0, sr=sr)
        i=0
        while i<len(times) and voiced_probs[i]<VOICED_PROB_THRESHOLD:
            i+=1

        f0=f0[i:]
        voiced_probs=voiced_probs[i:]
        times=times[0:-i]
      
        beat_times = self.find_beat_times(voiced_probs, times)

        beat_indices = [[[index_of_closest_in_array(times, i[0][0]),
                          index_of_closest_in_array(times, i[0][1])],
                         i[1]] for i in beat_times]

        pitches = [librosa.hz_to_note(i) if not np.isnan(i)
                   else np.nan
                   for i in f0]  # get most common pitch

        clean_pitches = [most_common(pitches[i[0][0]:i[0][1]]) if i[1] == True
                         else "R"
                         for i in beat_indices]  # get most common pitch
        # beat_bars = [[[self.seconds_to_beats(j) for j in i[0]], i[1]]
        #              for i in beat_times]

        beat_lengths = [self.seconds_to_beats(i[0][1] - i[0][0]) for i in beat_times]
        # note in english

        return [Note(clean_pitches[i], beat_lengths[i]) for i in range(len(beat_lengths))]

    def record(self):
        chunk = 1024  # Record in chunks of 1024 samples
        sample_format = pyaudio.paInt16  # 16 bits per sample
        channels = 2
        fs = 44100  # Record at 44100 samples per second
        seconds = self.DURATION
        filename = "backend/output.wav"

        p = pyaudio.PyAudio()  # Create an interface to PortAudio

        print('Recording')

        stream = p.open(format=sample_format,
                        channels=channels,
                        rate=fs,
                        frames_per_buffer=chunk,
                        input=True)

        frames = []  # Initialize array to store frames
        # Store data in chunks for 3 seconds
        num_chunks = int(fs / chunk * seconds)
        for i in range(4):
            print(i+1)
            time.sleep(60/self.BPM)

        beat_per_chunk = 1/self.BPM*60*fs/chunk
        metronome_chunks = [round(i*beat_per_chunk)
                            for i in range(0, round(num_chunks*beat_per_chunk))]

        for i in range(0, num_chunks):
            data = stream.read(chunk)
            if i in metronome_chunks:
                print(i//(round(1/self.BPM*60*fs/chunk)))
            frames.append(data)

        # Stop and close the stream
        stream.stop_stream()
        stream.close()
        # Terminate the PortAudio interface
        p.terminate()

        print('Finished recording')

        # Save the recorded data as a WAV file
        wf = wave.open(filename, 'wb')
        wf.setnchannels(channels)
        wf.setsampwidth(p.get_sample_size(sample_format))
        wf.setframerate(fs)
        wf.writeframes(b''.join(frames))
        wf.close()

    def run(self):
        self.record()
        return get_track(self.analyze())  # list of bars of notes
