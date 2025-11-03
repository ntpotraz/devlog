export type Entry = {
  id: string;
  userID: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: 0 | 1;
};

export async function createEntry(entryText: string, token: string) {
  const entry = {
    body: entryText,
  };

  const entryFromServer = await sendEntry(entry, token);
  return entryFromServer;
}

export async function updateEntry(
  entryId: string,
  entryText: string,
  token: string,
) {
  const entry = {
    id: entryId,
    body: entryText,
  };

  try {
    const res = await fetch(`/api/entries/${entry.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entry),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(`Failed to update entry: ${data}`);
    }
    const updatedEntry: Entry = await res.json();
    return updatedEntry;
  } catch (error) {
    if (error instanceof Error) {
    }
    throw error;
  }
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

export async function getPublicEntry(id: string): Promise<Entry | null> {
  try {
    const res = await fetch(`/api/entries/${id}`, {
      method: "GET",
    });
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      const data = await res.json();
      throw new Error(`Failed to fetch entry: ${data}`);
    }
    const entry: Entry = await res.json();
    return entry;
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
    return null;
  }
}
