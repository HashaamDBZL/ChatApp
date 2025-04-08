import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoggedIn: false,
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

  const value: AuthContextType = {
    token,
    isLoggedIn: !!token,
    userId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
