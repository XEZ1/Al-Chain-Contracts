# Nginx Configuration for AI-Chain-Contracts

This directory contains the Nginx configuration files and Dockerfile for setting up the Nginx server.

## Directory Structure

- `certbot/` - Directory for Certbot configuration and scripts, needed to obtain SSL certification.
- `Dockerfile` - Dockerfile to build the Nginx image.
- `nginx.conf` - Main Nginx configuration file.
- `README.md` - This README file.

## Nginx Configuration

The `nginx.conf` file includes configurations for handling HTTP & HTTPS & WS & WSS traffic, proxying requests to the backend application, and serving static files.