'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function FranchiseOccupancy() {
  const { tables } = useData();

  const hotelMap = tables.reduce((acc: any, t: any) => {
    const name = t.hotel || 'Unassigned';
    if (!acc[name]) acc[name] = { name, tables: 0, occupied: 0, capacity: 0, guests: 0 };
    acc[name].tables += 1;
    acc[name].capacity += t.cap || 0;
    if (t.status === 'occupied') acc[name].occupied += 1;
    return acc;
  }, {});
  const hotelData = Object.values(hotelMap);

  return (
    <DashboardLayout title="Occupancy Overview">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🗺️ Occupancy Overview</div>
          <div className="page-header-sub">Real-time table occupancy across all franchise hotels</div>
        </div>
        <div className="stat-pill">
          <strong style={{ color: '#FF8A34' }}>{hotelData.reduce((a: number,h: any)=>a+h.occupied,0)}</strong>/{hotelData.reduce((a: number,h: any)=>a+h.tables,0)} Tables Occupied
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16, marginBottom: 24 }}>
        {hotelData.map(h => {
          const pct = Math.round((h.occupied / h.tables) * 100);
          return (
            <div className="card" key={h.name}>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{h.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{h.occupied}/{h.tables} tables · Cap: {h.capacity}</div>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: pct > 70 ? '#FF3B30' : pct > 40 ? '#FF8A34' : '#00C48C' }}>{pct}%</div>
                </div>
                <div className="progress-bar" style={{ height: 10 }}>
                  <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 70 ? '#FF3B30' : pct > 40 ? '#FF8A34' : '#00C48C', borderRadius: 10 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginTop: 6 }}>
                  <span>Occupancy</span>
                  <span>{pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chart-card">
        <div className="chart-title">📊 Table Occupancy by Hotel</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={hotelData.map((h: any) => ({ name: h.name.replace('SNS ', ''), occupied: h.occupied, free: h.tables - h.occupied }))}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="occupied" name="Occupied" stackId="a" fill="#FF3B30" radius={[0,0,0,0]} />
            <Bar dataKey="free" name="Free" stackId="a" fill="#00C48C" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
export default FranchiseOccupancy;
