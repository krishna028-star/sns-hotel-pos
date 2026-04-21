'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';
import { BOOKINGS } from '@/lib/mockData';

function WorkerBookings() {
  const { bookings } = useData();
  const [selected, setSelected] = useState<any | null>(null);

  const confirm = (id: string) => alert('Confirm logic here');
  const cancel = (id: string) => alert('Cancel logic here');

  const pending = bookings.filter((b: any) => b.status === 'pending');
  const confirmed = bookings.filter((b: any) => b.status === 'confirmed');

  return (
    <DashboardLayout title="Table Bookings">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📅 Table Bookings</div>
          <div className="page-header-sub">Manage table reservations from customers</div>
        </div>
        <div className="stats-row">
          <div className="stat-pill"><strong style={{ color: '#FF8A34' }}>{pending.length}</strong> Pending</div>
          <div className="stat-pill"><strong style={{ color: '#00C48C' }}>{confirmed.length}</strong> Confirmed</div>
        </div>
      </div>

      {pending.length > 0 && (
        <div>
          <div style={{ fontWeight: 700, marginBottom: 10, color: '#FF8A34' }}>⏳ Pending Confirmation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {pending.map((b: any) => (
              <div key={b.id} className="alarm-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{b.customerName}</div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                      🪑 Table {b.tableId} · 👥 {b.guestCount} Guests · 🕐 {new Date(b.bookingTime).toLocaleTimeString()} · 📅 {new Date(b.bookingTime).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => confirm(b.id)}>✅ Confirm</button>
                    <button className="btn btn-danger btn-sm" onClick={() => cancel(b.id)}>✕ Cancel</button>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(b)}>View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header"><div className="card-title">All Bookings</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Booking ID</th><th>Customer</th><th>Table</th><th>Date & Time</th><th>Guests</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id}>
                  <td style={{ fontSize: 12 }}>{b.id}</td>
                  <td><strong>{b.customerName}</strong></td>
                  <td>Table {b.tableId}</td>
                  <td style={{ fontSize: 12 }}>{new Date(b.bookingTime).toLocaleString()}</td>
                  <td>{b.guestCount}</td>
                  <td>
                    <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : b.status === 'pending' ? 'badge-orange' : 'badge-red'}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default WorkerBookings;
