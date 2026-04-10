'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FRANCHISES, HOTELS, formatCurrency } from '@/lib/mockData';

function ClientFranchises() {
  return (
    <DashboardLayout title="Franchise Management">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🏩 Franchise Management</div>
          <div className="page-header-sub">Manage franchise regions and their performance</div>
        </div>
        <button className="btn btn-primary">+ Add Franchise</button>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Franchises', value: FRANCHISES.length, color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Total Hotels', value: HOTELS.length, color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Total Revenue', value: formatCurrency(FRANCHISES.reduce((a,f)=>a+f.revenue,0)), color: '#1ABC9C', bg: '#e6faf7' },
          { label: 'Total Orders', value: '4,220', color: '#9B59B6', bg: '#f5f0ff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 20 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><div className="card-title">🌍 All Franchise Regions</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Region</th><th>Franchise Head</th><th>Hotels</th><th>Revenue</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {FRANCHISES.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.name}</strong></td>
                  <td>{f.head}</td>
                  <td>{f.hotels} hotels</td>
                  <td><strong style={{ color: '#1ABC9C' }}>{formatCurrency(f.revenue)}</strong></td>
                  <td><span className="badge badge-green">{f.status}</span></td>
                  <td><div style={{ display: 'flex', gap: 6 }}><button className="btn btn-outline btn-sm">View</button><button className="btn btn-ghost btn-sm">Edit</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">🏨 Hotels Under Chain</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Hotel</th><th>Manager</th><th>Tables</th><th>Revenue</th><th>Status</th></tr></thead>
            <tbody>
              {HOTELS.map(h => (
                <tr key={h.id}>
                  <td><strong>{h.name}</strong></td>
                  <td>{h.manager}</td>
                  <td>{h.tables}</td>
                  <td><strong style={{ color: '#1ABC9C' }}>{formatCurrency(h.revenue)}</strong></td>
                  <td><span className="badge badge-green">{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ClientFranchises;
