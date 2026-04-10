# User Guide — SNS Hotels POS

## How to Access the System

Open the app at: `https://pos.snshotels.com`

Use the **Quick Demo** button to explore without credentials, or sign in with your assigned credentials.

---

## 👑 Main Admin

**Purpose:** Full system oversight across all tenants.

| Feature | How to use |
|---------|-----------|
| Dashboard | Overview of all tenants, revenue, alerts |
| Tenant Management | `/admin/tenants` — Create, suspend, or delete tenant accounts |
| User Management | `/admin/users` — Search, create, edit all users across tenants |
| Audit Logs | `/admin/audit` — Full audit trail of every action |
| Sales View | `/admin/sales` — Global revenue charts |
| Inventory | `/admin/inventory` — Cross-tenant stock overview |
| Anticipate | `/admin/anticipate` — Revenue forecast |
| System Health | `/admin/health` — Server status |
| Global Config | `/admin/config` — Payment gateways, tax rates |

**Creating a new Main Admin:**
Only an existing Main Admin can create another Main Admin via User Management.

---

## 🏢 Main Client (Tenant Owner)

**Purpose:** Manage your entire hotel chain.

| Feature | How to use |
|---------|-----------|
| Dashboard | Chain-wide KPIs |
| Franchises | `/client/franchises` — View and manage franchise regions |
| Sales | `/client/sales` — Revenue by franchise and hotel |
| Theft Reports | `/client/theft` — View all theft reports in your chain |
| Chain Policies | `/client/policies` — Set max discount %, tax rates, service charges |
| Audit Logs | `/client/audit` — Audit trail for your chain |

---

## 🏩 Franchise Head

**Purpose:** Manage hotels in your region.

| Feature | How to use |
|---------|-----------|
| Dashboard | Franchise-level KPIs |
| Hotels | `/franchise/hotels` — View all hotels in your franchise |
| PO Approvals | `/franchise/approvals` — Approve/reject purchase orders from hotels |
| Theft Review | `/franchise/theft` — Review theft reports from Hotel Managers |
| Sales | `/franchise/sales` — Revenue charts by hotel |

---

## 🏨 Hotel Manager

**Purpose:** Day-to-day hotel operations.

| Feature | How to use |
|---------|-----------|
| Dashboard | Live orders, staff on duty, daily revenue |
| Live Orders | `/manager/live-orders` — Monitor all active orders in real time |
| Staff | `/manager/staff` — Add/edit staff, view login times |
| Menu | `/manager/menu` — Add/edit/disable menu items |
| Tables & QR | `/manager/tables` — Floor plan, generate QR codes for tables |
| Discount Approvals | `/manager/discounts` — Approve or reject discount/void requests from cashiers |
| Theft Reports | `/manager/theft` — Review and verify theft reports from Inventory Manager |
| Sales Report | `/manager/sales` — Daily/weekly revenue reports |

**Approving a discount:**
1. Go to **Discount Approvals**
2. See pending requests from cashiers
3. Click **Approve** or **Reject**
4. The cashier is notified in real time

---

## 📦 Inventory Manager

**Purpose:** Track stock, file theft reports, raise purchase orders.

| Feature | How to use |
|---------|-----------|
| Dashboard | Stock alerts, critical items |
| Stock Overview | `/inventory/stock` — View all ingredients and levels |
| Stock Movement | `/inventory/movements` — Log stock in/out |
| Low Stock Alerts | `/inventory/alerts` — Items below reorder level |
| Purchase Orders | `/inventory/purchase-orders` — Create and track POs |
| Suppliers | `/inventory/suppliers` — Manage supplier list |
| **File Theft Report** | `/inventory/theft` — Log stolen/missing items with evidence |

**Filing a theft report:**
1. Go to **Theft Reports**
2. Click **File New Report**
3. Select ingredient, quantity, estimated loss, add notes/photos
4. Submit — Hotel Manager is notified immediately

---

## 💰 Cashier

**Purpose:** Accept payments from customers.

| Feature | How to use |
|---------|-----------|
| Dashboard | Pending payments, shift summary |
| **Payment Alarms** | `/cashier/alarms` 🔔 — PRIORITY: When a customer pays via app, an alarm sounds. Accept or reject the payment. |
| Pending Payments | `/cashier/pending` — All unpaid bills |
| Cash Payment | Click **Accept Cash** → Enter cash received → App calculates change |
| App Payment | Go to **Alarms** → Review → Accept |
| Payment History | `/cashier/history` — Past transactions |
| Shift Management | `/cashier/shift` — Start/end shift |
| Reconciliation | `/cashier/reconcile` — End-of-shift cash count |

**Requesting a discount/void:**
1. Find the order in Pending Payments
2. Click **Request Discount**
3. Enter reason → Hotel Manager is notified
4. Wait for approval (you will be notified)

---

## 👨‍🍳 Chef / Kitchen Staff

**Purpose:** Receive and process Kitchen Orders (KOTs).

| Feature | How to use |
|---------|-----------|
| **Kitchen Display** | `/chef/dashboard` 🔥 — MAIN SCREEN: Kanban board of all KOTs |
| Pending KOTs | New orders appear here with alarm sound — Click **Start Cooking** |
| Active KOTs | Orders being prepared — Click **Mark Ready** when done |
| Ready | Waiter is notified to collect and serve |
| History | `/chef/history` — Past orders |

**KOT Workflow:**
1. Order comes in → appears in **Pending** column with 🔔 alarm
2. Click **🔥 Start Cooking** → moves to Cooking
3. Click **✅ Mark Ready** → moves to Ready, waiter notified

---

## 👤 Waiter / Worker

**Purpose:** Take table orders and serve food.

| Feature | How to use |
|---------|-----------|
| **Dashboard / Floor Plan** | `/worker/dashboard` — Select a table, take an order |
| Take Order | Click a free table → Select menu items → Review → **Send KOT** |
| Active Orders | `/worker/orders` — Track order status per table |
| Bookings | `/worker/bookings` — See today's table reservations |
| Tables | `/worker/tables` — Full floor plan view |

**Order flow:**
1. Customer sits → Click their table on floor plan
2. Browse menu categories → Add items
3. Review order → **Send KOT to Kitchen**
4. KOT goes to Chef → When ready, collect and serve

---

## 👥 Customer

**Purpose:** Book tables and order food.

| Feature | How to use |
|---------|-----------|
| Home / Browse Menu | `/customer/dashboard` — See menu and add to order |
| Book a Table | `/customer/book` — Reserve a table with date/time/guests |
| My Bookings | `/customer/bookings` — View/cancel reservations |
| My Orders | `/customer/orders` — Track live order status |
| Pay via App | In My Orders → Click **Pay Now** → UPI/Card payment |
| Profile | `/customer/profile` — Name, phone, dietary preferences |
| Payment History | `/customer/payments` — Past bills and receipts |

**Pre-ordering with a booking:**
1. Book a Table → Enable **Pre-Order** during booking
2. Browse menu → Add items → Confirm pre-order
3. Items will be ready when you arrive

---

## Notification & Alarm System

| Event | Who is notified | How |
|-------|----------------|-----|
| New KOT (order sent) | Chef | 🔔 Alarm on Kitchen Display |
| KOT ready | Waiter | Badge on their screen |
| Customer app payment | Cashier | 🔔 Alarm on Cashier dashboard |
| New theft report | Hotel Manager | Real-time notification |
| New user created | Next higher role | Email + In-app notification |
| Discount approved | Cashier | Real-time notification |
| Purchase order approved | Inventory Manager | Real-time notification |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Logged out unexpectedly | Session expired — log in again |
| Alarms not sounding | Allow browser audio — click anywhere on page first |
| PWA not installing | Use Chrome or Edge; site must be on https |
| Offline after network drop | App shows cached data; reconnects automatically |
| Order not showing in kitchen | Check if worker actually clicked "Send KOT" |
