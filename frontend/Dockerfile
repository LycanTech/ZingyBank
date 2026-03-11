# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Non-root user (PCI DSS compliance)
RUN addgroup -S zingybank && adduser -S zingybank -G zingybank && \
    chown -R zingybank:zingybank /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && chown zingybank:zingybank /var/run/nginx.pid

USER zingybank

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
