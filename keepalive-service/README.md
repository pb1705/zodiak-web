# Keepalive Service

A standalone Docker service that keeps multiple URLs alive by pinging them periodically.

## URLs Monitored

- https://chat-service-r97r.onrender.com/
- https://agent-utxb.onrender.com/
- https://letta-fhne.onrender.com/
- https://eclipse-mosquitto-vmzh.onrender.com/
- https://prediction.zodiak.life/

## Setup

1. Clone or copy this directory
2. Navigate to the keepalive-service directory
3. Build and run the service:

```bash
# Build and start the service
docker-compose up -d --build

# View logs
docker-compose logs -f keepalive

# Stop the service
docker-compose down
```

## Manual Build (Alternative)

```bash
# Build the image
docker build -t keepalive-service .

# Run the container
docker run -d --name keepalive-service --restart unless-stopped keepalive-service
```

## Configuration

- **Interval**: 40 seconds between ping cycles
- **Timeout**: 10 seconds per URL request
- **Restart**: Automatically restarts unless manually stopped

## Logs

The service logs each ping attempt with timestamp and HTTP status code to stdout. Use `docker-compose logs -f` to monitor in real-time.