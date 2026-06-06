/**
 * Simple In-Memory Rate Limiter
 * Suitable for demo and single-instance production/Vercel deployments.
 */

interface RateLimitStore {
  [key: string]: number[];
}

const store: RateLimitStore = {};

// Clean up expired timestamps periodically to prevent memory leaks
if (typeof global !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
      // Keep timestamps within the last 15 minutes (max window size)
      store[key] = store[key].filter((timestamp) => now - timestamp < 15 * 60 * 1000);
      if (store[key].length === 0) {
        delete store[key];
      }
    });
  }, 5 * 60 * 1000).unref?.(); // Use unref to let node process exit normally in tests
}

interface RateLimitResponse {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Checks if the request is within limits.
 * @param key Unique key for the client (e.g., user_id or IP address)
 * @param limit Maximum number of requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResponse> {
  const now = Date.now();
  
  if (!store[key]) {
    store[key] = [];
  }

  // Filter out timestamps older than the window
  store[key] = store[key].filter((timestamp) => now - timestamp < windowMs);

  const currentRequests = store[key].length;

  if (currentRequests >= limit) {
    const oldestTimestamp = store[key][0];
    const resetTime = oldestTimestamp + windowMs;
    
    return {
      allowed: false,
      limit,
      remaining: 0,
      reset: Math.max(0, Math.ceil((resetTime - now) / 1000)),
    };
  }

  // Record new request
  store[key].push(now);

  return {
    allowed: true,
    limit,
    remaining: limit - store[key].length,
    reset: Math.ceil(windowMs / 1000),
  };
}
