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
sudo systemctl restart plant-tracker

echo "✅ Deployment complete!"
echo "Access at http://YOUR_SERVER_IP:3000"