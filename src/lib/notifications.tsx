'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type NotificationType = 'order' | 'payment' | 'inventory' | 'critical' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: Date;
  read: boolean;
}

interface NotificationCtx {
  notifications: Notification[];
  unreadCount: number;
  notify: (type: NotificationType, message: string) => void;
  markAsRead: (id: string | 'all') => void;
}

const NotificationContext = createContext<NotificationCtx | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Sound Synth Helper
  const playAlarm = useCallback((type: NotificationType) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      switch (type) {
        case 'order': // Quick High Double Beep
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.setValueAtTime(1000, now + 0.1);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        case 'payment': // Cash register "Ching" style
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        case 'critical': // Low repeating alarm
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        case 'inventory': // Mid-pitch alert
          osc.type = 'square';
          osc.frequency.setValueAtTime(500, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        default: // Simple pop
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
      }
    } catch (e) {
      console.warn('Audio feedback failed', e);
    }
  }, []);

  const notify = useCallback((type: NotificationType, message: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      time: new Date(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    playAlarm(type);
  }, [playAlarm]);

  const markAsRead = useCallback((id: string | 'all') => {
    setNotifications(prev => prev.map(n => 
      id === 'all' || n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = React.useMemo(() => ({
    notifications,
    unreadCount,
    notify,
    markAsRead
  }), [notifications, unreadCount, notify, markAsRead]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
};
