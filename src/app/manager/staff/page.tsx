'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ROLE_COLORS } from '@/lib/mockData';
import { useAuth } from '@/lib/auth';

function ManagerStaff() {
  const { user: currentUser, users, addUser, canManage } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', role: 'worker', email: '' });
  const [search, setSearch] = useState('');

  // Filter users to only show those relevant to this hotel (mocked)
  // In a real app, we'd filter by hotelId
  const hotelStaff = users.filter(u => 
    ['worker', 'cashier', 'chef', 'inventory_manager'].includes(u.role)
  );

  const filtered = hotelStaff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!form.name || !form.email) {
      alert('Please fill all fields');
      return;
    }
    const res = addUser({
      ...form,
      tenant: currentUser?.tenant || 'SNS Grand Hotels',
      hotel: 'SNS Beach Resort',
      password: 'password123',
      avatar: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    });

    if (res.ok) {
      alert('Staff created successfully! (Demo Mode)');
      setShowModal(false);
      setForm({ name: '', role: 'worker', email: '' });
    } else {
      alert(res.error);
    }
  };

  const roleEmoji: Record<string, string> = { worker: '👤', cashier: '💰', chef: '👨‍🍳', inventory_manager: '📦' };
  const roleLabel: Record<string, string> = { worker: 'Waiter', cashier: 'Cashier', chef: 'Chef', inventory_manager: 'Inventory Mgr' };

  return (
    <DashboardLayout title="Staff Management">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">👥 Staff Management</div>
          <div className="page-header-sub">Manage workers, cashiers, chefs, and inventory managers</div>
        </div>
        <div className="page-header-actions">
          <div className="search-bar" style={{ width: 240 }}>
            <span>🔍</span>
            <input placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Staff</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        {(['worker','cashier','chef','inventory_manager'] as const).map(role => (
          <div className="metric-card" key={role}>
            <div className="metric-icon" style={{ background: ROLE_COLORS[role] + '18', color: ROLE_COLORS[role], fontSize: 22 }}>{roleEmoji[role]}</div>
            <div className="metric-label">{roleLabel[role]}s</div>
            <div className="metric-value" style={{ color: ROLE_COLORS[role] }}>{hotelStaff.filter(s => s.role === role).length}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">All Staff Members</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Hotel</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: ROLE_COLORS[s.role] + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{roleEmoji[s.role]}</div>
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.email}</td>
                  <td><span className="badge" style={{ background: ROLE_COLORS[s.role] + '18', color: ROLE_COLORS[s.role] }}>{roleLabel[s.role] ?? s.role}</span></td>
                  <td style={{ fontSize: 12 }}>{s.hotel}</td>
                  <td><span className="badge badge-green">active</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm">Edit</button>
                      {canManage(s.role) && (
                        <button className="btn btn-ghost btn-sm" style={{ color: '#FF3B30' }}>Remove</button>
                      )}
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
              <div className="modal-title">Add New Staff Member</div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="e.g. Rajesh Kumar" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} /></div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))}>
                    <option value="worker">Waiter / Worker</option>
                    <option value="cashier">Cashier</option>
                    <option value="chef">Chef</option>
                    <option value="inventory_manager">Inventory Manager</option>
                  </select>
                </div>
                {!canManage(form.role) && <div style={{ color: 'var(--danger)', fontSize: 11 }}>⚠️ You cannot create users with a role equal or higher than yours.</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!canManage(form.role)} onClick={handleCreate}>Add Staff & Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default ManagerStaff;
