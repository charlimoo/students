
# ---- Build Stage ----
# Use a specific Node LTS version on Alpine for smaller size
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY ./package*.json ./
# Use npm ci for faster, deterministic installs based on lock file
RUN npm ci

# Copy the rest of the frontend source code
COPY . .

# Build the React application
RUN npm run build

# ---- Production Stage ----
# Use a stable Nginx Alpine image for minimal size
FROM nginx:stable-alpine as production-stage

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration from the build context
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static assets from the build stage to Nginx's web root
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html

# Expose port 80 (standard HTTP)
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]