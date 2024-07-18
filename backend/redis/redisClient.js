const { createClient } = require('redis');

let client;

const connectRedis = async () => {
  if (!client) {
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = process.env.REDIS_PORT || 6379;

    client = createClient({
      url: `redis://${redisHost}:${redisPort}`
    });

    client.on('connect', () => {
      console.log('Connected to Redis');
    });

    client.on('error', (err) => {
      console.error(`Redis error: ${err.message}`);
    });

    try {
      await client.connect();
      console.log('Redis client connected');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    }
  }

  return client;
};

module.exports = connectRedis;
