'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { HOTELS, formatCurrency } from '@/lib/mockData';

function FranchiseHotels() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const filtered = HOTELS.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="Hotel Management">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🏨 Hotels in Franchise</div>
          <div className="page-header-sub">Manage hotels, assign managers, and view performance</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Hotel</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Hotels', value: HOTELS.length, icon: '🏨', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Total Revenue', value: formatCurrency(HOTELS.reduce((a,h)=>a+h.revenue,0)), icon: '💰', color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Active Hotels', value: HOTELS.filter(h=>h.status==='active').length, icon: '✅', color: '#2E5AFF', bg: '#e8edff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 24 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">All Hotels</div>
          <div className="search-bar" style={{ width: 260 }}>
            <span>🔍</span>
            <input placeholder="Search hotels..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Hotel Name</th><th>Manager</th><th>Tables</th><th>Revenue (MTD)</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(h => (
                <tr key={h.id}>
                  <td><strong>{h.name}</strong></td>
                  <td>{h.manager}</td>
                  <td><span style={{ background: '#e8edff', color: '#2E5AFF', padding: '2px 10px', borderRadius: 12, fontWeight: 600, fontSize: 12 }}>{h.tables} tables</span></td>
                  <td><strong style={{ color: '#FF8A34' }}>{formatCurrency(h.revenue)}</strong></td>
                  <td><span className={`badge ${h.status === 'active' ? 'badge-green' : 'badge-red'}`}>{h.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm">Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: '#FF3B30' }}>Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Hotel</div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group"><label className="form-label">Hotel Name</label><input className="form-input" placeholder="e.g. SNS Plaza" /></div>
                <div className="form-group"><label className="form-label">Manager</label><input className="form-input" placeholder="Assign manager..." /></div>
                <div className="form-group"><label className="form-label">Number of Tables</label><input className="form-input" type="number" placeholder="e.g. 10" /></div>
                <div className="form-group"><label className="form-label">Floor</label><input className="form-input" placeholder="e.g. Ground, 1st Floor" /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>Create Hotel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default FranchiseHotels;
