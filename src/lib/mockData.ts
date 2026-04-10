// Centralized mock data for SNS Hotels POS
// Initial empty state for production reset

export const DEMO_USERS = [
  { id: 0, name: 'Laxmi Admin', email: 'krishnalaxmi@gmail.com', password: 'madmin14328', role: 'main_admin', tenant: 'SNS Hotels Group', hotel: null, avatar: 'LA' },
  { id: 1, name: 'System Admin', email: 'admin@sns.com', password: 'admin123', role: 'main_admin', tenant: 'SNS Hotels Group', hotel: null, avatar: 'SA' },
];

export const ROLE_HOMES: Record<string, string> = {
  main_admin: '/admin/dashboard',
  main_client: '/client/dashboard',
  franchise_head: '/franchise/dashboard',
  hotel_manager: '/manager/dashboard',
  inventory_manager: '/inventory/dashboard',
  cashier: '/cashier/dashboard',
  chef: '/chef/dashboard',
  worker: '/worker/dashboard',
  customer: '/customer/dashboard',
};

export const ROLE_LABELS: Record<string, string> = {
  main_admin: 'Main Admin',
  main_client: 'Main Client',
  franchise_head: 'Franchise Head',
  hotel_manager: 'Hotel Manager',
  inventory_manager: 'Inventory Manager',
  cashier: 'Cashier',
  chef: 'Chef',
  worker: 'Waiter',
  customer: 'Customer',
};

export const ROLE_COLORS: Record<string, string> = {
  main_admin: '#9B59B6',
  main_client: '#1ABC9C',
  franchise_head: '#FF8A34',
  hotel_manager: '#2E5AFF',
  inventory_manager: '#00C48C',
  cashier: '#F39C12',
  chef: '#E74C3C',
  worker: '#3498DB',
  customer: '#95A5A6',
};

// ─── Sales Mock Data ────────────────────────────────────────
export const SALES_TREND: any[] = [];
export const PAYMENT_BREAKDOWN: any[] = [];
export const TOP_ITEMS: any[] = [];
export const HOURLY_SALES: any[] = [];
export const FRANCHISE_SALES: any[] = [];

// ─── Inventory Mock Data ─────────────────────────────────────
export const INGREDIENTS: any[] = [];
export const PURCHASE_ORDERS: any[] = [];
export const THEFT_REPORTS: any[] = [];

// ─── Orders / KOT Mock Data ──────────────────────────────────
export const MENU_ITEMS: any[] = [];
export const MENU_CATEGORIES = ['All', 'Starters', 'Main Course', 'Breads', 'Beverages', 'Desserts', 'Sides'];

export const TABLES: any[] = [];
export const ACTIVE_ORDERS: any[] = [];
export const PENDING_KOTS: any[] = [];
export const PENDING_PAYMENTS: any[] = [];

// ─── Tenants / Franchises ────────────────────────────────────
export const TENANTS: any[] = [];
export const FRANCHISES: any[] = [];
export const HOTELS: any[] = [];

// ─── Staff ──────────────────────────────────────────────────
export const STAFF: any[] = [];

// ─── Bookings ───────────────────────────────────────────────
export const BOOKINGS: any[] = [];

// ─── Audit Logs ─────────────────────────────────────────────
export const AUDIT_LOGS: any[] = [];

// ─── Forecast data ───────────────────────────────────────────
export const FORECAST_DATA: any[] = [];

export const CHAIN_POLICIES: any[] = [];

export const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch(e) {
    return dateStr;
  }
};
