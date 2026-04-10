'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth';

function CustomerProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: '+91 98765 43210', birthday: '1995-06-15' });
  const [saved, setSaved] = useState(false);

  const save = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <DashboardLayout title="My Profile">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {saved && <div className="alert alert-success" style={{ marginBottom: 16 }}><span>✅</span><span>Profile updated successfully!</span></div>}

        {/* Avatar Card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ padding: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#2E5AFF,#00C48C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 30 }}>{user?.avatar}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{form.name}</div>
              <div style={{ color: '#64748B' }}>{form.email}</div>
              <span className="badge badge-blue" style={{ marginTop: 6 }}>Customer</span>
            </div>
            <button className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel' : '✏️ Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><div className="card-title">Personal Information</div></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', icon: '👤' },
                { label: 'Email Address', key: 'email', type: 'email', icon: '✉️' },
                { label: 'Phone Number', key: 'phone', type: 'tel', icon: '📱' },
                { label: 'Date of Birth', key: 'birthday', type: 'date', icon: '🎂' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  {editing ? (
                    <input className="form-input" type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#F4F6FB', borderRadius: 8, fontSize: 14 }}>
                      <span>{f.icon}</span>
                      <span style={{ fontWeight: 500 }}>{(form as any)[f.key]}</span>
                    </div>
                  )}
                </div>
              ))}
              {editing && (
                <button className="btn btn-primary btn-full" onClick={save}>Save Changes</button>
              )}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <div className="card-header"><div className="card-title">Preferences</div></div>
          <div className="card-body">
            {[
              { label: 'Order Notifications', sub: 'Get notified when your food is ready', enabled: true },
              { label: 'Booking Reminders', sub: 'Reminder 30 min before your reservation', enabled: true },
              { label: 'Promotional Offers', sub: 'Receive special deals and discounts', enabled: false },
            ].map(p => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{p.sub}</div>
                </div>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: p.enabled ? '#2E5AFF' : '#E2E8F0', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: p.enabled ? 22 : 2, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default CustomerProfile;
