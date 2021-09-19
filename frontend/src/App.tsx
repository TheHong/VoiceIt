import { useState } from 'react';
import { Note, NoteResult } from './models/notes';
import Slider from './components/slider';
import Fab from '@mui/material/Fab';
import * as Icon from 'react-feather';
import styled from 'styled-components';
import renderScore from './functions/music';

const MUSIC_DISPLAY_ID = "This-is-music"

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

  const onPlay = () => {
    console.log("Running music")


    // Create an SVG renderer and attach it to the DIV element named "vf".
    const div = document.getElementById(MUSIC_DISPLAY_ID)
    if (!!div) {
      renderScore(div, [[], [], []])
    }
  }

  const buttonSize = { width: "100px", height: "100px" }
  return (
    <Background>
      <h1>
        VoiceIt!
      </h1>
      <EditPanel>
        <PreferencesPanel>
          <Slider
            value={tempo}
            onChange={handleTempo}
            range={[20, 200]}
            icon={<Icon.Clock size={50} />}
            prefix=" bpm"
          />
        </PreferencesPanel>
        <ActionPanel>
          <Fab onClick={onRecord} style={{ backgroundColor: "#bd0202", ...buttonSize }}>
            <Icon.Mic size="50px" />
          </Fab>
          <Fab onClick={onPlay} style={{ backgroundColor: "#1bbd02", ...buttonSize }}>
            <Icon.Play size="50px" />
          </Fab>
        </ActionPanel>
      </EditPanel>

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
      <MusicPanel>
        <div id={MUSIC_DISPLAY_ID} />
      </MusicPanel>
    </Background>
  );
}

export default App;

const MusicPanel = styled.div`
  background-color: white;
  overflow: scroll;
  width: 100%;
`

const Background = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #282c34;
  min-height: 100vh;
  min-width: 100vh;
  align-items: center;
  justify-content: space-between;
  font-size: calc(10px + 2vmin);
  color: white;
  overflow: hidden; 
`

const EditPanel = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #362a52;
  padding: 10px;
  width: 100%;
  flex-grow: 1;
`

const PreferencesPanel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #462a52;
  flex-grow: 1;
  padding: 20px;
  justify-content: space-evenly;
`

const ActionPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  background-color: #2b522a;
  flex-grow: 1;
  padding: 24px;
`