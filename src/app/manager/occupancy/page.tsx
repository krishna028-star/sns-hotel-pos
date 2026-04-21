'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';

function ManagerOccupancy() {
  const { tables = [] } = useData();
  const safeTables = Array.isArray(tables) ? tables : [];
  const floors = [...new Set(safeTables.map((t: any) => t.floor))];
  const free = safeTables.filter((t: any) => t.status === 'free').length;
  const occupied = safeTables.filter((t: any) => t.status === 'occupied').length;
  const reserved = safeTables.filter((t: any) => t.status === 'reserved').length;
  const occupancyPct = safeTables.length ? Math.round((occupied / safeTables.length) * 100) : 0;

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
              { label: 'Total Seats', value: safeTables.reduce((a: number,t: any)=>a+(t.cap||0),0) },
              { label: 'Occupied Seats', value: safeTables.filter((t: any)=>t.status==='occupied').reduce((a: number,t: any)=>a+(t.cap||0),0) },
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
        <div key={floor as any} className="card" style={{ marginBottom: 16 }}>
          <div className="card-header">
            <div className="card-title">{floor as string}</div>
            <span style={{ fontSize: 12, color: '#64748B' }}>
              {safeTables.filter((t: any)=>t.floor===floor&&t.status==='occupied').length}/{safeTables.filter((t: any)=>t.floor===floor).length} occupied
            </span>
          </div>
          <div className="table-map">
            {safeTables.filter((t: any) => t.floor === floor).map((t: any) => (
              <div key={t.id} className={`table-box ${t.status}`}>
                <div className="table-num">{t.num || t.id}</div>
                <div className="table-status">{t.status}</div>
                <div style={{ fontSize: 10 }}>{(t.cap||0)}p</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
}
export default ManagerOccupancy;
