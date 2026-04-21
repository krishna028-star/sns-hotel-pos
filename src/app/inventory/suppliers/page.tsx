'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

const INITIAL_SUPPLIERS = [
  { id: 1, name: 'Fresh Foods Co.', contact: 'Ravi Kumar',  phone: '+91 94001 12345', email: 'ravi@freshfoods.com',  categories: 'Meat, Poultry',          rating: 4.5, status: 'active', lastOrder: '2025-04-16' },
  { id: 2, name: 'Dairy Direct',    contact: 'Meena Shah',  phone: '+91 98001 67890', email: 'meena@dairydirect.com', categories: 'Dairy, Eggs',             rating: 4.8, status: 'active', lastOrder: '2025-04-15' },
  { id: 3, name: 'Veggie World',    contact: 'Suresh Iyer', phone: '+91 96001 34567', email: 'suresh@veggieworld.com', categories: 'Vegetables, Fruits',     rating: 4.2, status: 'active', lastOrder: '2025-04-14' },
  { id: 4, name: 'Spice Garden',    contact: 'Priya Nair',  phone: '+91 97001 56789', email: 'priya@spicegarden.com', categories: 'Spices, Condiments',     rating: 4.6, status: 'active', lastOrder: '2025-04-13' },
];

type Supplier = typeof INITIAL_SUPPLIERS[0];

const emptyForm = { name: '', contact: '', phone: '', email: '', categories: '' };

import { useData } from '@/lib/DataContext';

function Suppliers() {
  const router = useRouter();
  const { suppliers = [], addItem, updateItem } = useData();
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s: any) => {
    setEditId(s.id);
    setForm({ name: s.name, contact: s.contact, phone: s.phone, email: s.email, categories: s.categories });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return alert('Company name is required');
    if (editId !== null) {
      updateItem('suppliers', editId, form);
    } else {
      addItem('suppliers', { 
        ...form, 
        rating: 4.0, 
        status: 'active', 
        lastOrder: new Date().toISOString().slice(0, 10) 
      });
    }
    setShowModal(false);
  };

  const renderStars = (rating: number) => '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  return (
    <DashboardLayout title="Suppliers">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🚚 Suppliers</div>
          <div className="page-header-sub">Manage vendor contacts and supply relationships</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Supplier</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {safeSuppliers.map(s => (
          <div key={s.id} className="card">
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#e8edff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚚</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.categories}</div>
                </div>
                <span className="badge badge-green" style={{ marginLeft: 'auto' }}>Active</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', gap: 8 }}><span style={{ color: '#94A3B8' }}>👤</span><span>{s.contact}</span></div>
                <div style={{ display: 'flex', gap: 8 }}><span style={{ color: '#94A3B8' }}>📱</span><span>{s.phone}</span></div>
                <div style={{ display: 'flex', gap: 8 }}><span style={{ color: '#94A3B8' }}>✉️</span><span style={{ color: '#2E5AFF' }}>{s.email}</span></div>
                <div style={{ display: 'flex', gap: 8 }}><span style={{ color: '#94A3B8' }}>📅</span><span>Last order: {s.lastOrder}</span></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                <span style={{ color: '#F39C12', fontSize: 14 }}>{renderStars(s.rating)} <span style={{ fontSize: 12, color: '#64748B' }}>({s.rating})</span></span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                  <button className="btn btn-primary btn-sm" onClick={() => router.push('/inventory/purchase-orders')}>New PO</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editId ? 'Edit Supplier' : 'Add Supplier'}</div>
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
              <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Save Changes' : 'Add Supplier'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default Suppliers;
