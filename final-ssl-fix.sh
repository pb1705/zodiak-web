#!/bin/bash

# Final SSL Fix - Certificate is Correct, Find Real Issue

set -e

echo "🔧 Final SSL Fix"
echo "================"
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Verify certificate and key match (ECDSA)
echo -e "${BLUE}1. Verifying Certificate and Key Match (ECDSA)...${NC}"
CERT_PUBKEY=$(openssl x509 -in nginx/ssl/cert.pem -noout -pubkey 2>/dev/null | openssl md5 | awk '{print $NF}')
KEY_PUBKEY=$(openssl ec -in nginx/ssl/key.pem -pubout 2>/dev/null | openssl md5 | awk '{print $NF}')

echo "Certificate public key hash: $CERT_PUBKEY"
echo "Key public key hash: $KEY_PUBKEY"
echo ""

if [ "$CERT_PUBKEY" = "$KEY_PUBKEY" ]; then
    echo -e "${GREEN}✅ Certificate and key match!${NC}"
    MATCH="YES"
else
    echo -e "${RED}✗ Certificate and key do NOT match!${NC}"
    echo "This is the problem!"
    MATCH="NO"
fi
echo ""

# 2. Check file permissions
echo -e "${BLUE}2. Checking File Permissions...${NC}"
chmod 644 nginx/ssl/cert.pem
chmod 600 nginx/ssl/key.pem
ls -la nginx/ssl/cert.pem nginx/ssl/key.pem
echo ""

# 3. Check if Nginx can read files
echo -e "${BLUE}3. Checking if Nginx Can Read Certificates...${NC}"
if docker-compose exec -T nginx test -r /etc/nginx/ssl/cert.pem && \
   docker-compose exec -T nginx test -r /etc/nginx/ssl/key.pem; then
    echo -e "${GREEN}✓ Nginx can read certificate files${NC}"
else
    echo -e "${RED}✗ Nginx cannot read certificate files!${NC}"
    echo "Fixing permissions..."
    chmod 644 nginx/ssl/cert.pem
    chmod 600 nginx/ssl/key.pem
    docker-compose restart nginx
    sleep 3
fi
echo ""

# 4. Check Nginx error log
echo -e "${BLUE}4. Checking Nginx Error Log...${NC}"
ERRORS=$(docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | tail -30)
if [ -n "$ERRORS" ]; then
    echo "$ERRORS"
    echo ""
    SSL_ERROR=$(echo "$ERRORS" | grep -i -E "(ssl|certificate|key|error)" | tail -5)
    if [ -n "$SSL_ERROR" ]; then
        echo -e "${YELLOW}⚠️  SSL-related errors found:${NC}"
        echo "$SSL_ERROR"
    fi
else
    echo "No errors in log"
fi
echo ""

# 5. Test Nginx config
echo -e "${BLUE}5. Testing Nginx Configuration...${NC}"
if docker-compose exec -T nginx nginx -t 2>&1; then
    echo -e "${GREEN}✓ Nginx config is valid${NC}"
else
    echo -e "${RED}✗ Nginx config has errors!${NC}"
fi
echo ""

# 6. Check if Nginx is listening on 443
echo -e "${BLUE}6. Checking if Nginx is Listening on 443...${NC}"
if docker-compose exec -T nginx netstat -tlnp 2>/dev/null | grep -q ":443 " || \
   docker-compose exec -T nginx ss -tlnp 2>/dev/null | grep -q ":443 "; then
    echo -e "${GREEN}✓ Nginx is listening on port 443${NC}"
    docker-compose exec -T nginx netstat -tlnp 2>/dev/null | grep ":443 " || \
    docker-compose exec -T nginx ss -tlnp 2>/dev/null | grep ":443 "
else
    echo -e "${RED}✗ Nginx is NOT listening on port 443!${NC}"
    echo "This means HTTPS server block is not working"
fi
echo ""

# 7. If certificate/key don't match, regenerate
if [ "$MATCH" = "NO" ]; then
    echo -e "${BLUE}7. Regenerating Matching Certificates...${NC}"
    echo "Certificate and key don't match. Regenerating..."
    echo ""
    
    docker-compose stop nginx
    
    # Delete and recreate with RSA (more compatible)
    sudo certbot delete --cert-name zodiak.life 2>/dev/null || true
    
    sudo certbot certonly --standalone \
        -d zodiak.life \
        -d www.zodiak.life \
        --key-type rsa \
        --rsa-key-size 2048 \
        --non-interactive \
        --agree-tos \
        --email prranavbabbar2317@gmail.com
    
    sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/cert.pem
    sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/key.pem
    sudo chmod 644 nginx/ssl/cert.pem
    sudo chmod 600 nginx/ssl/key.pem
    
    echo ""
    echo "Verifying match..."
    CERT_MOD=$(openssl x509 -noout -modulus -in nginx/ssl/cert.pem 2>/dev/null | openssl md5 | awk '{print $NF}')
    KEY_MOD=$(openssl rsa -noout -modulus -in nginx/ssl/key.pem 2>/dev/null | openssl md5 | awk '{print $NF}')
    
    if [ "$CERT_MOD" = "$KEY_MOD" ]; then
        echo -e "${GREEN}✓ New certificates match!${NC}"
    else
        echo -e "${RED}✗ Still don't match!${NC}"
    fi
    
    docker-compose up -d nginx
    sleep 5
fi

# 8. Final test
echo -e "${BLUE}8. Final HTTPS Test...${NC}"
sleep 2
if curl -k -s -f https://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTPS is working!${NC}"
    curl -k -I https://localhost/health 2>&1 | head -3
else
    echo -e "${YELLOW}⚠️  HTTPS still not working${NC}"
    echo ""
    echo "Check error log:"
    docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | tail -10
fi
echo ""

# Summary
echo -e "${BLUE}📋 Summary:${NC}"
echo ""
if [ "$MATCH" = "NO" ]; then
    echo "Certificate and key were mismatched. Certificates have been regenerated."
    echo "If HTTPS still doesn't work, check Nginx error log."
else
    echo "Certificate and key match. If HTTPS doesn't work, check:"
    echo "  - Nginx error log: docker-compose exec nginx cat /var/log/nginx/error.log"
    echo "  - Port 443 listening: docker-compose exec nginx netstat -tlnp | grep 443"
    echo "  - SSL config: grep -A 10 'listen 443' nginx/conf.d/default.conf"
fi
echo ""
