'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const history: any[] = [];

function ChefHistory() {
  return (
    <DashboardLayout title="KOT History">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📋 KOT History</div>
          <div className="page-header-sub">Completed orders served today</div>
        </div>
        <div className="stats-row">
          <div className="stat-pill"><strong style={{ color: '#00C48C' }}>{history.length}</strong> Completed Today</div>
          <div className="stat-pill">Avg. <strong style={{ color: '#2E5AFF' }}>17 min</strong> prep time</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>KOT #</th><th>Table</th><th>Items</th><th>Time</th><th>Prep Duration</th><th>Chef</th><th>Status</th></tr></thead>
            <tbody>
              {history.map(k => (
                <tr key={k.id}>
                  <td><strong>{k.id}</strong></td>
                  <td>T{k.table}</td>
                  <td>
                    <div style={{ fontSize: 12 }}>
                      {k.items.map((i, idx) => <div key={idx}>{i.name} ×{i.qty}</div>)}
                    </div>
                  </td>
                  <td style={{ fontSize: 12 }}>{k.time}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: parseInt(k.duration) < 20 ? '#00C48C' : '#FF8A34' }}>{k.duration}</span>
                  </td>
                  <td style={{ fontSize: 12 }}>{k.chef}</td>
                  <td><span className="badge badge-green">✅ Served</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ChefHistory;
