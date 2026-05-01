const rateLimitStore = {};

const rateLimitMiddleware = (req, res, next) => {
  const key = req.apiKey._id.toString();
  const currentTime = Date.now();

  const windowTime = 60 * 1000; // 1 minute
  const maxRequests = 10; // limit

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = [];
  }

  // remove old timestamps
  rateLimitStore[key] = rateLimitStore[key].filter(
    (timestamp) => currentTime - timestamp < windowTime,
  );

  if (rateLimitStore[key].length >= maxRequests) {
    return res.status(429).json({ message: "Rate limit exceeded" });
  }

  rateLimitStore[key].push(currentTime);
  next();
};

module.exports = rateLimitMiddleware;
