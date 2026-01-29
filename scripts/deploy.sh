#!/bin/bash
set -e

echo "🔹 Stopping existing containers (if any)..."
docker stop notesapp-frontend || true
docker stop notesapp-backend || true

docker rm notesapp-frontend || true
docker rm notesapp-backend || true

echo "🔹 Pulling latest images..."
docker pull pam2002/notesapp-frontend:latest
docker pull pam2002/notesapp-backend:latest

echo "🔹 Starting Backend..."
docker run -d \
  --name notesapp-backend \
  -p 5000:5000 \
  pam2002/notesapp-backend:latest

echo "🔹 Starting Frontend..."
docker run -d \
  --name notesapp-frontend \
  -p 3000:3000 \
  pam2002/notesapp-frontend:latest

echo "✅ Deployment completed"
