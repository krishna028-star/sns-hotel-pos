'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SALES_TREND, FRANCHISE_SALES, formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

function ClientSales() {
  const { hotels = [], activeOrders = [] } = useData();
  const safeHotels = Array.isArray(hotels) ? hotels : [];
  const safeOrders = Array.isArray(activeOrders) ? activeOrders : [];

  const baseRevenue = FRANCHISE_SALES.reduce((a, f) => a + f.revenue, 0);
  const liveOrderTotal = safeOrders.reduce((a: number, o: any) => a + (o.total || 0), 0);
  const totalRevenue = baseRevenue + liveOrderTotal;
  const baseOrders = FRANCHISE_SALES.reduce((a,f)=>a+f.orders,0);
  const totalOrders = baseOrders + safeOrders.length;
  const COLORS = ['#2E5AFF', '#00C48C', '#FF8A34', '#9B59B6'];

  return (
    <DashboardLayout title="Chain Sales Dashboard">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📊 Chain Sales Dashboard</div>
          <div className="page-header-sub">Consolidated revenue across all regions and hotels</div>
        </div>
        <div className="page-header-actions">
          <select className="form-select" style={{ width: 140 }}><option>This Month</option><option>Last Month</option><option>This Quarter</option></select>
          <button className="btn btn-outline">📥 Export</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Chain Revenue', value: formatCurrency(totalRevenue), trend: '↑ 14%', color: '#1ABC9C', bg: '#e6faf7' },
          { label: 'Total Orders', value: totalOrders.toLocaleString(), trend: '↑ 9%', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Active Hotels', value: String(safeHotels.length), trend: 'Across 4 regions', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Avg. Revenue/Hotel', value: formatCurrency(safeHotels.length ? Math.round(totalRevenue / safeHotels.length) : 0), trend: 'Per month', color: '#9B59B6', bg: '#f5f0ff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 20 }}>{m.value}</div>
            <div className="metric-trend trend-up">{m.trend}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📈 Revenue Trend (Last 7 Days)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SALES_TREND}>
              <defs><linearGradient id="csg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1ABC9C" stopOpacity={0.3}/><stop offset="95%" stopColor="#1ABC9C" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v:any)=>[formatCurrency(Number(v)),'Revenue']} contentStyle={{ borderRadius: 8 }} />
              <Area type="monotone" dataKey="revenue" stroke="#1ABC9C" strokeWidth={2.5} fill="url(#csg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-title">🌍 Revenue by Region</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={FRANCHISE_SALES} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={(props: any) => `${(props.name ?? '').split(' ')[0]} ${((props.percent ?? 0)*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {FRANCHISE_SALES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v:any)=>[formatCurrency(Number(v)),'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginTop: 0 }}>
        <div className="card-header"><div className="card-title">🌍 Revenue by Region</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Region</th><th>Head</th><th>Hotels</th><th>Orders</th><th>Revenue</th><th>Share</th></tr></thead>
            <tbody>
              {FRANCHISE_SALES.map((f, i) => (
                <tr key={f.name}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }} /><strong>{f.name}</strong></div></td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>Regional Head</td>
                  <td>{f.hotels}</td>
                  <td>{f.orders.toLocaleString()}</td>
                  <td><strong style={{ color: '#1ABC9C' }}>{formatCurrency(f.revenue)}</strong></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="progress-bar" style={{ width: 80 }}><div className="progress-fill" style={{ width: `${(f.revenue/totalRevenue*100).toFixed(0)}%`, background: COLORS[i] }} /></div>
                      <span style={{ fontSize: 12 }}>{(f.revenue/totalRevenue*100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ClientSales;
