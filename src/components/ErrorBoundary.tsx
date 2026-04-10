'use client';
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[SNS POS Error]', error, info.componentStack);
    // In production: send to Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { extra: info });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#F4F6FB', fontFamily: 'Inter, system-ui, sans-serif',
          padding: 24,
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, padding: 40, maxWidth: 480,
            textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid #E2E8F0',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
              Something went wrong
            </h2>
            <p style={{ color: '#64748B', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              An unexpected error occurred in SNS Hotels POS. This has been logged automatically.
            </p>
            {this.state.error && (
              <details style={{
                background: '#F8F9FC', borderRadius: 8, padding: 14,
                marginBottom: 24, textAlign: 'left', fontSize: 12,
                color: '#64748B', border: '1px solid #E2E8F0',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Error details</summary>
                <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                style={{
                  padding: '10px 24px', background: '#2E5AFF', color: '#fff',
                  border: 'none', borderRadius: 8, fontWeight: 700,
                  cursor: 'pointer', fontSize: 14,
                }}
              >
                ↻ Try Again
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                style={{
                  padding: '10px 24px', background: '#F4F6FB', color: '#0F172A',
                  border: '1px solid #E2E8F0', borderRadius: 8, fontWeight: 600,
                  cursor: 'pointer', fontSize: 14,
                }}
              >
                ← Go to Login
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
