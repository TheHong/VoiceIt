/*
Modified from https://github.com/0xfe/vexflow/wiki/Tutorial
*/
import Vex from 'vexflow';
import { Note, Bar, Score } from '../models/notes';

const BAR_WIDTH = 250;
const APPROX_BAR_HEIGHT = 120;
const APPROX_LEFT_ORNAMENT_WIDTH = 75;
const STAVE_START = 10;
const STAVE_MARGIN_RIGHT = 5;

interface BarProps {
    previousStave?: Vex.Flow.Stave
    div: HTMLElement
    bar: Bar
    y: number
    context: Vex.IRenderContext
}

const addBar = ({ previousStave, bar, y, context }: BarProps) => {
    // Drawing Staff ===========================================
    let newStave;
    if (!previousStave) { // First bar
        newStave = new Vex.Flow.Stave(STAVE_START, y, BAR_WIDTH + APPROX_LEFT_ORNAMENT_WIDTH);
        newStave.addClef("treble").addTimeSignature("4/4");
    } else { // Next bars
        newStave = new Vex.Flow.Stave(
            previousStave.getWidth() + previousStave.getX(),
            y,
            BAR_WIDTH
        );
    }
    newStave.setContext(context).draw(); // Connect it to the rendering context and draw!

    // Drawing Notes =============================================
    // TODO: Code out the conversion (possibly convert it outside)
    // const vfNotes = bar.map((note: Note) =>
    //     new Vex.Flow.StaveNote({ clef: "treble", keys: ["c/4"], duration: "q" })
    // )

    var sampleNotes = [
        // A quarter-note C.
        new Vex.Flow.StaveNote({ clef: "treble", keys: ["c/4"], duration: "8" }),
        new Vex.Flow.StaveNote({ clef: "treble", keys: ["c/4"], duration: "8" }),

        // A quarter-note D.
        new Vex.Flow.StaveNote({ clef: "treble", keys: ["d/4"], duration: "4" }),

        // A quarter-note rest. Note that the key (b/4) specifies the vertical
        // position of the rest.
        new Vex.Flow.StaveNote({ clef: "treble", keys: ["b/4"], duration: "qr" }),

        // A C-Major chord.
        new Vex.Flow.StaveNote({ clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "4" })
    ];

    const vfNotes = sampleNotes
    Vex.Flow.Formatter.FormatAndDraw(context, newStave, vfNotes);

    return newStave
}
const renderScore = (div: HTMLElement, score: Score) => {
    // Overwrites the div
    div.innerHTML = ""

    // Splitting Music
    // TODO: Split notes into bars
    const noteSplits: Note[][] = [[], [], [], []]

    // Setup renderer ====================================
    const renderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(// Configure the rendering context
        STAVE_START + APPROX_LEFT_ORNAMENT_WIDTH + noteSplits.length * BAR_WIDTH + STAVE_MARGIN_RIGHT,
        APPROX_BAR_HEIGHT * score.length
    );

    score.forEach((bar: Bar, barNum: number) => {
        // Drawing Bars ===========================================
        const context = renderer.getContext();  // Get drawing context
        let currStave: Vex.Flow.Stave;
        noteSplits.forEach((bar: Bar) => {
            currStave = addBar({
                context: context,
                previousStave: currStave,
                div: div,
                bar: bar,
                y: barNum * APPROX_BAR_HEIGHT
            })
        })
    })
    // const context = renderer.getContext();  // Get drawing context
    // let currStave: Vex.Flow.Stave;
    // noteSplits.forEach((bar: Bar, i: number) => {
    //     currStave = addBar(
    //         { previousStave: currStave, div: div, bar: bar, y: 0 },
    //         context
    //     )
    // })



    // // Create a voice in 4/4 and add the notes from above
    // var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    // voice.addTickables(sampleNotes);

    // // Format and justify the notes to 400 pixels.
    // new VF.Formatter().joinVoices([voice]).format([voice], 400);

    // // Render voice
    // voice.draw(context, stave);
}

export default renderScore;

// const renderEasyScore = (id: string, notes: string) => {
//     // Adapted from https://github.com/0xfe/vexflow/wiki/Using-EasyScore

//     // Create an SVG renderer and attach it to the DIV element named "boo".
//     var vf = new Vex.Flow.Factory({ renderer: { elementId: id } });
//     var score = vf.EasyScore();
//     var system = vf.System();

//     system.addStave({
//         voices: [score.voice(score.notes('C#5/q, B4, A4, G#4'), null)]
//     }).addClef('treble').addTimeSignature('4/4');

//     vf.draw();
// }