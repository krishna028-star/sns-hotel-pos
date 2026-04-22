'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';
import { formatCurrency } from '@/lib/mockData';

const methodEmoji: Record<string, string> = { upi: '📲', app: '📱', card: '🏦', cash: '💵', other: '🔄' };
const methodBadge: Record<string, string> = { upi: 'badge-purple', app: 'badge-blue', card: 'badge-orange', cash: 'badge-green', other: 'badge-gray' };

function CustomerPayments() {
  const { orders = [] } = useData();
  const safeOrders = Array.isArray(orders) ? orders : [];
  
  // Since this is a demo, we assume "paid" orders belong to the user's history
  const payments = safeOrders.filter((o: any) => o.status === 'paid').map((o: any) => ({
    id: o.id,
    date: new Date(o.createdAt || Date.now()).toISOString().split('T')[0],
    hotel: o.hotelId ? `Hotel ${o.hotelId}` : 'SNS Beach Resort',
    items: (o.items || []).length,
    amount: Number(o.totalAmount || o.total || 0),
    method: o.paymentMethod || 'cash',
    status: o.status
  }));

  const total = payments.reduce((a: number, p: any) => a + p.amount, 0);

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
