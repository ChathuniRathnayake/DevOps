import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditNote.css";

function EditNote() {
  const { id } = useParams(); // get note id from URL
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch the note to edit
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setText(res.data.text))
      .catch(() => alert("Failed to load note"));
  }, [id, token]);

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/notes/${id}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Note updated successfully!");
      navigate("/notes");
    } catch {
      alert("Failed to update note");
    }
  };

  return (
    <div className="edit-note-container">
      <h2>Edit Note</h2>
      <form onSubmit={handleUpdate} className="edit-note-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <button type="submit">Update Note</button>
      </form>
    </div>
  );
}

export default EditNote;
