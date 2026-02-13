# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files
COPY pb-frontend/package.json pb-frontend/package-lock.json ./
RUN npm ci

# Copy frontend source code
COPY pb-frontend/ ./

# Build the frontend assets
# We set the base URL to /static/ so that assets are referenced correctly
# when served by Django's static files handler.
RUN npm run build -- --base=/static/

# Stage 2: Set up the backend
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=config.settings

WORKDIR /app

# Install system dependencies required for mysqlclient and other python packages
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY pb-backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY pb-backend/ ./

# Copy built frontend assets from the builder stage
# We copy to a directory 'frontend_build' which is added to STATICFILES_DIRS and TEMPLATES in settings.py
COPY --from=frontend-builder /app/frontend/dist /app/frontend_build

# Create staticfiles directory
RUN mkdir -p /app/staticfiles

# Collect static files
# We set dummy environment variables so collectstatic doesn't fail due to missing DB config
# or other runtime vars.
ENV SECRET_KEY=dummy
ENV DATABASE_URL=sqlite:///db.sqlite3
RUN python manage.py collectstatic --noinput

# Expose port 8000
EXPOSE 8000

# Start Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
