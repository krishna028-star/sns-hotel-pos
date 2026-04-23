'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { CHAIN_POLICIES } from '@/lib/mockData';

function FranchisePolicies() {
  const [policies, setPolicies] = useState<any[]>(CHAIN_POLICIES);
  const [editId, setEditId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const [saved, setSaved] = useState(false);

  const save = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, value: editVal } : p));
    setEditId(null);
  };

  return (
    <DashboardLayout title="Franchise Policies">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📜 Franchise Policies</div>
          <div className="page-header-sub">Chain-wide rules and configuration applied to all hotels</div>
        </div>
        <span className="badge badge-orange" style={{ fontSize: 13, padding: '6px 14px' }}>Applies to All Hotels</span>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <span>ℹ️</span>
        <span>Policy changes apply immediately to all hotels in the franchise. Changes are logged to the audit trail.</span>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">⚙️ Chain Policies</div></div>
        <div style={{ padding: '0 20px' }}>
          {policies.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                  Scope: {p.scope} · Updated by {p.updatedBy} on {p.updatedAt}
                </div>
              </div>
              {editId === p.id ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input className="form-input" style={{ width: 120, textAlign: 'center', fontWeight: 700 }} value={editVal} onChange={e => setEditVal(e.target.value)} autoFocus />
                  <button className="btn btn-secondary btn-sm" onClick={() => save(p.id)}>Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ padding: '8px 20px', borderRadius: 10, background: '#e8edff', fontWeight: 800, fontSize: 18, color: '#2E5AFF' }}>{p.value}</div>
                  <button className="btn btn-outline btn-sm" onClick={() => { setEditId(p.id); setEditVal(p.value); }}>✏️ Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header"><div className="card-title">📜 Additional Policies</div></div>
        <div style={{ padding: '0 20px' }}>
          {[
            { title: 'Void Policy', desc: 'Workers can request voids only within 5 minutes of order placement. Beyond 5 minutes requires manager approval.' },
            { title: 'Discount Policy', desc: 'Discounts above 10% require Hotel Manager approval. Discounts above 20% require Franchise Head approval.' },
            { title: 'Theft Reporting', desc: 'All inventory discrepancies above ₹500 must be reported within 24 hours of discovery.' },
            { title: 'KOT Timing SLA', desc: 'Kitchen must acknowledge KOTs within 2 minutes. Food must be served within 30 minutes on average.' },
          ].map(p => (
            <div key={p.title} style={{ padding: '14px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
export default FranchisePolicies;
