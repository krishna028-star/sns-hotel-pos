'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SALES_TREND, FRANCHISE_SALES, HOTELS, THEFT_REPORTS, formatCurrency } from '@/lib/mockData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

function FranchiseDash() {
  return (
    <DashboardLayout title="Franchise Head Dashboard">
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#FF8A34 0%,#d4732a 100%)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ fontSize: 40 }}>🏩</div>
        <div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>North Region — Franchise Overview</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>3 Hotels · Real-time monitoring</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <Link href="/franchise/hotels"><button className="btn btn-sm" style={{ background: '#fff', color: '#FF8A34' }}>🏨 Hotels</button></Link>
          <Link href="/franchise/approvals"><button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>✅ Approvals <span style={{ background: '#FF3B30', borderRadius: 10, padding: '1px 7px', fontSize: 10, marginLeft: 4 }}>2</span></button></Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Franchise Revenue (MTD)', value: '₹4.2L', trend: '↑ 11%', icon: '💰', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Total Orders', value: '1,120', trend: '↑ 7%', icon: '📋', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Pending Approvals', value: '2', trend: 'Action needed', icon: '✅', color: '#9B59B6', bg: '#f5f0ff' },
          { label: 'Theft Reports', value: '1', trend: 'Under review', icon: '🚨', color: '#FF3B30', bg: '#fff0ef' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
            <div className="metric-trend trend-up">{m.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📈 Revenue Trend (Franchise)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SALES_TREND}>
              <defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF8A34" stopOpacity={0.3} /><stop offset="95%" stopColor="#FF8A34" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#FF8A34" strokeWidth={2.5} fill="url(#fg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-title">🏨 Revenue by Hotel</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={HOTELS}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#FF8A34" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hotels Table */}
      <div className="card">
        <div className="card-header"><div className="card-title">🏨 Hotels in Franchise</div><Link href="/franchise/hotels"><button className="btn btn-outline btn-sm">Manage</button></Link></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Hotel</th><th>Manager</th><th>Tables</th><th>Revenue (MTD)</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {HOTELS.map(h => (
                <tr key={h.id}>
                  <td><strong>{h.name}</strong></td>
                  <td style={{ fontSize: 12 }}>{h.manager}</td>
                  <td>{h.tables}</td>
                  <td><strong style={{ color: '#FF8A34' }}>{formatCurrency(h.revenue)}</strong></td>
                  <td><span className="badge badge-green">Active</span></td>
                  <td><button className="btn btn-ghost btn-sm">View →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Theft summary */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><div className="card-title">🚨 Recent Theft Reports</div><Link href="/franchise/theft"><button className="btn btn-outline btn-sm">Review All</button></Link></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Hotel</th><th>Ingredient</th><th>Loss</th><th>Status</th></tr></thead>
            <tbody>
              {THEFT_REPORTS.map(r => (
                <tr key={r.id}>
                  <td>{r.hotel}</td>
                  <td>{r.ingredient} ({r.qty} {r.unit})</td>
                  <td style={{ color: '#FF3B30', fontWeight: 700 }}>₹{r.loss.toLocaleString()}</td>
                  <td><span className={`badge ${r.status === 'verified' ? 'badge-red' : r.status === 'submitted' ? 'badge-orange' : 'badge-gray'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default FranchiseDash;
