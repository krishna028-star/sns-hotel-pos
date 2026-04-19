// Centralized mock data for SNS Hotels POS
// Seed data for all roles — kept realistic for demo / offline use

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

// ─── Tables ────────────────────────────────────────────────────────────────────
export const TABLES = [
  // Ground Floor
  { id: 1, number: 'G1', floor: 'Ground', capacity: 4, status: 'occupied' },
  { id: 2, number: 'G2', floor: 'Ground', capacity: 4, status: 'free' },
  { id: 3, number: 'G3', floor: 'Ground', capacity: 6, status: 'occupied' },
  { id: 4, number: 'G4', floor: 'Ground', capacity: 2, status: 'reserved' },
  { id: 5, number: 'G5', floor: 'Ground', capacity: 4, status: 'free' },
  { id: 6, number: 'G6', floor: 'Ground', capacity: 8, status: 'free' },
  // 1st Floor
  { id: 7,  number: '1F1', floor: '1st Floor', capacity: 4, status: 'occupied' },
  { id: 8,  number: '1F2', floor: '1st Floor', capacity: 4, status: 'free' },
  { id: 9,  number: '1F3', floor: '1st Floor', capacity: 6, status: 'reserved' },
  { id: 10, number: '1F4', floor: '1st Floor', capacity: 4, status: 'free' },
  // Terrace
  { id: 11, number: 'T1', floor: 'Terrace', capacity: 4, status: 'occupied' },
  { id: 12, number: 'T2', floor: 'Terrace', capacity: 2, status: 'free' },
  { id: 13, number: 'T3', floor: 'Terrace', capacity: 4, status: 'free' },
  { id: 14, number: 'T4', floor: 'Terrace', capacity: 6, status: 'free' },
  { id: 15, number: 'T5', floor: 'Terrace', capacity: 4, status: 'reserved' },
];

// ─── Menu Items ─────────────────────────────────────────────────────────────────
export const MENU_CATEGORIES = ['All', 'Starters', 'Main Course', 'Breads', 'Beverages', 'Desserts', 'Sides'];

export const MENU_ITEMS = [
  { id: 1,  name: 'Chicken Tikka',       category: 'Starters',     price: 280, available: true,  image: '🍗' },
  { id: 2,  name: 'Paneer Tikka',        category: 'Starters',     price: 240, available: true,  image: '🧀' },
  { id: 3,  name: 'Veg Spring Rolls',    category: 'Starters',     price: 160, available: true,  image: '🥢' },
  { id: 4,  name: 'Butter Chicken',      category: 'Main Course',  price: 320, available: true,  image: '🍛' },
  { id: 5,  name: 'Dal Makhani',         category: 'Main Course',  price: 220, available: true,  image: '🥘' },
  { id: 6,  name: 'Palak Paneer',        category: 'Main Course',  price: 240, available: true,  image: '🌿' },
  { id: 7,  name: 'Chicken Biryani',     category: 'Main Course',  price: 360, available: true,  image: '🍚' },
  { id: 8,  name: 'Fish Curry',          category: 'Main Course',  price: 380, available: false, image: '🐟' },
  { id: 9,  name: 'Naan',               category: 'Breads',       price: 60,  available: true,  image: '🫓' },
  { id: 10, name: 'Garlic Naan',         category: 'Breads',       price: 80,  available: true,  image: '🫓' },
  { id: 11, name: 'Tandoori Roti',       category: 'Breads',       price: 40,  available: true,  image: '🫓' },
  { id: 12, name: 'Mango Lassi',        category: 'Beverages',    price: 120, available: true,  image: '🥤' },
  { id: 13, name: 'Fresh Lime Soda',     category: 'Beverages',    price: 80,  available: true,  image: '🍋' },
  { id: 14, name: 'Masala Chai',        category: 'Beverages',    price: 60,  available: true,  image: '☕' },
  { id: 15, name: 'Cold Coffee',        category: 'Beverages',    price: 140, available: true,  image: '🧋' },
  { id: 16, name: 'Gulab Jamun',        category: 'Desserts',     price: 120, available: true,  image: '🍮' },
  { id: 17, name: 'Ice Cream',          category: 'Desserts',     price: 100, available: true,  image: '🍨' },
  { id: 18, name: 'Raita',             category: 'Sides',        price: 80,  available: true,  image: '🥣' },
  { id: 19, name: 'Papad',             category: 'Sides',        price: 40,  available: true,  image: '🥙' },
  { id: 20, name: 'Mixed Pickle',       category: 'Sides',        price: 50,  available: true,  image: '🫙' },
];

// ─── Active Orders ──────────────────────────────────────────────────────────────
export const ACTIVE_ORDERS = [
  {
    id: 'ORD-101', tableNum: 1, worker: 'Vijay Kumar', status: 'cooking',
    items: [
      { name: 'Butter Chicken', qty: 2, price: 320 },
      { name: 'Naan', qty: 4, price: 60 },
      { name: 'Mango Lassi', qty: 2, price: 120 },
    ],
    total: 1120, time: '7:45 PM'
  },
  {
    id: 'ORD-102', tableNum: 3, worker: 'Rahul Singh', status: 'ready',
    items: [
      { name: 'Chicken Tikka', qty: 1, price: 280 },
      { name: 'Garlic Naan', qty: 2, price: 80 },
      { name: 'Cold Coffee', qty: 2, price: 140 },
    ],
    total: 720, time: '7:30 PM'
  },
  {
    id: 'ORD-103', tableNum: 7, worker: 'Priya Devi', status: 'kot_sent',
    items: [
      { name: 'Paneer Tikka', qty: 2, price: 240 },
      { name: 'Dal Makhani', qty: 1, price: 220 },
      { name: 'Naan', qty: 3, price: 60 },
    ],
    total: 940, time: '8:00 PM'
  },
  {
    id: 'ORD-104', tableNum: 11, worker: 'Vijay Kumar', status: 'bill_requested',
    items: [
      { name: 'Chicken Biryani', qty: 2, price: 360 },
      { name: 'Raita', qty: 2, price: 80 },
      { name: 'Gulab Jamun', qty: 2, price: 120 },
    ],
    total: 1120, time: '7:15 PM'
  },
];

// ─── Pending KOTs ───────────────────────────────────────────────────────────────
export const PENDING_KOTS = [
  {
    id: 'KOT-201', tableNum: 3, orderId: 'ORD-103',
    time: '8:02 PM', elapsed: '3 min',
    status: 'pending' as const,
    items: [
      { name: 'Paneer Tikka', qty: 2 },
      { name: 'Dal Makhani', qty: 1, note: 'Less spicy please' },
      { name: 'Naan', qty: 3 },
    ]
  },
  {
    id: 'KOT-202', tableNum: 7, orderId: 'ORD-105',
    time: '8:10 PM', elapsed: '1 min',
    status: 'pending' as const,
    items: [
      { name: 'Butter Chicken', qty: 1 },
      { name: 'Garlic Naan', qty: 2 },
      { name: 'Mango Lassi', qty: 1 },
    ]
  },
];

// ─── Pending Payments ───────────────────────────────────────────────────────────
export const PENDING_PAYMENTS = [
  { id: 1, orderId: 'ORD-104', tableNum: 11, customerName: 'Mr. Sharma', amount: 1120, method: 'cash', time: '7:15 PM' },
  { id: 2, orderId: 'ORD-106', tableNum: 9,  customerName: 'Ms. Priya',  amount: 840,  method: 'app',  time: '8:20 PM' },
];

// ─── Bookings ───────────────────────────────────────────────────────────────────
export const BOOKINGS = [
  { id: 'BKG-001', customerName: 'Ramesh Kumar',  tableNum: 'T3', date: '2025-04-19', time: '7:30 PM', guests: 4, status: 'confirmed', preOrder: true },
  { id: 'BKG-002', customerName: 'Anita Sharma',  tableNum: 'G4', date: '2025-04-19', time: '8:00 PM', guests: 2, status: 'confirmed', preOrder: false },
  { id: 'BKG-003', customerName: 'Vijay Malhotra', tableNum: '1F3', date: '2025-04-20', time: '1:00 PM', guests: 6, status: 'pending',   preOrder: false },
];

// ─── Ingredients / Stock ────────────────────────────────────────────────────────
export const INGREDIENTS = [
  { id: 1,  name: 'Chicken',        category: 'Meat',      stock: 8.5,  unit: 'kg',  reorder: 10,  unitCost: 220, status: 'critical' },
  { id: 2,  name: 'Paneer',         category: 'Dairy',     stock: 5.2,  unit: 'kg',  reorder: 4,   unitCost: 300, status: 'ok' },
  { id: 3,  name: 'Milk',           category: 'Dairy',     stock: 3.5,  unit: 'ltr', reorder: 5,   unitCost: 60,  status: 'critical' },
  { id: 4,  name: 'Butter',         category: 'Dairy',     stock: 1.8,  unit: 'kg',  reorder: 2,   unitCost: 450, status: 'critical' },
  { id: 5,  name: 'Tomatoes',       category: 'Vegetables', stock: 12,   unit: 'kg',  reorder: 5,   unitCost: 40,  status: 'ok' },
  { id: 6,  name: 'Onions',         category: 'Vegetables', stock: 15,   unit: 'kg',  reorder: 8,   unitCost: 30,  status: 'ok' },
  { id: 7,  name: 'Basmati Rice',   category: 'Grains',    stock: 18,   unit: 'kg',  reorder: 10,  unitCost: 95,  status: 'ok' },
  { id: 8,  name: 'Refined Oil',    category: 'Oils',      stock: 4.5,  unit: 'ltr', reorder: 5,   unitCost: 140, status: 'low' },
  { id: 9,  name: 'Garam Masala',   category: 'Spices',    stock: 0.8,  unit: 'kg',  reorder: 1,   unitCost: 600, status: 'low' },
  { id: 10, name: 'Flour (Maida)',  category: 'Grains',    stock: 22,   unit: 'kg',  reorder: 10,  unitCost: 45,  status: 'ok' },
];

// ─── Purchase Orders ─────────────────────────────────────────────────────────────
export const PURCHASE_ORDERS = [
  { id: 'PO-301', supplier: 'Fresh Foods Co.', items: 3, amount: 4500,  status: 'pending_approval', date: '2025-04-18', notes: 'Urgent — chicken stock critical' },
  { id: 'PO-302', supplier: 'Dairy Direct',     items: 4, amount: 3200,  status: 'pending_approval', date: '2025-04-18', notes: 'Milk and butter restock' },
  { id: 'PO-303', supplier: 'Veggie World',     items: 6, amount: 1800,  status: 'ordered',          date: '2025-04-17', notes: 'Weekly vegetable supply' },
  { id: 'PO-304', supplier: 'Spice Garden',     items: 5, amount: 2400,  status: 'received',         date: '2025-04-15', notes: 'Monthly spice order' },
];

// ─── Theft Reports ────────────────────────────────────────────────────────────────
export const THEFT_REPORTS = [
  { id: 1, ingredient: 'Chicken', qty: 2.5,  unit: 'kg', loss: 550,  date: '2025-04-17', status: 'submitted', hotel: 'SNS Beach Resort', notes: 'Physical count showed 2.5kg less than system stock. Discovered during morning audit.' },
  { id: 2, ingredient: 'Butter',  qty: 0.5,  unit: 'kg', loss: 225,  date: '2025-04-16', status: 'verified',  hotel: 'SNS Beach Resort', notes: 'Confirmed missing from cold storage. CCTV footage reviewed.' },
];

// ─── Hotels ───────────────────────────────────────────────────────────────────────
export const HOTELS = [
  { id: 'h1', name: 'SNS Beach Resort',  manager: 'Ramesh Kumar',  tables: 15, staff: 12, revenue: 142000 },
  { id: 'h2', name: 'SNS City Central',  manager: 'Sunita Sharma', tables: 20, staff: 18, revenue: 187000 },
  { id: 'h3', name: 'SNS Hill Station',  manager: 'Arjun Mehta',   tables: 10, staff: 8,  revenue: 98000  },
];

// ─── Tenants ──────────────────────────────────────────────────────────────────────
export const TENANTS = [
  { id: 't1', name: 'SNS Hotels Group', domain: 'sns-hotels.com',    hotels: 3, franchises: 2, staff: 38, status: 'active',  plan: 'enterprise', created: '2023-01-01' },
  { id: 't2', name: 'Royal Hospitality', domain: 'royal-hotels.com', hotels: 2, franchises: 1, staff: 24, status: 'active',  plan: 'professional', created: '2023-06-15' },
  { id: 't3', name: 'Heritage Stays',    domain: 'heritage.com',     hotels: 1, franchises: 1, staff: 10, status: 'trial',   plan: 'basic',        created: '2024-01-10' },
];

// ─── Franchises ────────────────────────────────────────────────────────────────────
export const FRANCHISES = [
  { id: 'f1', name: 'North Region', hotels: 2, manager: 'Deepak Verma', revenue: 280000, status: 'active' },
  { id: 'f2', name: 'South Region', hotels: 1, manager: 'Lakshmi Iyer', revenue: 142000, status: 'active' },
];

// ─── Staff ────────────────────────────────────────────────────────────────────────
export const STAFF = [
  { id: 's1', name: 'Vijay Kumar',  role: 'worker',             hotel: 'SNS Beach Resort', salary: 18000, joiningDate: '2023-03-01' },
  { id: 's2', name: 'Anita Rao',   role: 'cashier',            hotel: 'SNS Beach Resort', salary: 22000, joiningDate: '2023-01-15' },
  { id: 's3', name: 'Chef Ravi',   role: 'chef',               hotel: 'SNS Beach Resort', salary: 35000, joiningDate: '2022-11-01' },
  { id: 's4', name: 'Priya Singh', role: 'inventory_manager',  hotel: 'SNS Beach Resort', salary: 25000, joiningDate: '2023-05-10' },
];

// ─── Bookings ─────────────────────────────────────────────────────────────────────
// (already defined above)

// ─── Sales / Analytics ─────────────────────────────────────────────────────────────
export const SALES_TREND = [
  { date: 'Mon', revenue: 87000  },
  { date: 'Tue', revenue: 102000 },
  { date: 'Wed', revenue: 94000  },
  { date: 'Thu', revenue: 118000 },
  { date: 'Fri', revenue: 135000 },
  { date: 'Sat', revenue: 162000 },
  { date: 'Sun', revenue: 142000 },
];

export const PAYMENT_BREAKDOWN = [
  { method: 'Cash',   value: 38 },
  { method: 'UPI',    value: 32 },
  { method: 'Card',   value: 18 },
  { method: 'Wallet', value: 12 },
];

export const TOP_ITEMS = [
  { name: 'Butter Chicken',   qty: 142, revenue: 45440 },
  { name: 'Chicken Biryani',  qty: 118, revenue: 42480 },
  { name: 'Paneer Tikka',     qty: 96,  revenue: 23040 },
  { name: 'Naan',             qty: 380, revenue: 22800 },
  { name: 'Mango Lassi',      qty: 164, revenue: 19680 },
];

export const HOURLY_SALES = [
  { hour: '11am', revenue: 8000  },
  { hour: '12pm', revenue: 22000 },
  { hour: '1pm',  revenue: 31000 },
  { hour: '2pm',  revenue: 18000 },
  { hour: '3pm',  revenue: 9000  },
  { hour: '4pm',  revenue: 6000  },
  { hour: '5pm',  revenue: 11000 },
  { hour: '6pm',  revenue: 24000 },
  { hour: '7pm',  revenue: 42000 },
  { hour: '8pm',  revenue: 48000 },
  { hour: '9pm',  revenue: 35000 },
  { hour: '10pm', revenue: 18000 },
];

export const FRANCHISE_SALES = [
  { name: 'North Region', revenue: 280000, orders: 1240, hotels: 2 },
  { name: 'South Region', revenue: 142000, orders: 680,  hotels: 1 },
];

// ─── Audit Logs ─────────────────────────────────────────────────────────────────
export const AUDIT_LOGS = [
  { id: 'a1', timestamp: new Date().toISOString(), user: 'System Admin', role: 'main_admin', action: 'CREATE', resource: 'User', resourceId: 'u-001', tenant: 'SNS Hotels Group', hotel: 'N/A', ip: '192.168.1.1', severity: 'info' },
  { id: 'a2', timestamp: new Date(Date.now() - 3600000).toISOString(), user: 'Laxmi Admin', role: 'main_admin', action: 'UPDATE', resource: 'Tenant', resourceId: 't-001', tenant: 'SNS Hotels Group', hotel: 'N/A', ip: '192.168.1.1', severity: 'info' },
  { id: 'a3', timestamp: new Date(Date.now() - 7200000).toISOString(), user: 'Chef Ravi', role: 'chef', action: 'UPDATE', resource: 'KOT', resourceId: 'k-201', tenant: 'SNS Hotels Group', hotel: 'SNS Beach Resort', ip: '10.0.0.42', severity: 'info' },
];

// ─── Forecast ─────────────────────────────────────────────────────────────────────
export const FORECAST_DATA = [
  { date: 'Mon', actual: 87000,  forecast: 91000  },
  { date: 'Tue', actual: 102000, forecast: 105000 },
  { date: 'Wed', actual: 94000,  forecast: 98000  },
  { date: 'Thu', actual: 118000, forecast: 112000 },
  { date: 'Fri', actual: 135000, forecast: 130000 },
  { date: 'Sat', actual: 162000, forecast: 155000 },
  { date: 'Sun', actual: null,   forecast: 148000 },
];

export const CHAIN_POLICIES = [
  { id: 'p1', name: 'Discount Limit', value: '10%', scope: 'All Hotels', status: 'active' },
  { id: 'p2', name: 'PO Approval Threshold', value: '₹5,000', scope: 'All Hotels', status: 'active' },
  { id: 'p3', name: 'Theft Report Escalation', value: '24 hours', scope: 'All Hotels', status: 'active' },
];

// ─── Utilities ────────────────────────────────────────────────────────────────────
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
