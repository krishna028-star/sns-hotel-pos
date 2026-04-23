'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';

type POStatus = 'draft' | 'pending_approval' | 'approved' | 'ordered' | 'received';

function PurchaseOrders() {
  const { purchaseOrders, suppliers, createPurchaseOrder, updatePurchaseOrderStatus } = useData();
  const orders = Array.isArray(purchaseOrders) ? purchaseOrders : [];
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplier: '', items: '1', amount: '' });

  const receiveOrder = (id: string | number) => updatePurchaseOrderStatus(String(id), 'received');

  // BUG FIX: Submit button had no handler — PO could never leave draft state
  const submitForApproval = (id: string | number) => updatePurchaseOrderStatus(String(id), 'pending_approval');

  const addOrder = () => {
    if (!form.supplier || !form.amount) return;
    // BUG FIX: ID generation was `PO-00${n+1}` which gives PO-003 for order 3 — breaks at 10+
    const newId = `PO-${String(orders.length + 1).padStart(3, '0')}`;
    const newPO = {
      id: newId,
      supplier: form.supplier,
      amount: parseFloat(form.amount),
      status: 'draft' as POStatus,
      date: new Date().toISOString().split('T')[0],
      items: parseInt(form.items) || 1
    };
    createPurchaseOrder(newPO);
    setShowModal(false);
    setForm({ supplier: '', items: '1', amount: '' });
  };

  const statusBadge: Record<string, string> = {
    draft: 'badge-gray', pending_approval: 'badge-orange', approved: 'badge-blue', ordered: 'badge-purple', received: 'badge-green'
  };

  return (
    <DashboardLayout title="Purchase Orders">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📋 Purchase Orders</div>
          <div className="page-header-sub">Create, track, and receive purchase orders</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Purchase Order</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)', marginBottom: 24 }}>
        {(['draft', 'pending_approval', 'approved', 'ordered', 'received'] as POStatus[]).map(s => (
          <div className="metric-card" key={s} style={{ cursor: 'default' }}>
            <div className="metric-label">{s.replace('_', ' ')}</div>
            <div className="metric-value" style={{ fontSize: 28 }}>{orders.filter((o: any) => o.status === s).length}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">All Purchase Orders</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>PO #</th><th>Supplier</th><th>Date</th><th>Items</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {orders.map((po: any) => (
                <tr key={po.id}>
                  <td><strong>{po.id}</strong></td>
                  <td>{po.supplier}</td>
                  <td style={{ fontSize: 12 }}>{po.date}</td>
                  <td>{po.items} items</td>
                  <td><strong style={{ color: '#2E5AFF' }}>{formatCurrency(po.amount)}</strong></td>
                  <td><span className={`badge ${statusBadge[po.status]}`}>{po.status.replace('_', ' ')}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {po.status === 'ordered' && <button className="btn btn-secondary btn-sm" onClick={() => receiveOrder(po.id)}>✅ Mark Received</button>}
                      {/* BUG FIX: Submit button had no onClick — wired to submitForApproval */}
                      {po.status === 'draft' && <button className="btn btn-primary btn-sm" onClick={() => submitForApproval(po.id)}>📤 Submit</button>}
                      <button className="btn btn-ghost btn-sm">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create New Purchase Order</div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Supplier</label>
                  <select className="form-select" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))}>
                    <option value="">Select supplier...</option>
                    {safeSuppliers.map((s: any) => <option key={s.id} value={s.name}>{s.name}</option>)}
                    {safeSuppliers.length === 0 && ['Fresh Foods Co.', 'Dairy Direct', 'Veggie World', 'Spice Garden'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">No. of Items</label><input className="form-input" type="number" value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Total Amount (₹)</label><input className="form-input" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} /></div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addOrder}>Create PO</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default PurchaseOrders;
