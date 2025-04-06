import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  userId: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );

  const navigate = useNavigate();

  const login = (newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId);
    navigate("/"); // Redirect to home/chat after login
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const value: AuthContextType = {
    token,
    isLoggedIn: !!token,
    login,
    logout,
    userId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
