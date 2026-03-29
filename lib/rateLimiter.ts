/**
 * In-memory rate limiting store for Next.js API Routes.
 * 
 * Note: Data structured to easily swap the `memoryStore` logic 
 * with a Redis client (like Upstash) in the future.
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory persistent map (persists across module reloads in production edge/node context, but may clear on Vercel cold starts)
// Ideal to swap to Redis instances later.
const memoryStore = new Map<string, RateLimitRecord>();

export async function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now();
  let record = memoryStore.get(ip);

  // If IP not seen before or tracking window has expired
  if (!record || record.resetTime < now) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    memoryStore.set(ip, record);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: record.resetTime,
    };
  }

  // If within window and limit exceeded
  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // Still within limits, increment
  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}

/**
 * Extracts the real IP from the NextRequest headers.
 */
export function getIP(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  return "127.0.0.1";
}
