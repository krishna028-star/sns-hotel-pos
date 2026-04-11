'use client';
import React from 'react';

import { useRouter } from "next/navigation";
import DashboardLayout from '@/components/DashboardLayout';
import { ACTIVE_ORDERS, formatCurrency } from '@/lib/mockData';

const statusLabel: Record<string, string> = { ready: '✅ Ready to Serve', cooking: '🔥 Cooking', kot_sent: '📤 KOT Sent', bill_requested: '💳 Bill Requested', pending: '⏳ Pending' };
const statusColor: Record<string, string> = { ready: '#00C48C', cooking: '#FF8A34', kot_sent: '#2E5AFF', bill_requested: '#9B59B6', pending: '#94A3B8' };

function MyOrders() {
  const router = useRouter();
  const myOrders = ACTIVE_ORDERS.slice(0, 2);

  return (
    <DashboardLayout title="My Orders">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📦 My Orders</div>
          <div className="page-header-sub">Live tracking of your current and past orders</div>
        </div>
      </div>

      {myOrders.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">📦</div><div className="empty-state-title">No Active Orders</div><div className="empty-state-sub">Browse our menu and place your first order!</div><button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => router.push("/customer/dashboard")}>Browse Menu</button></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {myOrders.map(order => (
            <div key={order.id} className="card" style={{ border: `2px solid ${statusColor[order.status]}30` }}>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{order.id}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Table {order.tableNum}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: statusColor[order.status], background: statusColor[order.status] + '15', padding: '6px 14px', borderRadius: 20, fontSize: 13 }}>{statusLabel[order.status]}</span>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginBottom: 6 }}>
                    <span>Order Placed</span><span>KOT Sent</span><span>Cooking</span><span>Ready</span><span>Served</span>
                  </div>
                  <div className="progress-bar" style={{ height: 8 }}>
                    <div className="progress-fill" style={{ width: order.status === 'pending' ? '10%' : order.status === 'kot_sent' ? '35%' : order.status === 'cooking' ? '60%' : order.status === 'ready' ? '85%' : '100%', background: statusColor[order.status] }} />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                      <span>{item.name} × {item.qty}</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                  <span style={{ fontWeight: 800, fontSize: 18, color: '#2E5AFF' }}>{formatCurrency(order.total)}</span>
                  {order.status === 'ready' && <button className="btn btn-primary btn-sm">💳 Pay Now</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
export default MyOrders;
