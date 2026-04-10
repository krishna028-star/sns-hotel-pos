'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SALES_TREND, TOP_ITEMS, TABLES, formatCurrency } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function ManagerSales() {
  return (
    <DashboardLayout title="Sales Report">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📊 Sales Report</div>
          <div className="page-header-sub">Revenue and order analysis for SNS Beach Resort</div>
        </div>
        <select className="form-select" style={{ width: 140 }}>
          <option>Today</option><option selected>This Week</option><option>This Month</option>
        </select>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Revenue (Week)', value: '₹7,38,500', trend: '↑ 12%', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Total Orders', value: '1,847', trend: '↑ 8%', color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Avg. Bill', value: '₹400', trend: '↑ 4%', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Table Turns/Day', value: '3.8×', trend: 'Efficiency', color: '#9B59B6', bg: '#f5f0ff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
            <div className="metric-trend trend-up">{m.trend}</div>
          </div>
        ))}
      </div>

      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-title">📈 Daily Revenue (This Week)</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={SALES_TREND}>
            <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2E5AFF" stopOpacity={0.3}/><stop offset="95%" stopColor="#2E5AFF" stopOpacity={0}/></linearGradient></defs>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v:any)=>[formatCurrency(Number(v)),'Revenue']} contentStyle={{ borderRadius: 8 }} />
            <Area type="monotone" dataKey="revenue" stroke="#2E5AFF" strokeWidth={2.5} fill="url(#mg)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">🏆 Top Dishes This Week</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Rank</th><th>Dish</th><th>Orders</th><th>Revenue</th></tr></thead>
            <tbody>
              {TOP_ITEMS.map((item, i) => (
                <tr key={item.name}>
                  <td><span style={{ width: 26, height: 26, borderRadius: '50%', background: i<3?'#2E5AFF':'#F4F6FB', color: i<3?'#fff':'#64748B', display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12 }}>{i+1}</span></td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.qty}</td>
                  <td><strong style={{ color: '#2E5AFF' }}>{formatCurrency(item.revenue)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ManagerSales;
