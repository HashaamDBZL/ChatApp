import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router";
import Login from "./components/login";
import Signup from "./components/signup";
import Chat from "./components/chat";
import { AuthProvider } from "./contexts/AuthContexts";
import "./App.css";
import socket from "./socket";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token")); // Initial check
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
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={token ? <Chat /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={<Login onAuthSuccess={handleAuthChange} />}
        />
        <Route
          path="/signup"
          element={<Signup onAuthSuccess={handleAuthChange} />}
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
