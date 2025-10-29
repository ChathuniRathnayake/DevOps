const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://mongo:27017/notesapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", UserSchema);

// Note schema
const NoteSchema = new mongoose.Schema({
  text: String,
  userId: mongoose.Schema.Types.ObjectId,
});
const Note = mongoose.model("Note", NoteSchema);

// Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, password: hashed });
    res.json(user);
  } catch {
    res.status(400).json({ message: "User already exists" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid password" });

  res.json({ message: "Login successful" });
});
/*
// Get all notes
app.get("/api/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Add a note
app.post("/api/notes", async (req, res) => {
  const { text, userId } = req.body; // optionally include userId
  const note = await Note.create({ text, userId });
  res.json(note);
});
*/
// Test route
app.get("/", (req, res) => {
  res.send("Backend is connected and running!");
});

// Start server
app.listen(4000, () => console.log("Backend running on port 4000"));