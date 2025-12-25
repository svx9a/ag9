FROM node:18-bullseye-slim

# Install Python and build essentials for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 3001

# Start command
CMD ["node", "server/index.cjs"]
