import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { rateLimiter, getClientIp, createRateLimitHeaders } from "$lib/server/rate-limiter";
import { env } from "$env/dynamic/private";

export const GET: RequestHandler = async ({ request, fetch }) => {
	// Apply rate limiting: 10 requests per minute per IP
	const clientIp = getClientIp(request);
	const { allowed, info } = rateLimiter.check(clientIp, {
		limit: 10,
		windowMs: 60000, // 1 minute
		keyPrefix: "github-contributions"
	});

	// Always include rate limit headers in the response
	const rateLimitHeaders = createRateLimitHeaders(info);

	// If rate limit exceeded, return 429 Too Many Requests
	if (!allowed) {
		return json(
			{
				error: "Too many requests. Please try again later.",
				success: false,
				contributions: 0
			},
			{
				status: 429,
				headers: rateLimitHeaders
			}
		);
	}

	try {
		const username = env["GITHUB_USERNAME"] || "HeroBrian389";

		// Fetch the contributions fragment from GitHub
		const response = await fetch(
			`https://github.com/${username}?action=show&controller=profiles&tab=contributions&user_id=${username}`,
			{
				headers: {
					accept: "text/html",
					"accept-language": "en-US,en;q=0.9",
					"user-agent":
						"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
					"x-requested-with": "XMLHttpRequest"
				}
			}
		);

		if (!response.ok) {
			throw new Error(`GitHub returned status ${response.status}`);
		}

		const html = await response.text();

		// Parse the HTML to extract contribution count
		// Look for the pattern: "X contributions in the last year"
		const contributionMatch = html.match(
			/(\d{1,5}(?:,\d{3})*)\s*\n?\s*contributions?\s*\n?\s*in the last year/i
		);

		if (contributionMatch && contributionMatch[1]) {
			// Remove commas and convert to number
			const contributions = parseInt(contributionMatch[1].replace(/,/g, ""), 10);

			return json(
				{
					contributions,
					success: true
				},
				{
					headers: rateLimitHeaders
				}
			);
		}

		// Alternative parsing approach if the first one fails
		// Look for the h2 element with contribution info
		const h2Match = html.match(
			/<h2[^>]*>[\s\S]*?(\d{1,5}(?:,\d{3})*)\s*contributions?\s*in the last year[\s\S]*?<\/h2>/i
		);

		if (h2Match && h2Match[1]) {
			const contributions = parseInt(h2Match[1].replace(/,/g, ""), 10);

			return json(
				{
					contributions,
					success: true
				},
				{
					headers: rateLimitHeaders
				}
			);
		}

		// If we can't find the contribution count, return an error
		console.error("Could not parse contribution count from HTML");

		return json(
			{
				contributions: 0,
				success: false,
				error: "Could not parse contribution count"
			},
			{
				headers: rateLimitHeaders
			}
		);
	} catch (_error) {
		console.error("Error fetching GitHub contributions:", _error);

		return json(
			{
				contributions: 0,
				success: false,
				error: _error instanceof Error ? _error.message : "Unknown error"
			},
			{
				headers: rateLimitHeaders
			}
		);
	}
};
