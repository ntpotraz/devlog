import EntryItem from "./EntryItem";

import type { Entry } from "./utils";

type LogProps = {
  entries: Entry[];
  deleteEntry: (entry: Entry) => void;
};

function Log({ entries, deleteEntry }: LogProps) {
  return (
    <div className="flex flex-col items-center">
      {entries.length === 0 ? (
        <p className="text-gray-400">no entries available</p>
      ) : (
        <ul className="w-full">
          {entries.map((entry) => (
            <EntryItem
              key={entry.createdAt}
              entry={entry}
              deleteEntry={deleteEntry}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Log;
