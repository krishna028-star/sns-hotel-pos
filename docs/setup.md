# Setup Guide — Local Development

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | Bundled with Node |
| Git | Any | https://git-scm.com |

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/sns-hotel-pos.git
cd sns-hotel-pos/sns-hotel-pos
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` — for local development the default values work with demo mode (no real database needed since the app uses mock data):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
DEBUG=true
```

## Step 4: Start Dev Server

```bash
npm run dev
```

Visit **http://localhost:3000** — you will be redirected to `/login`.

## Step 5: Log In

Click **"Quick Demo Access"** and select any role to explore that dashboard. Or use credentials:

| Role | Email | Password |
|------|-------|----------|
| Main Admin | admin@sns.com | admin123 |
| Hotel Manager | manager@sns.com | manager123 |
| Chef | chef@sns.com | chef123 |
| Cashier | cashier@sns.com | cash123 |
| Waiter | worker@sns.com | work123 |
| Customer | customer@sns.com | cust123 |

## Step 6: Debug Mode

Set `DEBUG=true` in `.env.local` to enable verbose console logging of requests, auth events, and WebSocket messages.

## Common Issues

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

### Node version mismatch
```bash
# Install nvm and use correct version
nvm use 20
npm install
npm run dev
```

### Missing environment variables warning
The app runs fully in **demo/mock mode** without environment variables. A warning badge will appear in the health check. This is expected for local development.

## Project Structure

```
sns-hotel-pos/
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin/             # Main Admin dashboards
│   │   ├── client/            # Main Client (tenant owner)
│   │   ├── franchise/         # Franchise Head
│   │   ├── manager/           # Hotel Manager
│   │   ├── inventory/         # Inventory Manager
│   │   ├── cashier/           # Cashier
│   │   ├── chef/              # Chef / Kitchen Display
│   │   ├── worker/            # Waiter/Worker
│   │   ├── customer/          # Customer Portal
│   │   ├── login/             # Login page
│   │   └── api/               # API routes
│   ├── components/            # Shared UI components
│   └── lib/                   # Auth, mock data, utilities
├── public/                    # Static files + PWA assets
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   └── offline.html           # Offline fallback
├── docker/                    # Docker + Nginx configs
├── scripts/                   # Build + backup scripts
├── docs/                      # Documentation
└── play-store-assets/         # Play Store listing images
```
