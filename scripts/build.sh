#!/bin/bash
set -e

echo "🔹 Building Frontend Docker Image..."
cd my-react-app
docker build -t frontendimage .
docker tag frontendimage pam2002/notesapp-frontend:latest
cd ..

echo "🔹 Building Backend Docker Image..."
cd backend
docker build -t backendimage .
docker tag backendimage pam2002/notesapp-backend:latest
cd ..

echo "✅ Build completed successfully"
