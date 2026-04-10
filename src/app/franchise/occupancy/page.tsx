'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FRANCHISE_SALES, TABLES, formatCurrency } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function FranchiseOccupancy() {
  const hotelData = [
    { name: 'SNS Beach Resort', tables: 12, occupied: 5, capacity: 72, guests: 34 },
    { name: 'SNS Central', tables: 20, occupied: 14, capacity: 140, guests: 98 },
    { name: 'SNS Mountain View', tables: 15, occupied: 8, capacity: 90, guests: 52 },
  ];

  return (
    <DashboardLayout title="Occupancy Overview">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🗺️ Occupancy Overview</div>
          <div className="page-header-sub">Real-time table occupancy across all franchise hotels</div>
        </div>
        <div className="stat-pill">
          <strong style={{ color: '#FF8A34' }}>{hotelData.reduce((a,h)=>a+h.occupied,0)}</strong>/{hotelData.reduce((a,h)=>a+h.tables,0)} Tables Occupied
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
                    <div style={{ fontSize: 12, color: '#64748B' }}>{h.occupied}/{h.tables} tables · {h.guests} guests</div>
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
          <BarChart data={hotelData.map(h => ({ name: h.name.replace('SNS ', ''), occupied: h.occupied, free: h.tables - h.occupied }))}>
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
