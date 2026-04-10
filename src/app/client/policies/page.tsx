'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { CHAIN_POLICIES } from '@/lib/mockData';

function ClientPolicies() {
  const [policies, setPolicies] = useState(CHAIN_POLICIES);
  const [editId, setEditId] = useState<number | null>(null);
  const [editVal, setEditVal] = useState('');
  const [saved, setSaved] = useState(false);

  const save = (id: number) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, value: editVal, updatedBy: 'Ramesh Patel', updatedAt: new Date().toISOString().split('T')[0] } : p));
    setEditId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout title="Chain Policies">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📜 Chain Policies & Settings</div>
          <div className="page-header-sub">Global rules applied across all franchises and hotels</div>
        </div>
        <span className="badge badge-green" style={{ fontSize: 13, padding: '6px 14px' }}>Chain Owner Access</span>
      </div>

      {saved && <div className="alert alert-success" style={{ marginBottom: 16 }}><span>✅</span><span>Policy updated and propagated to all hotels.</span></div>}

      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <span>ℹ️</span>
        <span>As Chain Owner, you have full authority to set and modify global policies. Changes propagate instantly to all 4 franchises and 14 hotels.</span>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><div className="card-title">⚙️ Configurable Chain Rules</div></div>
        <div style={{ padding: '0 20px' }}>
          {policies.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                  Applies to: {p.scope} · Last updated by {p.updatedBy} on {p.updatedAt}
                </div>
              </div>
              {editId === p.id ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input className="form-input" style={{ width: 140, textAlign: 'center', fontWeight: 700, fontSize: 18 }} value={editVal} onChange={e => setEditVal(e.target.value)} autoFocus />
                  <button className="btn btn-secondary btn-sm" onClick={() => save(p.id)}>✅ Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg,#e8edff,#f0f4ff)', fontWeight: 900, fontSize: 20, color: '#2E5AFF', border: '1px solid #c7d4ff' }}>{p.value}</div>
                  <button className="btn btn-outline btn-sm" onClick={() => { setEditId(p.id); setEditVal(p.value); }}>✏️ Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📋 Operational Policies (Read-Only Franchise Heads)</div></div>
        <div style={{ padding: '0 20px' }}>
          {[
            { icon: '🔴', title: 'Void & Cancellation', value: 'Workers: 5 min window. Beyond that: Manager approval required.' },
            { icon: '💰', title: 'Discount Tiers', value: '0–10%: Worker. 10–20%: Manager. 20%+: Franchise Head approval.' },
            { icon: '🚨', title: 'Theft Reporting SLA', value: 'Report within 24 hours. Verified reports escalated to chain within 48 hours.' },
            { icon: '👨‍🍳', title: 'Kitchen SLA', value: 'KOT acknowledgement: 2 min. Average service: 30 min.' },
            { icon: '💳', title: 'Payment Methods', value: 'Cash, Card, UPI, In-App Payment. All methods enabled by default.' },
          ].map(p => (
            <div key={p.title} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #F1F5F9', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 22, flexShrink: 0 }}>{p.icon}</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 3 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{p.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ClientPolicies;
