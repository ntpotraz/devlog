const USER = "6c68d115-1dfb-42ec-8892-b9bd7beae26c";

export type Entry = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  userID: `${string}-${string}-${string}-${string}-${string}`;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

export function createEntry(entryText: string) {
  const cleanedText = cleanText(entryText);

  const entry: Entry = {
    id: crypto.randomUUID(),
    userID: USER,
    body: cleanedText,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  sendEntry(entry);

  return entry;
}

function cleanText(text: string) {
  text = text.replaceAll(/\n\n+/g, "\n");

  return text;
}

async function sendEntry(entry: Entry) {
  const jsonEntry = JSON.stringify(entry);
  console.log(`JSON Obj:\n${jsonEntry}`);

  try {
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonEntry,
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(`Failed to create entry: ${data}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

export async function sendDeleteEntry(entry: Entry) {
  const entryID = JSON.stringify(entry);
  console.log(entryID);

  try {
    const res = await fetch("/api/entries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: entryID,
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(`Failed to delete entry: ${data}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
  }
}
