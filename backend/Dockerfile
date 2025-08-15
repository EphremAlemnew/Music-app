FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create media folder
RUN mkdir -p media

# Make start script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 8000

# Default command
CMD ["./start.sh"]
