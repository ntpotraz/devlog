import { useState } from "react";

import "./App.css";
import CreateNote from "./CreateNote";
import Homepage from "./Homepage";

function App() {
    const [newNote, setNewNote] = useState<boolean>(false);
    const [noteText, setNoteText] = useState<string>("");
    const [notes, setNotes] = useState<Note[]>([]);

    type Note = {
        body: string;
        time: Date;
    };

    function addNote() {
        if (noteText === "") {
            setNewNote(false);
            return;
        }

        const note: Note = { body: noteText, time: new Date() };
        setNotes([note, ...notes]);
        setNoteText("");
        setNewNote(false);
    }

    return (
        <div className="h-screen flex flex-col font-sans">
            <h1 className="devFont text-orange-500 text-9xl text-center my-8">
                devlog
            </h1>
            <button
                type="button"
                className="devFont text-orange-500 text-2xl border border-orange-500 rounded-lg px-8 py-4 hover:bg-orange-500 hover:text-gray-800 transition-all duration-200 ease-in-out"
                onClick={() => setNewNote(!newNote)}
            >
                {newNote ? "close" : "new note"}
            </button>
            <div className="mt-8">
                {newNote ? (
                    <CreateNote
                        noteText={noteText}
                        setNoteText={setNoteText}
                        addNote={addNote}
                    />
                ) : (
                    <Homepage notes={notes} />
                )}
            </div>
        </div>
    );
}

export default App;
