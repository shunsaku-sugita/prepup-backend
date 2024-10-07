#!/bin/bash

# Setting up the Node environment
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

echo "Starting deployment process"

echo "testing env"
echo "PORT: $PORT"

# Download new version of the application
cd /home/ubuntu/node-api

# Install the dependencies
echo "Installing dependencies"
npm install

# Build the application
echo "Building application"
npm run build

# Start the application
echo "Starting the application"
pm2 reload ecosystem.config.js --env production

echo "Deployment process completed"
