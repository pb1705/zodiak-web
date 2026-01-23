#!/bin/bash

# Fix Certificate/Key Mismatch Issue

set -e

echo "🔧 Fixing Certificate/Key Mismatch"
echo "=================================="
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Check certificate type
echo -e "${BLUE}1. Checking Certificate Type...${NC}"
CERT_TYPE=$(openssl x509 -in nginx/ssl/cert.pem -noout -text 2>/dev/null | grep "Public Key Algorithm" | awk '{print $4}')
echo "Certificate uses: $CERT_TYPE"
echo ""

# 2. Check key type
echo -e "${BLUE}2. Checking Private Key Type...${NC}"
if openssl rsa -in nginx/ssl/key.pem -check -noout > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Key is RSA${NC}"
    KEY_TYPE="RSA"
elif openssl ec -in nginx/ssl/key.pem -check -noout > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Key is ECDSA (not RSA)${NC}"
    KEY_TYPE="ECDSA"
    echo "Certificate is RSA but key is ECDSA - they don't match!"
    echo ""
    echo "This is the problem! You need matching certificate and key."
    exit 1
else
    echo -e "${RED}✗ Key is invalid or corrupted!${NC}"
    KEY_TYPE="INVALID"
    echo ""
    echo "The key file appears to be corrupted or in wrong format"
    exit 1
fi
echo ""

# 3. Verify certificate and key match
echo -e "${BLUE}3. Verifying Certificate and Key Match...${NC}"
if [ "$KEY_TYPE" = "RSA" ]; then
    CERT_MODULUS=$(openssl x509 -noout -modulus -in nginx/ssl/cert.pem 2>/dev/null | openssl md5 | awk '{print $NF}')
    KEY_MODULUS=$(openssl rsa -noout -modulus -in nginx/ssl/key.pem 2>/dev/null | openssl md5 | awk '{print $NF}')
    
    echo "Certificate modulus: $CERT_MODULUS"
    echo "Key modulus: $KEY_MODULUS"
    echo ""
    
    if [ "$CERT_MODULUS" = "$KEY_MODULUS" ]; then
        echo -e "${GREEN}✓ Certificate and key match!${NC}"
    else
        echo -e "${RED}✗ Certificate and key do NOT match!${NC}"
        echo ""
        echo "You need to regenerate matching certificates"
        exit 1
    fi
fi
echo ""

# 4. Check if key file is actually readable
echo -e "${BLUE}4. Checking Key File Content...${NC}"
KEY_SIZE=$(stat -f%z nginx/ssl/key.pem 2>/dev/null || stat -c%s nginx/ssl/key.pem 2>/dev/null || echo "0")
echo "Key file size: $KEY_SIZE bytes"

if [ "$KEY_SIZE" -lt 100 ]; then
    echo -e "${RED}✗ Key file is too small (likely corrupted or empty)!${NC}"
    exit 1
fi

# Check first few lines
echo ""
echo "Key file header:"
head -2 nginx/ssl/key.pem
echo ""

# 5. Try to read key with different methods
echo -e "${BLUE}5. Attempting to Read Key...${NC}"
if openssl pkey -in nginx/ssl/key.pem -noout > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Key can be read as generic private key${NC}"
    KEY_INFO=$(openssl pkey -in nginx/ssl/key.pem -noout -text 2>/dev/null | head -5)
    echo "$KEY_INFO"
else
    echo -e "${RED}✗ Cannot read key file!${NC}"
    echo ""
    echo "The key file is corrupted or in wrong format"
    echo ""
    echo "Solution: Regenerate certificates"
    exit 1
fi
echo ""

# 6. Check certificate details
echo -e "${BLUE}6. Certificate Details...${NC}"
openssl x509 -in nginx/ssl/cert.pem -noout -subject -issuer -dates 2>/dev/null
echo ""

# Summary and recommendations
echo -e "${BLUE}📋 Summary:${NC}"
echo ""
if [ "$KEY_TYPE" != "RSA" ] || [ "$CERT_MODULUS" != "$KEY_MODULUS" ]; then
    echo -e "${RED}❌ Certificate and key do NOT match!${NC}"
    echo ""
    echo "You need to regenerate matching SSL certificates."
    echo ""
    echo "Option 1: Use Let's Encrypt (recommended)"
    echo "  docker-compose stop nginx"
    echo "  sudo certbot certonly --standalone -d zodiak.life -d www.zodiak.life"
    echo "  sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/cert.pem"
    echo "  sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/key.pem"
    echo "  sudo chmod 644 nginx/ssl/cert.pem"
    echo "  sudo chmod 600 nginx/ssl/key.pem"
    echo "  docker-compose up -d nginx"
    echo ""
    echo "Option 2: Generate self-signed (for testing)"
    echo "  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\"
    echo "    -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem \\"
    echo "    -subj '/CN=zodiak.life'"
    echo "  chmod 644 nginx/ssl/cert.pem"
    echo "  chmod 600 nginx/ssl/key.pem"
    echo "  docker-compose restart nginx"
else
    echo -e "${GREEN}✅ Certificate and key match!${NC}"
    echo "The issue might be elsewhere. Check Nginx logs:"
    echo "  docker-compose exec nginx cat /var/log/nginx/error.log"
fi
echo ""
