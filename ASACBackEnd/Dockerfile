# Use the official Python image
FROM python:3.11.2

# Set the working directory
WORKDIR /ASACImage

# Copy requirements.txt first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the remaining project files
COPY . .

# Expose the port Django and Daphne run on
EXPOSE 8000

# Run Daphne server
CMD ["daphne", "ASACBackEnd.asgi:application", "--bind", "0.0.0.0", "--port", "8000"]

