'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const history = [
  { id: 'PAY-009', orderId: 'ORD-098', table: 5, customer: 'Walk-in', amount: 1240, method: 'card', time: '8:05 PM', cashier: 'Suresh Menon' },
  { id: 'PAY-008', orderId: 'ORD-097', table: 3, customer: 'Kiran M.', amount: 840, method: 'upi', time: '7:48 PM', cashier: 'Suresh Menon' },
  { id: 'PAY-007', orderId: 'ORD-096', table: 8, customer: 'Walk-in', amount: 560, method: 'cash', time: '7:30 PM', cashier: 'Suresh Menon' },
  { id: 'PAY-006', orderId: 'ORD-095', table: 2, customer: 'Priya S.', amount: 1800, method: 'app', time: '6:55 PM', cashier: 'Suresh Menon' },
  { id: 'PAY-005', orderId: 'ORD-094', table: 11, customer: 'Walk-in', amount: 450, method: 'cash', time: '6:30 PM', cashier: 'Suresh Menon' },
];

const methodColor: Record<string, string> = { cash: 'badge-green', card: 'badge-blue', upi: 'badge-purple', app: 'badge-orange' };

function PaymentHistory() {
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('all');
  const filtered = history.filter(p =>
    (method === 'all' || p.method === method) &&
    (p.orderId.includes(search) || p.customer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout title="Payment History">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📋 Payment History</div>
          <div className="page-header-sub">View all processed payments for today's shift</div>
        </div>
        <div className="page-header-actions">
          <select className="form-select" style={{ width: 130 }} value={method} onChange={e => setMethod(e.target.value)}>
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="app">App</option>
          </select>
          <div className="search-bar" style={{ width: 220 }}>
            <span>🔍</span>
            <input placeholder="Search order, customer..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-outline">📥 Export</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Collected', value: `₹${history.reduce((a,p)=>a+p.amount,0).toLocaleString()}`, color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Cash', value: `₹${history.filter(p=>p.method==='cash').reduce((a,p)=>a+p.amount,0).toLocaleString()}`, color: '#F39C12', bg: '#fdf8e8' },
          { label: 'Digital', value: `₹${history.filter(p=>p.method!=='cash').reduce((a,p)=>a+p.amount,0).toLocaleString()}`, color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Transactions', value: history.length, color: '#9B59B6', bg: '#f5f0ff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 22 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Payment ID</th><th>Order</th><th>Table</th><th>Customer</th><th>Amount</th><th>Method</th><th>Time</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontSize: 12, color: '#94A3B8' }}>{p.id}</td>
                  <td><strong>{p.orderId}</strong></td>
                  <td>T{p.table}</td>
                  <td>{p.customer}</td>
                  <td><strong style={{ color: '#00C48C' }}>₹{p.amount}</strong></td>
                  <td><span className={`badge ${methodColor[p.method]}`}>{p.method.toUpperCase()}</span></td>
                  <td style={{ fontSize: 12 }}>{p.time}</td>
                  <td><button className="btn btn-ghost btn-sm">🖨️ Reprint</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default PaymentHistory;
