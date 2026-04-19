'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { BOOKINGS } from '@/lib/mockData';

type Booking = typeof BOOKINGS[0];

function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState(BOOKINGS.map(b => ({ ...b })));
  const [selected, setSelected] = useState<Booking | null>(null);

  const cancelBooking = (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <DashboardLayout title="My Bookings">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📅 My Bookings</div>
          <div className="page-header-sub">Your table reservations at SNS Hotels</div>
        </div>
        <button className="btn btn-primary" onClick={() => router.push('/customer/book')}>+ New Booking</button>
      </div>

      {bookings.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon">📅</div><div className="empty-state-title">No Bookings Yet</div><div className="empty-state-sub">Reserve your first table for a great dining experience!</div><button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => router.push('/customer/book')}>Book a Table</button></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {bookings.map(b => (
            <div key={b.id} className="card">
              <div style={{ padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: b.status === 'confirmed' ? '#e8fdf7' : b.status === 'pending' ? '#fff3e8' : '#fff0ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                  {b.status === 'confirmed' ? '✅' : b.status === 'pending' ? '⏳' : '❌'}
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
                    {b.status === 'pending' && (
                      <button className="btn btn-danger btn-sm" onClick={() => cancelBooking(b.id)}>Cancel</button>
                    )}
                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(b)}>Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">📅 Booking Details — {selected.id}</div>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Customer', selected.customerName],
                  ['Table', `Table ${selected.tableNum}`],
                  ['Date', selected.date],
                  ['Time', selected.time],
                  ['Guests', `${selected.guests} persons`],
                  ['Pre-Order', selected.preOrder ? 'Yes - attached' : 'No'],
                  ['Status', selected.status],
                  ['Booking ID', selected.id],
                ].map(([k, v]) => (
                  <div key={String(k)} style={{ padding: 12, background: '#F4F6FB', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              {selected.status === 'pending' && (
                <button className="btn btn-danger" onClick={() => { cancelBooking(selected.id); setSelected(null); }}>Cancel Booking</button>
              )}
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default MyBookings;
