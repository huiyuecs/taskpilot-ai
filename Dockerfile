# Multi-stage build for TaskPilot AI

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# Stage 2: Backend and serve frontend
FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY server/package*.json ./
RUN npm install

# Copy backend code
COPY server/ ./

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/client/build ./public

# Expose port
EXPOSE 5000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start server
CMD ["node", "index.js"]

