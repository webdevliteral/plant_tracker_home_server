#!/bin/bash
echo "Building and deploying Plant Tracker..."

# Build frontend
cd frontend
npm run build

# Clear old public files
rm -rf ../backend/public/*

# Copy new build
cp -r dist/* ../backend/public/

# Restart backend service
cd ../backend
sudo systemctl restart plant-backend

echo "✅ Deployment complete!"
echo "Access at http://192.168.1.87:3000"
