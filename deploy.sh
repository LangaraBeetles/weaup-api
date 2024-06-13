#!/bin/bash

# Define your app directory and log file
APP_DIR="/"
LOG_FILE="/logfile.log"

# Function to log messages with timestamp
log() {
    echo "$(date +'%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# Navigate to your app directory
cd $APP_DIR || { log "Failed to navigate to $APP_DIR"; exit 1; }

# Log the start of the deployment
log "Starting deployment..."

# Stop the PM2 process
if pm2 stop 0 2>&1 | tee -a $LOG_FILE; then
    log "PM2 process stopped successfully."
else
    log "Failed to stop PM2 process."
    exit 1
fi

# Pull the latest changes from your repository
if git pull origin main 2>&1 | tee -a $LOG_FILE; then
    log "Pulled latest changes successfully."
else
    log "Failed to pull latest changes."
    exit 1
fi

# Install the latest npm modules
if npm install 2>&1 | tee -a $LOG_FILE; then
    log "NPM modules installed successfully."
else
    log "Failed to install NPM modules."
    exit 1
fi

# Start the PM2 process
if pm2 start 0 2>&1 | tee -a $LOG_FILE; then
    log "PM2 process started successfully."
else
    log "Failed to start PM2 process."
    exit 1
fi

# Show the status of all PM2 processes and log it
if pm2 status 2>&1 | tee -a $LOG_FILE; then
    log "Deployment completed successfully."
else
    log "Failed to retrieve PM2 status."
    exit 1
fi

