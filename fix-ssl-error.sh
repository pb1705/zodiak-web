#!/bin/bash

# Fix SSL_ERROR_SYSCALL - SSL Certificate Issues

set -e

echo "🔧 Fixing SSL Connection Error"
echo "================================"
echo ""

cd ~/zodiak-deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Check what SSL files exist
echo -e "${BLUE}1. Checking SSL Certificate Files...${NC}"
ls -la nginx/ssl/ 2>/dev/null || {
    echo -e "${RED}✗ SSL directory doesn't exist!${NC}"
    mkdir -p nginx/ssl
    echo "Created nginx/ssl directory"
}
echo ""

# 2. Check if certificates exist with correct names
echo -e "${BLUE}2. Checking Certificate Files...${NC}"
if [ -f "nginx/ssl/cert.pem" ] && [ -f "nginx/ssl/key.pem" ]; then
    echo -e "${GREEN}✓ cert.pem and key.pem exist${NC}"
    ls -lh nginx/ssl/cert.pem nginx/ssl/key.pem
    
    # Check file sizes (should not be 0)
    CERT_SIZE=$(stat -f%z nginx/ssl/cert.pem 2>/dev/null || stat -c%s nginx/ssl/cert.pem 2>/dev/null || echo "0")
    KEY_SIZE=$(stat -f%z nginx/ssl/key.pem 2>/dev/null || stat -c%s nginx/ssl/key.pem 2>/dev/null || echo "0")
    
    if [ "$CERT_SIZE" -eq 0 ] || [ "$KEY_SIZE" -eq 0 ]; then
        echo -e "${RED}✗ Certificate files are empty!${NC}"
        echo "Need to get SSL certificates"
    fi
else
    echo -e "${YELLOW}⚠️  cert.pem or key.pem missing${NC}"
    
    # Check if they exist with different names
    if [ -f "nginx/ssl/fullchain.pem" ]; then
        echo "Found fullchain.pem, copying to cert.pem..."
        cp nginx/ssl/fullchain.pem nginx/ssl/cert.pem
        chmod 644 nginx/ssl/cert.pem
        echo -e "${GREEN}✓ Created cert.pem${NC}"
    fi
    
    if [ -f "nginx/ssl/privkey.pem" ]; then
        echo "Found privkey.pem, copying to key.pem..."
        cp nginx/ssl/privkey.pem nginx/ssl/key.pem
        chmod 600 nginx/ssl/key.pem
        echo -e "${GREEN}✓ Created key.pem${NC}"
    fi
    
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        echo -e "${RED}✗ Still missing certificates!${NC}"
        echo ""
        echo "You need to get SSL certificates. Options:"
        echo ""
        echo "Option 1: Use Let's Encrypt (recommended)"
        echo "  sudo certbot certonly --standalone -d zodiak.life -d www.zodiak.life"
        echo "  sudo cp /etc/letsencrypt/live/zodiak.life/fullchain.pem nginx/ssl/cert.pem"
        echo "  sudo cp /etc/letsencrypt/live/zodiak.life/privkey.pem nginx/ssl/key.pem"
        echo ""
        echo "Option 2: Create self-signed certificate (for testing)"
        echo "  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \\"
        echo "    -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem \\"
        echo "    -subj '/CN=zodiak.life'"
        echo ""
        exit 1
    fi
fi
echo ""

# 3. Verify certificate validity
echo -e "${BLUE}3. Verifying Certificate Validity...${NC}"
if command -v openssl &> /dev/null; then
    if openssl x509 -in nginx/ssl/cert.pem -noout -text > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Certificate is valid${NC}"
        CERT_SUBJECT=$(openssl x509 -in nginx/ssl/cert.pem -noout -subject 2>/dev/null)
        CERT_DATES=$(openssl x509 -in nginx/ssl/cert.pem -noout -dates 2>/dev/null)
        echo "Subject: $CERT_SUBJECT"
        echo "$CERT_DATES"
    else
        echo -e "${RED}✗ Certificate is invalid or corrupted!${NC}"
        echo "You need to regenerate certificates"
        exit 1
    fi
else
    echo "openssl not available, skipping validation"
fi
echo ""

# 4. Check file permissions
echo -e "${BLUE}4. Checking File Permissions...${NC}"
chmod 644 nginx/ssl/cert.pem
chmod 600 nginx/ssl/key.pem
echo -e "${GREEN}✓ Permissions set correctly${NC}"
ls -la nginx/ssl/cert.pem nginx/ssl/key.pem
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

# 6. Check if Nginx can read the certificates
echo -e "${BLUE}6. Testing Certificate Accessibility from Container...${NC}"
if docker-compose exec -T nginx test -r /etc/nginx/ssl/cert.pem && \
   docker-compose exec -T nginx test -r /etc/nginx/ssl/key.pem; then
    echo -e "${GREEN}✓ Nginx can read certificates${NC}"
else
    echo -e "${RED}✗ Nginx cannot read certificates!${NC}"
    echo "Fixing permissions..."
    # The files are mounted, so we need to ensure they're readable
    chmod 644 nginx/ssl/cert.pem
    chmod 600 nginx/ssl/key.pem
    echo "Restarting Nginx..."
    docker-compose restart nginx
    sleep 3
fi
echo ""

# 7. Restart Nginx
echo -e "${BLUE}7. Restarting Nginx...${NC}"
docker-compose restart nginx
sleep 3
echo -e "${GREEN}✓ Nginx restarted${NC}"
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
    echo "Checking Nginx error logs..."
    docker-compose exec -T nginx cat /var/log/nginx/error.log 2>/dev/null | tail -10 || echo "Could not read error log"
    echo ""
    echo "Try accessing from outside:"
    echo "  curl -k -I https://zodiak.life"
fi
echo ""

echo -e "${BLUE}📋 Summary:${NC}"
echo ""
echo "If HTTPS still doesn't work:"
echo "  1. Ensure certificates exist: ls -la nginx/ssl/"
echo "  2. Check Nginx logs: docker-compose logs nginx | tail -20"
echo "  3. Check error log: docker-compose exec nginx cat /var/log/nginx/error.log"
echo "  4. Test from outside: curl -k -I https://zodiak.life"
echo ""
