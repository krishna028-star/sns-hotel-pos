'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DEMO_USERS, ROLE_HOMES } from '@/lib/mockData';

export interface User {
  id: number | string;
  name: string;
  email: string;
  password?: string;
  role: string;
  tenant: string | null;
  hotel: string | null;
  avatar: string;
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
  deleteUser: (userId: number | string) => Promise<{ ok: boolean; error?: string }>;
  updateUserPassword: (userId: number | string, newPass: string) => Promise<{ ok: boolean; error?: string }>;
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sns_user');
      if (stored) setUser(JSON.parse(stored));

      const storedUsers = localStorage.getItem('sns_dynamic_users');
      if (storedUsers) setDynamicUsers(JSON.parse(storedUsers));
    } catch {
      localStorage.removeItem('sns_user');
      localStorage.removeItem('sns_dynamic_users');
    }

    // Refresh from Prisma Live Mode!
    fetchUsers().then(res => {
      if (res.ok && res.users) {
        setDynamicUsers(res.users);
        setCloudError(null);
      } else {
        console.error('Cloud Sync Failed:', res.error);
        setCloudError(res.error || 'Unknown database error');
      }
      setIsAuthLoaded(true);
    });
  }, []);

  const allUsers = useMemo(() => [...DEMO_USERS, ...dynamicUsers], [dynamicUsers]);

  const canManage = useCallback((targetRole: string) => {
    if (!user) return false;
    const myPower = ROLE_POWER[user.role] ?? 99;
    const targetPower = ROLE_POWER[targetRole] ?? 99;
    return myPower < targetPower;
  }, [user]);

  const login = useCallback((emailOrId: string, password: string) => {
    const term = emailOrId.toLowerCase();
    const found = allUsers.find(u => 
      (u.email.toLowerCase() === term || (u.staffId && u.staffId.toLowerCase() === term)) && 
      u.password === password
    );
    if (!found) return { ok: false, error: 'Invalid Staff ID, Email or Password' };
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

  // Cloud Synced Add User
  const addUser = useCallback(async (newUser: Omit<User, 'id'>) => {
    if (!user) return { ok: false, error: 'Not authenticated' };
    if (!canManage(newUser.role)) return { ok: false, error: 'Hierarchy denied.' };

    const duplicate = allUsers.find(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (duplicate) return { ok: false, error: `Email "${newUser.email}" is already registered.` };

    const res = await createDbUser(newUser);
    if (!res.ok) return { ok: false, error: res.error };

    // Refresh cloud list
    const freshRes = await fetchUsers();
    if (freshRes.ok && freshRes.users) setDynamicUsers(freshRes.users);

    return { ok: true };
  }, [user, canManage, allUsers]);

  const deleteUser = useCallback(async (userId: number | string) => {
    if (typeof userId === 'number' && userId <= 1) return { ok: false, error: 'Built-in accounts protected.' };
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return { ok: false, error: 'Not found' };
    if (!canManage(targetUser.role)) return { ok: false, error: 'Permission denied' };

    const res = await deleteDbUser(userId as string);
    if (!res.ok) return { ok: false, error: res.error };

    setDynamicUsers(prev => prev.filter(u => u.id !== userId));
    return { ok: true };
  }, [canManage, allUsers]);

  const updateUserPassword = useCallback(async (userId: number | string, newPass: string) => {
    const targetUser = allUsers.find(u => u.id === userId);
    if (!targetUser) return { ok: false, error: 'User not found' };
    if (!canManage(targetUser.role) && user?.id !== userId) return { ok: false, error: 'Denied.' };
    if (newPass.length < 6) return { ok: false, error: 'Password must be 6+ chars.' };
    if (typeof userId === 'number') return { ok: false, error: 'Built in users cannot change pass.' };

    const res = await updateDbUserPassword(userId as string, newPass);
    if (!res.ok) return { ok: false, error: res.error };
    
    // Optimistic UI update
    setDynamicUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPass } : u));
    return { ok: true };
  }, [canManage, allUsers, user]);

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
    canManage,
    cloudError
  }), [user, isAuthLoaded, allUsers, login, loginAs, logout, addUser, deleteUser, updateUserPassword, canManage, cloudError]);

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
