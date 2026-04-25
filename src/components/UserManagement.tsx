'use client';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useData } from '@/lib/DataContext';
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
  const { tenants, hotels } = useData();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    tenantId: '',
    hotelId: '',
    password: '',
    staffId: '',
    age: '',
    salary: '',
    workingDays: '26',
    presenceThisMonth: '26',
    remarks: ''
  });

  let availableRoles = roleFilterOptions || [
    'main_client', 'franchise_head', 'hotel_manager',
    'inventory_manager', 'cashier', 'chef', 'worker', 'customer'
  ];
  // BUG FIX: Main Client must NOT be able to create another Main Client.
  if (currentUser?.role !== 'main_admin') {
    availableRoles = availableRoles.filter(r => r !== 'main_client');
  }

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
      tenantId: currentUser?.tenantId || tenants[0]?.id || '',
      hotelId: currentUser?.hotelId || '',
      password: '',
      staffId: '',
      age: '',
      salary: '',
      workingDays: '26',
      presenceThisMonth: '26',
      remarks: ''
    });
    setShowPassword(false);
  };

  const handleSave = async () => {
    setErrorMsg('');
    if (editId) {
      if (!formData.password || formData.password.length < 6) return setErrorMsg('Password must be at least 6 characters.');
      const res = await updateUserPassword(editId, formData.password);
      if (res.ok) {
        setSuccessMsg(`✅ Password for "${formData.name}" updated successfully in cloud!`);
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

      const res = await addUser({
        ...formData,
        hotelId: formData.hotelId || null,
        tenantId: formData.tenantId || null,
        avatar: formData.name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      } as any);

      if (res.ok) {
        setSuccessMsg(`✅ User "${formData.name}" created globally via Cloud DB!`);
        setShowModal(false);
        resetForm();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.error ?? 'Failed to create user. Ensure internet connection.');
      }
    }
  };

  const handleDelete = async (u: typeof users[0]) => {
    if (!confirm(`Permanently delete "${u.name}" (${u.role})?\n\nThis cannot be undone.`)) return;
    const res = await deleteUser(u.id);
    if (!res.ok) {
      alert(`❌ ${res.error}`);
    } else {
      setSuccessMsg(`🗑️ User "${u.name}" deleted from Cloud.`);
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
              <tr><th>Staff ID</th><th>Name</th><th>Email</th><th>Role</th><th>Hotel</th><th>Details</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>No users found</td></tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id}>
                    <td><code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{u.staffId || 'TBD'}</code></td>
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
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.hotel ?? '—'}</td>
                    <td>
                      <div style={{ fontSize: 10, lineHeight: 1.4 }}>
                        {u.age && <div>Age: {u.age}</div>}
                        {u.salary && <div>Salary: ₹{u.salary}</div>}
                        {u.joiningDate && <div>Joined: {new Date(u.joiningDate).toLocaleDateString()}</div>}
                      </div>
                    </td>
                    <td><span className={`badge ${u.isActive !== false ? 'badge-green' : 'badge-red'}`}>{u.isActive !== false ? 'active' : 'suspended'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {canManage(u.role) && u.id !== currentUser?.id && (
                          <>
                            <button
                              className="btn btn-outline btn-sm"
                              title="Edit Password"
                              onClick={() => {
                                setFormData({
                                  name: u.name,
                                  email: u.email,
                                  role: u.role,
                                  tenantId: u.tenantId || '',
                                  hotelId: u.hotelId || '',
                                  password: '',
                                  staffId: u.staffId || '',
                                  age: u.age ? String(u.age) : '',
                                  salary: u.salary ? String(u.salary) : '',
                                  workingDays: u.workingDays ? String(u.workingDays) : '',
                                  presenceThisMonth: u.presenceThisMonth ? String(u.presenceThisMonth) : '',
                                  remarks: u.remarks || ''
                                });
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
                <div style={{ position: 'relative' }}>
                  <input 
                    className="form-input" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Min. 6 characters" 
                    value={formData.password} 
                    onChange={e => setFormData({ ...formData, password: e.target.value })} 
                    style={{ paddingRight: 40 }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 16,
                      opacity: 0.6
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
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
                <label className="form-label">System Staff ID *</label>
                <input className="form-input" placeholder="e.g. SNS-WKR-101" value={formData.staffId} onChange={e => setFormData({ ...formData, staffId: e.target.value })} disabled={!!editId} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input className="form-input" type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Salary (₹)</label>
                  <input className="form-input" type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Required Work Days</label>
                  <input className="form-input" type="number" value={formData.workingDays} onChange={e => setFormData({ ...formData, workingDays: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Present Days</label>
                  <input className="form-input" type="number" value={formData.presenceThisMonth} onChange={e => setFormData({ ...formData, presenceThisMonth: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Remarks / Special Notes</label>
                <textarea className="form-input" style={{ minHeight: 60 }} value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} />
              </div>
              {currentUser?.role === 'main_admin' && (
                <div className="form-group">
                  <label className="form-label">Tenant (Main Client) *</label>
                  <select className="form-select" value={formData.tenantId} onChange={e => setFormData({ ...formData, tenantId: e.target.value, hotelId: '' })}>
                    <option value="">Select Tenant...</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Hotel Assignment</label>
                <select className="form-select" value={formData.hotelId} onChange={e => setFormData({ ...formData, hotelId: e.target.value })}>
                   <option value="">Select Hotel...</option>
                   {hotels.filter(h => !formData.tenantId || h.tenantId === formData.tenantId).map(h => (
                     <option key={h.id} value={h.id}>{h.name}</option>
                   ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={Boolean((!editId && (!formData.role || !canManage(formData.role))) || (editId && !formData.password))}
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
