'use client';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';
import Loading from '../loading';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const storedUser = localStorage.getItem('user');
      if (storedAuth === 'true' && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } else {
        setIsAuthenticated(false);
        setUser(null);
        if (router && router.push) router.push('/login');
      }
      setLoading(false);
    }
  }, [router]);

  const login = (loggedUser) => {
    setUser(loggedUser);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(loggedUser));
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    }
    if (router && router.push) router.push('/login');
  };

  const signup = () => router.push('/login');

  if (loading) return <Loading />;

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
