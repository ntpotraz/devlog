import { useState } from "react";

import "./App.css";
import Homepage from "./Homepage";
import CreateNote from "./CreateNote";

function App() {
  const [newNote, setNewNote] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);

  type Note = {
    body: string;
    time: Date;
  };

  function addNote() {
    const note: Note = { body: noteText, time: new Date() };

    setNotes([...notes, note]);
    setNoteText("");
    setNewNote(false);
  }

  return (
    <div className="bg-blue-400 h-full flex flex-col">
      <h1 className="heroText text-orange-600 text-9xl font-extralight">
        DevLog
      </h1>
      <button
        type="button"
        className="text-red-200 text-2xl border-1 rounded-4xl mx-5 py-7 hover:brightness-115 hover:scale-101 hover:transition-all duration-200 ease-in-out"
        onClick={() => setNewNote(!newNote)}
      >
        {newNote ? "close" : "new note"}
      </button>
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
  );
}

export default App;
