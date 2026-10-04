import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { USERS, DEMO_CREDENTIALS } from '../data/demo';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem('fcmp_user') || localStorage.getItem('fcmp_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      sessionStorage.removeItem('fcmp_user');
      localStorage.removeItem('fcmp_user');
      return null;
    }
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const expectedPassword = DEMO_CREDENTIALS[email];
    if (!expectedPassword || expectedPassword !== password) return false;
    const user = USERS.find(u => u.email === email);
    if (!user) return false;
    setCurrentUser(user);
    sessionStorage.setItem('fcmp_user', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('fcmp_user');
    localStorage.removeItem('fcmp_user');
  };

  const isRole = (...roles: UserRole[]) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
