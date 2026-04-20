'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './auth';
import * as actions from '@/app/actions/posActions';

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
  
  refreshData: () => Promise<void>;
  
  // CRUD Actions (Now DB backed)
  addTable: (data: any) => Promise<any>;
  createOrder: (data: any) => Promise<any>;
  updateOrderStatus: (id: string, status: string, version: number) => Promise<any>;
  adjustStock: (itemId: string, change: number, reason: string) => Promise<any>;
  processPayment: (orderId: string, data: any) => Promise<any>;
}

const DataContext = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState({
    tenants: [],
    hotels: [],
    menuItems: [],
    tables: [],
    ingredients: [],
    suppliers: [],
    activeOrders: [],
    pendingKots: [],
    bookings: [],
    theftReports: [],
    purchaseOrders: [],
    auditLogs: [],
    metrics: { tenants: 0, users: 0, orders: 0, totalRevenue: 0 }
  });

  const refreshData = useCallback(async () => {
    if (!user) return;

    const data: any = { ...state };

    if (user.role === 'main_admin' || user.role === 'main_client') {
      const tenantsRes = await actions.fetchTenants();
      if (tenantsRes.ok) data.tenants = tenantsRes.tenants;
      
      const adminLogs = await actions.fetchAuditLogs(20);
      if (adminLogs.ok) data.auditLogs = adminLogs.logs;

      const metricsRes = await actions.fetchGlobalMetrics();
      if (metricsRes.ok) data.metrics = metricsRes.metrics;
    }

    if (user.hotelId) {
      const tablesRes = await actions.fetchTables(user.hotelId as string);
      if (tablesRes.ok) data.tables = tablesRes.tables;
      
      const inventoryRes = await actions.fetchInventory(user.hotelId as string);
      if (inventoryRes.ok) data.ingredients = inventoryRes.items;

      const ordersRes = await actions.fetchOrders(user.hotelId as string);
      if (ordersRes.ok) data.activeOrders = ordersRes.orders;

      const bookingsRes = await actions.fetchBookings(user.hotelId as string);
      if (bookingsRes.ok) data.bookings = bookingsRes.bookings;
      
      // ... fetch other hotel-specific data
    }
    
    setState(data);
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addTable = async (data: any) => {
    if (!user) return { ok: false, error: 'Auth required' };
    const res = await actions.createTable(user.id as string, { ...data, hotelId: user.hotelId });
    if (res.ok) refreshData();
    return res;
  };

  const createOrder = async (data: any) => {
    if (!user) return { ok: false, error: 'Auth required' };
    const res = await actions.createOrder(user.id as string, { ...data, hotelId: user.hotelId });
    if (res.ok) refreshData();
    return res;
  };

  const updateOrderStatus = async (id: string, status: string, version: number) => {
    if (!user) return { ok: false, error: 'Auth required' };
    const res = await actions.updateOrderStatus(user.id as string, id, status, version);
    if (res.ok) refreshData();
    return res;
  };

  const adjustStock = async (itemId: string, change: number, reason: string) => {
    if (!user) return { ok: false, error: 'Auth required' };
    const res = await actions.adjustStock(user.id as string, itemId, change, reason);
    if (res.ok) refreshData();
    return res;
  };

  const processPayment = async (orderId: string, data: any) => {
    if (!user) return { ok: false, error: 'Auth required' };
    const res = await actions.processPayment(user.id as string, orderId, data);
    if (res.ok) refreshData();
    return res;
  };

  const value = useMemo(() => ({
    ...state,
    refreshData,
    addTable,
    createOrder,
    updateOrderStatus,
    adjustStock,
    processPayment
  }), [state, refreshData]);

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
