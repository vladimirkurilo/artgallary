import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../lib/api';

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  signOut: () => void;
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
      setUser(data);
      setProfile(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error("Auth error", error);
      alert("Ошибка авторизации. Проверьте запуск Backend сервера.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logout, signOut: logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
