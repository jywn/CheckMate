import React, { useState, useEffect } from "react";
import Note from "./Note";

const DATABASE_NAME = "NotesAppDB";
const STORE_NAME = "notes";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // Open the database and ensure the store is set up
  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject("Error opening database");
      };
    });
  };

  // Fetch notes from IndexedDB
  const fetchNotes = async () => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event) => {
      setNotes(event.target.result.map(note => ({
        id: note.id,
        text: note.text,
        x: note.x || 20,
        y: note.y || 20,
      })));
    };

    request.onerror = () => {
      console.error("Error fetching notes");
    };
  };

  // Add a new note to IndexedDB
  const addNoteToDatabase = async (note) => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.add(note);
  };

  const addNote = async () => {
    if (newNote.trim() !== "") {
      const noteWidth = 200;
      const noteHeight = 150;
      const spacing = 20;

      // Calculate non-overlapping position
      let x = spacing;
      let y = spacing;
      while (
        notes.some(
          (note) =>
            Math.abs(note.x - x) < noteWidth + spacing &&
            Math.abs(note.y - y) < noteHeight + spacing
        )
      ) {
        x += noteWidth + spacing;
        if (x + noteWidth > window.innerWidth) {
          x = spacing;
          y += noteHeight + spacing;
        }
      }

      const newNoteData = { text: newNote, x, y };
      await addNoteToDatabase(newNoteData);
      setNotes([...notes, { ...newNoteData, id: Date.now() }]); // Simulate ID for UI
      setNewNote("");
    }
  };

  const deleteNoteFromDatabase = async (id) => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
  };

  const deleteNote = async (id) => {
    await deleteNoteFromDatabase(id);
    setNotes(notes.filter((note) => note.id !== id));
  };

  const updateNoteInDatabase = async (id, updatedText) => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(id);
    request.onsuccess = (event) => {
      const note = event.target.result;
      if (note) {
        note.text = updatedText;
        store.put(note);
      }
    };
  };

  const updateNote = async (id, updatedText) => {
    await updateNoteInDatabase(id, updatedText);
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, text: updatedText } : note
      )
    );
  };

  const updatePositionInDatabase = async (id, x, y) => {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.get(id);
    request.onsuccess = (event) => {
      const note = event.target.result;
      if (note) {
        note.x = x;
        note.y = y;
        store.put(note);
      }
    };
  };

  const updatePosition = async (id, x, y) => {
    await updatePositionInDatabase(id, x, y);
    setNotes(notes.map((note) => (note.id === id ? { ...note, x, y } : note)));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="">
      <div className="header-input-container">
        <h1>Notes</h1>
        <div className="note-input">
          <textarea
            placeholder="Write a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
          />
        </div>
      </div>
      <div className="notes-container">
        {notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            onDelete={deleteNote}
            onUpdate={updateNote}
            onDragEnd={updatePosition}
          />
        ))}
      </div>
    </div>
  );
}

export default Notes;
