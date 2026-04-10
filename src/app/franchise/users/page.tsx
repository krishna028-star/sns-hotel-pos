'use client';
export const dynamic = 'force-dynamic';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import UserManagement from '@/components/UserManagement';

export default function FranchiseUsersPage() {
  return (
    <DashboardLayout title="User Management — Franchise View">
      <UserManagement 
        title="👥 Franchise User Management" 
        subtitle="Manage hotel managers and staff within your franchise"
        roleFilterOptions={['hotel_manager', 'inventory_manager', 'cashier', 'chef', 'worker', 'customer']}
      />
    </DashboardLayout>
  );
}
