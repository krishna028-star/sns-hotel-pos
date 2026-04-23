'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MENU_CATEGORIES, formatCurrency } from '@/lib/mockData';
import { useData } from '@/lib/DataContext';
import { useAuth } from '@/lib/auth';

function WorkerDash() {
  // FIX: removed non-existent updateItem/addItem — use createOrder instead
  const { tables: dataTables = [], menuItems: allMenuItems = [], createOrder } = useData();
  const { user } = useAuth();

  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);
  const [menuCategory, setMenuCategory] = useState('All');
  const [step, setStep] = useState<'table' | 'menu' | 'confirm'>('table');
  const [sending, setSending] = useState(false);

  const safeTables = Array.isArray(dataTables) ? dataTables : [];
  const safeMenu = Array.isArray(allMenuItems) ? allMenuItems : [];

  useEffect(() => {
    setTables(safeTables);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTables]);

  const occupied = safeTables.filter((t: any) => t.status === 'occupied').length;
  const free = safeTables.filter((t: any) => t.status === 'free').length;

  const addOrderItem = (item: any) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: item.id, name: item.name, price: Number(item.price), qty: 1 }];
    });
  };

  const removeItem = (id: string) => setOrderItems(prev => prev.filter(i => i.id !== id));
  const total = orderItems.reduce((a, i) => a + i.price * i.qty, 0);

  const sendKOT = async () => {
    if (!selectedTable || !user) return;
    setSending(true);
    const res = await createOrder({
      tableId: selectedTable.id,
      waiterId: user.id,
      totalAmount: total,
      items: orderItems.map(i => ({
        name: i.name,
        quantity: i.qty,
        price: i.price,
        notes: ''
      }))
    });
    setSending(false);
    if (res.ok) {
      setStep('table');
      setSelectedTable(null);
      setOrderItems([]);
    } else {
      alert('Failed to send KOT: ' + res.error);
    }
  };

  // Dynamic floors from DB data; fallback to show "All Tables" if no floor data
  const allFloors = [...new Set(safeTables.map((t: any) => t.floor || 'Main Floor'))];
  const menuItems = safeMenu.filter((i: any) => i.available && (menuCategory === 'All' || i.category === menuCategory));

  return (
    <DashboardLayout title="Waiter Dashboard">
      {step === 'table' && (
        <>
          <div className="page-header">
            <div className="page-header-left">
              <div className="page-header-title">🪑 Floor Plan — Take Order</div>
              <div className="page-header-sub">Tap a free table to take a new order</div>
            </div>
            <div className="stats-row">
              <div className="stat-pill"><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00C48C', display: 'inline-block' }} /><strong style={{ color: '#00C48C' }}>{free}</strong> Free</div>
              <div className="stat-pill"><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF3B30', display: 'inline-block' }} /><strong style={{ color: '#FF3B30' }}>{occupied}</strong> Occupied</div>
            </div>
          </div>

          {allFloors.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🪑</div>
                <div className="empty-state-title">No Tables Found</div>
                <div className="empty-state-sub">Ask your manager to configure tables for this hotel.</div>
              </div>
            </div>
          ) : allFloors.map(floor => {
            const floorTables = tables.filter((t: any) => (t.floor || 'Main Floor') === floor);
            return (
              <div key={floor} className="card" style={{ marginBottom: 16 }}>
                <div className="card-header"><div className="card-title">{floor}</div></div>
                <div className="table-map">
                  {floorTables.map((t: any) => (
                    <div key={t.id} className={`table-box ${t.status}`}
                      title={t.status === 'occupied' ? `Table ${t.number} is occupied — an order is in progress` : t.status === 'cleaning' ? `Table ${t.number} is being cleaned` : `Click to take order for Table ${t.number}`}
                      style={{ cursor: t.status === 'free' || t.status === 'reserved' ? 'pointer' : 'not-allowed', opacity: t.status === 'cleaning' ? 0.5 : 1 }}
                      onClick={() => {
                        // BUG-09 FIX: Only allow order-taking on free/reserved tables
                        if (t.status === 'occupied') {
                          alert(`Table ${t.number} is currently occupied. An order is already in progress for this table.`);
                          return;
                        }
                        if (t.status === 'cleaning') {
                          alert(`Table ${t.number} is being cleaned and is not available.`);
                          return;
                        }
                        setSelectedTable(t);
                        setStep('menu');
                        setOrderItems([]);
                      }}>
                      <div className="table-num">{t.number}</div>
                      <div className="table-status">{t.status}</div>
                      <div style={{ fontSize: 10 }}>{t.capacity}p</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}

      {step === 'menu' && selectedTable && (
        <>
          <div className="page-header">
            <div className="page-header-left">
              <div className="page-header-title">🍽️ Table {selectedTable.number} — Select Items</div>
              <div className="page-header-sub">{selectedTable.floor || 'Main Floor'} · {selectedTable.capacity} seats</div>
            </div>
            <div className="page-header-actions">
              <button className="btn btn-outline" onClick={() => setStep('table')}>← Back</button>
              {orderItems.length > 0 && <button className="btn btn-primary" onClick={() => setStep('confirm')}>Review Order ({orderItems.length}) →</button>}
            </div>
          </div>

          <div className="chips-row" style={{ marginBottom: 16 }}>
            {MENU_CATEGORIES.map(c => <button key={c} className={`chip ${menuCategory === c ? 'active' : ''}`} onClick={() => setMenuCategory(c)}>{c}</button>)}
          </div>

          {menuItems.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-state-icon">🍽️</div>
                <div className="empty-state-title">No Menu Items</div>
                <div className="empty-state-sub">No available items in this category. Try another or ask your manager to add menu items.</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {menuItems.map((item: any) => {
                const inOrder = orderItems.find(o => o.id === item.id);
                return (
                  <div key={item.id} className="card" style={{ cursor: 'pointer', border: inOrder ? '2px solid #2E5AFF' : '1px solid #E2E8F0' }} onClick={() => addOrderItem(item)}>
                    <div style={{ padding: 14, textAlign: 'center' }}>
                      <div style={{ fontSize: 36, marginBottom: 6 }}>{item.image || '🍽️'}</div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>{item.category}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, color: '#2E5AFF' }}>{formatCurrency(Number(item.price))}</span>
                        {inOrder && <span style={{ background: '#2E5AFF', color: '#fff', borderRadius: 12, padding: '1px 8px', fontSize: 12, fontWeight: 700 }}>×{inOrder.qty}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 16, fontSize: 16 }} disabled={sending} onClick={sendKOT}>
              {sending ? '⏳ Sending...' : '📤 Send KOT to Kitchen'}
            </button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
export default WorkerDash;
