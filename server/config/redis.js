// const Redis = require("ioredis");

// const redisPublisher = new Redis();
// const redisSubscriber = new Redis();

// module.exports = { redisPublisher, redisSubscriber };

const Redis = require("ioredis");

const redisPublisher = new Redis(
  "rediss://default:ASklAAIjcDFmOWYyZmMyOGY2N2Q0MDU5OTcwODc0ZGM5OTQyMTcyN3AxMA@knowing-eft-10533.upstash.io:6379"
);
const redisSubscriber = new Redis(
  "rediss://default:ASklAAIjcDFmOWYyZmMyOGY2N2Q0MDU5OTcwODc0ZGM5OTQyMTcyN3AxMA@knowing-eft-10533.upstash.io:6379"
);

module.exports = { redisPublisher, redisSubscriber };
