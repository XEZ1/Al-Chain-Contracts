# MAKE SURE TO LOGIN TO EXPO BEFORE BUILDING THE DOCKER IMAGE

# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /ASACFrontEnd

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install Expo CLI globally
RUN npm install -g expo-cli eas-cli

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Accept build argument and set it as an environment variable
ARG EXPO_TOKEN
ENV EXPO_TOKEN=${EXPO_TOKEN}

# Log in to Expo using the token
RUN if [ -n "$EXPO_TOKEN" ]; then expo login --non-interactive --token $EXPO_TOKEN; fi

# Build the Expo project and deploy it to the Expo servers
RUN eas update:configure --non-interactive
RUN eas build:configure --non-interactive
RUN eas update --message "New deployment" --branch main --non-interactive

# Notify about the completeion
CMD ["echo", "Deployment complete"]