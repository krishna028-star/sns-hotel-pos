'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';

function FranchiseApprovals() {
  const { purchaseOrders, updateItem } = useData();
  const orders = purchaseOrders.filter((p: any) => p.status === 'pending_approval' || p.status === 'pending');
  const [modal, setModal] = useState<{ order: any; action: 'approve' | 'reject' } | null>(null);
  const [reason, setReason] = useState('');

  const handle = (id: string | number, action: string) => {
    updateItem('purchaseOrders', id, { status: action === 'approve' ? 'approved' : 'rejected' });
    setModal(null);
    setReason('');
  };

  return (
    <DashboardLayout title="Purchase Order Approvals">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">✅ Purchase Order Approvals</div>
          <div className="page-header-sub">Review and approve/reject purchase orders from hotels</div>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Pending Approval', value: orders.length, icon: '⏳', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Total Value', value: formatCurrency(orders.reduce((a: number, o: any) => a + (o.amount || 0), 0)), icon: '💰', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Approved Today', value: '3', icon: '✅', color: '#00C48C', bg: '#e8fdf7' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 22 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">✅</div><div className="empty-state-title">All Caught Up!</div><div className="empty-state-sub">No pending purchase orders at this time.</div></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {orders.map((o: any) => (
            <div key={o.id} className="card" style={{ border: '2px solid #FF8A34' }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 16 }}>{o.id}</span>
                      <span className="badge badge-orange">Pending Approval</span>
                    </div>
                    <div style={{ color: '#64748B', fontSize: 13 }}><span>🚚 {o.supplier}</span> &nbsp;·&nbsp; <span>📦 {o.items} items</span> &nbsp;·&nbsp; <span>📅 {o.date}</span></div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#FF8A34' }}>{formatCurrency(o.amount)}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>Total Value</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setModal({ order: o, action: 'approve' })}>✅ Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setModal({ order: o, action: 'reject' })}>✕ Reject</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{modal.action === 'approve' ? '✅ Approve' : '✕ Reject'} — {modal.order.id}</div>
              <button className="btn btn-ghost" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-warning" style={{ marginBottom: 16 }}>
                <span>⚠️</span>
                <span>{modal.action === 'approve' ? `This will approve PO worth ${formatCurrency(modal.order.amount)} from ${modal.order.supplier}.` : 'This will reject the purchase order. Please provide a reason.'}</span>
              </div>
              <div className="form-group">
                <label className="form-label">Reason / Notes</label>
                <textarea className="form-input" rows={3} placeholder="Add notes..." value={reason} onChange={e => setReason(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className={`btn ${modal.action === 'approve' ? 'btn-secondary' : 'btn-danger'}`} onClick={() => handle(modal.order.id, modal.action)}>
                {modal.action === 'approve' ? '✅ Confirm Approval' : '✕ Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default FranchiseApprovals;
