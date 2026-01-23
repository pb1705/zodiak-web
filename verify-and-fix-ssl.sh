#!/bin/bash

# Verify SSL Certificates and Fix Connection

set -e

echo "🔍 Verifying SSL Certificates"
echo "============================="
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Check certificate files
echo -e "${BLUE}1. Certificate Files:${NC}"
ls -lh nginx/ssl/cert.pem nginx/ssl/key.pem
echo ""

# 2. Verify certificate format
echo -e "${BLUE}2. Verifying Certificate Format...${NC}"
if openssl x509 -in nginx/ssl/cert.pem -noout -text > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Certificate format is valid${NC}"
    echo ""
    echo "Certificate details:"
    openssl x509 -in nginx/ssl/cert.pem -noout -subject -dates 2>/dev/null
else
    echo -e "${RED}✗ Certificate is invalid or corrupted!${NC}"
    echo "You need to regenerate certificates"
    exit 1
fi
echo ""

# 3. Verify private key format
echo -e "${BLUE}3. Verifying Private Key Format...${NC}"
if openssl rsa -in nginx/ssl/key.pem -check -noout > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Private key format is valid${NC}"
else
    echo -e "${RED}✗ Private key is invalid or corrupted!${NC}"
    exit 1
fi
echo ""

# 4. Check if certificate and key match
echo -e "${BLUE}4. Verifying Certificate and Key Match...${NC}"
CERT_MODULUS=$(openssl x509 -noout -modulus -in nginx/ssl/cert.pem 2>/dev/null | openssl md5)
KEY_MODULUS=$(openssl rsa -noout -modulus -in nginx/ssl/key.pem 2>/dev/null | openssl md5)

if [ "$CERT_MODULUS" = "$KEY_MODULUS" ]; then
    echo -e "${GREEN}✓ Certificate and key match${NC}"
else
    echo -e "${RED}✗ Certificate and key do NOT match!${NC}"
    echo "You need to regenerate matching certificates"
    exit 1
fi
echo ""

# 5. Check file permissions
echo -e "${BLUE}5. Checking File Permissions...${NC}"
chmod 644 nginx/ssl/cert.pem
chmod 600 nginx/ssl/key.pem
echo -e "${GREEN}✓ Permissions set correctly${NC}"
ls -la nginx/ssl/cert.pem nginx/ssl/key.pem
echo ""

# 6. Test Nginx config
echo -e "${BLUE}6. Testing Nginx Configuration...${NC}"
if docker-compose exec -T nginx nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx config is valid${NC}"
else
    echo -e "${RED}✗ Nginx config has errors!${NC}"
    docker-compose exec -T nginx nginx -t
    exit 1
fi
echo ""

# 7. Check Nginx error log for SSL errors
echo -e "${BLUE}7. Checking Nginx Error Log...${NC}"
SSL_ERRORS=$(docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | grep -i ssl | tail -5)
if [ -n "$SSL_ERRORS" ]; then
    echo -e "${YELLOW}⚠️  SSL errors found:${NC}"
    echo "$SSL_ERRORS"
    echo ""
    echo "Clearing error log and restarting..."
    docker-compose exec nginx sh -c "echo '' > /var/log/nginx/error.log"
else
    echo -e "${GREEN}✓ No SSL errors in log${NC}"
fi
echo ""

# 8. Restart Nginx
echo -e "${BLUE}8. Restarting Nginx...${NC}"
docker-compose restart nginx
sleep 5
echo -e "${GREEN}✓ Nginx restarted${NC}"
echo ""

# 9. Test HTTPS connection
echo -e "${BLUE}9. Testing HTTPS Connection...${NC}"
sleep 2

# Test from inside container first
echo "Testing from inside container:"
if docker-compose exec -T nginx wget --no-check-certificate -O- https://localhost/health 2>&1 | head -3; then
    echo -e "${GREEN}✓ HTTPS works from inside container${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS test from inside container failed${NC}"
fi
echo ""

# Test from host
echo "Testing from host:"
if curl -k -s -f https://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTPS is working!${NC}"
    curl -k -I https://localhost/health 2>&1 | head -3
else
    echo -e "${YELLOW}⚠️  HTTPS test from host failed${NC}"
    echo ""
    echo "Checking error log again..."
    docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | tail -10
fi
echo ""

# 10. Check if port 443 is listening
echo -e "${BLUE}10. Checking Port 443...${NC}"
if netstat -tlnp 2>/dev/null | grep -q ":443 " || ss -tlnp 2>/dev/null | grep -q ":443 "; then
    echo -e "${GREEN}✓ Port 443 is listening${NC}"
    netstat -tlnp 2>/dev/null | grep ":443 " || ss -tlnp 2>/dev/null | grep ":443 "
else
    echo -e "${RED}✗ Port 443 is NOT listening!${NC}"
    echo "Nginx may not have started HTTPS server"
fi
echo ""

echo -e "${BLUE}📋 Summary:${NC}"
echo ""
echo "If HTTPS still doesn't work:"
echo "  1. Check certificate expiry: openssl x509 -in nginx/ssl/cert.pem -noout -dates"
echo "  2. Check Nginx logs: docker-compose logs nginx | tail -30"
echo "  3. Check error log: docker-compose exec nginx cat /var/log/nginx/error.log"
echo "  4. Test from outside: curl -k -I https://zodiak.life"
echo "  5. Verify Nginx is listening: docker-compose exec nginx netstat -tlnp | grep 443"
echo ""
