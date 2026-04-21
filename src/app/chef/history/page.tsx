'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const INITIAL_HISTORY = [
  { id: 'KOT-198', table: '4', items: [{ name: 'Chicken Tikka', qty: 2 }, { name: 'Naan', qty: 2 }], time: '6:30 PM', duration: '18 min', chef: 'Chef Ravi' },
  { id: 'KOT-199', table: 'G2', items: [{ name: 'Paneer Tikka', qty: 1 }, { name: 'Dal Makhani', qty: 1 }], time: '6:45 PM', duration: '22 min', chef: 'Chef Ravi' },
  { id: 'KOT-200', table: 'T1', items: [{ name: 'Chicken Biryani', qty: 2 }], time: '7:15 PM', duration: '25 min', chef: 'Chef Ravi' },
];

import { useData } from '@/lib/DataContext';

function ChefHistory() {
  const { orders = [] } = useData();
  const safeOrders = Array.isArray(orders) ? orders : [];
  const history = safeOrders.filter((o: any) => o.status === 'paid' || o.status === 'served');
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
              {history.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>
                  No KOTs completed yet today. Orders you mark ready will appear here.
                </td></tr>
              ) : (
                history.map(k => (
                  <tr key={k.id}>
                    <td><strong>{k.id}</strong></td>
                    <td>T{k.table?.number || k.tableNum || '?'}</td>
                    <td>
                      <div style={{ fontSize: 12 }}>
                        {(k.items || []).map((i: any, idx: number) => <div key={idx}>{i.name} ×{i.quantity || i.qty || 1}</div>)}
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(k.createdAt).toLocaleTimeString()}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#00C48C' }}>-</span>
                    </td>
                    <td style={{ fontSize: 12 }}>{k.waiter?.name || 'Staff'}</td>
                    <td><span className="badge badge-green">✅ {k.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ChefHistory;
