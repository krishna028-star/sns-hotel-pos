'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

function ShiftManagement() {
  const [shiftActive, setShiftActive] = useState(true);
  const [startTime] = useState('09:00 AM');

  return (
    <DashboardLayout title="Shift Management">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🕐 Shift Management</div>
          <div className="page-header-sub">Track your active shift and manage end-of-shift reconciliation</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ border: shiftActive ? '2px solid #00C48C' : '2px solid #E2E8F0' }}>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: shiftActive ? '#e8fdf7' : '#F4F6FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{shiftActive ? '🟢' : '⚫'}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{shiftActive ? 'Shift Active' : 'No Active Shift'}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{shiftActive ? `Started at ${startTime}` : 'Start a new shift to begin accepting payments'}</div>
              </div>
            </div>
            {shiftActive ? (
              <button className="btn btn-danger btn-full" onClick={() => setShiftActive(false)}>🔴 End Shift</button>
            ) : (
              <button className="btn btn-secondary btn-full" onClick={() => setShiftActive(true)}>🟢 Start Shift</button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div style={{ fontWeight: 700, marginBottom: 16 }}>📊 Today's Shift Summary</div>
            {[
              { label: 'Shift Start', value: startTime },
              { label: 'Total Payments', value: '47' },
              { label: 'Cash Collected', value: '₹18,200' },
              { label: 'Digital Payments', value: '₹42,800' },
              { label: 'Total Revenue', value: '₹61,000' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', fontSize: 13 }}>{s.label}</span>
                <span style={{ fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
            <a href="/cashier/reconcile" style={{ marginTop: 16, display: 'block' }}>
              <button className="btn btn-primary btn-full">🧾 Go to Reconciliation</button>
            </a>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📅 Recent Shifts</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Start</th><th>End</th><th>Cash</th><th>Digital</th><th>Discrepancy</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { date: 'Mar 29', start: '9:00 AM', end: '9:30 PM', cash: '₹22,400', digital: '₹44,600', disc: '₹0', status: 'closed' },
                { date: 'Mar 28', start: '9:00 AM', end: '9:15 PM', cash: '₹18,800', digital: '₹38,200', disc: '₹-200', status: 'closed' },
                { date: 'Mar 27', start: '8:45 AM', end: '9:00 PM', cash: '₹20,500', digital: '₹40,100', disc: '₹0', status: 'closed' },
              ].map(s => (
                <tr key={s.date}>
                  <td>{s.date}</td>
                  <td>{s.start}</td>
                  <td>{s.end}</td>
                  <td>{s.cash}</td>
                  <td>{s.digital}</td>
                  <td style={{ color: s.disc === '₹0' ? '#00C48C' : '#FF3B30', fontWeight: 700 }}>{s.disc}</td>
                  <td><span className="badge badge-gray">Closed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ShiftManagement;
