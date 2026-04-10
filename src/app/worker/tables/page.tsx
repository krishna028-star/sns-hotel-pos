'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { TABLES } from '@/lib/mockData';

function WorkerTables() {
  const [tables, setTables] = useState(TABLES);
  const [filter, setFilter] = useState<'all' | 'free' | 'occupied' | 'reserved'>('all');

  const floors = [...new Set(tables.map(t => t.floor))];
  const filtered = tables.filter(t => filter === 'all' || t.status === filter);

  const free = tables.filter(t => t.status === 'free').length;
  const occupied = tables.filter(t => t.status === 'occupied').length;
  const reserved = tables.filter(t => t.status === 'reserved').length;

  return (
    <DashboardLayout title="Floor Plan">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🗺️ Floor Plan</div>
          <div className="page-header-sub">View table layout and status at a glance</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'free', 'occupied', 'reserved'] as const).map(f => (
            <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'free' ? `🟢 Free (${free})` : f === 'occupied' ? `🔴 Occupied (${occupied})` : `🟡 Reserved (${reserved})`}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Tables', value: tables.length, color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Free', value: free, color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Occupied', value: occupied, color: '#FF3B30', bg: '#fff0ef' },
          { label: 'Reserved', value: reserved, color: '#FF8A34', bg: '#fff3e8' },
        ].map(m => (
          <div className="metric-card" key={m.label} style={{ cursor: 'default' }}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      {floors.map(floor => {
        const floorTables = filtered.filter(t => t.floor === floor);
        if (floorTables.length === 0) return null;
        return (
          <div key={floor} className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><div className="card-title">{floor}</div></div>
            <div className="table-map">
              {floorTables.map(t => (
                <div key={t.id} className={`table-box ${t.status}`} title={`Table ${t.number} — ${t.status}`}>
                  <div className="table-num">{t.number}</div>
                  <div className="table-status">{t.status}</div>
                  <div style={{ fontSize: 10, opacity: 0.7 }}>{t.capacity}p</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </DashboardLayout>
  );
}
export default WorkerTables;
