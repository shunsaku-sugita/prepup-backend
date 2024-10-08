#!/bin/bash

# Setting up the Node environment
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

echo "Starting deployment process"

# Create or overwrite .env file and add environment variables
ENV_FILE="/home/ubuntu/node-api/.env"
echo "Creating .env file with environment variables..."
{
    echo "PORT=$PORT"
    echo "TOKEN_KEY=$TOKEN_KEY"
    echo "DB_CONN_STRING=$DB_CONN_STRING"
    echo "DB_NAME=$DB_NAME"
    echo "USERS_COLLECTION_NAME=$USERS_COLLECTION_NAME"
    echo "MAIL_HOST=$MAIL_HOST"
    echo "MAIL_USERNAME=$MAIL_USERNAME"
    echo "MAIL_PASSWORD=$MAIL_PASSWORD"
} > "$ENV_FILE"

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
