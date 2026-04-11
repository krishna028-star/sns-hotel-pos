'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth';
import { formatCurrency } from '@/lib/mockData';

export default function PayrollPage() {
  const { users } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showSlip, setShowSlip] = useState(false);

  const staff = users.filter(u => u.role !== 'main_admin' && u.role !== 'customer');

  const generateSlip = (u: any) => {
    setSelectedUser(u);
    setShowSlip(true);
  };

  const calculateNet = (u: any) => {
    const base = u.salary || 0;
    const days = u.workingDays || 26;
    const present = u.presenceThisMonth || 0;
    if (days === 0) return 0;
    return (base / days) * present;
  };

  return (
    <DashboardLayout title="Payroll & Salary">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">📜 Payroll Management</div>
          <div className="page-header-sub">Generate and track monthly salary slips for all staff</div>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Staff Name</th>
                <th>Role</th>
                <th>Base Salary</th>
                <th>Attendance</th>
                <th>Net Payable</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(u => (
                <tr key={u.id}>
                  <td><code style={{fontSize: 11}}>{u.staffId || '—'}</code></td>
                  <td><strong>{u.name}</strong></td>
                  <td><span className="badge badge-blue" style={{fontSize: 10}}>{u.role}</span></td>
                  <td>{formatCurrency(u.salary || 0)}</td>
                  <td>
                    <div style={{fontSize: 12}}>
                      <strong>{u.presenceThisMonth || 0}</strong> / {u.workingDays || 26} days
                      <div style={{width: '100%', height: 4, background: '#f1f5f9', borderRadius: 2, marginTop: 4}}>
                        <div style={{width: `${((u.presenceThisMonth || 0) / (u.workingDays || 26)) * 100}%`, height: '100%', background: '#00C48C', borderRadius: 2}} />
                      </div>
                    </div>
                  </td>
                  <td style={{fontWeight: 800, color: '#00C48C'}}>{formatCurrency(calculateNet(u))}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => generateSlip(u)}>📝 Print Slip</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSlip && selectedUser && (
        <div className="modal-backdrop" onClick={() => setShowSlip(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth: 500}}>
            <div className="modal-header">
              <div className="modal-title">📄 Salary Slip — {new Date().toLocaleString('default', { month: 'long' })}</div>
              <button className="btn btn-ghost" onClick={() => setShowSlip(false)}>✕</button>
            </div>
            <div className="modal-body">
               <div style={{ border: '2px solid #f1f5f9', padding: 30, borderRadius: 12, background: '#fff' }}>
                  <div style={{textAlign: 'center', marginBottom: 20}}>
                     <div style={{fontWeight: 900, fontSize: 18, color: '#1a1a1a'}}>SNS HOTELS GROUP</div>
                     <div style={{fontSize: 12, color: '#64748B'}}>{selectedUser.hotel || 'Corporate Office'} · Official Pay Slip</div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20, borderBottom: '1px dashed #e2e8f0', pb: 20}}>
                     <div>
                        <div style={{fontSize: 10, color: '#94a3b8', textTransform: 'uppercase'}}>Employee Name</div>
                        <div style={{fontWeight: 700}}>{selectedUser.name}</div>
                     </div>
                     <div>
                        <div style={{fontSize: 10, color: '#94a3b8', textTransform: 'uppercase'}}>Staff ID</div>
                        <div style={{fontWeight: 700}}>{selectedUser.staffId}</div>
                     </div>
                     <div>
                        <div style={{fontSize: 10, color: '#94a3b8', textTransform: 'uppercase'}}>Designation</div>
                        <div style={{fontWeight: 700}}>{selectedUser.role}</div>
                     </div>
                     <div>
                        <div style={{fontSize: 10, color: '#94a3b8', textTransform: 'uppercase'}}>Payment Period</div>
                        <div style={{fontWeight: 700}}>{new Date().toLocaleDateString(undefined, {month: 'short', year: 'numeric'})}</div>
                     </div>
                  </div>

                  <div style={{marginBottom: 20}}>
                     <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                        <span style={{color: '#64748B'}}>Basic Salary</span>
                        <span style={{fontWeight: 600}}>{formatCurrency(selectedUser.salary || 0)}</span>
                     </div>
                     <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                        <span style={{color: '#64748B'}}>Total Working Days</span>
                        <span style={{fontWeight: 600}}>{selectedUser.workingDays || 26}</span>
                     </div>
                     <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                        <span style={{color: '#64748B'}}>Days Present</span>
                        <span style={{fontWeight: 600}}>{selectedUser.presenceThisMonth || 0}</span>
                     </div>
                  </div>

                  <div style={{background: '#f8fafc', padding: 15, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <div style={{fontWeight: 700, fontSize: 14}}>NET PAYABLE</div>
                     <div style={{fontWeight: 900, fontSize: 20, color: '#00C48C'}}>{formatCurrency(calculateNet(selectedUser))}</div>
                  </div>

                  <div style={{marginTop: 30, fontSize: 10, color: '#94a3b8', textAlign: 'center'}}>
                     This is a computer generated pay slip and does not require a signature.
                  </div>
               </div>
            </div>
            <div className="modal-footer">
               <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Now</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
