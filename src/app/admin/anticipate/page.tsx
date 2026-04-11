'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FORECAST_DATA, formatCurrency } from '@/lib/mockData';
import { ComposedChart, Area, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const fullForecast = [
  { date:'Mar 25', actual:82000, predicted:85000 },
  { date:'Mar 26', actual:94500, predicted:90000 },
  { date:'Mar 27', actual:71000, predicted:75000 },
  { date:'Mar 28', actual:108000, predicted:100000 },
  { date:'Mar 29', actual:125000, predicted:120000 },
  { date:'Mar 30', actual:118000, predicted:122000 },
  { date:'Mar 31', actual:140000, predicted:135000 },
  ...FORECAST_DATA,
];

const recommendations = [
  { id:1, type:'Stock', severity:'high', desc:'Rice will run out in 3 hotels within 2 days', action:'Create PO', status:'new' },
  { id:2, type:'Sales', severity:'high', desc:'SNS Beach sales dropped 32% vs forecast', action:'Investigate', status:'new' },
  { id:3, type:'Theft', severity:'medium', desc:'North Region theft reports up 150% this week', action:'Escalate', status:'acknowledged' },
  { id:4, type:'Stock', severity:'medium', desc:'Butter critical at SNS Central', action:'Create PO', status:'new' },
  { id:5, type:'Sales', severity:'low', desc:'South Region underperforming by 8%', action:'Review', status:'resolved' },
];

function AdminAnticipate() {
  return (
    <DashboardLayout title="Anticipate View — Global Forecasts">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🔮 Anticipate View</div>
          <div className="page-header-sub">AI-powered forecasts, stock predictions & anomaly alerts</div>
        </div>
        <div className="page-header-actions">
          <div className="chips-row">
            {['7 Days','14 Days','30 Days'].map(r=><button key={r} className={`chip ${r==='7 Days'?'active':''}`}>{r}</button>)}
          </div>
          <button className="btn btn-outline btn-sm">⬇ Export</button>
        </div>
      </div>

      {/* Alert banner */}
      <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
        {[
          { icon:'⚠️', msg:'Rice will run out in 3 hotels within 2 days', color:'#FF8A34', bg:'#fff3e8' },
          { icon:'📉', msg:"SNS Beach sales dropped 32% vs forecast", color:'#FF3B30', bg:'#fff0ef' },
          { icon:'🚨', msg:'Theft spike: North Region +150% this week', color:'#9B59B6', bg:'#f3eeff' },
        ].map((a,i)=>(
          <div key={i} style={{ flex:1, minWidth:200, background:a.bg, borderRadius:12, padding:'12px 16px', border:`1px solid ${a.color}33`, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:20 }}>{a.icon}</span>
            <span style={{ fontSize:12, color:a.color, fontWeight:600 }}>{a.msg}</span>
          </div>
        ))}
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        {[
          { label:'Forecast Revenue (7d)', value:'₹18.5L', sub:'±5% confidence', icon:'📈', color:'#2E5AFF', bg:'#e8edff' },
          { label:'Ingredients Running Out', value:'23 items', sub:'Within next 7 days', icon:'📦', color:'#FF8A34', bg:'#fff3e8' },
          { label:'Anomalies Detected', value:'5', sub:'Sales drop, theft spike', icon:'🔍', color:'#FF3B30', bg:'#fff0ef' },
        ].map(m=>(
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background:m.bg, color:m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color:m.color, fontSize:20 }}>{m.value}</div>
            <div className="text-sm text-muted">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="chart-card" style={{ marginBottom:16 }}>
        <div className="chart-title">📊 Predicted vs Actual Revenue</div>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={fullForecast}>
            <XAxis dataKey="date" tick={{ fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip formatter={(v: unknown, name: unknown)=>[formatCurrency(Number(v)), name==='actual'?'Actual':'Predicted']} contentStyle={{ borderRadius:8,fontSize:12 }}/>
            <Legend formatter={v=><span style={{ fontSize:12 }}>{v==='actual'?'Actual':'Predicted'}</span>}/>
            <Area type="monotone" dataKey="predicted" fill="#2E5AFF22" stroke="#2E5AFF" strokeWidth={1.5} strokeDasharray="4 2" name="predicted"/>
            <Line type="monotone" dataKey="actual" stroke="#00C48C" strokeWidth={2.5} dot={{ r:4 }} name="actual"/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">💡 Proactive Recommendations</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Type</th><th>Severity</th><th>Description</th><th>Action</th><th>Status</th></tr></thead>
            <tbody>
              {recommendations.map(r=>(
                <tr key={r.id}>
                  <td><span className="badge badge-blue">{r.type}</span></td>
                  <td><span className={`badge ${r.severity==='high'?'badge-red':r.severity==='medium'?'badge-orange':'badge-gray'}`}>{r.severity}</span></td>
                  <td>{r.desc}</td>
                  <td><button className="btn btn-outline btn-sm">{r.action}</button></td>
                  <td><span className={`badge ${r.status==='resolved'?'badge-green':r.status==='acknowledged'?'badge-orange':'badge-purple'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default function AdminAnticipatePage() { return <AdminAnticipate/>; }
