from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

from backend import models

app = Flask(__name__, static_url_path='', static_folder='frontend/build')
CORS(app)

@app.route("/", defaults={'path':''})
def home(path):
    if os.path.exists(app.static_folder):
        return send_from_directory(app.static_folder,'index.html')
    else:
        return "Python Backend Running!"

@app.route('/get', methods=['GET'])
def getNotes():
    tempo = request.args.get('tempo')

    # TODO: Add code for getting notes from audio file

    sampleNote = models.Note(name="A", duration="0.25")
    sampleNoteResult = models.NoteResult(data=[sampleNote], info=str(tempo))
    return jsonify(sampleNoteResult.to_dict())



if __name__ == "__main__":
    app.run(debug=True)
