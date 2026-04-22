'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';

function LowStockAlerts() {
  const router = useRouter();
  const { ingredients = [] } = useData();

  const safeItems = Array.isArray(ingredients) ? ingredients : [];

  // FIX: status is computed in fetchInventory() server action — no `status` column in DB
  const critical = safeItems.filter((i: any) => i.status === 'critical');
  const low = safeItems.filter((i: any) => i.status === 'low');

  const stockPct = (i: any) =>
    Math.min(100, (Number(i.stockQuantity) / Math.max(Number(i.reorderLevel), 0.001)) * 100);

  return (
    <DashboardLayout title="Low Stock Alerts">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">⚠️ Low Stock Alerts</div>
          <div className="page-header-sub">Ingredients that need immediate attention or reorder</div>
        </div>
        <div className="stats-row">
          <div className="stat-pill"><strong style={{ color: '#FF3B30' }}>{critical.length}</strong> Critical</div>
          <div className="stat-pill"><strong style={{ color: '#FF8A34' }}>{low.length}</strong> Low</div>
        </div>
      </div>

      {critical.length > 0 && (
        <>
          <div style={{ fontWeight: 700, color: '#FF3B30', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>🔴 Critical — Order Immediately</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {critical.map((i: any) => (
              <div key={i.id} className="card" style={{ border: '2px solid #FF3B30' }}>
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{i.name}</div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                      Current: <strong style={{ color: '#FF3B30' }}>{Number(i.stockQuantity).toFixed(2)} {i.unit}</strong>
                      &nbsp;·&nbsp;
                      Reorder at: {Number(i.reorderLevel).toFixed(2)} {i.unit}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>Stock Level</div>
                    <div style={{ width: 80 }}>
                      <div className="progress-bar">
                        <div className="progress-fill stock-critical" style={{ width: `${stockPct(i)}%` }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>Unit Cost</div>
                    <div style={{ fontWeight: 700 }}>{formatCurrency(Number(i.unitCost))}/{i.unit}</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => router.push('/inventory/purchase-orders')}>🛒 Create PO</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {low.length > 0 && (
        <>
          <div style={{ fontWeight: 700, color: '#FF8A34', marginBottom: 10 }}>🟡 Low Stock — Reorder Soon</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {low.map((i: any) => (
              <div key={i.id} className="card" style={{ border: '2px solid #FF8A34' }}>
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{i.name}</div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                      Current: <strong style={{ color: '#FF8A34' }}>{Number(i.stockQuantity).toFixed(2)} {i.unit}</strong>
                      &nbsp;·&nbsp;
                      Reorder at: {Number(i.reorderLevel).toFixed(2)} {i.unit}
                    </div>
                  </div>
                  <div style={{ width: 80 }}>
                    <div className="progress-bar">
                      <div className="progress-fill stock-low" style={{ width: `${stockPct(i)}%` }} />
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm" style={{ borderColor: '#FF8A34', color: '#FF8A34' }} onClick={() => router.push('/inventory/purchase-orders')}>+ Create PO</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {critical.length === 0 && low.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-title">All Stock Levels Healthy</div>
            <div className="empty-state-sub">
              {safeItems.length === 0
                ? 'No inventory items found. Add ingredients to start tracking.'
                : 'No critical or low-stock items at this time.'}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default LowStockAlerts;
