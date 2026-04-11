'use client';
import { useEffect, useRef } from 'react';
import { useNotifications } from '@/lib/notifications';

// BUG FIX: Old DemoTrigger had notifications in render scope but not in effect deps,
// causing the welcome notification to fire on every render cycle (infinite loop risk).
// Also: notifications.length check was wrong — it read stale closure value.
// Fix: use a ref to ensure one-time fire.
function WelcomeTrigger() {
  const { notify } = useNotifications();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const t1 = setTimeout(() => notify('info', '✅ SNS POS System is live and ready.'), 1500);
    const t2 = setTimeout(() => notify('order', '🍽️ Demo: New KOT from Table 4 — Butter Chicken ×2'), 4000);
    const t3 = setTimeout(() => notify('payment', '💰 Demo: Payment received ₹1,040 from Table 2'), 7000);
    const t4 = setTimeout(() => notify('inventory', '⚠️ Demo: Chicken stock below 5kg reorder level'), 11000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: AuthProvider and NotificationProvider are in the root layout.tsx
  // This component is kept for any future provider additions.
  return (
    <>
      <WelcomeTrigger />
      {children}
    </>
  );
}
