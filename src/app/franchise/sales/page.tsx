'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SALES_TREND, FRANCHISE_SALES, formatCurrency } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function FranchiseSales() {
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
          { label: 'Franchise Revenue', value: '₹4.2L', trend: '↑ 11%', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Total Orders', value: '1,120', trend: '↑ 7%', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Avg. Daily Revenue', value: '₹14,000', trend: 'Per hotel', color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Highest Hotel', value: 'SNS Central', trend: '₹1.8L revenue', color: '#9B59B6', bg: '#f5f0ff' },
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
              {[{ name: 'SNS Beach Resort', revenue: 140000, orders: 385 }, { name: 'SNS Central', revenue: 180000, orders: 490 }, { name: 'SNS Mountain View', revenue: 125000, orders: 340 }].map(h => {
                const total = 445000;
                const pct = ((h.revenue / total) * 100).toFixed(0);
                return (
                  <tr key={h.name}>
                    <td><strong>{h.name}</strong></td>
                    <td><strong style={{ color: '#FF8A34' }}>{formatCurrency(h.revenue)}</strong></td>
                    <td>{h.orders}</td>
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
