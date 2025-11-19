import { getNotionAPI } from "./client";
import { parseRichText, type ParsedRichText } from "./parser";
import cleanedQuotesData from "$lib/data/cleaned-quotes.json";

export interface Quote {
	id: string;
	text: string;
	author?: string;
	source?: string;
	richText: ParsedRichText[];
	tags?: string[];
}

// Quotes page ID from the exploration
const QUOTES_PAGE_ID = "475b7fbc-7ab3-47c6-ab0b-c17177db4acc";

// Use cleaned quotes for now - can switch to Notion database later
export async function fetchQuotes(): Promise<Quote[]> {
	try {
		// For now, use the cleaned quotes JSON
		// Later, this can be replaced with Notion database API calls
		return cleanedQuotesData.quotes.map((q) => {
			const quote: Quote = {
				id: q.id,
				text: q.quote,
				richText: parseRichText([[q.quote, []]]),
				tags: q.tags
			};

			// Only add optional properties if they have valid values
			if (q.author && q.author !== "Unknown") {
				quote.author = q.author;
			}
			if (q.source && q.source.trim()) {
				quote.source = q.source;
			}

			return quote;
		});
	} catch (error) {
		console.error("Error fetching quotes:", error);

		// Fallback to fetching from Notion page
		return fetchQuotesFromNotion();
	}
}

// Original Notion fetching as fallback
async function fetchQuotesFromNotion(): Promise<Quote[]> {
	try {
		const notion = await getNotionAPI();
		const recordMap = await notion.getPage(QUOTES_PAGE_ID);

		const quotes: Quote[] = [];

		// Process all blocks
		Object.entries(recordMap.block).forEach(([_id, blockWrapper]: [string, any]) => {
			const block = blockWrapper.value;

			if (
				block &&
				(block.type === "quote" || block.type === "text" || block.type === "bulleted_list")
			) {
				if (block.properties?.title) {
					const richText = parseRichText(block.properties.title);
					const plainText = richText.map((t) => t.text).join("");

					// Parse quote format (assuming format like "Quote text" - Author)
					const quoteMatch = plainText.match(/^"?([^"]+)"?\s*[-–—]\s*(.+)$/);

					if (quoteMatch && quoteMatch[1] && quoteMatch[2]) {
						const quote: Quote = {
							id: block.id,
							text: quoteMatch[1].trim(),
							richText: parseRichText([[quoteMatch[1], []]]),
							tags: extractTags(plainText)
						};

						if (quoteMatch[2].trim()) {
							quote.author = quoteMatch[2].trim();
						}

						quotes.push(quote);
					} else if (
						plainText.length > 20 &&
						!plainText.toLowerCase().includes("here are some quotes")
					) {
						// If no author found, use the whole text as quote
						quotes.push({
							id: block.id,
							text: plainText,
							richText,
							tags: extractTags(plainText)
						});
					}
				}
			}
		});

		return quotes;
	} catch (error) {
		console.error("Error fetching from Notion:", error);
		return [];
	}
}

function extractTags(text: string): string[] {
	// Extract hashtags or common themes
	const hashtags = text.match(/#\w+/g) || [];
	const themes: string[] = [];

	// Add theme tags based on keywords
	const lowerText = text.toLowerCase();
	if (lowerText.includes("love")) themes.push("love");
	if (lowerText.includes("life") || lowerText.includes("living")) themes.push("life");
	if (lowerText.includes("soul") || lowerText.includes("spirit")) themes.push("spirituality");
	if (lowerText.includes("wisdom") || lowerText.includes("wise")) themes.push("wisdom");
	if (lowerText.includes("time") || lowerText.includes("future") || lowerText.includes("past"))
		themes.push("time");
	if (lowerText.includes("dream")) themes.push("dreams");
	if (lowerText.includes("death") || lowerText.includes("die")) themes.push("mortality");
	if (lowerText.includes("art") || lowerText.includes("artist")) themes.push("art");
	if (lowerText.includes("pain") || lowerText.includes("suffer")) themes.push("suffering");

	return [...new Set([...hashtags.map((h) => h.slice(1)), ...themes])];
}

// Get a random quote
export function getRandomQuote(quotes: Quote[]): Quote | null {
	if (quotes.length === 0) return null;
	const randomIndex = Math.floor(Math.random() * quotes.length);
	const selectedQuote = quotes[randomIndex];
	return selectedQuote ?? null;
}

// Get quotes by tag
export function getQuotesByTag(quotes: Quote[], tag: string): Quote[] {
	return quotes.filter((q) => q.tags?.includes(tag));
}

// Get quotes by author
export function getQuotesByAuthor(quotes: Quote[], author: string): Quote[] {
	return quotes.filter((q) => q.author === author);
}

// Cache for quotes
let quotesCache: { data: Quote[]; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function getCachedQuotes(): Promise<Quote[]> {
	if (quotesCache && Date.now() - quotesCache.timestamp < CACHE_DURATION) {
		return quotesCache.data;
	}

	const quotes = await fetchQuotes();
	quotesCache = { data: quotes, timestamp: Date.now() };
	return quotes;
}
