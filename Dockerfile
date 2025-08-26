# start of frontend/Dockerfile
# Stage 1: Build the React application
# FROM node:18-alpine as build  <-- OLD LINE
FROM node:18-slim as build      # <-- FIX: Use the Debian-based slim image for better compatibility

# Set an argument for the API URL that can be passed during the build
ARG VITE_API_URL

# Set the environment variable inside the build stage
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application using the environment variable
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# The default Nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]
# end of frontend/Dockerfile