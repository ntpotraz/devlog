import type { Entry } from "./utils";
import "./EntryItem.css";
import Markdown from "react-markdown";

type EntryProps = {
  entry: Entry;
  deleteEntry: (entry: Entry) => void;
};

function EntryItem({ entry, deleteEntry }: EntryProps) {
  const date = new Date(entry.createdAt);
  const hasUpdated = entry.createdAt !== entry.updatedAt;
  const dateFormat = `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
  const updatedDate = new Date(entry.updatedAt);
  const updatedDateFormat = `${updatedDate.toLocaleDateString()}, ${updatedDate.toLocaleTimeString()}`;


  return (
    <li className="group rounded-2xl border border-orange-400/25 bg-[#111217]/85 px-6 py-6 shadow-[inset_0_1px_0_rgba(255,124,45,0.08)] transition hover:border-orange-300/40 hover:shadow-[0_0_35px_rgba(255,124,45,0.15)]">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="devFont text-[11px] tracking-[0.45em] text-orange-200/80">
            {dateFormat}
          {hasUpdated && (
            <>
            <br />
            <em className="devFont text-[11px] tracking-[0.45em] text-orange-200/80">
              edited {updatedDateFormat}
            </em>
            </>
          )}
          </p>
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
        <div className="log text-left text-sm leading-relaxed text-orange-50/90">
          <Markdown>{entry.body}</Markdown>
        </div>
      </div>
    </li>
  );
}

export default EntryItem;
