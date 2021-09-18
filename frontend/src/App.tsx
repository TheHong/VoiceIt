import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Note, NoteResult } from './models/notes';

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [info, setInfo] = useState<string>("")

  const [tempo, setTempo] = useState<number>(120)

  useEffect(() => {


  }, [])

  const onRecord = () => {
    fetch(
      `http://127.0.0.1:5000/get?tempo=${tempo}`,
      {
        'method': 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      } as RequestInit
    )
      .then(resp => resp.json())
      .then((resp: NoteResult) => {
        console.log(resp)
        setNotes(resp.data)
        setInfo(resp.info)
      })
      .catch(error => console.log(error))
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
          Welcome!
        </h1>
        <button onClick={onRecord}>Record</button>
        {notes.length > 0 ?
          <div>
            Info={info}
            {notes.map((note: Note) => {
              return (
                <div>
                  Note={note.name}, Duration={note.duration}
                </div>
              )
            })}
          </div> :
          <p>No notes yet</p>
        }

      </header>
    </div>
  );
}

export default App;
