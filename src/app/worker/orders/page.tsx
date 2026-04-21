'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';

const statusColor: Record<string, string> = { ready: '#00C48C', cooking: '#FF8A34', kot_sent: '#2E5AFF', bill_requested: '#9B59B6', pending: '#94A3B8' };
const statusEmoji: Record<string, string> = { ready: '✅', cooking: '🔥', kot_sent: '📤', bill_requested: '🧾', pending: '⏳' };

function WorkerOrders() {
  const { activeOrders = [], updateOrderStatus } = useData();
  const safeOrders = Array.isArray(activeOrders) ? activeOrders : [];
  const orders = safeOrders.filter((o: any) => o.status !== 'paid');

  const requestBill = (id: string, version: number) => updateOrderStatus(id, 'bill_requested', version);
  const markServed = (id: string, version: number) => updateOrderStatus(id, 'served', version);

  return (
    <DashboardLayout title="Active Orders">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📋 Active Orders</div>
          <div className="page-header-sub">Track order status and request bills for your tables</div>
        </div>
        <div className="stats-row">
          {['ready', 'cooking', 'bill_requested'].map(s => (
            <div key={s} className="stat-pill">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor[s], display: 'inline-block' }} />
              <strong style={{ color: statusColor[s] }}>{orders.filter(o => o.status === s).length}</strong>
              <span style={{ color: '#64748B', fontSize: 11 }}>{statusEmoji[s]} {s.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ready to Serve Alert */}
      {orders.filter(o => o.status === 'ready').length > 0 && (
        <div className="alarm-card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🔔</span>
            <div>
              <div style={{ fontWeight: 700, color: '#00C48C' }}>Food Ready to Serve!</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>{orders.filter(o => o.status === 'ready').length} order(s) are ready in kitchen</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {orders.map(o => (
          <div key={o.id} className="card" style={{ borderLeft: `4px solid ${statusColor[o.status]}` }}>
            <div style={{ padding: '14px 16px' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: statusColor[o.status] + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: statusColor[o.status], fontSize: 18 }}>T{o.table?.number || '?'}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{o.id}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>👤 {o.worker?.name || 'Staff'}</div>
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: statusColor[o.status], background: statusColor[o.status] + '15', padding: '4px 12px', borderRadius: 12 }}>{statusEmoji[o.status]} {o.status.replace(/_/g, ' ')}</span>
              </div>

              {/* Items */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 10, marginBottom: 12 }}>
                {o.items.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                    <span>{item.name} × {item.qty}</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
                <span style={{ fontWeight: 800, fontSize: 16, color: '#2E5AFF' }}>{formatCurrency(o.totalAmount)}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {o.status === 'ready' && <button className="btn btn-secondary btn-sm" onClick={() => requestBill(o.id, o.version)}>🧾 Request Bill</button>}
                  {o.status === 'bill_requested' && <button className="btn btn-ghost btn-sm" style={{ color: '#9B59B6' }}>⏳ Awaiting Cashier</button>}
                  {(o.status === 'cooking' || o.status === 'kot_sent') && <button className="btn btn-ghost btn-sm" style={{ color: '#64748B' }}>⏳ Kitchen Cooking</button>}
                </div>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div style={{ gridColumn: '1/-1' }}>
            <div className="card"><div className="empty-state"><div className="empty-state-icon">✅</div><div className="empty-state-title">No Active Orders</div><div className="empty-state-sub">All tables are clear. Start a new order from the floor plan.</div></div></div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default WorkerOrders;
