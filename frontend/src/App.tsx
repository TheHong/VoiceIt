import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Note, NoteResult } from './models/notes';
import Slider from './components/slider';
import * as Icon from 'react-feather';

const App = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [info, setInfo] = useState<string>("")

  const [tempo, setTempo] = useState<number>(120)

  const handleTempo = (event: any, value: any) => {
    setTempo(value);
  };

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
        <img src={logo} className="App-logo" alt="logo" width={100} height={100} />
        <h1>
          Welcome!
        </h1>
        <Slider
          value={tempo}
          onChange={handleTempo}
          range={[20, 200]}
          icon={<Icon.Thermometer />}
        />
        <button onClick={onRecord}>Record</button>
        {notes.length > 0 ?
          <div>
            Info={info}
            {notes.map((note: Note) =>
              <div>
                Note={note.name}, Duration={note.duration}
              </div>
            )}
          </div> :
          <p>No notes yet</p>
        }
      </header>
    </div>
  );
}

export default App;
