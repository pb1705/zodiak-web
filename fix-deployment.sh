#!/bin/bash

# Fix Deployment - Restart with correct configuration

set -e

echo "🔧 Fixing Zodiak Deployment"
echo "==========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Detect docker-compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Step 1: Stop and remove old containers
echo "🛑 Step 1: Stopping old containers..."
$DOCKER_COMPOSE down
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

# Step 2: Remove any orphaned containers
echo "🧹 Step 2: Cleaning up orphaned containers..."
docker rm -f zodiak-nginx zodiak-nextjs 2>/dev/null || true
echo -e "${GREEN}✓ Cleanup done${NC}"
echo ""

# Step 3: Verify nginx configs exist
echo "📋 Step 3: Checking Nginx configuration..."
if [ ! -f "nginx/conf.d/default.conf" ]; then
    echo -e "${YELLOW}⚠️  Nginx config missing. Creating HTTP-only config...${NC}"
    mkdir -p nginx/conf.d nginx/ssl nginx/logs
    
    cat > nginx/conf.d/default.conf << 'EOF'
upstream nextjs {
    server nextjs:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name _;

    location /health {
        access_log off;
        proxy_pass http://nextjs/api/health;
        add_header Content-Type application/json;
    }

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://nextjs;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    location /api {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    if [ ! -f "nginx/nginx.conf" ]; then
        cat > nginx/nginx.conf << 'EOF'
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
    keepalive_timeout 65;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    include /etc/nginx/conf.d/*.conf;
}
EOF
    fi
    
    echo -e "${GREEN}✓ Nginx configs created${NC}"
else
    echo -e "${GREEN}✓ Nginx configs exist${NC}"
fi
echo ""

# Step 4: Pull latest images
echo "📥 Step 4: Pulling latest images..."
$DOCKER_COMPOSE pull
echo -e "${GREEN}✓ Images pulled${NC}"
echo ""

# Step 5: Start containers
echo "🚀 Step 5: Starting containers..."
$DOCKER_COMPOSE up -d
echo -e "${GREEN}✓ Containers started${NC}"
echo ""

# Wait a moment
echo "⏳ Waiting for services to initialize..."
sleep 5

# Step 6: Check status
echo "📊 Step 6: Container Status:"
$DOCKER_COMPOSE ps

echo ""
echo -e "${GREEN}✅ Deployment fixed!${NC}"
echo ""
echo "🔍 Verification:"
echo "  1. Check logs: $DOCKER_COMPOSE logs -f"
echo "  2. Test health: curl http://localhost/health"
echo "  3. Verify images: docker ps | grep zodiak"
echo ""
echo "Expected:"
echo "  - zodiak-nextjs: prranav1705/landing:latest"
echo "  - zodiak-nginx: nginx:alpine"
