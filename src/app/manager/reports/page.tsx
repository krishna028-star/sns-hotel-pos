'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function ManagerReports() {
  const { activeOrders = [], orders = [] } = useData();

  const allOrders = [...(Array.isArray(orders) ? orders : []), ...(Array.isArray(activeOrders) ? activeOrders : [])];
  
  const realOrders = allOrders.length || 0;
  const realTotal = allOrders.reduce((a: number, b: any) => a + Number(b.totalAmount || b.total || 0), 0);
  const realAvg = realOrders ? Math.round(realTotal / realOrders) : 0;

  // Derive Top Items
  const itemCounts: Record<string, { qty: number; revenue: number }> = {};
  allOrders.forEach(o => {
    (o.items || []).forEach((i: any) => {
      const name = i.name || 'Item';
      if (!itemCounts[name]) itemCounts[name] = { qty: 0, revenue: 0 };
      itemCounts[name].qty += Number(i.quantity || i.qty || 1);
      itemCounts[name].revenue += Number(i.price || 0) * Number(i.quantity || i.qty || 1);
    });
  });
  const topItemsData = Object.entries(itemCounts)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Derive Hourly Sales (Today)
  const todayOrders = allOrders.filter(o => new Date(o.createdAt || o.updatedAt || Date.now()).toDateString() === new Date().toDateString());
  const hourly: Record<string, number> = {};
  todayOrders.forEach(o => {
    const hour = new Date(o.createdAt || o.updatedAt || Date.now()).getHours();
    const label = `${hour > 12 ? hour - 12 : hour || 12}${hour >= 12 ? 'pm' : 'am'}`;
    hourly[label] = (hourly[label] || 0) + Number(o.totalAmount || o.total || 0);
  });
  const hourlySalesData = Object.entries(hourly).map(([hour, revenue]) => ({ hour, revenue }));

  // Derive 7-day Sales Trend
  const salesTrendData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const revenue = allOrders
      .filter(o => new Date(o.createdAt || o.updatedAt || Date.now()).toDateString() === d.toDateString())
      .reduce((a, b) => a + Number(b.totalAmount || b.total || 0), 0);
    return { date: label, revenue };
  });

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
            <AreaChart data={salesTrendData}>
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
            <BarChart data={hourlySalesData}>
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
              {topItemsData.map((item, i) => {
                const total = topItemsData.reduce((a, b) => a + b.revenue, 0);
                const pct = total ? ((item.revenue / total) * 100).toFixed(0) : 0;
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
              {topItemsData.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', color: '#94A3B8' }}>No sales data yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ManagerReports;
