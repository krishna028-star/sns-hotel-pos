'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ACTIVE_ORDERS, PENDING_KOTS, formatCurrency } from '@/lib/mockData';

const statusColor: Record<string, string> = { ready: '#00C48C', cooking: '#FF8A34', kot_sent: '#2E5AFF', bill_requested: '#9B59B6', pending: '#94A3B8' };
const statusEmoji: Record<string, string> = { ready: '✅', cooking: '🔥', kot_sent: '📤', bill_requested: '🧾', pending: '⏳' };

type Order = typeof ACTIVE_ORDERS[0];

function LiveOrders() {
  const [orders] = useState(ACTIVE_ORDERS);
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <DashboardLayout title="Live Orders Monitor">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            🔴 Live Orders Monitor
            <span className="blink" style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF3B30', display: 'inline-block' }} />
          </div>
          <div className="page-header-sub">Real-time view of all active orders in the outlet</div>
        </div>
        <div className="stats-row">
          {[
            { label: 'Active', value: orders.length, color: '#2E5AFF' },
            { label: 'Pending KOTs', value: PENDING_KOTS.length, color: '#FF3B30' },
            { label: 'Ready to Serve', value: orders.filter(o => o.status === 'ready').length, color: '#00C48C' },
          ].map(s => (
            <div key={s.label} className="stat-pill">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
              <span style={{ color: s.color, fontWeight: 700 }}>{s.value}</span>
              <span style={{ color: '#64748B' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {PENDING_KOTS.length > 0 && (
        <div className="alarm-card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🔔</span>
            <div>
              <div style={{ fontWeight: 700, color: '#FF8A34' }}>Unaccepted KOTs — Action Required!</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>{PENDING_KOTS.length} KOT(s) have not been accepted by any chef</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {orders.map(o => (
          <div key={o.id} className={`kot-card ${o.status}`} style={{ borderLeft: `4px solid ${statusColor[o.status]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: statusColor[o.status] + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: statusColor[o.status], fontSize: 18 }}>T{o.tableNum}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{o.id}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>👤 {o.worker}</div>
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: statusColor[o.status], background: statusColor[o.status] + '15', padding: '4px 12px', borderRadius: 12 }}>{statusEmoji[o.status]} {o.status.replace('_', ' ')}</span>
            </div>
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 10 }}>
              {o.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                  <span>{item.name} × {item.qty}</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: '#2E5AFF' }}>{formatCurrency(o.total)}</span>
              <button className="btn btn-outline btn-sm" onClick={() => setSelected(o)}>View Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">📋 Order Details — {selected.id}</div>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  ['Order ID', selected.id],
                  ['Table', `Table ${selected.tableNum}`],
                  ['Waiter', selected.worker],
                  ['Status', selected.status.replace('_', ' ')],
                  ['Order Time', selected.time],
                  ['Total', formatCurrency(selected.total)],
                ].map(([k, v]) => (
                  <div key={String(k)} style={{ padding: 12, background: '#F4F6FB', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>Order Items</div>
              {selected.items.map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: 14 }}>
                  <span>{item.name} × {item.qty}</span>
                  <strong style={{ color: '#2E5AFF' }}>{formatCurrency(item.price * item.qty)}</strong>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '12px 0', fontWeight: 800, fontSize: 18 }}>
                <span>Total</span>
                <span style={{ color: '#2E5AFF' }}>{formatCurrency(selected.total)}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default LiveOrders;
