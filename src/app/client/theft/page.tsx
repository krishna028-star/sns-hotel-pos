'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { THEFT_REPORTS, formatCurrency } from '@/lib/mockData';

function ClientTheft() {
  const totalLoss = THEFT_REPORTS.reduce((a, r) => a + r.loss, 0);
  const verified = THEFT_REPORTS.filter(r => r.status === 'verified');
  const pending = THEFT_REPORTS.filter(r => r.status === 'submitted');

  return (
    <DashboardLayout title="Chain Theft Reports">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🚨 Chain Theft Reports</div>
          <div className="page-header-sub">Consolidated theft and discrepancy reports across all hotels</div>
        </div>
        <button className="btn btn-outline">📥 Export Report</button>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {[
          { label: 'Total Reports (MTD)', value: THEFT_REPORTS.length, color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Verified Thefts', value: verified.length, color: '#FF3B30', bg: '#fff0ef' },
          { label: 'Pending Review', value: pending.length, color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Total Loss', value: formatCurrency(totalLoss), color: '#9B59B6', bg: '#f5f0ff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 20 }}>{m.value}</div>
          </div>
        ))}
      </div>

      {verified.length > 0 && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>
          <span>🚨</span>
          <span><strong>{verified.length} verified theft(s)</strong> confirmed across the chain this month. Total confirmed loss: <strong>{formatCurrency(verified.reduce((a,r)=>a+r.loss,0))}</strong></span>
        </div>
      )}

      <div className="card">
        <div className="card-header"><div className="card-title">All Theft Reports</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Hotel</th><th>Ingredient</th><th>Quantity</th><th>Loss</th><th>Notes</th><th>Status</th></tr></thead>
            <tbody>
              {THEFT_REPORTS.map(r => (
                <tr key={r.id}>
                  <td style={{ fontSize: 12 }}>{r.date}</td>
                  <td style={{ fontWeight: 600 }}>{r.hotel}</td>
                  <td><strong>{r.ingredient}</strong></td>
                  <td>{r.qty} {r.unit}</td>
                  <td style={{ color: '#FF3B30', fontWeight: 800 }}>{formatCurrency(r.loss)}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{r.notes}</td>
                  <td><span className={`badge ${r.status==='verified'?'badge-red':r.status==='submitted'?'badge-orange':'badge-gray'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ClientTheft;
