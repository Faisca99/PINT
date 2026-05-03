"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "consultant" | "talent_manager" | "service_line_leader" | "admin";

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  area: string | null;
  serviceLine: string | null;
  accessToken: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  consultant: "Consultor",
  talent_manager: "Talent Manager",
  service_line_leader: "Service Line Leader",
  admin: "Administrador",
};

const STORAGE_KEY = "pint_auth";

interface UserContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  login: (userData: CurrentUser) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const login = (userData: CurrentUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  if (!ready) return null;

  return (
    <UserContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
