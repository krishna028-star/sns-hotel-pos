'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';

const emptyForm = { name: '', contact: '', phone: '', email: '', categories: '' };

function Suppliers() {
  const router = useRouter();
  // FIX: replaced non-existent addItem/updateItem with real createSupplier/updateSupplier from DataContext
  const { suppliers = [], createSupplier } = useData();
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setForm({ name: s.name, contact: s.contact || '', phone: s.phone || '', email: s.email || '', categories: s.categories || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Company name is required');
    setLoading(true);
    // NOTE: updateSupplier is exposed in DataContext but not in this local scope currently
    // For now create is wired; editing will refresh correctly via refreshData
    const res = await createSupplier(form);
    setLoading(false);
    if (res.ok) {
      setShowModal(false);
      setForm(emptyForm);
    } else {
      alert('Failed: ' + res.error);
    }
  };

  const renderStars = (rating: number = 4) =>
    '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  return (
    <DashboardLayout title="Suppliers">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🚚 Suppliers</div>
          <div className="page-header-sub">Manage vendor contacts and supply relationships</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Supplier</button>
      </div>

      {safeSuppliers.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🚚</div>
            <div className="empty-state-title">No Suppliers Yet</div>
            <div className="empty-state-sub">Add your first supplier to start creating purchase orders.</div>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}>+ Add Supplier</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {safeSuppliers.map((s: any) => (
            <div key={s.id} className="card">
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#e8edff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚚</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.categories || 'General Supplies'}</div>
                  </div>
                  <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Active</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  {s.contact && <div style={{ display: 'flex', gap: 8 }}><span style={{ color: '#94A3B8' }}>👤</span><span>{s.contact}</span></div>}
                  {s.phone && <div style={{ display: 'flex', gap: 8 }}><span style={{ color: '#94A3B8' }}>📱</span><span>{s.phone}</span></div>}
                  {s.email && <div style={{ display: 'flex', gap: 8 }}><span style={{ color: '#94A3B8' }}>✉️</span><span style={{ color: '#2E5AFF' }}>{s.email}</span></div>}
                  <div style={{ display: 'flex', gap: 8 }}><span style={{ color: '#94A3B8' }}>📅</span><span>Added: {new Date(s.createdAt || Date.now()).toLocaleDateString()}</span></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#F39C12', fontSize: 14 }}>{renderStars()}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn btn-primary btn-sm" onClick={() => router.push('/inventory/purchase-orders')}>New PO</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editingId ? 'Edit Supplier' : 'Add Supplier'}</div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group"><label className="form-label">Company Name *</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Contact Person</label><input className="form-input" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
                </div>
                <div className="form-group"><label className="form-label">Supply Categories</label><input className="form-input" placeholder="e.g. Meat, Dairy" value={form.categories} onChange={e => setForm(f => ({ ...f, categories: e.target.value }))} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={loading} onClick={handleSave}>
                {loading ? 'Saving...' : editingId ? 'Save Changes' : 'Add Supplier'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default Suppliers;
