import { getCachedQuotes } from "$lib/notion/quotes-service";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	try {
		const quotes = await getCachedQuotes();
		return {
			quotes
		};
	} catch (error) {
		console.error("Error loading quotes:", error);
		return {
			quotes: [],
			error: "Failed to load quotes"
		};
	}
};
