var redis = require("redis");
if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
  redis_client = redis.createClient(rtg.port, rtg.hostname);

  redis_client.auth(rtg.auth.split(":")[1]);
} else {
  redis_client = redis.createClient();
}

module.exports = redis_client;

