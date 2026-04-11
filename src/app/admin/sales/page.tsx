'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SALES_TREND, TOP_ITEMS, PAYMENT_BREAKDOWN, HOURLY_SALES, FRANCHISE_SALES, formatCurrency } from '@/lib/mockData';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function AdminSales() {
  const [range, setRange] = useState('7d');
  const ranges = ['Today', '7d', '30d', 'Custom'];

  return (
    <DashboardLayout title="POS Sales Dashboard — Global">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📊 POS Sales Dashboard</div>
          <div className="page-header-sub">Real-time aggregated sales across all tenants</div>
        </div>
        <div className="page-header-actions">
          <div className="chips-row">
            {ranges.map(r => <button key={r} className={`chip ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>{r}</button>)}
          </div>
          <button className="btn btn-outline btn-sm">⬇ Export</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Revenue', value: '₹18.4L', trend: '↑ 12%', icon: '💰', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Total Orders', value: '14,820', trend: '↑ 8%', icon: '📋', color: '#00C48C', bg: '#e0faf3' },
          { label: 'Avg Bill Value', value: '₹365', trend: '↑ ₹22', icon: '🧾', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Active Tenants', value: '4', trend: 'All reporting', icon: '🏢', color: '#9B59B6', bg: '#f3eeff' },
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
          <div className="chart-title">📈 Revenue Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={SALES_TREND}>
              <defs>
                <linearGradient id="gr1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E5AFF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2E5AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#2E5AFF" strokeWidth={2.5} fill="url(#gr1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">💳 Payment Breakdown</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={PAYMENT_BREAKDOWN} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {PAYMENT_BREAKDOWN.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: unknown) => [`${Number(v)}%`, '']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">🍽️ Top Selling Items</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOP_ITEMS} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#00C48C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">⏰ Hourly Sales</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={HOURLY_SALES}>
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#FF8A34" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">🏢 Revenue by Franchise Region</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Region</th><th>Revenue</th><th>Orders</th><th>Hotels</th><th>Share</th></tr></thead>
            <tbody>
              {FRANCHISE_SALES.map(f => {
                const total = FRANCHISE_SALES.reduce((s, x) => s + x.revenue, 0);
                const pct = ((f.revenue / total) * 100).toFixed(1);
                return (
                  <tr key={f.name}>
                    <td><strong>{f.name}</strong></td>
                    <td><strong style={{ color: '#2E5AFF' }}>{formatCurrency(f.revenue)}</strong></td>
                    <td>{f.orders.toLocaleString()}</td>
                    <td>{f.hotels}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${pct}%`, background: '#2E5AFF' }} />
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AdminSalesPage() { return <AdminSales />; }
