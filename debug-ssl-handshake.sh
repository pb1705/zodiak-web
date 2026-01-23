#!/bin/bash

# Debug SSL Handshake Failure

set -e

echo "🔍 Debugging SSL Handshake Failure"
echo "==================================="
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
if [ -n "$ERROR_LOG" ]; then
    echo "$ERROR_LOG"
else
    echo "No errors in log (or log is empty)"
fi
echo ""

# 2. Check if Nginx is listening on 443
echo -e "${BLUE}2. Checking if Nginx is Listening on Port 443...${NC}"
if docker-compose exec -T nginx netstat -tlnp 2>/dev/null | grep -q ":443 " || \
   docker-compose exec -T nginx ss -tlnp 2>/dev/null | grep -q ":443 "; then
    echo -e "${GREEN}✓ Nginx is listening on port 443${NC}"
    docker-compose exec -T nginx netstat -tlnp 2>/dev/null | grep ":443 " || \
    docker-compose exec -T nginx ss -tlnp 2>/dev/null | grep ":443 "
else
    echo -e "${RED}✗ Nginx is NOT listening on port 443!${NC}"
    echo "This is the problem!"
fi
echo ""

# 3. Check SSL configuration in Nginx config
echo -e "${BLUE}3. Checking SSL Configuration...${NC}"
if grep -q "listen 443 ssl" nginx/conf.d/default.conf; then
    echo -e "${GREEN}✓ HTTPS server block exists${NC}"
    echo ""
    echo "SSL server block:"
    grep -A 5 "listen 443 ssl" nginx/conf.d/default.conf | head -10
else
    echo -e "${RED}✗ No HTTPS server block found!${NC}"
    echo "Nginx config doesn't have 'listen 443 ssl'"
fi
echo ""

# 4. Check if certificates are readable by Nginx
echo -e "${BLUE}4. Checking Certificate Accessibility...${NC}"
if docker-compose exec -T nginx test -r /etc/nginx/ssl/cert.pem && \
   docker-compose exec -T nginx test -r /etc/nginx/ssl/key.pem; then
    echo -e "${GREEN}✓ Nginx can read certificate files${NC}"
    
    # Check file sizes
    CERT_SIZE=$(docker-compose exec -T nginx stat -c%s /etc/nginx/ssl/cert.pem 2>/dev/null || echo "0")
    KEY_SIZE=$(docker-compose exec -T nginx stat -c%s /etc/nginx/ssl/key.pem 2>/dev/null || echo "0")
    echo "Certificate size: $CERT_SIZE bytes"
    echo "Key size: $KEY_SIZE bytes"
    
    if [ "$CERT_SIZE" -lt 100 ] || [ "$KEY_SIZE" -lt 100 ]; then
        echo -e "${RED}✗ Certificate files are too small (likely empty or corrupted)!${NC}"
    fi
else
    echo -e "${RED}✗ Nginx cannot read certificate files!${NC}"
    echo "Check permissions and file paths"
fi
echo ""

# 5. Test Nginx config syntax
echo -e "${BLUE}5. Testing Nginx Configuration Syntax...${NC}"
NGINX_TEST=$(docker-compose exec -T nginx nginx -t 2>&1)
echo "$NGINX_TEST"
if echo "$NGINX_TEST" | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx config is valid${NC}"
else
    echo -e "${RED}✗ Nginx config has errors!${NC}"
    echo "Fix the errors above"
fi
echo ""

# 6. Check certificate validity
echo -e "${BLUE}6. Verifying Certificate Validity...${NC}"
if openssl x509 -in nginx/ssl/cert.pem -noout -text > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Certificate is valid${NC}"
    CERT_SUBJECT=$(openssl x509 -in nginx/ssl/cert.pem -noout -subject 2>/dev/null)
    CERT_DATES=$(openssl x509 -in nginx/ssl/cert.pem -noout -dates 2>/dev/null)
    echo "Subject: $CERT_SUBJECT"
    echo "$CERT_DATES"
else
    echo -e "${RED}✗ Certificate is invalid!${NC}"
fi
echo ""

# 7. Verify certificate and key match (ECDSA)
echo -e "${BLUE}7. Verifying Certificate and Key Match (ECDSA)...${NC}"
CERT_PUBKEY=$(openssl x509 -in nginx/ssl/cert.pem -noout -pubkey 2>/dev/null | openssl md5 | awk '{print $NF}')
KEY_PUBKEY=$(openssl ec -in nginx/ssl/key.pem -pubout 2>/dev/null | openssl md5 | awk '{print $NF}')

echo "Certificate public key hash: $CERT_PUBKEY"
echo "Key public key hash: $KEY_PUBKEY"

if [ "$CERT_PUBKEY" = "$KEY_PUBKEY" ]; then
    echo -e "${GREEN}✓ Certificate and key match!${NC}"
else
    echo -e "${RED}✗ Certificate and key do NOT match!${NC}"
    echo "This is likely the problem!"
fi
echo ""

# 8. Check SSL protocols and ciphers
echo -e "${BLUE}8. Checking SSL Configuration Details...${NC}"
echo "SSL protocols:"
grep "ssl_protocols" nginx/conf.d/default.conf || echo "Not specified"
echo ""
echo "SSL ciphers:"
grep "ssl_ciphers" nginx/conf.d/default.conf | head -1 || echo "Not specified"
echo ""

# 9. Restart Nginx and check
echo -e "${BLUE}9. Restarting Nginx...${NC}"
docker-compose restart nginx
sleep 5
echo -e "${GREEN}✓ Nginx restarted${NC}"
echo ""

# 10. Check if HTTPS is now working
echo -e "${BLUE}10. Testing HTTPS Again...${NC}"
sleep 2
if curl -k -s -f https://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTPS is working!${NC}"
    curl -k -I https://localhost/health 2>&1 | head -3
else
    echo -e "${YELLOW}⚠️  HTTPS still not working${NC}"
    echo ""
    echo "Check the error log again:"
    docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | tail -10
fi
echo ""

# Summary
echo -e "${BLUE}📋 Summary & Next Steps:${NC}"
echo ""
echo "Common fixes:"
echo "  1. If certificate/key don't match: Regenerate certificates"
echo "  2. If Nginx can't read files: Check permissions (chmod 644 cert.pem, chmod 600 key.pem)"
echo "  3. If config has errors: Fix nginx/conf.d/default.conf"
echo "  4. If port 443 not listening: Check docker-compose.yml ports mapping"
echo ""
echo "Check error log:"
echo "  docker-compose exec nginx cat /var/log/nginx/error.log | tail -20"
echo ""
