#!/bin/bash

# Check and Fix Private Key Issue

set -e

echo "🔍 Checking Private Key"
echo "======================="
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Check key file size
echo -e "${BLUE}1. Checking Key File...${NC}"
KEY_SIZE=$(stat -f%z nginx/ssl/key.pem 2>/dev/null || stat -c%s nginx/ssl/key.pem 2>/dev/null || echo "0")
echo "Key file size: $KEY_SIZE bytes"

if [ "$KEY_SIZE" -lt 100 ]; then
    echo -e "${RED}✗ Key file is too small (likely empty or corrupted)!${NC}"
    echo ""
    echo "Checking file content..."
    cat nginx/ssl/key.pem
    exit 1
fi
echo ""

# 2. Check key file header
echo -e "${BLUE}2. Key File Header:${NC}"
head -3 nginx/ssl/key.pem
echo ""

# 3. Try to identify key type
echo -e "${BLUE}3. Identifying Key Type...${NC}"

# Check if it's RSA
if openssl rsa -in nginx/ssl/key.pem -check -noout > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Key is RSA${NC}"
    KEY_TYPE="RSA"
elif openssl ec -in nginx/ssl/key.pem -check -noout > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Key is ECDSA (not RSA)${NC}"
    KEY_TYPE="ECDSA"
    echo "Certificate is RSA but key is ECDSA - mismatch!"
elif openssl pkey -in nginx/ssl/key.pem -noout > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Key is generic format, checking details...${NC}"
    KEY_INFO=$(openssl pkey -in nginx/ssl/key.pem -noout -text 2>/dev/null | head -3)
    echo "$KEY_INFO"
    KEY_TYPE="GENERIC"
else
    echo -e "${RED}✗ Cannot read key file!${NC}"
    echo ""
    echo "File content (first 10 lines):"
    head -10 nginx/ssl/key.pem
    echo ""
    echo "This key file appears to be corrupted or in wrong format"
    exit 1
fi
echo ""

# 4. Check certificate type
echo -e "${BLUE}4. Checking Certificate Type...${NC}"
CERT_INFO=$(openssl x509 -in nginx/ssl/cert.pem -noout -text 2>/dev/null | grep -A 2 "Public Key Algorithm")
echo "$CERT_INFO"
echo ""

# 5. If key is ECDSA but cert is RSA, we need to fix
if [ "$KEY_TYPE" = "ECDSA" ]; then
    echo -e "${RED}❌ Mismatch: Certificate is RSA but key is ECDSA${NC}"
    echo ""
    echo "Solution: Force Let's Encrypt to issue RSA certificate"
    echo ""
    echo "1. Delete existing certificate:"
    echo "   sudo certbot delete --cert-name zodiak.life"
    echo ""
    echo "2. Request new certificate with RSA key:"
    echo "   sudo certbot certonly --standalone \\"
    echo "     -d zodiak.life -d www.zodiak.life \\"
    echo "     --key-type rsa --rsa-key-size 2048 \\"
    echo "     --non-interactive --agree-tos \\"
    echo "     --email prranavbabbar2317@gmail.com"
    echo ""
    echo "3. Copy new certificates:"
    echo "   sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/cert.pem"
    echo "   sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/key.pem"
    echo ""
    exit 1
fi

# 6. Verify certificate and key match
echo -e "${BLUE}5. Verifying Certificate and Key Match...${NC}"
if [ "$KEY_TYPE" = "RSA" ]; then
    CERT_MODULUS=$(openssl x509 -noout -modulus -in nginx/ssl/cert.pem 2>/dev/null | openssl md5 | awk '{print $NF}')
    KEY_MODULUS=$(openssl rsa -noout -modulus -in nginx/ssl/key.pem 2>/dev/null | openssl md5 | awk '{print $NF}')
    
    echo "Certificate modulus: $CERT_MODULUS"
    echo "Key modulus: $KEY_MODULUS"
    echo ""
    
    if [ "$CERT_MODULUS" = "$KEY_MODULUS" ]; then
        echo -e "${GREEN}✅ Certificate and key match!${NC}"
        echo ""
        echo "Restart Nginx:"
        echo "  docker-compose restart nginx"
        echo ""
        echo "Test HTTPS:"
        echo "  curl -k https://localhost/health"
    else
        echo -e "${RED}✗ Certificate and key do NOT match!${NC}"
        echo "Modulus values are different"
    fi
fi
echo ""
