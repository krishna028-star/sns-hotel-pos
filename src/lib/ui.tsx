'use client';
import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';

// ── Toast ─────────────────────────────────────────────────────────────────────
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastCtx {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
}

const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const add = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type, duration }]);
    if (duration > 0) setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const ctx: ToastCtx = {
    toast: add,
    success: (m) => add(m, 'success'),
    error:   (m) => add(m, 'error', 6000),
    warn:    (m) => add(m, 'warning'),
  };

  const bgMap: Record<ToastType, string> = {
    success: '#00C48C',
    error:   '#FF3B30',
    warning: '#FF8A34',
    info:    '#0F172A',
  };

  const iconMap: Record<ToastType, string> = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24,
        zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: bgMap[t.type],
            color: '#fff', padding: '13px 20px',
            borderRadius: 12, fontSize: 13, fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', gap: 10,
            minWidth: 280, maxWidth: 420,
            animation: 'slideInRight 0.3s ease',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            <span>{iconMap[t.type]}</span>
            <span style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(tt => tt.id !== t.id))}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}
            >✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}

// ── Alarm Sound ───────────────────────────────────────────────────────────────
export function useAlarmSound() {
  const audioRef = useRef<AudioContext | null>(null);

  const playAlarm = useCallback((type: 'kot' | 'payment' | 'alert' = 'kot') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioRef.current = ctx;

      const freqs = type === 'payment' ? [880, 1100] : type === 'alert' ? [440, 550, 440] : [660, 880, 660];
      let time = ctx.currentTime;

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
        osc.start(time);
        osc.stop(time + 0.25);
        time += 0.3;
      });
    } catch {
      // Web Audio not available
    }
  }, []);

  useEffect(() => {
    return () => { audioRef.current?.close().catch(() => {}); };
  }, []);

  return { playAlarm };
}
