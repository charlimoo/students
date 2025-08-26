# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g npm@latest
RUN npm ci

COPY . .

# Build the React application
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

# Use 'build' because Vite outputs here by default
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom Nginx config if required
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
