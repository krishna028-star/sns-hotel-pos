'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { PENDING_PAYMENTS, formatCurrency } from '@/lib/mockData';
import { useNotifications } from '@/lib/notifications';

function CashierPending() {
  const [payments, setPayments] = useState(PENDING_PAYMENTS.map(p => ({ ...p })));
  const [cashModal, setCashModal] = useState<typeof PENDING_PAYMENTS[0] | null>(null);
  const [cashReceived, setCashReceived] = useState('');
  const { notify } = useNotifications();
  const router = useRouter();

  const acceptCash = () => {
    if (!cashModal) return;
    setPayments(prev => prev.filter(p => p.id !== cashModal.id));
    notify('payment', `💰 Cash payment of ${formatCurrency(cashModal.amount)} accepted — Table ${cashModal.tableNum}`);
    setCashModal(null);
    setCashReceived('');
  };

  const change = cashModal ? Math.max(0, parseFloat(cashReceived || '0') - cashModal.amount) : 0;

  return (
    <DashboardLayout title="Pending Payments">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">⏳ Pending Payments</div>
          <div className="page-header-sub">Collect payment from customers waiting at tables</div>
        </div>
        <div className="stat-pill"><strong style={{ color: payments.length > 0 ? '#FF8A34' : '#00C48C' }}>{payments.length}</strong> Pending</div>
      </div>

      {payments.length === 0 ? (
        <div className="card"><div className="empty-state"><div style={{ fontSize: 48 }}>✅</div><div className="empty-state-title">All Payments Collected!</div><div className="empty-state-sub">No pending payments at this time.</div></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {payments.map(p => (
            <div key={p.id} className="card" style={{ border: '2px solid ' + (p.method === 'app' ? '#2E5AFF' : '#FF8A34') }}>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 40 }}>{p.method === 'app' ? '📲' : '💵'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{p.orderId} · Table {p.tableNum}</div>
                  <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{p.customerName} · {p.time}</div>
                  <span className={`badge ${p.method === 'app' ? 'badge-blue' : 'badge-orange'}`} style={{ marginTop: 6 }}>{p.method.toUpperCase()}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#2E5AFF' }}>{formatCurrency(p.amount)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.method === 'cash'
                    ? <button className="btn btn-primary" onClick={() => { setCashModal(p); setCashReceived(''); }}>💵 Accept Cash</button>
                    // BUG FIX: was <a><button> — invalid HTML, buttons cannot be nested in anchors
                    : <button className="btn btn-danger" onClick={() => router.push('/cashier/alarms')}>🔔 Go to Alarm</button>}
                  <button className="btn btn-ghost btn-sm">View Order</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cashModal && (
        <div className="modal-backdrop" onClick={() => setCashModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">💵 Cash Payment — {cashModal.orderId}</div>
              <button className="btn btn-ghost" onClick={() => setCashModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: '#64748B' }}>Amount Due</div>
                <div style={{ fontSize: 44, fontWeight: 900, color: '#2E5AFF' }}>{formatCurrency(cashModal.amount)}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Cash Received</label>
                <input className="form-input" type="number" style={{ fontSize: 24, textAlign: 'center', fontWeight: 700 }} placeholder="₹0" value={cashReceived} onChange={e => setCashReceived(e.target.value)} />
              </div>
              {parseFloat(cashReceived) > 0 && (
                <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: change >= 0 ? '#e8fdf7' : '#fff0ef', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#64748B' }}>Change to Return</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: change > 0 ? '#00C48C' : '#FF3B30' }}>₹{change.toFixed(2)}</div>
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
export default CashierPending;
