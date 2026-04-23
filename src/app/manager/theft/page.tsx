'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';

function ManagerTheft() {
  const { theftReports: reports, verifyTheftReport } = useData();
  const [selected, setSelected] = useState<any | null>(null);
  const [note, setNote] = useState('');

  const handle = (id: string | number, status: 'verified' | 'rejected') => {
    verifyTheftReport(String(id), status === 'verified');
    setSelected(null);
    setNote('');
  };

  const pending = reports.filter((r: any) => r.status === 'submitted');

  return (
    <DashboardLayout title="Theft Report Investigation">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🚨 Theft Report Investigation</div>
          <div className="page-header-sub">Review and investigate theft reports filed by Inventory Manager</div>
        </div>
          <div className="stats-row">
            <div className="stat-pill"><strong style={{ color: '#FF8A34' }}>{pending.length}</strong> Pending</div>
            <div className="stat-pill"><strong style={{ color: '#FF3B30' }}>{reports.filter((r: any) => r.status === 'verified').length}</strong> Verified</div>
            <div className="stat-pill"><strong style={{ color: '#64748B' }}>{reports.filter((r: any) => r.status === 'rejected').length}</strong> Rejected</div>
          </div>
      </div>

      {pending.length > 0 && <div className="alert alert-warning" style={{ marginBottom: 16 }}><span>⚠️</span><span>{pending.length} theft report(s) are awaiting your investigation and decision.</span></div>}

      <div className="card">
        <div className="card-header"><div className="card-title">All Theft Reports</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Ingredient</th><th>Qty Lost</th><th>Est. Loss</th><th>Notes</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {reports.map((r: any) => (
                <tr key={r.id}>
                  <td style={{ fontSize: 12 }}>{r.date}</td>
                  <td><strong>{r.ingredient}</strong></td>
                  <td>{r.qty} {r.unit}</td>
                  <td style={{ color: '#FF3B30', fontWeight: 700 }}>₹{Number(r.loss || 0).toLocaleString()}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{r.notes}</td>
                  <td><span className={`badge ${r.status === 'verified' ? 'badge-red' : r.status === 'submitted' ? 'badge-orange' : 'badge-gray'}`}>{r.status}</span></td>
                  <td>
                    {r.status === 'submitted'
                      ? <button className="btn btn-primary btn-sm" onClick={() => { setSelected(r); setNote(''); }}>Investigate</button>
                      : <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(r); setNote(r.notes); }}>View</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">🚨 Theft Report — {selected.ingredient}</div>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                {[['Date', selected.date], ['Ingredient', selected.ingredient], ['Quantity Lost', `${selected.qty} ${selected.unit}`], ['Estimated Loss', `₹${Number(selected.loss || 0).toLocaleString()}`], ['Status', selected.status], ['Hotel', selected.hotel]].map(([k, v]) => (
                  <div key={k as string} style={{ padding: 12, background: '#F4F6FB', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 12, background: '#FFF7ED', borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: '#9a3412', fontWeight: 600 }}>Inventory Manager Notes</div>
                <div style={{ color: '#9a3412' }}>{selected.notes}</div>
              </div>
              {selected.status === 'submitted' && (
                <div className="form-group">
                  <label className="form-label">Manager Investigation Notes</label>
                  <textarea className="form-input" rows={3} placeholder="Describe investigation findings..." value={note} onChange={e => setNote(e.target.value)} style={{ resize: 'vertical' }} />
                </div>
              )}
            </div>
            {selected.status === 'submitted' && (
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
                <button className="btn btn-secondary" onClick={() => handle(selected.id, 'rejected')}>✕ Reject (Not Theft)</button>
                <button className="btn btn-danger" onClick={() => handle(selected.id, 'verified')}>✅ Verify Theft</button>
              </div>
            )}
            {selected.status !== 'submitted' && (
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default ManagerTheft;
