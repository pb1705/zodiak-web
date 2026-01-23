# Run Docker Image in Production

Quick guide to deploy your Zodiak website in production using Docker.

## Prerequisites

1. **Docker image built and pushed** to a registry (Docker Hub, GHCR, etc.)
2. **Server with Docker and Docker Compose** installed
3. **Nginx config files** in place

## Quick Start

### Option 1: Using the Script (Recommended)

```bash
# Make script executable
chmod +x run-production.sh

# Run the script
./run-production.sh
```

The script will:
- Check Docker installation
- Create necessary directories
- Create Nginx configs if missing
- Pull your Docker image
- Start the containers

### Option 2: Manual Steps

#### Step 1: Set Your Docker Image Name

Create or edit `.env` file:

```bash
echo "DOCKER_IMAGE=your-username/zodiak-website:latest" > .env
```

Replace `your-username/zodiak-website:latest` with your actual image name.

#### Step 2: Ensure Nginx Configs Exist

```bash
mkdir -p nginx/conf.d nginx/ssl nginx/logs
```

If configs don't exist, copy them from the project or use the HTTP-only config from `QUICK_FIX.md`.

#### Step 3: Pull and Start

```bash
# Pull the latest image
docker-compose -f docker-compose.production.yml pull

# Start containers
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

## Verify Deployment

### 1. Check Container Status

```bash
docker-compose -f docker-compose.production.yml ps
```

Should show both `zodiak-nextjs` and `zodiak-nginx` as "Up".

### 2. Test Health Endpoint

```bash
# Test Next.js directly
curl http://localhost:3000/api/health

# Test through Nginx
curl http://localhost/health
```

### 3. Check Logs

```bash
# All logs
docker-compose -f docker-compose.production.yml logs -f

# Next.js logs only
docker-compose -f docker-compose.production.yml logs -f nextjs

# Nginx logs only
docker-compose -f docker-compose.production.yml logs -f nginx
```

### 4. Access Website

- **HTTP**: `http://YOUR_SERVER_IP`
- **HTTPS** (if SSL configured): `https://YOUR_SERVER_IP` or `https://yourdomain.com`

## Important: Build the Image Correctly First

Before deploying, make sure your Docker image is built correctly:

### Option A: Build Inside Docker (Recommended)

```bash
# On your local machine
docker build -f Dockerfile.build -t your-username/zodiak-website:latest .
docker push your-username/zodiak-website:latest
```

### Option B: Build Locally Then Docker

```bash
# On your local machine
npm run build
docker build -t your-username/zodiak-website:latest .
docker push your-username/zodiak-website:latest
```

**Verify the image runs in production mode:**

```bash
# Test locally
docker run -p 3000:3000 your-username/zodiak-website:latest

# Should see: "Ready" (not "dev" mode)
# Visit http://localhost:3000 - should work
```

## Common Commands

```bash
# Start services
docker-compose -f docker-compose.production.yml up -d

# Stop services
docker-compose -f docker-compose.production.yml down

# Restart services
docker-compose -f docker-compose.production.yml restart

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Pull latest image and restart
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d

# Check container health
docker-compose -f docker-compose.production.yml ps

# Execute command in container
docker-compose -f docker-compose.production.yml exec nextjs sh
docker-compose -f docker-compose.production.yml exec nginx sh
```

## Troubleshooting

### Issue: Next.js shows "dev" mode

**Solution:** Your Docker image wasn't built correctly. Rebuild using `Dockerfile.build`:

```bash
docker build -f Dockerfile.build -t your-username/zodiak-website:latest .
docker push your-username/zodiak-website:latest
```

Then pull and restart on server.

### Issue: Nginx can't find config

**Solution:** Ensure config files exist:

```bash
ls -la nginx/conf.d/default.conf
ls -la nginx/nginx.conf
```

If missing, copy from project or use the HTTP config from `QUICK_FIX.md`.

### Issue: Can't access website

**Check:**
1. Containers are running: `docker-compose ps`
2. Ports are open: `sudo ufw status`
3. Firewall allows 80/443: `sudo ufw allow 80/tcp && sudo ufw allow 443/tcp`
4. Test locally: `curl http://localhost/health`

### Issue: SSL errors

For testing, use HTTP-only config. For production, set up SSL certificates (see `PRODUCTION_DEPLOYMENT.md`).

## Production Checklist

- [ ] Docker image built with production build
- [ ] Image pushed to registry
- [ ] `.env` file created with `DOCKER_IMAGE` set
- [ ] Nginx configs in place
- [ ] Containers running: `docker-compose ps`
- [ ] Health check passes: `curl http://localhost/health`
- [ ] Website accessible: `curl http://YOUR_SERVER_IP`
- [ ] SSL configured (for production)
- [ ] Firewall configured
- [ ] Domain DNS pointing to server

## Next Steps

1. **Set up SSL** (Let's Encrypt) - see `PRODUCTION_DEPLOYMENT.md`
2. **Configure domain** - point DNS to your server
3. **Set up monitoring** - consider adding health check monitoring
4. **Backup strategy** - plan for data/volume backups
5. **Auto-updates** - set up CI/CD for automatic deployments
