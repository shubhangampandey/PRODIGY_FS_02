import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

interface Admin {
  email: string;
  name: string;
}

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin_session");
    const token = localStorage.getItem("auth_token");
    if (stored && token) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        localStorage.removeItem("admin_session");
        localStorage.removeItem("auth_token");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("admin_session", JSON.stringify(data.admin));
      setAdmin(data.admin);
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const data = await api.signup(name, email, password);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("admin_session", JSON.stringify(data.admin));
      setAdmin(data.admin);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin_session");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ admin, login, signup, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
