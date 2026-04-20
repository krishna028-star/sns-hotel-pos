'use client';
import React, { useState } from 'react';

import { useRouter } from "next/navigation";
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';

const statusColor: Record<string, string> = { ready: '#00C48C', cooking: '#FF8A34', kot_sent: '#2E5AFF', bill_requested: '#9B59B6', pending: '#94A3B8' };
const statusLabel: Record<string, string> = { ready: '✅ Ready', cooking: '🔥 Cooking', kot_sent: '📤 KOT Sent', bill_requested: '🧾 Bill Req.', pending: '⏳ Pending' };

import { useData } from '@/lib/DataContext';
import { useAuth } from '@/lib/auth';

function ManagerDash() {
  const router = useRouter();
  const { users } = useAuth();
  const { tables, activeOrders, pendingKots } = useData();
  
  const occupied = tables.filter((t: any) => t.status === 'occupied').length;
  const free = tables.filter((t: any) => t.status === 'free').length;
  const reserved = tables.filter((t: any) => t.status === 'reserved').length;
  const totalRev = activeOrders.reduce((a: number, b: any) => a + (b.totalAmount || 0), 0);
  const hotelStaffCount = users.filter((u: any) => u.hotelId).length;

  return (
    <DashboardLayout title="Hotel Manager Dashboard">
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg,#2E5AFF 0%,#1a3fd9 100%)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ fontSize: 40 }}>🏨</div>
        <div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>SNS Beach Resort — Live Operations</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>
            🟢 {free} Free &nbsp;·&nbsp; 🔴 {occupied} Occupied &nbsp;·&nbsp; 🟡 {reserved} Reserved
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <button className="btn btn-sm" style={{ background: '#fff', color: '#2E5AFF' }} onClick={() => router.push("/manager/live-orders")}>🔴 Live Orders</button>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => router.push("/manager/staff")}>👥 Staff</button>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: "Today's Revenue", value: formatCurrency(totalRev), trend: '↑ 12%', icon: '💰', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Active Orders', value: activeOrders.length, trend: 'Right now', icon: '📋', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Pending KOTs', value: pendingKots.length, trend: 'Needs attention', icon: '🔔', color: '#FF3B30', bg: '#fff0ef' },
          { label: 'Staff On Duty', value: hotelStaff.length, trend: 'Across shifts', icon: '👥', color: '#00C48C', bg: '#e8fdf7' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
            <div className="metric-trend trend-up">{m.trend}</div>
          </div>
        ))}
      </div>

      {/* Live Orders + Quick Actions */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔴 Live Orders</div>
            <button className="btn btn-outline btn-sm" onClick={() => router.push("/manager/live-orders")}>View All</button>
          </div>
          <div style={{ padding: '8px 20px 20px' }}>
            {activeOrders.map(o => (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F4F6FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#2E5AFF', fontSize: 16 }}>T{o.tableNum}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{o.id}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{o.items.length} items · {o.worker}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: statusColor[o.status], background: statusColor[o.status] + '18', padding: '3px 10px', borderRadius: 12 }}>{statusLabel[o.status]}</span>
                </div>
                <div style={{ fontWeight: 700, color: '#2E5AFF' }}>{formatCurrency(o.total)}</div>
              </div>
            ))}
            {activeOrders.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>No live orders</div>}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header"><div className="card-title">⚡ Quick Actions</div></div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: '/manager/menu', icon: '🍽️', label: 'Manage Menu', sub: 'Add/edit items' },
                { href: '/manager/tables', icon: '🪑', label: 'Tables & QR', sub: 'Floor plan & QR codes' },
                { href: '/manager/staff', icon: '👥', label: 'Staff Management', sub: 'Manage workers' },
                { href: '/manager/discounts', icon: '💰', label: 'Discount Approvals', sub: '0 pending' },
                { href: '/manager/theft', icon: '🚨', label: 'Theft Reports', sub: '0 pending' },
                { href: '/manager/reports', icon: '📊', label: 'Reports', sub: 'Sales data' },
              ].map(a => (
                <a key={a.href} href={a.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: '#F8F9FC', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#E8EDFF')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F8F9FC')}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#0F172A' }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{a.sub}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#94A3B8' }}>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ManagerDash;
