'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';

function Reconciliation() {
  const { activeOrders } = useData();
  const [actualCash, setActualCash] = useState('');
  
  const paidCashOrders = activeOrders.filter((o: any) => o.status === 'paid');
  const expectedCash = paidCashOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  const diff = parseFloat(actualCash || '0') - expectedCash;
  const [submitted, setSubmitted] = useState(false);

  return (
    <DashboardLayout title="Daily Reconciliation">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🧾 Daily Cash Reconciliation</div>
          <div className="page-header-sub">Match physical cash with system records at end of shift</div>
        </div>
      </div>

      {submitted ? (
        <div className="card">
          <div className="empty-state" style={{ padding: 60 }}>
            <div style={{ fontSize: 64 }}>{diff === 0 ? '✅' : '⚠️'}</div>
            <div className="empty-state-title">{diff === 0 ? 'Reconciliation Complete!' : 'Discrepancy Reported'}</div>
            <div className="empty-state-sub">{diff === 0 ? 'Cash matches perfectly. Great job!' : `A discrepancy of ₹${Math.abs(diff)} has been reported to the manager.`}</div>
            <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => { setSubmitted(false); setActualCash(''); }}>New Reconciliation</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">📊 System Record</div></div>
            <div className="card-body">
              {[
                { label: 'Expected Cash (from payments)', value: `₹${expectedCash.toLocaleString()}`, highlight: true },
                { label: `Cash Payments (${paidCashOrders.length})`, value: `₹${expectedCash.toLocaleString()}`, highlight: false },
                { label: 'Digital Payments', value: '₹0', highlight: false },
                { label: 'Total Revenue', value: `₹${expectedCash.toLocaleString()}`, highlight: false },
                { label: 'Refunds Processed', value: '₹0', highlight: false },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ color: '#64748B', fontSize: 13 }}>{s.label}</span>
                  <span style={{ fontWeight: s.highlight ? 900 : 700, fontSize: s.highlight ? 16 : 14, color: s.highlight ? '#2E5AFF' : '#0F172A' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">💵 Physical Count</div></div>
            <div className="card-body">
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>Count the cash in your drawer and enter the total below:</div>
                <input
                  className="form-input"
                  type="number"
                  style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', padding: '16px', color: '#2E5AFF' }}
                  placeholder="₹0"
                  value={actualCash}
                  onChange={e => setActualCash(e.target.value)}
                />
              </div>

              {parseFloat(actualCash) > 0 && (
                <div style={{ padding: 16, borderRadius: 12, background: diff === 0 ? '#e8fdf7' : diff > 0 ? '#fff7ed' : '#fff0ef', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Difference</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: diff === 0 ? '#00C48C' : diff > 0 ? '#FF8A34' : '#FF3B30' }}>
                    {diff > 0 ? '+' : ''}{diff === 0 ? '₹0 — Perfect Match! ✅' : `₹${Math.abs(diff).toLocaleString()}`}
                  </div>
                  {diff !== 0 && (
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                      {diff > 0 ? '↑ Excess cash — may need investigation' : '↓ Shortage — will be reported to manager'}
                    </div>
                  )}
                </div>
              )}

              <button className="btn btn-primary btn-full btn-lg" disabled={!actualCash} onClick={() => setSubmitted(true)}>
                Submit Reconciliation
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default Reconciliation;
