'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const FLOOR_TABLES = [
  { id: 1, num: 1, cap: 2, status: 'free', floor: 'Ground' },
  { id: 2, num: 2, cap: 4, status: 'occupied', floor: 'Ground' },
  { id: 3, num: 3, cap: 4, status: 'occupied', floor: 'Ground' },
  { id: 4, num: 4, cap: 6, status: 'reserved', floor: 'Ground' },
  { id: 5, num: 5, cap: 2, status: 'free', floor: 'Ground' },
  { id: 6, num: 6, cap: 4, status: 'free', floor: 'Ground' },
  { id: 7, num: 7, cap: 6, status: 'occupied', floor: '1st Floor' },
  { id: 8, num: 8, cap: 8, status: 'free', floor: '1st Floor' },
  { id: 9, num: 9, cap: 4, status: 'occupied', floor: '1st Floor' },
  { id: 10, num: 10, cap: 4, status: 'reserved', floor: '1st Floor' },
  { id: 11, num: 11, cap: 2, status: 'free', floor: '1st Floor' },
  { id: 12, num: 12, cap: 6, status: 'free', floor: 'Terrace' },
  { id: 13, num: 13, cap: 4, status: 'occupied', floor: 'Terrace' },
  { id: 14, num: 14, cap: 2, status: 'free', floor: 'Terrace' },
];

const OCCUPANCY_TREND = [
  { time: '8AM', rate: 10 }, { time: '10AM', rate: 25 }, { time: '12PM', rate: 78 },
  { time: '1PM', rate: 95 }, { time: '2PM', rate: 85 }, { time: '3PM', rate: 40 },
  { time: '5PM', rate: 30 }, { time: '7PM', rate: 72 }, { time: '8PM', rate: 90 }, { time: '10PM', rate: 55 },
];

const FRANCHISE_OCCUPANCY = [
  { name: 'North Region', rate: 78, hotels: 3 },
  { name: 'South Region', rate: 65, hotels: 4 },
  { name: 'East Region', rate: 82, hotels: 2 },
  { name: 'West Region', rate: 71, hotels: 5 },
];

const BOOKINGS_TODAY = [
  { id: 'BK-201', name: 'Kiran Mathew', table: 4, time: '8:00 PM', guests: 4, status: 'pending', hotel: 'SNS Beach Resort' },
  { id: 'BK-202', name: 'Sunita Sharma', table: 10, time: '7:30 PM', guests: 2, status: 'confirmed', hotel: 'SNS Central' },
  { id: 'BK-203', name: 'Ahmed Ali', table: 6, time: '1:00 PM', guests: 6, status: 'confirmed', hotel: 'SNS Beach Resort' },
  { id: 'BK-204', name: 'Meera Nair', table: 3, time: '9:00 PM', guests: 3, status: 'expired', hotel: 'SNS Mountain View' },
];

const statusColor: Record<string, string> = { free: '#00C48C', occupied: '#FF3B30', reserved: '#FF8A34', out_of_service: '#94A3B8' };
const statusLabel: Record<string, string> = { free: 'Free', occupied: 'Occupied', reserved: 'Reserved', out_of_service: 'OOS' };
const bookingStatusColor: Record<string, string> = { pending: '#FF8A34', confirmed: '#00C48C', expired: '#FF3B30', cancelled: '#94A3B8' };

import { useData } from '@/lib/DataContext';

export default function ClientOccupancyPage() {
  const { tables = [], bookings = [] } = useData();
  const [selectedFloor, setSelectedFloor] = useState('All');
  const floors = ['All', 'Ground', '1st Floor', 'Terrace'];
  
  const safeTables = Array.isArray(tables) ? tables : [];
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const filtered = selectedFloor === 'All' ? safeTables : safeTables.filter((t: any) => t.floor === selectedFloor);

  const free = safeTables.filter((t: any) => t.status === 'free').length;
  const occupied = safeTables.filter((t: any) => t.status === 'occupied').length;
  const reserved = safeTables.filter((t: any) => t.status === 'reserved').length;
  const totalCap = safeTables.reduce((sum: number, t: any) => sum + (t.cap || 0), 0);
  const occupancyRate = safeTables.length ? Math.round((occupied / safeTables.length) * 100) : 0;

  return (
    
      <DashboardLayout title="Occupancy & Booking Dashboard">
        {/* Metrics */}
        <div className="metrics-grid" style={{ marginBottom: 24 }}>
          {[
            { label: 'Occupancy Rate (Chain)', value: `${occupancyRate}%`, sub: `${occupied} of ${safeTables.length} tables`, color: '#2E5AFF', icon: '📊' },
            { label: 'Free Tables', value: free, sub: 'Available now', color: '#00C48C', icon: '🪑' },
            { label: 'Occupied Tables', value: occupied, sub: 'Currently serving', color: '#FF3B30', icon: '🍽️' },
            { label: 'Reserved Tables', value: reserved, sub: 'Pre-booked', color: '#FF8A34', icon: '📅' },
            { label: 'Total Covers', value: totalCap, sub: 'Across all hotels', color: '#9B59B6', icon: '👥' },
            { label: "Today's Bookings", value: safeBookings.length, sub: `${safeBookings.filter((b: any) => b.status === 'confirmed').length} confirmed`, color: '#F39C12', icon: '🗓️' },
          ].map(m => (
            <div className="metric-card" key={m.label}>
              <div className="metric-icon" style={{ background: m.color + '18', color: m.color }}>{m.icon}</div>
              <div className="metric-label">{m.label}</div>
              <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
              <div className="metric-trend" style={{ color: 'var(--text-secondary)' }}>{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          {/* Occupancy trend */}
          <div className="chart-card">
            <div className="chart-title">📈 Occupancy Rate — Today</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={OCCUPANCY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: unknown) => [`${Number(v)}%`, 'Occupancy']} contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
                <Line type="monotone" dataKey="rate" stroke="#2E5AFF" strokeWidth={2} dot={{ fill: '#2E5AFF', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Franchise occupancy */}
          <div className="chart-card">
            <div className="chart-title">🏩 Occupancy by Franchise</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={FRANCHISE_OCCUPANCY} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip formatter={(v: unknown) => [`${Number(v)}%`, 'Occupancy']} contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
                <Bar dataKey="rate" fill="#2E5AFF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Floor plan */}
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header">
            <div className="card-title">🗺️ Live Table Map — SNS Beach Resort</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {floors.map(f => (
                <button key={f} onClick={() => setSelectedFloor(f)}
                  style={{ fontSize: 12, padding: '4px 12px', borderRadius: 8, border: '1px solid var(--border)', background: selectedFloor === f ? '#2E5AFF' : 'transparent', color: selectedFloor === f ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            {Object.entries(statusColor).map(([s, c]) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
                {statusLabel[s]}
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10 }}>
            {filtered.map((t: any) => (
              <div key={t.id} style={{
                borderRadius: 10, border: `2px solid ${statusColor[t.status] || '#94A3B8'}`, background: (statusColor[t.status] || '#94A3B8') + '18',
                padding: '12px 8px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                <div style={{ fontSize: 11, fontWeight: 800, color: statusColor[t.status] || '#94A3B8' }}>T{t.num || t.id}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>👥 {t.cap}</div>
                <div style={{ fontSize: 9, fontWeight: 600, color: statusColor[t.status] || '#94A3B8', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{statusLabel[t.status] || t.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings table */}
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header">
            <div className="card-title">📅 Today's Bookings (Chain-wide)</div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{safeBookings.length} bookings</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Booking ID</th><th>Customer</th><th>Hotel</th><th>Table</th><th>Time</th><th>Guests</th><th>Status</th></tr></thead>
              <tbody>
                {safeBookings.map((b: any) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{b.id}</td>
                    <td><strong>{b.name || b.customerName}</strong></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{b.hotel || 'Chain Default'}</td>
                    <td>Table {b.table || b.tableId}</td>
                    <td>{b.time}</td>
                    <td>{b.guests || 2}</td>
                    <td><span className={`badge ${b.status === 'confirmed' ? 'badge-green' : b.status === 'pending' ? 'badge-orange' : 'badge-red'}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    
  );
}
