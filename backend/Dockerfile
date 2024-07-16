# Use the Node.js version 21.2.0 image
FROM node:21.2.0

# Create and change to the app directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json /app

COPY . /app
# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
