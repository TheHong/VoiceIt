/*
These must agree with models.py in the backend
*/

export interface Note {
    name: string
    duration: number
}

export interface NoteResult {
    data: Note[]
    info: string
}



/*
Below are frontend specific models
*/
export type Bar = Note[] // Each bar must have a whole duration (i.e. a complete bar) 
export type Track = Bar[] 
export type Score = Track[]