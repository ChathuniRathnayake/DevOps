const Note = require("../models/Note");

// Get all notes for a user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// Get a single note
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch {
    res.status(500).json({ message: "Error retrieving note" });
  }
};

// Create new note
exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({ text: req.body.text, userId: req.user.id });
    res.status(201).json(note);
  } catch {
    res.status(500).json({ message: "Failed to create note" });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { text: req.body.text },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch {
    res.status(500).json({ message: "Failed to update note" });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete note" });
  }
};
