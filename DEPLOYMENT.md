# Zodiak Website - Deployment Guide

This guide covers deploying the Zodiak website using Docker Compose with Nginx on a remote server.

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- Domain name pointing to your server's IP address
- SSL certificates (Let's Encrypt recommended)

## Server Requirements

- **Minimum:**
  - 2 CPU cores
  - 2GB RAM
  - 20GB storage
  - Ubuntu 20.04+ or similar Linux distribution

- **Recommended:**
  - 4 CPU cores
  - 4GB RAM
  - 50GB storage

## Quick Start

### 1. Install Docker and Docker Compose

```bash
# Update system
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group (optional)
sudo usermod -aG docker $USER
```

### 2. Clone/Upload Project

```bash
# If using Git
git clone <your-repo-url> zodiak-website
cd zodiak-website

# Or upload files via SCP/SFTP
```

### 3. Set Up Environment Variables

```bash
# Copy example env file
cp .docker-compose.env.example .env

# Edit environment variables
nano .env
```

Set `NEXT_PUBLIC_BASE_URL` to your domain:
```
NEXT_PUBLIC_BASE_URL=https://zodiak.life
```

### 4. Set Up SSL Certificates

#### Option A: Let's Encrypt (Recommended for Production)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Stop nginx temporarily (if running)
docker-compose down

# Generate certificates
sudo certbot certonly --standalone -d zodiak.life -d www.zodiak.life

# Copy certificates to nginx/ssl directory
sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/key.pem

# Set proper permissions
sudo chmod 644 nginx/ssl/cert.pem
sudo chmod 600 nginx/ssl/key.pem
```

#### Option B: Self-Signed (Development Only)

```bash
# Generate self-signed certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Zodiak/CN=zodiak.life"
```

### 5. Build and Start Services

```bash
# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 6. Verify Deployment

```bash
# Check if containers are running
docker ps

# Test health endpoints
curl http://localhost/health
curl http://localhost:3000/health

# Check nginx logs
docker-compose logs nginx

# Check Next.js logs
docker-compose logs nextjs
```

## Configuration

### Update Nginx Configuration

Edit `nginx/conf.d/default.conf` to update:
- Server name (replace `zodiak.life` with your domain)
- SSL certificate paths if different
- Rate limiting if needed

### Update Docker Compose

Edit `docker-compose.prod.yml` to:
- Adjust resource limits
- Add environment variables
- Configure volumes if needed

## Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nextjs
docker-compose logs -f nginx
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart nextjs
docker-compose restart nginx
```

### Update Application

```bash
# Pull latest code (if using Git)
git pull

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Or rebuild specific service
docker-compose -f docker-compose.prod.yml build nextjs
docker-compose -f docker-compose.prod.yml up -d nextjs
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## SSL Certificate Renewal

For Let's Encrypt certificates (valid for 90 days):

```bash
# Renew certificates
sudo certbot renew

# Copy renewed certificates
sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/key.pem

# Reload nginx
docker-compose restart nginx
```

### Automated Renewal (Cron Job)

```bash
# Edit crontab
sudo crontab -e

# Add renewal script (runs monthly)
0 0 1 * * certbot renew --quiet && cp /etc/letsencrypt/live/zodiak.life/fullchain.pem /path/to/zodiak-website/nginx/ssl/cert.pem && cp /etc/letsencrypt/live/zodiak.life/privkey.pem /path/to/zodiak-website/nginx/ssl/key.pem && cd /path/to/zodiak-website && docker-compose restart nginx
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs

# Check container status
docker ps -a

# Remove and rebuild
docker-compose down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Port Already in Use

```bash
# Check what's using port 80/443
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting services
sudo systemctl stop apache2  # if Apache is running
sudo systemctl stop nginx    # if system nginx is running
```

### SSL Certificate Issues

```bash
# Verify certificate files exist
ls -la nginx/ssl/

# Check certificate validity
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Test nginx configuration
docker-compose exec nginx nginx -t
```

### Next.js Build Fails

```bash
# Check build logs
docker-compose logs nextjs

# Rebuild from scratch
docker-compose down
docker system prune -a
docker-compose -f docker-compose.prod.yml up -d --build
```

## Security Best Practices

1. **Firewall Configuration:**
   ```bash
   # Allow only necessary ports
   sudo ufw allow 22/tcp   # SSH
   sudo ufw allow 80/tcp   # HTTP
   sudo ufw allow 443/tcp  # HTTPS
   sudo ufw enable
   ```

2. **Regular Updates:**
   ```bash
   # Update system packages
   sudo apt-get update && sudo apt-get upgrade

   # Update Docker images
   docker-compose pull
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Backup:**
   ```bash
   # Backup SSL certificates
   tar -czf ssl-backup-$(date +%Y%m%d).tar.gz nginx/ssl/

   # Backup environment variables
   cp .env .env.backup
   ```

## Monitoring

### Health Checks

Both services include health checks. Monitor with:

```bash
# Check container health
docker ps

# Manual health check
curl http://localhost/health
```

### Resource Usage

```bash
# Check resource usage
docker stats

# Check disk usage
docker system df
```

## Production Checklist

- [ ] Domain DNS configured
- [ ] SSL certificates installed
- [ ] Environment variables set
- [ ] Firewall configured
- [ ] Health checks passing
- [ ] Logs accessible
- [ ] Backup strategy in place
- [ ] SSL renewal automated
- [ ] Monitoring set up
- [ ] Resource limits configured

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Verify configuration files
3. Check Docker and system resources
4. Review this deployment guide
