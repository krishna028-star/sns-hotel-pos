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
  franchises: any[];
  tables: any[];
  users: any[];
  menuItems: any[];
  ingredients: any[];
  activeOrders: any[];
  orders: any[];
  bookings: any[];
  theftReports: any[];
  purchaseOrders: any[];
  suppliers: any[];
  auditLogs: any[];
  metrics: any;
  pendingKots: any[];
  policies: any[];

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
  updateKOTStatus: (id: string, status: string) => Promise<any>;

  // Inventory
  adjustStock: (itemId: string, change: number, reason: string, version: number) => Promise<any>;
  createTheftReport: (data: any) => Promise<any>;
  verifyTheftReport: (id: string, verified: boolean) => Promise<any>;
  createInventoryItem: (data: any) => Promise<any>;
  updateInventoryItem: (id: string, data: any) => Promise<any>;
  deleteInventoryItem: (id: string) => Promise<any>;

  // Purchase Orders
  createPurchaseOrder: (data: any) => Promise<any>;
  updatePurchaseOrderStatus: (id: string, status: string) => Promise<any>;

  // Suppliers
  createSupplier: (data: any) => Promise<any>;

  // Bookings
  createBooking: (data: any) => Promise<any>;
  updateBookingStatus: (id: string, status: string) => Promise<any>;

  // Payments & Shifts
  processPayment: (orderId: string, data: any) => Promise<any>;
  startShift: (startingCash: number) => Promise<any>;
  endShift: (shiftId: string, endingCash: number, notes?: string) => Promise<any>;

  // Users & Admin
  createUser: (data: any) => Promise<any>;
  updateUser: (id: string, data: any) => Promise<any>;
  deleteUser: (id: string) => Promise<any>;
  toggleUserStatus: (id: string, isActive: boolean) => Promise<any>;

  // Tenants
  createTenant: (data: any) => Promise<any>;
  updateTenant: (id: string, data: any) => Promise<any>;
  deleteTenant: (id: string) => Promise<any>;

  // Hotels
  createHotel: (data: any) => Promise<any>;
  updateHotel: (id: string, data: any) => Promise<any>;
  deleteHotel: (id: string) => Promise<any>;

  // Franchises
  createFranchise: (data: any) => Promise<any>;
  updateFranchise: (id: string, data: any) => Promise<any>;
  deleteFranchise: (id: string) => Promise<any>;
}

const DataContext = createContext<DataCtx | null>(null);

const INITIAL_STATE = {
  tenants: [],
  hotels: [],
  franchises: [],
  tables: [],
  users: [],
  ingredients: [],
  menuItems: [],
  activeOrders: [],
  orders: [],
  pendingKots: [],
  bookings: [],
  theftReports: [],
  purchaseOrders: [],
  suppliers: [],
  auditLogs: [],
  policies: [],
  metrics: { tenants: 0, users: 0, orders: 0, totalRevenue: 0 }
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState(INITIAL_STATE);

  const refreshData = useCallback(async () => {
    if (!user) return;

    // FIX: Use a clean object, not a spread of stale state (prevents race conditions)
    const data: any = { ...INITIAL_STATE };

    try {
      if (user.role === 'main_admin' || user.role === 'main_client') {
        const [tenantsRes, hotelsRes, usersRes, logsRes, metricsRes, suppliersRes, franchisesRes] = await Promise.all([
          tenantActions.fetchTenants(),
          hotelActions.fetchHotels(),
          authActions.fetchUsers(),
          actions.fetchAuditLogs(50),
          actions.fetchGlobalMetrics(),
          actions.fetchSuppliers(),
          actions.fetchFranchises()
        ]);

        if (tenantsRes.ok) data.tenants = tenantsRes.tenants;
        if (hotelsRes.ok) data.hotels = hotelsRes.hotels;
        if (usersRes.ok) data.users = usersRes.users;
        if (logsRes.ok) data.auditLogs = logsRes.logs;
        if (metricsRes.ok) data.metrics = metricsRes.metrics;
        if (suppliersRes.ok) data.suppliers = suppliersRes.suppliers;
        if (franchisesRes.ok) data.franchises = franchisesRes.franchises;
      }

      if (user.role === 'franchise_head' || user.role === 'main_client') {
        const [hotelsRes, franchisesRes] = await Promise.all([
          hotelActions.fetchHotels(),
          actions.fetchFranchises()
        ]);
        if (hotelsRes.ok) data.hotels = hotelsRes.hotels;
        if (franchisesRes.ok) data.franchises = franchisesRes.franchises;
      }

      if (user.hotelId) {
        const [tablesRes, ordersRes, menuRes, inventoryRes, bookingsRes, theftRes, poRes] = await Promise.all([
          actions.fetchTables(user.hotelId),
          actions.fetchOrders(user.hotelId),
          actions.fetchMenuItems(user.hotelId),
          actions.fetchInventory(user.hotelId),
          actions.fetchBookings(user.hotelId),
          actions.fetchTheftReports(user.hotelId),
          actions.fetchPurchaseOrders(user.hotelId)
        ]);

        if (tablesRes.ok) data.tables = tablesRes.tables;

        if (ordersRes.ok) {
          const fetchedOrders = ordersRes.orders || [];
          data.orders = fetchedOrders;
          data.activeOrders = fetchedOrders.filter(
            (o: any) => o.status !== 'paid' && o.status !== 'cancelled'
          );
          // BUG-02 FIX: Parse itemsJson and compute display fields for KOTs
          data.pendingKots = fetchedOrders
            .flatMap((o: any) => (o.kots || []).map((k: any) => {
              let items: { name: string; qty: number; note: string }[] = [];
              try {
                const raw = JSON.parse(k.itemsJson || '[]');
                items = raw.map((i: any) => ({
                  name: i.name || '',
                  qty: Number(i.quantity ?? i.qty ?? 1),
                  note: i.notes || i.note || ''
                }));
              } catch {
                items = [];
              }
              const createdAt = k.createdAt ? new Date(k.createdAt) : new Date();
              const elapsedMs = Date.now() - createdAt.getTime();
              const elapsedMin = Math.floor(elapsedMs / 60000);
              return {
                ...k,
                order: o,
                tableNum: o.table?.number ?? '?',
                time: createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                elapsed: elapsedMin < 1 ? 'just now' : `${elapsedMin} min`,
                items
              };
            }))
            .filter((k: any) => k.status === 'pending' || k.status === 'cooking');
        }

        if (menuRes.ok) data.menuItems = menuRes.items;
        if (inventoryRes.ok) data.ingredients = inventoryRes.items;
        if (bookingsRes.ok) data.bookings = bookingsRes.bookings;
        if (theftRes.ok) data.theftReports = theftRes.reports;
        if (poRes.ok) data.purchaseOrders = poRes.purchaseOrders;
      }

      setState(data);
    } catch (err) {
      console.error('[DataContext] refreshData error:', err);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ── Wrapper helpers (all wrapped in useCallback for stable references) ─────

  const addTable = useCallback(async (data: any) => {
    const res = await actions.createTable(user!.id, { ...data, hotelId: user!.hotelId! });
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updateTable = useCallback(async (id: string, data: any) => {
    const res = await actions.updateTable(user!.id, id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const deleteTable = useCallback(async (id: string) => {
    const res = await actions.deleteTable(user!.id, id);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const addMenuItem = useCallback(async (data: any) => {
    const res = await actions.createMenuItem(user!.id, { ...data, hotelId: user!.hotelId! });
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updateMenuItem = useCallback(async (id: string, data: any) => {
    const res = await actions.updateMenuItem(user!.id, id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const deleteMenuItem = useCallback(async (id: string) => {
    const res = await actions.deleteMenuItem(user!.id, id);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const createOrder = useCallback(async (data: any) => {
    const res = await actions.createOrder(user!.id, { ...data, hotelId: user!.hotelId! });
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updateOrderStatus = useCallback(async (id: string, status: string, version: number) => {
    const res = await actions.updateOrderStatus(user!.id, id, status, version);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updateKOTStatus = useCallback(async (id: string, status: string) => {
    const res = await actions.updateKOTStatus(user!.id, id, status);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const adjustStock = useCallback(async (itemId: string, change: number, reason: string, version: number) => {
    const res = await actions.adjustStock(user!.id, itemId, change, reason, version);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const createTheftReport = useCallback(async (data: any) => {
    const res = await actions.createTheftReport(user!.id, {
      itemId: data.itemId,
      quantity: data.quantity,
      reason: data.reason,
      evidenceUrl: data.evidenceUrl
    });
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const verifyTheftReport = useCallback(async (id: string, verified: boolean) => {
    const res = await actions.verifyTheftReport(user!.id, id, verified);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const createInventoryItem = useCallback(async (data: any) => {
    const res = await actions.createInventoryItem(user!.id, { ...data, hotelId: user!.hotelId! });
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updateInventoryItem = useCallback(async (id: string, data: any) => {
    const res = await actions.updateInventoryItem(user!.id, id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const deleteInventoryItem = useCallback(async (id: string) => {
    const res = await actions.deleteInventoryItem(user!.id, id);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const createPurchaseOrder = useCallback(async (data: any) => {
    const res = await actions.createPurchaseOrder(user!.id, { ...data, hotelId: user!.hotelId! });
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updatePurchaseOrderStatus = useCallback(async (id: string, status: string) => {
    const res = await actions.updatePurchaseOrderStatus(user!.id, id, status);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const createSupplier = useCallback(async (data: any) => {
    const res = await actions.createSupplier(user!.id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const createBooking = useCallback(async (data: any) => {
    const res = await actions.createBooking(user!.id, { ...data, hotelId: user!.hotelId! });
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updateBookingStatus = useCallback(async (id: string, status: string) => {
    const res = await actions.updateBookingStatus(user!.id, id, status);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const processPayment = useCallback(async (orderId: string, data: any) => {
    const res = await actions.processPayment(user!.id, orderId, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const startShift = useCallback(async (startingCash: number) => {
    const res = await actions.startShift(user!.id, startingCash);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const endShift = useCallback(async (shiftId: string, endingCash: number, notes?: string) => {
    const res = await actions.endShift(user!.id, shiftId, endingCash, notes);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const createUser = useCallback(async (data: any) => {
    const res = await authActions.createDbUser(user!.id, {
      ...data,
      tenantId: data.tenantId || (user as any).tenantId,
      hotelId: data.hotelId || user!.hotelId
    });
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updateUser = useCallback(async (id: string, data: any) => {
    const res = await authActions.updateDbUser(user!.id, id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const deleteUser = useCallback(async (id: string) => {
    const res = await authActions.deleteDbUser(user!.id, id);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const toggleUserStatus = useCallback(async (id: string, isActive: boolean) => {
    const res = await authActions.toggleUserStatus(user!.id, id, isActive);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const createTenant = useCallback(async (data: any) => {
    const res = await tenantActions.createDbTenant(user!.id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updateTenant = useCallback(async (id: string, data: any) => {
    const res = await tenantActions.updateDbTenant(user!.id, id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const deleteTenant = useCallback(async (id: string) => {
    const res = await tenantActions.deleteDbTenant(user!.id, id);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const createHotel = useCallback(async (data: any) => {
    const res = await hotelActions.createDbHotel(user!.id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updateHotel = useCallback(async (id: string, data: any) => {
    const res = await hotelActions.updateDbHotel(user!.id, id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const deleteHotel = useCallback(async (id: string) => {
    const res = await hotelActions.deleteDbHotel(user!.id, id);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const createFranchise = useCallback(async (data: any) => {
    const res = await actions.createFranchise(user!.id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const updateFranchise = useCallback(async (id: string, data: any) => {
    const res = await actions.updateFranchise(user!.id, id, data);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const deleteFranchise = useCallback(async (id: string) => {
    const res = await actions.deleteFranchise(user!.id, id);
    if (res.ok) await refreshData();
    return res;
  }, [user, refreshData]);

  const value = useMemo(() => ({
    ...state,
    refreshData,
    addTable, updateTable, deleteTable,
    addMenuItem, updateMenuItem, deleteMenuItem,
    createOrder, updateOrderStatus, updateKOTStatus,
    adjustStock, createTheftReport, verifyTheftReport,
    createInventoryItem, updateInventoryItem, deleteInventoryItem,
    createPurchaseOrder, updatePurchaseOrderStatus, createSupplier,
    createBooking, updateBookingStatus,
    processPayment, startShift, endShift,
    createUser, updateUser, deleteUser, toggleUserStatus,
    createTenant, updateTenant, deleteTenant,
    createHotel, updateHotel, deleteHotel,
    createFranchise, updateFranchise, deleteFranchise,
  }), [
    state, refreshData,
    addTable, updateTable, deleteTable,
    addMenuItem, updateMenuItem, deleteMenuItem,
    createOrder, updateOrderStatus, updateKOTStatus,
    adjustStock, createTheftReport, verifyTheftReport,
    createInventoryItem, updateInventoryItem, deleteInventoryItem,
    createPurchaseOrder, updatePurchaseOrderStatus, createSupplier,
    createBooking, updateBookingStatus,
    processPayment, startShift, endShift,
    createUser, updateUser, deleteUser, toggleUserStatus,
    createTenant, updateTenant, deleteTenant,
    createHotel, updateHotel, deleteHotel,
    createFranchise, updateFranchise, deleteFranchise,
  ]);

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
