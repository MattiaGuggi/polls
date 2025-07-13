'use client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = (loggedUser) => {
    setUser(loggedUser);
    setIsAuthenticated(true);
  }
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  }
  const signup = () => router.push('/login');

  return (
    <UserContext.Provider value={{ isAuthenticated, login, logout, signup, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
