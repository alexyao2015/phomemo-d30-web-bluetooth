#!/usr/bin/env bash

set -euo pipefail

# Build the Docker image with a temporary name
docker build -t temp-build --target build -f docker/Dockerfile --build-arg BASE_URL=${BASE_URL:-/} .

# Create a temporary container from the image
CONTAINER_ID=$(docker create temp-build)

# Copy the dist directory from the container to local filesystem
docker cp $CONTAINER_ID:/app/dist ./dist

# Clean up the temporary container and image
docker rm $CONTAINER_ID
docker rmi temp-build

echo "Build complete. dist/ directory copied locally."
