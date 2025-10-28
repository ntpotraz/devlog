import { useState, useEffect } from "react";

import "./App.css";
import CreateEntry from "./CreateEntry";
import Homepage from "./Homepage";
import {
  createEntry,
  type Entry,
  sendDeleteEntry,
  getUserEntries,
  USER,
} from "./utils";

function App() {
  const [newEntry, setNewEntry] = useState<boolean>(false);
  const [entryText, setEntryText] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const saveEntries = await getUserEntries(USER);
      setEntries(saveEntries);
    };
    fetchEntries();
  }, []);

  function addEntry() {
    if (entryText === "") {
      setNewEntry(false);
      return;
    }
    const entry = createEntry(entryText);
    setEntries([entry, ...entries]);
    setEntryText("");
    setNewEntry(false);
  }

  function deleteEntry(entry: Entry) {
    if (!confirm("Delete entry?")) {
      return;
    }
    setEntries(entries.filter((item) => item !== entry));
    sendDeleteEntry(entry);
  }

  return (
    <div className="h-screen flex flex-col font-sans">
      <h1 className="devFont text-orange-500 text-9xl text-center my-8">
        devlog
      </h1>
      <div className="flex jusify-center gap-4">
        <button
          type="button"
          className="flex-1 devFont text-orange-500 text-2xl border border-orange-500 rounded-lg px-8 py-4 hover:bg-orange-500 hover:text-gray-800 transition-all duration-200 ease-in-out"
          onClick={() => setNewEntry(!newEntry)}
        >
          {newEntry ? "close" : "new entry"}
        </button>
      </div>
      <div className="mt-8">
        {newEntry ? (
          <CreateEntry
            entryText={entryText}
            setEntryText={setEntryText}
            addEntry={addEntry}
          />
        ) : (
          <Homepage entries={entries} deleteEntry={deleteEntry} />
        )}
      </div>
    </div>
  );
}

export default App;
