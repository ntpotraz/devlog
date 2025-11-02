import { useId, useLayoutEffect, useRef } from "react";

type EntryEditorProps = {
  entryText: string;
  setEntryText: (text: string) => void;
  onSubmit: () => void;
  buttonText: string;
};

function EntryEditor({
  entryText,
  setEntryText,
  onSubmit,
  buttonText,
}: EntryEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the `scrollHeight` of the textarea depends on `entryText`
  useLayoutEffect(() => {
    if (!textareaRef.current) {
      return;
    }
    const element = textareaRef.current;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
    element.scrollTop = element.scrollHeight;
  }, [entryText]);

  return (
    <div className="flex flex-col items-stretch gap-6">
      <textarea
        ref={textareaRef}
        value={entryText}
        onChange={(event) => setEntryText(event.target.value)}
        className="min-h-[140px] resize-none overflow-hidden rounded-2xl border border-orange-400/30 bg-[#08090d] px-5 py-5 font-mono text-sm text-orange-100 shadow-inner shadow-black/50 placeholder:text-orange-300/35 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400/35"
        name="entryText"
        id={useId()}
        placeholder="new entry"
        rows={1}
      />
      <button
        className="devFont self-end rounded-lg border border-orange-400/40 bg-orange-400/10 px-6 py-3 text-xs tracking-[0.45em] text-orange-200 transition hover:border-orange-300/70 hover:bg-orange-400/20 hover:text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
        type="submit"
        onClick={onSubmit}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default EntryEditor;
