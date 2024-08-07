# MAKE SURE TO CREATE AN EXPO TOKEN .ENV FILE BEFORE RUNNING THE DOCKERFILE

# Use the official Node.js image
FROM node:18-alpine

# Install Git
RUN apk add --no-cache git bash

# Set the working directory
WORKDIR /frontend

# Copy the package.json and package-lock.json
COPY frontend/package*.json ./

# Install Expo, Expo CLI and EAS CLI globally
RUN npm install -g eas-cli

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the project files
COPY frontend/. .

# Copy the GIT repository
COPY .git .git

# Log in to Expo using the token
ARG TOKEN
ENV CI=1

# Add EXPO_TOKEN to bashrc for all future sessions and source it for the current session
# Build the Expo project and deploy it to the Expo servers
RUN echo 'export EXPO_TOKEN=${TOKEN}' >> /root/.bashrc && \
    source /root/.bashrc && \
    echo "EXPO_TOKEN is $EXPO_TOKEN" && \
    npx eas-cli update:configure && \
    echo "Configured EAS" && \
    npx eas-cli build:configure --platform all && \
    echo "Configured build" && \
    npx eas-cli update --message "New deployment" --branch main && \
    echo "Deployment done"

# Notify about the completeion
CMD ["echo", "Deployment complete"]
