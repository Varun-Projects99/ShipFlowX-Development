# ==============================================================================
# Production Runtime Environment
# ==============================================================================
FROM node:18-alpine

# Set environment context to production
ENV NODE_ENV=production
WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy backend source files
COPY . .

# Restrict permissions to non-root user 'node'
RUN chown -R node:node /app
USER node

# Expose API runtime port
EXPOSE 5000

# Execute server directly via node
CMD ["node", "server.js"]
