'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FORECAST_DATA, SALES_TREND, formatCurrency } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const allData = [...SALES_TREND, ...FORECAST_DATA].map(d => ({
  ...d,
  revenue: (d as any).revenue ?? 0,
  predicted: (d as any).predicted ?? 0,
}));

function ManagerAnticipate() {
  return (
    <DashboardLayout title="Anticipate View">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🔮 Anticipate View</div>
          <div className="page-header-sub">AI-powered demand forecast and operational planning</div>
        </div>
        <span className="badge badge-purple" style={{ fontSize: 13, padding: '6px 14px' }}>AI Powered 🤖</span>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {[
          { label: 'Predicted Revenue (Next 7 days)', value: `₹${(970000).toLocaleString()}`, icon: '📈', color: '#9B59B6', bg: '#f5f0ff' },
          { label: 'Expected Footfall', value: '~2,450', icon: '👥', color: '#2E5AFF', bg: '#e8edff' },
          { label: 'Busiest Day Forecast', value: 'Sunday', icon: '📅', color: '#FF8A34', bg: '#fff3e8' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color, fontSize: 22 }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 20 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="chart-card" style={{ marginBottom: 24 }}>
        <div className="chart-title">📈 Revenue: Actual vs Forecast</div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 20, height: 3, background: '#2E5AFF', borderRadius: 2 }} /><span>Actual</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 20, height: 3, background: '#9B59B6', borderRadius: 2, borderStyle: 'dashed' }} /><span>Predicted</span></div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={allData}>
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2E5AFF" stopOpacity={0.2} /><stop offset="95%" stopColor="#2E5AFF" stopOpacity={0} /></linearGradient>
              <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9B59B6" stopOpacity={0.2} /><stop offset="95%" stopColor="#9B59B6" stopOpacity={0} /></linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: any, name: any) => [formatCurrency(Number(v)), name === 'revenue' ? 'Actual' : 'Predicted']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <ReferenceLine x="Mar 31" stroke="#E2E8F0" strokeDasharray="4 4" label={{ value: 'Today', fill: '#94A3B8', fontSize: 11 }} />
            <Area type="monotone" dataKey="revenue" stroke="#2E5AFF" strokeWidth={2.5} fill="url(#ag)" />
            <Area type="monotone" dataKey="predicted" stroke="#9B59B6" strokeWidth={2} strokeDasharray="5 5" fill="url(#pg)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">📋 Planning Recommendations</div></div>
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '👨‍🍳', text: 'Schedule extra kitchen staff on Sunday — 40% higher anticipated orders', severity: 'warning' },
            { icon: '📦', text: 'Reorder Chicken and Milk before Thursday — stock will hit critical', severity: 'danger' },
            { icon: '🪑', text: 'Open terrace seating on Saturday evening — predicted 85% indoor occupancy', severity: 'info' },
            { icon: '🎉', text: 'Promote Biryani Special this weekend — trending item with 22% higher searches', severity: 'success' },
          ].map((r, i) => (
            <div key={i} className={`alert alert-${r.severity === 'danger' ? 'danger' : r.severity === 'warning' ? 'warning' : r.severity === 'success' ? 'success' : 'info'}`}>
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <span>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
export default ManagerAnticipate;
