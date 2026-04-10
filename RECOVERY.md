# RECOVERY.md — Disaster Recovery Procedures
# SNS Hotels POS System

> **Keep this document accessible offline** — print a copy and store in the server room.

---

## 🚨 Severity Levels

| Level | Description | Target Recovery Time |
|-------|-------------|----------------------|
| P1 Critical | Full outage — no orders can be taken | < 30 minutes |
| P2 High | Payment system down or KDS not displaying | < 1 hour |
| P3 Medium | Reports or analytics unavailable | < 4 hours |
| P4 Low | Minor UI issues, single role affected | < 24 hours |

---

## 🔴 P1: Full System Outage

### 1. Immediate Response (< 5 minutes)

```bash
# SSH into server
ssh ubuntu@YOUR_SERVER_IP

# Check container status
cd /opt/sns-pos/sns-hotel-pos/docker
docker compose ps

# View recent logs
docker compose logs --tail=50 frontend
docker compose logs --tail=50 nginx
docker compose logs --tail=50 postgres
```

### 2. Restart All Services

```bash
docker compose restart
sleep 30
docker compose ps

# Test health
curl http://localhost:3000/api/health
```

### 3. If Containers Won't Start

```bash
# Rebuild
docker compose down
docker compose --env-file .env up -d --build

# Check disk space (full disk is common cause)
df -h
# If disk full: clear Docker cache
docker system prune -f
```

### 4. If Still Down — Rollback Deployment

```bash
# Find last working commit
git log --oneline -10

# Rollback
git checkout LAST_WORKING_COMMIT_HASH
docker compose --env-file .env up -d --build
```

---

## 💾 Database Recovery

### Restore from Backup

```bash
# List available backups
ls -la /var/backups/sns-pos/
# Or from S3:
aws s3 ls s3://sns-pos-backups/db/

# Download from S3 (if needed)
aws s3 cp s3://sns-pos-backups/db/sns_pos_20250401_020000.sql.gz .

# Decompress
gunzip sns_pos_20250401_020000.sql.gz

# Stop the app first
docker compose stop frontend

# Restore database
PGPASSWORD=YOUR_PASSWORD psql \
  -h localhost -p 5432 \
  -U sns_user -d sns_pos_db \
  < sns_pos_20250401_020000.sql

# Start app
docker compose start frontend

# Verify
curl http://localhost:3000/api/health
```

### Restore Specific Tables Only

```bash
# Extract specific table from dump
pg_restore --table=orders -f orders_only.sql sns_pos_backup.dump

# Apply to production
PGPASSWORD=YOUR_PASSWORD psql -h localhost -U sns_user -d sns_pos_db < orders_only.sql
```

---

## 🔐 SSL Certificate Recovery

```bash
# If certificate expired or missing
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d pos.snshotels.com \
  --email admin@snshotels.com \
  --agree-tos --force-renewal

# Reload nginx
docker compose exec nginx nginx -s reload
```

---

## 📧 Notification Failure

If email alerts stop working:
1. Check `EMAIL_PASS` is still valid (Gmail app passwords expire if 2FA is changed)
2. Generate new app password at myaccount.google.com → Security → App Passwords
3. Update `.env` and restart: `docker compose restart frontend`

---

## 🗄️ Redis Recovery

Redis data is session cache — losing it forces all users to re-login (no data loss).

```bash
# Restart Redis
docker compose restart redis

# If Redis data is corrupted
docker compose stop redis
docker volume rm sns-hotel-pos_redis_data
docker compose up -d redis
```

---

## 📱 Mobile App Recovery

If the mobile app stops working after a server change:
1. Update `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_WS_URL` in Capacitor config
2. Run `npx cap sync`
3. Build a new release: `./scripts/build-mobile.sh android`
4. Upload new `.aab` to Google Play and trigger a rollout

---

## 📋 Recovery Checklist

After any recovery:
- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] Login works for all roles
- [ ] Orders can be taken and KOTs appear in kitchen
- [ ] Payments can be accepted
- [ ] Audit logs are intact
- [ ] Backup job still running (`crontab -l`)
- [ ] SSL certificate valid (`curl -I https://pos.snshotels.com`)
- [ ] Notify team that system is restored

---

## 📞 Emergency Contacts

| Role | Name | Contact |
|------|------|---------|
| System Admin | [Your Name] | [Your Phone] |
| DevOps | [DevOps Engineer] | [Phone] |
| Hosting Support | DigitalOcean/AWS | Support ticket |
| Domain Registrar | [Registrar] | [Support URL] |

---

## 🗓️ Recovery Test Schedule

Perform a recovery drill every **3 months**:
1. Take today's backup
2. Spin up a staging copy
3. Restore from last backup
4. Run full test suite against restored environment
5. Document recovery time
