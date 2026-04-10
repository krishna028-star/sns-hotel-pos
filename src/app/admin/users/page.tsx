'use client';
export const dynamic = 'force-dynamic';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth';

const ROLE_BADGE: Record<string, string> = {
  main_admin: 'badge-purple',
  main_client: 'badge-teal',
  franchise_head: 'badge-orange',
  hotel_manager: 'badge-blue',
  inventory_manager: 'badge-green',
  cashier: 'badge-orange',
  chef: 'badge-red',
  worker: 'badge-blue',
  customer: 'badge-gray',
};

function AdminUsers() {
  const { user: currentUser, users, addUser, canManage } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // New user form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    tenant: 'SNS Grand Hotels',
    hotel: '-',
    password: 'password123'
  });

  const filtered = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert('Please fill all required fields');
      return;
    }
    const res = addUser({
      ...formData,
      avatar: formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      hotel: formData.role === 'hotel_manager' || formData.role === 'worker' || formData.role === 'chef' || formData.role === 'cashier' ? 'SNS Beach Resort' : '-'
    });

    if (res.ok) {
      alert('User created successfully! (Demo Mode)');
      setShowModal(false);
      setFormData({ name: '', email: '', role: '', tenant: 'SNS Grand Hotels', hotel: '-', password: 'password123' });
    } else {
      alert(res.error);
    }
  };

  return (
    <DashboardLayout title="User Management — All Tenants">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">👥 User Management</div>
          <div className="page-header-sub">Manage all users across every tenant in the system</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New User</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <span>🔍</span>
          <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 180 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="main_admin">Main Admin</option>
          <option value="main_client">Main Client</option>
          <option value="franchise_head">Franchise Head</option>
          <option value="hotel_manager">Hotel Manager</option>
          <option value="inventory_manager">Inventory Manager</option>
          <option value="cashier">Cashier</option>
          <option value="chef">Chef</option>
          <option value="worker">Worker</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">All Users ({filtered.length})</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Tenant</th><th>Hotel</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2E5AFF,#00C48C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {u.avatar}
                      </div>
                      <strong>{u.name}</strong>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td><span className={`badge ${ROLE_BADGE[u.role] ?? 'badge-gray'}`} style={{ fontSize: 10 }}>{u.role.replace('_', ' ')}</span></td>
                  <td style={{ fontSize: 12 }}>{u.tenant}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.hotel}</td>
                  <td><span className="badge badge-green">active</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" title="Edit">✏️</button>
                      <button className="btn btn-outline btn-sm" title="Reset Password">🔑</button>
                      {canManage(u.role) && (
                        <button className="btn btn-outline btn-sm" title="Suspend" style={{ color: 'var(--danger)' }}>⏸</button>
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
              <div className="modal-title">➕ New User</div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="John Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" placeholder="user@domain.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Role *</label>
                <select className="form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                  <option value="">Select role...</option>
                  <option value="main_client">Main Client</option>
                  <option value="franchise_head">Franchise Head</option>
                  <option value="hotel_manager">Hotel Manager</option>
                  <option value="inventory_manager">Inventory Manager</option>
                  <option value="cashier">Cashier</option>
                  <option value="chef">Chef</option>
                  <option value="worker">Worker</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              {!canManage(formData.role) && formData.role && (
                <div style={{ color: 'var(--danger)', fontSize: 11 }}>⚠️ You cannot create users with a role equal or higher than yours.</div>
              )}
              <div className="form-group">
                <label className="form-label">Tenant</label>
                <select className="form-select" value={formData.tenant} onChange={e => setFormData({ ...formData, tenant: e.target.value })}>
                  <option>SNS Grand Hotels</option>
                  <option>Royal Residency Chain</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!canManage(formData.role)} onClick={handleCreate}>Create & Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default function AdminUsersPage() { return <AdminUsers />; }
