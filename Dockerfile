# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install git for VitePress lastUpdated feature
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files (including .git for lastUpdated)
COPY . .

# Build VitePress site
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built site to nginx
COPY --from=builder /app/.vitepress/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ $uri.html /index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


