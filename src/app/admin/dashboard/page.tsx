'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth';
import { formatCurrency, AUDIT_LOGS, SALES_TREND } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

function AdminDash() {
  const { users } = useAuth();
  const { tenants, auditLogs, metrics } = useData();

  const dashMetrics = [
    { label: 'Global Revenue (Today)', value: formatCurrency(metrics.totalRevenue), trend: 'Real-time', icon: '💰', color: '#2E5AFF', bg: '#e8edff' },
    { label: 'Active Tenants', value: String(metrics.tenants), trend: 'Primary Clients', icon: '🏢', color: '#1ABC9C', bg: '#e8fdf7' },
    { label: 'Total Orders', value: String(metrics.orders), trend: 'Across all hotels', icon: '📋', color: '#FF8A34', bg: '#fff3e8' },
    { label: 'System Users', value: String(metrics.users), trend: 'Registered accounts', icon: '👥', color: '#F39C12', bg: '#fffbec' },
  ];

  return (
    <DashboardLayout title="Main Admin Dashboard">
      {/* Welcome banner */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1a2744 100%)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ fontSize: 40 }}>🛡️</div>
        <div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>SNS Hotels POS — Admin Control Center</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>You have full system access across all tenants. Today is {new Date().toDateString()}.</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <Link href="/admin/sales"><button className="btn btn-primary btn-sm">📊 Sales View</button></Link>
          <Link href="/admin/inventory"><button className="btn btn-outline btn-sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>📦 Inventory</button></Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        {dashMetrics.map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 22 }}>{m.value}</div>
            <div className="metric-trend trend-up">{m.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts + Quick actions */}
      <div className="charts-grid">
        {/* Revenue trend */}
        <div className="chart-card">
          <div className="chart-title">📈 Global Revenue Trend (Last 7 Days)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SALES_TREND}>
              <defs>
                <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E5AFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2E5AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#2E5AFF" strokeWidth={2} fill="url(#rv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick links */}
        <div className="chart-card">
          <div className="chart-title">⚡ Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { href: '/admin/tenants', icon: '🏢', label: 'Manage Tenants', sub: `${tenants.length} total`, color: '#1ABC9C' },
              { href: '/admin/users', icon: '👥', label: 'Manage All Users', sub: `${users.length} registered`, color: '#2E5AFF' },
              { href: '/admin/audit', icon: '📋', label: 'View Audit Logs', sub: `${AUDIT_LOGS.length} entries`, color: '#9B59B6' },
              { href: '/admin/anticipate', icon: '🔮', label: 'Anticipate View', sub: '7-day forecast ready', color: '#FF8A34' },
              { href: '/admin/config', icon: '⚙️', label: 'Global Config', sub: 'Taxes, gateways, policies', color: '#F39C12' },
            ].map(item => (
              <Link href={item.href} key={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--bg)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s', border: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = item.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{item.sub}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tenants table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🏢 Active Tenants (Main Clients)</div>
          <Link href="/admin/tenants"><button className="btn btn-outline btn-sm">View All</button></Link>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Tenant</th><th>Domain</th><th>Plan</th><th>Hotels</th><th>Status</th><th>Created</th></tr></thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#94A3B8', fontSize: 13 }}>No tenants yet. Add your first tenant to get started.</td></tr>
              ) : (
                tenants.map((t: any) => (
                  <tr key={t.id}>
                    <td><strong>{t.name}</strong></td>
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 12 }}>{t.domain}</td>
                    <td><span className="badge badge-blue">{t.plan}</span></td>
                    <td>{t.hotels || 0}</td>
                    <td><span className={`badge ${t.status === 'active' ? 'badge-green' : t.status === 'trial' ? 'badge-orange' : 'badge-red'}`}>{t.status}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{t.created}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent audit logs */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div className="card-title">📋 Recent Audit Log</div>
          <Link href="/admin/audit"><button className="btn btn-outline btn-sm">View All</button></Link>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Resource</th><th>Severity</th></tr></thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#94A3B8', fontSize: 13 }}>No audit logs yet. Actions by users will appear here.</td></tr>
              ) : (
                auditLogs.slice(0, 5).map((log: any) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{new Date(log.createdAt).toLocaleTimeString()}</td>
                    <td><strong>{log.user?.name || log.userId}</strong><br /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.user?.role}</span></td>
                    <td><span className="badge badge-gray">{log.action}</span></td>
                    <td style={{ fontSize: 12 }}>{log.entity} #{log.entityId}</td>
                    <td><span className="badge badge-green">info</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AdminDashboardPage() {
  return <AdminDash />;
}
