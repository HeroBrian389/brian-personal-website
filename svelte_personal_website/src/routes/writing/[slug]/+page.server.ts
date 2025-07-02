import { getCachedPage } from "$lib/notion/service";
import { NOTION_CONFIG } from "$lib/notion/config.server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// Get page ID from slug
	const pageId = NOTION_CONFIG.writingPages[slug as keyof typeof NOTION_CONFIG.writingPages];

	if (!pageId) {
		return {
			writingPage: null,
			error: "Page not found"
		};
	}

	try {
		const writingPage = await getCachedPage(pageId);

		if (!writingPage) {
			return {
				writingPage: null,
				error: "Failed to load page"
			};
		}

		return {
			writingPage,
			error: null
		};
	} catch (error) {
		console.error("Error loading page:", error);
		return {
			writingPage: null,
			error: "Failed to load page. Please try again later."
		};
	}
};
