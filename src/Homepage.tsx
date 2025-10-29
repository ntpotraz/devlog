import { UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

import "./Homepage.css";
import CreateEntry from "./CreateEntry";
import Log from "./Log";
import {
  createEntry,
  type Entry,
  getUserEntries,
  sendDeleteEntry,
} from "./utils";

function Homepage() {
  const [newEntry, setNewEntry] = useState<boolean>(false);
  const [entryText, setEntryText] = useState<string>("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    const fetchEntries = async () => {
      if (user) {
        const token = await getToken();
        if (!token) {
          console.error("No token found");
          return;
        }
        const saveEntries = await getUserEntries(token);
        setEntries(saveEntries);
      } else {
        setEntries([]);
      }
    };
    fetchEntries();
  }, [isLoaded, user, getToken]);

  async function addEntry() {
    if (entryText === "") {
      setNewEntry(false);
      return;
    }
    const token = await getToken();
    if (!token) {
      console.error("Not authenticated");
      return;
    }
    try {
      const entry = await createEntry(entryText, token);
      setEntries([entry, ...entries]);
      setEntryText("");
      setNewEntry(false);
    } catch (error) {
      console.error("Failed to create entry:", error);
    }
  }

  async function deleteEntry(entry: Entry) {
    if (!confirm("Delete entry?")) {
      return;
    }
    const originalEntries = entries;
    setEntries(entries.filter((item) => item.id !== entry.id));

    const token = await getToken();
    if (!token) {
      console.error("Not authentication");
      setEntries(originalEntries);
      return;
    }

    try {
      await sendDeleteEntry(entry.id, token);
    } catch (error) {
      console.error("Failed to delete:", error);
      setEntries(originalEntries);
    }
  }

  return (
    <div className="h-screen flex flex-col font-sans">
      <h1 className="devFont text-orange-500 text-9xl text-center my-8">
        devlog
      </h1>
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>
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
          <Log entries={entries} deleteEntry={deleteEntry} />
        )}
      </div>
    </div>
  );
}

export default Homepage;
