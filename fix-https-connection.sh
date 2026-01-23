#!/bin/bash

# Fix HTTPS Connection Refused Issues

set -e

echo "🔧 Fixing HTTPS Connection Issues"
echo "=================================="
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Check and fix SSL certificates
echo -e "${BLUE}1. Checking SSL Certificates...${NC}"
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    echo -e "${YELLOW}⚠️  Certificates missing or wrong names${NC}"
    
    if [ -f "nginx/ssl/fullchain.pem" ]; then
        echo "Copying fullchain.pem → cert.pem"
        cp nginx/ssl/fullchain.pem nginx/ssl/cert.pem
        chmod 644 nginx/ssl/cert.pem
    fi
    
    if [ -f "nginx/ssl/privkey.pem" ]; then
        echo "Copying privkey.pem → key.pem"
        cp nginx/ssl/privkey.pem nginx/ssl/key.pem
        chmod 600 nginx/ssl/key.pem
    fi
    
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        echo -e "${RED}❌ SSL certificates not found!${NC}"
        echo "Please run SSL setup first or copy certificates to nginx/ssl/"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Certificates exist${NC}"
fi
echo ""

# 2. Check Nginx config syntax
echo -e "${BLUE}2. Checking Nginx Configuration...${NC}"
if docker-compose exec -T nginx nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx config is valid${NC}"
else
    echo -e "${RED}❌ Nginx config has errors!${NC}"
    docker-compose exec -T nginx nginx -t
    exit 1
fi
echo ""

# 3. Check firewall
echo -e "${BLUE}3. Checking Firewall...${NC}"
if command -v ufw &> /dev/null; then
    if ufw status | grep -q "Status: active"; then
        if ufw status | grep -q "443"; then
            echo -e "${GREEN}✓ Port 443 is allowed${NC}"
        else
            echo -e "${YELLOW}⚠️  Port 443 not in firewall rules. Adding...${NC}"
            sudo ufw allow 443/tcp
            echo -e "${GREEN}✓ Port 443 added to firewall${NC}"
        fi
    else
        echo "Firewall is inactive"
    fi
else
    echo "UFW not installed (may not be needed)"
fi
echo ""

# 4. Restart Nginx
echo -e "${BLUE}4. Restarting Nginx...${NC}"
docker-compose restart nginx
sleep 3
echo -e "${GREEN}✓ Nginx restarted${NC}"
echo ""

# 5. Check if port 443 is exposed
echo -e "${BLUE}5. Verifying Port 443 Exposure...${NC}"
if docker ps --format "{{.Names}}\t{{.Ports}}" | grep zodiak-nginx | grep -q "443"; then
    echo -e "${GREEN}✓ Port 443 is exposed${NC}"
    docker ps --format "{{.Names}}\t{{.Ports}}" | grep zodiak-nginx
else
    echo -e "${RED}❌ Port 443 NOT exposed!${NC}"
    echo "Check docker-compose.yml has:"
    echo "  ports:"
    echo "    - \"443:443\""
    exit 1
fi
echo ""

# 6. Check if port is listening
echo -e "${BLUE}6. Checking if Port 443 is Listening...${NC}"
sleep 2
if netstat -tlnp 2>/dev/null | grep -q ":443 " || ss -tlnp 2>/dev/null | grep -q ":443 "; then
    echo -e "${GREEN}✓ Port 443 is listening${NC}"
    netstat -tlnp 2>/dev/null | grep ":443 " || ss -tlnp 2>/dev/null | grep ":443 "
else
    echo -e "${YELLOW}⚠️  Port 443 not showing as listening (may need a moment)${NC}"
fi
echo ""

# 7. Test HTTPS
echo -e "${BLUE}7. Testing HTTPS Connection...${NC}"
echo "Testing from localhost..."
if curl -k -s -f -I https://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ HTTPS works locally!${NC}"
    curl -k -I https://localhost/health 2>&1 | head -3
else
    echo -e "${YELLOW}⚠️  HTTPS test failed locally${NC}"
    echo "Checking Nginx logs..."
    docker-compose logs nginx | tail -10
fi
echo ""

# 8. Check Nginx logs for SSL errors
echo -e "${BLUE}8. Checking Nginx Logs for SSL Errors...${NC}"
ERRORS=$(docker-compose logs nginx 2>&1 | grep -i -E "(ssl|443|certificate|error|failed)" | tail -5)
if [ -n "$ERRORS" ]; then
    echo -e "${YELLOW}⚠️  Found potential issues:${NC}"
    echo "$ERRORS"
else
    echo -e "${GREEN}✓ No SSL errors in logs${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}📋 Summary:${NC}"
echo ""
echo "If HTTPS still doesn't work:"
echo ""
echo "1. Check from outside:"
echo "   curl -I https://zodiak.life"
echo ""
echo "2. Check firewall on server:"
echo "   sudo ufw status"
echo "   sudo ufw allow 443/tcp"
echo ""
echo "3. Check Nginx logs:"
echo "   docker-compose logs nginx | tail -20"
echo ""
echo "4. Verify certificates:"
echo "   ls -la nginx/ssl/"
echo "   openssl x509 -in nginx/ssl/cert.pem -noout -text | head -20"
echo ""
echo "5. Test Nginx config:"
echo "   docker-compose exec nginx nginx -t"
echo ""
echo "6. Check if domain DNS points to server:"
echo "   dig zodiak.life"
echo ""
