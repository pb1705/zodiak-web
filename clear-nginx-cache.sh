#!/bin/bash

# Script to clear nginx cache
# This reloads nginx configuration which clears SSL session cache and ensures fresh responses

echo "Clearing nginx cache..."

# Check if container exists
if ! docker ps -a --format '{{.Names}}' | grep -q "^zodiak-nginx$"; then
    echo "Error: zodiak-nginx container not found"
    exit 1
fi

# Check if container is running
if ! docker ps --format '{{.Names}}' | grep -q "^zodiak-nginx$"; then
    echo "Error: zodiak-nginx container is not running"
    exit 1
fi

# Reload nginx configuration (clears SSL session cache and restarts workers)
echo "Reloading nginx configuration..."
docker exec zodiak-nginx nginx -s reload

if [ $? -eq 0 ]; then
    echo "✓ Nginx cache cleared successfully"
    echo ""
    echo "Note: This clears:"
    echo "  - SSL session cache (in-memory)"
    echo "  - Nginx worker processes (fresh start)"
    echo ""
    echo "Browser cache is controlled by Cache-Control headers and cannot be cleared server-side."
    echo "Users may need to hard refresh (Ctrl+Shift+R or Cmd+Shift+R) to clear browser cache."
else
    echo "Error: Failed to reload nginx"
    exit 1
fi
