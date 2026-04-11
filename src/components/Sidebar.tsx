'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/mockData';

interface NavItem { label: string; href: string; icon: string; badge?: number; }
interface NavSection { title?: string; items: NavItem[]; }

const NAV_CONFIG: Record<string, NavSection[]> = {
  main_admin: [
    { items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: '⊞' }] },
    { title: 'Analytics', items: [
      { label: 'POS Sales View', href: '/admin/sales', icon: '📊' },
      { label: 'Inventory Stock', href: '/admin/inventory', icon: '📦' },
      { label: 'Anticipate View', href: '/admin/anticipate', icon: '🔮' },
    ]},
    { title: 'Management', items: [
      { label: 'Tenants', href: '/admin/tenants', icon: '🏢' },
      { label: 'Users', href: '/admin/users', icon: '👥' },
      { label: 'Payroll', href: '/admin/payroll', icon: '📜' },
      { label: 'Audit Logs', href: '/admin/audit', icon: '📋' },
      { label: 'Global Config', href: '/admin/config', icon: '⚙️' },
      { label: 'System Health', href: '/admin/health', icon: '🩺' },
    ]},
  ],
  main_client: [
    { items: [{ label: 'Dashboard', href: '/client/dashboard', icon: '⊞' }] },
    { title: 'Analytics', items: [
      { label: 'Sales Dashboard', href: '/client/sales', icon: '📊' },
      { label: 'Inventory & Theft', href: '/client/inventory', icon: '📦' },
      { label: 'Occupancy', href: '/client/occupancy', icon: '🏨' },
      { label: 'Anticipate View', href: '/client/anticipate', icon: '🔮' },
    ]},
    { title: 'Management', items: [
      { label: 'Franchises', href: '/client/franchises', icon: '🤝' },
      { label: 'Chain Policies', href: '/client/policies', icon: '📜' },
      { label: 'Theft Reports', href: '/client/theft', icon: '🚨' },
      { label: 'Users', href: '/client/users', icon: '👥' },
      { label: 'Audit Logs', href: '/client/audit', icon: '📋' },
    ]},
  ],
  franchise_head: [
    { items: [{ label: 'Dashboard', href: '/franchise/dashboard', icon: '⊞' }] },
    { title: 'Analytics', items: [
      { label: 'Sales Dashboard', href: '/franchise/sales', icon: '📊' },
      { label: 'Inventory & Theft', href: '/franchise/inventory', icon: '📦' },
      { label: 'Occupancy', href: '/franchise/occupancy', icon: '🏨' },
    ]},
    { title: 'Management', items: [
      { label: 'Hotels', href: '/franchise/hotels', icon: '🏩' },
      { label: 'Users', href: '/franchise/users', icon: '👥' },
      { label: 'PO Approvals', href: '/franchise/approvals', icon: '✅', badge: 2 },
      { label: 'Theft Review', href: '/franchise/theft', icon: '🚨', badge: 1 },
    ]},
  ],
  hotel_manager: [
    { items: [{ label: 'Dashboard', href: '/manager/dashboard', icon: '⊞' }] },
    { title: 'Operations', items: [
      { label: 'Live Orders', href: '/manager/live-orders', icon: '🔴', badge: 4 },
      { label: 'Sales Report', href: '/manager/sales', icon: '📊' },
      { label: 'Occupancy map', href: '/manager/occupancy', icon: '🗺️' },
      { label: 'Anticipate', href: '/manager/anticipate', icon: '🔮' },
    ]},
    { title: 'Configuration', items: [
      { label: 'Staff', href: '/manager/staff', icon: '👥' },
      { label: 'Menu', href: '/manager/menu', icon: '🍽️' },
      { label: 'Tables & QR', href: '/manager/tables', icon: '🪑' },
    ]},
    { title: 'Approvals', items: [
      { label: 'Discount/Void', href: '/manager/discounts', icon: '💰', badge: 2 },
      { label: 'Theft Reports', href: '/manager/theft', icon: '🚨', badge: 1 },
      { label: 'Inventory', href: '/manager/inventory', icon: '📦' },
      { label: 'Reports', href: '/manager/reports', icon: '📋' },
    ]},
  ],
  inventory_manager: [
    { items: [{ label: 'Dashboard', href: '/inventory/dashboard', icon: '⊞' }] },
    { title: 'Inventory', items: [
      { label: 'Stock Overview', href: '/inventory/stock', icon: '🏗️' },
      { label: 'Stock Movement', href: '/inventory/movements', icon: '🔄' },
      { label: 'Low Stock Alerts', href: '/inventory/alerts', icon: '⚠️', badge: 3 },
    ]},
    { title: 'Procurement', items: [
      { label: 'Purchase Orders', href: '/inventory/purchase-orders', icon: '📋' },
      { label: 'Suppliers', href: '/inventory/suppliers', icon: '🚚' },
    ]},
    { title: 'Reports', items: [
      { label: 'Theft Reports', href: '/inventory/theft', icon: '🚨' },
      { label: 'Reports', href: '/inventory/reports', icon: '📈' },
    ]},
  ],
  cashier: [
    { items: [{ label: 'Dashboard', href: '/cashier/dashboard', icon: '⊞' }] },
    { title: 'Payments', items: [
      { label: 'Payment Alarms', href: '/cashier/alarms', icon: '🔔', badge: 2 },
      { label: 'Pending Payments', href: '/cashier/pending', icon: '⏳' },
      { label: 'Payment History', href: '/cashier/history', icon: '📋' },
    ]},
    { title: 'Shift', items: [
      { label: 'Shift Management', href: '/cashier/shift', icon: '🕐' },
      { label: 'Reconciliation', href: '/cashier/reconcile', icon: '🧾' },
    ]},
  ],
  chef: [
    { items: [{ label: 'Kitchen Display', href: '/chef/dashboard', icon: '👨‍🍳' }] },
    { title: 'Orders', items: [
      { label: 'Pending KOTs', href: '/chef/pending', icon: '🔔', badge: 1 },
      { label: 'Active KOTs', href: '/chef/active', icon: '🔥' },
      { label: 'History', href: '/chef/history', icon: '📋' },
    ]},
  ],
  worker: [
    { items: [{ label: 'Dashboard', href: '/worker/dashboard', icon: '⊞' }] },
    { title: 'Tables', items: [
      { label: 'Floor Plan', href: '/worker/tables', icon: '🪑' },
      { label: 'Active Orders', href: '/worker/orders', icon: '📋' },
    ]},
    { title: 'Bookings', items: [
      { label: 'Bookings', href: '/worker/bookings', icon: '📅', badge: 2 },
    ]},
  ],
  customer: [
    { items: [{ label: 'Home', href: '/customer/dashboard', icon: '🏠' }] },
    { title: 'Reservations', items: [
      { label: 'Book a Table', href: '/customer/book', icon: '🪑' },
      { label: 'My Bookings', href: '/customer/bookings', icon: '📅' },
    ]},
    { title: 'Ordering', items: [
      { label: 'Browse Menu', href: '/customer/menu', icon: '🍽️' },
      { label: 'My Orders', href: '/customer/orders', icon: '📦' },
    ]},
    { title: 'Account', items: [
      { label: 'Profile', href: '/customer/profile', icon: '👤' },
      { label: 'Payment History', href: '/customer/payments', icon: '💳' },
    ]},
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const sections = NAV_CONFIG[user.role] ?? [];
  const roleColor = ROLE_COLORS[user.role] ?? '#2E5AFF';
  const roleLabel = ROLE_LABELS[user.role] ?? user.role;

  const handleNav = (href: string) => router.push(href);
  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <aside className="sidebar" style={{ width: collapsed ? 64 : 240 }}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏨</div>
        {!collapsed && (
          <div>
            <div className="sidebar-logo-text">SNS Hotels</div>
            <div className="sidebar-logo-sub">POS System</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 18, padding: 4 }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="sidebar-role-badge">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: roleColor, display: 'inline-block', flexShrink: 0 }} />
          <span>{roleLabel}</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sections.map((section, si) => (
          <div key={si}>
            {section.title && !collapsed && (
              <div className="nav-section">
                <span className="nav-section-label">{section.title}</span>
              </div>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <div
                  key={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleNav(item.href)}
                  title={collapsed ? item.label : ''}
                >
                  <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && <span className="nav-item-label">{item.label}</span>}
                  {!collapsed && item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-avatar">{user.avatar}</div>
        {!collapsed && (
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.hotel ?? user.tenant}</div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 16, marginLeft: 4 }}
            title="Logout"
          >🚪</button>
        )}
      </div>
    </aside>
  );
}
