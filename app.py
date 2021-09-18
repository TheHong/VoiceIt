from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/get', methods=['GET'])
def getNotes():
    # TODO: Add code for getting notes from audio file

    return jsonify({
        "notes": [{
            "note": "A",
            "duration": "0.25"
        }]
    })


if __name__ == "__main__":
    app.run(debug=True)
