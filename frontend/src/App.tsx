import { useState } from 'react';
import { Note, NoteResult } from './models/notes';
import Slider from './components/slider';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import * as Icon from 'react-feather';
import styled from 'styled-components';
import renderScore from './functions/music';
import { Track, Score } from './models/notes';

const MUSIC_DISPLAY_ID = "This-is-music"

const App = () => {
  const [newInfo, setNewInfo] = useState<string>("")
  const [currScore, setCurrScore] = useState<Score>([])

  const [bpm, setBpm] = useState<number>(120)
  const [granularity, setGranularity] = useState<number>(4)
  const [duration, setDuration] = useState<number>(3)

  const handleSlider = (setter: (value: any) => void) => (
    (event: any, value: any) => { setter(value); }
  )

  const onResetScore = () => {
    setCurrScore([]);
  }

  const onRecord = () => {
    fetch(
      `http://127.0.0.1:5000/get?bpm=${bpm}&gran=${granularity}&dur=${duration}`,
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

        // Get track from response
        const newTrack = resp.data;
        const newScore = [...currScore, newTrack];
        // Add track to the set of tracks (i.e. the score)
        setCurrScore(newScore)

        // Render the score
        const div = document.getElementById(MUSIC_DISPLAY_ID)
        if (!!div) {
          renderScore(div, newScore)
        }

        // TODO: Debug
        setNewInfo(resp.info)
      })
      .catch(error => console.log(error))
  }

  const onPlay = () => {
    console.log("Running music")
    // TODO: Play music
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
            value={bpm}
            onChange={handleSlider(setBpm)}
            range={[20, 200]}
            icon={<Icon.Activity size={50} />}
            prefix=" bpm"
            disabled={currScore.length > 0}
          />
          <Slider
            value={duration}
            onChange={handleSlider(setDuration)}
            range={[1, 10]}
            icon={<Icon.Clock size={50} />}
            prefix=" s"
            disabled={currScore.length > 0}
          />
          <Slider
            value={granularity}
            onChange={handleSlider(setGranularity)}
            range={[0, 5]}
            icon={<Icon.BarChart2 size={50} />}
            restrictedVals={[1, 2, 4]}
            disabled={currScore.length > 0}
          />
          <ButtonPanel>
            {currScore.length > 0 &&
              <Button onClick={onResetScore} color="error">
                Reset Score
              </Button>
            }
          </ButtonPanel>
        </PreferencesPanel>
        <ActionPanel>
          <Fab onClick={onRecord} style={{ backgroundColor: "#bd0202", ...buttonSize }}>
            <Icon.Mic size="50px" />
          </Fab>
          <Fab onClick={onPlay} style={{ backgroundColor: "#1bbd02", ...buttonSize }}>
            <Icon.Play size="50px" />
          </Fab>
          {/* TODO: Add instrument buttons */}
        </ActionPanel>
      </EditPanel>

      {/* {newNotes.length > 0 ?
        <div>
          Info={newInfo}
          {newNotes.map((note: Note) =>
            <div>
              Note={note.name}, Duration={note.duration}
            </div>
          )}
        </div> :
        <p>No notes yet</p>
      } */}
      <MusicPanel>
        {currScore.length > 0 && <div id={MUSIC_DISPLAY_ID} />}
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

const ButtonPanel = styled.div`
  display: flex;
  align-self: center;
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