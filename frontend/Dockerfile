# ==============================================================================
# Phase 1: Build Environment
# ==============================================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install all dependencies (dev included for compilation)
RUN npm ci

# Copy full frontend workspace
COPY . .

# Compile code to static bundles inside /app/dist
RUN npm run build

# ==============================================================================
# Phase 2: Production Runtime Environment
# ==============================================================================
FROM nginx:1.25-alpine

# Copy compiled static assets from Phase 1 build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Mount custom Nginx server configurations
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard web traffic port
EXPOSE 80

# Run Nginx in foreground to keep container running
CMD ["nginx", "-g", "daemon off;"]
