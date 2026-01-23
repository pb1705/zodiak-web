#!/bin/bash

# Test and Fix Nginx Issues

set -e

echo "🔍 Testing Nginx Configuration"
echo "=============================="
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Test Nginx config syntax
echo -e "${BLUE}1. Testing Nginx Configuration Syntax...${NC}"
if docker-compose exec -T nginx nginx -t 2>&1; then
    echo -e "${GREEN}✓ Config is valid${NC}"
else
    echo -e "${RED}❌ Config has errors!${NC}"
    exit 1
fi
echo ""

# 2. Test HTTP endpoint
echo -e "${BLUE}2. Testing HTTP Endpoint...${NC}"
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health 2>&1)
if [ "$HTTP_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ HTTP health endpoint works (200 OK)${NC}"
elif [ "$HTTP_RESPONSE" = "000" ]; then
    echo -e "${RED}✗ Connection refused - Nginx not responding on port 80${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP returned: $HTTP_RESPONSE${NC}"
fi
echo ""

# 3. Test HTTPS endpoint
echo -e "${BLUE}3. Testing HTTPS Endpoint...${NC}"
HTTPS_RESPONSE=$(curl -k -s -o /dev/null -w "%{http_code}" https://localhost/health 2>&1)
if [ "$HTTPS_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ HTTPS health endpoint works (200 OK)${NC}"
elif [ "$HTTPS_RESPONSE" = "000" ]; then
    echo -e "${RED}✗ Connection refused - SSL may not be configured${NC}"
    echo "Checking SSL certificates..."
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        echo -e "${YELLOW}⚠️  SSL certificates missing!${NC}"
        echo "Fixing certificate names..."
        if [ -f "nginx/ssl/fullchain.pem" ]; then
            cp nginx/ssl/fullchain.pem nginx/ssl/cert.pem
            chmod 644 nginx/ssl/cert.pem
            echo "✓ Created cert.pem"
        fi
        if [ -f "nginx/ssl/privkey.pem" ]; then
            cp nginx/ssl/privkey.pem nginx/ssl/key.pem
            chmod 600 nginx/ssl/key.pem
            echo "✓ Created key.pem"
        fi
        echo "Restarting Nginx..."
        docker-compose restart nginx
        sleep 3
    fi
else
    echo -e "${YELLOW}⚠️  HTTPS returned: $HTTPS_RESPONSE${NC}"
fi
echo ""

# 4. Check SSL certificates
echo -e "${BLUE}4. Checking SSL Certificates...${NC}"
if [ -f "nginx/ssl/cert.pem" ] && [ -f "nginx/ssl/key.pem" ]; then
    echo -e "${GREEN}✓ Certificates exist${NC}"
    CERT_INFO=$(openssl x509 -in nginx/ssl/cert.pem -noout -subject -dates 2>/dev/null | head -2)
    if [ -n "$CERT_INFO" ]; then
        echo "Certificate info:"
        echo "$CERT_INFO"
    fi
else
    echo -e "${RED}✗ Certificates missing!${NC}"
    ls -la nginx/ssl/ 2>/dev/null || echo "SSL directory empty or doesn't exist"
fi
echo ""

# 5. Test Next.js backend
echo -e "${BLUE}5. Testing Next.js Backend...${NC}"
if docker-compose exec -T nginx wget --spider -q http://nextjs:3000/api/health 2>&1; then
    echo -e "${GREEN}✓ Next.js backend is accessible${NC}"
else
    echo -e "${RED}✗ Next.js backend not accessible!${NC}"
    echo "Checking Next.js container..."
    docker-compose ps nextjs
fi
echo ""

# 6. Test health check command (what Docker uses)
echo -e "${BLUE}6. Testing Docker Health Check Command...${NC}"
if docker-compose exec -T nginx wget --no-verbose --tries=1 --spider http://localhost/health 2>&1 | grep -q "200 OK"; then
    echo -e "${GREEN}✓ Health check command works${NC}"
else
    echo -e "${RED}✗ Health check command failed${NC}"
    echo "This is why container shows as unhealthy"
    echo ""
    echo "Testing health endpoint from inside container:"
    docker-compose exec -T nginx wget -O- http://localhost/health 2>&1 | head -5
fi
echo ""

# 7. Check for SSL errors in error log
echo -e "${BLUE}7. Checking for SSL Errors...${NC}"
SSL_ERRORS=$(docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | grep -i ssl | tail -5)
if [ -n "$SSL_ERRORS" ]; then
    echo -e "${YELLOW}⚠️  SSL errors found:${NC}"
    echo "$SSL_ERRORS"
else
    echo -e "${GREEN}✓ No SSL errors in logs${NC}"
fi
echo ""

# Summary and fixes
echo -e "${BLUE}📋 Summary & Recommendations:${NC}"
echo ""

if [ "$HTTPS_RESPONSE" = "000" ] && [ ! -f "nginx/ssl/cert.pem" ]; then
    echo -e "${YELLOW}⚠️  HTTPS not working - SSL certificates missing${NC}"
    echo ""
    echo "To fix:"
    echo "  1. Get SSL certificates:"
    echo "     sudo certbot certonly --standalone -d zodiak.life -d www.zodiak.life"
    echo ""
    echo "  2. Copy certificates:"
    echo "     cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/cert.pem"
    echo "     cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/key.pem"
    echo ""
    echo "  3. Restart:"
    echo "     docker-compose restart nginx"
elif [ "$HTTP_RESPONSE" != "200" ]; then
    echo -e "${YELLOW}⚠️  HTTP health check failing${NC}"
    echo "Check if Next.js is running and accessible"
elif [ "$HTTPS_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Everything looks good!${NC}"
    echo ""
    echo "If container still shows unhealthy, the health check may need adjustment."
    echo "You can temporarily disable it in docker-compose.yml if needed."
fi
echo ""
