import EntryItem from "./EntryItem";

import type { Entry } from "./utils";

type LogProps = {
  entries: Entry[];
  deleteEntry: (entry: Entry) => void;
};

function Log({ entries, deleteEntry }: LogProps) {
  return (
    <div className="flex flex-col gap-6">
      {entries.length === 0 ? (
        <p className="devFont text-xs uppercase tracking-[0.4em] text-orange-200/70">
          nothing logged yet
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {entries.map((entry) => (
            <EntryItem key={entry.id} entry={entry} deleteEntry={deleteEntry} />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Log;
