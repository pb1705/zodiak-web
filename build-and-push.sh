#!/bin/bash

# Docker Image Build and Push Script
# Usage: ./build-and-push.sh [version] [registry]
# Example: ./build-and-push.sh v1.0.0 dockerhub
# Example: ./build-and-push.sh latest ghcr

set -e

# Configuration - UPDATE THESE
DOCKERHUB_USERNAME="${DOCKERHUB_USERNAME:-your-username}"
GITHUB_USERNAME="${GITHUB_USERNAME:-your-username}"
IMAGE_NAME="zodiak-website"

# Get version from argument or use 'latest'
VERSION=${1:-latest}

# Get registry from argument or use 'dockerhub'
REGISTRY=${2:-dockerhub}

echo "🚀 Building Zodiak Website Docker Image"
echo "=========================================="
echo "Version: ${VERSION}"
echo "Registry: ${REGISTRY}"
echo ""

# Build the image
echo "📦 Building Docker image..."
docker build -t ${IMAGE_NAME}:${VERSION} .

if [ "$REGISTRY" = "dockerhub" ]; then
    FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${VERSION}"
    echo "🏷️  Tagging for Docker Hub: ${FULL_IMAGE_NAME}"
    docker tag ${IMAGE_NAME}:${VERSION} ${FULL_IMAGE_NAME}
    
    echo "📤 Pushing to Docker Hub..."
    docker push ${FULL_IMAGE_NAME}
    
    echo ""
    echo "✅ Successfully pushed to Docker Hub!"
    echo "   Image: ${FULL_IMAGE_NAME}"
    echo ""
    echo "To pull on your server:"
    echo "  docker pull ${FULL_IMAGE_NAME}"
    
elif [ "$REGISTRY" = "ghcr" ]; then
    FULL_IMAGE_NAME="ghcr.io/${GITHUB_USERNAME}/${IMAGE_NAME}:${VERSION}"
    echo "🏷️  Tagging for GitHub Container Registry: ${FULL_IMAGE_NAME}"
    docker tag ${IMAGE_NAME}:${VERSION} ${FULL_IMAGE_NAME}
    
    echo "📤 Pushing to GitHub Container Registry..."
    docker push ${FULL_IMAGE_NAME}
    
    echo ""
    echo "✅ Successfully pushed to GitHub Container Registry!"
    echo "   Image: ${FULL_IMAGE_NAME}"
    echo ""
    echo "To pull on your server:"
    echo "  docker pull ${FULL_IMAGE_NAME}"
    
else
    echo "❌ Unknown registry: ${REGISTRY}"
    echo "   Use 'dockerhub' or 'ghcr'"
    exit 1
fi

echo ""
echo "🎉 Done! Your image is ready to deploy."
