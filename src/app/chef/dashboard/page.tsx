'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PENDING_KOTS, ACTIVE_ORDERS } from '@/lib/mockData';

type KOTStatus = 'pending' | 'cooking' | 'ready';

interface KOT {
  id: string;
  orderId: string;
  tableNum: number;
  items: { name: string; qty: number; note: string }[];
  time: string;
  elapsed: string;
  status: KOTStatus;
}

function KitchenDisplay() {
  const [kots, setKots] = useState<KOT[]>(
    PENDING_KOTS.map(k => ({ ...k, status: 'pending' as KOTStatus }))
  );

  const advance = (id: string) => {
    setKots(prev => prev.map(k => {
      if (k.id !== id) return k;
      const next: Record<KOTStatus, KOTStatus | null> = { pending: 'cooking', cooking: 'ready', ready: null };
      const nextStatus = next[k.status];
      return nextStatus ? { ...k, status: nextStatus } : k;
    }));
  };

  const colors: Record<KOTStatus, { border: string; bg: string; text: string; badge: string }> = {
    pending: { border: '#FF8A34', bg: '#fff3e8', text: '#9a3412', badge: 'badge-orange' },
    cooking: { border: '#2E5AFF', bg: '#e8edff', text: '#1e40af', badge: 'badge-blue' },
    ready: { border: '#00C48C', bg: '#e8fdf7', text: '#065f46', badge: 'badge-green' },
  };

  const btnLabel: Record<KOTStatus, string> = { pending: '🔥 Start Cooking', cooking: '✅ Mark Ready', ready: '🍽️ Served' };

  const pending = kots.filter(k => k.status === 'pending');
  const cooking = kots.filter(k => k.status === 'cooking');
  const ready = kots.filter(k => k.status === 'ready');

  const Column = ({ title, items, emoji }: { title: string; items: KOT[]; emoji: string }) => (
    <div style={{ flex: 1, minWidth: 280 }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        {emoji} {title}
        <span style={{ background: '#F4F6FB', borderRadius: 12, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{items.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(kot => {
          const c = colors[kot.status];
          return (
            <div key={kot.id} style={{ border: `2px solid ${c.border}`, borderRadius: 14, background: '#fff', overflow: 'hidden' }}>
              <div style={{ background: c.bg, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>KOT {kot.id} — Table {kot.tableNum}</div>
                  <div style={{ fontSize: 11, color: '#64748B' }}>{kot.time} · {kot.elapsed} ago</div>
                </div>
                <span className={`badge ${c.badge}`}>{kot.status}</span>
              </div>
              <div style={{ padding: '12px 14px' }}>
                {kot.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', borderBottom: i < kot.items.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: c.border, fontSize: 14, flexShrink: 0 }}>×{item.qty}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{item.name}</div>
                      {item.note && <div style={{ fontSize: 11, color: '#FF8A34', fontStyle: 'italic' }}>⚠️ {item.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
              {kot.status !== 'ready' && (
                <div style={{ padding: '0 14px 14px' }}>
                  <button className="btn btn-primary btn-full btn-sm" style={{ background: c.border }} onClick={() => advance(kot.id)}>{btnLabel[kot.status]}</button>
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: '#94A3B8', fontSize: 13, border: '2px dashed #E2E8F0', borderRadius: 14 }}>No {title.toLowerCase()}</div>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout title="Kitchen Display System">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            👨‍🍳 Kitchen Display System
            <span className="blink" style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF3B30', display: 'inline-block' }} />
          </div>
          <div className="page-header-sub">Real-time KOT management — SNS Beach Resort Kitchen</div>
        </div>
        <div className="stats-row">
          <div className="stat-pill"><strong style={{ color: '#FF8A34' }}>{pending.length}</strong> Pending</div>
          <div className="stat-pill"><strong style={{ color: '#2E5AFF' }}>{cooking.length}</strong> Cooking</div>
          <div className="stat-pill"><strong style={{ color: '#00C48C' }}>{ready.length}</strong> Ready</div>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="alarm-card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🔔</span>
            <strong style={{ color: '#FF8A34' }}>{pending.length} new KOT(s) waiting — Accept now!</strong>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Column title="Pending" items={pending} emoji="⏳" />
        <Column title="Cooking" items={cooking} emoji="🔥" />
        <Column title="Ready to Serve" items={ready} emoji="✅" />
      </div>
    </DashboardLayout>
  );
}
export default KitchenDisplay;
