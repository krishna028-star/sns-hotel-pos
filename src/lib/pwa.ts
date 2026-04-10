'use client';
import { useEffect } from 'react';

// ── PWA Service Worker Registration ──────────────────────────────────────────
export function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      // Check for updates on navigation
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Notify user of update
            dispatchEvent(new CustomEvent('sw-update-available'));
          }
        });
      });

      console.log('[SNS POS] Service Worker registered:', reg.scope);
    } catch (err) {
      console.warn('[SNS POS] SW registration failed:', err);
    }
  });

  // Handle controller change (new SW activated)
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

// ── WebSocket with exponential backoff ────────────────────────────────────────
export class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectDelay = 1000;
  private maxDelay = 30000;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private closed = false;

  onmessage: ((data: unknown) => void) | null = null;
  onconnect: (() => void) | null = null;
  ondisconnect: (() => void) | null = null;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    if (this.closed) return;
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[SNS WS] Connected');
        this.reconnectDelay = 1000; // reset backoff
        this.onconnect?.();
      };

      this.ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          this.onmessage?.(data);
        } catch {
          this.onmessage?.(evt.data);
        }
      };

      this.ws.onclose = () => {
        if (this.closed) return;
        console.warn(`[SNS WS] Disconnected — retrying in ${this.reconnectDelay}ms`);
        this.ondisconnect?.();
        this.reconnectTimer = setTimeout(() => {
          this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxDelay);
          this.connect();
        }, this.reconnectDelay);
      };

      this.ws.onerror = (err) => {
        console.error('[SNS WS] Error', err);
        this.ws?.close();
      };
    } catch (err) {
      console.error('[SNS WS] Failed to create WebSocket:', err);
    }
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  close() {
    this.closed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
  }
}

// ── PWA Install Prompt Hook ───────────────────────────────────────────────────
export function usePWAInstall() {
  useEffect(() => {
    let deferredPrompt: Event & { prompt?: () => void } | null = null;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as Event & { prompt?: () => void };
      // Dispatch custom event for install button
      dispatchEvent(new CustomEvent('pwa-installable', { detail: deferredPrompt }));
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
}
