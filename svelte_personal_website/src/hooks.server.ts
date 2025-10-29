import type { Handle } from "@sveltejs/kit";
import { dev } from "$app/environment";

export const handle: Handle = async ({ event, resolve }) => {
	// HTTPS redirect in production
	if (
		!dev &&
		event.url.protocol === "http:" &&
		event.url.hostname !== "sveltekit-prerender"
	) {
		// Build the HTTPS version of the URL
		const httpsUrl = new URL(event.url);
		httpsUrl.protocol = "https:";

		// Return a 301 permanent redirect
		return new Response(null, {
			status: 301,
			headers: {
				Location: httpsUrl.toString()
			}
		});
	}

	const response = await resolve(event);

	// Content Security Policy
	const csp = [
		"default-src 'self'",
		// Scripts: self, unsafe-inline for Svelte, YouTube, and other necessary domains
		"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com https://www.google.com https://www.gstatic.com",
		// Styles: self, unsafe-inline for Svelte and TailwindCSS
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		// Images: self, data URIs, HTTPS sources including Notion and GitHub
		"img-src 'self' data: https: blob:",
		// Fonts: self and Google Fonts
		"font-src 'self' https://fonts.gstatic.com",
		// Frames: YouTube and other embed sources
		"frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
		// Connect: self, GitHub API, Notion API, and other necessary APIs
		"connect-src 'self' https://api.github.com https://notion-api.splitbee.io https://*.notion.so wss: https:",
		// Media: self and common media sources
		"media-src 'self' https: blob:",
		// Object: none for security
		"object-src 'none'",
		// Base URI: self only
		"base-uri 'self'",
		// Form action: self only
		"form-action 'self'",
		// Frame ancestors: none (equivalent to X-Frame-Options: DENY)
		"frame-ancestors 'none'",
		// Upgrade insecure requests
		"upgrade-insecure-requests"
	].join("; ");

	// Apply security headers
	response.headers.set("Content-Security-Policy", csp);
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

	// Permissions Policy - disable unnecessary features
	const permissions = [
		"accelerometer=()",
		"ambient-light-sensor=()",
		"autoplay=()",
		"battery=()",
		"camera=()",
		"display-capture=()",
		"document-domain=()",
		"encrypted-media=()",
		"execution-while-not-rendered=()",
		"execution-while-out-of-viewport=()",
		"fullscreen=(self)",
		"geolocation=()",
		"gyroscope=()",
		"layout-animations=(self)",
		"legacy-image-formats=(self)",
		"magnetometer=()",
		"microphone=()",
		"midi=()",
		"navigation-override=()",
		"oversized-images=(self)",
		"payment=()",
		"picture-in-picture=()",
		"publickey-credentials-get=()",
		"sync-xhr=()",
		"usb=()",
		"wake-lock=()",
		"screen-wake-lock=()",
		"web-share=()",
		"xr-spatial-tracking=()"
	].join(", ");

	response.headers.set("Permissions-Policy", permissions);

	// Strict Transport Security (HSTS) - only on HTTPS
	if (event.url.protocol === "https:") {
		// max-age=31536000 (1 year), includeSubDomains, preload
		response.headers.set(
			"Strict-Transport-Security",
			"max-age=31536000; includeSubDomains; preload"
		);
	}

	return response;
};
