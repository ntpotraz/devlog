import "./NoteItem.css";

import { type Note } from "./utils";
import Markdown from "react-markdown";

type NoteProps = {
  note: Note;
};

function NoteItem({ note }: NoteProps) {
  return (
    <li className="py-2">
      <p className="pr-4 text-sm text-gray-500 text-right">
        {note.createdAt.toLocaleString()}
      </p>
      <div className="log text-left p-4 bg-gray-600 rounded-2xl">
        <Markdown>{note.body}</Markdown>
      </div>
    </li>
  );
}

export default NoteItem;
