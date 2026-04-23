'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';
import { formatCurrency } from '@/lib/mockData';

// Generate simulated "alarms" from activeOrders that are requesting the bill
function CashierAlarms() {
  const { activeOrders = [], processPayment } = useData();
  const safeOrders = Array.isArray(activeOrders) ? activeOrders : [];

  // Consider "app" payments or "bill_requested" status as alarms that need processing
  const alarms = safeOrders.filter((o: any) => o.status === 'bill_requested' || o.paymentMethod === 'app');
  // Local state for recently accepted payments in the current session
  const [accepted, setAccepted] = useState<any[]>([]);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setPulse(v => !v), 800);
    return () => clearInterval(t);
  }, []);

  const acceptPayment = async (id: string) => {
    const item = alarms.find((a: any) => a.id === id);
    if (item) {
      await processPayment(id, { method: item.paymentMethod || 'app' });
      setAccepted(prev => [{ ...item, status: 'paid', paymentMethod: item.paymentMethod || 'app' }, ...prev]);
    }
  };

  return (
    <DashboardLayout title="Payment Alarms">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            🔔 Payment Alarms
            {alarms.length > 0 && (
              <span className="blink" style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF3B30', display: 'inline-block' }} />
            )}
          </div>
          <div className="page-header-sub">Real-time alerts when customers pay via app</div>
        </div>
        <div className="stat-pill"><strong style={{ color: alarms.length > 0 ? '#FF3B30' : '#00C48C' }}>{alarms.length}</strong> Active Alarms</div>
      </div>

      {alarms.length === 0 ? (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="empty-state">
            <div style={{ fontSize: 48 }}>✅</div>
            <div className="empty-state-title">No Active Alarms</div>
            <div className="empty-state-sub">All app payments have been processed. Waiting for new payments…</div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {alarms.map(alarm => (
            <div key={alarm.id} style={{
              borderRadius: 16, border: `2px solid #FF3B30`,
              background: '#fff', padding: 20,
              boxShadow: pulse ? '0 0 0 6px rgba(255,59,48,0.12)' : '0 0 0 0 rgba(255,59,48,0)',
              transition: 'box-shadow 0.4s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 36 }}>📲</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 17, color: '#FF3B30' }}>App Payment Received!</div>
                  <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                    <strong>{alarm.customer?.name || alarm.customerId || 'Customer'}</strong> · Table {alarm.table?.number || alarm.tableId} · Order {alarm.id}
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{new Date(alarm.createdAt || Date.now()).toLocaleTimeString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#2E5AFF' }}>{formatCurrency(Number(alarm.totalAmount || alarm.total || 0))}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>via {(alarm.paymentMethod || 'APP').toUpperCase()}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button className="btn btn-secondary" style={{ fontSize: 15, padding: '10px 24px', fontWeight: 800 }} onClick={() => acceptPayment(alarm.id)}>
                    ✅ Accept Payment
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ color: '#94A3B8' }}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {accepted.length > 0 && (
        <div className="card">
          <div className="card-header"><div className="card-title">✅ Recently Accepted</div></div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Table</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
              <tbody>
                {accepted.map((p: any) => (
                  <tr key={p.id}>
                    <td><strong>{p.id}</strong></td>
                    <td>{p.customer?.name || p.customerId || 'Customer'}</td>
                    <td>Table {p.table?.number || p.tableId}</td>
                    <td><strong style={{ color: '#00C48C' }}>{formatCurrency(Number(p.totalAmount || p.total || 0))}</strong></td>
                    <td><span className="badge badge-purple">{p.paymentMethod || 'app'}</span></td>
                    <td><span className="badge badge-green">Accepted ✅</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default CashierAlarms;
