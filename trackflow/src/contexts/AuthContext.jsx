

import React, { createContext, useContext, useMemo } from "react"; 

const AuthContext = createContext(undefined); 
export function AuthProvider({ children }) {

  const mockUser = {
    id: 1,
    name: "Mock User",
    login: "dbowie@music.com"
  };


  const isLoading = false;
  const error = null; 


  const contextValue = useMemo(() => ({
    user: mockUser,  
    isLoading: isLoading, 
    error: error     
  }), [mockUser, isLoading, error]); 

  console.log("AuthProvider providing value:", contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log("useAuth hook returning:", context); 
  return context; 
}