# Deployment Guide — Production

## Option A: Docker Compose on VPS (Recommended)

### Server Requirements
- Ubuntu 22.04 LTS
- 2 vCPU, 4 GB RAM minimum (4 vCPU, 8 GB recommended)
- 40 GB SSD
- Static IP + domain name pointing to server

### Step 1: Provision Server

```bash
# Update server
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose v2
sudo apt install docker-compose-v2 -y

# Verify
docker --version
docker compose version
```

### Step 2: Clone & Configure

```bash
git clone https://github.com/your-org/sns-hotel-pos.git
cd sns-hotel-pos/sns-hotel-pos

# Copy and edit environment
cp .env.example docker/.env
nano docker/.env
```

Required values to fill in:
- `POSTGRES_PASSWORD` — strong random password
- `REDIS_PASSWORD` — strong random password
- `JWT_SECRET` — 64-char random hex
- `NEXT_PUBLIC_APP_URL` — your domain (https://pos.snshotels.com)
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- `EMAIL_*` for notifications

### Step 3: SSL Certificate

```bash
# Get free SSL from Let's Encrypt
docker run --rm -it \
  -v $(pwd)/docker/certs:/etc/letsencrypt \
  -v $(pwd)/docker/certbot-www:/var/www/certbot \
  -p 80:80 certbot/certbot certonly \
  --standalone \
  -d pos.snshotels.com \
  --email admin@snshotels.com \
  --agree-tos --no-eff-email
```

### Step 4: Deploy

```bash
cd docker
docker compose --env-file .env up -d --build

# Check status
docker compose ps
docker compose logs frontend
docker compose logs nginx
```

### Step 5: Verify

```bash
# Health check
curl https://pos.snshotels.com/api/health

# Should return: {"status":"ok",...}
```

### Updates & Rollback

```bash
# Pull latest code
git pull

# Rebuild and restart
cd docker
docker compose --env-file .env up -d --build

# Rollback: revert git commit, rebuild
git revert HEAD
docker compose --env-file .env up -d --build
```

---

## Option B: Vercel + Supabase

### Frontend (Vercel)

```bash
npm install -g vercel
cd sns-hotel-pos
vercel --prod
```

Set environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Database (Supabase)

1. Create account at [supabase.com](https://supabase.com)
2. New project → note the **Connection String**
3. Set `DATABASE_URL` in Vercel env vars

### Caveats
- Vercel does not support WebSocket connections (upgrade to long-running service for real-time)
- Use Railway.app for the WebSocket/backend server

---

## Option C: Render.com (Simple)

1. Connect GitHub repo to Render
2. New Web Service → Build Command: `npm run build`
3. Start Command: `npm start`
4. Add environment variables in Render dashboard
5. Add Render PostgreSQL database, copy connection string

---

## DNS Configuration

```
Type    Name    Value               TTL
A       @       YOUR_SERVER_IP      300
A       pos     YOUR_SERVER_IP      300
CNAME   www     pos.snshotels.com   300
```

---

## SSL Auto-Renewal (Let's Encrypt)

The Certbot container in `docker-compose.yml` automatically renews certificates every 12 hours. To manually renew:

```bash
docker compose exec certbot certbot renew
docker compose exec nginx nginx -s reload
```

---

## Scaling (Multiple Instances)

For high traffic (10,000+ daily orders):

```bash
# Scale frontend to 3 instances
docker compose --env-file .env up -d --scale frontend=3

# Add load balancer in nginx.conf:
# upstream frontend_cluster {
#   server frontend_1:3000;
#   server frontend_2:3000;
#   server frontend_3:3000;
# }
```

Use **managed PostgreSQL** (AWS RDS or DigitalOcean Managed DB) and **managed Redis** (AWS ElastiCache or Upstash) for production scale.
