# Stage 1: Build the React application
# Use a specific Node.js version for consistency
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json ./
COPY package-lock.json ./

# Install dependencies using 'npm ci' for faster, reliable builds
RUN npm ci

# Copy the rest of your application's source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
# Use a lightweight Nginx image
FROM nginx:stable-alpine

# Copy the built files from the 'build' stage
# This uses the correct 'build' directory from your vite.config.js
COPY --from=build /app/build /usr/share/nginx/html

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# The default command to start Nginx
CMD ["nginx", "-g", "daemon off;"]