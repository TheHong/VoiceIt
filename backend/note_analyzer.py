
import numpy as np
import pyaudio
import time
import librosa
import matplotlib.pyplot as plt
import librosa.display
from backend.models import NoteResult, Note
RECORDING_PATH = "backend/recording.m4a"
VOICED_PROB_THRESHOLD = 0.2

#TODO: COMPLETE
BEATS_AND_NOTE_NAME = {
    0.25: "16",
    0.5: "8",
    0.75: "8.",
    1: "4",
    1.25: "4~16",
    1.5: "4.",
    1.75: "4..",
    2: "2",
    2.25: "2~16",
    2.5: "2~8",
    2.75: "2~8~16",
    3: "2.",
    3.25: "2.~8",
    3.5: "2..",
    4: "1"
}


def index_of_closest_in_array(array, value):
    return (np.abs(array - value)).argmin()


def beat_name(beat):
    return BEATS_AND_NOTE_NAME[beat[0][1] - beat[0][0]]

def most_common(lst):
    return max(set(lst), key=lst.count)


class NoteAnalyzer():
    def __init__(self, BPM, MUSIC_GRANULARITY):
        self.BPM = BPM  # beats per min
        # TIME_SIGNATURE="4/4"
        # BEATS_PER_BAR=request.args.get('beats per bar')
        # BARS=request.args.get('number of bars')
        self.MUSIC_GRANULARITY = MUSIC_GRANULARITY

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
                mid = (filled_beat_times[i][0][1]+filled_beat_times[i+1][0][0])/2
                filled_beat_times[i][0][1] = mid
                filled_beat_times[i + 1][0][0] = mid

        return filled_beat_times  # [[start, end], voiced]

    def run(self):
        y, sr = librosa.load(RECORDING_PATH)

        f0, voiced_flag, voiced_probs = librosa.pyin(
            y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
        times = librosa.times_like(f0, sr=sr)

        beat_times = self.find_beat_times(voiced_probs, times)

        beat_indices = [[[index_of_closest_in_array(times, i[0][0]),
                        index_of_closest_in_array(times, i[0][1])],
                         i[1]] for i in beat_times]

        pitches = [librosa.hz_to_note(i, octave=False) if not np.isnan(i)
                   else np.nan
                   for i in f0]  # get most common pitch

        clean_pitches = [most_common(pitches[i[0][0]:i[0][1]]) if i[1] == True
                         else "R"
                         for i in beat_indices]  # get most common pitch
        beat_bars = [[[self.seconds_to_beats(j) for j in i[0]], i[1]]
                     for i in beat_times]

        # note in english

        note_results = NoteResult(
            [Note(clean_pitches[i], beat_bars[i][0][1]-beat_bars[i][0][0]) for i in range(len(beat_bars))])
        return note_results
