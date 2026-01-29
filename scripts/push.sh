#!/bin/bash
set -e

if [ -z "$DOCKER_USERNAME" ] || [ -z "$DOCKER_PASSWORD" ]; then
  echo "❌ Docker credentials not set"
  exit 1
fi

echo "🔹 Logging into Docker Hub..."
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

echo "🔹 Pushing Frontend Image..."
docker push pam2002/notesapp-frontend:latest

echo "🔹 Pushing Backend Image..."
docker push pam2002/notesapp-backend:latest

echo "✅ Images pushed successfully"
