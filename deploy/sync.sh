#!/bin/bash

# Setting up the Node environment
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

echo "Starting deployment process"

echo "Adding environment variables"
export PORT=${PORT}
export TOKEN_KEY=${TOKEN_KEY}
export DB_CONN_STRING=${DB_CONN_STRING}
export DB_NAME=${DB_NAME}
export USERS_COLLECTION_NAME=${USERS_COLLECTION_NAME}
export MAIL_HOST=${MAIL_HOST}
export MAIL_USERNAME=${MAIL_USERNAME}
export MAIL_PASSWORD=${MAIL_PASSWORD}

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
sudo -E pm2 reload ecosystem.config.js --env production || { echo "pm2 reload failed"; exit 1; }
echo "Deployment process completed"
