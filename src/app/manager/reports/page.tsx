'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SALES_TREND, TOP_ITEMS, HOURLY_SALES, formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function ManagerReports() {
  const { activeOrders } = useData();

  const realOrders = 385 + activeOrders.length;
  const realTotal = 140000 + activeOrders.reduce((a: number, b: any) => a + (b.total || 0), 0);
  const realAvg = Math.round(realTotal / realOrders);

  return (
    <DashboardLayout title="Reports & Export">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📊 Reports & Analytics</div>
          <div className="page-header-sub">Sales, inventory usage, and staff performance reports</div>
        </div>
        <div className="page-header-actions">
          <select className="form-select" style={{ width: 160 }}>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Custom Range</option>
          </select>
          <button className="btn btn-outline">📥 Export PDF</button>
          <button className="btn btn-primary">📊 Export Excel</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: "Today's Revenue", value: formatCurrency(realTotal), trend: '↑ 18%', icon: '💰', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Total Orders', value: realOrders, trend: '↑ 10%', icon: '📋', color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Avg. Bill Value', value: formatCurrency(realAvg), trend: '↑ 7%', icon: '🧾', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Table Turnover', value: '3.2x', trend: 'Per table today', icon: '🔄', color: '#9B59B6', bg: '#f5f0ff' },
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
          <div className="chart-title">📈 Revenue Trend (7 days)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SALES_TREND}>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2E5AFF" stopOpacity={0.3} /><stop offset="95%" stopColor="#2E5AFF" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#2E5AFF" strokeWidth={2.5} fill="url(#rg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-title">⏰ Sales by Hour</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={HOURLY_SALES}>
              <XAxis dataKey="hour" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: unknown) => [formatCurrency(Number(v)), 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#2E5AFF" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">🍽️ Top Selling Items</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Item</th><th>Quantity Sold</th><th>Revenue</th><th>Share</th></tr></thead>
            <tbody>
              {TOP_ITEMS.map((item, i) => {
                const total = TOP_ITEMS.reduce((a, b) => a + b.revenue, 0);
                const pct = ((item.revenue / total) * 100).toFixed(0);
                return (
                  <tr key={item.name}>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: '#e8edff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: '#2E5AFF' }}>{i + 1}</span><strong>{item.name}</strong></div></td>
                    <td>{item.qty}</td>
                    <td><strong style={{ color: '#2E5AFF' }}>{formatCurrency(item.revenue)}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 80 }}><div className="progress-fill" style={{ width: `${pct}%`, background: '#2E5AFF' }} /></div>
                        <span style={{ fontSize: 12 }}>{pct}%</span>
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
export default ManagerReports;
