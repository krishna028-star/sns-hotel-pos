'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { INGREDIENTS, THEFT_REPORTS, PURCHASE_ORDERS, formatCurrency } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function FranchiseInventory() {
  const critical = INGREDIENTS.filter(i => i.status === 'critical').length;
  const pendingPos = PURCHASE_ORDERS.filter(p => p.status === 'pending_approval').length;
  const totalTheft = THEFT_REPORTS.reduce((a, r) => a + r.loss, 0);

  return (
    <DashboardLayout title="Franchise Inventory">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📦 Inventory Overview</div>
          <div className="page-header-sub">Cross-hotel inventory and procurement status</div>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Critical Stock Items', value: critical, color: '#FF3B30', bg: '#fff0ef', icon: '🔴' },
          { label: 'Pending PO Approvals', value: pendingPos, color: '#FF8A34', bg: '#fff3e8', icon: '📋' },
          { label: 'Theft Loss (Month)', value: formatCurrency(totalTheft), color: '#9B59B6', bg: '#f5f0ff', icon: '🚨' },
          { label: 'Total Ingredients', value: INGREDIENTS.length, color: '#00C48C', bg: '#e8fdf7', icon: '📦' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 22 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {critical > 0 && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          <span>🚨</span>
          <span><strong>{critical} items critically low</strong> across franchise hotels — POs need approval urgently.</span>
          <a href="/franchise/approvals" style={{ marginLeft: 'auto' }}><button className="btn btn-danger btn-sm">Review POs →</button></a>
        </div>
      )}

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📊 Stock Status Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { name: 'OK', count: INGREDIENTS.filter(i=>i.status==='ok').length },
              { name: 'Low', count: INGREDIENTS.filter(i=>i.status==='low').length },
              { name: 'Critical', count: INGREDIENTS.filter(i=>i.status==='critical').length },
            ]}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#FF8A34" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>📋 Pending Purchase Orders</div>
          {PURCHASE_ORDERS.filter(p => p.status === 'pending_approval').map(po => (
            <div key={po.id} style={{ padding: '12px 0', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{po.id}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{po.supplier} · {po.items} items</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: '#2E5AFF' }}>{formatCurrency(po.amount)}</div>
                <a href="/franchise/approvals"><button className="btn btn-primary btn-sm" style={{ marginTop: 4 }}>Approve</button></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
export default FranchiseInventory;
