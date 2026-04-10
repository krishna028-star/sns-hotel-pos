// Centralized mock data for SNS Hotels POS

export const DEMO_USERS = [
  { id: 1, name: 'System Admin', email: 'admin@sns.com', password: 'admin123', role: 'main_admin', tenant: 'SNS Hotels Group', hotel: null, avatar: 'SA' },
  { id: 2, name: 'Ramesh Patel', email: 'client@sns.com', password: 'client123', role: 'main_client', tenant: 'SNS Grand Hotels', hotel: null, avatar: 'RP' },
  { id: 3, name: 'Priya Singh', email: 'franchise@sns.com', password: 'franchise123', role: 'franchise_head', tenant: 'SNS Grand Hotels', hotel: null, avatar: 'PS' },
  { id: 4, name: 'Anil Kumar', email: 'manager@sns.com', password: 'manager123', role: 'hotel_manager', tenant: 'SNS Grand Hotels', hotel: 'SNS Beach Resort', avatar: 'AK' },
  { id: 5, name: 'Deepa Nair', email: 'inventory@sns.com', password: 'inv123', role: 'inventory_manager', tenant: 'SNS Grand Hotels', hotel: 'SNS Beach Resort', avatar: 'DN' },
  { id: 6, name: 'Suresh Menon', email: 'cashier@sns.com', password: 'cash123', role: 'cashier', tenant: 'SNS Grand Hotels', hotel: 'SNS Beach Resort', avatar: 'SM' },
  { id: 7, name: 'Chef Rajan', email: 'chef@sns.com', password: 'chef123', role: 'chef', tenant: 'SNS Grand Hotels', hotel: 'SNS Beach Resort', avatar: 'CR' },
  { id: 8, name: 'Vijay Worker', email: 'worker@sns.com', password: 'work123', role: 'worker', tenant: 'SNS Grand Hotels', hotel: 'SNS Beach Resort', avatar: 'VW' },
  { id: 9, name: 'Customer Demo', email: 'customer@sns.com', password: 'cust123', role: 'customer', tenant: null, hotel: null, avatar: 'CD' },
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
export const SALES_TREND = [
  { date: 'Mar 25', revenue: 82000, orders: 210 },
  { date: 'Mar 26', revenue: 94500, orders: 245 },
  { date: 'Mar 27', revenue: 71000, orders: 180 },
  { date: 'Mar 28', revenue: 108000, orders: 287 },
  { date: 'Mar 29', revenue: 125000, orders: 342 },
  { date: 'Mar 30', revenue: 118000, orders: 310 },
  { date: 'Mar 31', revenue: 140000, orders: 385 },
];

export const PAYMENT_BREAKDOWN = [
  { name: 'UPI', value: 42, color: '#2E5AFF' },
  { name: 'Cash', value: 28, color: '#00C48C' },
  { name: 'Card', value: 22, color: '#FF8A34' },
  { name: 'App', value: 8, color: '#9B59B6' },
];

export const TOP_ITEMS = [
  { name: 'Butter Chicken', qty: 142, revenue: 56800 },
  { name: 'Biryani Special', qty: 118, revenue: 47200 },
  { name: 'Paneer Tikka', qty: 96, revenue: 33600 },
  { name: 'Dal Makhani', qty: 85, revenue: 25500 },
  { name: 'Naan Basket', qty: 210, revenue: 21000 },
  { name: 'Mango Lassi', qty: 178, revenue: 17800 },
];

export const HOURLY_SALES = [
  { hour: '8AM', revenue: 8000 }, { hour: '9AM', revenue: 12000 },
  { hour: '10AM', revenue: 9500 }, { hour: '11AM', revenue: 14000 },
  { hour: '12PM', revenue: 28000 }, { hour: '1PM', revenue: 35000 },
  { hour: '2PM', revenue: 24000 }, { hour: '3PM', revenue: 10000 },
  { hour: '4PM', revenue: 8500 }, { hour: '5PM', revenue: 11000 },
  { hour: '6PM', revenue: 18000 }, { hour: '7PM', revenue: 32000 },
  { hour: '8PM', revenue: 40000 }, { hour: '9PM', revenue: 38000 },
  { hour: '10PM', revenue: 15000 },
];

export const FRANCHISE_SALES = [
  { name: 'North Region', revenue: 420000, orders: 1120, hotels: 3 },
  { name: 'South Region', revenue: 380000, orders: 980, hotels: 4 },
  { name: 'East Region', revenue: 290000, orders: 780, hotels: 2 },
  { name: 'West Region', revenue: 510000, orders: 1340, hotels: 5 },
];

// ─── Inventory Mock Data ─────────────────────────────────────
export const INGREDIENTS = [
  { id: 1, name: 'Chicken', unit: 'kg', stock: 8.5, reorder: 20, category: 'Meat', unitCost: 280, status: 'critical' },
  { id: 2, name: 'Basmati Rice', unit: 'kg', stock: 45, reorder: 50, category: 'Grains', unitCost: 85, status: 'low' },
  { id: 3, name: 'Tomatoes', unit: 'kg', stock: 18, reorder: 15, category: 'Vegetables', unitCost: 40, status: 'ok' },
  { id: 4, name: 'Onions', unit: 'kg', stock: 30, reorder: 20, category: 'Vegetables', unitCost: 35, status: 'ok' },
  { id: 5, name: 'Milk', unit: 'ltr', stock: 12, reorder: 30, category: 'Dairy', unitCost: 60, status: 'critical' },
  { id: 6, name: 'Butter', unit: 'kg', stock: 4, reorder: 8, category: 'Dairy', unitCost: 480, status: 'critical' },
  { id: 7, name: 'Garam Masala', unit: 'kg', stock: 3.5, reorder: 2, category: 'Spices', unitCost: 600, status: 'ok' },
  { id: 8, name: 'Refined Oil', unit: 'ltr', stock: 22, reorder: 20, category: 'Oils', unitCost: 140, status: 'ok' },
  { id: 9, name: 'Paneer', unit: 'kg', stock: 6, reorder: 10, category: 'Dairy', unitCost: 380, status: 'low' },
  { id: 10, name: 'Mango Pulp', unit: 'kg', stock: 14, reorder: 10, category: 'Fruits', unitCost: 120, status: 'ok' },
];

export const PURCHASE_ORDERS = [
  { id: 'PO-001', supplier: 'Fresh Foods Co.', amount: 42000, status: 'pending_approval', date: '2025-03-29', items: 5 },
  { id: 'PO-002', supplier: 'Dairy Direct', amount: 18500, status: 'ordered', date: '2025-03-28', items: 3 },
  { id: 'PO-003', supplier: 'Veggie World', amount: 8200, status: 'received', date: '2025-03-27', items: 8 },
  { id: 'PO-004', supplier: 'Spice Garden', amount: 6400, status: 'draft', date: '2025-03-30', items: 4 },
  { id: 'PO-005', supplier: 'Fresh Foods Co.', amount: 31000, status: 'approved', date: '2025-03-26', items: 6 },
];

export const THEFT_REPORTS = [
  { id: 1, ingredient: 'Chicken', qty: 5, unit: 'kg', loss: 1400, date: '2025-03-28', status: 'submitted', hotel: 'SNS Beach Resort', notes: 'Missing from cold storage' },
  { id: 2, ingredient: 'Butter', qty: 2, unit: 'kg', loss: 960, date: '2025-03-27', status: 'verified', hotel: 'SNS Central', notes: 'Confirmed by camera' },
  { id: 3, ingredient: 'Mango Pulp', qty: 10, unit: 'kg', loss: 1200, date: '2025-03-25', status: 'rejected', hotel: 'SNS Beach Resort', notes: 'Adjustment error' },
];

// ─── Orders / KOT Mock Data ──────────────────────────────────
export const MENU_ITEMS = [
  { id: 1, name: 'Butter Chicken', price: 400, category: 'Main Course', available: true, image: '🍗' },
  { id: 2, name: 'Biryani Special', price: 400, category: 'Main Course', available: true, image: '🍛' },
  { id: 3, name: 'Paneer Tikka', price: 350, category: 'Starters', available: true, image: '🧀' },
  { id: 4, name: 'Dal Makhani', price: 300, category: 'Main Course', available: true, image: '🫕' },
  { id: 5, name: 'Naan', price: 60, category: 'Breads', available: true, image: '🫓' },
  { id: 6, name: 'Garlic Naan', price: 80, category: 'Breads', available: true, image: '🫓' },
  { id: 7, name: 'Mango Lassi', price: 120, category: 'Beverages', available: true, image: '🥭' },
  { id: 8, name: 'Masala Chai', price: 60, category: 'Beverages', available: true, image: '🫖' },
  { id: 9, name: 'Gulab Jamun', price: 150, category: 'Desserts', available: true, image: '🍮' },
  { id: 10, name: 'Raita', price: 80, category: 'Sides', available: true, image: '🥣' },
  { id: 11, name: 'Samosa (2pc)', price: 120, category: 'Starters', available: true, image: '🔺' },
  { id: 12, name: 'Fish Curry', price: 450, category: 'Main Course', available: false, image: '🐟' },
];

export const MENU_CATEGORIES = ['All', 'Starters', 'Main Course', 'Breads', 'Beverages', 'Desserts', 'Sides'];

export const TABLES = [
  { id: 1, number: 1, capacity: 2, status: 'free', floor: 'Ground' },
  { id: 2, number: 2, capacity: 4, status: 'occupied', floor: 'Ground', orderId: 'ORD-101' },
  { id: 3, number: 3, capacity: 4, status: 'occupied', floor: 'Ground', orderId: 'ORD-102' },
  { id: 4, number: 4, capacity: 6, status: 'reserved', floor: 'Ground', bookingId: 'BK-201' },
  { id: 5, number: 5, capacity: 2, status: 'free', floor: 'Ground' },
  { id: 6, number: 6, capacity: 4, status: 'free', floor: 'Ground' },
  { id: 7, number: 7, capacity: 6, status: 'occupied', floor: '1st Floor', orderId: 'ORD-103' },
  { id: 8, number: 8, capacity: 8, status: 'free', floor: '1st Floor' },
  { id: 9, number: 9, capacity: 4, status: 'occupied', floor: '1st Floor', orderId: 'ORD-104' },
  { id: 10, number: 10, capacity: 4, status: 'reserved', floor: '1st Floor', bookingId: 'BK-202' },
  { id: 11, number: 11, capacity: 2, status: 'free', floor: '1st Floor' },
  { id: 12, number: 12, capacity: 6, status: 'free', floor: 'Terrace' },
];

export const ACTIVE_ORDERS = [
  { id: 'ORD-101', tableNum: 2, items: [{ name: 'Butter Chicken', qty: 2, price: 400 }, { name: 'Naan', qty: 4, price: 60 }], status: 'ready', kotStatus: 'accepted', worker: 'Vijay', total: 1040 },
  { id: 'ORD-102', tableNum: 3, items: [{ name: 'Biryani Special', qty: 1, price: 400 }, { name: 'Raita', qty: 1, price: 80 }], status: 'cooking', kotStatus: 'cooking', worker: 'Vijay', total: 480 },
  { id: 'ORD-103', tableNum: 7, items: [{ name: 'Paneer Tikka', qty: 2, price: 350 }, { name: 'Garlic Naan', qty: 3, price: 80 }], status: 'kot_sent', kotStatus: 'pending', worker: 'Rahul', total: 940 },
  { id: 'ORD-104', tableNum: 9, items: [{ name: 'Dal Makhani', qty: 2, price: 300 }, { name: 'Naan', qty: 4, price: 60 }], status: 'bill_requested', kotStatus: 'served', worker: 'Vijay', total: 840 },
];

export const PENDING_KOTS = [
  { id: 'KOT-001', orderId: 'ORD-103', tableNum: 7, items: [{ name: 'Paneer Tikka', qty: 2, note: 'Extra spicy' }, { name: 'Garlic Naan', qty: 3, note: '' }], time: '7:45 PM', elapsed: '3 min' },
];

export const PENDING_PAYMENTS = [
  { id: 'PAY-001', orderId: 'ORD-104', tableNum: 9, amount: 840, method: 'app', customerName: 'Kiran M.', time: '8:12 PM', status: 'pending' },
  { id: 'PAY-002', orderId: 'ORD-102', tableNum: 3, amount: 480, method: 'cash', customerName: 'Walk-in', time: '8:05 PM', status: 'pending' },
];

// ─── Tenants / Franchises ────────────────────────────────────
export const TENANTS = [
  { id: 1, name: 'SNS Grand Hotels', domain: 'snsgrand.snshotels.com', status: 'active', plan: 'enterprise', franchises: 4, hotels: 14, created: '2024-01-10' },
  { id: 2, name: 'Royal Residency Chain', domain: 'royal.snshotels.com', status: 'active', plan: 'professional', franchises: 2, hotels: 6, created: '2024-03-22' },
  { id: 3, name: 'Budget Stay Network', domain: 'budget.snshotels.com', status: 'trial', plan: 'basic', franchises: 1, hotels: 3, created: '2025-01-05' },
  { id: 4, name: 'Luxury Escape Group', domain: 'luxury.snshotels.com', status: 'suspended', plan: 'enterprise', franchises: 3, hotels: 9, created: '2023-11-15' },
];

export const FRANCHISES = [
  { id: 1, name: 'North Region', tenantId: 1, head: 'Priya Singh', hotels: 3, revenue: 420000, status: 'active' },
  { id: 2, name: 'South Region', tenantId: 1, head: 'Ramesh Das', hotels: 4, revenue: 380000, status: 'active' },
  { id: 3, name: 'East Region', tenantId: 1, head: 'Anita Roy', hotels: 2, revenue: 290000, status: 'active' },
  { id: 4, name: 'West Region', tenantId: 1, head: 'Mohammed Khan', hotels: 5, revenue: 510000, status: 'active' },
];

export const HOTELS = [
  { id: 1, name: 'SNS Beach Resort', franchiseId: 1, manager: 'Anil Kumar', tables: 12, status: 'active', revenue: 140000 },
  { id: 2, name: 'SNS Central', franchiseId: 1, manager: 'Meera Joshi', tables: 20, status: 'active', revenue: 180000 },
  { id: 3, name: 'SNS Mountain View', franchiseId: 2, manager: 'Sanjay Rao', tables: 15, status: 'active', revenue: 125000 },
];

// ─── Staff ──────────────────────────────────────────────────
export const STAFF = [
  { id: 10, name: 'Vijay Worker', role: 'worker', hotel: 'SNS Beach Resort', status: 'active', lastLogin: '2025-03-30 08:15' },
  { id: 11, name: 'Rahul Waiter', role: 'worker', hotel: 'SNS Beach Resort', status: 'active', lastLogin: '2025-03-30 08:30' },
  { id: 12, name: 'Suresh Menon', role: 'cashier', hotel: 'SNS Beach Resort', status: 'active', lastLogin: '2025-03-30 09:00' },
  { id: 13, name: 'Chef Rajan', role: 'chef', hotel: 'SNS Beach Resort', status: 'active', lastLogin: '2025-03-30 07:45' },
  { id: 14, name: 'Chef Lakshmi', role: 'chef', hotel: 'SNS Beach Resort', status: 'active', lastLogin: '2025-03-30 07:50' },
  { id: 15, name: 'Deepa Nair', role: 'inventory_manager', hotel: 'SNS Beach Resort', status: 'active', lastLogin: '2025-03-30 09:30' },
];

// ─── Bookings ───────────────────────────────────────────────
export const BOOKINGS = [
  { id: 'BK-201', customerName: 'Kiran Mathew', tableNum: 4, date: '2025-03-30', time: '8:00 PM', guests: 4, status: 'pending', preOrder: true, expiresAt: '10:00 PM' },
  { id: 'BK-202', customerName: 'Sunita Sharma', tableNum: 10, date: '2025-03-30', time: '7:30 PM', guests: 2, status: 'confirmed', preOrder: false, expiresAt: '9:30 PM' },
  { id: 'BK-203', customerName: 'Ahmed Ali', tableNum: 6, date: '2025-03-31', time: '1:00 PM', guests: 6, status: 'pending', preOrder: false, expiresAt: '3:00 PM' },
];

// ─── Audit Logs ─────────────────────────────────────────────
export const AUDIT_LOGS = [
  { id: 1001, timestamp: '2025-03-30T20:15:22Z', user: 'System Admin', role: 'main_admin', tenant: 'SNS Grand Hotels', action: 'DELETE', resource: 'User', resourceId: 456, severity: 'critical', ip: '192.168.1.100' },
  { id: 1002, timestamp: '2025-03-30T19:45:10Z', user: 'Anil Kumar', role: 'hotel_manager', tenant: 'SNS Grand Hotels', action: 'APPROVE', resource: 'DiscountRequest', resourceId: 89, severity: 'warning', ip: '10.0.1.45' },
  { id: 1003, timestamp: '2025-03-30T19:30:05Z', user: 'Deepa Nair', role: 'inventory_manager', tenant: 'SNS Grand Hotels', action: 'FILE_THEFT', resource: 'TheftReport', resourceId: 1, severity: 'warning', ip: '10.0.1.46' },
  { id: 1004, timestamp: '2025-03-30T18:12:44Z', user: 'Chef Rajan', role: 'chef', tenant: 'SNS Grand Hotels', action: 'ACCEPT', resource: 'KOT', resourceId: 'KOT-001', severity: 'info', ip: '10.0.1.47' },
  { id: 1005, timestamp: '2025-03-30T18:00:00Z', user: 'Suresh Menon', role: 'cashier', tenant: 'SNS Grand Hotels', action: 'ACCEPT', resource: 'Payment', resourceId: 'PAY-009', severity: 'info', ip: '10.0.1.48' },
  { id: 1006, timestamp: '2025-03-30T17:30:22Z', user: 'Vijay Worker', role: 'worker', tenant: 'SNS Grand Hotels', action: 'CREATE', resource: 'Order', resourceId: 'ORD-104', severity: 'info', ip: '10.0.1.49' },
  { id: 1007, timestamp: '2025-03-30T16:45:00Z', user: 'Ramesh Patel', role: 'main_client', tenant: 'SNS Grand Hotels', action: 'UPDATE', resource: 'ChainPolicy', resourceId: 15, severity: 'warning', ip: '192.168.2.10' },
  { id: 1008, timestamp: '2025-03-30T15:20:15Z', user: 'System Admin', role: 'main_admin', tenant: 'Royal Residency Chain', action: 'CREATE', resource: 'Tenant', resourceId: 5, severity: 'info', ip: '192.168.1.100' },
];

// ─── Forecast data ───────────────────────────────────────────
export const FORECAST_DATA = [
  { date: 'Apr 1', revenue: 0, predicted: 128000 },
  { date: 'Apr 2', revenue: 0, predicted: 115000 },
  { date: 'Apr 3', revenue: 0, predicted: 142000 },
  { date: 'Apr 4', revenue: 0, predicted: 95000 },
  { date: 'Apr 5', revenue: 0, predicted: 160000 },
  { date: 'Apr 6', revenue: 0, predicted: 175000 },
  { date: 'Apr 7', revenue: 0, predicted: 155000 },
];

export const CHAIN_POLICIES = [
  { id: 1, name: 'Max Discount Allowed', value: '15%', scope: 'All Hotels', updatedBy: 'Ramesh Patel', updatedAt: '2025-03-20' },
  { id: 2, name: 'Tax Rate (GST)', value: '5%', scope: 'All Hotels', updatedBy: 'Ramesh Patel', updatedAt: '2025-03-18' },
  { id: 3, name: 'Service Charge', value: '10%', scope: 'All Hotels', updatedBy: 'System Admin', updatedAt: '2025-03-15' },
  { id: 4, name: 'Minimum Order Amount', value: '₹150', scope: 'All Hotels', updatedBy: 'Ramesh Patel', updatedAt: '2025-03-10' },
];

export const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString('en-IN')}`;

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
