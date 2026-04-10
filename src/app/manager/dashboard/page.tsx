'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ACTIVE_ORDERS, PENDING_KOTS, TABLES, formatCurrency } from '@/lib/mockData';

const statusColor: Record<string, string> = { ready: '#00C48C', cooking: '#FF8A34', kot_sent: '#2E5AFF', bill_requested: '#9B59B6', pending: '#94A3B8' };
const statusLabel: Record<string, string> = { ready: '✅ Ready', cooking: '🔥 Cooking', kot_sent: '📤 KOT Sent', bill_requested: '🧾 Bill Req.', pending: '⏳ Pending' };

function ManagerDash() {
  const occupied = TABLES.filter(t => t.status === 'occupied').length;
  const free = TABLES.filter(t => t.status === 'free').length;
  const reserved = TABLES.filter(t => t.status === 'reserved').length;

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
          <a href="/manager/live-orders"><button className="btn btn-sm" style={{ background: '#fff', color: '#2E5AFF' }}>🔴 Live Orders</button></a>
          <a href="/manager/staff"><button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>👥 Staff</button></a>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: "Today's Revenue", value: '₹0', trend: '0% change', icon: '💰', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Active Orders', value: ACTIVE_ORDERS.length, trend: 'Right now', icon: '📋', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Pending KOTs', value: PENDING_KOTS.length, trend: 'Needs attention', icon: '🔔', color: '#FF3B30', bg: '#fff0ef' },
          { label: 'Staff On Duty', value: '0', trend: 'None active', icon: '👥', color: '#00C48C', bg: '#e8fdf7' },
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
            <a href="/manager/live-orders"><button className="btn btn-outline btn-sm">View All</button></a>
          </div>
          <div style={{ padding: '8px 20px 20px' }}>
            {ACTIVE_ORDERS.map(o => (
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
            {ACTIVE_ORDERS.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#94A3B8' }}>No live orders</div>}
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
