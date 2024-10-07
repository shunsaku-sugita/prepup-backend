#!/bin/bash

# Setting up the Node environment
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

echo "Starting deployment process"

echo "testing env"
echo "PORT: $PORT"

# Download new version of the application
cd /home/ubuntu/node-api || { echo "Failed to change directory"; exit 1; }

# Install the dependencies
echo "Installing dependencies"
sudo npm install || { echo "npm install failed"; exit 1; }

# Build the application
echo "Building application"
sudo npm run build || { echo "npm run build failed"; exit 1; }

# Start the application
echo "Starting the application"
sudo pm2 reload ecosystem.config.js --env production || { echo "pm2 reload failed"; exit 1; }
echo "Deployment process completed"