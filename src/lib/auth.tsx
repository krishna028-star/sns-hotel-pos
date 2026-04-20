'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ROLE_HOMES } from '@/lib/mockData';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  tenant: string | null;
  hotel: string | null;
  hotelId: string | null;
  staffId?: string;
  age?: number;
  joiningDate?: string;
  salary?: number;
  workingDays?: number;
  presenceThisMonth?: number;
  remarks?: string;
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
  addUser: (newUser: Omit<User, 'id'>) => Promise<{ ok: boolean; error?: string }>;
  deleteUser: (userId: string) => Promise<{ ok: boolean; error?: string }>;
  updateUserPassword: (userId: string, newPass: string) => Promise<{ ok: boolean; error?: string }>;
  canManage: (targetRole: string) => boolean;
  cloudError: string | null;
}

import { fetchUsers, createDbUser, updateDbUserPassword, deleteDbUser } from '@/app/actions/authActions';

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dynamicUsers, setDynamicUsers] = useState<User[]>([]);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [cloudError, setCloudError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    const res = await fetchUsers();
    if (res.ok && res.users) {
      setDynamicUsers(res.users as any);
      setCloudError(null);
    } else {
      console.error('Cloud Sync Failed:', res.error);
      setCloudError(res.error || 'Unknown database error');
    }
    setIsAuthLoaded(true);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sns_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem('sns_user');
    }

    refreshUsers();
  }, [refreshUsers]);

  const canManage = useCallback((targetRole: string) => {
    if (!user) return false;
    const myPower = ROLE_POWER[user.role] ?? 99;
    const targetPower = ROLE_POWER[targetRole] ?? 99;
    return myPower < targetPower;
  }, [user]);

  const login = useCallback((emailOrId: string, password: string) => {
    const term = emailOrId.toLowerCase();
    // Use all dynamic users from DB
    const found = dynamicUsers.find(u => 
      (u.email.toLowerCase() === term || (u.staffId && u.staffId.toLowerCase() === term)) && 
      u.password === password // In production, this would use bcrypt.compare
    );
    if (!found) return { ok: false, error: 'Invalid Staff ID, Email or Password' };
    const safeUser = { ...found };
    delete safeUser.password;
    setUser(safeUser as any);
    localStorage.setItem('sns_user', JSON.stringify(safeUser));
    return { ok: true };
  }, [dynamicUsers]);

  const loginAs = useCallback((role: string) => {
    const found = dynamicUsers.find(u => u.role === role);
    if (!found) return;
    const safeUser = { ...found };
    delete safeUser.password;
    setUser(safeUser as any);
    localStorage.setItem('sns_user', JSON.stringify(safeUser));
  }, [dynamicUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('sns_user');
  }, []);

  const addUser = useCallback(async (newUser: Omit<User, 'id'>) => {
    if (!user) return { ok: false, error: 'Not authenticated' };
    if (!canManage(newUser.role)) return { ok: false, error: 'Hierarchy denied.' };

    const duplicate = dynamicUsers.find(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (duplicate) return { ok: false, error: `Email "${newUser.email}" is already registered.` };

    const res = await createDbUser(newUser);
    if (!res.ok) return { ok: false, error: res.error };

    await refreshUsers();
    return { ok: true };
  }, [user, canManage, dynamicUsers, refreshUsers]);

  const deleteUser = useCallback(async (userId: string) => {
    const targetUser = dynamicUsers.find(u => u.id === userId);
    if (!targetUser) return { ok: false, error: 'Not found' };
    if (!canManage(targetUser.role)) return { ok: false, error: 'Permission denied' };

    const res = await deleteDbUser(userId);
    if (!res.ok) return { ok: false, error: res.error };

    setDynamicUsers(prev => prev.filter(u => u.id !== userId));
    return { ok: true };
  }, [canManage, dynamicUsers]);

  const updateUserPassword = useCallback(async (userId: string, newPass: string) => {
    const targetUser = dynamicUsers.find(u => u.id === userId);
    if (!targetUser) return { ok: false, error: 'User not found' };
    if (!canManage(targetUser.role) && user?.id !== userId) return { ok: false, error: 'Denied.' };
    if (newPass.length < 6) return { ok: false, error: 'Password must be 6+ chars.' };

    const res = await updateDbUserPassword(userId, newPass);
    if (!res.ok) return { ok: false, error: res.error };
    
    await refreshUsers();
    return { ok: true };
  }, [canManage, dynamicUsers, user, refreshUsers]);

  const value = useMemo(() => ({
    user,
    isAuthLoaded,
    users: dynamicUsers,
    login,
    loginAs,
    logout,
    addUser,
    deleteUser,
    updateUserPassword,
    canManage,
    cloudError
  }), [user, isAuthLoaded, dynamicUsers, login, loginAs, logout, addUser, deleteUser, updateUserPassword, canManage, cloudError]);

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
