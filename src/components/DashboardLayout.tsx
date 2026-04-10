'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth, getHome } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

function Inner({ children, title }: { children: React.ReactNode; title: string }) {
  const { user, isAuthLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoaded && !user) { router.push('/login'); }
  }, [user, isAuthLoaded, router]);

  if (!isAuthLoaded || !user) return null;

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

export default function DashboardLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Inner title={title}>{children}</Inner>
  );
}
