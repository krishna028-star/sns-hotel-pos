'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MENU_ITEMS, MENU_CATEGORIES, BOOKINGS, formatCurrency } from '@/lib/mockData';

function CustomerDash() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number; image: string }[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const addToCart = (item: typeof MENU_ITEMS[0]) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1, image: item.image }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(c => c.id !== id));
  const cartTotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const cartCount = cart.reduce((a, c) => a + c.qty, 0);

  const filtered = MENU_ITEMS.filter(i =>
    i.available &&
    (category === 'All' || i.category === category) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const placeOrder = () => { setOrdered(true); setCart([]); setCartOpen(false); };

  return (
    <DashboardLayout title="Customer Portal">
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)', borderRadius: 20, padding: '40px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(46,90,255,0.15)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 }}>Welcome to</div>
          <div style={{ color: '#fff', fontSize: 32, fontWeight: 900, marginBottom: 4 }}>🏨 SNS Beach Resort</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Browse our menu · Book a table · Track your order</div>
        </div>
      </div>

      {ordered && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          <span>✅</span>
          <span><strong>Order placed successfully!</strong> Your KOT has been sent to the kitchen. Estimated time: 20–25 minutes.</span>
        </div>
      )}

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { href: '/customer/book', icon: '🪑', label: 'Book a Table', sub: 'Reserve your spot', color: '#2E5AFF' },
          { href: '/customer/orders', icon: '📦', label: 'My Orders', sub: 'Track live orders', color: '#00C48C' },
          { href: '/customer/payments', icon: '💳', label: 'Payment History', sub: 'View past bills', color: '#9B59B6' },
        ].map(n => (
          <a key={n.href} href={n.href} style={{ textDecoration: 'none' }}>
            <div className="metric-card" style={{ cursor: 'pointer', border: `1px solid ${n.color}25` }}>
              <div className="metric-icon" style={{ background: n.color + '18', color: n.color, fontSize: 26 }}>{n.icon}</div>
              <div style={{ fontWeight: 700 }}>{n.label}</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>{n.sub}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Menu */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>🍽️ Our Menu</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="search-bar" style={{ width: 200 }}>
            <span>🔍</span>
            <input placeholder="Search dishes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {cartCount > 0 && (
            <button className="btn btn-primary" onClick={() => setCartOpen(true)}>
              🛒 Cart ({cartCount}) — {formatCurrency(cartTotal)}
            </button>
          )}
        </div>
      </div>

      <div className="chips-row" style={{ marginBottom: 16 }}>
        {MENU_CATEGORIES.map(c => <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {filtered.map(item => {
          const inCart = cart.find(c => c.id === item.id);
          return (
            <div key={item.id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', border: inCart ? '2px solid #2E5AFF' : '1px solid #E2E8F0' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
              <div style={{ padding: '18px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>{item.image}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 10 }}>{item.category}</div>
                <div style={{ fontWeight: 900, fontSize: 20, color: '#2E5AFF', marginBottom: 12 }}>{formatCurrency(item.price)}</div>
                <button className="btn btn-primary btn-sm btn-full" onClick={() => addToCart(item)}>
                  {inCart ? `+ Add More (${inCart.qty})` : '+ Add to Order'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Modal */}
      {cartOpen && (
        <div className="modal-backdrop" onClick={() => setCartOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">🛒 Your Order</div>
              <button className="btn btn-ghost" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: 24 }}>{item.image}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>× {item.qty} = {formatCurrency(item.price * item.qty)}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ color: '#FF3B30' }} onClick={() => removeFromCart(item.id)}>✕</button>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: 16, background: '#F4F6FB', borderRadius: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 900, fontSize: 22, color: '#2E5AFF' }}>{formatCurrency(cartTotal)}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setCartOpen(false)}>Continue Ordering</button>
              <button className="btn btn-primary btn-lg" onClick={placeOrder}>✅ Place Order</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default CustomerDash;
