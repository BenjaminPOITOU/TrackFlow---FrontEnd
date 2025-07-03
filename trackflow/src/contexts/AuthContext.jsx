"use client";

import React, { createContext, useContext, useMemo } from "react";

const AuthContext = createContext(undefined);

/**
 * Provides authentication context to its children components.
 * It receives the initial user data from a server component parent.
 * @param {object} props
 * @param {React.ReactNode} props.children The child components to be wrapped by the provider.
 * @param {object | null} props.user The initial user object or null, passed from the server.
 */
export function AuthProvider({ children, user: initialUser }) {
  
  const contextValue = useMemo(() => ({
    user: initialUser,
    isAuthenticated: !!initialUser,
  }), [initialUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access the authentication context.
 * @returns {{user: object|null, isAuthenticated: boolean}} The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}