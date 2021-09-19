from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os


from backend import models, note_analyzer


app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app)


@app.route("/", defaults={'path': ''})
def home(path):
    if os.path.exists(app.static_folder):
        return send_from_directory(app.static_folder, 'index.html')
    else:
        return "Python Backend Running!"


@app.route('/get', methods=['GET'])
def getNotes():
    bpm_input = request.args.get('bpm')
    granularity_input = request.args.get('gran')
    duration_input = request.args.get('dur')
    if None in [bpm_input, granularity_input, duration_input]:
        raise ValueError("Input required for each argument")

    BPM = int(bpm_input)  # beats per min
    MUSIC_GRANULARITY = int(granularity_input)  # 1: quarternote, 2: eigth-note, 4: 1/16 note
    DURATION = int(duration_input)
    noteAnalyzer = note_analyzer.NoteAnalyzer(BPM, MUSIC_GRANULARITY, DURATION)

    bars= noteAnalyzer.run() #list of bars of notes
    return  {"data": [[note.__dict__ for note in bar] for bar in bars]}


if __name__ == "__main__":
    app.run(debug=True)
