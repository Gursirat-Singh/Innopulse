// Simple in-memory rate limiter for forgot-password
// In production, use Redis or a proper rate limiting service

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count++
  return true
}

export function getRateLimitReset(identifier: string): number | null {
  const entry = rateLimitMap.get(identifier)
  return entry ? entry.resetTime : null
}
