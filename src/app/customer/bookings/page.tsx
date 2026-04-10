'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { BOOKINGS } from '@/lib/mockData';

function MyBookings() {
  return (
    <DashboardLayout title="My Bookings">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📅 My Bookings</div>
          <div className="page-header-sub">Your table reservations at SNS Hotels</div>
        </div>
        <a href="/customer/book"><button className="btn btn-primary">+ New Booking</button></a>
      </div>

      {BOOKINGS.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-title">No Bookings Yet</div><div className="empty-state-sub">Reserve your first table for a great dining experience!</div><a href="/customer/book"><button className="btn btn-primary" style={{ marginTop: 12 }}>Book a Table</button></a></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {BOOKINGS.map(b => (
            <div key={b.id} className="card">
              <div style={{ padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: b.status === 'confirmed' ? '#e8fdf7' : '#fff3e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                  {b.status === 'confirmed' ? '✅' : '⏳'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{b.id}</div>
                  <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                    📅 {b.date} · 🕐 {b.time} · 👥 {b.guests} guests · 🪑 Table {b.tableNum}
                  </div>
                  {b.preOrder && <span className="badge badge-purple" style={{ marginTop: 6, display: 'inline-flex' }}>Pre-Order Attached</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : b.status === 'pending' ? 'badge-orange' : 'badge-red'}`}>{b.status}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {b.status === 'pending' && <button className="btn btn-danger btn-sm">Cancel</button>}
                    <button className="btn btn-outline btn-sm">Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
export default MyBookings;
