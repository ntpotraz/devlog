const USER = "6c68d115-1dfb-42ec-8892-b9bd7beae26c";

export type Note = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  userID: `${string}-${string}-${string}-${string}-${string}`;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

export function createNote(noteText: string) {
  const cleanedText = cleanText(noteText);

  const note: Note = {
    id: crypto.randomUUID(),
    userID: USER,
    body: cleanedText,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  sendNote(note);

  return note;
}

function cleanText(text: string) {
  text = text.replaceAll(/\n\n+/g, "\n");

  return text;
}

async function sendNote(note: Note) {
  const jsonNote = JSON.stringify(note);
  console.log(`JSON Obj:\n${jsonNote}`);

  try {
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonNote,
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(`Failed to create entry: ${data}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(`Error: ${error.message}`);
    }
  }
}
