#!/bin/bash

# Verify Deployment Status

set -e

echo "🔍 Verifying Zodiak Deployment"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Detect docker-compose command
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# 1. Check container status
echo -e "${BLUE}📊 Container Status:${NC}"
$DOCKER_COMPOSE ps
echo ""

# 2. Check images
echo -e "${BLUE}🖼️  Container Images:${NC}"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" | grep zodiak
echo ""

# 3. Wait a bit for health checks
echo -e "${YELLOW}⏳ Waiting for health checks (10 seconds)...${NC}"
sleep 10
echo ""

# 4. Check Next.js logs (last 20 lines)
echo -e "${BLUE}📋 Next.js Logs (last 20 lines):${NC}"
$DOCKER_COMPOSE logs --tail=20 nextjs
echo ""

# 5. Check Nginx logs (last 10 lines)
echo -e "${BLUE}📋 Nginx Logs (last 10 lines):${NC}"
$DOCKER_COMPOSE logs --tail=10 nginx
echo ""

# 6. Test health endpoints
echo -e "${BLUE}🏥 Health Check Tests:${NC}"

echo -n "  Next.js direct (port 3000): "
if curl -s -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
    curl -s http://localhost:3000/api/health | head -c 100
    echo ""
else
    echo -e "${RED}✗ Failed${NC}"
fi

echo -n "  Through Nginx (port 80): "
if curl -s -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ OK${NC}"
    curl -s http://localhost/health | head -c 100
    echo ""
else
    echo -e "${RED}✗ Failed${NC}"
fi

echo ""

# 7. Test main page
echo -e "${BLUE}🌐 Main Page Test:${NC}"
echo -n "  HTTP response: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo -e "${GREEN}✓ OK (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${YELLOW}⚠ Response code: $HTTP_CODE${NC}"
fi
echo ""

# 8. Network connectivity
echo -e "${BLUE}🔗 Network Check:${NC}"
if docker network inspect zodiak-deployment_zodiak-network > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Network exists${NC}"
    docker network inspect zodiak-deployment_zodiak-network --format '{{range .Containers}}{{.Name}} {{end}}'
    echo ""
else
    echo -e "${RED}✗ Network not found${NC}"
fi
echo ""

# 9. Summary
echo -e "${BLUE}📝 Summary:${NC}"
NEXTJS_STATUS=$(docker inspect zodiak-nextjs --format '{{.State.Status}}' 2>/dev/null || echo "not found")
NGINX_STATUS=$(docker inspect zodiak-nginx --format '{{.State.Status}}' 2>/dev/null || echo "not found")

echo "  Next.js: $NEXTJS_STATUS"
echo "  Nginx: $NGINX_STATUS"
echo ""

if [ "$NEXTJS_STATUS" = "running" ] && [ "$NGINX_STATUS" = "running" ]; then
    echo -e "${GREEN}✅ Deployment looks good!${NC}"
    echo ""
    echo "🌐 Access your website:"
    echo "   http://$(hostname -I | awk '{print $1}')"
    echo "   or"
    echo "   http://YOUR_SERVER_IP"
else
    echo -e "${YELLOW}⚠️  Some containers may still be starting...${NC}"
    echo "   Run: docker-compose logs -f"
fi
echo ""
