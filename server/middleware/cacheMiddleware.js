// Simple in-memory LRU-like TTL cache for public read queries
const cacheStore = new Map();

/**
 * Cache middleware for public express GET routes
 * @param {number} ttlSeconds Time to live in seconds (default 60s)
 */
const publicCache = (ttlSeconds = 60) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = `__cache__${req.originalUrl || req.url}`;
  const cached = cacheStore.get(key);
  const now = Date.now();

  res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 2}`);

  if (cached && cached.expiry > now) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cached.data);
  }

  // Override res.json to capture response data
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300 && body && body.success !== false) {
      cacheStore.set(key, {
        data: body,
        expiry: now + ttlSeconds * 1000,
      });
    }
    res.setHeader('X-Cache', 'MISS');
    return originalJson(body);
  };

  next();
};

/**
 * Invalidate cached items by pattern or clear all
 * @param {string} pattern Optional URL pattern to match (e.g., 'projects', 'skills', 'profile')
 */
const invalidateCache = (pattern) => {
  if (!pattern) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.includes(pattern)) {
      cacheStore.delete(key);
    }
  }
};

module.exports = { publicCache, invalidateCache };
