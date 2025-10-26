import NoteItem from "./NoteItem";

import { type Note } from "./utils";

type HomepageProps = {
  notes: Note[];
};

function Homepage({ notes }: HomepageProps) {
  return (
    <div className="flex flex-col items-center">
      {notes.length === 0 ? (
        <p className="text-gray-400">No notes available</p>
      ) : (
        <ul className="w-full">
          {notes.map((note) => (
            <NoteItem key={note.createdAt.getMilliseconds()} note={note} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Homepage;
