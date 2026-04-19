'use client';
import React from 'react';

import { useRouter } from "next/navigation";
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function FranchiseInventory() {
  const router = useRouter();
  const { ingredients, purchaseOrders, theftReports } = useData();

  const critical = ingredients.filter((i: any) => i.status === 'critical').length;
  const pendingPos = purchaseOrders.filter((p: any) => p.status === 'pending_approval' || p.status === 'pending').length;
  const totalTheft = theftReports.reduce((a: number, r: any) => a + (r.loss || 0), 0);

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
          { label: 'Total Ingredients', value: ingredients.length, color: '#00C48C', bg: '#e8fdf7', icon: '📦' },
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
          <button className="btn btn-danger btn-sm" onClick={() => router.push("/franchise/approvals")}>Review POs →</button>
        </div>
      )}

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">📊 Stock Status Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { name: 'OK', count: ingredients.filter((i: any)=>i.status==='ok').length },
              { name: 'Low', count: ingredients.filter((i: any)=>i.status==='low').length },
              { name: 'Critical', count: ingredients.filter((i: any)=>i.status==='critical').length },
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
          {purchaseOrders.filter((p: any) => p.status === 'pending_approval' || p.status === 'pending').map((po: any) => (
            <div key={po.id} style={{ padding: '12px 0', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{po.id}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{po.supplier} · {po.items} items</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: '#2E5AFF' }}>{formatCurrency(po.amount)}</div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 4 }} onClick={() => router.push("/franchise/approvals")}>Approve</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
export default FranchiseInventory;
