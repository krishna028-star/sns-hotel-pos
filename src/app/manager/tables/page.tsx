'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';

type TableStatus = 'free' | 'occupied' | 'reserved';

function ManagerTables() {
  // FIX: use correct DB field names — t.number, t.capacity (not t.num, t.cap)
  const { tables = [], addTable, updateTable, deleteTable } = useData();
  const [selected, setSelected] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | TableStatus>('all');
  // FIX: IDs are strings (cuid), not numbers
  const [qrGenerated, setQrGenerated] = useState<string[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ number: '', capacity: 4, floor: 'Ground Floor' });
  const [saving, setSaving] = useState(false);

  const safeTables = Array.isArray(tables) ? tables : [];
  const filtered = safeTables.filter((t: any) => filter === 'all' || t.status === filter);
  // FIX: derive floors from DB data (t.floor), not hardcoded
  const floors = [...new Set(safeTables.map((t: any) => t.floor || 'Main Floor'))];

  const statusColor: Record<string, string> = { free: '#00C48C', occupied: '#FF3B30', reserved: '#FF8A34' };
  const statusEmoji: Record<string, string> = { free: '🟢', occupied: '🔴', reserved: '🟡' };

  const generateQR = (id: string) => setQrGenerated(prev => [...prev, id]);

  const handleAddTable = async () => {
    if (!addForm.number) return alert('Table number is required');
    setSaving(true);
    const res = await addTable({ number: addForm.number, capacity: addForm.capacity, floor: addForm.floor });
    setSaving(false);
    if (res.ok) { setShowAdd(false); setAddForm({ number: '', capacity: 4, floor: 'Ground Floor' }); }
    else alert('Failed: ' + res.error);
  };

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
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Table</button>
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
            {filtered.filter((t: any) => (t.floor || 'Main Floor') === floor).map((t: any) => (
              <div
                key={t.id}
                className={`table-box ${t.status} ${selected?.id === t.id ? 'selected' : ''}`}
                onClick={() => setSelected(t)}
                title={`Table ${t.number} — ${t.status} (${t.capacity || 0} seats)`}
              >
                {/* FIX: use t.number / t.capacity (real DB fields) */}
                <div className="table-num">{t.number}</div>
                <div className="table-status">{t.status}</div>
                <div style={{ fontSize: 10, color: 'inherit', opacity: 0.7 }}>{t.capacity || 0}p</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {safeTables.length === 0 && (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">🪑</div><div className="empty-state-title">No Tables Configured</div><div className="empty-state-sub">Add tables to your floor plan to start tracking occupancy.</div><button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowAdd(true)}>+ Add First Table</button></div></div>
      )}

      {/* Table detail panel */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Table {selected.number} — {selected.floor || 'Main Floor'}</div>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  ['Table No.', selected.number],
                  ['Capacity', `${selected.capacity || 0} persons`],
                  ['Status', selected.status],
                  ['Floor', selected.floor || 'Main Floor'],
                ].map(([k, v]) => (
                  <div key={k as string} style={{ padding: 12, background: '#F4F6FB', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontWeight: 700 }}>{v}</div>
                  </div>
                ))}
              </div>

              {qrGenerated.includes(selected.id) ? (
                <div style={{ border: '2px dashed #00C48C', borderRadius: 12, padding: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: 64 }}>▪▫▪▫▪<br />▫▪▫▪▫<br />▪▫▪▫▪</div>
                  <div style={{ marginTop: 8, fontWeight: 700, color: '#00C48C' }}>QR Code Generated ✅</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>https://order.snshotels.com/table/{selected.number}</div>
                  <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>🖨️ Print QR</button>
                </div>
              ) : (
                <button className="btn btn-primary btn-full" onClick={() => generateQR(selected.id)}>Generate QR Code</button>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={async () => { await updateTable(selected.id, { status: 'free' }); setSelected(null); }}>Mark as Free</button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, color: '#FF3B30' }} onClick={async () => { if (confirm('Remove this table?')) { await deleteTable(selected.id); setSelected(null); } }}>Remove Table</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAdd && (
        <div className="modal-backdrop" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">+ Add Table</div><button className="btn btn-ghost" onClick={() => setShowAdd(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">Table Number *</label><input className="form-input" placeholder="e.g. T1 or 12" value={addForm.number} onChange={e => setAddForm(f => ({ ...f, number: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Capacity</label><input className="form-input" type="number" min={1} max={20} value={addForm.capacity} onChange={e => setAddForm(f => ({ ...f, capacity: parseInt(e.target.value) }))} /></div>
              <div className="form-group"><label className="form-label">Floor</label><input className="form-input" placeholder="e.g. Ground Floor" value={addForm.floor} onChange={e => setAddForm(f => ({ ...f, floor: e.target.value }))} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={saving || !addForm.number} onClick={handleAddTable}>{saving ? 'Adding...' : 'Add Table'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default ManagerTables;
