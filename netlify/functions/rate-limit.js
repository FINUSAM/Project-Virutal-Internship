// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitStore = new Map();

function isRateLimited(identifier, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, []);
  }
  
  const requests = rateLimitStore.get(identifier);
  
  // Remove old requests outside the window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  rateLimitStore.set(identifier, validRequests);
  
  // Check if rate limit exceeded
  if (validRequests.length >= maxRequests) {
    return true;
  }
  
  // Add current request
  validRequests.push(now);
  return false;
}

function getRateLimitHeaders(identifier, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(identifier)) {
    return {
      'X-RateLimit-Limit': maxRequests,
      'X-RateLimit-Remaining': maxRequests,
      'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
    };
  }
  
  const requests = rateLimitStore.get(identifier);
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  const remaining = Math.max(0, maxRequests - validRequests.length);
  
  return {
    'X-RateLimit-Limit': maxRequests,
    'X-RateLimit-Remaining': remaining,
    'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
  };
}

module.exports = {
  isRateLimited,
  getRateLimitHeaders
}; 