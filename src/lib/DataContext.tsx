'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as mock from '@/lib/mockData';

interface DataCtx {
  tenants: any[];
  hotels: any[];
  menuItems: any[];
  tables: any[];
  ingredients: any[];
  suppliers: any[];
  activeOrders: any[];
  pendingKots: any[];
  bookings: any[];
  theftReports: any[];
  purchaseOrders: any[];
  
  // CRUD Actions
  addItem: (key: string, item: any) => void;
  updateItem: (key: string, id: any, updates: any) => void;
  deleteItem: (key: string, id: any) => void;
  
  // Specific complex actions if needed
  markKOTReady: (id: string | number) => void;
  cancelBooking: (id: string | number) => void;
}

const DataContext = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState({
    tenants: mock.TENANTS,
    hotels: mock.HOTELS,
    menuItems: mock.MENU_ITEMS,
    tables: mock.TABLES,
    ingredients: mock.INGREDIENTS,
    suppliers: [
      { id: 1, name: 'Fresh Foods Co.', contact: 'Ravi Kumar',  phone: '+91 94001 12345', email: 'ravi@freshfoods.com',  categories: 'Meat, Poultry',          rating: 4.5, status: 'active', lastOrder: '2025-04-16' },
      { id: 2, name: 'Dairy Direct',    contact: 'Meena Shah',  phone: '+91 98001 67890', email: 'meena@dairydirect.com', categories: 'Dairy, Eggs',             rating: 4.8, status: 'active', lastOrder: '2025-04-15' },
      { id: 3, name: 'Veggie World',    contact: 'Suresh Iyer', phone: '+91 96001 34567', email: 'suresh@veggieworld.com', categories: 'Vegetables, Fruits',     rating: 4.2, status: 'active', lastOrder: '2025-04-14' },
      { id: 4, name: 'Spice Garden',    contact: 'Priya Nair',  phone: '+91 97001 56789', email: 'priya@spicegarden.com', categories: 'Spices, Condiments',     rating: 4.6, status: 'active', lastOrder: '2025-04-13' },
    ],
    activeOrders: mock.ACTIVE_ORDERS,
    pendingKots: mock.PENDING_KOTS,
    bookings: mock.BOOKINGS,
    theftReports: mock.THEFT_REPORTS,
    purchaseOrders: mock.PURCHASE_ORDERS,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence to localStorage for "instant" feel that lasts across refreshes
  useEffect(() => {
    const stored = localStorage.getItem('sns_pos_data');
    if (stored) {
      try {
        setData(prev => ({ ...prev, ...JSON.parse(stored) }));
      } catch (e) {
        console.error('Failed to load storage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sns_pos_data', JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const addItem = useCallback((key: string, item: any) => {
    setData(prev => ({
      ...prev,
      // @ts-ignore
      [key]: [{ ...item, id: item.id || Date.now() }, ...prev[key]]
    }));
  }, []);

  const updateItem = useCallback((key: string, id: any, updates: any) => {
    setData(prev => ({
      ...prev,
      // @ts-ignore
      [key]: prev[key].map(i => (i.id === id ? { ...i, ...updates } : i))
    }));
  }, []);

  const deleteItem = useCallback((key: string, id: any) => {
    setData(prev => ({
      ...prev,
      // @ts-ignore
      [key]: prev[key].filter(i => i.id !== id)
    }));
  }, []);

  const markKOTReady = useCallback((id: string | number) => {
    setData(prev => ({
      ...prev,
      pendingKots: prev.pendingKots.filter(k => k.id !== id),
      // In a real app, this might move to a "ready" list or notify activeOrders
      activeOrders: prev.activeOrders.map(o => {
        // Find order associated with this KOT if any
        return o; 
      })
    }));
  }, []);

  const cancelBooking = useCallback((id: string | number) => {
    setData(prev => ({
      ...prev,
      bookings: prev.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
    }));
  }, []);

  const value = useMemo(() => ({
    ...data,
    addItem,
    updateItem,
    deleteItem,
    markKOTReady,
    cancelBooking
  }), [data, addItem, updateItem, deleteItem, markKOTReady, cancelBooking]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
}
