'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './auth';
import * as actions from '@/app/actions/posActions';
import * as tenantActions from '@/app/actions/tenantActions';
import * as hotelActions from '@/app/actions/hotelActions';
import * as authActions from '@/app/actions/authActions';

interface DataCtx {
  tenants: any[];
  hotels: any[];
  users: any[];
  menuItems: any[];
  ingredients: any[];
  activeOrders: any[];
  bookings: any[];
  theftReports: any[];
  purchaseOrders: any[];
  auditLogs: any[];
  metrics: any;
  
  refreshData: () => Promise<void>;
  
  // Tables
  addTable: (data: any) => Promise<any>;
  updateTable: (id: string, data: any) => Promise<any>;
  deleteTable: (id: string) => Promise<any>;
  
  // Menu
  addMenuItem: (data: any) => Promise<any>;
  updateMenuItem: (id: string, data: any) => Promise<any>;
  deleteMenuItem: (id: string) => Promise<any>;
  
  // Orders
  createOrder: (data: any) => Promise<any>;
  updateOrderStatus: (id: string, status: string, version: number) => Promise<any>;
  
  // Inventory & Theft
  adjustStock: (itemId: string, change: number, reason: string, version: number) => Promise<any>;
  createTheftReport: (data: any) => Promise<any>;
  verifyTheftReport: (id: string, verified: boolean) => Promise<any>;
  
  // Payments & Shifts
  processPayment: (orderId: string, data: any) => Promise<any>;
  startShift: (startingCash: number) => Promise<any>;
  endShift: (shiftId: string, endingCash: number, notes?: string) => Promise<any>;
  
  // Users & Admin
  createUser: (data: any) => Promise<any>;
  deleteUser: (id: string) => Promise<any>;
  toggleUserStatus: (id: string, isActive: boolean) => Promise<any>;
  createTenant: (data: any) => Promise<any>;
  updateTenant: (id: string, data: any) => Promise<any>;
  deleteTenant: (id: string) => Promise<any>;
  createHotel: (data: any) => Promise<any>;
}

const DataContext = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState({
    tenants: [],
    hotels: [],
    users: [],
    ingredients: [],
    activeOrders: [],
    orders: [], // Added here
    bookings: [],
    theftReports: [],
    purchaseOrders: [],
    suppliers: [],
    auditLogs: [],
    metrics: { tenants: 0, users: 0, orders: 0, totalRevenue: 0 }
  });

  const refreshData = useCallback(async () => {
    if (!user) return;

    const data: any = { ...state };

    if (user.role === 'main_admin' || user.role === 'main_client') {
      const tenantsRes = await tenantActions.fetchTenants();
      if (tenantsRes.ok) data.tenants = tenantsRes.tenants;
      
      const hotelsRes = await hotelActions.fetchHotels();
      if (hotelsRes.ok) data.hotels = hotelsRes.hotels;

      const usersRes = await authActions.fetchUsers();
      if (usersRes.ok) data.users = usersRes.users;

      const adminLogs = await actions.fetchAuditLogs(50);
      if (adminLogs.ok) data.auditLogs = adminLogs.logs;

      const metricsRes = await actions.fetchGlobalMetrics();
      if (metricsRes.ok) data.metrics = metricsRes.metrics;

      const suppliersRes = await actions.fetchSuppliers();
      if (suppliersRes.ok) data.suppliers = suppliersRes.suppliers;
    }

    if (user.hotelId) {
      const tablesRes = await actions.fetchTables(user.hotelId as string);
      if (tablesRes.ok) data.tables = tablesRes.tables;

      const ordersRes = await actions.fetchOrders(user.hotelId as string);
      if (ordersRes.ok) {
        data.orders = ordersRes.orders;
        // activeOrders = non-final status
        data.activeOrders = ordersRes.orders.filter((o: any) => o.status !== 'paid' && o.status !== 'cancelled');
        data.pendingKots = ordersRes.orders.flatMap((o: any) => o.kots || []).filter((k: any) => k.status !== 'ready' && k.status !== 'served');
      }
      
      const menuRes = await actions.fetchMenuItems(user.hotelId as string);
      if (menuRes.ok) data.menuItems = menuRes.items;

      const inventoryRes = await actions.fetchInventory(user.hotelId as string);
      if (inventoryRes.ok) data.ingredients = inventoryRes.items;

      const bookingsRes = await actions.fetchBookings(user.hotelId as string);
      if (bookingsRes.ok) data.bookings = bookingsRes.bookings;
    }
    
    setState(data);
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Wrapper for actions that inject userId
  const addTable = async (data: any) => {
    const res = await actions.createTable(user!.id, { ...data, hotelId: user!.hotelId });
    if (res.ok) refreshData();
    return res;
  };

  const updateTable = async (id: string, data: any) => {
     const res = await actions.updateTable(user!.id, id, data);
     if (res.ok) refreshData();
     return res;
  }

  const deleteTable = async (id: string) => {
    const res = await actions.deleteTable(user!.id, id);
    if (res.ok) refreshData();
    return res;
  }

  const addMenuItem = async (data: any) => {
    const res = await actions.createMenuItem(user!.id, { ...data, hotelId: user!.hotelId });
    if (res.ok) refreshData();
    return res;
  }

  const updateMenuItem = async (id: string, data: any) => {
    const res = await actions.updateMenuItem(user!.id, id, data);
    if (res.ok) refreshData();
    return res;
  }

  const deleteMenuItem = async (id: string) => {
    const res = await actions.deleteMenuItem(user!.id, id);
    if (res.ok) refreshData();
    return res;
  }

  const createOrder = async (data: any) => {
    const res = await actions.createOrder(user!.id, { ...data, hotelId: user!.hotelId });
    if (res.ok) refreshData();
    return res;
  };

  const updateOrderStatus = async (id: string, status: string, version: number) => {
    const res = await actions.updateOrderStatus(user!.id, id, status, version);
    if (res.ok) refreshData();
    return res;
  };

  const adjustStock = async (itemId: string, change: number, reason: string, version: number) => {
    const res = await actions.adjustStock(user!.id, itemId, change, reason, version);
    if (res.ok) refreshData();
    return res;
  };

  const createTheftReport = async (data: any) => {
    const res = await actions.createTheftReport(user!.id, { ...data, hotelId: user!.hotelId });
    if (res.ok) refreshData();
    return res;
  }

  const verifyTheftReport = async (id: string, verified: boolean) => {
     const res = await actions.verifyTheftReport(user!.id, id, verified);
     if (res.ok) refreshData();
     return res;
  }

  const processPayment = async (orderId: string, data: any) => {
    const res = await actions.processPayment(user!.id, orderId, data);
    if (res.ok) refreshData();
    return res;
  };

  const startShift = async (startingCash: number) => {
     const res = await actions.startShift(user!.id, startingCash);
     if (res.ok) refreshData();
     return res;
  }

  const endShift = async (shiftId: string, endingCash: number, notes?: string) => {
     const res = await actions.endShift(user!.id, shiftId, endingCash, notes);
     if (res.ok) refreshData();
     return res;
  }

  const createUser = async (data: any) => {
     const res = await authActions.createDbUser(user!.id, data);
     if (res.ok) refreshData();
     return res;
  }

  const deleteUser = async (id: string) => {
     const res = await authActions.deleteDbUser(user!.id, id);
     if (res.ok) refreshData();
     return res;
  }

  const toggleUserStatus = async (id: string, isActive: boolean) => {
     const res = await authActions.toggleUserStatus(user!.id, id, isActive);
     if (res.ok) refreshData();
     return res;
  }

  const createTenant = async (data: any) => {
     const res = await tenantActions.createDbTenant(user!.id, data);
     if (res.ok) refreshData();
     return res;
  }

  const updateTenant = async (id: string, data: any) => {
     const res = await tenantActions.updateDbTenant(user!.id, id, data);
     if (res.ok) refreshData();
     return res;
  }

  const deleteTenant = async (id: string) => {
     const res = await tenantActions.deleteDbTenant(user!.id, id);
     if (res.ok) refreshData();
     return res;
  }

  const createHotel = async (data: any) => {
    const res = await hotelActions.createDbHotel(user!.id, data);
    if (res.ok) refreshData();
    return res;
  }

  const value = useMemo(() => ({
    ...state,
    refreshData,
    addTable,
    updateTable,
    deleteTable,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    createOrder,
    updateOrderStatus,
    adjustStock,
    createTheftReport,
    verifyTheftReport,
    processPayment,
    startShift,
    endShift,
    createUser,
    deleteUser,
    toggleUserStatus,
    createTenant,
    updateTenant,
    deleteTenant,
    createHotel
  }), [state, refreshData, user]);

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
