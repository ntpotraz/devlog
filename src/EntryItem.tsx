import type { Entry } from "./utils";
import "./EntryItem.css";
import Markdown from "react-markdown";

type EntryProps = {
  entry: Entry;
  deleteEntry: (entry: Entry) => void;
};

function EntryItem({ entry, deleteEntry }: EntryProps) {
  return (
    <li className="py-2">
      <div className="flex items-center px-4 my-1 place-content-between">
        <p className="pr-4 text-sm text-gray-500 text-right">
          {entry.createdAt.toLocaleString()}
        </p>
        <button
          type="button"
          className="text-red-600 hover:text-red-300 hover:bg-gray-700 p-1 flex items-center justify-center rounded-4xl transition-all duration-100 ease-in-out"
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
      <div className="log text-left p-4 bg-gray-600 rounded-2xl">
        <Markdown>{entry.body}</Markdown>
      </div>
    </li>
  );
}

export default EntryItem;
