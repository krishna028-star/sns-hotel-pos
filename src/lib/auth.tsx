'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  updateUserPassword: (userId: number, newPass: string) => { ok: boolean; error?: string };
  canManage: (targetRole: string) => boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dynamicUsers, setDynamicUsers] = useState<User[]>([]);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sns_user');
      if (stored) setUser(JSON.parse(stored));

      const storedUsers = localStorage.getItem('sns_dynamic_users');
      if (storedUsers) setDynamicUsers(JSON.parse(storedUsers));
    } catch {
      // Corrupted storage — clear and continue
      localStorage.removeItem('sns_user');
      localStorage.removeItem('sns_dynamic_users');
    }
    setIsAuthLoaded(true);
  }, []);

  const allUsers = useMemo(() => [...DEMO_USERS, ...dynamicUsers], [dynamicUsers]);

  const canManage = useCallback((targetRole: string) => {
    if (!user) return false;
    const myPower = ROLE_POWER[user.role] ?? 99;
    const targetPower = ROLE_POWER[targetRole] ?? 99;
    return myPower < targetPower;
  }, [user]);

  const login = useCallback((email: string, password: string) => {
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: 'Invalid email or password' };
    const safeUser = { ...found };
    delete safeUser.password;
    setUser(safeUser);
    localStorage.setItem('sns_user', JSON.stringify(safeUser));
    return { ok: true };
  }, [allUsers]);

  const loginAs = useCallback((role: string) => {
    const found = allUsers.find(u => u.role === role);
    if (!found) return;
    const safeUser = { ...found };
    delete safeUser.password;
    setUser(safeUser);
    localStorage.setItem('sns_user', JSON.stringify(safeUser));
  }, [allUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sns_user');
  }, []);

  // BUG FIX: addUser was referenced but NEVER defined — caused runtime crash
  const addUser = useCallback((newUser: Omit<User, 'id'>) => {
    if (!user) return { ok: false, error: 'Not authenticated' };

    // Enforce role hierarchy — cannot create user with equal/higher power
    if (!canManage(newUser.role)) {
      return { ok: false, error: 'You cannot create a user with a role equal to or higher than yours.' };
    }

    // Check for duplicate email
    const duplicate = allUsers.find(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (duplicate) {
      return { ok: false, error: `Email "${newUser.email}" is already registered.` };
    }

    // Generate unique ID — max existing + 1
    const maxId = allUsers.reduce((max, u) => Math.max(max, u.id), 0);
    const created: User = { ...newUser, id: maxId + 1 };

    const updated = [...dynamicUsers, created];
    setDynamicUsers(updated);
    localStorage.setItem('sns_dynamic_users', JSON.stringify(updated));
    return { ok: true };
  }, [user, canManage, allUsers, dynamicUsers]);

  const deleteUser = useCallback((userId: number) => {
    // Prevent deleting hardcoded admin users (id 0 and 1)
    if (userId <= 1) return { ok: false, error: 'Built-in admin accounts cannot be deleted.' };

    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return { ok: false, error: 'User not found' };

    if (!canManage(targetUser.role)) {
      return { ok: false, error: 'You do not have permission to delete this user.' };
    }

    // Only dynamic users can be deleted (not DEMO_USERS)
    const inDynamic = dynamicUsers.find(u => u.id === userId);
    if (!inDynamic) return { ok: false, error: 'This user cannot be deleted from this interface.' };

    const updated = dynamicUsers.filter(u => u.id !== userId);
    setDynamicUsers(updated);
    localStorage.setItem('sns_dynamic_users', JSON.stringify(updated));
    return { ok: true };
  }, [canManage, allUsers, dynamicUsers]);

  const updateUserPassword = useCallback((userId: number, newPass: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return { ok: false, error: 'User not found' };

    if (!canManage(targetUser.role) && user?.id !== userId) {
      return { ok: false, error: 'Cannot change password for this user.' };
    }

    if (newPass.length < 6) return { ok: false, error: 'Password must be 6+ chars.' };

    const inDynamic = dynamicUsers.find(u => u.id === userId);
    if (!inDynamic) return { ok: false, error: 'Built-in admin passwords cannot be changed here.' };

    const updated = dynamicUsers.map(u => u.id === userId ? { ...u, password: newPass } : u);
    setDynamicUsers(updated);
    localStorage.setItem('sns_dynamic_users', JSON.stringify(updated));
    return { ok: true };
  }, [canManage, allUsers, dynamicUsers, user]);

  const value = useMemo(() => ({
    user,
    isAuthLoaded,
    users: allUsers,
    login,
    loginAs,
    logout,
    addUser,
    deleteUser,
    updateUserPassword,
    canManage
  }), [user, isAuthLoaded, allUsers, login, loginAs, logout, addUser, deleteUser, updateUserPassword, canManage]);

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
