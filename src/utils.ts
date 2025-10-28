export const USER = "6c68d115-1dfb-42ec-8892-b9bd7beae26c";
type uuid = `${string}-${string}-${string}-${string}-${string}`;

export type Entry = {
  id: uuid;
  userID: uuid;
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

export async function getUserEntries(userID: uuid) {
  try {
    const res = await fetch(`/api/users/${userID}`, {
      method: "GET",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(`Failed to fetch user entries: ${data}`);
    }
    type response = {
      id: uuid;
      userID: uuid;
      body: string;
      createdAt: string;
      updatedAt: string;
      isDeleted: boolean;
    };
    const data: response[] = await res.json();

    const entries: Entry[] = [];
    for (const value of data) {
      entries.push({
        id: value.id,
        userID: value.userID,
        body: value.body,
        createdAt: new Date(value.createdAt),
        updatedAt: new Date(value.updatedAt),
        isDeleted: value.isDeleted,
      });
    }
    return entries;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
    return [] as Entry[];
  }
}
