import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Notes.css";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Load notes
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:4000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotes(res.data))
      .catch(() => alert("Failed to load notes"));
  }, [token]);

  // Add note
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/notes",
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([...notes, res.data]);
      setText("");
    } catch {
      alert("Failed to add note");
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch {
      alert("Failed to delete note");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>Your Notes</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <form onSubmit={handleAdd} className="add-note-form">
        <input
          type="text"
          placeholder="Write a note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note._id} className="note-item">
            <span>{note.text}</span>
            <div className="note-actions">
              <Link to={`/edit/${note._id}`} className="edit-btn">
                Edit
              </Link>
              <button
                onClick={() => handleDelete(note._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;
