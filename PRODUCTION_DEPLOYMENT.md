# Production Deployment Guide with Nginx

This guide walks you through deploying the Zodiak website to production using Docker and Nginx.

## Prerequisites

- Server with Docker and Docker Compose installed
- Domain name pointing to your server's IP
- SSH access to your server
- Docker Hub or registry credentials (if using private images)

## Step 1: Prepare Your Server

### Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## Step 2: Set Up Project Directory

```bash
# Create project directory
mkdir -p ~/zodiak-deployment
cd ~/zodiak-deployment

# Create necessary directories
mkdir -p nginx/conf.d nginx/ssl nginx/logs
```

## Step 3: Create Docker Compose File

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  nextjs:
    # Replace with your Docker Hub or registry image
    image: YOUR_DOCKERHUB_USERNAME/zodiak-website:latest
    # Or: ghcr.io/YOUR_GITHUB_USERNAME/zodiak-website:latest
    container_name: zodiak-nextjs
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=https://zodiak.life
      - PORT=3000
    networks:
      - zodiak-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    container_name: zodiak-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - nextjs
    networks:
      - zodiak-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  zodiak-network:
    driver: bridge
```

**Important:** Replace `YOUR_DOCKERHUB_USERNAME/zodiak-website:latest` with your actual image name.

## Step 4: Create Nginx Configuration

### Create `nginx/nginx.conf`:

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
}
```

### Create `nginx/conf.d/default.conf`:

```nginx
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name zodiak.life www.zodiak.life;

    # For Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name zodiak.life www.zodiak.life;

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

    # Proxy to Next.js
    location / {
        proxy_pass http://nextjs:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://nextjs:3000/api/health;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://nextjs:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, immutable";
        expires 30d;
    }
}
```

**Important:** Replace `zodiak.life` with your actual domain name.

## Step 5: Set Up SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Stop Nginx temporarily (if running)
docker-compose down

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d zodiak.life -d www.zodiak.life

# Copy certificates to nginx/ssl directory
sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem ~/zodiak-deployment/nginx/ssl/
sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem ~/zodiak-deployment/nginx/ssl/
sudo chmod 644 ~/zodiak-deployment/nginx/ssl/fullchain.pem
sudo chmod 600 ~/zodiak-deployment/nginx/ssl/privkey.pem
```

## Step 6: Deploy

```bash
# Make sure you're in the deployment directory
cd ~/zodiak-deployment

# Login to Docker Hub (if using private image)
docker login

# Pull the latest image
docker-compose pull

# Start the services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Step 7: Verify Deployment

```bash
# Check if containers are running
docker-compose ps

# Check Next.js logs
docker-compose logs nextjs

# Check Nginx logs
docker-compose logs nginx

# Test the health endpoint
curl http://localhost/api/health

# Test from outside (replace with your domain)
curl https://zodiak.life/api/health
```

## Step 8: Set Up SSL Certificate Auto-Renewal

```bash
# Edit crontab
sudo crontab -e

# Add this line to renew certificates monthly
0 0 1 * * certbot renew --quiet && docker-compose exec nginx nginx -s reload
```

Or create a renewal script:

```bash
# Create renewal script
sudo nano /usr/local/bin/renew-ssl.sh
```

Add:
```bash
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/zodiak.life/fullchain.pem /home/YOUR_USERNAME/zodiak-deployment/nginx/ssl/
cp /etc/letsencrypt/live/zodiak.life/privkey.pem /home/YOUR_USERNAME/zodiak-deployment/nginx/ssl/
docker-compose -f /home/YOUR_USERNAME/zodiak-deployment/docker-compose.yml exec nginx nginx -s reload
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/renew-ssl.sh
```

## Updating the Application

When you push a new version:

```bash
cd ~/zodiak-deployment

# Pull the latest image
docker-compose pull

# Restart the service
docker-compose up -d --force-recreate nextjs

# Or restart all services
docker-compose restart
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f nextjs
docker-compose logs -f nginx

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Check service status
docker-compose ps

# Execute command in container
docker-compose exec nextjs sh
docker-compose exec nginx sh

# Restart services
docker-compose restart

# View resource usage
docker stats
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs nextjs

# Check if port 3000 is available
netstat -tulpn | grep 3000

# Verify environment variables
docker-compose exec nextjs env
```

### Nginx errors
```bash
# Check Nginx configuration
docker-compose exec nginx nginx -t

# Check Nginx logs
docker-compose logs nginx

# Verify SSL certificates exist
ls -la nginx/ssl/
```

### Image not found
```bash
# Login to Docker Hub
docker login

# Verify image exists
docker pull YOUR_DOCKERHUB_USERNAME/zodiak-website:latest
```

### SSL certificate issues
```bash
# Test certificate
openssl x509 -in nginx/ssl/fullchain.pem -text -noout

# Renew certificate manually
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/
docker-compose restart nginx
```

## Security Checklist

- [ ] SSL certificate installed and working
- [ ] HTTP redirects to HTTPS
- [ ] Security headers configured
- [ ] Firewall configured (UFW or iptables)
- [ ] Non-root user running containers
- [ ] Regular security updates
- [ ] SSL certificate auto-renewal set up
- [ ] Backups configured

## Firewall Setup (Optional but Recommended)

```bash
# Install UFW
sudo apt install ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Monitoring (Optional)

Consider setting up monitoring with:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Log aggregation**: ELK Stack, Loki
- **Metrics**: Prometheus + Grafana
- **Error tracking**: Sentry

---

**Your site should now be live at https://zodiak.life!** 🚀
