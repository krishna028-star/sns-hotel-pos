'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';
import { formatCurrency } from '@/lib/mockData';

const methodColor: Record<string, string> = { cash: 'badge-green', card: 'badge-blue', upi: 'badge-purple', app: 'badge-orange' };

function PaymentHistory() {
  const { orders = [] } = useData();
  const safeOrders = Array.isArray(orders) ? orders : [];
  const history = safeOrders.filter((o: any) => o.status === 'paid').map((o: any) => ({
    id: `PAY-${o.id}`,
    orderId: o.id,
    table: o.table?.number || o.tableNum || '?',
    customer: o.waiter?.name || 'Walk-in',
    amount: o.totalAmount || 0,
    method: o.payments?.[0]?.method || 'cash',
    time: new Date(o.createdAt).toLocaleTimeString(),
  }));

  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('all');
  const filtered = history.filter((p: any) =>
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
          { label: 'Total Collected', value: formatCurrency(history.reduce((a: number,p: any)=>a+p.amount,0)), color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Cash', value: formatCurrency(history.filter((p: any)=>p.method==='cash').reduce((a: number,p: any)=>a+p.amount,0)), color: '#F39C12', bg: '#fdf8e8' },
          { label: 'Digital', value: formatCurrency(history.filter((p: any)=>p.method!=='cash').reduce((a: number,p: any)=>a+p.amount,0)), color: '#2E5AFF', bg: '#e8edff' },
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
              {filtered.map((p: any) => (
                <tr key={p.id}>
                  <td style={{ fontSize: 12, color: '#94A3B8' }}>{p.id}</td>
                  <td><strong>{p.orderId}</strong></td>
                  <td>T{p.table}</td>
                  <td>{p.customer}</td>
                  <td><strong style={{ color: '#00C48C' }}>{formatCurrency(p.amount)}</strong></td>
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
