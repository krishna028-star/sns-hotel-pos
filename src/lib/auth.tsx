'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS, ROLE_HOMES } from '@/lib/mockData';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  tenant: string | null;
  hotel: string | null;
  avatar: string;
}

// Role hierarchy (lower number = higher power)
const ROLE_POWER: Record<string, number> = {
  main_admin: 0,
  main_client: 1,
  franchise_head: 2,
  hotel_manager: 3,
  inventory_manager: 4,
  cashier: 5,
  chef: 6,
  worker: 7,
  customer: 8
};

interface AuthCtx {
  user: User | null;
  isAuthLoaded: boolean;
  users: User[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  loginAs: (role: string) => void;
  logout: () => void;
  addUser: (newUser: Omit<User, 'id'>) => { ok: boolean; error?: string };
  deleteUser: (userId: number) => { ok: boolean; error?: string };
  canManage: (targetRole: string) => boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dynamicUsers, setDynamicUsers] = useState<User[]>([]);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sns_user');
    if (stored) setUser(JSON.parse(stored));

    const storedUsers = localStorage.getItem('sns_dynamic_users');
    if (storedUsers) setDynamicUsers(JSON.parse(storedUsers));
    
    setIsAuthLoaded(true);
  }, []);

  const allUsers = React.useMemo(() => [...DEMO_USERS, ...dynamicUsers], [dynamicUsers]);

  const canManage = React.useCallback((targetRole: string) => {
    if (!user) return false;
    const myPower = ROLE_POWER[user.role] ?? 99;
    const targetPower = ROLE_POWER[targetRole] ?? 99;
    return myPower < targetPower;
  }, [user]);

  const login = React.useCallback((email: string, password: string) => {
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (!found) return { ok: false, error: 'Invalid email or password' };
    setUser(found);
    localStorage.setItem('sns_user', JSON.stringify(found));
    return { ok: true };
  }, [allUsers]);

  const loginAs = React.useCallback((role: string) => {
    const found = allUsers.find(u => u.role === role);
    if (!found) return;
    setUser(found);
    localStorage.setItem('sns_user', JSON.stringify(found));
  }, [allUsers]);

  const logout = React.useCallback(() => {
    setUser(null);
    localStorage.removeItem('sns_user');
  }, []);

  const deleteUser = React.useCallback((userId: number) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return { ok: false, error: 'User not found' };
    
    if (!canManage(targetUser.role)) {
      return { ok: false, error: 'You do not have permission to delete this user' };
    }

    const updated = dynamicUsers.filter(u => u.id !== userId);
    setDynamicUsers(updated);
    localStorage.setItem('sns_dynamic_users', JSON.stringify(updated));
    return { ok: true };
  }, [canManage, allUsers, dynamicUsers]);

  const value = React.useMemo(() => ({
    user,
    isAuthLoaded,
    users: allUsers,
    login,
    loginAs,
    logout,
    addUser,
    deleteUser,
    canManage
  }), [user, isAuthLoaded, allUsers, login, loginAs, logout, addUser, deleteUser, canManage]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function getHome(role: string) {
  return ROLE_HOMES[role] ?? '/login';
}
