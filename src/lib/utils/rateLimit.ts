interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimiter {
  isAllowed(key: string): boolean;
}

export function createRateLimiter(maxRequests: number, windowMs: number): RateLimiter {
  const entries = new Map<string, RateLimitEntry>();

  // Periodic cleanup of expired entries
  let lastCleanup = Date.now();
  const CLEANUP_INTERVAL = windowMs * 2;

  function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of entries) {
      if (entry.resetAt <= now) {
        entries.delete(key);
      }
    }
  }

  return {
    isAllowed(key: string): boolean {
      cleanup();

      const now = Date.now();
      const entry = entries.get(key);

      if (!entry || entry.resetAt <= now) {
        entries.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }

      if (entry.count < maxRequests) {
        entry.count++;
        return true;
      }

      return false;
    },
  };
}
