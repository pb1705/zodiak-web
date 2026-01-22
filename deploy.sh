#!/bin/bash

set -e

echo "🚀 Zodiak Website Deployment Script"
echo "===================================="

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
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    cp .docker-compose.env.example .env
    echo -e "${GREEN}✓ Created .env file. Please edit it with your configuration.${NC}"
    echo ""
    read -p "Press Enter to continue after editing .env file..."
fi

# Check if SSL certificates exist
if [ ! -f nginx/ssl/cert.pem ] || [ ! -f nginx/ssl/key.pem ]; then
    echo -e "${YELLOW}⚠️  SSL certificates not found in nginx/ssl/${NC}"
    echo "Options:"
    echo "1. Use Let's Encrypt (recommended for production)"
    echo "2. Generate self-signed certificates (for testing)"
    echo "3. Skip (you'll need to add certificates manually)"
    read -p "Choose option (1-3): " ssl_option
    
    case $ssl_option in
        1)
            echo "Please run: sudo certbot certonly --standalone -d your-domain.com"
            echo "Then copy certificates to nginx/ssl/"
            exit 1
            ;;
        2)
            echo "Generating self-signed certificates..."
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
              -keyout nginx/ssl/key.pem \
              -out nginx/ssl/cert.pem \
              -subj "/C=US/ST=State/L=City/O=Zodiak/CN=localhost"
            echo -e "${GREEN}✓ Self-signed certificates generated${NC}"
            ;;
        3)
            echo -e "${YELLOW}⚠️  Skipping SSL setup. Make sure to add certificates before starting.${NC}"
            ;;
    esac
fi

# Build and start services
echo ""
echo -e "${GREEN}📦 Building Docker images...${NC}"
docker-compose -f docker-compose.prod.yml build

echo ""
echo -e "${GREEN}🚀 Starting services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo ""
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 10

# Check service status
echo ""
echo -e "${GREEN}📊 Service Status:${NC}"
docker-compose -f docker-compose.prod.yml ps

# Health checks
echo ""
echo -e "${GREEN}🏥 Running health checks...${NC}"

if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Nginx is healthy${NC}"
else
    echo -e "${RED}❌ Nginx health check failed${NC}"
fi

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Next.js is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Next.js health check failed (may still be starting)${NC}"
fi

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Useful commands:"
echo "  View logs:        docker-compose -f docker-compose.prod.yml logs -f"
echo "  Stop services:    docker-compose -f docker-compose.prod.yml down"
echo "  Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "  Check status:     docker-compose -f docker-compose.prod.yml ps"
echo ""
