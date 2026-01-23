#!/bin/bash

# Debug HTTPS Connection Issues

set -e

echo "🔍 Debugging HTTPS Connection Issues"
echo "====================================="
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Check if containers are running
echo -e "${BLUE}1. Container Status:${NC}"
docker-compose ps
echo ""

# 2. Check if port 443 is exposed
echo -e "${BLUE}2. Port 443 Exposure:${NC}"
if docker ps --format "{{.Names}}\t{{.Ports}}" | grep -q "443"; then
    echo -e "${GREEN}✓ Port 443 is exposed${NC}"
    docker ps --format "{{.Names}}\t{{.Ports}}" | grep 443
else
    echo -e "${RED}✗ Port 443 NOT exposed!${NC}"
fi
echo ""

# 3. Check if port 443 is listening
echo -e "${BLUE}3. Port 443 Listening:${NC}"
if netstat -tlnp 2>/dev/null | grep -q ":443 " || ss -tlnp 2>/dev/null | grep -q ":443 "; then
    echo -e "${GREEN}✓ Port 443 is listening${NC}"
    netstat -tlnp 2>/dev/null | grep ":443 " || ss -tlnp 2>/dev/null | grep ":443 "
else
    echo -e "${RED}✗ Port 443 NOT listening!${NC}"
fi
echo ""

# 4. Check firewall
echo -e "${BLUE}4. Firewall Status:${NC}"
if command -v ufw &> /dev/null; then
    ufw status | grep -E "(443|Status)" || echo "UFW not active or port 443 not configured"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --list-ports 2>/dev/null | grep -q "443" && echo "✓ Port 443 allowed" || echo "✗ Port 443 may be blocked"
else
    echo "No firewall detected (ufw/firewalld)"
fi
echo ""

# 5. Check SSL certificates
echo -e "${BLUE}5. SSL Certificates:${NC}"
if [ -f "nginx/ssl/cert.pem" ] && [ -f "nginx/ssl/key.pem" ]; then
    echo -e "${GREEN}✓ Certificates exist${NC}"
    ls -la nginx/ssl/
    
    # Check certificate validity
    echo ""
    echo "Certificate details:"
    openssl x509 -in nginx/ssl/cert.pem -noout -subject -dates 2>/dev/null || echo "Could not read certificate"
else
    echo -e "${RED}✗ Certificates missing!${NC}"
    echo "Expected: nginx/ssl/cert.pem and nginx/ssl/key.pem"
    ls -la nginx/ssl/ 2>/dev/null || echo "SSL directory doesn't exist"
fi
echo ""

# 6. Check Nginx config syntax
echo -e "${BLUE}6. Nginx Configuration:${NC}"
if docker-compose exec -T nginx nginx -t 2>&1; then
    echo -e "${GREEN}✓ Nginx config is valid${NC}"
else
    echo -e "${RED}✗ Nginx config has errors!${NC}"
fi
echo ""

# 7. Check Nginx logs for SSL errors
echo -e "${BLUE}7. Recent Nginx Logs (SSL related):${NC}"
docker-compose logs nginx 2>&1 | grep -i -E "(ssl|443|certificate|error)" | tail -10 || echo "No SSL errors in recent logs"
echo ""

# 8. Test HTTP (port 80)
echo -e "${BLUE}8. Testing HTTP (port 80):${NC}"
if curl -s -f -I http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ HTTP is working${NC}"
    curl -I http://localhost/health 2>&1 | head -3
else
    echo -e "${RED}✗ HTTP not working${NC}"
fi
echo ""

# 9. Test HTTPS from inside container
echo -e "${BLUE}9. Testing HTTPS from inside Nginx container:${NC}"
if docker-compose exec -T nginx wget --no-check-certificate -O- https://localhost/health 2>&1 | head -5; then
    echo -e "${GREEN}✓ HTTPS works from inside container${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS test from inside container failed${NC}"
fi
echo ""

# 10. Check if Nginx is listening on 443 inside container
echo -e "${BLUE}10. Nginx listening ports (inside container):${NC}"
docker-compose exec -T nginx netstat -tlnp 2>/dev/null | grep -E "(443|80)" || \
docker-compose exec -T nginx ss -tlnp 2>/dev/null | grep -E "(443|80)" || \
echo "Could not check listening ports"
echo ""

# Summary
echo -e "${BLUE}📋 Summary:${NC}"
echo ""
echo "Common fixes:"
echo "  1. Ensure docker-compose.yml exposes port 443:"
echo "     ports:"
echo "       - \"443:443\""
echo ""
echo "  2. Open firewall:"
echo "     sudo ufw allow 443/tcp"
echo ""
echo "  3. Check SSL certificates exist:"
echo "     ls -la nginx/ssl/cert.pem nginx/ssl/key.pem"
echo ""
echo "  4. Restart Nginx:"
echo "     docker-compose restart nginx"
echo ""
echo "  5. Check Nginx config:"
echo "     docker-compose exec nginx nginx -t"
echo ""
