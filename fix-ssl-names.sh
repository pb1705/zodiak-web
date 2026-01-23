#!/bin/bash

# Fix SSL Certificate File Names

set -e

echo "🔧 Fixing SSL Certificate File Names"
echo "===================================="
echo ""

cd ~/zodiak-deployment

# Check current files
echo "📋 Current SSL files:"
ls -la nginx/ssl/
echo ""

# Rename files to match Nginx config
if [ -f "nginx/ssl/fullchain.pem" ]; then
    echo "📝 Renaming fullchain.pem → cert.pem"
    cp nginx/ssl/fullchain.pem nginx/ssl/cert.pem
    chmod 644 nginx/ssl/cert.pem
    echo "✓ Done"
fi

if [ -f "nginx/ssl/privkey.pem" ]; then
    echo "📝 Renaming privkey.pem → key.pem"
    cp nginx/ssl/privkey.pem nginx/ssl/key.pem
    chmod 600 nginx/ssl/key.pem
    echo "✓ Done"
fi

echo ""
echo "📋 Updated SSL files:"
ls -la nginx/ssl/
echo ""

# Restart Nginx
echo "🔄 Restarting Nginx..."
docker-compose restart nginx
echo "✓ Done"
echo ""

# Wait a moment
sleep 2

# Test HTTPS
echo "🧪 Testing HTTPS..."
if curl -s -f -I https://zodiak.life > /dev/null 2>&1; then
    echo "✅ HTTPS is working!"
else
    echo "⚠️  HTTPS test failed. Check logs: docker-compose logs nginx"
fi

echo ""
echo "✅ SSL certificates fixed!"
echo ""
echo "🌐 Visit: https://zodiak.life"
echo ""
