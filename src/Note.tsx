import "./Note.css";
import Markdown from "react-markdown";

type NoteProps = {
  body: string;
  time: Date;
};

function Note({ body, time }: NoteProps) {
  return (
    <li className="py-2">
      <p className="pr-4 text-sm text-gray-500 text-right">
        {time.toLocaleString()}
      </p>
      <div className="log text-left p-4 bg-gray-600 rounded-2xl">
        <Markdown>{body}</Markdown>
      </div>
    </li>
  );
}

export default Note;
