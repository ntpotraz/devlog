import type { Entry } from "./utils";
import "./EntryItem.css";
import Markdown from "react-markdown";

type EntryProps = {
  entry: Entry;
  deleteEntry: (entry: Entry) => void;
  onEdit: (entry: Entry) => void;
  onCopyURL: (id: string) => void;
};

function EntryItem({ entry, deleteEntry, onEdit, onCopyURL }: EntryProps) {
  const date = new Date(entry.createdAt);
  const hasUpdated = entry.createdAt !== entry.updatedAt;
  const dateFormat = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  const updatedDate = new Date(entry.updatedAt);
  const updatedDateFormat = `${updatedDate.toLocaleDateString()}, ${updatedDate.toLocaleTimeString()}`;

  return (
    <li className="group rounded-2xl border border-orange-400/25 bg-[#111217]/85 px-2 py-2 md:px-6 md:py-6 shadow-[inset_0_1px_0_rgba(255,124,45,0.08)] transition hover:border-orange-300/40 hover:shadow-[0_0_35px_rgba(255,124,45,0.15)]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="devFont select-none text-[11px] tracking-[0.45em] text-orange-200/80">
            {dateFormat}
            {hasUpdated && (
              <>
                <br />
                <em className="devFont hidden sm:block text-[11px] tracking-[0.45em] text-orange-200/80">
                  edited {updatedDateFormat}
                </em>
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="devFont inline-flex items-center gap-2 self-start rounded-md border border-orange-400/35 bg-transparent px-3 py-2 tracking-[0.45em] transition hover:border-purple-600 hover:bg-purple-700/10  focus:outline-none focus:ring-2 focus:ring-purple-400/45"
              onClick={() => onCopyURL(entry.id)}
            >
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <title>copy url</title>
                <path d="M20.56 3.34a1 1 0 0 0-1-.08l-17 8a1 1 0 0 0-.57.92a1 1 0 0 0 .6.9L8 15.45v6.72L13.84 18l4.76 2.08a.9.9 0 0 0 .4.09a1 1 0 0 0 .52-.15a1 1 0 0 0 .48-.79l1-15a1 1 0 0 0-.44-.89M18.1 17.68l-5.27-2.31L16 9.17l-7.65 4.25l-2.93-1.29l13.47-6.34Z" />
              </svg>
            </button>
            <button
              type="button"
              className="devFont inline-flex items-center gap-2 self-start rounded-md border border-orange-400/35 bg-transparent px-3 py-2 tracking-[0.45em] transition hover:border-blue-600 hover:bg-blue-700/10  focus:outline-none focus:ring-2 focus:ring-blue-400/45"
              onClick={() => onEdit(entry)}
            >
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <title>edit</title>
                <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z" />
              </svg>
            </button>
            <button
              type="button"
              className="devFont inline-flex items-center gap-2 self-start rounded-md border border-orange-400/35 bg-transparent px-3 py-2 tracking-[0.45em] transition hover:border-red-600 hover:bg-red-700/10  focus:outline-none focus:ring-2 focus:ring-red-400/45"
              onClick={() => deleteEntry(entry)}
            >
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <title>delete</title>
                <path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="log text-left text-sm leading-relaxed text-orange-50/90">
          <Markdown>{entry.body}</Markdown>
        </div>
      </div>
    </li>
  );
}

export default EntryItem;
