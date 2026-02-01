#!/bin/bash

echo "Building and running Keepalive Service..."
echo "=========================================="

# Build and start the service
docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Keepalive service is now running!"
    echo ""
    echo "To view logs: docker-compose logs -f keepalive"
    echo "To stop: docker-compose down"
    echo "To restart: docker-compose restart"
else
    echo "❌ Failed to start the service"
    exit 1
fi