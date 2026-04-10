'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MENU_ITEMS, MENU_CATEGORIES, formatCurrency } from '@/lib/mockData';

function CustomerMenu() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number; image: string }[]>([]);

  const add = (item: typeof MENU_ITEMS[0]) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      return ex ? prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
        : [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, image: item.image }];
    });
  };

  const filtered = MENU_ITEMS.filter(i =>
    i.available &&
    (category === 'All' || i.category === category) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const cartItems = cart.reduce((a, c) => a + c.qty, 0);
  const cartTotal = cart.reduce((a, c) => a + c.price * c.qty, 0);

  return (
    <DashboardLayout title="Browse Menu">
      {/* Sticky Cart Bar */}
      {cartItems > 0 && (
        <div style={{ position: 'sticky', top: 60, zIndex: 40, background: '#2E5AFF', borderRadius: 12, padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(46,90,255,0.4)' }}>
          <div style={{ color: '#fff' }}>🛒 <strong>{cartItems} items</strong> in your order</div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{formatCurrency(cartTotal)}</div>
          <button className="btn btn-sm" style={{ background: '#fff', color: '#2E5AFF', fontWeight: 700 }}>Place Order →</button>
        </div>
      )}

      <div className="page-header">
        <div className="page-header-left">
          <div className="page-header-title">🍽️ Browse Menu</div>
          <div className="page-header-sub">SNS Beach Resort · Full menu · Updated daily</div>
        </div>
        <div className="search-bar" style={{ width: 260 }}>
          <span>🔍</span>
          <input placeholder="Search dishes..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="chips-row" style={{ marginBottom: 20 }}>
        {MENU_CATEGORIES.map(c => <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {filtered.map(item => {
          const inCart = cart.find(c => c.id === item.id);
          return (
            <div key={item.id} className="card" style={{ transition: 'all 0.2s', cursor: 'pointer', border: inCart ? '2px solid #2E5AFF' : '1px solid #E2E8F0' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
              <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>{item.image}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.name}</div>
                <div style={{ display: 'inline-block', fontSize: 11, color: '#94A3B8', background: '#F4F6FB', padding: '2px 10px', borderRadius: 10, marginBottom: 12 }}>{item.category}</div>
                <div style={{ fontWeight: 900, fontSize: 22, color: '#2E5AFF', marginBottom: 14 }}>{formatCurrency(item.price)}</div>
                {inCart ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <button style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #E2E8F0', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 16 }}
                      onClick={() => setCart(prev => prev.map(c => c.id === item.id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0))}>−</button>
                    <span style={{ fontWeight: 800, fontSize: 18, color: '#2E5AFF', minWidth: 24, textAlign: 'center' }}>{inCart.qty}</span>
                    <button style={{ width: 32, height: 32, borderRadius: '50%', background: '#2E5AFF', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 16 }} onClick={() => add(item)}>+</button>
                  </div>
                ) : (
                  <button className="btn btn-primary btn-sm btn-full" onClick={() => add(item)}>+ Add to Order</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">No items found</div>
          <div className="empty-state-sub">Try a different category or search term</div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default CustomerMenu;
