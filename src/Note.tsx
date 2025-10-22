import "./Note.css";

type NoteProps = {
  body: string;
  time: Date;
};

function Note({ body, time }: NoteProps) {
  return (
    <li className="py-2">
      <p className="pr-4 text-sm text-gray-500 text-right">{time.toLocaleString()}</p>
      <div
        className="log text-left p-4 bg-gray-600 rounded-2xl"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Escape characters are handled
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </li>
  );
}

export default Note;
