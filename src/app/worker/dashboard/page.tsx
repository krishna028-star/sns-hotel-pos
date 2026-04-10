'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { TABLES, ACTIVE_ORDERS, MENU_ITEMS, MENU_CATEGORIES, formatCurrency } from '@/lib/mockData';

type TableStatus = 'free' | 'occupied' | 'reserved';

function WorkerDash() {
  const [tables, setTables] = useState(TABLES);
  const [selectedTable, setSelectedTable] = useState<typeof TABLES[0] | null>(null);
  const [orderItems, setOrderItems] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [menuCategory, setMenuCategory] = useState('All');
  const [step, setStep] = useState<'table' | 'menu' | 'confirm'>('table');

  const occupied = tables.filter(t => t.status === 'occupied').length;
  const free = tables.filter(t => t.status === 'free').length;

  const addItem = (item: typeof MENU_ITEMS[0]) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeItem = (id: number) => setOrderItems(prev => prev.filter(i => i.id !== id));
  const total = orderItems.reduce((a, i) => a + i.price * i.qty, 0);

  const sendKOT = () => {
    setTables(prev => prev.map(t => t.id === selectedTable?.id ? { ...t, status: 'occupied' as TableStatus } : t));
    setStep('table');
    setSelectedTable(null);
    setOrderItems([]);
  };

  const menuItems = MENU_ITEMS.filter(i => i.available && (menuCategory === 'All' || i.category === menuCategory));

  return (
    <DashboardLayout title="Waiter Dashboard">
      {step === 'table' && (
        <>
          <div className="page-header">
            <div className="page-header-left">
              <div className="page-header-title">🪑 Floor Plan — Take Order</div>
              <div className="page-header-sub">Select a table to take order or view active orders</div>
            </div>
            <div className="stats-row">
              <div className="stat-pill"><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00C48C', display: 'inline-block' }} /><strong style={{ color: '#00C48C' }}>{free}</strong> Free</div>
              <div className="stat-pill"><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF3B30', display: 'inline-block' }} /><strong style={{ color: '#FF3B30' }}>{occupied}</strong> Occupied</div>
            </div>
          </div>

          {['Ground', '1st Floor', 'Terrace'].map(floor => (
            <div key={floor} className="card" style={{ marginBottom: 16 }}>
              <div className="card-header"><div className="card-title">{floor}</div></div>
              <div className="table-map">
                {tables.filter(t => t.floor === floor).map(t => (
                  <div key={t.id} className={`table-box ${t.status}`} onClick={() => { setSelectedTable(t); setStep('menu'); setOrderItems([]); }}>
                    <div className="table-num">{t.number}</div>
                    <div className="table-status">{t.status}</div>
                    <div style={{ fontSize: 10 }}>{t.capacity}p</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {step === 'menu' && selectedTable && (
        <>
          <div className="page-header">
            <div className="page-header-left">
              <div className="page-header-title">🍽️ Table {selectedTable.number} — Select Items</div>
              <div className="page-header-sub">{selectedTable.floor} floor · {selectedTable.capacity} seats</div>
            </div>
            <div className="page-header-actions">
              <button className="btn btn-outline" onClick={() => setStep('table')}>← Back</button>
              {orderItems.length > 0 && <button className="btn btn-primary" onClick={() => setStep('confirm')}>Review Order ({orderItems.length}) →</button>}
            </div>
          </div>

          <div className="chips-row" style={{ marginBottom: 16 }}>
            {MENU_CATEGORIES.map(c => <button key={c} className={`chip ${menuCategory === c ? 'active' : ''}`} onClick={() => setMenuCategory(c)}>{c}</button>)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {menuItems.map(item => {
              const inOrder = orderItems.find(o => o.id === item.id);
              return (
                <div key={item.id} className="card" style={{ cursor: 'pointer', border: inOrder ? '2px solid #2E5AFF' : '1px solid #E2E8F0' }} onClick={() => addItem(item)}>
                  <div style={{ padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 36, marginBottom: 6 }}>{item.image}</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>{item.category}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, color: '#2E5AFF' }}>{formatCurrency(item.price)}</span>
                      {inOrder && <span style={{ background: '#2E5AFF', color: '#fff', borderRadius: 12, padding: '1px 8px', fontSize: 12, fontWeight: 700 }}>×{inOrder.qty}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {step === 'confirm' && selectedTable && (
        <>
          <div className="page-header">
            <div className="page-header-left">
              <div className="page-header-title">✅ Confirm KOT — Table {selectedTable.number}</div>
              <div className="page-header-sub">Review order before sending to kitchen</div>
            </div>
            <button className="btn btn-outline" onClick={() => setStep('menu')}>← Edit Order</button>
          </div>

          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div className="card">
              <div className="card-header"><div className="card-title">Order Items</div></div>
              <div style={{ padding: '0 20px' }}>
                {orderItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>× {item.qty}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#2E5AFF' }}>{formatCurrency(item.price * item.qty)}</div>
                    <button className="btn btn-ghost btn-sm" style={{ color: '#FF3B30' }} onClick={() => removeItem(item.id)}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ padding: '16px 20px', background: '#F4F6FB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 22, color: '#2E5AFF' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 16, fontSize: 16 }} onClick={sendKOT}>
              📤 Send KOT to Kitchen
            </button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
export default WorkerDash;
