# Use the official Python image
FROM python:3.11.2

# Set the working directory
WORKDIR /ASAC

# Copy requirements.txt
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . .

# Expose the port Django runs on
EXPOSE 8000

# Run Daphne server
CMD ["daphne", "ASACBackEnd.asgi:application", "--bind", "0.0.0.0", "--port", "8000"]
