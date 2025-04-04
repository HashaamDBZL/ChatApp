import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const navigate = useNavigate();

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    navigate("/"); // Redirect to home/chat after login
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const value: AuthContextType = {
    token,
    isLoggedIn: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
