'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';

function ManagerInventory() {
  const { ingredients } = useData();
  const critical = ingredients.filter((i: any) => i.status === 'critical');
  const low = ingredients.filter((i: any) => i.status === 'low');

  return (
    <DashboardLayout title="Inventory Overview">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📦 Inventory Overview</div>
          <div className="page-header-sub">Current stock levels for SNS Beach Resort</div>
        </div>
        <div className="stats-row">
          <div className="stat-pill"><strong style={{ color: '#FF3B30' }}>{critical.length}</strong> Critical</div>
          <div className="stat-pill"><strong style={{ color: '#FF8A34' }}>{low.length}</strong> Low</div>
        </div>
      </div>

      {(critical.length + low.length) > 0 && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          <span>⚠️</span>
          <span><strong>{critical.length} critical</strong> and <strong>{low.length} low stock</strong> items need attention. Contact your Inventory Manager.</span>
        </div>
      )}

      <div className="card">
        <div className="card-header"><div className="card-title">All Ingredients</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Ingredient</th><th>Category</th><th>Stock</th><th>Reorder Point</th><th>Level</th><th>Status</th></tr></thead>
            <tbody>
              {ingredients.map((i: any) => {
                const pct = Math.min(100, ((i.stock || 0) / ((i.reorder || 1) * 2)) * 100);
                return (
                  <tr key={i.id}>
                    <td><strong>{i.name}</strong></td>
                    <td><span className="badge badge-gray">{i.category}</span></td>
                    <td style={{ fontWeight: 600 }}>{i.stock} {i.unit}</td>
                    <td style={{ color: '#94A3B8', fontSize: 12 }}>{i.reorder} {i.unit}</td>
                    <td>
                      <div className="stock-bar">
                        <div className={`stock-fill stock-${i.status}`} style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${i.status === 'critical' ? 'badge-red' : i.status === 'low' ? 'badge-orange' : 'badge-green'}`}>
                        {i.status === 'critical' ? '🔴 Critical' : i.status === 'low' ? '🟡 Low' : '✅ OK'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ManagerInventory;
