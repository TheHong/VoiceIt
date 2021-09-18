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