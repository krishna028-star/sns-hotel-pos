'use client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[SNS POS Global Error]', error);
  }, [error]);

  return (
    <html>
      <body style={{
        margin: 0, fontFamily: 'Inter, system-ui, sans-serif',
        background: 'linear-gradient(135deg,#0F172A,#1E293B)',
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
          padding: 48, maxWidth: 480, textAlign: 'center', color: '#fff',
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔴</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
            Critical Error
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
            A critical error occurred in SNS Hotels POS. This has been reported automatically.
            Please try again or contact your system administrator.
          </p>
          {error.digest && (
            <div style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: 8,
              padding: '8px 16px', marginBottom: 24, fontSize: 11,
              color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace',
            }}>
              Error ID: {error.digest}
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={reset}
              style={{
                padding: '12px 28px', background: '#2E5AFF', color: '#fff',
                border: 'none', borderRadius: 10, fontWeight: 700,
                cursor: 'pointer', fontSize: 14,
              }}
            >
              ↻ Try Again
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                padding: '12px 28px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14,
              }}
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
