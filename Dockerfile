# STAGE 1: Build Frontend
FROM node:18-bullseye-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2: Production Server
FROM node:18-bullseye-slim

# Install minimal build essentials for better-sqlite3 (if needed at runtime)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy production dependencies only
COPY package*.json ./
RUN npm install --production

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy server code
COPY server ./server
COPY .env.example .env

# Expose port
EXPOSE 3001

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3001

# Start command
CMD ["node", "server/index.cjs"]
