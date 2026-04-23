'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { fetchHotels, createDbHotel } from '@/app/actions/hotelActions';
import { useAuth } from '@/lib/auth';
import { formatCurrency } from '@/lib/mockData';
import { fetchTenants } from '@/app/actions/tenantActions';


function FranchiseHotels() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', tenantId: '', address: '', phone: '' });

  React.useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    // If admin, show all. If franchise head, show only theirs.
    const resH = await fetchHotels(); 
    const resT = await fetchTenants();

    if (resH.ok) setHotels(resH.hotels || []);
    if (resT.ok) {
        const tnts = resT.tenants || [];
        setTenants(tnts);
        if (tnts.length > 0) setFormData(prev => ({ ...prev, tenantId: tnts[0].id }));
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.tenantId) return alert('Name and Tenant are required');
    const res = await createDbHotel(user!.id, { 
        name: formData.name, 
        tenantId: formData.tenantId,
        address: formData.address,
        phoneNumber: formData.phone 
    });
    if (res.ok) {
      setShowModal(false);
      setFormData({ name: '', tenantId: tenants[0]?.id || '', address: '', phone: '' });
      loadData();
    } else {
      alert(res.error);
    }
  };

  const filtered = hotels.filter(h => h.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="Hotel Management">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🏨 Hotels in Franchise</div>
          <div className="page-header-sub">Manage hotels, assign managers, and view performance</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Hotel</button>
        </div>
      </div>

      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Hotels', value: hotels.length, icon: '🏨', color: '#FF8A34', bg: '#fff3e8' },
          { label: 'Cloud Sync', value: 'Live', icon: '💰', color: '#00C48C', bg: '#e8fdf7' },
          { label: 'Active Hotels', value: hotels.length, icon: '✅', color: '#2E5AFF', bg: '#e8edff' },
        ].map(m => (
          <div className="metric-card" key={m.label}>
            <div className="metric-icon" style={{ background: m.bg, color: m.color }}>{m.icon}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-value" style={{ color: m.color, fontSize: 24 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">All Hotels</div>
          <div className="search-bar" style={{ width: 260 }}>
            <span>🔍</span>
            <input placeholder="Search hotels..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Hotel Name</th><th>Manager</th><th>Tables</th><th>Revenue (MTD)</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>Loading Cloud Hotels...</td></tr>
              ) : filtered.map(h => (
                <tr key={h.id}>
                  <td>
                    <strong>{h.name}</strong>
                    <div style={{ fontSize: 10, color: '#64748B' }}>{h.tenant}</div>
                  </td>
                  <td>Staff: {h.staff || 0}</td>
                  <td><span style={{ background: '#e8edff', color: '#2E5AFF', padding: '2px 10px', borderRadius: 12, fontWeight: 600, fontSize: 12 }}>{h.tables} tables</span></td>
                  <td><strong style={{ color: '#FF8A34' }}>{formatCurrency(h.revenue)}</strong></td>
                  <td><span className={`badge badge-green`}>{h.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>No hotels found. Add your first hotel!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Hotel</div>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Hotel Name</label>
                  <input className="form-input" placeholder="e.g. SNS Plaza" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign to Tenant (Group)</label>
                  <select className="form-select" value={formData.tenantId} onChange={e => setFormData({ ...formData, tenantId: e.target.value })}>
                    {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-input" placeholder="e.g. 123 Beach Rd" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" placeholder="e.g. +91 9876543210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create Hotel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default FranchiseHotels;
