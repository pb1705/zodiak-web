#!/bin/bash

# Fix ECDSA SSL Certificate Issue

set -e

echo "🔧 Fixing ECDSA SSL Certificate"
echo "================================"
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Verify certificate is ECDSA
echo -e "${BLUE}1. Verifying Certificate Type...${NC}"
CERT_ALG=$(openssl x509 -in nginx/ssl/cert.pem -noout -text 2>/dev/null | grep "Public Key Algorithm" | awk -F: '{print $2}' | xargs)
echo "Certificate algorithm: $CERT_ALG"

if echo "$CERT_ALG" | grep -qi "ecPublicKey\|ecdsa"; then
    echo -e "${GREEN}✓ Certificate is ECDSA${NC}"
else
    echo -e "${YELLOW}⚠️  Certificate is not ECDSA${NC}"
fi
echo ""

# 2. Verify key is ECDSA
echo -e "${BLUE}2. Verifying Key Type...${NC}"
if openssl ec -in nginx/ssl/key.pem -check -noout > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Key is ECDSA${NC}"
    KEY_CURVE=$(openssl ec -in nginx/ssl/key.pem -noout -text 2>/dev/null | grep "ASN1 OID" | awk '{print $NF}')
    echo "Key curve: $KEY_CURVE"
else
    echo -e "${RED}✗ Key is not valid ECDSA!${NC}"
    exit 1
fi
echo ""

# 3. Verify certificate and key match (ECDSA way)
echo -e "${BLUE}3. Verifying Certificate and Key Match...${NC}"
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
    MATCH="NO"
fi
echo ""

# 4. Check Nginx SSL configuration
echo -e "${BLUE}4. Checking Nginx SSL Configuration...${NC}"
if grep -q "ssl_protocols" nginx/conf.d/default.conf; then
    echo "SSL protocols configured:"
    grep "ssl_protocols" nginx/conf.d/default.conf
else
    echo -e "${YELLOW}⚠️  No SSL protocols specified${NC}"
fi

if grep -q "ssl_ciphers" nginx/conf.d/default.conf; then
    echo "SSL ciphers configured:"
    grep "ssl_ciphers" nginx/conf.d/default.conf | head -1
else
    echo -e "${YELLOW}⚠️  No SSL ciphers specified${NC}"
fi
echo ""

# 5. Test Nginx config
echo -e "${BLUE}5. Testing Nginx Configuration...${NC}"
if docker-compose exec -T nginx nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx config is valid${NC}"
else
    echo -e "${RED}✗ Nginx config has errors!${NC}"
    docker-compose exec -T nginx nginx -t
    exit 1
fi
echo ""

# 6. Check Nginx error log
echo -e "${BLUE}6. Checking Nginx Error Log...${NC}"
ERRORS=$(docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | grep -i -E "(ssl|ecdsa|error)" | tail -10)
if [ -n "$ERRORS" ]; then
    echo -e "${YELLOW}⚠️  Errors found:${NC}"
    echo "$ERRORS"
else
    echo -e "${GREEN}✓ No errors in log${NC}"
fi
echo ""

# 7. Restart Nginx
echo -e "${BLUE}7. Restarting Nginx...${NC}"
docker-compose restart nginx
sleep 5
echo -e "${GREEN}✓ Nginx restarted${NC}"
echo ""

# 8. Test HTTPS
echo -e "${BLUE}8. Testing HTTPS Connection...${NC}"
sleep 2

if curl -k -s -f https://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTPS is working!${NC}"
    curl -k -I https://localhost/health 2>&1 | head -3
else
    echo -e "${YELLOW}⚠️  HTTPS test failed${NC}"
    echo ""
    echo "Checking detailed error..."
    curl -k -v https://localhost/health 2>&1 | grep -A 5 "SSL"
fi
echo ""

# Summary
echo -e "${BLUE}📋 Summary:${NC}"
echo ""
if [ "$MATCH" = "YES" ]; then
    echo -e "${GREEN}✅ Certificate and key match (both ECDSA)${NC}"
    echo ""
    echo "If HTTPS still doesn't work, check:"
    echo "  1. Nginx error log: docker-compose exec nginx cat /var/log/nginx/error.log"
    echo "  2. Test from outside: curl -k -v https://zodiak.life"
    echo "  3. Check port 443: netstat -tlnp | grep 443"
    echo ""
    echo "Note: ECDSA certificates work fine with Nginx. The issue might be:"
    echo "  - Firewall blocking port 443"
    echo "  - Nginx SSL configuration issue"
    echo "  - Certificate not trusted (if self-signed, use -k flag)"
else
    echo -e "${RED}❌ Certificate and key do NOT match${NC}"
    echo ""
    echo "You need to regenerate matching certificates:"
    echo "  docker-compose stop nginx"
    echo "  sudo certbot delete --cert-name zodiak.life"
    echo "  sudo certbot certonly --standalone -d zodiak.life -d www.zodiak.life \\"
    echo "    --key-type rsa --rsa-key-size 2048 --non-interactive --agree-tos \\"
    echo "    --email prranavbabbar2317@gmail.com"
    echo "  sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/cert.pem"
    echo "  sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/key.pem"
    echo "  docker-compose up -d nginx"
fi
echo ""
