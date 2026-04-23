'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';

function InventoryTheft() {
  const { theftReports = [], createTheftReport } = useData();
  const reports = Array.isArray(theftReports) ? theftReports : [];
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ingredient: '', qty: '', unit: 'kg', loss: '', description: '' });

  const submitReport = async () => {
    if (!form.ingredient || !form.qty) return;
    await createTheftReport({ 
      id: Date.now(), 
      ingredient: form.ingredient, 
      qty: parseFloat(form.qty), 
      unit: form.unit, 
      loss: parseFloat(form.loss) || 0, 
      date: new Date().toISOString().split('T')[0], 
      status: 'submitted', 
      hotel: 'SNS Beach Resort', 
      notes: form.description 
    });
    setShowModal(false);
    setForm({ ingredient: '', qty: '', unit: 'kg', loss: '', description: '' });
  };

  return (
    <DashboardLayout title="Theft Reports">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🚨 Theft Reports</div>
          <div className="page-header-sub">File and track inventory discrepancy & theft reports</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-danger" onClick={() => setShowModal(true)}>🚨 File Theft Report</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Submitted', value: reports.filter((r: any) => r.status === 'submitted').length, color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Verified', value: reports.filter((r: any) => r.status === 'verified').length, color: '#FF3B30', bg: '#fff0ef' },
          { label: 'Total Loss', value: `₹${reports.reduce((a: number, r: any) => a + (r.loss||0), 0).toLocaleString()}`, color: '#9B59B6', bg: '#f5f0ff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 24 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">All Theft Reports</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Ingredient</th><th>Qty Lost</th><th>Est. Loss</th><th>Notes</th><th>Status</th></tr></thead>
            <tbody>
              {reports.map((r: any) => (
                <tr key={r.id}>
                  <td style={{ fontSize: 12 }}>{r.date}</td>
                  <td><strong>{r.ingredient}</strong></td>
                  <td>{r.qty} {r.unit}</td>
                  <td style={{ color: '#FF3B30', fontWeight: 700 }}>₹{Number(r.loss || 0).toLocaleString()}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{r.notes}</td>
                  <td><span className={`badge ${r.status === 'verified' ? 'badge-red' : r.status === 'submitted' ? 'badge-orange' : 'badge-gray'}`}>{r.status}</span></td>
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
              <div className="modal-title">🚨 File Theft Report</div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="alert alert-warning" style={{ marginBottom: 16 }}>
                <span>⚠️</span><span>File this when physical stock does not match system records and the cause is unexplained.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group"><label className="form-label">Ingredient</label><input className="form-input" placeholder="e.g. Chicken" value={form.ingredient} onChange={e => setForm(f => ({ ...f, ingredient: e.target.value }))} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="form-group"><label className="form-label">Quantity Missing</label><input className="form-input" type="number" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Unit</label><select className="form-select" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}><option>kg</option><option>ltr</option><option>piece</option></select></div>
                  <div className="form-group"><label className="form-label">Est. Loss (₹)</label><input className="form-input" type="number" value={form.loss} onChange={e => setForm(f => ({ ...f, loss: e.target.value }))} /></div>
                </div>
                <div className="form-group"><label className="form-label">Description / Notes</label><textarea className="form-input" rows={3} placeholder="Describe where and how the discrepancy was found..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={submitReport}>Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default InventoryTheft;
