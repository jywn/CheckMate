import React, { useState } from "react";

function Note({ note, onDelete, onUpdate, onDragEnd }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);

  const handleSave = () => {
    onUpdate(note.id, editedText);
    setIsEditing(false);
  };

  const handleDragEnd = (e) => {
    const x = e.clientX - e.target.offsetWidth / 2;
    const y = e.clientY - e.target.offsetHeight;
    onDragEnd(note.id, x, y);
  };

  return (
<div className="note-main-container">    
  <div
      className="note"
      style={{
        left: `${note.x}px`,
        top: `${note.y}px`,
        width: "200px",
        minHeight: "150px",
      }}
      draggable="true"
      //onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {isEditing ? (
        <>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          
          />
          <div className="note-actions done-btn">
            <button onClick={handleSave}>✅</button>
          </div>
        </>
      ) : (
        <>
          <p>{note.text}</p>
          <div className="note-actions">
            <button onClick={() => setIsEditing(true)}>✏️</button>
            <button onClick={() => onDelete(note.id)}>🗑️</button>
          </div>
        </>
      )}
    </div></div>  );
}

export default Note;
