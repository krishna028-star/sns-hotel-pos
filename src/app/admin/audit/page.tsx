'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';
import { AUDIT_LOGS } from '@/lib/mockData';

function AdminAudit() {
  const { auditLogs, metrics } = useData();
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('all');
  const [action, setAction] = useState('all');

  const filtered = auditLogs.filter((l: any) =>
    (severity === 'all' || 'info' === severity) &&
    (action === 'all' || l.action === action) &&
    ((l.user?.name || '').toLowerCase().includes(search.toLowerCase()) || 
     l.action.toLowerCase().includes(search.toLowerCase()) || 
     l.entity.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout title="Audit Logs Viewer">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📋 Audit Logs Viewer</div>
          <div className="page-header-sub">Immutable record of all state-changing actions across the system</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm">⬇ Export CSV</button>
          <button className="btn btn-outline btn-sm">⬇ Export PDF</button>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        🔒 <strong>Read-only:</strong> Audit logs are immutable and cannot be edited or deleted. Only Main Admin can view all tenant logs.
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <span>🔍</span>
          <input placeholder="Search by user, action, resource..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 140 }} value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="all">All Severities</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
        <select className="form-select" style={{ width: 160 }} value={action} onChange={e => setAction(e.target.value)}>
          <option value="all">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="APPROVE">APPROVE</option>
          <option value="ACCEPT">ACCEPT</option>
          <option value="FILE_THEFT">FILE_THEFT</option>
        </select>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Entries', value: String(auditLogs.length), icon: '📋', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Critical', value: '0', icon: '🔴', color: '#FF3B30', bg: '#fff0ef' },
          { label: 'Warnings', value: '0', icon: '🟡', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Info', value: String(auditLogs.length), icon: '🟢', color: '#00C48C', bg: '#e0faf3' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Log Entries ({filtered.length} shown)</div>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Last refreshed: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log: any) => (
                <tr key={log.id}>
                  <td style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <strong style={{ fontSize: 13 }}>{log.user?.name || log.userId}</strong><br />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.user?.role}</span>
                  </td>
                  <td><span className="badge badge-gray" style={{ fontFamily: 'monospace' }}>{log.action}</span></td>
                  <td style={{ fontSize: 12 }}>{log.entity} <span style={{ color: 'var(--text-muted)' }}>#{log.entityId}</span></td>
                  <td>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {JSON.stringify(log.newData)}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-green">info</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Showing {filtered.length} of 12,450 entries</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline btn-sm">← Prev</button>
            <button className="btn btn-outline btn-sm">Next →</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default function AdminAuditPage() { return <AdminAudit />; }
