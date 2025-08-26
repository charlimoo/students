# Stage 1: Build the React application
FROM node:18 AS build

# ... (rest of the build stage) ...

RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html # <-- CORRECTED LINE

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# The default Nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]