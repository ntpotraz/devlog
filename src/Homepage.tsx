import NoteItem from "./EntryItem";

import type { Entry } from "./utils";

type HomepageProps = {
  entries: Entry[];
  deleteEntry: (note: Entry) => void;
};

function Homepage({ entries: notes, deleteEntry }: HomepageProps) {
  return (
    <div className="flex flex-col items-center">
      {notes.length === 0 ? (
        <p className="text-gray-400">no entries available</p>
      ) : (
        <ul className="w-full">
          {notes.map((note) => (
            <NoteItem
              key={note.createdAt.getMilliseconds()}
              entry={note}
              deleteEntry={deleteEntry}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Homepage;
