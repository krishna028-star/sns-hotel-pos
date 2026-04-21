'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';

function ClientInventory() {
  const { ingredients = [], theftReports = [], purchaseOrders = [] } = useData();

  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];
  const safeThefts = Array.isArray(theftReports) ? theftReports : [];
  const safePOs = Array.isArray(purchaseOrders) ? purchaseOrders : [];

  const totalValue = safeIngredients.reduce((a: number, i: any) => a + (i.stock || 0) * (i.unitCost || 0), 0);
  const critical = safeIngredients.filter((i: any) => i.status === 'critical').length;
  const totalTheft = safeThefts.reduce((a: number, r: any) => a + (r.loss || 0), 0);
  const pendingPOs = safePOs.filter((p: any) => p.status === 'pending_approval' || p.status === 'pending').length;

  return (
    <DashboardLayout title="Chain Inventory Overview">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📦 Chain Inventory Overview</div>
          <div className="page-header-sub">Consolidated inventory status across all hotels</div>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Stock Value', value: formatCurrency(totalValue), color: '#1ABC9C', bg: '#e6faf7' },
          { label: 'Critical Items', value: critical, color: '#FF3B30', bg: '#fff0ef' },
          { label: 'Monthly Theft Loss', value: formatCurrency(totalTheft), color: '#9B59B6', bg: '#f5f0ff' },
          { label: 'Pending PO Approvals', value: pendingPOs, color: '#FF8A34', bg: '#fff3e8' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 20 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {(critical > 0 || pendingPOs > 0) && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          <span>⚠️</span>
          <span><strong>{critical} critical stock</strong> items and <strong>{pendingPOs} POs</strong> awaiting approval across the chain.</span>
        </div>
      )}

      <div className="card">
        <div className="card-header"><div className="card-title">📦 Stock Overview by Hotel</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Hotel</th><th>Total Items</th><th>Critical</th><th>Stock Value</th><th>Theft (Month)</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { hotel: 'SNS Beach Resort', items: 10, critical: 3, value: 68200, theft: 2360 },
                { hotel: 'SNS Central', items: 12, critical: 1, value: 84500, theft: 0 },
                { hotel: 'SNS Mountain View', items: 8, critical: 0, value: 52100, theft: 1200 },
              ].map(h => (
                <tr key={h.hotel}>
                  <td><strong>{h.hotel}</strong></td>
                  <td>{h.items}</td>
                  <td style={{ color: h.critical > 0 ? '#FF3B30' : '#00C48C', fontWeight: 700 }}>{h.critical}</td>
                  <td><strong style={{ color: '#1ABC9C' }}>{formatCurrency(h.value)}</strong></td>
                  <td style={{ color: h.theft > 0 ? '#FF3B30' : '#64748B', fontWeight: h.theft > 0 ? 700 : 400 }}>{h.theft > 0 ? formatCurrency(h.theft) : '—'}</td>
                  <td><span className={`badge ${h.critical > 0 ? 'badge-orange' : 'badge-green'}`}>{h.critical > 0 ? 'Needs Attention' : 'Healthy'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header"><div className="card-title">🚨 Theft Report Summary</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Hotel</th><th>Item</th><th>Loss</th><th>Status</th></tr></thead>
            <tbody>
              {safeThefts.map((r: any) => (
                <tr key={r.id}>
                  <td style={{ fontSize: 12 }}>{r.date}</td>
                  <td>{r.hotel?.name || r.hotel}</td>
                  <td>{r.ingredient?.name || r.ingredient} — {r.qty}{r.unit}</td>
                  <td style={{ color: '#FF3B30', fontWeight: 700 }}>{formatCurrency(r.loss || 0)}</td>
                  <td><span className={`badge ${r.status==='verified'?'badge-red':r.status==='submitted'?'badge-orange':'badge-gray'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ClientInventory;
