# ---- Builder Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the package manifest and the yarn lockfile
COPY package.json yarn.lock ./

# Install dependencies using Yarn. 
# --frozen-lockfile ensures it uses the lockfile exclusively, which is best practice for CI/CD.
RUN yarn install --frozen-lockfile

# Copy the rest of your application source code
COPY . .

# Build the application using Yarn
RUN yarn build

# ---- Production Stage ----
FROM nginx:alpine

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]