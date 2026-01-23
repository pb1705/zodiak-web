#!/bin/bash

# Check for Certificate Conflicts with MQTT

set -e

echo "🔍 Checking Certificate Conflicts"
echo "================================="
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Check what certificates exist in Let's Encrypt
echo -e "${BLUE}1. Checking Let's Encrypt Certificates...${NC}"
if [ -d "/etc/letsencrypt/live" ]; then
    echo "Certificates found:"
    ls -la /etc/letsencrypt/live/
    echo ""
    
    if [ -d "/etc/letsencrypt/live/zodiak.life" ]; then
        echo -e "${GREEN}✓ zodiak.life certificate exists${NC}"
        echo "Certificate details:"
        sudo openssl x509 -in /etc/letsencrypt/live/zodiak.life/fullchain.pem -noout -subject -dates 2>/dev/null || echo "Could not read"
    else
        echo -e "${YELLOW}⚠️  zodiak.life certificate not found${NC}"
    fi
    
    if [ -d "/etc/letsencrypt/live/mqtt.zodiak.life" ]; then
        echo ""
        echo -e "${YELLOW}⚠️  mqtt.zodiak.life certificate exists${NC}"
        echo "Certificate details:"
        sudo openssl x509 -in /etc/letsencrypt/live/mqtt.zodiak.life/fullchain.pem -noout -subject -dates 2>/dev/null || echo "Could not read"
    fi
else
    echo "Let's Encrypt directory not found"
fi
echo ""

# 2. Check what certificates are currently in use
echo -e "${BLUE}2. Checking Current Certificates in Use...${NC}"
if [ -f "nginx/ssl/cert.pem" ]; then
    echo "Current certificate subject:"
    openssl x509 -in nginx/ssl/cert.pem -noout -subject 2>/dev/null || echo "Could not read"
    echo ""
    echo "Current certificate SAN (Subject Alternative Names):"
    openssl x509 -in nginx/ssl/cert.pem -noout -text 2>/dev/null | grep -A 1 "Subject Alternative Name" || echo "No SAN found"
else
    echo -e "${RED}✗ No certificate found in nginx/ssl/cert.pem${NC}"
fi
echo ""

# 3. Check if wrong certificate is being used
echo -e "${BLUE}3. Verifying Certificate Domain...${NC}"
if [ -f "nginx/ssl/cert.pem" ]; then
    CERT_DOMAINS=$(openssl x509 -in nginx/ssl/cert.pem -noout -text 2>/dev/null | grep -E "DNS:|Subject:" | grep -oE "(zodiak\.life|mqtt\.zodiak\.life)" | sort -u)
    echo "Domains in certificate: $CERT_DOMAINS"
    
    if echo "$CERT_DOMAINS" | grep -q "mqtt.zodiak.life" && ! echo "$CERT_DOMAINS" | grep -q "zodiak.life"; then
        echo -e "${RED}✗ WRONG CERTIFICATE! Using mqtt.zodiak.life certificate for zodiak.life${NC}"
        echo "This is the problem!"
        WRONG_CERT="YES"
    elif echo "$CERT_DOMAINS" | grep -q "zodiak.life"; then
        echo -e "${GREEN}✓ Certificate is for zodiak.life (correct)${NC}"
        WRONG_CERT="NO"
    else
        echo -e "${YELLOW}⚠️  Could not determine certificate domain${NC}"
        WRONG_CERT="UNKNOWN"
    fi
else
    WRONG_CERT="NO_CERT"
fi
echo ""

# 4. Check for port conflicts
echo -e "${BLUE}4. Checking for Port Conflicts...${NC}"
if netstat -tlnp 2>/dev/null | grep -q ":443 " || ss -tlnp 2>/dev/null | grep -q ":443 "; then
    echo "Services using port 443:"
    netstat -tlnp 2>/dev/null | grep ":443 " || ss -tlnp 2>/dev/null | grep ":443 "
    echo ""
    echo "Check if MQTT or another service is using port 443"
else
    echo "No services found on port 443"
fi
echo ""

# 5. Check Nginx error log
echo -e "${BLUE}5. Checking Nginx Error Log...${NC}"
ERRORS=$(docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | tail -20)
if [ -n "$ERRORS" ]; then
    echo "$ERRORS"
else
    echo "No recent errors"
fi
echo ""

# Summary and fix
echo -e "${BLUE}📋 Summary:${NC}"
echo ""

if [ "$WRONG_CERT" = "YES" ]; then
    echo -e "${RED}❌ PROBLEM FOUND: Wrong certificate in use!${NC}"
    echo ""
    echo "You're using mqtt.zodiak.life certificate for zodiak.life"
    echo ""
    echo "Fix: Copy the correct certificate"
    echo ""
    echo "  1. Stop Nginx:"
    echo "     docker-compose stop nginx"
    echo ""
    echo "  2. Get certificate for zodiak.life:"
    echo "     sudo certbot certonly --standalone \\"
    echo "       -d zodiak.life -d www.zodiak.life \\"
    echo "       --key-type rsa --rsa-key-size 2048 \\"
    echo "       --non-interactive --agree-tos \\"
    echo "       --email prranavbabbar2317@gmail.com"
    echo ""
    echo "  3. Copy correct certificates:"
    echo "     sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/cert.pem"
    echo "     sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/key.pem"
    echo ""
    echo "  4. Set permissions:"
    echo "     sudo chmod 644 nginx/ssl/cert.pem"
    echo "     sudo chmod 600 nginx/ssl/key.pem"
    echo ""
    echo "  5. Start Nginx:"
    echo "     docker-compose up -d nginx"
    echo ""
    echo "  6. Verify:"
    echo "     openssl x509 -in nginx/ssl/cert.pem -noout -subject"
    echo "     curl -k https://localhost/health"
elif [ "$WRONG_CERT" = "NO_CERT" ]; then
    echo -e "${RED}❌ No certificate found!${NC}"
    echo "You need to get certificates for zodiak.life"
else
    echo -e "${GREEN}✓ Certificate appears correct${NC}"
    echo "If HTTPS still doesn't work, check:"
    echo "  - Nginx error log: docker-compose exec nginx cat /var/log/nginx/error.log"
    echo "  - Certificate/key match: openssl x509 -in nginx/ssl/cert.pem -noout -pubkey | openssl md5"
    echo "                            openssl ec -in nginx/ssl/key.pem -pubout | openssl md5"
fi
echo ""
