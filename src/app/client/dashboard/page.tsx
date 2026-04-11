'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SALES_TREND, FRANCHISE_SALES, THEFT_REPORTS, formatCurrency } from '@/lib/mockData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

function ClientDash() {
  return (
    <DashboardLayout title="Main Client Dashboard">
      <div style={{ background: 'linear-gradient(135deg,#0F3460 0%,#16213E 100%)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ fontSize: 40 }}>🏢</div>
        <div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>SNS Grand Hotels — Chain Overview</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>4 Franchises · 14 Hotels · All reporting live</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <Link href="/client/sales"><button className="btn btn-primary btn-sm">📊 Sales</button></Link>
          <Link href="/client/franchises"><button className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>🤝 Franchises</button></Link>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Chain Revenue (MTD)', value: '₹16L', trend: '↑ 14%', icon: '💰', color: '#1ABC9C', bg: '#e8fdf7' },
          { label: 'Total Orders', value: '4,220', trend: '↑ 9%', icon: '📋', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Active Hotels', value: '14', trend: 'Across 4 regions', icon: '🏨', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Theft Reports', value: '5', trend: 'Needs attention', icon: '🚨', color: '#FF3B30', bg: '#fff0ef' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
            <div className="metric-trend trend-up">{m.trend}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📈 Revenue Trend (Chain)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SALES_TREND}>
              <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1ABC9C" stopOpacity={0.3} /><stop offset="95%" stopColor="#1ABC9C" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#1ABC9C" strokeWidth={2.5} fill="url(#cg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-title">🏢 Revenue by Franchise</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={FRANCHISE_SALES}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#1ABC9C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">🤝 Franchise Overview</div><Link href="/client/franchises"><button className="btn btn-outline btn-sm">Manage</button></Link></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Franchise</th><th>Head</th><th>Hotels</th><th>Revenue (MTD)</th><th>Status</th></tr></thead>
            <tbody>
              {FRANCHISE_SALES.map(f => (
                <tr key={f.name}>
                  <td><strong>{f.name}</strong></td>
                  <td style={{ fontSize: 12 }}>—</td>
                  <td>{f.hotels}</td>
                  <td><strong style={{ color: '#1ABC9C' }}>{formatCurrency(f.revenue)}</strong></td>
                  <td><span className="badge badge-green">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default function ClientDashPage() { return <ClientDash />; }
