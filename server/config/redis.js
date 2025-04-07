const Redis = require("ioredis");

const redisPublisher = new Redis();
const redisSubscriber = new Redis();

module.exports = { redisPublisher, redisSubscriber };
