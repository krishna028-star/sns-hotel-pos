'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { TABLES } from '@/lib/mockData';

function ManagerOccupancy() {
  const floors = [...new Set(TABLES.map(t => t.floor))];
  const free = TABLES.filter(t => t.status === 'free').length;
  const occupied = TABLES.filter(t => t.status === 'occupied').length;
  const reserved = TABLES.filter(t => t.status === 'reserved').length;
  const occupancyPct = Math.round((occupied / TABLES.length) * 100);

  return (
    <DashboardLayout title="Occupancy Map">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🗺️ Occupancy Map</div>
          <div className="page-header-sub">Real-time table occupancy for SNS Beach Resort</div>
        </div>
        <div className="stats-row">
          <div className="stat-pill"><span style={{ width:8,height:8,borderRadius:'50%',background:'#00C48C',display:'inline-block' }}/><strong style={{color:'#00C48C'}}>{free}</strong> Free</div>
          <div className="stat-pill"><span style={{ width:8,height:8,borderRadius:'50%',background:'#FF3B30',display:'inline-block' }}/><strong style={{color:'#FF3B30'}}>{occupied}</strong> Occupied</div>
          <div className="stat-pill"><span style={{ width:8,height:8,borderRadius:'50%',background:'#FF8A34',display:'inline-block' }}/><strong style={{color:'#FF8A34'}}>{reserved}</strong> Reserved</div>
        </div>
      </div>

      {/* Occupancy gauge */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: occupancyPct > 70 ? '#FF3B30' : occupancyPct > 40 ? '#FF8A34' : '#00C48C' }}>{occupancyPct}%</div>
            <div style={{ color: '#64748B', fontSize: 13 }}>Occupancy Rate</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="progress-bar" style={{ height: 20, borderRadius: 10, marginBottom: 12 }}>
              <div className="progress-fill" style={{ width: `${occupancyPct}%`, background: occupancyPct > 70 ? '#FF3B30' : occupancyPct > 40 ? '#FF8A34' : '#00C48C', borderRadius: 10 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8' }}>
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Total Seats', value: TABLES.reduce((a,t)=>a+t.capacity,0) },
              { label: 'Occupied Seats', value: TABLES.filter(t=>t.status==='occupied').reduce((a,t)=>a+t.capacity,0) },
            ].map(s => (
              <div key={s.label} style={{ padding: '10px 16px', background: '#F4F6FB', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 20 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {floors.map(floor => (
        <div key={floor} className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <div className="card-title">{floor}</div>
            <span style={{ fontSize: 12, color: '#64748B' }}>
              {TABLES.filter(t=>t.floor===floor&&t.status==='occupied').length}/{TABLES.filter(t=>t.floor===floor).length} occupied
            </span>
          </div>
          <div className="table-map">
            {TABLES.filter(t => t.floor === floor).map(t => (
              <div key={t.id} className={`table-box ${t.status}`}>
                <div className="table-num">{t.number}</div>
                <div className="table-status">{t.status}</div>
                <div style={{ fontSize: 10 }}>{t.capacity}p</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
}
export default ManagerOccupancy;
