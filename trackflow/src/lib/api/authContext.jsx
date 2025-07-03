'use client';

import { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true, 
  login: async () => {},
  logout: () => {},
});

// 2. Créer le Provider (le fournisseur de données)
export function AuthProvider({ initialUser, initialToken, children }) {
  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(initialToken);
  const [isLoading, setIsLoading] = useState(!initialUser); 

  const login = async (loginData) => {

  };

  const logout = () => {
  
  };
  
  const value = { user, token, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Créer le hook personnalisé `useAuth`
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}