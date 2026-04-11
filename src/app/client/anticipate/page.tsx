'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

const COMBINED_TREND = [
  { date: 'Mar 25', actual: 420000, predicted: null },
  { date: 'Mar 26', actual: 510000, predicted: null },
  { date: 'Mar 27', actual: 390000, predicted: null },
  { date: 'Mar 28', actual: 580000, predicted: null },
  { date: 'Mar 29', actual: 625000, predicted: null },
  { date: 'Mar 30', actual: 598000, predicted: null },
  { date: 'Mar 31', actual: 640000, predicted: 640000 },
  { date: 'Apr 1', actual: null, predicted: 672000 },
  { date: 'Apr 2', actual: null, predicted: 615000 },
  { date: 'Apr 3', actual: null, predicted: 710000 },
  { date: 'Apr 4', actual: null, predicted: 540000 },
  { date: 'Apr 5', actual: null, predicted: 780000 },
  { date: 'Apr 6', actual: null, predicted: 820000 },
  { date: 'Apr 7', actual: null, predicted: 730000 },
];

const LOW_STOCK_PREDICTIONS = [
  { ingredient: 'Chicken', hotel: 'SNS Beach Resort', current: 8.5, dailyUsage: 12, daysLeft: 0.7, unit: 'kg', severity: 'critical' },
  { ingredient: 'Milk', hotel: 'SNS Central', current: 12, dailyUsage: 5, daysLeft: 2.4, unit: 'ltr', severity: 'critical' },
  { ingredient: 'Butter', hotel: 'SNS Mountain View', current: 4, dailyUsage: 1.5, daysLeft: 2.7, unit: 'kg', severity: 'critical' },
  { ingredient: 'Basmati Rice', hotel: 'SNS Beach Resort', current: 45, dailyUsage: 15, daysLeft: 3, unit: 'kg', severity: 'warning' },
  { ingredient: 'Paneer', hotel: 'SNS Central', current: 6, dailyUsage: 1.8, daysLeft: 3.3, unit: 'kg', severity: 'warning' },
  { ingredient: 'Mango Pulp', hotel: 'SNS Beach Resort', current: 14, dailyUsage: 3.5, daysLeft: 4, unit: 'kg', severity: 'ok' },
];

const ANOMALIES = [
  { type: 'Sales Drop', entity: 'East Region', metric: 'Revenue', deviation: -28, severity: 'high', description: 'Revenue 28% below 7-day average', status: 'new' },
  { type: 'Theft Spike', entity: 'SNS Beach Resort', metric: 'Theft Reports', deviation: +150, severity: 'high', description: '3 reports in 48hrs vs avg 0.4/week', status: 'new' },
  { type: 'High Demand', entity: 'West Region', metric: 'Orders', deviation: +34, severity: 'info', description: 'Unusually high order volume — peak season', status: 'acknowledged' },
  { type: 'Cancellation Surge', entity: 'South Region', metric: 'Bookings', deviation: +65, severity: 'medium', description: '65% more cancellations vs last week', status: 'new' },
];

const RECOMMENDATIONS = [
  { id: 1, type: 'stock', severity: 'high', icon: '📦', title: 'Reorder Chicken for SNS Beach Resort', desc: 'Stock will run out in <1 day. Create PO immediately.', action: 'Create PO', status: 'new' },
  { id: 2, type: 'stock', severity: 'high', icon: '📦', title: 'Reorder Milk & Butter', desc: '2 hotels critically low on dairy items.', action: 'Create PO', status: 'new' },
  { id: 3, type: 'anomaly', severity: 'high', icon: '🚨', title: 'Investigate East Region revenue drop', desc: 'Revenue 28% below forecast. Check for operational issues.', action: 'Investigate', status: 'new' },
  { id: 4, type: 'forecast', severity: 'info', icon: '📈', title: 'High demand expected on Apr 5–6', desc: 'Forecasted revenue spike ₹7.8–8.2L each. Ensure adequate staffing.', action: 'View Forecast', status: 'acknowledged' },
];

const severityColor: Record<string, string> = { high: '#FF3B30', medium: '#FF8A34', info: '#2E5AFF', ok: '#00C48C', critical: '#FF3B30', warning: '#FF8A34' };
const severityBg: Record<string, string> = { high: '#fff0ef', medium: '#fff3e8', info: '#e8edff', critical: '#fff0ef', warning: '#fff3e8' };

export default function ClientAnticipatePage() {
  const [horizon, setHorizon] = useState(7);
  const [recs, setRecs] = useState(RECOMMENDATIONS);

  const acknowledge = (id: number) => setRecs(prev => prev.map(r => r.id === id ? { ...r, status: 'acknowledged' } : r));

  const totalForecast = COMBINED_TREND.filter(d => d.predicted && !d.actual).slice(0, horizon).reduce((s, d) => s + (d.predicted ?? 0), 0);

  return (
    
      <DashboardLayout title="Anticipate View — Chain Forecasts">
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #2E5AFF, #9B59B6)', borderRadius: 16, padding: '20px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 36 }}>🔮</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>Anticipate View — Chain Level</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 4 }}>
              AI-powered forecasts for revenue, stock, and anomaly detection
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {[7, 14, 30].map(h => (
              <button key={h} onClick={() => setHorizon(h)}
                style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12, background: horizon === h ? '#fff' : 'rgba(255,255,255,0.15)', color: horizon === h ? '#2E5AFF' : '#fff' }}>
                {h}d
              </button>
            ))}
          </div>
        </div>

        {/* Forecast summary cards */}
        <div className="metrics-grid" style={{ marginBottom: 24 }}>
          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#e8edff', color: '#2E5AFF' }}>📈</div>
            <div className="metric-label">Forecast Revenue ({horizon}d)</div>
            <div className="metric-value" style={{ color: '#2E5AFF' }}>₹{(totalForecast / 100000).toFixed(1)}L</div>
            <div className="metric-trend trend-up">±5% confidence</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#fff0ef', color: '#FF3B30' }}>📦</div>
            <div className="metric-label">Critical Stock Alerts</div>
            <div className="metric-value" style={{ color: '#FF3B30' }}>{LOW_STOCK_PREDICTIONS.filter(s => s.severity === 'critical').length}</div>
            <div className="metric-trend" style={{ color: '#FF3B30' }}>Items running out &lt;3 days</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#fff0ef', color: '#FF3B30' }}>🚨</div>
            <div className="metric-label">Anomalies Detected</div>
            <div className="metric-value" style={{ color: '#FF3B30' }}>{ANOMALIES.filter(a => a.status === 'new').length}</div>
            <div className="metric-trend" style={{ color: 'var(--text-muted)' }}>Needs investigation</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon" style={{ background: '#e8fdf7', color: '#00C48C' }}>✅</div>
            <div className="metric-label">Open Recommendations</div>
            <div className="metric-value" style={{ color: '#00C48C' }}>{recs.filter(r => r.status === 'new').length}</div>
            <div className="metric-trend" style={{ color: 'var(--text-muted)' }}>Actionable insights</div>
          </div>
        </div>

        {/* Forecast chart */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">📊 Revenue Forecast — Actual vs Predicted (Chain-wide)</div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Dashed = Forecast, Solid = Actual</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={COMBINED_TREND}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C48C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00C48C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E5AFF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2E5AFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
              <Tooltip formatter={(v: unknown) => [`₹${(Number(v) / 100000).toFixed(2)}L`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Area connectNulls type="monotone" dataKey="actual" stroke="#00C48C" strokeWidth={2} fill="url(#actGrad)" name="Actual" dot={false} />
              <Area connectNulls type="monotone" dataKey="predicted" stroke="#2E5AFF" strokeWidth={2} strokeDasharray="6 3" fill="url(#predGrad)" name="Predicted" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="charts-grid">
          {/* Low stock predictions */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📦 Stock Depletion Predictions</div>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{horizon}-day horizon</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {LOW_STOCK_PREDICTIONS.map(item => (
                <div key={item.ingredient + item.hotel} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  borderRadius: 10, background: severityBg[item.severity], border: `1px solid ${severityColor[item.severity]}20`
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: severityColor[item.severity] + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {item.severity === 'critical' ? '🚨' : item.severity === 'warning' ? '⚠️' : '✅'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{item.ingredient} <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: 12 }}>· {item.hotel}</span></div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                      {item.current} {item.unit} left · Usage: {item.dailyUsage} {item.unit}/day
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: severityColor[item.severity] }}>{item.daysLeft}d</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>until out</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomalies + Recommendations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>🔍 Anomaly Detection</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ANOMALIES.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: severityBg[a.severity] ?? '#e8edff', border: `1px solid ${severityColor[a.severity] ?? '#2E5AFF'}20`, opacity: a.status === 'acknowledged' ? 0.6 : 1 }}>
                    <span style={{ fontWeight: 700, fontSize: 11, color: severityColor[a.severity], background: severityColor[a.severity] + '20', padding: '2px 8px', borderRadius: 4, alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>{a.type}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{a.description}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.entity} · {a.metric}: {a.deviation > 0 ? '+' : ''}{a.deviation}%</div>
                    </div>
                    {a.status === 'acknowledged' && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#00C48C', alignSelf: 'flex-start', fontWeight: 600 }}>✓ ACK</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>💡 Recommendations</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recs.map(r => (
                  <div key={r.id} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', opacity: r.status === 'acknowledged' ? 0.5 : 1 }}>
                    <span style={{ fontSize: 20 }}>{r.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 12 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{r.desc}</div>
                    </div>
                    {r.status === 'new' ? (
                      <button onClick={() => acknowledge(r.id)}
                        style={{ flexShrink: 0, alignSelf: 'center', fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid #2E5AFF', background: '#e8edff', color: '#2E5AFF', cursor: 'pointer', fontWeight: 600 }}>
                        ACK
                      </button>
                    ) : <span style={{ fontSize: 11, color: '#00C48C', fontWeight: 600, alignSelf: 'center' }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    
  );
}
