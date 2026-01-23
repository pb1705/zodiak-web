# Docker Image Deployment Guide

This guide explains how to build, push, and deploy the Zodiak website using Docker images.

## Prerequisites

- Docker installed on your local machine
- Docker Hub account (or another container registry)
- Server with Docker installed

## Step 1: Build the Docker Image

### Build the Next.js application image:

```bash
# Build the image
docker build -t zodiak-website:latest .

# Or with a specific tag
docker build -t zodiak-website:v1.0.0 .
```

## Step 2: Tag for Docker Hub (or your registry)

Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username:

```bash
# Tag for Docker Hub
docker tag zodiak-website:latest YOUR_DOCKERHUB_USERNAME/zodiak-website:latest

# Or for a specific version
docker tag zodiak-website:latest YOUR_DOCKERHUB_USERNAME/zodiak-website:v1.0.0
```

### Alternative: Use GitHub Container Registry (ghcr.io)

```bash
# Tag for GitHub Container Registry
docker tag zodiak-website:latest ghcr.io/YOUR_GITHUB_USERNAME/zodiak-website:latest
```

## Step 3: Login to Docker Registry

### For Docker Hub:
```bash
docker login
# Enter your Docker Hub username and password
```

### For GitHub Container Registry:
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin
```

## Step 4: Push the Image

### Push to Docker Hub:
```bash
docker push YOUR_DOCKERHUB_USERNAME/zodiak-website:latest
```

### Push to GitHub Container Registry:
```bash
docker push ghcr.io/YOUR_GITHUB_USERNAME/zodiak-website:latest
```

## Step 5: Deploy on Your Server

### Option A: Using Docker Compose (Recommended)

1. **On your server, create a directory:**
```bash
mkdir -p ~/zodiak-deployment
cd ~/zodiak-deployment
```

2. **Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  nextjs:
    image: YOUR_DOCKERHUB_USERNAME/zodiak-website:latest
    # Or use: ghcr.io/YOUR_GITHUB_USERNAME/zodiak-website:latest
    container_name: zodiak-nextjs
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=https://zodiak.life
      - PORT=3000
    networks:
      - zodiak-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    container_name: zodiak-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - nextjs
    networks:
      - zodiak-network

networks:
  zodiak-network:
    driver: bridge
```

3. **Create Nginx configuration files** (copy from your local project):
   - `nginx/nginx.conf`
   - `nginx/conf.d/default.conf`
   - `nginx/ssl/` directory (for SSL certificates)

4. **Pull and run:**
```bash
# Pull the latest image
docker-compose pull

# Start the services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option B: Using Docker Run (Simple)

```bash
# Pull the image
docker pull YOUR_DOCKERHUB_USERNAME/zodiak-website:latest

# Run the container
docker run -d \
  --name zodiak-nextjs \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_BASE_URL=https://zodiak.life \
  YOUR_DOCKERHUB_USERNAME/zodiak-website:latest
```

## Step 6: Update the Image

When you make changes:

1. **Build and push new version:**
```bash
# Build new version
docker build -t zodiak-website:latest .

# Tag it
docker tag zodiak-website:latest YOUR_DOCKERHUB_USERNAME/zodiak-website:latest

# Push
docker push YOUR_DOCKERHUB_USERNAME/zodiak-website:latest
```

2. **On server, pull and restart:**
```bash
# Using docker-compose
docker-compose pull
docker-compose up -d

# Or using docker run
docker pull YOUR_DOCKERHUB_USERNAME/zodiak-website:latest
docker stop zodiak-nextjs
docker rm zodiak-nextjs
docker run -d --name zodiak-nextjs --restart unless-stopped -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_BASE_URL=https://zodiak.life \
  YOUR_DOCKERHUB_USERNAME/zodiak-website:latest
```

## Quick Scripts

### Build and Push Script (`build-and-push.sh`):

```bash
#!/bin/bash

DOCKERHUB_USERNAME="YOUR_DOCKERHUB_USERNAME"
IMAGE_NAME="zodiak-website"
VERSION=${1:-latest}

echo "Building image..."
docker build -t ${IMAGE_NAME}:${VERSION} .

echo "Tagging image..."
docker tag ${IMAGE_NAME}:${VERSION} ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${VERSION}

echo "Pushing image..."
docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${VERSION}

echo "Done! Image pushed as ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${VERSION}"
```

Usage:
```bash
chmod +x build-and-push.sh
./build-and-push.sh latest
./build-and-push.sh v1.0.0
```

## Security Notes

1. **Never commit secrets** - Use environment variables or secrets management
2. **Use private repositories** for production images if possible
3. **Scan images** for vulnerabilities: `docker scan YOUR_DOCKERHUB_USERNAME/zodiak-website:latest`
4. **Use specific tags** instead of `latest` in production

## Troubleshooting

### Image not found:
- Check if you're logged in: `docker login`
- Verify the image name and tag
- Check if the image is public (if using public repo)

### Build fails:
- Ensure `next.config.ts` has `output: 'standalone'`
- Check Docker has enough resources allocated
- Review build logs for specific errors

### Container won't start:
- Check environment variables
- Verify port 3000 is available
- Check container logs: `docker logs zodiak-nextjs`
