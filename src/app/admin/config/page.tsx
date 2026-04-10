'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { AuthProvider } from '@/lib/auth';

function AdminConfig() {
  const [tab, setTab] = useState('taxes');
  const [policy, setPolicy] = useState({ bookingExpiry: 2, theftThreshold: 500, workerDiscount: 10, sessionTimeout: 30, mfaRequired: true });

  return (
    <DashboardLayout title="Global Configuration">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">⚙️ Global Configuration</div>
          <div className="page-header-sub">System-wide settings propagated to all tenants (overridable per tenant)</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm">↩ Reset Defaults</button>
          <button className="btn btn-primary" onClick={() => alert('Settings saved! (Demo)')}>💾 Save All</button>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 24 }}>
        {[
          { id: 'taxes', label: '💰 Taxes' },
          { id: 'gateways', label: '💳 Payment Gateways' },
          { id: 'policies', label: '📜 System Policies' },
          { id: 'notifications', label: '🔔 Notifications' },
          { id: 'integrations', label: '🔌 Integrations' },
        ].map(t => (
          <div key={t.id} className={`tab-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</div>
        ))}
      </div>

      {tab === 'taxes' && (
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-title">Tax Rules</div>
              <button className="btn btn-primary btn-sm">+ Add Tax Rule</button>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Tax Name</th><th>Rate (%)</th><th>Applies To</th><th>Effective From</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {[
                    { name: 'GST (5%)', rate: 5, applies: 'Food', from: '2024-01-01', active: true },
                    { name: 'GST (12%)', rate: 12, applies: 'Beverages', from: '2024-01-01', active: true },
                    { name: 'Service Charge', rate: 10, applies: 'All', from: '2024-06-01', active: false },
                  ].map((tax, i) => (
                    <tr key={i}>
                      <td><strong>{tax.name}</strong></td>
                      <td>{tax.rate}%</td>
                      <td>{tax.applies}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tax.from}</td>
                      <td><span className={`badge ${tax.active ? 'badge-green' : 'badge-gray'}`}>{tax.active ? 'Active' : 'Inactive'}</span></td>
                      <td><div style={{ display: 'flex', gap: 6 }}><button className="btn btn-outline btn-sm">✏️</button><button className="btn btn-outline btn-sm" style={{ color: 'var(--danger)' }}>🗑</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Global Tax Settings</div></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Apply tax before discount?', checked: true },
                { label: 'Round tax to nearest integer?', checked: false },
                { label: 'Include cess (4%)?', checked: true },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14 }}>{s.label}</span>
                  <div style={{ width: 44, height: 24, background: s.checked ? 'var(--primary)' : 'var(--border)', borderRadius: 12, cursor: 'pointer', position: 'relative', transition: '0.2s' }}>
                    <div style={{ position: 'absolute', top: 3, left: s.checked ? 22 : 3, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: '0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'gateways' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { name: 'Razorpay', icon: '💙', enabled: true, mode: 'live' },
            { name: 'PhonePe', icon: '💜', enabled: true, mode: 'test' },
            { name: 'Stripe', icon: '🔷', enabled: false, mode: 'test' },
          ].map(gw => (
            <div className="card" key={gw.name}>
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{gw.icon}</span>
                  <div>
                    <div className="card-title">{gw.name}</div>
                    <span className={`badge ${gw.mode === 'live' ? 'badge-green' : 'badge-orange'}`}>{gw.mode === 'live' ? '🟢 Live' : '🟡 Test'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 12 }}>{gw.enabled ? 'Enabled' : 'Disabled'}</span>
                  <div style={{ width: 44, height: 24, background: gw.enabled ? 'var(--secondary)' : 'var(--border)', borderRadius: 12, cursor: 'pointer', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 3, left: gw.enabled ? 22 : 3, width: 18, height: 18, background: '#fff', borderRadius: '50%' }} />
                  </div>
                </div>
              </div>
              {gw.enabled && (
                <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">API Key</label><input className="form-input" type="password" value="rzp_live_xxxxxxxxxxxx" readOnly /></div>
                  <div className="form-group"><label className="form-label">API Secret</label><input className="form-input" type="password" value="••••••••••••••••" readOnly /></div>
                  <div><button className="btn btn-outline btn-sm">🔌 Test Connection</button></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'policies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">📅 Booking & Table Policies</div></div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label className="form-label">Booking Expiry (hours)</label><input className="form-input" type="number" value={policy.bookingExpiry} onChange={e => setPolicy({ ...policy, bookingExpiry: +e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Max Advance Booking (days)</label><input className="form-input" type="number" defaultValue={7} /></div>
              <div className="form-group"><label className="form-label">Cancellation Window (min)</label><input className="form-input" type="number" defaultValue={30} /></div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">🚨 Theft & Inventory Policies</div></div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label className="form-label">Theft Report Threshold (₹)</label><input className="form-input" type="number" value={policy.theftThreshold} onChange={e => setPolicy({ ...policy, theftThreshold: +e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Low Stock Alert (%)</label><input className="form-input" type="number" defaultValue={20} /></div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">💰 Discount & Security Policies</div></div>
            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group"><label className="form-label">Worker Discount Limit (%)</label><input className="form-input" type="number" value={policy.workerDiscount} onChange={e => setPolicy({ ...policy, workerDiscount: +e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Cashier Refund Limit (₹)</label><input className="form-input" type="number" defaultValue={1000} /></div>
              <div className="form-group"><label className="form-label">Session Timeout (min)</label><input className="form-input" type="number" value={policy.sessionTimeout} onChange={e => setPolicy({ ...policy, sessionTimeout: +e.target.value })} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label className="form-label" style={{ margin: 0 }}>Require MFA for Admins</label>
                <div style={{ width: 44, height: 24, background: policy.mfaRequired ? 'var(--primary)' : 'var(--border)', borderRadius: 12, cursor: 'pointer', position: 'relative' }} onClick={() => setPolicy({ ...policy, mfaRequired: !policy.mfaRequired })}>
                  <div style={{ position: 'absolute', top: 3, left: policy.mfaRequired ? 22 : 3, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: '0.15s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(tab === 'notifications' || tab === 'integrations') && (
        <div className="card">
          <div className="card-body">
            <div className="empty-state">
              <div className="empty-state-icon">🔧</div>
              <div className="empty-state-title">{tab === 'notifications' ? 'Notification Templates' : 'Integration Keys'}</div>
              <div className="empty-state-sub">Configure email templates, SMS settings, and third-party API keys here.</div>
              <button className="btn btn-primary" style={{ marginTop: 12 }}>Configure</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default function AdminConfigPage() { return <AuthProvider><AdminConfig /></AuthProvider>; }
