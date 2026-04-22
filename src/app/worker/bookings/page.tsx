'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';

function WorkerBookings() {
  // FIX: removed BOOKINGS mock import, using DB data; fixed field names to match schema
  const { bookings = [], updateBookingStatus } = useData();
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const pending = safeBookings.filter((b: any) => b.status === 'pending');
  const confirmed = safeBookings.filter((b: any) => b.status === 'confirmed');

  const handleConfirm = async (id: string) => {
    setLoading(true);
    const res = await updateBookingStatus(id, 'confirmed');
    setLoading(false);
    if (!res.ok) alert('Failed: ' + res.error);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    setLoading(true);
    const res = await updateBookingStatus(id, 'cancelled');
    setLoading(false);
    if (!res.ok) alert('Failed: ' + res.error);
    else setSelected(null);
  };

  // FIX: use correct schema fields: date, time, guests, tableNum (not bookingTime/guestCount/tableId)
  const formatBookingTime = (b: any) => {
    try {
      return `${new Date(b.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · ${b.time}`;
    } catch { return b.date || '-'; }
  };

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
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 10, color: '#FF8A34' }}>⏳ Pending Confirmation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.map((b: any) => (
              <div key={b.id} className="alarm-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{b.customerName}</div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                      🪑 Table {b.tableNum || 'TBD'} · 👥 {b.guests} Guests · 🕐 {formatBookingTime(b)}
                    </div>
                    {b.preOrder && <span className="badge badge-blue" style={{ marginTop: 4 }}>Pre-Order</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" disabled={loading} onClick={() => handleConfirm(b.id)}>✅ Confirm</button>
                    <button className="btn btn-danger btn-sm" disabled={loading} onClick={() => handleCancel(b.id)}>✕ Cancel</button>
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
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Table</th>
                <th>Date &amp; Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeBookings.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>No bookings yet.</td></tr>
              ) : safeBookings.map((b: any) => (
                <tr key={b.id}>
                  <td><strong>{b.customerName}</strong></td>
                  <td style={{ fontSize: 12 }}>{b.phoneNumber || '-'}</td>
                  <td>{b.tableNum || 'TBD'}</td>
                  <td style={{ fontSize: 12 }}>{formatBookingTime(b)}</td>
                  <td>{b.guests}</td>
                  <td>
                    <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : b.status === 'pending' ? 'badge-orange' : 'badge-red'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(b)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">📅 Booking Details</div>
              <button className="btn btn-ghost" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Customer', selected.customerName],
                  ['Phone', selected.phoneNumber || 'N/A'],
                  ['Table', selected.tableNum || 'TBD'],
                  ['Guests', String(selected.guests)],
                  ['Date', new Date(selected.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })],
                  ['Time', selected.time],
                  ['Pre-Order', selected.preOrder ? 'Yes' : 'No'],
                  ['Status', selected.status],
                ].map(([k, v]) => (
                  <div key={k as string} style={{ padding: 12, background: '#F4F6FB', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{k}</div>
                    <div style={{ fontWeight: 700, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Close</button>
              {selected.status === 'pending' && (
                <>
                  <button className="btn btn-danger btn-sm" disabled={loading} onClick={() => handleCancel(selected.id)}>Cancel Booking</button>
                  <button className="btn btn-primary btn-sm" disabled={loading} onClick={() => handleConfirm(selected.id)}>✅ Confirm</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default WorkerBookings;
