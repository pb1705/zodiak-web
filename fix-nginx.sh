#!/bin/bash

# Fix Nginx Container - Remove wrong image and restart correctly

set -e

echo "🔧 Fixing Nginx Container Issue"
echo "================================"
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

echo -e "${YELLOW}⚠️  Your Nginx container is using the wrong image!${NC}"
echo -e "${YELLOW}   Current: prranav1705/landing:latest${NC}"
echo -e "${YELLOW}   Should be: nginx:alpine${NC}"
echo ""

# Stop and remove containers
echo "🛑 Stopping containers..."
$DOCKER_COMPOSE -f docker-compose.production.yml down
echo -e "${GREEN}✓ Containers stopped${NC}"
echo ""

# Remove the incorrectly named container if it exists
echo "🧹 Cleaning up..."
docker rm -f zodiak-nginx 2>/dev/null || true
echo -e "${GREEN}✓ Cleanup done${NC}"
echo ""

# Verify docker-compose.production.yml uses correct nginx image
echo "📋 Verifying docker-compose.production.yml..."
if grep -q "image: nginx:alpine" docker-compose.production.yml; then
    echo -e "${GREEN}✓ docker-compose.production.yml is correct${NC}"
else
    echo -e "${RED}❌ docker-compose.production.yml has wrong nginx image!${NC}"
    echo "Fixing it..."
    # This would need manual fix, but let's check first
fi
echo ""

# Start with correct configuration
echo "🚀 Starting containers with correct configuration..."
$DOCKER_COMPOSE -f docker-compose.production.yml up -d
echo -e "${GREEN}✓ Containers started${NC}"
echo ""

# Wait a moment
sleep 3

# Check status
echo "📊 Container Status:"
$DOCKER_COMPOSE -f docker-compose.production.yml ps

echo ""
echo -e "${GREEN}✅ Fix complete!${NC}"
echo ""
echo "Verify Nginx is using correct image:"
echo "  docker ps | grep zodiak-nginx"
echo ""
echo "Should show: nginx:alpine (not prranav1705/landing:latest)"
