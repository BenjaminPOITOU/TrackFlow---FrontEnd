import { createContext, useContext } from "react";
import React from "react";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 
  const mockUser = { 
    id: 1, 
    name: "Mock User", 
    email: "mock@example.com",

  };


  return (
    <AuthContext.Provider value={mockUser}>
      {children} 
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {

    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context; 
}