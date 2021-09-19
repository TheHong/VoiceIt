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
    BPM = int(request.args.get('tempo'))  # beats per min
    # TIME_SIGNATURE="4/4"
    # BEATS_PER_BAR=request.args.get('beats per bar')
    # BARS=request.args.get('number of bars')
    # smallest note to beat
    MUSIC_GRANULARITY = 2**(int(request.args.get('gran'))/4)
    DURATION = int(request.args.get('duration'))
    noteAnalyzer = note_analyzer.NoteAnalyzer(BPM, MUSIC_GRANULARITY, DURATION)

    return noteAnalyzer.run().to_dict()


if __name__ == "__main__":
    app.run(debug=True)
