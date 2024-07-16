# Use the official Node.js image
FROM node:21.2.0

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Expose the port serve runs on
EXPOSE 5000

# Start the app
CMD ["serve", "-s", "build"]
