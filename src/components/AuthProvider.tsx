import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../lib/api';

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  signOut: () => void;
  isAdmin: (user: any) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setProfile(parsed);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const data = await authService.login(credentials);
      
      // Validate response data
      if (typeof data !== 'object' || !data || !data.token) {
        console.error('Invalid auth response data:', data);
        throw new Error('Некорректный ответ от сервера аутентификации');
      }

      setUser(data);
      setProfile(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error: any) {
      console.error("Auth error", error);
      const message = error.response?.data?.error || error.message || "Ошибка авторизации";
      alert(`${message}. Проверьте соединение с сервером.`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = (u: any) => {
    if (!u) return false;
    const email = u.email || u.emailAddress; // Support different formats
    return u.roles?.includes('ROLE_ADMIN') || 
           email?.toLowerCase().trim() === 'vovkin06@gmail.com';
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logout, signOut: logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
