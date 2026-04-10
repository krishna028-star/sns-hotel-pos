# ✅ SNS Hotels POS — Final Production Checklist

> Use this before every production deployment. Check off each item.

---

## 🧪 Testing

- [ ] All unit tests pass (`npm test`)
- [ ] All integration tests pass
- [ ] All E2E tests pass (`npx playwright test`)
- [ ] Login tested for all 9 roles
- [ ] KOT workflow tested: Worker → Kitchen → Cashier
- [ ] Discount approval workflow tested (Hotel Manager)
- [ ] Theft report workflow tested (Inventory → Manager → Franchise)
- [ ] Customer booking + ordering flow tested
- [ ] Payment acceptance (Cash + App) tested
- [ ] Error boundary renders correctly on component crash
- [ ] 404 page renders correctly
- [ ] `/api/health` returns 200

---

## 🔐 Security

- [ ] All secrets moved to environment variables (no hardcoded keys)
- [ ] `.env.local` is in `.gitignore`
- [ ] JWT_SECRET is at least 64 characters
- [ ] HTTPS enforced (HSTS header active)
- [ ] Rate limiting active (100 req/min per IP)
- [ ] `npm audit` passes with 0 critical vulnerabilities
- [ ] CORS configured correctly (only allow your domains)
- [ ] Input validation active on all API routes
- [ ] Secure cookies set (httpOnly, sameSite: strict)

---

## 🌐 Web Deployment

- [ ] Production build succeeds (`npm run build`)
- [ ] Backend deployed to VPS with Docker Compose
- [ ] SSL certificate active (Let's Encrypt or similar)
- [ ] Domain DNS pointing to server
- [ ] Nginx reverse proxy configured and tested
- [ ] PM2 or Docker auto-restart configured
- [ ] Frontend deployed (Vercel / Netlify / Nginx)
- [ ] `/api/health` returns healthy from public URL

---

## 📱 PWA

- [ ] `manifest.json` in `/public` with all icon sizes
- [ ] Service worker registered and active
- [ ] Offline fallback page (`/offline.html`) works
- [ ] App installable on Chrome desktop (install button appears)
- [ ] App installable on Android Chrome (Add to Home Screen)
- [ ] App installable on iOS Safari (Add to Home Screen)
- [ ] Push notifications work (VAPID keys configured)

---

## 🤖 Android App

- [ ] Capacitor installed and configured
- [ ] `./scripts/build-mobile.sh android` runs without errors
- [ ] Signed `.aab` generated in `release/` folder
- [ ] App runs correctly on Android emulator
- [ ] App tested on physical Android device (Android 8+)
- [ ] Icons and splash screen generated correctly
- [ ] `play-store-assets/icon.png` (512×512) ready
- [ ] `play-store-assets/feature-graphic.png` (1024×500) ready
- [ ] At least 2 phone screenshots ready
- [ ] At least 2 tablet screenshots ready
- [ ] Privacy policy URL live on website
- [ ] Google Play Console account active ($25 paid)
- [ ] App submitted to Google Play → Production track
- [ ] Content rating questionnaire completed

---

## 🍎 iOS App (Optional)

- [ ] Apple Developer account active ($99/year)
- [ ] App signed with distribution certificate
- [ ] `.ipa` generated and uploaded to App Store Connect
- [ ] App tested on physical iPhone
- [ ] TestFlight beta distributed (optional)
- [ ] App Store listing complete

---

## 💾 Backup & Recovery

- [ ] Daily backup cron job configured
- [ ] Backup script tested (`scripts/backup.sh`)
- [ ] S3 bucket created and backup upload tested
- [ ] Recovery procedure documented (`RECOVERY.md`)
- [ ] Test restore performed on staging environment

---

## 📊 Monitoring

- [ ] Sentry DSN configured (`NEXT_PUBLIC_SENTRY_DSN`)
- [ ] Sentry receiving test errors
- [ ] UptimeRobot / Pingdom monitoring `/api/health`
- [ ] Alert email configured for downtime
- [ ] Alert set for payment gateway errors (>5/min)
- [ ] Alert set for prolonged unaccepted KOTs (>10 min)
- [ ] Alert set for critical theft reports (loss >₹10,000)

---

## 📖 Documentation

- [ ] `README.md` complete with setup instructions
- [ ] `docs/setup.md` — local development guide
- [ ] `docs/deployment.md` — production deployment guide
- [ ] `docs/user-guide.md` — role-by-role usage guide
- [ ] `RECOVERY.md` — disaster recovery procedure
- [ ] Support email (`support@snshotels.com`) active

---

## 🚀 Go-Live

- [ ] All items above checked
- [ ] Staging environment tested for 48+ hours
- [ ] Team trained on all roles
- [ ] Rollback plan ready
- [ ] Communication sent to stakeholders

---

> **Sign-off:** ______________________  **Date:** ____________
