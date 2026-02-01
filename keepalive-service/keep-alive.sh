#!/bin/bash

# List of URLs to ping
URLS=(
    "https://chat-service-r97r.onrender.com/"
    "https://agent-utxb.onrender.com/"
    "https://letta-fhne.onrender.com/"
    "https://eclipse-mosquitto-vmzh.onrender.com/"
    "https://prediction.zodiak.life/"
)

# Interval in seconds
INTERVAL=40

# Function to ping a URL
ping_url() {
    local url=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    # Use curl to ping the URL
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")

    if [ $? -eq 0 ]; then
        echo "[$timestamp] $url - Status: $response"
    else
        echo "[$timestamp] $url - Error: Failed to connect"
    fi
}

# Main loop
echo "Starting URL keepalive script..."
echo "Pinging ${#URLS[@]} URLs every $INTERVAL seconds"
echo "------------------------------------------------------------"

# Trap Ctrl+C to exit gracefully
trap 'echo -e "\n\nScript stopped by user"; exit 0' INT

while true; do
    for url in "${URLS[@]}"; do
        ping_url "$url"
    done

    echo ""
    echo "Waiting $INTERVAL seconds..."
    echo ""
    sleep $INTERVAL
done