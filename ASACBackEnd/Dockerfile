# Use the official Python image
FROM python:3.11.2

# Install Dockerise
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Set the working directory
WORKDIR /ASACImage

# Copy requirements.txt first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the remaining project files
COPY . .

# Run migrations
# RUN python manage.py migrate

# Expose the port Django and Daphne run on
EXPOSE 8000

# Run Daphne server and migrations
CMD dockerize -wait tcp://db:5432 -timeout 60s \
    && python manage.py migrate \
    && daphne ASACBackEnd.asgi:application --bind 0.0.0.0 --port 8000


# CMD ["daphne", "ASACBackEnd.asgi:application", "--bind", "0.0.0.0", "--port", "8000"]

