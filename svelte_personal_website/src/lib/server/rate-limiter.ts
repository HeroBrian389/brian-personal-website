/**
 * Simple in-memory rate limiter for API endpoints
 *
 * This implementation uses a sliding window approach to track requests per IP address.
 * It's suitable for small-scale applications and personal websites where persistence
 * across server restarts is not critical.
 */

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

interface RateLimitOptions {
	/** Maximum number of requests allowed within the window */
	limit: number;
	/** Time window in milliseconds (default: 60000 for 1 minute) */
	windowMs?: number;
	/** Optional key prefix for namespacing different endpoints */
	keyPrefix?: string;
}

interface RateLimitInfo {
	limit: number;
	remaining: number;
	reset: number;
	retryAfter?: number;
}

class RateLimiter {
	private store: Map<string, RateLimitEntry> = new Map();
	private cleanupInterval: NodeJS.Timeout;

	constructor() {
		// Clean up expired entries every minute to prevent memory leaks
		this.cleanupInterval = setInterval(() => {
			const now = Date.now();
			for (const [key, entry] of this.store.entries()) {
				if (entry.resetTime <= now) {
					this.store.delete(key);
				}
			}
		}, 60000);
	}

	/**
	 * Check if a request should be rate limited
	 *
	 * @param key - Unique identifier for the client (usually IP address)
	 * @param options - Rate limiting configuration
	 * @returns Object containing rate limit info and whether the request is allowed
	 */
	check(key: string, options: RateLimitOptions): { allowed: boolean; info: RateLimitInfo } {
		const { limit, windowMs = 60000, keyPrefix = "" } = options;
		const fullKey = keyPrefix ? `${keyPrefix}:${key}` : key;
		const now = Date.now();
		const resetTime = now + windowMs;

		let entry = this.store.get(fullKey);

		// If no entry exists or the window has expired, create a new entry
		if (!entry || entry.resetTime <= now) {
			entry = {
				count: 1,
				resetTime
			};
			this.store.set(fullKey, entry);

			return {
				allowed: true,
				info: {
					limit,
					remaining: limit - 1,
					reset: Math.ceil(resetTime / 1000)
				}
			};
		}

		// Check if the request exceeds the limit
		if (entry.count >= limit) {
			const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

			return {
				allowed: false,
				info: {
					limit,
					remaining: 0,
					reset: Math.ceil(entry.resetTime / 1000),
					retryAfter
				}
			};
		}

		// Increment the counter
		entry.count++;

		return {
			allowed: true,
			info: {
				limit,
				remaining: limit - entry.count,
				reset: Math.ceil(entry.resetTime / 1000)
			}
		};
	}

	/**
	 * Clean up the rate limiter (call this when shutting down)
	 */
	destroy() {
		clearInterval(this.cleanupInterval);
		this.store.clear();
	}
}

// Create a singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Extract client IP address from the request
 *
 * This function checks common headers used by proxies and load balancers
 * before falling back to the remote address.
 *
 * @param request - The incoming request object
 * @returns The client's IP address
 */
export function getClientIp(request: Request): string {
	const headers = request.headers;

	// Check common forwarded headers (in order of preference)
	const forwardedFor = headers.get("x-forwarded-for");
	if (forwardedFor) {
		// X-Forwarded-For can contain multiple IPs; take the first one
		return forwardedFor.split(",")[0].trim();
	}

	const realIp = headers.get("x-real-ip");
	if (realIp) {
		return realIp;
	}

	const cfConnectingIp = headers.get("cf-connecting-ip");
	if (cfConnectingIp) {
		return cfConnectingIp;
	}

	// Fallback to a default if we can't determine the IP
	// In production, you might want to throw an error instead
	return "unknown";
}

/**
 * Create rate limit headers for the response
 *
 * @param info - Rate limit information
 * @returns Headers object with rate limit information
 */
export function createRateLimitHeaders(info: RateLimitInfo): HeadersInit {
	const headers: HeadersInit = {
		"X-RateLimit-Limit": info.limit.toString(),
		"X-RateLimit-Remaining": info.remaining.toString(),
		"X-RateLimit-Reset": info.reset.toString()
	};

	if (info.retryAfter !== undefined) {
		headers["Retry-After"] = info.retryAfter.toString();
	}

	return headers;
}
