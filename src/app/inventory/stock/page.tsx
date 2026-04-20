'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';

function StockOverview() {
  const { ingredients, adjustStock } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [adjModal, setAdjModal] = useState<any | null>(null);
  const [adjQty, setAdjQty] = useState('');
  const [adjReason, setAdjReason] = useState('wastage');

  const categories = ['All', ...new Set(ingredients.map((i: any) => i.category))];

  const filtered = ingredients.filter((i: any) =>
    (categoryFilter === 'All' || i.category === categoryFilter) &&
    (statusFilter === 'all' || (i.stockQuantity <= i.reorderLevel ? 'low' : 'ok') === statusFilter) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const applyAdjust = async () => {
    if (!adjModal || !adjQty) return;
    const delta = parseFloat(adjQty);
    if (isNaN(delta)) return;
    const res = await adjustStock(adjModal.id, delta, adjReason);
    if (res.ok) {
      setAdjModal(null);
      setAdjQty('');
    } else {
      alert('Failed: ' + res.error);
    }
  };

  return (
    <DashboardLayout title="Stock Overview">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📦 Stock Overview</div>
          <div className="page-header-sub">Real-time stock levels for all ingredients</div>
        </div>
        <div className="page-header-actions">
          <select className="form-select" style={{ width: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="critical">Critical</option>
            <option value="low">Low</option>
            <option value="ok">OK</option>
          </select>
          <div className="search-bar" style={{ width: 220 }}>
            <span>🔍</span>
            <input placeholder="Search ingredients..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => { setEditItem(null); setShowModal(true); }}>+ Add Ingredient</button>
        </div>
      </div>

      <div className="chips-row" style={{ marginBottom: 20 }}>
        {categories.map(c => (
          <button key={c} className={`chip ${categoryFilter === c ? 'active' : ''}`} onClick={() => setCategoryFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Ingredient</th><th>Category</th><th>Current Stock</th><th>Reorder Level</th><th>Stock Bar</th><th>Unit Cost</th><th>Value</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((i: any) => {
                const isLow = (i.stockQuantity || 0) <= (i.reorderLevel || 0);
                const isCritical = (i.stockQuantity || 0) <= (i.reorderLevel || 0) / 2;
                const status = isCritical ? 'critical' : isLow ? 'low' : 'ok';
                const pct = Math.min(100, ((i.stockQuantity || 0) / ((i.reorderLevel || 1) * 2)) * 100);
                return (
                  <tr key={i.id}>
                    <td><strong>{i.name}</strong></td>
                    <td><span className="badge badge-gray">{i.category}</span></td>
                    <td><strong>{i.stockQuantity} {i.unit}</strong></td>
                    <td style={{ color: '#94A3B8', fontSize: 12 }}>{i.reorderLevel} {i.unit}</td>
                    <td>
                      <div className="stock-bar">
                        <div className={`stock-fill stock-${status}`} style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>₹{i.unitCost}/{i.unit}</td>
                    <td><strong style={{ color: '#00C48C' }}>{formatCurrency(i.stockQuantity * i.unitCost)}</strong></td>
                    <td>
                      <span className={`badge ${status === 'critical' ? 'badge-red' : status === 'low' ? 'badge-orange' : 'badge-green'}`}>
                        {status === 'critical' ? '🔴 Critical' : status === 'low' ? '🟡 Low' : '✅ OK'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setAdjModal(i)}>Adjust</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#FF3B30' }} onClick={() => console.log('Delete disabled')}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {adjModal && (
        <div className="modal-backdrop" onClick={() => setAdjModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Adjust Stock — {adjModal.name}</div>
              <button className="btn btn-ghost" onClick={() => setAdjModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ padding: 12, background: '#F4F6FB', borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#64748B' }}>Current Stock</div>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{adjModal.stockQuantity} {adjModal.unit}</div>
              </div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Adjustment (+ to add, - to deduct)</label>
                <input className="form-input" type="number" placeholder="e.g. -2.5 or +10" value={adjQty} onChange={e => setAdjQty(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <select className="form-select" value={adjReason} onChange={e => setAdjReason(e.target.value)}>
                  <option value="wastage">Wastage</option>
                  <option value="breakage">Breakage</option>
                  <option value="correction">Stock Count Correction</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setAdjModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={applyAdjust}>Apply Adjustment</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default StockOverview;
