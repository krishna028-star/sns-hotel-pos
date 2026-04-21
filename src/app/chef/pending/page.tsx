'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PENDING_KOTS } from '@/lib/mockData';
import { useNotifications } from '@/lib/notifications';

type KOTItem = { name: string; qty: number; note?: string };
type KOT = {
  id: string;
  tableNum: number;
  orderId: string;
  time: string;
  elapsed: string;
  items: KOTItem[];
  status: 'pending' | 'cooking' | 'ready';
};

import { useData } from '@/lib/DataContext';

function ChefPending() {
  const { pendingKots: dataKots = [], updateKOTStatus } = useData();
  const { notify } = useNotifications();

  const safeKots = Array.isArray(dataKots) ? dataKots : [];

  const startCooking = async (id: string) => {
    const res = await updateKOTStatus(id, 'cooking');
    if (res.ok) notify('order', `Chef started cooking KOT ${id}`);
  };

  const markReady = async (id: string, tableNum: number) => {
    const res = await updateKOTStatus(id, 'ready');
    if (res.ok) notify('order', `🔔 Table ${tableNum} order is READY to serve!`);
  };

  const pendingKots = safeKots.filter((k: any) => (k.status || 'pending') === 'pending');
  const cookingKots = safeKots.filter((k: any) => k.status === 'cooking');

  return (
    <DashboardLayout title="Pending KOTs">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🔔 Kitchen Display</div>
          <div className="page-header-sub">Accept KOTs and mark orders ready for service</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="stat-pill">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF8A34', display: 'inline-block' }} />
            <strong style={{ color: '#FF8A34' }}>{pendingKots.length}</strong> Waiting
          </div>
          <div className="stat-pill">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2E5AFF', display: 'inline-block' }} />
            <strong style={{ color: '#2E5AFF' }}>{cookingKots.length}</strong> Cooking
          </div>
        </div>
      </div>

      {/* Pending KOTs */}
      {pendingKots.length > 0 && (
        <>
          <div style={{ fontWeight: 700, color: '#FF8A34', marginBottom: 10, fontSize: 13 }}>⏳ WAITING ACCEPTANCE</div>
          {pendingKots.map(kot => (
            <div key={kot.id} className="alarm-card" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
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
                  {/* BUG FIX: Added onClick handler that was completely missing */}
                  <button className="btn btn-primary" onClick={() => startCooking(kot.id)}>🔥 Start Cooking</button>
                  <button className="btn btn-outline btn-sm" style={{ color: '#64748B' }}>Transfer Chef</button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Cooking KOTs */}
      {cookingKots.length > 0 && (
        <>
          <div style={{ fontWeight: 700, color: '#2E5AFF', marginBottom: 10, fontSize: 13, marginTop: pendingKots.length > 0 ? 24 : 0 }}>🔥 CURRENTLY COOKING</div>
          {cookingKots.map(kot => (
            <div key={kot.id} className="card" style={{ marginBottom: 14, border: '2px solid #2E5AFF' }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>🔥 {kot.id} — Table {kot.tableNum}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{kot.items.map(i => `${i.name} ×${i.qty}`).join(', ')}</div>
                </div>
                <button className="btn btn-secondary" onClick={() => markReady(kot.id, kot.tableNum)}>
                  ✅ Mark Ready
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {pendingKots.length === 0 && cookingKots.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-title">Kitchen Clear!</div>
            <div className="empty-state-sub">No pending or active KOTs. Great work!</div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default ChefPending;
