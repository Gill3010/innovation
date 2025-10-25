'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/scientific';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      // Por ahora, crear un usuario de demostración
      const demoUser: User = {
        id: 'demo-user-123',
        email: 'demo@research.com',
        name: 'Demo Researcher',
        affiliation: 'Research University',
        researchInterests: ['AI', 'Machine Learning', 'Data Science'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(demoUser);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simular login
    setTimeout(() => {
      const demoUser: User = {
        id: 'demo-user-123',
        email,
        name: 'Demo Researcher',
        affiliation: 'Research University',
        researchInterests: ['AI', 'Machine Learning', 'Data Science'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUser(demoUser);
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  const createUser = async (userData: Partial<User>) => {
    // Implementar creación de usuario
    console.log('Creating user:', userData);
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    createUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

