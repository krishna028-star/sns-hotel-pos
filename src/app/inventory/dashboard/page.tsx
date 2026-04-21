'use client';
import React, { useState } from 'react';

import { useRouter } from "next/navigation";
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';

function InventoryDash() {
  const router = useRouter();
  const { inventory: ingredients = [], purchaseOrders = [] } = useData();
  
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];
  const safePO = Array.isArray(purchaseOrders) ? purchaseOrders : [];

  const critical = safeIngredients.filter((i: any) => i.status === 'critical').length;
  const low = safeIngredients.filter((i: any) => i.status === 'low').length;
  const totalValue = safeIngredients.reduce((a: number, i: any) => a + (i.stockQuantity || 0) * (i.unitPrice || 0), 0);

  return (
    <DashboardLayout title="Inventory Dashboard">
      <div style={{ background: 'linear-gradient(135deg,#00C48C 0%,#009e71 100%)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ fontSize: 40 }}>📦</div>
        <div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>SNS Beach Resort — Inventory</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>{safeIngredients.length} Ingredients · {critical + low} alerts · Live tracking</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <button className="btn btn-sm" style={{ background: '#fff', color: '#00C48C' }} onClick={() => router.push("/inventory/stock")}>📦 Stock</button>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => router.push("/inventory/theft")}>🚨 File Report</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Stock Value', value: formatCurrency(totalValue), icon: '💰', color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Critical Items', value: critical, icon: '🔴', color: '#FF3B30', bg: '#fff0ef' },
          { label: 'Low Stock Items', value: low, icon: '🟡', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Pending POs', value: safePO.filter((p: any) => p.status !== 'received').length, icon: '📋', color: '#2E5AFF', bg: '#e8edff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Critical Alerts */}
      {critical > 0 && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          <span>🚨</span>
          <span><strong>{critical} ingredient(s) are critically low</strong> — Chicken, Milk, Butter. Order immediately!</span>
          <button className="btn btn-danger btn-sm" onClick={() => router.push("/inventory/purchase-orders")}>Create PO</button>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">📦 Stock Overview</div>
          <button className="btn btn-outline btn-sm" onClick={() => router.push("/inventory/stock")}>View All</button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Ingredient</th><th>Category</th><th>Stock</th><th>Reorder Level</th><th>Status</th><th>Value</th></tr></thead>
            <tbody>
              {safeIngredients.slice(0, 6).map((i: any) => (
                <tr key={i.id}>
                  <td><strong>{i.name}</strong></td>
                  <td style={{ fontSize: 12 }}>{i.category}</td>
                  <td>{i.stockQuantity} {i.unit}</td>
                  <td style={{ color: '#94A3B8', fontSize: 12 }}>{i.reorderPoint} {i.unit}</td>
                  <td>
                    <span className={`badge ${i.status === 'critical' ? 'badge-red' : i.status === 'low' ? 'badge-orange' : 'badge-green'}`}>
                      {i.status === 'critical' ? '🔴 Critical' : i.status === 'low' ? '🟡 Low' : '✅ OK'}
                    </span>
                  </td>
                  <td><strong style={{ color: '#00C48C' }}>{formatCurrency(i.stockQuantity * i.unitPrice)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div className="card-title">📋 Recent Purchase Orders</div>
          <button className="btn btn-outline btn-sm" onClick={() => router.push("/inventory/purchase-orders")}>Manage POs</button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>PO #</th><th>Supplier</th><th>Amount</th><th>Items</th><th>Status</th></tr></thead>
            <tbody>
              {safePO.map((po: any) => (
                <tr key={po.id}>
                  <td><strong>{po.id}</strong></td>
                  <td>{po.supplier}</td>
                  <td><strong style={{ color: '#2E5AFF' }}>{formatCurrency(po.totalAmount)}</strong></td>
                  <td>{po.items?.length || 0} items</td>
                  <td><span className={`badge ${po.status === 'received' ? 'badge-green' : po.status === 'pending_approval' ? 'badge-orange' : po.status === 'ordered' ? 'badge-blue' : 'badge-gray'}`}>{po.status.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default InventoryDash;
