# MAKE SURE TO LOGIN TO EXPO BEFORE BUILDING THE DOCKER IMAGE

# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /ASACFrontEnd

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install Expo CLI globally
RUN npm install -g expo-cli

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Expo project and deploy it to the Expo servers
RUN eas update:configure --non-interactive
RUN eas build:configure --non-interactive
RUN eas update --message "New deployment" --branch main --non-interactive

# Notify about the completeion
CMD ["echo", "Deployment complete"]