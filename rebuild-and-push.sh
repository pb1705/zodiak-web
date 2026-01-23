#!/bin/bash

# Rebuild Docker Image Correctly for Production
# This script builds the image using Dockerfile.build which builds everything inside Docker

set -e

echo "🔨 Rebuilding Docker Image for Production"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get image name
if [ -f .env ]; then
    source .env
fi

IMAGE_NAME=${DOCKER_IMAGE:-"prranav1705/landing:latest"}

if [ "$IMAGE_NAME" == "your-username/zodiak-website:latest" ] || [ -z "$IMAGE_NAME" ]; then
    echo -e "${YELLOW}⚠️  DOCKER_IMAGE not set in .env${NC}"
    read -p "Enter your Docker image name (e.g., prranav1705/landing:latest): " IMAGE_NAME
    if [ -z "$IMAGE_NAME" ]; then
        echo -e "${RED}❌ Image name is required${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}📦 Building image: ${IMAGE_NAME}${NC}"
echo ""

# Check if Dockerfile.build exists
if [ ! -f "Dockerfile.build" ]; then
    echo -e "${RED}❌ Dockerfile.build not found!${NC}"
    echo "Creating Dockerfile.build..."
    
    cat > Dockerfile.build << 'EOF'
# Dockerfile.build - Builds everything inside Docker
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
EOF
    
    echo -e "${GREEN}✓ Dockerfile.build created${NC}"
    echo ""
fi

# Build the image
echo -e "${BLUE}🔨 Building (this may take a few minutes)...${NC}"
docker build -f Dockerfile.build -t "${IMAGE_NAME}" .

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo ""
    
    # Test locally
    echo -e "${BLUE}🧪 Testing image locally...${NC}"
    echo "Starting container on port 3001 (press Ctrl+C to stop)..."
    echo ""
    
    # Run in background for a few seconds to test
    CONTAINER_ID=$(docker run -d -p 3001:3000 "${IMAGE_NAME}")
    sleep 5
    
    # Check logs
    echo "Container logs:"
    docker logs "${CONTAINER_ID}" | head -10
    
    # Test health
    if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
        echo ""
        echo -e "${GREEN}✓ Health check passed!${NC}"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Health check failed (container may still be starting)${NC}"
    fi
    
    # Stop test container
    docker stop "${CONTAINER_ID}" > /dev/null 2>&1
    docker rm "${CONTAINER_ID}" > /dev/null 2>&1
    
    echo ""
    echo -e "${BLUE}📤 Pushing to registry...${NC}"
    docker push "${IMAGE_NAME}"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Image pushed successfully!${NC}"
        echo ""
        echo "🚀 Next steps on your server:"
        echo "  1. cd ~/zodiak-deployment"
        echo "  2. docker-compose pull"
        echo "  3. docker-compose down"
        echo "  4. docker-compose up -d"
        echo "  5. docker-compose logs -f nextjs"
        echo ""
        echo "Expected logs should show: 'Ready on http://0.0.0.0:3000'"
        echo "NOT the development banner!"
    else
        echo ""
        echo -e "${RED}❌ Push failed. Check your Docker Hub credentials.${NC}"
        echo "Login with: docker login"
        exit 1
    fi
else
    echo ""
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
