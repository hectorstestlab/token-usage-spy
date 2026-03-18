import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "planner" | "client" | "vendor" | null;

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  setUserName: (name: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState("Demo User");

  const logout = () => {
    setRole(null);
    setUserName("Demo User");
  };

  return (
    <UserContext.Provider value={{ role, setRole, userName, setUserName, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}
