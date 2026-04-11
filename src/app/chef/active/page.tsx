'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ACTIVE_ORDERS } from '@/lib/mockData';

function ChefActive() {
  const cooking = ACTIVE_ORDERS.filter(o => o.status === 'cooking');

  return (
    <DashboardLayout title="Active KOTs">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🔥 Active KOTs</div>
          <div className="page-header-sub">Orders currently being prepared in the kitchen</div>
        </div>
        <div className="stat-pill"><strong style={{ color: '#2E5AFF' }}>{cooking.length}</strong> Cooking</div>
      </div>

      {cooking.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">🍽️</div><div className="empty-state-title">Nothing Cooking</div><div className="empty-state-sub">Accept pending KOTs to start cooking.</div></div></div>
      ) : (
        cooking.map(order => (
          <div key={order.id} className="kot-card cooking" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, background: '#e8edff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#2E5AFF', fontSize: 18 }}>T{order.tableNum}</div>
                  <div>
                    <div style={{ fontWeight: 800 }}>{order.id}</div>
                    <span className="badge badge-blue">Cooking 🔥</span>
                  </div>
                </div>
                {order.items.map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: '#e8edff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#2E5AFF', fontSize: 13, flexShrink: 0 }}>×{item.qty}</div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary">✅ Mark Ready</button>
            </div>
          </div>
        ))
      )}
    </DashboardLayout>
  );
}
export default ChefActive;
