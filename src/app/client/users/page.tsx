'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import UserManagement from '@/components/UserManagement';

export default function ClientUsersPage() {
  return (
    <DashboardLayout title="User Management — Chain View">
      <UserManagement 
        title="👥 Chain User Management" 
        subtitle="Manage all users across your franchise and hotel network"
      />
    </DashboardLayout>
  );
}
