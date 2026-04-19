'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SALES_TREND } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';
import { formatCurrency } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function FranchiseSales() {
  const { hotels, activeOrders } = useData();
  const liveOrderTotal = activeOrders.reduce((a: number, o: any) => a + (o.total || 0), 0);
  const totalRevenue = 420000 + liveOrderTotal;
  const totalOrders = 1120 + activeOrders.length;

  return (
    <DashboardLayout title="Franchise Sales Dashboard">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📊 Sales Dashboard</div>
          <div className="page-header-sub">Revenue analytics across all hotels in your franchise</div>
        </div>
        <select className="form-select" style={{ width: 140 }}><option>This Month</option><option>Last Month</option></select>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Franchise Revenue', value: formatCurrency(totalRevenue), trend: '↑ 11%', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Total Orders', value: totalOrders.toLocaleString(), trend: '↑ 7%', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Avg. Daily Revenue', value: formatCurrency(hotels.length ? Math.round(totalRevenue / hotels.length) : 0), trend: 'Per hotel', color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Active Hotels', value: String(hotels.length), trend: 'Local network', color: '#9B59B6', bg: '#f5f0ff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 20 }}>{m.value}</div>
            <div className="metric-trend trend-up">{m.trend}</div>
          </div>
        ))}
      </div>

      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-title">📈 Revenue Trend</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={SALES_TREND}>
            <defs><linearGradient id="fsag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF8A34" stopOpacity={0.3}/><stop offset="95%" stopColor="#FF8A34" stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: any)=>[formatCurrency(Number(v)),'Revenue']} contentStyle={{ borderRadius: 8 }} />
            <Area type="monotone" dataKey="revenue" stroke="#FF8A34" strokeWidth={2.5} fill="url(#fsag)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">🏨 Revenue by Hotel</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Hotel</th><th>Revenue</th><th>Orders</th><th>Share</th></tr></thead>
            <tbody>
              {hotels.map((h: any) => {
                const total = hotels.reduce((s: number, x: any) => s + (x.revenue || 0), 0) || 1;
                const pct = (((h.revenue || 0) / total) * 100).toFixed(0);
                return (
                  <tr key={h.name}>
                    <td><strong>{h.name}</strong></td>
                    <td><strong style={{ color: '#FF8A34' }}>{formatCurrency(h.revenue || 0)}</strong></td>
                    <td>{h.orders || 0}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 80 }}><div className="progress-fill" style={{ width: `${pct}%`, background: '#FF8A34' }} /></div>
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
export default FranchiseSales;
