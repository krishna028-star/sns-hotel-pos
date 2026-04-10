'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MENU_ITEMS, MENU_CATEGORIES, formatCurrency } from '@/lib/mockData';

type MenuItem = typeof MENU_ITEMS[0];

function ManagerMenu() {
  const [items, setItems] = useState(MENU_ITEMS);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null);

  const filtered = items.filter(i =>
    (category === 'All' || i.category === category) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAvail = (id: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
  const deleteItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const openEdit = (item?: MenuItem) => {
    setEditing(item ?? { name: '', price: 0, category: 'Main Course', available: true, image: '🍽️' });
    setShowModal(true);
  };

  const saveItem = () => {
    if (!editing?.name) return;
    if (editing.id) {
      setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...editing } as MenuItem : i));
    } else {
      setItems(prev => [...prev, { id: Date.now(), name: editing.name!, price: editing.price ?? 0, category: editing.category ?? 'Main Course', available: editing.available ?? true, image: editing.image ?? '🍽️' }]);
    }
    setShowModal(false);
    setEditing(null);
  };

  return (
    <DashboardLayout title="Menu Management">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🍽️ Menu Management</div>
          <div className="page-header-sub">Add, edit, and manage menu items for your outlet</div>
        </div>
        <div className="page-header-actions">
          <div className="search-bar" style={{ width: 220 }}>
            <span>🔍</span>
            <input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => openEdit()}>+ Add Item</button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="chips-row" style={{ marginBottom: 20 }}>
        {MENU_CATEGORIES.map(c => (
          <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {filtered.map(item => (
          <div key={item.id} className="card" style={{ opacity: item.available ? 1 : 0.55, transition: 'all 0.2s' }}>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 32 }}>{item.image}</span>
                <span className={`badge ${item.available ? 'badge-green' : 'badge-gray'}`}>{item.available ? 'Available' : 'Unavailable'}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>{item.category}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#2E5AFF' }}>{formatCurrency(item.price)}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => openEdit(item)}>Edit</button>
                <button className="btn btn-ghost btn-sm" onClick={() => toggleAvail(item.id)}>{item.available ? '🔕' : '✅'}</button>
                <button className="btn btn-ghost btn-sm" style={{ color: '#FF3B30' }} onClick={() => deleteItem(item.id)}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && editing && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editing.id ? 'Edit Menu Item' : 'Add Menu Item'}</div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">Item Name</label><input className="form-input" value={editing.name} onChange={e => setEditing(f => ({...f, name: e.target.value}))} /></div>
                  <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-input" type="number" value={editing.price} onChange={e => setEditing(f => ({...f, price: +e.target.value}))} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={editing.category} onChange={e => setEditing(f => ({...f, category: e.target.value}))}>
                      {MENU_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Emoji Icon</label><input className="form-input" value={editing.image} onChange={e => setEditing(f => ({...f, image: e.target.value}))} maxLength={2} /></div>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={editing.available} onChange={e => setEditing(f => ({...f, available: e.target.checked}))} />
                    <span className="form-label" style={{ marginBottom: 0 }}>Available on menu</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveItem}>{editing.id ? 'Save Changes' : 'Add Item'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default ManagerMenu;
