'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';

type TableStatus = 'free' | 'occupied' | 'reserved';

function ManagerTables() {
  const { tables = [], addTable, updateTable, deleteTable } = useData();
  const [selected, setSelected] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | TableStatus>('all');
  const [qrGenerated, setQrGenerated] = useState<number[]>([]);

  const safeTables = Array.isArray(tables) ? tables : [];
  const filtered = safeTables.filter((t: any) => filter === 'all' || t.status === filter);
  const floors = [...new Set(safeTables.map((t: any) => t.floor))];

  const statusColor: Record<string, string> = { free: '#00C48C', occupied: '#FF3B30', reserved: '#FF8A34' };
  const statusEmoji: Record<string, string> = { free: '🟢', occupied: '🔴', reserved: '🟡' };

  const generateQR = (id: number) => setQrGenerated(prev => [...prev, id]);

  return (
    <DashboardLayout title="Tables & QR Management">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🪑 Tables & QR Codes</div>
          <div className="page-header-sub">Manage floor plan, table status, and generate QR codes</div>
        </div>
        <div className="page-header-actions">
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'free', 'occupied', 'reserved'] as const).map(f => (
              <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : `${statusEmoji[f]} ${f}`}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Tables', value: safeTables.length, color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Free', value: safeTables.filter((t: any) => t.status === 'free').length, color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Occupied', value: safeTables.filter((t: any) => t.status === 'occupied').length, color: '#FF3B30', bg: '#fff0ef' },
          { label: 'Reserved', value: safeTables.filter((t: any) => t.status === 'reserved').length, color: '#FF8A34', bg: '#fff3e8' },
        ].map(m => (
          <div className="metric-card" key={m.label} style={{ cursor: 'default' }}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Floor plan by floor */}
      {floors.map(floor => (
        <div key={floor} className="card" style={{ marginBottom: 16 }}>
          <div className="card-header"><div className="card-title">{floor}</div></div>
          <div className="table-map">
            {filtered.filter(t => t.floor === floor).map(t => (
              <div
                key={t.id}
                className={`table-box ${t.status} ${selected?.id === t.id ? 'selected' : ''}`}
                onClick={() => setSelected(t)}
                title={`Table ${t.num || t.id} — ${t.status} (${t.cap || 0} seats)`}
              >
                <div className="table-num">{t.num || t.id}</div>
                <div className="table-status">{t.status}</div>
                <div style={{ fontSize: 10, color: 'inherit', opacity: 0.7 }}>{t.cap || 0}p</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Table detail panel */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Table {selected.num || selected.id} — {selected.floor}</div>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[['Capacity', `${selected.cap || 0} persons`], ['Status', selected.status], ['Floor', selected.floor], ['Order ID', (selected as any).orderId ?? 'None']].map(([k, v]) => (
                  <div key={k} style={{ padding: 12, background: '#F4F6FB', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontWeight: 700 }}>{v}</div>
                  </div>
                ))}
              </div>

              {qrGenerated.includes(selected.id) ? (
                <div style={{ border: '2px dashed #00C48C', borderRadius: 12, padding: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: 64 }}>▪▫▪▫▪<br />▫▪▫▪▫<br />▪▫▪▫▪</div>
                  <div style={{ marginTop: 8, fontWeight: 700, color: '#00C48C' }}>QR Code Generated ✅</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>https://order.snshotels.com/table/{selected.id}</div>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>🖨️ Print QR</button>
                </div>
              ) : (
                <button className="btn btn-primary btn-full" onClick={() => generateQR(selected.id)}>Generate QR Code</button>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={async () => { await updateTable(selected.id, { status: 'free' }); setSelected(null); }}>Mark as Free</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, color: '#FF3B30' }} onClick={async () => { await deleteTable(selected.id); setSelected(null); }}>Remove Table</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default ManagerTables;
