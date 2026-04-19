'use client';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNotifications } from '@/lib/notifications';
import { ROLE_LABELS } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

interface TopbarProps { title: string; }

export default function Topbar({ title }: TopbarProps) {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const router = useRouter();

  const handleToggleNotifs = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0) {
      // Logic could go here to mark as read on open or leave for manual bill
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        <div className="topbar-icon-btn" title="Search">🔍</div>
        
        <div className="topbar-icon-btn" style={{ position: 'relative' }} onClick={handleToggleNotifs}>
          🔔
          {unreadCount > 0 && <span className="notif-dot" />}
          
          {showNotifs && (
            <div className="notif-dropdown" onClick={e => e.stopPropagation()}>
              <div className="notif-dropdown-header">
                <div>Notifications ({unreadCount})</div>
                <button onClick={() => markAsRead('all')} style={{ fontSize: 10, background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>Mark all read</button>
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#999', fontSize: 12 }}>No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markAsRead(n.id)}>
                      <div className={`notif-type-dot ${n.type}`} />
                      <div className="notif-content">
                        <div className="notif-msg">{n.message}</div>
                        {/* BUG FIX: n.time is ISO string, not Date — must parse before calling toLocaleTimeString */}
                        <div className="notif-time">{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>


        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #2E5AFF, #00C48C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>
            {user?.avatar}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{user?.role ? ROLE_LABELS[user.role] : ''}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
