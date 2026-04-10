'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { THEFT_REPORTS } from '@/lib/mockData';

function FranchiseTheft() {
  const [reports, setReports] = useState(THEFT_REPORTS);
  const [selected, setSelected] = useState<(typeof THEFT_REPORTS)[0] | null>(null);
  const [note, setNote] = useState('');

  const escalate = (id: number) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'verified' } : r));
    setSelected(null);
  };

  return (
    <DashboardLayout title="Theft Report Review">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🚨 Theft Report Review</div>
          <div className="page-header-sub">Review escalated theft incidents from hotels in your franchise</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">All Reports</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Hotel</th><th>Ingredient</th><th>Qty Lost</th><th>Est. Loss</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td style={{ fontSize: 12 }}>{r.date}</td>
                  <td>{r.hotel}</td>
                  <td><strong>{r.ingredient}</strong></td>
                  <td>{r.qty} {r.unit}</td>
                  <td style={{ color: '#FF3B30', fontWeight: 700 }}>₹{r.loss.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${r.status === 'verified' ? 'badge-red' : r.status === 'submitted' ? 'badge-orange' : 'badge-gray'}`}>{r.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelected(r); setNote(''); }}>Review</button>
                      {r.status === 'submitted' && <button className="btn btn-danger btn-sm" onClick={() => escalate(r.id)}>Escalate</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">🚨 Theft Report #{selected.id}</div>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[['Hotel', selected.hotel], ['Ingredient', selected.ingredient], ['Quantity Lost', `${selected.qty} ${selected.unit}`], ['Estimated Loss', `₹${selected.loss.toLocaleString()}`], ['Date', selected.date], ['Status', selected.status]].map(([k, v]) => (
                  <div key={k} style={{ padding: 12, background: '#F4F6FB', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 12, background: '#FFF7ED', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#9a3412' }}>
                📝 {selected.notes}
              </div>
              <div className="form-group">
                <label className="form-label">Your Review Notes</label>
                <textarea className="form-input" rows={3} placeholder="Add investigation notes..." value={note} onChange={e => setNote(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => escalate(selected.id)}>Escalate to Main Client</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default FranchiseTheft;
