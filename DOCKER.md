# Docker Deployment Guide

This guide explains how to deploy the KPI Platform using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher

## Quick Start

### Using Docker Compose (Recommended)

1. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

2. **Check service status**
   ```bash
   docker-compose ps
   ```

3. **View logs**
   ```bash
   # All services
   docker-compose logs -f

   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f mongodb
   ```

4. **Access the application**
   - Application: http://localhost:5000
   - Health check: http://localhost:5000/health

5. **Stop services**
   ```bash
   docker-compose down
   ```

6. **Stop and remove volumes (WARNING: This deletes all data)**
   ```bash
   docker-compose down -v
   ```

## Services

### MongoDB
- **Image**: mongo:7.0
- **Port**: 27017
- **Volumes**:
  - `mongodb_data`: Database files
  - `mongodb_config`: Configuration files

### Backend
- **Build**: From Dockerfile
- **Port**: 5000
- **Depends on**: MongoDB

## Environment Variables

You can customize the deployment by setting environment variables in the `docker-compose.yml` file or by creating a `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb://mongodb:27017/kpi-platform
```

## Building Images

### Build all services
```bash
docker-compose build
```

### Build specific service
```bash
docker-compose build backend
```

### Build with no cache
```bash
docker-compose build --no-cache
```

## Managing Data

### Backup MongoDB Data

```bash
# Create backup
docker exec kpi-platform-mongodb mongodump --out /data/backup

# Copy backup to host
docker cp kpi-platform-mongodb:/data/backup ./mongodb-backup
```

### Restore MongoDB Data

```bash
# Copy backup to container
docker cp ./mongodb-backup kpi-platform-mongodb:/data/backup

# Restore backup
docker exec kpi-platform-mongodb mongorestore /data/backup
```

### View MongoDB Data

```bash
# Connect to MongoDB shell
docker exec -it kpi-platform-mongodb mongosh kpi-platform

# Example queries
db.kpis.find()
db.metrics.find()
db.categories.find()
```

## Scaling

Docker Compose doesn't automatically scale the application. For production environments with high load, consider:

1. **Using Kubernetes** for orchestration
2. **Load balancing** with nginx or similar
3. **MongoDB replica sets** for high availability
4. **Redis** for caching (future enhancement)

## Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build
```

### MongoDB connection issues

```bash
# Check MongoDB is healthy
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Verify network connectivity
docker exec kpi-platform-backend ping mongodb
```

### Port conflicts

If port 5000 or 27017 is already in use, modify the `docker-compose.yml` file:

```yaml
services:
  backend:
    ports:
      - "3000:5000"  # Changed from 5000:5000

  mongodb:
    ports:
      - "27018:27017"  # Changed from 27017:27017
```

### Clear everything and start fresh

```bash
# Stop and remove containers, networks, and volumes
docker-compose down -v

# Remove images
docker rmi $(docker images 'kpi-platform*' -q)

# Rebuild and start
docker-compose up -d --build
```

## Production Considerations

### Security

1. **Use secrets for sensitive data**
   ```yaml
   services:
     backend:
       secrets:
         - mongodb_password

   secrets:
     mongodb_password:
       file: ./secrets/mongodb_password.txt
   ```

2. **Enable MongoDB authentication**
   ```yaml
   services:
     mongodb:
       environment:
         MONGO_INITDB_ROOT_USERNAME: admin
         MONGO_INITDB_ROOT_PASSWORD_FILE: /run/secrets/mongodb_password
   ```

3. **Use environment-specific configurations**

### Monitoring

1. **Health checks** are already configured in docker-compose.yml

2. **Add monitoring tools**:
   - Prometheus for metrics
   - Grafana for visualization
   - ELK stack for logging

### Backups

Set up automated backups:

```bash
# Create backup script
#!/bin/bash
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
docker exec kpi-platform-mongodb mongodump --out /data/backup
docker cp kpi-platform-mongodb:/data/backup $BACKUP_DIR
```

Schedule with cron:
```bash
0 2 * * * /path/to/backup-script.sh
```

## Multi-Stage Build

The Dockerfile uses multi-stage builds to optimize image size:

1. **Stage 1**: Builds the React frontend
2. **Stage 2**: Installs production dependencies
3. **Stage 3**: Creates final production image

This results in a smaller, more secure production image.

## Networking

All services communicate through the `kpi-network` bridge network. Services can reach each other using their service names as hostnames.

## Volumes

Persistent data is stored in Docker volumes:

- `mongodb_data`: Database files
- `mongodb_config`: MongoDB configuration

These volumes persist even when containers are removed (unless you use `docker-compose down -v`).

## Health Checks

Health checks are configured for both services:

- **MongoDB**: Uses mongosh ping command
- **Backend**: HTTP GET to /health endpoint

You can check service health:
```bash
docker-compose ps
```

## Using with Kubernetes

For Kubernetes deployment, convert the Docker Compose file:

```bash
# Install kompose
curl -L https://github.com/kubernetes/kompose/releases/download/v1.28.0/kompose-linux-amd64 -o kompose
chmod +x kompose
sudo mv kompose /usr/local/bin/

# Convert to Kubernetes manifests
kompose convert
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)
