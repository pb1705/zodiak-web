#!/bin/bash

# Production Deployment Script for Zodiak Website
# Usage: ./deploy-production.sh

set -e

echo "🚀 Zodiak Production Deployment"
echo "================================"
echo ""

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found!"
    echo "Please create docker-compose.yml first (see PRODUCTION_DEPLOYMENT.md)"
    exit 1
fi

# Check if nginx config exists
if [ ! -f "nginx/conf.d/default.conf" ]; then
    echo "❌ Error: nginx/conf.d/default.conf not found!"
    echo "Please create nginx configuration first (see PRODUCTION_DEPLOYMENT.md)"
    exit 1
fi

# Check if SSL certificates exist
if [ ! -f "nginx/ssl/fullchain.pem" ] || [ ! -f "nginx/ssl/privkey.pem" ]; then
    echo "⚠️  Warning: SSL certificates not found!"
    echo "The site will work but HTTPS won't be available."
    echo "Run: sudo certbot certonly --standalone -d your-domain.com"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Pulling latest Docker image..."
docker-compose pull

echo ""
echo "🔄 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Useful commands:"
echo "  View logs:        docker-compose logs -f"
echo "  Stop services:    docker-compose down"
echo "  Restart:          docker-compose restart"
echo "  Update image:     docker-compose pull && docker-compose up -d"
echo ""
