'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';

function FranchiseTheft() {
  // FIX: replaced non-existent updateItem() with verifyTheftReport()
  const { theftReports = [], verifyTheftReport } = useData();
  const [selected, setSelected] = useState<any | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const safeReports = Array.isArray(theftReports) ? theftReports : [];

  const handleVerify = async (id: string, verified: boolean) => {
    setLoading(true);
    const res = await verifyTheftReport(id, verified);
    setLoading(false);
    if (res.ok) {
      setSelected(null);
      setNote('');
    } else {
      alert('Action failed: ' + res.error);
    }
  };

  const statusBadge = (report: any) => {
    if (report.verified) return <span className="badge badge-red">Verified</span>;
    return <span className="badge badge-orange">Pending Review</span>;
  };

  return (
    <DashboardLayout title="Theft Report Review">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🚨 Theft Report Review</div>
          <div className="page-header-sub">Review escalated theft incidents from hotels in your franchise</div>
        </div>
        <div className="stats-row">
          <div className="stat-pill"><strong style={{ color: '#FF3B30' }}>{safeReports.filter((r: any) => !r.verified).length}</strong> Pending</div>
          <div className="stat-pill"><strong style={{ color: '#00C48C' }}>{safeReports.filter((r: any) => r.verified).length}</strong> Verified</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">All Reports</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Item</th><th>Qty Lost</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {safeReports.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>No theft reports found.</td></tr>
              ) : safeReports.map((r: any) => (
                <tr key={r.id}>
                  <td style={{ fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td><strong>{r.item?.name || r.itemId}</strong></td>
                  <td>{Number(r.quantity).toFixed(2)} {r.item?.unit || ''}</td>
                  <td style={{ fontSize: 12, maxWidth: 200 }}>{r.reason}</td>
                  <td>{statusBadge(r)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelected(r); setNote(''); }}>Review</button>
                      {!r.verified && (
                        <button className="btn btn-danger btn-sm" disabled={loading} onClick={() => handleVerify(r.id, true)}>
                          ✅ Verify
                        </button>
                      )}
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
              <div className="modal-title">🚨 Theft Report Review</div>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  ['Item', selected.item?.name || selected.itemId],
                  ['Quantity Lost', `${Number(selected.quantity).toFixed(2)} ${selected.item?.unit || ''}`],
                  ['Reported On', new Date(selected.createdAt).toLocaleString()],
                  ['Status', selected.verified ? 'Verified' : 'Pending'],
                ].map(([k, v]) => (
                  <div key={k as string} style={{ padding: 12, background: '#F4F6FB', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 12, background: '#FFF7ED', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#9a3412' }}>
                📝 {selected.reason}
              </div>
              <div className="form-group">
                <label className="form-label">Investigation Notes</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Add investigation notes..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
              {!selected.verified && (
                <>
                  <button className="btn btn-danger" disabled={loading} onClick={() => handleVerify(selected.id, false)}>
                    ✕ Reject
                  </button>
                  <button className="btn btn-primary" disabled={loading} onClick={() => handleVerify(selected.id, true)}>
                    ✅ Verify Report
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default FranchiseTheft;
