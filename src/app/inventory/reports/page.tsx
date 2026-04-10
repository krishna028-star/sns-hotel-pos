'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { INGREDIENTS, THEFT_REPORTS, PURCHASE_ORDERS, formatCurrency } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function InventoryReports() {
  const totalValue = INGREDIENTS.reduce((a, i) => a + i.stock * i.unitCost, 0);
  const categoryData = [...new Set(INGREDIENTS.map(i => i.category))].map(cat => ({
    name: cat,
    value: INGREDIENTS.filter(i => i.category === cat).reduce((a, i) => a + i.stock * i.unitCost, 0),
  }));

  return (
    <DashboardLayout title="Inventory Reports">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📈 Inventory Reports</div>
          <div className="page-header-sub">Stock valuation, usage analytics, and procurement summary</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline">📥 Export PDF</button>
          <button className="btn btn-primary">📊 Export Excel</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Stock Value', value: formatCurrency(totalValue), color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Total Ingredients', value: INGREDIENTS.length, color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Theft Loss (MTD)', value: `₹${THEFT_REPORTS.reduce((a,r)=>a+r.loss,0).toLocaleString()}`, color: '#FF3B30', bg: '#fff0ef' },
          { label: 'POs This Month', value: PURCHASE_ORDERS.length, color: '#FF8A34', bg: '#fff3e8' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 20 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">💰 Stock Value by Category</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => [formatCurrency(Number(v)), 'Value']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" fill="#00C48C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <div className="chart-title">📋 Stock Health</div>
          {[
            { label: 'Healthy Items', value: INGREDIENTS.filter(i=>i.status==='ok').length, total: INGREDIENTS.length, color: '#00C48C' },
            { label: 'Low Stock', value: INGREDIENTS.filter(i=>i.status==='low').length, total: INGREDIENTS.length, color: '#FF8A34' },
            { label: 'Critical', value: INGREDIENTS.filter(i=>i.status==='critical').length, total: INGREDIENTS.length, color: '#FF3B30' },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{s.label}</span>
                <span style={{ color: s.color, fontWeight: 700 }}>{s.value}/{s.total}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(s.value/s.total)*100}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📦 Full Stock Valuation</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Ingredient</th><th>Category</th><th>Stock</th><th>Unit Cost</th><th>Total Value</th><th>Status</th></tr></thead>
            <tbody>
              {INGREDIENTS.map(i => (
                <tr key={i.id}>
                  <td><strong>{i.name}</strong></td>
                  <td>{i.category}</td>
                  <td>{i.stock} {i.unit}</td>
                  <td>₹{i.unitCost}/{i.unit}</td>
                  <td><strong style={{ color: '#00C48C' }}>{formatCurrency(i.stock * i.unitCost)}</strong></td>
                  <td><span className={`badge ${i.status==='critical'?'badge-red':i.status==='low'?'badge-orange':'badge-green'}`}>{i.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default InventoryReports;
