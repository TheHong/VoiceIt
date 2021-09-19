/*
Modified from https://github.com/0xfe/vexflow/wiki/Tutorial
*/
import Vex from 'vexflow';
import { Note } from '../models/notes';

const BAR_WIDTH = 250;
const STAVE_START = 10;
const STAVE_MARGIN_RIGHT = 5;

interface BarProps {
    previousBar?: Vex.Flow.Stave
    div: HTMLElement
    notes: Note[]
}

const addBar = ({ previousBar, div, notes }: BarProps, context: Vex.IRenderContext) => {
    // Drawing Staff ===========================================
    let newStave;
    if (!previousBar) { // First bar
        newStave = new Vex.Flow.Stave(STAVE_START, 0, BAR_WIDTH); // Create a stave of width 400 at position 10, 40 on the canvas.
        newStave.addClef("treble").addTimeSignature("4/4");
    } else { // Next bars
        newStave = new Vex.Flow.Stave(
            previousBar.getWidth() + previousBar.getX(),
            0,
            BAR_WIDTH
        );
    }
    newStave.setContext(context).draw(); // Connect it to the rendering context and draw!

    // Drawing Notes =============================================
    // TODO: Code out the conversion
    // const vfNotes = notes.map((note: Note) =>
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
const renderScore = ({ div, notes }: BarProps) => {
    // Overwrites the div
    div.innerHTML = ""

    // Splitting Music
    // TODO: Split notes into bars
    const noteSplits: Note[][] = [[], [], [], []]

    // Setup renderer ====================================
    const renderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(// Configure the rendering context
        STAVE_START + noteSplits.length * BAR_WIDTH + STAVE_MARGIN_RIGHT,
        150
    );


    // Drawing Bars ===========================================
    const context = renderer.getContext();  // Get drawing context
    let currStave: Vex.Flow.Stave;
    noteSplits.forEach((notes: Note[]) => {
        currStave = addBar({ previousBar: currStave, div: div, notes: notes }, context)
    })

    // // measure 1
    // var staveMeasure1 = new Vex.Flow.Stave(10, 0, 300);
    // staveMeasure1.addClef("treble").setContext(context).draw();

    // var notesMeasure1 = [
    //     new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "q" }),
    //     new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "q" }),
    //     new Vex.Flow.StaveNote({ keys: ["b/4"], duration: "qr" }),
    //     new Vex.Flow.StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "q" }),
    // ];

    // // Helper function to justify and draw a 4/4 voice
    // Vex.Flow.Formatter.FormatAndDraw(context, staveMeasure1, notesMeasure1);

    // // measure 2 - juxtaposing second measure next to first measure
    // var staveMeasure2 = new Vex.Flow.Stave(
    //     staveMeasure1.getWidth() + staveMeasure1.getX(),
    //     0,
    //     400
    // );
    // staveMeasure2.setContext(context).draw();

    // var notesMeasure2 = [
    //     new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "8" }),
    //     new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
    //     new Vex.Flow.StaveNote({ keys: ["b/4"], duration: "8" }),
    //     new Vex.Flow.StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "8" }),
    //     new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "8" }),
    //     new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "8" }),
    //     new Vex.Flow.StaveNote({ keys: ["b/4"], duration: "8" }),
    //     new Vex.Flow.StaveNote({ keys: ["c/4", "e/4", "g/4"], duration: "8" }),
    // ];
    // Vex.Flow.Formatter.FormatAndDraw(context, staveMeasure2, notesMeasure2);


    // // Setup renderer ====================================
    // const VF = Vex.Flow;
    // const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // // Drawing Staff ===========================================
    // renderer.resize(500, 200); // Configure the rendering context.
    // const context = renderer.getContext();  // Get drawing context
    // const stave = new VF.Stave(10, 10, 400); // Create a stave of width 400 at position 10, 40 on the canvas.
    // stave.addClef("treble").addTimeSignature("4/4");
    // stave.setContext(context).draw(); // Connect it to the rendering context and draw!

    // // Drawing Notes =============================================
    // const vfNotes = notes.map((note: Note) =>
    //     new VF.StaveNote({ clef: "treble", keys: ["c/4"], duration: "q" })
    // )

    // var sampleNotes = [
    //     // A quarter-note C.
    //     new VF.StaveNote({ clef: "treble", keys: ["c/4"], duration: "8" }),
    //     new VF.StaveNote({ clef: "treble", keys: ["c/4"], duration: "8" }),

    //     // A quarter-note D.
    //     new VF.StaveNote({ clef: "treble", keys: ["d/4"], duration: "4" }),

    //     // A quarter-note rest. Note that the key (b/4) specifies the vertical
    //     // position of the rest.
    //     new VF.StaveNote({ clef: "treble", keys: ["b/4"], duration: "qr" }),

    //     // A C-Major chord.
    //     new VF.StaveNote({ clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "4" })
    // ];


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