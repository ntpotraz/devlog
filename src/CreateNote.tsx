import { useId } from "react";

type CreateNoteProps = {
  noteText: string;
  setNoteText: (text: string) => void;
  addNote: () => void;
}

function CreateNote({ noteText, setNoteText, addNote }: CreateNoteProps) {
  return (
    <>
      <textarea
        value={noteText}
        onChange={(event) => setNoteText(event.target.value)}
        className="text-black bg-white mt-5 resize-none outline-0 grow"
        name="noteText"
        id={useId()}
        placeholder="New Note"
      />
      <button className="bg-blue-300 p-3" type="submit" onClick={addNote}>
        Create Note
      </button>
    </>
  );
}

export default CreateNote;
