# SNS Hotels POS — Publishing & Play Store Guide

This document outlines the professional steps to transition from this local development state to a live production environment and a mobile app on the Google Play Store.

## 1. Production Web Deployment
Before mobile, the web app must be live on a secure HTTPS domain.

### Recommended Stack
- **Frontend**: [Vercel](https://vercel.com) (Easiest for Next.js) or [Netlify](https://netlify.com).
- **Database**: [Supabase](https://supabase.com) (PostgreSQL) or [PlanetScale].
- **Auth**: [Clerk](https://clerk.com) or [Auth.js](https://authjs.dev) (for production secure auth).

### Steps
1. **Repository Setup**: Push your code to a private GitHub repository.
2. **Environment Variables**: Move `DEMO_USERS` and secret keys from code to `.env` files.
3. **Build Command**: Run `npm run build` locally first to ensure zero errors.
4. **Deploy**: Connect the GitHub repo to Vercel. It will automatically detect Next.js and deploy.
5. **Domain**: Point your custom domain (e.g., `pos.snshotels.com`) to Vercel via DNS.

---

## 2. Preparing for Google Play Store
The most efficient way to launch a Next.js POS on Android is via **Trusted Web Activity (TWA)**. This keeps the app fast and updates are automatic (no need to resubmit to Play Store when you change web code).

### Tools Required
- **Bubblewrap CLI**: Official Google tool to package PWAs for Android.
- **Android Studio**: To generate your signing keys.

### Steps to Convert
1. **Manifest & Icons**:
   - Ensure `public/manifest.json` is complete with icons, theme colors, and `display: "standalone"`.
2. **Asset Links (CRITICAL)**:
   - Generate a `/.well-known/assetlinks.json` file.
   - This proves you own the website. Without this, the app will show a browser URL bar (Standard TWA requirement).
3. **Initialize Bubblewrap**:
   ```bash
   npx @bubblewrap/cli init --manifest=https://your-domain.com/manifest.json
   ```
4. **Build APK/Bundle**:
   ```bash
   npx @bubblewrap/cli build
   ```
   This generates an `.aab` file (Android App Bundle).

---

## 3. Play Store Submission (Live Practice)
1. **Google Play Console**: Create a developer account ($25 one-time fee).
2. **Create App**: Select "App" (not "Game") and "Free/Paid".
3. **Set Up Your App**:
   - **Privacy Policy**: Host a policy on your website.
   - **Store Listing**: Upload screenshots.
   - **Category**: Productivty / Business.
4. **Testing**:
   - Upload the `.aab` to **Internal Testing**.
   - Add your email to the testers list.
5. **Production**:
   - Promote to **Production**.
   - Google review takes 2-7 days.

---

## 4. Unique Alarms & Hardware Integration
- **Notification Alarms**: The synthesized sounds implemented in `lib/notifications.tsx` will play through the device speaker.
- **Printers**: Use the Web Print API for thermal printing.
