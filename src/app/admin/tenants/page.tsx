'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/lib/DataContext';

function AdminTenants() {
  const { tenants: dataTenants, createTenant, updateTenant, deleteTenant } = useData();
  const [tenants, setTenants] = useState<any[]>(dataTenants);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', customId: '', domain: '', email: '', plan: 'standard', status: 'active' });
  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  React.useEffect(() => {
    setTenants(dataTenants);
  }, [dataTenants]);

  const generateTenantId = () => {
    return 'TNT-' + Math.random().toString(36).substring(2, 6).toUpperCase() + Math.floor(1000 + Math.random() * 9000);
  };

  const openCreate = () => {
    setEditId(null);
    setForm({ name:'', customId: generateTenantId(), domain:'', email:'', plan:'enterprise', status:'active' });
    setShowModal(true);
  };

  const openEdit = (t: any) => {
    setEditId(t.id);
    setForm({ name: t.name, customId: t.customId || '', domain: t.domain === 'N/A' ? '' : t.domain, email: '', plan: t.plan ?? 'enterprise', status: t.status ?? 'active' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) return alert('Name is required');
    let res;
    if (editId) {
      res = await updateTenant(editId, form);
    } else {
      res = await createTenant(form);
    }
    
    if (res.ok) {
       setShowModal(false);
    } else {
       alert('Operation failed: ' + res.error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete tenant "${name}"?\n\nThis will also remove all associated hotels and users. This cannot be undone.`)) return;
    const res = await deleteTenant(id);
    if (!res.ok) alert('Delete failed: ' + res.error);
  };

  const filtered = tenants.filter(t =>
    (status === 'all' || t.status === status) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || (t.domain && t.domain.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <DashboardLayout title="Tenant Management">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🏢 Tenant (Main Client) Management</div>
          <div className="page-header-sub">Create, manage and oversee all hotel chain accounts</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={openCreate}>+ New Tenant</button>
        </div>
      </div>

      {errorHeader && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          <span>⚠️</span><span>Cloud sync issue: {errorHeader} — showing local data only.</span>
        </div>
      )}

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <div className="search-bar" style={{ flex:1, minWidth:240 }}>
          <span>🔍</span>
          <input placeholder="Search tenants by name or domain..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="chips-row">
          {['all','active','trial','suspended'].map(s=>(
            <button key={s} className={`chip ${status===s?'active':''}`} onClick={()=>setStatus(s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:20 }}>
        {[
          { label:'Total Tenants', value:tenants.length, icon:'🏢', color:'#2E5AFF', bg:'#e8edff' },
          { label:'Active', value:tenants.filter(t=>t.status==='active').length, icon:'✅', color:'#00C48C', bg:'#e0faf3' },
          { label:'Live Chains', value:tenants.length, icon:'🔔', color:'#FF8A34', bg:'#fff3e8' },
          { label:'Sync Health', value:'100%', icon:'🛡️', color:'#9B59B6', bg:'#f5f0ff' },
        ].map(m=>(
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background:m.bg, color:m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color:m.color }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">All Tenants ({filtered.length})</div></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>ID</th><th>Tenant Name</th><th>Domain</th><th>Plan</th><th>Hotels</th><th>Staff</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:40 }}>Connecting to Cloud...</td></tr>
              ) : filtered.map(t=>(
                <tr key={t.id}>
                   <td><code style={{ fontSize: 10, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{t.customId || t.id.slice(0,8)}</code></td>
                   <td><strong>{t.name}</strong></td>
                  <td style={{ fontFamily:'monospace', fontSize:12, color:'var(--text-secondary)' }}>{t.domain}</td>
                  <td><span className="badge badge-blue">{t.plan ?? 'Enterprise'}</span></td>
                  <td>{t.hotels || 0}</td>
                  <td>{t.staff || 0}</td>
                  <td><span className={`badge ${t.status==='active'?'badge-green':t.status==='trial'?'badge-orange':'badge-red'}`}>{t.status}</span></td>
                  <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{t.created}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-outline btn-sm" title="Edit Tenant" onClick={() => openEdit(t)}>✏️</button>
                      <button className="btn btn-outline btn-sm" title="Delete Tenant" style={{ color:'var(--danger)' }} onClick={() => handleDelete(t.id, t.name)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length===0 && (
                <tr><td colSpan={8}><div className="empty-state"><div className="empty-state-icon">🔍</div><div className="empty-state-title">No live tenants found</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={()=>setShowModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editId ? '✏️ Edit Tenant' : '➕ New Tenant'}</div>
              <button className="btn btn-ghost" onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div className="form-group">
                <label className="form-label">Tenant ID (Custom Code)</label>
                <input className="form-input" placeholder="e.g. SNS-001" value={form.customId} onChange={e=>setForm({...form,customId:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Tenant Name *</label>
                <input className="form-input" placeholder="e.g. SNS Grand Hotels" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Domain</label>
                <input className="form-input" placeholder="snsgrand.snshotels.com" value={form.domain} onChange={e=>setForm({...form,domain:e.target.value})}/>
              </div>
              {!editId && (
                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input className="form-input" placeholder="owner@chain.com" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group">
                  <label className="form-label">Plan</label>
                  <select className="form-select" value={form.plan} onChange={e=>setForm({...form,plan:e.target.value})}>
                    <option value="basic">Basic</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                    <option value="active">Active</option>
                    <option value="trial">Trial</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editId ? 'Save Changes' : 'Create Global Tenant'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default function AdminTenantsPage() { return <AdminTenants/>; }
