'use client';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, getHome } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

// Route-to-role guard map — each prefix maps to which roles may access it
const ROUTE_ROLES: Record<string, string[]> = {
  '/admin': ['main_admin'],
  '/client': ['main_client', 'main_admin'],
  '/franchise': ['franchise_head', 'main_admin', 'main_client'],
  '/manager': ['hotel_manager', 'main_admin', 'main_client', 'franchise_head'],
  '/inventory': ['inventory_manager', 'main_admin', 'hotel_manager'],
  '/cashier': ['cashier', 'main_admin', 'hotel_manager'],
  '/chef': ['chef', 'main_admin', 'hotel_manager'],
  '/worker': ['worker', 'main_admin', 'hotel_manager'],
  '/customer': ['customer', 'main_admin'],
};

function getAllowedRoles(pathname: string): string[] | null {
  for (const [prefix, roles] of Object.entries(ROUTE_ROLES)) {
    if (pathname.startsWith(prefix)) return roles;
  }
  return null; // No restriction
}

// BUG FIX: DashboardLayout was wrapping children with its own AuthProvider
// which conflicted with the root layout's AuthProvider (double provider = split state)
// Now it uses the existing context from root layout directly
export default function DashboardLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const { user, isAuthLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Role-based route guard
    const allowedRoles = getAllowedRoles(pathname);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to user's home rather than showing unauthorized
      router.push(getHome(user.role));
    }
  }, [user, isAuthLoaded, router, pathname]);

  if (!isAuthLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🏨</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading SNS POS…</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Check route access
  const allowedRoles = getAllowedRoles(pathname);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Access Denied</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Redirecting you to your dashboard…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
