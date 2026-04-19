'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const stockTrend = [
  { week:'W10', value:520000 },{ week:'W11', value:490000 },
  { week:'W12', value:510000 },{ week:'W13', value:468000 },
];

function AdminInventory() {
  const { ingredients, theftReports, purchaseOrders } = useData();
  const low = ingredients.filter((i: any) => i.status !== 'ok');

  return (
    <DashboardLayout title="Inventory Stock Dashboard — Global">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📦 Inventory Stock Dashboard</div>
          <div className="page-header-sub">Global stock levels, theft reports & purchase orders</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm">⬇ Export</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns:'repeat(4,1fr)' }}>
        {[
          { label:'Total Stock Value', value:'₹45.2L', icon:'💰', color:'#2E5AFF', bg:'#e8edff' },
          { label:'Low Stock Items', value: String(low.length), icon:'⚠️', color:'#FF8A34', bg:'#fff3e8' },
          { label:'Active Theft Reports', value: String(theftReports.length), icon:'🚨', color:'#FF3B30', bg:'#fff0ef' },
          { label:'Pending POs', value: String(purchaseOrders.filter((p: any) => p.status === 'pending').length), icon:'📋', color:'#9B59B6', bg:'#f3eeff' },
        ].map(m=>(
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background:m.bg, color:m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color:m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📉 Stock Value Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stockTrend}>
              <XAxis dataKey="week" tick={{ fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip formatter={(v:unknown)=>[formatCurrency(Number(v)),'Stock Value']} contentStyle={{ borderRadius:8,fontSize:12 }}/>
              <Line type="monotone" dataKey="value" stroke="#2E5AFF" strokeWidth={2.5} dot={{ r:4 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">🚨 Theft Reports by Status</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:8 }}>
            {[
              { label:'Submitted', count: theftReports.filter((t: any) => t.status === 'submitted').length, color:'#FF8A34' },
              { label:'Verified', count: theftReports.filter((t: any) => t.status === 'verified').length, color:'#FF3B30' },
              { label:'Rejected', count: theftReports.filter((t: any) => t.status === 'rejected').length, color:'#00C48C' },
            ].map(s=>(
              <div key={s.label} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, flexShrink:0 }}/>
                <span style={{ fontSize:13, flex:1 }}>{s.label}</span>
                <strong>{s.count}</strong>
                <div className="progress-bar" style={{ width:80 }}>
                  <div className="progress-fill" style={{ width:`${s.count*16}%`, background:s.color }}/>
                </div>
              </div>
            ))}
          </div>
          <div className="divider"/>
          <div style={{ fontSize:12, color:'var(--text-secondary)' }}>Total estimated loss: <strong style={{ color:'var(--danger)' }}>{formatCurrency(theftReports.reduce((sum: number, t: any) => sum + (t.loss || 0), 0))}</strong></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">⚠️ Low Stock Ingredients (Global)</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Ingredient</th><th>Category</th><th>Current Stock</th><th>Reorder Level</th><th>Status</th><th>Est. Value</th></tr></thead>
            <tbody>
              {low.map((ing: any)=>(
                <tr key={ing.id}>
                  <td><strong>{ing.name}</strong></td>
                  <td style={{ color:'var(--text-secondary)' }}>{ing.category}</td>
                  <td>{ing.stock} {ing.unit}</td>
                  <td>{ing.reorder} {ing.unit}</td>
                  <td><span className={`badge ${ing.status==='critical'?'badge-red':'badge-orange'}`}>{ing.status}</span></td>
                  <td>{formatCurrency(ing.stock * ing.unitCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop:16 }}>
        <div className="card-header"><div className="card-title">📋 Theft Reports</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Item</th><th>Qty Lost</th><th>Est. Loss</th><th>Hotel</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {theftReports.map((t: any)=>(
                <tr key={t.id}>
                  <td><strong>{t.ingredient}</strong></td>
                  <td>{t.qty} {t.unit}</td>
                  <td style={{ color:'var(--danger)' }}>{formatCurrency(t.loss)}</td>
                  <td style={{ fontSize:12 }}>{t.hotel}</td>
                  <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{t.date}</td>
                  <td><span className={`badge ${t.status==='verified'?'badge-red':t.status==='submitted'?'badge-orange':'badge-green'}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default function AdminInventoryPage() { return <AdminInventory/>; }
