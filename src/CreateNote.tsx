import { useId, useLayoutEffect, useRef } from "react";

type CreateNoteProps = {
  noteText: string;
  setNoteText: (text: string) => void;
  addNote: () => void;
};

function CreateNote({ noteText, setNoteText, addNote }: CreateNoteProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the `scrollHeight` of the textarea depends on `noteText`
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [noteText]);

  return (
    <div className="flex flex-col items-stretch flex-grow">
      <textarea
        ref={textareaRef}
        value={noteText}
        onChange={(event) => setNoteText(event.target.value)}
        className="bg-gray-700 text-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-orange-500 p-4"
        name="noteText"
        id={useId()}
        placeholder="New Note"
        rows={1}
      />
      <button
        className="devFont text-orange-500 w-1/2 m-auto text-xl border border-orange-500 rounded-lg my-4 px-8 py-3 hover:bg-orange-500 hover:text-gray-800 transition-all duration-200 ease-in-out"
        type="submit"
        onClick={addNote}
      >
        create note
      </button>
    </div>
  );
}

export default CreateNote;
