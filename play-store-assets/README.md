# SNS Hotels POS — Play Store Assets

This folder contains all assets required to publish the Android app on Google Play Store.

## 📋 Required Assets Checklist

| Asset | Size | Status | File |
|-------|------|--------|------|
| App Icon | 512 × 512 px | ⬜ Needed | `icon.png` |
| Feature Graphic | 1024 × 500 px | ⬜ Needed | `feature-graphic.png` |
| Phone Screenshot 1 | 1080 × 1920 px min | ⬜ Needed | `screenshots/phone-1.png` |
| Phone Screenshot 2 | 1080 × 1920 px min | ⬜ Needed | `screenshots/phone-2.png` |
| Tablet Screenshot 1 | 1200 × 1920 px min | ⬜ Needed | `screenshots/tablet-1.png` |
| Tablet Screenshot 2 | 1200 × 1920 px min | ⬜ Needed | `screenshots/tablet-2.png` |
| Privacy Policy | Hosted URL | ⬜ Needed | Link: https://snshotels.com/privacy |

## 🎨 Icon Design Guidelines

The app icon (`icon.png`) must be:
- **512 × 512 pixels**, PNG format
- No transparent background (use solid color)
- No rounded corners (Google Play adds them automatically)
- High contrast, legible at small sizes

**Suggested design:**
- Deep blue background (`#0A1628`)
- White hotel building / cutlery icon centred
- "SNS" text in gold (`#FFD700`) at the bottom

### Generate icon using this command (requires ImageMagick):
```bash
convert -size 512x512 xc:'#0A1628' \
  -fill '#FFD700' -pointsize 120 -gravity Center \
  -annotate 0 'SNS' \
  -fill white -pointsize 60 -gravity South \
  -annotate +0+60 'Hotels POS' \
  icon.png
```

## 🖼️ Feature Graphic Design Guidelines

The feature graphic (`feature-graphic.png`) must be:
- **1024 × 500 pixels**, PNG or JPEG
- No rounded corners
- Visually demonstrates the app without device frames
- Text readable at small sizes

**Suggested content:**
- Dark navy gradient background
- App UI screenshot (dashboard) on right
- Tagline: "Complete Hotel POS — Cloud-Native" on left
- SNS Hotels logo at top-left

## 📱 Screenshots

Place screenshots in the `screenshots/` subfolder.

### Phone Screenshots (portrait, min 1080×1920):
1. `phone-1.png` — Login / Demo Gate screen
2. `phone-2.png` — Worker dashboard / Floor Plan

### Tablet Screenshots (landscape, min 1200×1920):
1. `tablet-1.png` — Admin dashboard with charts
2. `tablet-2.png` — Kitchen Display System (Chef view)

### Capture screenshots with:
```bash
# Using Playwright (after starting dev server)
npx playwright screenshot --device="Pixel 5" http://localhost:3000/login screenshots/phone-1.png
npx playwright screenshot --device="Pixel 5" http://localhost:3000/worker/dashboard screenshots/phone-2.png
```

## 🔒 Privacy Policy

A privacy policy URL is **mandatory** for Google Play. Host it at:
`https://snshotels.com/privacy`

Minimum content to include:
- What data is collected (email, order data)
- How it is used and stored
- Third-party services (Razorpay, Sentry)
- Contact: support@snshotels.com
- Last updated date

## 📝 App Store Listing Text

### Short Description (max 80 chars):
```
Cloud-native POS for hotel chains — orders, kitchen, inventory.
```

### Full Description (max 4000 chars):
```
SNS Hotels POS is a complete Point-of-Sale and hotel management 
system built for hotel chains of any size.

🏨 MULTI-TENANT ARCHITECTURE
Manage multiple franchises, hotels, and staff from one platform.
Role-based access for 9 roles: Admin, Client, Franchise Head,
Hotel Manager, Inventory Manager, Cashier, Chef, Waiter, Customer.

📋 ORDER MANAGEMENT
• Live floor plan with table status
• Send Kitchen Order Tickets (KOT) instantly
• Real-time kitchen display for chefs
• Bill generation and payment acceptance

💰 CASHIER & PAYMENTS
• Accept Cash, UPI, Card, and App payments
• Shift management and reconciliation
• Discount approvals with manager authorization

🍳 KITCHEN DISPLAY SYSTEM
• Real-time KOT notifications with alarms
• Accept, cook, and mark orders ready
• Order history and performance metrics

📦 INVENTORY MANAGEMENT
• Stock tracking with low-stock alerts
• Purchase order creation and approval
• Theft report filing with photo evidence
• Supplier management

📊 ANALYTICS & REPORTING
• Real-time sales dashboards
• Revenue forecasting
• Occupancy and floor utilization
• Audit logs for all actions

🔒 ENTERPRISE SECURITY
• Role-based access control
• Audit trail for every action
• Secure authentication

Works offline as a Progressive Web App (PWA).
```

## 🚀 Google Play Publication Steps

1. Generate signed `.aab`:
   ```bash
   bash scripts/build-mobile.sh android
   ```

2. Log into [Google Play Console](https://play.google.com/console)

3. Create new app → "SNS Hotels POS"

4. Category: **Business** or **Food & Drink**

5. Upload `.aab` to Production track

6. Add assets from this folder

7. Complete Content Rating questionnaire (typically "Everyone")

8. Set distribution to all countries, free pricing

9. Submit for review (2–5 business days for new accounts)

> **New developer accounts**: Google requires 20 closed testers for 14 days before production release.
> See: https://support.google.com/googleplay/android-developer/answer/14151465
