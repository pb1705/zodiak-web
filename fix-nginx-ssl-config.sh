#!/bin/bash

# Fix Nginx SSL Configuration - Certificates Match, Check Nginx

set -e

echo "🔧 Fixing Nginx SSL Configuration"
echo "=================================="
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Check Nginx error log
echo -e "${BLUE}1. Checking Nginx Error Log...${NC}"
ERROR_LOG=$(docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | tail -30)
echo "$ERROR_LOG"
echo ""

# 2. Check if Nginx is listening on 443
echo -e "${BLUE}2. Checking if Nginx is Listening on 443...${NC}"
LISTENING=$(docker-compose exec -T nginx netstat -tlnp 2>/dev/null | grep ":443 " || \
            docker-compose exec -T nginx ss -tlnp 2>/dev/null | grep ":443 " || \
            echo "NOT_FOUND")

if [ "$LISTENING" != "NOT_FOUND" ]; then
    echo -e "${GREEN}✓ Nginx is listening on port 443${NC}"
    echo "$LISTENING"
else
    echo -e "${RED}✗ Nginx is NOT listening on port 443!${NC}"
    echo "This means the HTTPS server block is not working"
    echo ""
    echo "Checking Nginx config..."
fi
echo ""

# 3. Check Nginx config for HTTPS
echo -e "${BLUE}3. Checking Nginx HTTPS Configuration...${NC}"
if grep -q "listen 443 ssl" nginx/conf.d/default.conf; then
    echo -e "${GREEN}✓ HTTPS server block exists${NC}"
    echo ""
    echo "SSL server configuration:"
    grep -A 10 "listen 443 ssl" nginx/conf.d/default.conf | head -15
else
    echo -e "${RED}✗ No HTTPS server block found!${NC}"
    echo "Nginx config doesn't have 'listen 443 ssl'"
fi
echo ""

# 4. Test Nginx config syntax
echo -e "${BLUE}4. Testing Nginx Configuration Syntax...${NC}"
NGINX_TEST=$(docker-compose exec -T nginx nginx -t 2>&1)
echo "$NGINX_TEST"

if echo "$NGINX_TEST" | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx config is valid${NC}"
else
    echo -e "${RED}✗ Nginx config has errors!${NC}"
    echo "Fix the errors above"
    exit 1
fi
echo ""

# 5. Check SSL certificate paths in config
echo -e "${BLUE}5. Checking SSL Certificate Paths in Config...${NC}"
CERT_PATH=$(grep "ssl_certificate " nginx/conf.d/default.conf | head -1 | awk '{print $2}' | tr -d ';')
KEY_PATH=$(grep "ssl_certificate_key " nginx/conf.d/default.conf | head -1 | awk '{print $2}' | tr -d ';')

echo "Certificate path in config: $CERT_PATH"
echo "Key path in config: $KEY_PATH"
echo ""

# Check if files exist at those paths inside container
if docker-compose exec -T nginx test -f "$CERT_PATH" 2>/dev/null; then
    echo -e "${GREEN}✓ Certificate file exists at configured path${NC}"
else
    echo -e "${RED}✗ Certificate file NOT found at configured path!${NC}"
    echo "Expected: $CERT_PATH"
    echo "This is likely the problem!"
fi

if docker-compose exec -T nginx test -f "$KEY_PATH" 2>/dev/null; then
    echo -e "${GREEN}✓ Key file exists at configured path${NC}"
else
    echo -e "${RED}✗ Key file NOT found at configured path!${NC}"
    echo "Expected: $KEY_PATH"
    echo "This is likely the problem!"
fi
echo ""

# 6. Reload Nginx config
echo -e "${BLUE}6. Reloading Nginx Configuration...${NC}"
docker-compose exec nginx nginx -s reload 2>&1 || {
    echo -e "${YELLOW}⚠️  Reload failed, restarting...${NC}"
    docker-compose restart nginx
    sleep 5
}
echo -e "${GREEN}✓ Nginx reloaded/restarted${NC}"
echo ""

# 7. Check error log again
echo -e "${BLUE}7. Checking Error Log After Reload...${NC}"
sleep 2
NEW_ERRORS=$(docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | tail -10)
if [ -n "$NEW_ERRORS" ]; then
    echo "$NEW_ERRORS"
else
    echo "No new errors"
fi
echo ""

# 8. Test HTTPS
echo -e "${BLUE}8. Testing HTTPS Connection...${NC}"
sleep 2
if curl -k -s -f https://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTPS is working!${NC}"
    curl -k -I https://localhost/health 2>&1 | head -3
else
    echo -e "${YELLOW}⚠️  HTTPS still not working${NC}"
    echo ""
    echo "Testing with verbose output:"
    curl -k -v https://localhost/health 2>&1 | grep -A 10 "SSL\|TLS\|error" | head -15
fi
echo ""

# Summary
echo -e "${BLUE}📋 Summary:${NC}"
echo ""
echo "If HTTPS still doesn't work:"
echo "  1. Check error log: docker-compose exec nginx cat /var/log/nginx/error.log | tail -20"
echo "  2. Verify Nginx is listening: docker-compose exec nginx netstat -tlnp | grep 443"
echo "  3. Check certificate paths match: grep ssl_certificate nginx/conf.d/default.conf"
echo "  4. Test from outside: curl -k -v https://zodiak.life"
echo ""
