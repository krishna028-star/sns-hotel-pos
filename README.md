# 🏨 SNS Hotels POS — Cloud-Native Hotel Management System

> A complete, multi-tenant Point-of-Sale and hotel management platform supporting 9 distinct roles, real-time KOT/payment alarms, inventory management, and franchise analytics.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture](#architecture)
3. [Roles & Demo Credentials](#roles--demo-credentials)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Mobile & Desktop Apps](#mobile--desktop-apps)
7. [Google Play Store](#google-play-store)
8. [Monitoring & Alerts](#monitoring--alerts)
9. [Backups & Recovery](#backups--recovery)
10. [Final Checklist](#final-checklist)

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Git

### Run Locally
```bash
# Clone the repository
git clone https://github.com/snshotels/sns-hotel-pos.git
cd sns-hotel-pos

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

---

## 🏗️ Architecture

```
sns-hotel-pos/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # REST API routes
│   │   │   ├── health/         # GET /api/health
│   │   │   ├── auth/login/     # POST /api/auth/login
│   │   │   ├── auth/logout/    # POST /api/auth/logout
│   │   │   ├── users/          # GET/POST /api/users
│   │   │   ├── orders/         # GET/POST /api/orders
│   │   │   ├── notifications/  # GET/POST /api/notifications
│   │   │   ├── audit-logs/     # GET/POST /api/audit-logs
│   │   │   └── debug/          # GET /api/debug/audit-logs (admin only)
│   │   ├── admin/              # Main Admin dashboards
│   │   ├── client/             # Main Client dashboards
│   │   ├── franchise/          # Franchise Head dashboards
│   │   ├── manager/            # Hotel Manager dashboards
│   │   ├── inventory/          # Inventory Manager dashboards
│   │   ├── cashier/            # Cashier dashboards
│   │   ├── chef/               # Chef / KDS screens
│   │   ├── worker/             # Waiter dashboards
│   │   └── customer/           # Customer portal
│   ├── components/             # Shared UI components
│   └── lib/                    # Utilities (auth, mockData, apiHelpers)
├── __tests__/                  # Jest unit + integration tests
│   ├── unit/
│   └── integration/
├── e2e/                        # Playwright E2E tests
├── scripts/                    # Build and deploy scripts
├── docker/                     # Docker Compose + Nginx config
├── docs/                       # Documentation
└── play-store-assets/          # Google Play Store assets
```

### Technology Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript 5 |
| Styling | Vanilla CSS (glassmorphism design system) |
| Charts | Recharts |
| Icons | Lucide React |
| Testing | Jest + Playwright |
| Database | PostgreSQL + Prisma (prod) / Mock data (demo) |
| Cache | Redis (prod) / in-memory (demo) |
| Deployment | Docker Compose + Nginx + Let's Encrypt |
| Mobile | Capacitor (Android + iOS) |
| Desktop | Electron (Windows + macOS + Linux) |

---

## 👥 Roles & Demo Credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| 🔴 Main Admin | admin@sns.com | admin123 | /admin/dashboard |
| 🟢 Main Client | client@sns.com | client123 | /client/dashboard |
| 🟠 Franchise Head | franchise@sns.com | franchise123 | /franchise/dashboard |
| 🔵 Hotel Manager | manager@sns.com | manager123 | /manager/dashboard |
| 🟩 Inventory Manager | inventory@sns.com | inv123 | /inventory/dashboard |
| 🟡 Cashier | cashier@sns.com | cash123 | /cashier/dashboard |
| 🔴 Chef | chef@sns.com | chef123 | /chef/dashboard |
| 🔵 Worker/Waiter | worker@sns.com | work123 | /worker/dashboard |
| ⚪ Customer | customer@sns.com | cust123 | /customer/dashboard |

### Role Hierarchy & Permissions

```
Main Admin (0)
  └── Main Client (1)
        └── Franchise Head (2)
              └── Hotel Manager (3)
                    ├── Inventory Manager (4)
                    ├── Cashier (5)
                    ├── Chef (6)
                    └── Worker (7)
                          └── Customer (8)
```

**Each role can only create users with a lower hierarchy number than themselves.**

---

## 🧪 Testing

### Unit & Integration Tests (Jest)

```bash
# Run all unit and integration tests
npm test

# Watch mode for development
npm run test:watch

# With coverage report
npm run test:coverage
```

Tests are in `__tests__/`:
- `unit/auth.test.ts` — Login, role hierarchy, canManage
- `unit/mockData.test.ts` — Data integrity, formatters
- `integration/health.test.ts` — /api/health route
- `integration/rbac.test.ts` — Permission matrix, main admin restriction
- `integration/orderWorkflow.test.ts` — KOT state machine, payment, discount
- `integration/inventory.test.ts` — Stock reservation, theft workflow, PO approval

### E2E Tests (Playwright)

```bash
# Install browsers (first time)
npx playwright install

# Run all E2E tests (requires dev server running)
npm run test:e2e

# Run with visible browser
npm run test:e2e:headed

# Interactive UI mode
npm run test:e2e:ui
```

E2E tests are in `e2e/`:
- `auth.spec.ts` — Login for all 9 roles, auth guards, API health
- `workflows.spec.ts` — Worker orders, Chef KOT, Cashier payments, Manager approvals, Customer booking

### Run All Tests
```bash
npm run test:all
```

---

## 🚀 Deployment

### Option A: Docker Compose (Recommended for VPS)

```bash
# Build production image
docker compose -f docker/docker-compose.yml build

# Start all services (Next.js + PostgreSQL + Redis + Nginx)
docker compose -f docker/docker-compose.yml up -d

# View logs
docker compose -f docker/docker-compose.yml logs -f
```

### Option B: Vercel (Easiest for web)

```bash
npm install -g vercel
vercel --prod
```

### Option C: Manual VPS

```bash
# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "sns-pos" -- start
pm2 save
pm2 startup
```

### Environment Variables

Copy `.env.example` to `.env.local` (development) or set as server environment variables.

Required for production:
```bash
DATABASE_URL=postgresql://...     # PostgreSQL connection string
JWT_SECRET=<64+ char random hex>  # Authentication secret
REDIS_URL=redis://...             # Redis for sessions/notifications
EMAIL_HOST=smtp.gmail.com         # Email for alerts
```

See `.env.example` for the complete list.

---

## 📱 Mobile & Desktop Apps

### Android + iOS (Capacitor)

```bash
# Build and package for Android
bash scripts/build-mobile.sh android

# Build for iOS (requires macOS + Xcode)
bash scripts/build-mobile.sh ios

# Build both
bash scripts/build-mobile.sh all
```

Output: `release/android/*.aab` (Android App Bundle for Play Store)

### Windows/macOS/Linux (Electron)

```bash
# Build for all desktop platforms
bash scripts/build-desktop.sh all

# Platform-specific
bash scripts/build-desktop.sh win    # .exe
bash scripts/build-desktop.sh mac    # .dmg
bash scripts/build-desktop.sh linux  # .AppImage + .deb
```

Output: `release/desktop/`

### PWA Installation

The app is a Progressive Web App — users can install it from any modern browser:
- **Chrome/Edge desktop**: Click install icon (⊕) in address bar
- **Android Chrome**: Menu (⋮) → "Add to Home Screen"
- **iOS Safari**: Share (↑) → "Add to Home Screen"

See the universal download page: `download.html`

---

## 🛒 Google Play Store

### Prerequisites
1. [Google Play Developer Account](https://play.google.com/console) ($25 one-time)
2. Signed `.aab` file (generated by `build-mobile.sh`)
3. Privacy policy hosted publicly
4. App listing assets (see `play-store-assets/README.md`)

### Publication Steps

1. **Generate signed AAB:**
   ```bash
   bash scripts/build-mobile.sh android
   ```

2. **Go to Google Play Console** → Create new app → "SNS Hotels POS"

3. **Fill in store listing:**
   - Category: Business
   - Description from `play-store-assets/README.md`

4. **Upload assets** from `play-store-assets/`:
   - `icon.png` (512×512)
   - `feature-graphic.png` (1024×500)
   - Phone + tablet screenshots

5. **Upload AAB** to Production track

6. **Complete content rating** (typically "Everyone" — adjust for alcohol/food if applicable)

7. **Submit for review** — typically 2–5 business days

> **New accounts**: Set up Closed Testing with 20 testers for 14 days first.

---

## 📊 Monitoring & Alerts

### Health Check Endpoint

```
GET /api/health
```

Returns: app status, memory, uptime, environment checks.

Monitor with UptimeRobot, Pingdom, or any uptime service — set alerts on non-200 responses.

### Sentry (Frontend Error Tracking)

```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxxx@o0.ingest.sentry.io/0
```

### Prometheus + Grafana (Backend Metrics)

See `docker/docker-compose.yml` — includes Prometheus and Grafana services.

### Critical Alerts

Set up email/Slack alerts for:
- Database connection failures
- Payment gateway errors (>5 in 1 minute)
- Theft reports with loss > ₹10,000  
- KOTs unaccepted for > 10 minutes

---

## 💾 Backups & Recovery

### Automated Daily Backup

```bash
# Manual trigger
bash scripts/backup.sh

# Cron job (add to crontab)
0 2 * * * /path/to/sns-hotel-pos/scripts/backup.sh >> /var/log/sns-backup.log 2>&1
```

Backups are stored locally and optionally uploaded to S3.

Retention: 30 days daily, then weekly for 6 months.

### Recovery

See [`RECOVERY.md`](RECOVERY.md) for the complete disaster recovery procedure.

---

## ✅ Final Checklist

See [`FINAL_CHECKLIST.md`](FINAL_CHECKLIST.md) for the complete production checklist.

Quick summary:
- [ ] `npm test` passes
- [ ] `npm run test:e2e` passes
- [ ] `/api/health` returns 200
- [ ] All secrets in `.env.local` (not committed to git)
- [ ] Docker build succeeds
- [ ] SSL certificate active
- [ ] PWA installable on Chrome and Android
- [ ] Android `.aab` generated
- [ ] Play Store listing submitted
- [ ] Backups configured
- [ ] Monitoring alerts set up

---

## 🔒 Security

- **HTTPS**: Enforced via Nginx + Let's Encrypt (see `docker/nginx.conf`)
- **Rate Limiting**: 100 requests/minute per IP (implemented in `src/lib/apiHelpers.ts`)
- **Input Validation**: All API inputs sanitized and validated
- **JWT**: Secure HTTP-only cookies for session tokens
- **RBAC**: Role-based access on every protected route
- **Audit Logs**: Every sensitive action is logged (`/api/audit-logs`)
- **Dependencies**: Run `npm audit` before each release

---

## 📞 Support

- **Email**: support@snshotels.com
- **Documentation**: `docs/` folder
- **Health Status**: `/api/health`
- **Debug Logs**: `/api/debug/audit-logs` (main_admin only)

---

## 📄 License

MIT © 2025 SNS Hotels Group
