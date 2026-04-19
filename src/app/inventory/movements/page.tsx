'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const movements = [
  { date: 'Mar 30', ingredient: 'Chicken', type: 'Used', qty: -12, unit: 'kg', reason: 'Kitchen usage' },
  { date: 'Mar 30', ingredient: 'Butter', type: 'Used', qty: -2, unit: 'kg', reason: 'Kitchen usage' },
  { date: 'Mar 29', ingredient: 'Basmati Rice', type: 'Received', qty: +20, unit: 'kg', reason: 'PO-002 received' },
  { date: 'Mar 29', ingredient: 'Milk', type: 'Used', qty: -8, unit: 'ltr', reason: 'Kitchen usage' },
  { date: 'Mar 28', ingredient: 'Paneer', type: 'Adjustment', qty: -1, unit: 'kg', reason: 'Stock correction' },
  { date: 'Mar 28', ingredient: 'Tomatoes', type: 'Received', qty: +15, unit: 'kg', reason: 'PO-003 received' },
];

const typeColor: Record<string, string> = { Used: '#FF8A34', Received: '#00C48C', Adjustment: '#9B59B6' };
const typeBadge: Record<string, string> = { Used: 'badge-orange', Received: 'badge-green', Adjustment: 'badge-purple' };


function StockMovements() {
  const { ingredients } = useData();
  const usageData = ingredients.slice(0, 6).map((i: any) => ({ name: i.name, used: Math.floor(Math.random() * 15 + 2) }));

  return (
    <DashboardLayout title="Stock Movements">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🔄 Stock Movements</div>
          <div className="page-header-sub">Track all ingredient consumption, receipts, and adjustments</div>
        </div>
        <div className="page-header-actions">
          <select className="form-select" style={{ width: 140 }}>
            <option>Today</option><option>Last 7 days</option><option>This Month</option>
          </select>
          <button className="btn btn-outline">📥 Export</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Items Used', value: movements.filter(m => m.type === 'Used').length, color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Received', value: movements.filter(m => m.type === 'Received').length, color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Adjustments', value: movements.filter(m => m.type === 'Adjustment').length, color: '#9B59B6', bg: '#f5f0ff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 28 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid" style={{ marginBottom: 24 }}>
        <div className="chart-card">
          <div className="chart-title">📊 Top Used Ingredients (Today)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={usageData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="used" fill="#00C48C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>📋 Recent Movements</div>
          {movements.slice(0, 4).map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: typeColor[m.type], flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: 13 }}>
                <strong>{m.ingredient}</strong> · {m.type}
              </div>
              <span style={{ fontWeight: 700, color: m.qty > 0 ? '#00C48C' : '#FF8A34', fontSize: 13 }}>{m.qty > 0 ? '+' : ''}{m.qty} {m.unit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">All Movements</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Ingredient</th><th>Type</th><th>Quantity</th><th>Reason</th></tr></thead>
            <tbody>
              {movements.map((m, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12 }}>{m.date}</td>
                  <td><strong>{m.ingredient}</strong></td>
                  <td><span className={`badge ${typeBadge[m.type]}`}>{m.type}</span></td>
                  <td style={{ fontWeight: 700, color: m.qty > 0 ? '#00C48C' : '#FF8A34' }}>{m.qty > 0 ? '+' : ''}{m.qty} {m.unit}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{m.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default StockMovements;
