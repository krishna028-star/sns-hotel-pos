'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PENDING_PAYMENTS } from '@/lib/mockData';

function CashierDash() {
  const [payments, setPayments] = useState(PENDING_PAYMENTS.map(p => ({ ...p })));
  const [cashModal, setCashModal] = useState<typeof PENDING_PAYMENTS[0] | null>(null);
  const [cashReceived, setCashReceived] = useState('');
  const [accepted, setAccepted] = useState<typeof PENDING_PAYMENTS>([]);

  const acceptCash = () => {
    if (!cashModal) return;
    setAccepted(prev => [...prev, cashModal]);
    setPayments(prev => prev.filter(p => p.id !== cashModal.id));
    setCashModal(null);
    setCashReceived('');
  };

  const change = cashModal ? Math.max(0, parseFloat(cashReceived || '0') - cashModal.amount) : 0;

  return (
    <DashboardLayout title="Cashier Dashboard">
      <div style={{ background: 'linear-gradient(135deg,#F39C12 0%,#d4870a 100%)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ fontSize: 40 }}>💰</div>
        <div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>Cashier Dashboard</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>SNS Beach Resort · Shift Active 🟢</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <a href="/cashier/alarms"><button className="btn btn-sm" style={{ background: '#FF3B30', color: '#fff' }}>🔔 Alarms <span style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 10, padding: '1px 6px', fontSize: 10, marginLeft: 4 }}>2</span></button></a>
          <a href="/cashier/reconcile"><button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>🧾 Reconcile</button></a>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Payments Today', value: '42', icon: '✅', color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Cash Collected', value: '₹18,200', icon: '💵', color: '#F39C12', bg: '#fdf8e8' },
          { label: 'Pending Payments', value: payments.length, icon: '⏳', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'App Payments', value: '₹42,800', icon: '📲', color: '#2E5AFF', bg: '#e8edff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Pending Payments */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><div className="card-title">⏳ Pending Payments</div><a href="/cashier/pending"><button className="btn btn-outline btn-sm">View All</button></a></div>
        {payments.length === 0
          ? <div className="empty-state" style={{ padding: 24 }}><div style={{ fontSize: 32 }}>✅</div><div>No pending payments</div></div>
          : payments.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: p.method === 'app' ? '#e8edff' : '#e8fdf7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{p.method === 'app' ? '📲' : '💵'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{p.orderId} · Table {p.tableNum}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{p.customerName} · {p.time}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>₹{p.amount}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {p.method === 'cash'
                  ? <button className="btn btn-primary btn-sm" onClick={() => { setCashModal(p); setCashReceived(''); }}>Accept Cash</button>
                  : <a href="/cashier/alarms"><button className="btn btn-danger btn-sm">🔔 Go to Alarm</button></a>}
              </div>
            </div>
          ))
        }
      </div>

      {/* Quick Nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { href: '/cashier/alarms', icon: '🔔', label: 'Payment Alarms', sub: '2 active', color: '#FF3B30' },
          { href: '/cashier/history', icon: '📋', label: 'Payment History', sub: 'View past transactions', color: '#2E5AFF' },
          { href: '/cashier/shift', icon: '🕐', label: 'Shift Management', sub: 'Start/end shift', color: '#F39C12' },
        ].map(n => (
          <a key={n.href} href={n.href} style={{ textDecoration: 'none' }}>
            <div className="metric-card" style={{ cursor: 'pointer', border: `1px solid ${n.color}20` }}>
              <div className="metric-icon" style={{ background: n.color + '18', color: n.color, fontSize: 24 }}>{n.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{n.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{n.sub}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Cash Modal */}
      {cashModal && (
        <div className="modal-backdrop" onClick={() => setCashModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">💵 Accept Cash Payment</div>
              <button className="btn btn-ghost" onClick={() => setCashModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: '#64748B' }}>Total Amount Due</div>
                <div style={{ fontSize: 42, fontWeight: 900, color: '#2E5AFF' }}>₹{cashModal.amount}</div>
                <div style={{ fontSize: 13, color: '#94A3B8' }}>{cashModal.orderId} · Table {cashModal.tableNum}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Cash Received (₹)</label>
                <input className="form-input" type="number" style={{ fontSize: 20, fontWeight: 700, textAlign: 'center' }} placeholder="0" value={cashReceived} onChange={e => setCashReceived(e.target.value)} />
              </div>
              {parseFloat(cashReceived) > 0 && (
                <div style={{ marginTop: 16, padding: 16, background: change > 0 ? '#e8fdf7' : '#F4F6FB', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Change to Return</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: change > 0 ? '#00C48C' : '#94A3B8' }}>₹{change.toFixed(2)}</div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setCashModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-lg" disabled={parseFloat(cashReceived || '0') < cashModal.amount} onClick={acceptCash}>✅ Accept & Print Bill</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default CashierDash;
