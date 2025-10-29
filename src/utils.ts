export type Entry = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export async function createEntry(entryText: string, token: string) {
  const cleanedText = cleanText(entryText);

  const entry = {
    body: cleanedText,
  };

  const entryFromServer = await sendEntry(entry, token);
  return entryFromServer;
}

function cleanText(text: string) {
  text = text.replaceAll(/\n\n+/g, "\n");

  return text;
}

async function sendEntry(body: { body: string }, token: string) {
  try {
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(`Failed to create entry: ${data}`);
    }
    const savedEntry: Entry = await res.json();
    return savedEntry;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`sendEntry failed: ${error.message}`);
    }
    throw error;
  }
}

export async function sendDeleteEntry(id: string, token: string) {
  try {
    const res = await fetch("/api/entries", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: id }),
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

export async function getUserEntries(token: string) {
  try {
    const res = await fetch("/api/entries", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(`Failed to fetch user entries: ${data}`);
    }
    const data: Entry[] = await res.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
    return [] as Entry[];
  }
}
