'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const history = [
  { id: 'KOT-099', table: 5, items: [{ name: 'Paneer Tikka', qty: 2 }, { name: 'Naan', qty: 4 }], time: '7:15 PM', duration: '18 min', chef: 'Chef Rajan' },
  { id: 'KOT-098', table: 9, items: [{ name: 'Biryani Special', qty: 1 }], time: '6:55 PM', duration: '22 min', chef: 'Chef Rajan' },
  { id: 'KOT-097', table: 3, items: [{ name: 'Butter Chicken', qty: 3 }, { name: 'Garlic Naan', qty: 3 }], time: '6:30 PM', duration: '16 min', chef: 'Chef Lakshmi' },
  { id: 'KOT-096', table: 1, items: [{ name: 'Dal Makhani', qty: 2 }, { name: 'Naan', qty: 2 }], time: '6:10 PM', duration: '14 min', chef: 'Chef Rajan' },
];

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
