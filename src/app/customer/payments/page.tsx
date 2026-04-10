'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const payments = [
  { id: 'TXN-4491', date: '2025-03-30', hotel: 'SNS Beach Resort', items: 4, amount: 1840, method: 'upi', status: 'paid' },
  { id: 'TXN-4320', date: '2025-03-22', hotel: 'SNS Beach Resort', items: 3, amount: 960, method: 'app', status: 'paid' },
  { id: 'TXN-4108', date: '2025-03-14', hotel: 'SNS Central', items: 6, amount: 2400, method: 'card', status: 'paid' },
  { id: 'TXN-3890', date: '2025-02-28', hotel: 'SNS Beach Resort', items: 2, amount: 650, method: 'cash', status: 'paid' },
];

const methodEmoji: Record<string, string> = { upi: '📲', app: '📱', card: '🏦', cash: '💵' };
const methodBadge: Record<string, string> = { upi: 'badge-purple', app: 'badge-blue', card: 'badge-orange', cash: 'badge-green' };

function CustomerPayments() {
  const total = payments.reduce((a, p) => a + p.amount, 0);

  return (
    <DashboardLayout title="Payment History">
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="page-header">
          <div className="page-header-left">
            <div className="page-header-title">💳 Payment History</div>
            <div className="page-header-sub">Your dining transactions at SNS Hotels</div>
          </div>
        </div>

        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
          {[
            { label: 'Total Spent', value: `₹${total.toLocaleString()}`, color: '#2E5AFF', bg: '#e8edff' },
            { label: 'Visits', value: payments.length, color: '#00C48C', bg: '#e8fdf7' },
            { label: 'Avg. Bill', value: `₹${(total / payments.length).toFixed(0)}`, color: '#FF8A34', bg: '#fff3e8' },
          ].map(m => (
            <div className="metric-card" key={m.label}>
              <div className="metric-label">{m.label}</div>
              <div className="metric-value" style={{ color: m.color, fontSize: 22 }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {payments.map(p => (
            <div key={p.id} className="card">
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#e8edff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{methodEmoji[p.method]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{p.id}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                    {p.hotel} · {p.items} items · {p.date}
                  </div>
                </div>
                <span className={`badge ${methodBadge[p.method]}`}>{p.method.toUpperCase()}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 900, fontSize: 18, color: '#2E5AFF' }}>₹{p.amount.toLocaleString()}</div>
                  <span className="badge badge-green" style={{ marginTop: 4 }}>Paid</span>
                </div>
                <button className="btn btn-ghost btn-sm">🖨️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
export default CustomerPayments;
