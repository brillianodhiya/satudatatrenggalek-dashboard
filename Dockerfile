# Stage 1: Build React Dashboard SPA
FROM node:20-alpine AS dashboard-builder
WORKDIR /app/dashboard

COPY dashboard/package*.json ./
RUN npm ci

COPY dashboard/ ./
RUN npm run build

# Stage 2: Production Gateway Server with Headless Chromium Support
FROM node:20-slim

# Install Chromium & System Libraries for Headless Browser Fallback
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production \
    PORT=3000

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
COPY public/ ./public/

# Copy built React Dashboard from Stage 1 into public/dashboard
COPY --from=dashboard-builder /app/public/dashboard ./public/dashboard

# Compile TypeScript Gateway Server
RUN npx tsc

EXPOSE 3000

CMD ["node", "dist/server.js"]
