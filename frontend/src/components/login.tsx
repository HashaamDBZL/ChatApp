import React, { useState } from "react";
import { useNavigate } from "react-router";
import SignInWithGoogle from "./signInWithGoogle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data && data.error) {
          setError(data.error);
        } else {
          setError("Login failed");
        }
      } else {
        console.log("Login successful:", data);
        if (data && data.token) {
          console.log("Navigating elsewhere");
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          navigate("/");
        } else {
          setError("Login successful, but no token received.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="placeholder:text-center"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="placeholder:text-center"
              />
            </div>
            <button
              type="submit"
              className="mt-12 border border-solid cursor-pointer rounded-2xl w-fit px-4"
            >
              Login
            </button>
          </div>
        </form>
        <h2 className="py-12">OR</h2>
        <SignInWithGoogle />
      </div>
    </div>
  );
}
