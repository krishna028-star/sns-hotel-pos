'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';

function ClientFranchises() {
  // FIX: removed FRANCHISES mock — use real DB franchises from DataContext
  const { hotels = [], franchises = [], createFranchise, updateFranchise, deleteFranchise } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const safeFranchises = Array.isArray(franchises) ? franchises : [];
  const safeHotels = Array.isArray(hotels) ? hotels : [];

  const totalRevenue = safeFranchises.reduce((a: number, f: any) => a + (f.revenue || 0), 0);

  const openEdit = (f?: any) => {
    setEditing(f ?? { name: '', tenantId: '' });
    setShowModal(true);
  };

  const saveFranchise = async () => {
    if (!editing?.name) return;
    setLoading(true);
    let res;
    if (editing.id) {
      res = await updateFranchise(editing.id, { name: editing.name });
    } else {
      // Use tenantId from first hotel (or editing form)
      res = await createFranchise({ name: editing.name, tenantId: editing.tenantId || safeHotels[0]?.tenantId });
    }
    setLoading(false);
    if (res.ok) {
      setShowModal(false);
      setEditing(null);
    } else {
      alert('Failed: ' + res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this franchise? Hotels must be reassigned first.')) return;
    const res = await deleteFranchise(id);
    if (!res.ok) alert('Delete failed: ' + res.error);
  };

  return (
    <DashboardLayout title="Franchise Management">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🏩 Franchise Management</div>
          <div className="page-header-sub">Manage franchise regions and their performance</div>
        </div>
        <button className="btn btn-primary" onClick={() => openEdit()}>+ Add Franchise</button>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Franchises', value: safeFranchises.length, color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Total Hotels', value: safeHotels.length, color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: '#1ABC9C', bg: '#e6faf7' },
          { label: 'Total Orders', value: '—', color: '#9B59B6', bg: '#f5f0ff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 20 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><div className="card-title">🌍 All Franchise Regions</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Region</th><th>Franchise Head</th><th>Hotels</th><th>Tenant</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {safeFranchises.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>No franchises yet. Add a franchise region to get started.</td></tr>
              ) : safeFranchises.map((f: any) => (
                <tr key={f.id}>
                  <td><strong>{f.name}</strong></td>
                  <td>{f.head || 'Unassigned'}</td>
                  <td>{f.hotels} hotels</td>
                  <td>{f.tenant}</td>
                  <td><span className="badge badge-green">{f.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(f)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#FF3B30' }} onClick={() => handleDelete(f.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">🏨 Hotels Under Chain</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Hotel</th><th>Franchise</th><th>Tables</th><th>Staff</th><th>Status</th></tr></thead>
            <tbody>
              {safeHotels.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>No hotels found.</td></tr>
              ) : safeHotels.map((h: any) => (
                <tr key={h.id}>
                  <td><strong>{h.name}</strong></td>
                  <td>{h.franchise || 'No Franchise'}</td>
                  <td>{h.tables || 0}</td>
                  <td>{h.staff || 0}</td>
                  <td><span className="badge badge-green">{h.status || 'Active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && editing && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editing.id ? 'Edit Franchise' : 'Add Franchise'}</div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Franchise Name *</label>
                <input className="form-input" value={editing.name} onChange={e => setEditing((f: any) => ({ ...f, name: e.target.value }))} placeholder="e.g. North Region" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={loading || !editing.name} onClick={saveFranchise}>
                {loading ? 'Saving...' : editing.id ? 'Save Changes' : 'Create Franchise'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default ClientFranchises;
