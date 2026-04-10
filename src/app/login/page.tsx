'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth, getHome } from '@/lib/auth';
import { DEMO_USERS, ROLE_LABELS, ROLE_COLORS } from '@/lib/mockData';

const FEATURES = ['Real-time KOT & payment alarms', 'Multi-tenant franchise management', 'Inventory & theft reporting', 'Customer QR ordering portal'];
const DEMO_ROLES = DEMO_USERS.filter(u => u.role !== 'customer').slice(0, 6);

function LoginPage() {
  const { user, isAuthLoaded, login, loginAs } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { 
    if (isAuthLoaded && user) router.push(getHome(user.role)); 
  }, [user, isAuthLoaded, router]);

  if (!isAuthLoaded) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));
    const res = login(email, password);
    if (!res.ok) setError(res.error ?? 'Invalid credentials');
    setLoading(false);
  };

  const quickLogin = (role: string) => { loginAs(role); };

  const roleEmoji: Record<string, string> = { main_admin: '🔐', main_client: '🏢', franchise_head: '🏩', hotel_manager: '🏨', inventory_manager: '📦', cashier: '💰', chef: '👨‍🍳', worker: '👤', customer: '👥' };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand" style={{ maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="login-brand-icon">🏨</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, opacity: 0.5, letterSpacing: 2, fontWeight: 600 }}>SNS HOTELS</div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>POS System</div>
            </div>
          </div>
          <div className="login-brand-name" style={{ marginTop: 16 }}>Hospitality<br /><span style={{ background: 'linear-gradient(90deg,#2E5AFF,#00C48C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reimagined.</span></div>
          <div className="login-brand-sub">Cloud-native POS for hotel chains — manage all franchises, hotels, staff, kitchen, inventory & customers from a single platform.</div>
          <div className="login-features">
            {FEATURES.map((f, i) => (
              <div key={i} className="login-feature">
                <div className="login-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          {/* Demo Role Pills */}
          <div style={{ marginTop: 28 }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>10 Role System</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(ROLE_LABELS).map(([role, label]) => (
                <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, background: ROLE_COLORS[role] + '20', border: `1px solid ${ROLE_COLORS[role]}40`, color: ROLE_COLORS[role], fontSize: 11, fontWeight: 600 }}>
                  <span>{roleEmoji[role]}</span>{label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card" style={{ maxWidth: 440 }}>
          {!showDemo ? (
            <>
              <div className="login-card-title">Welcome Back 👋</div>
              <div className="login-card-sub">Sign in to your SNS Hotels POS account</div>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>Email Address</label>
                  <div className="login-input-wrap" style={{ marginTop: 6 }}>
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input className="login-input has-icon" type="email" placeholder="admin@sns.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>Password</label>
                  <div className="login-input-wrap" style={{ marginTop: 6, position: 'relative' }}>
                    <svg className="login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input className="login-input has-icon" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 44 }} />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {error && <div style={{ background: 'rgba(255,59,48,0.15)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ff6b6b', fontSize: 13 }}>⚠️ {error}</div>}

                <button className="login-btn" type="submit" disabled={loading}>
                  {loading ? <><div className="loader" />&nbsp;Signing in…</> : '→ Sign In'}
                </button>
              </form>

              <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20 }}>
                <button onClick={() => setShowDemo(true)} className="login-btn" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', fontSize: 13 }}>
                  🚀 Quick Demo — Choose a Role
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <button onClick={() => setShowDemo(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 20 }}>←</button>
                <div>
                  <div className="login-card-title" style={{ marginBottom: 0 }}>🚀 Quick Demo Access</div>
                  <div className="login-card-sub" style={{ marginBottom: 0 }}>Select a role to explore without credentials</div>
                </div>
              </div>
              <div className="demo-roles">
                {DEMO_USERS.map(u => (
                  <button key={u.role} className="demo-role-btn" onClick={() => quickLogin(u.role)}>
                    <div className="demo-role-icon" style={{ background: ROLE_COLORS[u.role] + '25', color: ROLE_COLORS[u.role] }}>{roleEmoji[u.role]}</div>
                    <div>
                      <div className="demo-role-name">{u.name}</div>
                      <div className="demo-role-desc">{ROLE_LABELS[u.role]}{u.hotel ? ` · ${u.hotel}` : u.tenant ? ` · ${u.tenant}` : ''}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>→</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPageWrapper() {
  return <LoginPage />;
}
