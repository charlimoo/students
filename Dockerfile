
# ---- Build Stage ----
# Use a specific Node LTS version on Alpine for smaller size
FROM node:20-slim AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json ./

RUN npm install -g npm@latest

# Use npm ci for faster, deterministic installs based on lock file
RUN npm i && npm i @rollup/rollup-linux-x64-musl

# Copy the rest of the frontend source code
COPY . .

# Build the React application
RUN npm run build

# ---- Production Stage ----
# Use a stable Nginx Alpine image for minimal size
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (standard HTTP)
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]