#!/bin/bash

# Production Deployment Script for Zodiak Website
# This script helps you deploy the Docker image in production

set -e

echo "🚀 Zodiak Production Deployment"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Detect docker-compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

echo -e "${GREEN}✓ Docker and Docker Compose found${NC}"
echo ""

# Get the image name
if [ -f .env ]; then
    source .env
fi

IMAGE_NAME=${DOCKER_IMAGE:-"your-username/zodiak-website:latest"}

if [ "$IMAGE_NAME" == "your-username/zodiak-website:latest" ]; then
    echo -e "${YELLOW}⚠️  DOCKER_IMAGE not set. Using default: ${IMAGE_NAME}${NC}"
    echo ""
    read -p "Enter your Docker image name (e.g., username/zodiak-website:latest): " IMAGE_NAME
    if [ -z "$IMAGE_NAME" ]; then
        echo -e "${RED}❌ Image name is required${NC}"
        exit 1
    fi
    echo "DOCKER_IMAGE=${IMAGE_NAME}" >> .env
fi

echo -e "${GREEN}Using image: ${IMAGE_NAME}${NC}"
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p nginx/conf.d nginx/ssl nginx/logs
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Check if nginx config exists
if [ ! -f "nginx/conf.d/default.conf" ]; then
    echo -e "${YELLOW}⚠️  Nginx config not found. Creating HTTP-only config for testing...${NC}"
    
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

    # Create nginx.conf if it doesn't exist
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
    
    echo -e "${GREEN}✓ Nginx config created${NC}"
    echo ""
fi

# Pull the latest image
echo "📥 Pulling Docker image..."
$DOCKER_COMPOSE -f docker-compose.production.yml pull || {
    echo -e "${YELLOW}⚠️  Failed to pull image. Make sure it exists in the registry.${NC}"
    echo -e "${YELLOW}   You may need to build and push it first.${NC}"
    exit 1
}
echo -e "${GREEN}✓ Image pulled${NC}"
echo ""

# Stop existing containers
echo "🛑 Stopping existing containers..."
$DOCKER_COMPOSE -f docker-compose.production.yml down 2>/dev/null || true
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

# Start containers
echo "🚀 Starting production containers..."
$DOCKER_COMPOSE -f docker-compose.production.yml up -d
echo -e "${GREEN}✓ Containers started${NC}"
echo ""

# Wait a bit for containers to start
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check container status
echo ""
echo "📊 Container Status:"
$DOCKER_COMPOSE -f docker-compose.production.yml ps

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "  1. Check logs: $DOCKER_COMPOSE -f docker-compose.production.yml logs -f"
echo "  2. Test health: curl http://localhost/health"
echo "  3. Access website: http://YOUR_SERVER_IP"
echo ""
echo "🔍 Troubleshooting:"
echo "  - View logs: $DOCKER_COMPOSE -f docker-compose.production.yml logs nextjs"
echo "  - View Nginx logs: $DOCKER_COMPOSE -f docker-compose.production.yml logs nginx"
echo "  - Restart: $DOCKER_COMPOSE -f docker-compose.production.yml restart"
echo ""
