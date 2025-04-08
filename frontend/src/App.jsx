import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router";
import Login from "./components/login";
import Signup from "./components/signup";
import Chat from "./components/chat";
import AuthCallback from "./components/AuthCallback";
import "./App.css";
import socket from "./socket";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [setToken] = useState(localStorage.getItem("token")); // Initial check
  socket.connect();

  const handleAuthChange = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
      Navigate("/");
    } else {
      localStorage.removeItem("token");
      Navigate("/login");
    }
  };

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Chat />} />
      </Route>
      <Route
        path="/login"
        element={<Login onAuthSuccess={handleAuthChange} />}
      />
      <Route
        path="/signup"
        element={<Signup onAuthSuccess={handleAuthChange} />}
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}

export default App;
