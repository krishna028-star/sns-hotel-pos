'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#0F172A 0%,#1E293B 50%,#0F1D40 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ textAlign: 'center', color: '#fff', padding: 40 }}>
        <div style={{ fontSize: 80, marginBottom: 16 }}>🏨</div>
        <h1 style={{ fontSize: 96, fontWeight: 900, margin: 0, lineHeight: 1,
          background: 'linear-gradient(90deg,#2E5AFF,#00C48C)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </h1>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 8, marginBottom: 12 }}>
          Page Not Found
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 40, maxWidth: 360 }}>
          The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{
            padding: '13px 32px', background: '#2E5AFF', color: '#fff',
            borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none',
            transition: 'all 0.2s',
          }}>
            ← Back to Login
          </Link>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '13px 32px',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
