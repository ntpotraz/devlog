import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom";
import Devlog from "./Devlog";
import { type Entry, getPublicEntry } from "./utils";

function EntryView() {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid entry ID");
      setLoading(false);
      return;
    }

    const fetchEntry = async () => {
      try {
        const fetchedEntry = await getPublicEntry(id);
        if (fetchedEntry === null) {
          setError("Entry not found");
        } else {
          setEntry(fetchedEntry);
        }
      } catch (err) {
        setError("Failed to load entry");
        console.error("Error fetching entry:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050607] text-[#f6eadc]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,138,64,0.16),transparent_60%)] opacity-75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(17,13,11,0.92),transparent_78%)]" />
          <div className="absolute inset-0 mix-blend-screen opacity-45 bg-[linear-gradient(118deg,rgba(255,122,24,0.1),transparent_66%)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,122,24,0.05)_0px,rgba(255,122,24,0.05)_1px,transparent_1px,transparent_5px)] opacity-25" />
        </div>
        <header className="relative z-10 flex justify-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="w-full max-w-5xl">
            <div className="flex items-center justify-center py-20">
              <p className="devFont text-sm tracking-[0.45em] text-orange-200/80">
                loading...
              </p>
            </div>
          </div>
        </header>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050607] text-[#f6eadc]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,138,64,0.16),transparent_60%)] opacity-75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(17,13,11,0.92),transparent_78%)]" />
          <div className="absolute inset-0 mix-blend-screen opacity-45 bg-[linear-gradient(118deg,rgba(255,122,24,0.1),transparent_66%)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,122,24,0.05)_0px,rgba(255,122,24,0.05)_1px,transparent_1px,transparent_5px)] opacity-25" />
        </div>
        <header className="relative z-10 flex justify-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="w-full max-w-5xl">
            <div className="flex items-center justify-center py-20">
              <p className="devFont text-sm tracking-[0.45em] text-orange-200/80">
                {error || "Entry not found"}
              </p>
            </div>
          </div>
        </header>
      </div>
    );
  }

  const date = new Date(entry.createdAt);
  const hasUpdated = entry.createdAt !== entry.updatedAt;
  const dateFormat = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  const updatedDate = new Date(entry.updatedAt);
  const updatedDateFormat = `${updatedDate.toLocaleDateString()}, ${updatedDate.toLocaleTimeString()}`;
  const isDeleted = entry.isDeleted === 1;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050607] text-[#f6eadc]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,138,64,0.16),transparent_60%)] opacity-75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(17,13,11,0.92),transparent_78%)]" />
        <div className="absolute inset-0 mix-blend-screen opacity-45 bg-[linear-gradient(118deg,rgba(255,122,24,0.1),transparent_66%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,122,24,0.05)_0px,rgba(255,122,24,0.05)_1px,transparent_1px,transparent_5px)] opacity-25" />
      </div>
      <header className="relative z-10 flex justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl space-y-12">
          <section className="relative overflow-hidden rounded-[30px] border border-orange-400/35 bg-[#0d0e12]/95 shadow-[0_28px_120px_rgba(0,0,0,0.78)]">
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
              </header>

              <main className="min-w-0">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <p className="devFont text-[0.8rem] tracking-[0.4em] text-orange-300/70">
                    entry
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-400/25 bg-[#111217]/85 px-2 py-2 md:px-6 md:py-6 shadow-[inset_0_1px_0_rgba(255,124,45,0.08)]">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex flex-col gap-2">
                        {isDeleted ? (
                          <p className="devFont select-none text-[11px] tracking-[0.45em] text-orange-200/80">
                            deleted on {updatedDateFormat}
                          </p>
                        ) : (
                          <p className="devFont select-none text-[11px] tracking-[0.45em] text-orange-200/80">
                            {dateFormat}
                          </p>
                        )}
                        {hasUpdated && !isDeleted && (
                          <em className="devFont hidden sm:block text-[11px] tracking-[0.45em] text-orange-200/80">
                            edited {updatedDateFormat}
                          </em>
                        )}
                      </div>
                    </div>
                    <div className="log text-left text-sm leading-relaxed text-orange-50/90">
                      <Markdown>{entry.body}</Markdown>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </section>
        </div>
      </header>
    </div>
  );
}

export default EntryView;
