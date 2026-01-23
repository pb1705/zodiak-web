# Server Deployment Guide (Using Pre-built Docker Image)

This guide shows how to deploy the Zodiak website on your server using a pre-built Docker image from Docker Hub or GitHub Container Registry.

## Prerequisites

- Server with Docker and Docker Compose installed
- Docker Hub or GitHub Container Registry account
- Domain name configured (optional, for SSL)

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

## Step 3: Create Configuration Files

### Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  nextjs:
    # Replace with your Docker Hub or GHCR image
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

networks:
  zodiak-network:
    driver: bridge
```

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
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://nextjs:3000/api/health;
    }
}
```

## Step 4: Set Up SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d zodiak.life -d www.zodiak.life

# Copy certificates to nginx/ssl directory
sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem ~/zodiak-deployment/nginx/ssl/
sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem ~/zodiak-deployment/nginx/ssl/
sudo chmod 644 ~/zodiak-deployment/nginx/ssl/fullchain.pem
sudo chmod 600 ~/zodiak-deployment/nginx/ssl/privkey.pem
```

## Step 5: Deploy

```bash
# Pull the latest image
docker-compose pull

# Start the services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Step 6: Update the Application

When a new version is pushed to the registry:

```bash
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

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Check service status
docker-compose ps

# Execute command in container
docker-compose exec nextjs sh
```

## Troubleshooting

### Image not found:
- Verify you're logged in: `docker login` (for private repos)
- Check image name and tag
- Ensure image is public or you have access

### Container won't start:
- Check logs: `docker-compose logs nextjs`
- Verify environment variables
- Check port 3000 is not in use

### Nginx errors:
- Check Nginx logs: `docker-compose logs nginx`
- Verify SSL certificates exist
- Check Nginx configuration: `docker-compose exec nginx nginx -t`

### SSL certificate renewal:
```bash
# Renew certificate
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem ~/zodiak-deployment/nginx/ssl/
sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem ~/zodiak-deployment/nginx/ssl/

# Reload Nginx
docker-compose restart nginx
```
