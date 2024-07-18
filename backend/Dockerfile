FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# Ensure redisClient.js is copied to the correct directory
COPY redis/redisClient.js ./redis/redisClient.js

CMD ["node", "app.js"]