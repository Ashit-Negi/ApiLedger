const redis = require("../config/redis");

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const apiKeyId = req.apiKey._id.toString();
    const plan = req.apiKey?.plan || "free";

    // 🔥 Plan आधारित limits
    const limits = {
      free: 10,
      pro: 100,
    };

    const limit = limits[plan] || 10;

    const redisKey = `rate:${apiKeyId}`;

    const current = await redis.incr(redisKey);

    if (current === 1) {
      await redis.expire(redisKey, 60); // 60 sec window
    }

    const ttl = await redis.ttl(redisKey);

    // 📊 Headers (important)
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", Math.max(limit - current, 0));
    res.setHeader("X-RateLimit-Reset", ttl);

    if (current > limit) {
      return res.status(429).json({
        message: "Rate limit exceeded",
        retryAfter: ttl,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = rateLimitMiddleware;
