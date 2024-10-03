#!/bin/bash

# Setting up the Node environment
export NVM_DIR=/home/ubuntu/.nvm  # Use the correct path for the 'ubuntu' user
source $NVM_DIR/nvm.sh  # Source the NVM script

echo "Starting deployment process"

# Download new version of the application
cd /home/ubuntu/node-api || exit 1  # Exit if cd fails

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
