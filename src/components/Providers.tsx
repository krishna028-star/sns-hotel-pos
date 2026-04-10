'use client';
import { useEffect } from 'react';
import { AuthProvider } from '@/lib/auth';
import { NotificationProvider, useNotifications } from '@/lib/notifications';

function DemoTrigger() {
  const { notify, notifications } = useNotifications();
  
  useEffect(() => {
    // Only trigger if no notifications exist (initial load)
    if (notifications.length > 0) return;

    const timer = setTimeout(() => {
      notify('info', 'Welcome to SNS POS. System live.');
    }, 2000);

    const timer2 = setTimeout(() => {
      notify('order', 'New KOT: Table 4 ordered Butter Chicken');
    }, 5000);

    const timer3 = setTimeout(() => {
      notify('payment', 'Payment Received: ₹1,040 from Table 2');
    }, 8000);

    const timer4 = setTimeout(() => {
      notify('inventory', 'Low Stock Alert: Chicken below 5kg');
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [notify]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DemoTrigger />
        {children}
      </NotificationProvider>
    </AuthProvider>
  );
}
