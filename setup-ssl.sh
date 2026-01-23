#!/bin/bash

# Setup SSL/TLS with Let's Encrypt for Zodiak Website

set -e

echo "🔒 Setting Up SSL/TLS for Zodiak"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get domain name
read -p "Enter your domain name (e.g., zodiak.life): " DOMAIN_NAME

if [ -z "$DOMAIN_NAME" ]; then
    echo -e "${RED}❌ Domain name is required${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Domain: ${DOMAIN_NAME}${NC}"
echo ""

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}⚠️  Certbot not found. Installing...${NC}"
    sudo apt update
    sudo apt install -y certbot
    echo -e "${GREEN}✓ Certbot installed${NC}"
    echo ""
fi

# Stop Nginx temporarily (required for standalone mode)
echo "🛑 Stopping Nginx container..."
cd ~/zodiak-deployment
docker-compose stop nginx
echo -e "${GREEN}✓ Nginx stopped${NC}"
echo ""

# Get certificate
echo "📜 Obtaining SSL certificate from Let's Encrypt..."
echo ""

sudo certbot certonly --standalone \
    -d "${DOMAIN_NAME}" \
    -d "www.${DOMAIN_NAME}" \
    --non-interactive \
    --agree-tos \
    --email "admin@${DOMAIN_NAME}" \
    --preferred-challenges http

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Certificate obtained successfully!${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Failed to obtain certificate${NC}"
    echo "Make sure:"
    echo "  1. Domain DNS points to this server"
    echo "  2. Port 80 is accessible from internet"
    echo "  3. No firewall blocking port 80"
    exit 1
fi

# Create SSL directory
echo "📁 Setting up SSL certificates..."
mkdir -p ~/zodiak-deployment/nginx/ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem ~/zodiak-deployment/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem ~/zodiak-deployment/nginx/ssl/key.pem

# Set permissions
sudo chmod 644 ~/zodiak-deployment/nginx/ssl/cert.pem
sudo chmod 600 ~/zodiak-deployment/nginx/ssl/key.pem
sudo chown $USER:$USER ~/zodiak-deployment/nginx/ssl/*.pem

echo -e "${GREEN}✓ Certificates copied${NC}"
echo ""

# Update Nginx config to use HTTPS
echo "📝 Updating Nginx configuration..."

cat > ~/zodiak-deployment/nginx/conf.d/default.conf << EOF
upstream nextjs {
    server nextjs:3000;
    keepalive 64;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name ${DOMAIN_NAME} www.${DOMAIN_NAME};
    
    # Health check endpoint (no redirect)
    location /health {
        access_log off;
        proxy_pass http://nextjs/api/health;
        add_header Content-Type application/json;
    }

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name ${DOMAIN_NAME} www.${DOMAIN_NAME};

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # SSL optimization
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log warn;

    # Client settings
    client_max_body_size 20M;
    client_body_timeout 60s;
    client_header_timeout 60s;

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://nextjs;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, immutable, max-age=2592000";
        expires 30d;
        access_log off;
    }

    # Next.js static files
    location /_next/static {
        proxy_pass http://nextjs;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable, max-age=31536000";
        expires 365d;
        access_log off;
    }

    # API routes
    location /api {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Main application
    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://nextjs/api/health;
        add_header Content-Type application/json;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

echo -e "${GREEN}✓ Nginx config updated${NC}"
echo ""

# Start Nginx
echo "🚀 Starting Nginx..."
docker-compose up -d nginx
echo -e "${GREEN}✓ Nginx started${NC}"
echo ""

# Wait a moment
sleep 3

# Test SSL
echo "🧪 Testing SSL configuration..."
if curl -s -f https://${DOMAIN_NAME}/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ HTTPS is working!${NC}"
else
    echo -e "${YELLOW}⚠️  HTTPS test failed (may need a moment to start)${NC}"
fi
echo ""

# Set up auto-renewal
echo "🔄 Setting up certificate auto-renewal..."
cat > /tmp/renew-cert.sh << 'RENEW_SCRIPT'
#!/bin/bash
cd ~/zodiak-deployment
docker-compose stop nginx
certbot renew --quiet
cp /etc/letsencrypt/live/DOMAIN/fullchain.pem ~/zodiak-deployment/nginx/ssl/cert.pem
cp /etc/letsencrypt/live/DOMAIN/privkey.pem ~/zodiak-deployment/nginx/ssl/key.pem
chmod 644 ~/zodiak-deployment/nginx/ssl/cert.pem
chmod 600 ~/zodiak-deployment/nginx/ssl/key.pem
docker-compose up -d nginx
RENEW_SCRIPT

sed -i "s/DOMAIN/${DOMAIN_NAME}/g" /tmp/renew-cert.sh
sudo mv /tmp/renew-cert.sh /usr/local/bin/renew-zodiak-cert.sh
sudo chmod +x /usr/local/bin/renew-zodiak-cert.sh

# Add to crontab (runs twice daily)
(crontab -l 2>/dev/null | grep -v "renew-zodiak-cert"; echo "0 0,12 * * * /usr/local/bin/renew-zodiak-cert.sh >> /var/log/zodiak-cert-renew.log 2>&1") | crontab -

echo -e "${GREEN}✓ Auto-renewal configured${NC}"
echo ""

echo -e "${GREEN}✅ SSL Setup Complete!${NC}"
echo ""
echo "🌐 Your website is now secure:"
echo "   https://${DOMAIN_NAME}"
echo ""
echo "📋 Next steps:"
echo "  1. Visit https://${DOMAIN_NAME} in your browser"
echo "  2. You should see a secure padlock 🔒"
echo "  3. Certificates will auto-renew every 12 hours"
echo ""
echo "🔍 Verify SSL:"
echo "  curl -I https://${DOMAIN_NAME}"
echo ""
