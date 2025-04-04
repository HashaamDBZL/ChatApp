import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Signup({ onAuthSuccess }) {
  // Receive onAuthSuccess from App
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data && data.error) {
          setError(data.error);
        } else {
          setError("Signup failed");
        }
      } else {
        console.log("Signup successful:", data);
        if (data && data.token) {
          onAuthSuccess(data.token); // Pass token to App
          navigate("/");
        } else {
          setError("Signup successful, but no token received.");
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
