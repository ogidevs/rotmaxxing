# Use a Python image as the base
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Install required system dependencies (for ffmpeg and other packages)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the Python requirements file into the container
COPY requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application code into the container
COPY . /app/

# Expose port 8000 for FastAPI
EXPOSE 8000

# Command to run FastAPI app with Uvicorn
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"]
