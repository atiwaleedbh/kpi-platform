# Multi-stage build for Node.js application

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Setup backend
FROM node:18-alpine AS backend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 3: Production image
FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies
COPY --from=backend-build /app/node_modules ./node_modules
COPY package*.json ./

# Copy backend source
COPY server ./server

# Copy frontend build
COPY --from=frontend-build /app/client/build ./client/build

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server/index.js"]
