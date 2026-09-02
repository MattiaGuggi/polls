'use client';

import { useRouter, usePathname } from 'next/navigation';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Loading from '../loading';
import { userType } from '@/lib/types';

interface IUserContext {
  isAuthenticated: boolean;
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  login: (loggedUser: userType) => void;
  logout: () => void;
  signup: () => void;
  loading: boolean;
}

const APP_PREFIX = 'polls_';
const AUTH_KEY = `${APP_PREFIX}isAuthenticated`;
const USER_KEY = `${APP_PREFIX}user`;

const UserContext = createContext<IUserContext | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  const clearAuth = () => {
    setIsAuthenticated(false);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  const login = (loggedUser: userType) => {
    setUser(loggedUser);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(USER_KEY, JSON.stringify(loggedUser));
    }
  };

  const signup = () => {
    router.push('/signup');
  };

  // 1. Restore & Verify Session on Mount
  useEffect(() => {
    const verifyAndRestoreSession = async () => {
      if (typeof window === 'undefined') return;

      const storedAuth = localStorage.getItem(AUTH_KEY);
      const storedUserRaw = localStorage.getItem(USER_KEY);

      if (storedAuth === 'true' && storedUserRaw) {
        try {
          const parsedUser: userType = JSON.parse(storedUserRaw);

          if (parsedUser?._id) {
            // Restore immediately from localStorage
            setUser(parsedUser);
            setIsAuthenticated(true);

            // Optional DB verification check
            try {
              const response = await axios.get('/api/user', {
                params: { userId: parsedUser._id },
              });

              if (response.data?.user) {
                setUser(response.data.user);
                localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
              }
            } catch (apiErr: any) {
              // Only log out if backend explicitly confirms user no longer exists (401 Unauthorized)
              if (apiErr.response?.status === 401) {
                clearAuth();
              }
            }
          } else {
            clearAuth();
          }
        } catch (error) {
          console.error('Failed to parse user from localStorage:', error);
          clearAuth();
        }
      } else {
        clearAuth();
      }

      setLoading(false);
    };

    verifyAndRestoreSession();
  }, []);

  // 2. Client-Side Route Protection (Replaces middleware for localStorage)
  useEffect(() => {
    if (loading) return;

    const isPublicRoute = pathname === '/login' || pathname === '/signup';

    if (!isAuthenticated && !isPublicRoute) {
      router.push('/login');
    } else if (isAuthenticated && isPublicRoute) {
      router.push('/');
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) return <Loading />;

  return (
    <UserContext.Provider value={{ isAuthenticated, user, setUser, login, logout, signup, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};