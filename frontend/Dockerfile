# Stage 1: Build the application using Node.js
FROM node:20-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port Nginx will serve on
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
