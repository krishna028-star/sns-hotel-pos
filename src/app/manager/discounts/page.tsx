'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const discountRequests = [
  { id: 1, worker: 'Vijay Worker', table: 2, order: 'ORD-101', amount: 1040, discount: 104, percent: 10, reason: 'Regular customer - loyalty', status: 'pending', time: '8:15 PM' },
  { id: 2, worker: 'Rahul Waiter', table: 7, order: 'ORD-103', amount: 940, discount: 50, percent: 5, reason: 'Item took too long', status: 'pending', time: '7:48 PM' },
];

function ManagerDiscounts() {
  const [requests, setRequests] = useState(discountRequests);
  const [modal, setModal] = useState<typeof discountRequests[0] | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [note, setNote] = useState('');

  const handle = (id: number, act: 'approve' | 'reject') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: act === 'approve' ? 'approved' : 'rejected' } : r));
    setModal(null);
    setAction(null);
    setNote('');
  };

  const activeRequests = requests.filter(r => r.status === 'pending');

  return (
    <DashboardLayout title="Discount & Void Approvals">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">💰 Discount / Void Approvals</div>
          <div className="page-header-sub">Review and approve discount and void requests from staff</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="stat-pill"><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF8A34', display: 'inline-block' }} /><strong>{activeRequests.length}</strong> Pending</div>
          <div className="stat-pill"><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00C48C', display: 'inline-block' }} /><strong>{requests.filter(r => r.status === 'approved').length}</strong> Approved</div>
        </div>
      </div>

      {activeRequests.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">✅</div><div className="empty-state-title">No Pending Requests</div><div className="empty-state-sub">All discount requests have been handled.</div></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activeRequests.map(r => (
            <div key={r.id} className="alarm-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 800 }}>Table {r.table}</span>
                    <span className="badge badge-orange">{r.order}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{r.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>👤 {r.worker} is requesting <strong style={{ color: '#FF8A34' }}>{r.percent}% OFF (₹{r.discount})</strong></div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Reason: {r.reason}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>Order Total</div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>₹{r.amount}</div>
                  <div style={{ fontSize: 12, color: '#00C48C' }}>After discount: ₹{r.amount - r.discount}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setModal(r); setAction('approve'); }}>✅ Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => { setModal(r); setAction('reject'); }}>✕ Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Handled */}
      {requests.filter(r => r.status !== 'pending').length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header"><div className="card-title">Handled Requests</div></div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Worker</th><th>Discount</th><th>Reason</th><th>Status</th></tr></thead>
              <tbody>
                {requests.filter(r => r.status !== 'pending').map(r => (
                  <tr key={r.id}>
                    <td>{r.order}</td>
                    <td>{r.worker}</td>
                    <td>{r.percent}% (₹{r.discount})</td>
                    <td style={{ fontSize: 12 }}>{r.reason}</td>
                    <td><span className={`badge ${r.status === 'approved' ? 'badge-green' : 'badge-red'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && action && (
        <div className="modal-backdrop" onClick={() => { setModal(null); setAction(null); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{action === 'approve' ? '✅ Approve Discount' : '✕ Reject Discount'}</div>
              <button className="btn btn-ghost" onClick={() => { setModal(null); setAction(null); }}>✕</button>
            </div>
            <div className="modal-body">
              <div className={`alert ${action === 'approve' ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: 16 }}>
                <span>{action === 'approve' ? '✅' : '⚠️'}</span>
                <span>{action === 'approve' ? `Approving ${modal.percent}% discount of ₹${modal.discount} on ${modal.order}` : `Rejecting discount request for ${modal.order}`}</span>
              </div>
              <div className="form-group">
                <label className="form-label">Manager Notes (Optional)</label>
                <textarea className="form-input" rows={2} placeholder="Add notes..." value={note} onChange={e => setNote(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => { setModal(null); setAction(null); }}>Cancel</button>
              <button className={`btn ${action === 'approve' ? 'btn-secondary' : 'btn-danger'}`} onClick={() => handle(modal.id, action)}>
                Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default ManagerDiscounts;
