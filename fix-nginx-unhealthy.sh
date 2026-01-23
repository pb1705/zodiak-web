#!/bin/bash

# Fix Nginx Unhealthy Status

set -e

echo "🔧 Fixing Nginx Unhealthy Status"
echo "================================"
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Check Nginx logs
echo -e "${BLUE}1. Checking Nginx Logs...${NC}"
echo ""
docker-compose logs nginx | tail -30
echo ""

# 2. Check Nginx config syntax
echo -e "${BLUE}2. Testing Nginx Configuration...${NC}"
if docker-compose exec -T nginx nginx -t 2>&1; then
    echo -e "${GREEN}✓ Config is valid${NC}"
else
    echo -e "${RED}❌ Config has errors!${NC}"
    echo "Fix the errors above and restart"
    exit 1
fi
echo ""

# 3. Check SSL certificates
echo -e "${BLUE}3. Checking SSL Certificates...${NC}"
if [ -f "nginx/ssl/cert.pem" ] && [ -f "nginx/ssl/key.pem" ]; then
    echo -e "${GREEN}✓ Certificates exist${NC}"
    ls -la nginx/ssl/cert.pem nginx/ssl/key.pem
    
    # Check if certificates are readable
    if [ -r "nginx/ssl/cert.pem" ] && [ -r "nginx/ssl/key.pem" ]; then
        echo -e "${GREEN}✓ Certificates are readable${NC}"
    else
        echo -e "${YELLOW}⚠️  Fixing permissions...${NC}"
        chmod 644 nginx/ssl/cert.pem
        chmod 600 nginx/ssl/key.pem
    fi
else
    echo -e "${RED}❌ Certificates missing!${NC}"
    echo "Expected: nginx/ssl/cert.pem and nginx/ssl/key.pem"
    ls -la nginx/ssl/ 2>/dev/null || echo "SSL directory doesn't exist"
    exit 1
fi
echo ""

# 4. Check if health endpoint works
echo -e "${BLUE}4. Testing Health Endpoints...${NC}"
echo -n "HTTP health: "
if curl -s -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Working${NC}"
else
    echo -e "${RED}✗ Failed${NC}"
fi

echo -n "HTTPS health: "
if curl -k -s -f https://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Working${NC}"
else
    echo -e "${YELLOW}⚠️  Failed (may be SSL issue)${NC}"
fi
echo ""

# 5. Check health check command
echo -e "${BLUE}5. Testing Health Check Command...${NC}"
if docker-compose exec -T nginx wget --no-check-certificate -O- http://localhost/health 2>&1 | head -3; then
    echo -e "${GREEN}✓ Health check works${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    echo "This is why container shows as unhealthy"
fi
echo ""

# 6. Check if Next.js is accessible
echo -e "${BLUE}6. Checking Next.js Backend...${NC}"
if docker-compose exec -T nginx wget --spider -q http://nextjs:3000/api/health 2>&1; then
    echo -e "${GREEN}✓ Next.js is accessible from Nginx${NC}"
else
    echo -e "${RED}✗ Next.js not accessible!${NC}"
    echo "Check if Next.js container is running:"
    docker-compose ps nextjs
fi
echo ""

# 7. Reload Nginx config
echo -e "${BLUE}7. Reloading Nginx Configuration...${NC}"
docker-compose exec nginx nginx -s reload 2>&1 || {
    echo -e "${YELLOW}⚠️  Reload failed, restarting...${NC}"
    docker-compose restart nginx
    sleep 3
}
echo -e "${GREEN}✓ Nginx reloaded${NC}"
echo ""

# 8. Wait and check status
echo -e "${BLUE}8. Waiting for Health Check...${NC}"
sleep 5
docker-compose ps nginx
echo ""

# Summary
echo -e "${BLUE}📋 Summary:${NC}"
echo ""
echo "If still unhealthy, common fixes:"
echo ""
echo "1. Ensure Next.js is running:"
echo "   docker-compose ps nextjs"
echo ""
echo "2. Check health check endpoint:"
echo "   curl http://localhost/health"
echo ""
echo "3. Check Nginx can reach Next.js:"
echo "   docker-compose exec nginx wget -O- http://nextjs:3000/api/health"
echo ""
echo "4. Review full logs:"
echo "   docker-compose logs nginx"
echo "   docker-compose logs nextjs"
echo ""
