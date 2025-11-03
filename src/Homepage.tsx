import { UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { ToastContainer, toast, Zoom } from "react-toastify";
import Devlog from "./Devlog";
import EntryEditor from "./EntryEditor";
import Log from "./Log";
import {
  createEntry,
  type Entry,
  getUserEntries,
  sendDeleteEntry,
  updateEntry,
} from "./utils";

function Homepage() {
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
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

  async function handleSubmit() {
    if (entryText === "" || !editingEntryId) {
      setEditingEntryId(null);
      return;
    }
    const token = await getToken();
    if (!token) {
      return;
    }
    try {
      if (editingEntryId === "new") {
        const entry = await createEntry(entryText, token);
        setEntries([entry, ...entries]);
      } else {
        const entry = await updateEntry(editingEntryId, entryText, token);
        setEntries(
          entries.map((item) => (item.id === editingEntryId ? entry : item)),
        );
      }
      setEntryText("");
      setEditingEntryId(null);
    } catch (error) {
      console.error("Failed to handle submission:", error);
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

  function onEdit(entry: Entry) {
    setEditingEntryId(entry.id);
    setEntryText(entry.body);
  }

  function onCopyURL(id: string) {
    const url = `${window.location.origin}/entry/${id}`;
    navigator.clipboard.writeText(url);
    toast.info("url copied to clipboard", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      icon: false,
      theme: "dark",
      transition: Zoom,
    });
  }

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-orange-400/35 bg-[#0d0e12]/95 shadow-[0_28px_120px_rgba(0,0,0,0.78)]">
      <ToastContainer toastClassName="devFont text-[0.8rem] tracking-[0.4em] text-orange-300/70 border border-orange-400/30 rounded-lg p-2" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,124,45,0.16),transparent_66%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(255,122,24,0.08),transparent_60%)]" />
        <div className="absolute inset-x-8 top-0 h-[70px] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(255,124,45,0.35),transparent_75%)] opacity-70" />
        <div className="absolute inset-x-6 top-0 h-[3px] bg-linear-to-r from-transparent via-orange-400/80 to-transparent" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,122,24,0.08)_0px,rgba(255,122,24,0.08)_1px,transparent_1px,transparent_5px)] opacity-20" />
      </div>
      <div className="relative z-10 flex flex-col gap-12 px-4 py-6 pt-12 sm:px-6 lg:px-8">
        <header className="flex flex-row gap-6 justify-between">
          <div className="space-y-4">
            <Devlog className="justify-start" />
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden text-right sm:block">
              <p className="devFont text-[0.8rem]  tracking-[0.45em] text-orange-300/70">
                signed in as
              </p>
              <p className="font-mono text-left text-sm text-orange-100/90">
                {user?.primaryEmailAddress?.emailAddress ?? "connected user"}
              </p>
            </div>
            <UserButton
              appearance={{
                elements: {
                  userButtonPopoverCard:
                    "bg-[#141519] border border-orange-400/25 text-orange-100 shadow-[0_18px_70px_rgba(0,0,0,0.55)]",
                  userButtonPopoverActionButton: "hover:bg-orange-400/15",
                  userButtonPopoverFooter: "hidden",
                  userButtonPopoverHeader: "border-orange-400/25",
                  avatarBox: "border border-orange-400/40 rounded-lg",
                  userButtonTrigger:
                    "rounded-lg border border-orange-400/40 bg-transparent px-1 py-1 transition hover:bg-orange-400/10 focus:outline-none focus:ring-2 focus:ring-orange-400/50",
                },
              }}
            />
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,330px),1fr]">
          <aside className="space-y-8">
            <div className="flex flex-col gap-6 rounded-3xl border border-orange-400/30 bg-[#131418]/95 px-6 py-7 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]">
              <div className="flex items-center justify-between gap-4">
                <p className="devFont text-[0.8rem] tracking-[0.4em] text-orange-300/70">
                  {!editingEntryId
                    ? "compose entry"
                    : editingEntryId === "new"
                      ? "compose active"
                      : "edit active"}
                </p>
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-orange-400 shadow-[0_0_12px_rgba(255,124,45,0.8)]" />
              </div>
              {!editingEntryId ? (
                <>
                  <button
                    type="button"
                    className="devFont w-full rounded-xl border border-orange-400/40 bg-orange-400/10 px-6 py-3 text-xs tracking-[0.45em] text-orange-200 transition hover:border-orange-300/70 hover:bg-orange-400/20 hover:text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                    onClick={() => setEditingEntryId("new")}
                  >
                    new entry
                  </button>
                  <div className="space-y-4 font-mono text-xs text-orange-200/60">
                    <p className="tracking-[0.35em] text-orange-200/70">
                      activity feed
                    </p>
                    <p>last sync: {new Date().toLocaleTimeString()}</p>
                    <p>
                      total entries:{" "}
                      {entries.length.toString().padStart(2, "0")}
                    </p>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="devFont w-full rounded-xl border border-orange-400/40 bg-transparent px-6 py-3 text-xs tracking-[0.45em] text-orange-200 transition hover:border-orange-300/70 hover:bg-orange-400/10 hover:text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  onClick={() => {
                    if (editingEntryId !== "new") {
                      setEntryText("");
                    }
                    setEditingEntryId(null);
                  }}
                >
                  {editingEntryId === "new" ? "cancel compose" : "cancel edit"}
                </button>
              )}
            </div>
          </aside>

          <main className="min-w-0">
            <div className="flex flex-wrap items-center gap-4">
              <p className="devFont text-[0.8rem] tracking-[0.4em] text-orange-300/70">
                {!editingEntryId
                  ? "log history"
                  : editingEntryId === "new"
                    ? "compose entry"
                    : "edit entry"}
              </p>
            </div>

            <div className="flex flex-col rounded-2xl px-0 py-6">
              {editingEntryId ? (
                <div className="flex flex-1 flex-col overflow-y-auto pr-1">
                  <EntryEditor
                    key={editingEntryId}
                    entryText={entryText}
                    setEntryText={setEntryText}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                      setEntryText("");
                      setEditingEntryId(null);
                    }}
                    buttonText={
                      editingEntryId === "new" ? "create entry" : "commit edit"
                    }
                  />
                </div>
              ) : (
                <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                  <Log
                    entries={entries}
                    deleteEntry={deleteEntry}
                    onEdit={onEdit}
                    onCopyURL={onCopyURL}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

export default Homepage;
