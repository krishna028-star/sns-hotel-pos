'use client';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { ROLE_COLORS } from '@/lib/mockData';

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

interface UserManagementProps {
  title: string;
  subtitle: string;
  roleFilterOptions?: string[];
}

export default function UserManagement({ title, subtitle, roleFilterOptions }: UserManagementProps) {
  // BUG FIX: destructure deleteUser — it was missing, causing runtime crash on delete click
  const { user: currentUser, users, addUser, deleteUser, updateUserPassword, canManage } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    tenant: currentUser?.tenant || 'SNS Grand Hotels',
    hotel: '',
    password: ''
  });

  const availableRoles = roleFilterOptions || [
    'main_client', 'franchise_head', 'hotel_manager',
    'inventory_manager', 'cashier', 'chef', 'worker', 'customer'
  ];

  // Only show users this admin can manage (hierarchy-aware)
  const manageableUsers = users.filter(u => canManage(u.role) || u.id === currentUser?.id);

  const filtered = manageableUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const resetForm = () => {
    setEditId(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      tenant: currentUser?.tenant || 'SNS Grand Hotels',
      hotel: '',
      password: ''
    });
  };

  const handleSave = () => {
    setErrorMsg('');
    if (editId) {
      if (!formData.password || formData.password.length < 6) return setErrorMsg('Password must be at least 6 characters.');
      const res = updateUserPassword(editId, formData.password);
      if (res.ok) {
        setSuccessMsg(`✅ Password for "${formData.name}" updated successfully!`);
        setShowModal(false);
        resetForm();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.error ?? 'Failed to update password.');
      }
    } else {
      if (!formData.name.trim() || !formData.email.trim() || !formData.role) return setErrorMsg('Please fill all required fields.');
      if (!formData.password || formData.password.length < 6) return setErrorMsg('Password must be at least 6 characters.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setErrorMsg('Please enter a valid email address.');

      const res = addUser({
        ...formData,
        hotel: formData.hotel || null,
        tenant: formData.tenant || null,
        avatar: formData.name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      });

      if (res.ok) {
        setSuccessMsg(`✅ User "${formData.name}" created successfully!`);
        setShowModal(false);
        resetForm();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.error ?? 'Failed to create user.');
      }
    }
  };

  const handleDelete = (u: typeof users[0]) => {
    if (!confirm(`Permanently delete "${u.name}" (${u.role})?\n\nThis cannot be undone.`)) return;
    const res = deleteUser(u.id);
    if (!res.ok) {
      alert(`❌ ${res.error}`);
    } else {
      setSuccessMsg(`🗑️ User "${u.name}" deleted.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const roleLabel = (role: string) => role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">{title}</div>
          <div className="page-header-sub">{subtitle}</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => { resetForm(); setErrorMsg(''); setShowModal(true); }}>+ New User</button>
        </div>
      </div>

      {successMsg && (
        <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: '#e8fdf7', border: '1px solid #00C48C', color: '#065f46', fontWeight: 600, fontSize: 13 }}>
          {successMsg}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <span>🔍</span>
          <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 180 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          {availableRoles.map(r => (
            <option key={r} value={r}>{roleLabel(r)}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Users ({filtered.length})</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Tenant</th><th>Hotel</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>No users found</td></tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: (ROLE_COLORS[u.role] || '#64748B') + '20',
                          color: ROLE_COLORS[u.role] || '#64748B',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, flexShrink: 0
                        }}>
                          {u.avatar}
                        </div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td><span className={`badge ${ROLE_BADGE[u.role] ?? 'badge-gray'}`} style={{ fontSize: 10 }}>{roleLabel(u.role)}</span></td>
                    <td style={{ fontSize: 12 }}>{u.tenant ?? '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.hotel ?? '—'}</td>
                    <td><span className="badge badge-green">active</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {canManage(u.role) && u.id !== currentUser?.id && (
                          <>
                            <button
                              className="btn btn-outline btn-sm"
                              title="Edit Password"
                              onClick={() => {
                                setFormData({ ...u, password: '' });
                                setEditId(u.id);
                                setShowModal(true);
                                setErrorMsg('');
                              }}
                            >
                              🔑
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              title="Delete User"
                              style={{ color: 'var(--danger)' }}
                              onClick={() => handleDelete(u)}
                            >
                              🗑️
                            </button>
                          </>
                        )}
                        {u.id === currentUser?.id && (
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>You</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editId ? '🔑 Edit Password' : '➕ Create New User'}</div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {errorMsg && (
                <div style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: 8, padding: '10px 14px', color: '#FF3B30', fontSize: 13 }}>
                  ⚠️ {errorMsg}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="e.g. Rajesh Kumar" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={!!editId} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" placeholder="user@domain.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={!!editId} />
              </div>
              <div className="form-group">
                <label className="form-label">{editId ? 'New Password *' : 'Password *'}</label>
                <input className="form-input" type="password" placeholder="Min. 6 characters" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Role *</label>
                <select className="form-select" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                  <option value="">Select role...</option>
                  {availableRoles.map(r => (
                    <option key={r} value={r}>{roleLabel(r)}</option>
                  ))}
                </select>
              </div>
              {formData.role && !canManage(formData.role) && (
                <div style={{ color: 'var(--danger)', fontSize: 11, background: 'rgba(255,59,48,0.08)', padding: '8px 12px', borderRadius: 8 }}>
                  ⚠️ You cannot create users with a role equal to or higher than yours.
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Hotel Assignment</label>
                <input className="form-input" placeholder="e.g. SNS Beach Resort (leave blank if N/A)" value={formData.hotel} onChange={e => setFormData({ ...formData, hotel: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Tenant / Chain</label>
                <input className="form-input" placeholder="e.g. SNS Grand Hotels" value={formData.tenant} onChange={e => setFormData({ ...formData, tenant: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={(!editId && (!formData.role || !canManage(formData.role))) || (editId && !formData.password)}
                onClick={handleSave}
              >
                {editId ? 'Save Password' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
