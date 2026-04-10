'use client';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    app: { status: string; message: string };
    memory: { status: string; heapUsed: string; heapTotal: string; rss: string };
    environment: { status: string; message: string };
  };
  responseTime: string;
}

function StatusDot({ status }: { status: string }) {
  const color = status === 'ok' ? '#00C48C' : status === 'warning' ? '#FF8A34' : '#E74C3C';
  return (
    <span style={{
      display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
      background: color, marginRight: 8, boxShadow: `0 0 6px ${color}`,
    }} />
  );
}

function MetricCard({ label, value, sub, status }: { label: string; value: string; sub?: string; status?: string }) {
  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        {status && <StatusDot status={status} />}
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</div>}
    </div>
  );
}

function AdminHealth() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHealth(data);
      setLastRefresh(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch health status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
  };

  return (
    <DashboardLayout title="System Health">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🩺 System Health</div>
          <div className="page-header-sub">
            Real-time application health monitoring • Auto-refreshes every 30s
          </div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline btn-sm" onClick={fetchHealth} disabled={loading}>
            {loading ? '⟳ Refreshing…' : '⟳ Refresh'}
          </button>
        </div>
      </div>

      {/* Last refresh */}
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>
        Last checked: {lastRefresh.toLocaleTimeString('en-IN')}
      </div>

      {error && (
        <div className="card" style={{ border: '1px solid var(--danger)', background: 'rgba(231,76,60,0.08)', padding: 20, marginBottom: 20 }}>
          <div style={{ color: 'var(--danger)', fontWeight: 700 }}>⚠️ Could not reach health endpoint</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{error}</div>
        </div>
      )}

      {loading && !health && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⟳</div>
          <div>Checking system health…</div>
        </div>
      )}

      {health && (
        <>
          {/* Overall status banner */}
          <div className="card" style={{
            padding: '20px 24px', marginBottom: 24,
            background: health.status === 'ok'
              ? 'linear-gradient(135deg, rgba(0,196,140,0.12), rgba(0,196,140,0.04))'
              : 'linear-gradient(135deg, rgba(255,138,52,0.12), rgba(255,138,52,0.04))',
            border: `1px solid ${health.status === 'ok' ? 'rgba(0,196,140,0.3)' : 'rgba(255,138,52,0.3)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 40 }}>{health.status === 'ok' ? '✅' : '⚠️'}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                  System Status: <span style={{ color: health.status === 'ok' ? '#00C48C' : '#FF8A34', textTransform: 'uppercase' }}>{health.status}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  v{health.version} • {health.environment} • Responded in {health.responseTime}
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
            <MetricCard
              label="Application"
              value={health.checks.app.status.toUpperCase()}
              sub={health.checks.app.message}
              status={health.checks.app.status}
            />
            <MetricCard
              label="Uptime"
              value={formatUptime(health.uptime)}
              sub="since last restart"
            />
            <MetricCard
              label="Heap Used"
              value={health.checks.memory.heapUsed}
              sub={`of ${health.checks.memory.heapTotal} total`}
              status="ok"
            />
            <MetricCard
              label="RSS Memory"
              value={health.checks.memory.rss}
              sub="resident set size"
              status="ok"
            />
            <MetricCard
              label="Response Time"
              value={health.responseTime}
              sub="health endpoint latency"
              status="ok"
            />
            <MetricCard
              label="Environment"
              value={health.checks.environment.status.toUpperCase()}
              sub={health.checks.environment.message}
              status={health.checks.environment.status}
            />
          </div>

          {/* Detailed Checks */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Subsystem Checks</div>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subsystem</th>
                    <th>Status</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(health.checks).map(([key, check]) => (
                    <tr key={key}>
                      <td><strong style={{ textTransform: 'capitalize' }}>{key.replace('_', ' ')}</strong></td>
                      <td>
                        <StatusDot status={(check as {status:string}).status} />
                        <span className={`badge ${(check as {status:string}).status === 'ok' ? 'badge-green' : (check as {status:string}).status === 'warning' ? 'badge-orange' : 'badge-red'}`}>
                          {(check as {status:string}).status}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {Object.entries(check).filter(([k]) => k !== 'status').map(([k, v]) =>
                          <span key={k} style={{ marginRight: 12 }}><strong>{k}:</strong> {String(v)}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Demo rows for services not yet connected */}
                  <tr>
                    <td><strong>Database</strong></td>
                    <td>
                      <StatusDot status="warning" />
                      <span className="badge badge-orange">warning</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Running in demo mode — DATABASE_URL not configured
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Redis</strong></td>
                    <td>
                      <StatusDot status="warning" />
                      <span className="badge badge-orange">warning</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      REDIS_URL not configured — notifications use in-memory store
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Email Service</strong></td>
                    <td>
                      <StatusDot status="warning" />
                      <span className="badge badge-orange">warning</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      EMAIL_HOST not configured — email alerts disabled
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Endpoint Tests */}
          <div className="card" style={{ marginTop: 20 }}>
            <div className="card-header">
              <div className="card-title">API Endpoints</div>
            </div>
            <div style={{ padding: '0 8px 16px' }}>
              {[
                { path: '/api/health', method: 'GET', desc: 'Health check' },
                { path: '/api/auth/login', method: 'POST', desc: 'Authentication' },
                { path: '/api/users', method: 'GET', desc: 'User listing (auth required)' },
                { path: '/api/orders', method: 'GET', desc: 'Order listing (auth required)' },
                { path: '/api/audit-logs', method: 'GET', desc: 'Audit logs (manager+)' },
                { path: '/api/notifications', method: 'GET', desc: 'Notifications (auth required)' },
              ].map((ep) => (
                <div key={ep.path} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span className={`badge ${ep.method === 'GET' ? 'badge-blue' : 'badge-green'}`} style={{ fontFamily: 'monospace', minWidth: 48 }}>
                    {ep.method}
                  </span>
                  <code style={{ color: 'var(--text-primary)', fontSize: 13, flex: 1 }}>{ep.path}</code>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ep.desc}</span>
                  <a href={ep.path} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ fontSize: 11 }}>
                    Test →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default function AdminHealthPage() { return <AdminHealth />; }
