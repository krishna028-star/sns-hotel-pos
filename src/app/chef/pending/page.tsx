'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PENDING_KOTS } from '@/lib/mockData';

function ChefPending() {
  return (
    <DashboardLayout title="Pending KOTs">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🔔 Pending KOTs</div>
          <div className="page-header-sub">New KOTs waiting for your acceptance</div>
        </div>
        <div className="stat-pill"><strong style={{ color: '#FF8A34' }}>{PENDING_KOTS.length}</strong> Waiting</div>
      </div>

      {PENDING_KOTS.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">✅</div><div className="empty-state-title">No Pending KOTs</div><div className="empty-state-sub">All orders have been accepted. Great work!</div></div></div>
      ) : (
        PENDING_KOTS.map(kot => (
          <div key={kot.id} className="alarm-card" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>🔔 {kot.id} — Table {kot.tableNum}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>{kot.orderId} · Received at {kot.time} ({kot.elapsed} ago)</div>
                {kot.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff3e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#FF8A34', flexShrink: 0 }}>×{item.qty}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      {item.note && <div style={{ fontSize: 12, color: '#FF8A34', fontStyle: 'italic' }}>⚠️ {item.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button className="btn btn-primary">🔥 Start Cooking</button>
                <button className="btn btn-outline btn-sm">Transfer to Another Chef</button>
              </div>
            </div>
          </div>
        ))
      )}
    </DashboardLayout>
  );
}
export default ChefPending;
