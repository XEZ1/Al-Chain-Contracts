# Use the official Python image
FROM python:3.11.2

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    redis-server

# Set the working directory
WORKDIR /ASAC

# Copy requirements.txt first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the remaining project files
COPY . .

# Expose the port Django and Daphne run on
EXPOSE 8000

# Start Redis server in the background and run Daphne server
CMD service redis-server start && daphne ASACBackEnd.asgi:application --bind 0.0.0.0 --port 8000
