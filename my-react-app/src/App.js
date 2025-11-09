import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Notes from "./components/Notes";
import EditNote from "./components/EditNote";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/edit/:id" element={<EditNote />} />
    </Routes>
  );
}

export default App;
