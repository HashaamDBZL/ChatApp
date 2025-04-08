import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      navigate("/chat");
    } else {
      console.error("Authentication failed: Missing token or userId");
      navigate("/login");
    }
  }, [token, userId, navigate]);

  return <div>Authenticating...</div>;
}

export default AuthCallback;
