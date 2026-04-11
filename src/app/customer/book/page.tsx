'use client';
import React, { useState } from 'react';

import { useRouter } from "next/navigation";
import DashboardLayout from '@/components/DashboardLayout';

const timeSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'];

function BookTable() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ guests: '2', date: '', time: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [bookingId] = useState('BK-' + Math.floor(1000 + Math.random() * 9000));

  const submit = () => { setSubmitted(true); setStep(3); };

  return (
    <DashboardLayout title="Book a Table">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🪑</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>Reserve Your Table</div>
          <div style={{ color: '#64748B', marginTop: 6 }}>Book in advance and enjoy a seamless dining experience</div>
        </div>

        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
          {[{ n: 1, label: 'Details' }, { n: 2, label: 'Time' }, { n: 3, label: 'Confirm' }].map((s, i) => (
            <React.Fragment key={s.n}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: step >= s.n ? '#2E5AFF' : '#E2E8F0', color: step >= s.n ? '#fff' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: step >= s.n ? '#2E5AFF' : '#94A3B8', fontWeight: 600 }}>{s.label}</div>
              </div>
              {i < 2 && <div style={{ width: 60, height: 2, background: step > s.n ? '#2E5AFF' : '#E2E8F0', margin: '0 0 20px' }} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="card">
            <div className="card-header"><div className="card-title">Step 1: Party Details</div></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Number of Guests</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['1', '2', '3', '4', '5', '6', '7', '8'].map(n => (
                      <button key={n} onClick={() => setForm(f => ({ ...f, guests: n }))}
                        style={{ width: 48, height: 48, borderRadius: 10, border: form.guests === n ? '2px solid #2E5AFF' : '1.5px solid #E2E8F0', background: form.guests === n ? '#e8edff' : '#fff', fontWeight: 700, color: form.guests === n ? '#2E5AFF' : '#64748B', cursor: 'pointer' }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Special Requests (Optional)</label>
                  <textarea className="form-input" rows={2} placeholder="e.g. Birthday decoration, wheelchair access..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <button className="btn btn-primary btn-full btn-lg" disabled={!form.date} onClick={() => setStep(2)}>Next — Choose Time →</button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="card-header"><div className="card-title">Step 2: Choose Time Slot</div></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
                {timeSlots.map(slot => (
                  <button key={slot} onClick={() => setForm(f => ({ ...f, time: slot }))}
                    style={{ padding: '14px 10px', borderRadius: 10, border: form.time === slot ? '2px solid #2E5AFF' : '1.5px solid #E2E8F0', background: form.time === slot ? '#e8edff' : '#fff', fontWeight: 600, fontSize: 14, color: form.time === slot ? '#2E5AFF' : '#0F172A', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {slot}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 2 }} disabled={!form.time} onClick={submit}>✅ Confirm Booking</button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && submitted && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="card-body" style={{ padding: 40 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Booking Confirmed!</div>
              <div style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>Your table has been reserved successfully.</div>
              <div style={{ background: '#F4F6FB', borderRadius: 16, padding: 20, marginBottom: 24 }}>
                {[['Booking ID', bookingId], ['Date', form.date], ['Time', form.time], ['Guests', form.guests], ['Restaurant', 'SNS Beach Resort']].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B' }}>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-outline btn-full" onClick={() => router.push("/customer/bookings")}>View My Bookings</button>
                <button className="btn btn-primary btn-full" onClick={() => router.push("/customer/dashboard")}>Browse Menu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
export default BookTable;
