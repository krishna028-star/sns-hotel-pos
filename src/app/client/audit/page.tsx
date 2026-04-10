'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { AUDIT_LOGS, formatDate } from '@/lib/mockData';

const severityBadge: Record<string, string> = { critical: 'badge-red', warning: 'badge-orange', info: 'badge-blue' };
const actionColor: Record<string, string> = { DELETE: '#FF3B30', APPROVE: '#00C48C', FILE_THEFT: '#FF8A34', ACCEPT: '#2E5AFF', CREATE: '#1ABC9C', UPDATE: '#FF8A34' };

function ClientAudit() {
  return (
    <DashboardLayout title="Audit Logs">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🗂️ Audit Logs</div>
          <div className="page-header-sub">Immutable record of all state-changing actions across the chain</div>
        </div>
        <div className="page-header-actions">
          <select className="form-select" style={{ width: 140 }}><option>All Actions</option><option>Critical Only</option><option>Today</option></select>
          <button className="btn btn-outline">📥 Export</button>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        <span>🔒</span>
        <span>Audit logs are <strong>immutable</strong> — they cannot be edited or deleted by anyone, including Main Admin.</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Resource</th><th>Severity</th><th>IP Address</th></tr>
            </thead>
            <tbody>
              {AUDIT_LOGS.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{log.user}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{log.tenant}</div>
                  </td>
                  <td><span className="badge badge-gray" style={{ fontSize: 10 }}>{log.role}</span></td>
                  <td>
                    <span style={{ fontWeight: 700, color: actionColor[log.action] ?? '#64748B', background: (actionColor[log.action] ?? '#64748B') + '15', padding: '3px 10px', borderRadius: 8, fontSize: 12 }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{log.resource}</span>
                    <span style={{ color: '#94A3B8' }}> #{String(log.resourceId)}</span>
                  </td>
                  <td><span className={`badge ${severityBadge[log.severity]}`}>{log.severity}</span></td>
                  <td style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ClientAudit;
