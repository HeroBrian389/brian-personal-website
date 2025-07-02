import { getNotionAPI } from "./client";
import { parsePage, enhanceBlock, type ParsedPage, type EnhancedParsedBlock } from "./parser";

// Re-export for convenience
export type { EnhancedParsedBlock } from "./parser";

export interface EnhancedParsedPage extends ParsedPage {
	enhancedBlocks: EnhancedParsedBlock[];
	analysis: {
		complexity: number; // 0-100
		sentiment: "positive" | "neutral" | "negative";
		themes: string[];
		readability: {
			fleschScore: number;
			gradeLevel: number;
		};
	};
}

// Fetch and parse a Notion page
export async function fetchNotionPage(pageId: string): Promise<ParsedPage | null> {
	try {
		const notion = await getNotionAPI();
		const recordMap = await notion.getPage(pageId);
		return parsePage(recordMap);
	} catch (error) {
		console.error("Error fetching Notion page:", error);
		return null;
	}
}

// Fetch and enhance a Notion page with advanced parsing
export async function fetchEnhancedNotionPage(pageId: string): Promise<EnhancedParsedPage | null> {
	const page = await fetchNotionPage(pageId);
	if (!page) return null;

	// Enhance all blocks
	const enhancedBlocks = page.blocks.map((block) => enhanceBlock(block));

	// Analyze the content
	const analysis = analyzeContent(enhancedBlocks);

	return {
		...page,
		enhancedBlocks,
		analysis
	};
}

// Content analysis functions
function analyzeContent(blocks: EnhancedParsedBlock[]) {
	const allText = blocks.map((b) => b.content.map((c) => c.text).join("")).join(" ");

	return {
		complexity: calculateComplexity(blocks),
		sentiment: analyzeSentiment(allText),
		themes: extractThemes(allText),
		readability: calculateReadability(allText)
	};
}

function calculateComplexity(blocks: EnhancedParsedBlock[]): number {
	// Simple complexity score based on:
	// - Average words per sentence
	// - Vocabulary diversity
	// - Sentence structure variation

	const avgWordsPerSentence =
		blocks.reduce((sum, b) => sum + b.typography.avgWordsPerSentence, 0) / blocks.length;

	// Normalize to 0-100
	return Math.min(100, Math.max(0, avgWordsPerSentence * 3));
}

function analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
	// Simple sentiment analysis based on keywords
	const positiveWords = ["good", "great", "love", "happy", "beautiful", "wonderful"];
	const negativeWords = ["bad", "hate", "sad", "terrible", "awful", "horrible"];

	const words = text.toLowerCase().split(/\s+/);
	const positiveCount = words.filter((w) => positiveWords.includes(w)).length;
	const negativeCount = words.filter((w) => negativeWords.includes(w)).length;

	if (positiveCount > negativeCount * 1.5) return "positive";
	if (negativeCount > positiveCount * 1.5) return "negative";
	return "neutral";
}

function extractThemes(text: string): string[] {
	// Extract potential themes based on repeated concepts
	const words = text
		.toLowerCase()
		.split(/\s+/)
		.filter((w) => w.length > 4) // Only longer words
		.filter((w) => !["their", "there", "these", "those", "which", "where"].includes(w));

	const wordFreq: Record<string, number> = {};
	words.forEach((word) => {
		wordFreq[word] = (wordFreq[word] || 0) + 1;
	});

	// Get top themes
	return Object.entries(wordFreq)
		.filter(([_, count]) => count > 2)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([word]) => word);
}

function calculateReadability(text: string): { fleschScore: number; gradeLevel: number } {
	// Simplified Flesch Reading Ease calculation
	const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
	const words = text.split(/\s+/).filter((w) => w.length > 0);
	const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

	const avgWordsPerSentence = words.length / Math.max(1, sentences.length);
	const avgSyllablesPerWord = syllables / Math.max(1, words.length);

	// Flesch Reading Ease Score
	const fleschScore = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

	// Flesch-Kincaid Grade Level
	const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;

	return {
		fleschScore: Math.max(0, Math.min(100, fleschScore)),
		gradeLevel: Math.max(0, Math.min(20, gradeLevel))
	};
}

function countSyllables(word: string): number {
	// Simple syllable counting
	word = word.toLowerCase();
	let count = 0;
	let previousWasVowel = false;

	for (let i = 0; i < word.length; i++) {
		const isVowel = "aeiou".includes(word[i]);
		if (isVowel && !previousWasVowel) {
			count++;
		}
		previousWasVowel = isVowel;
	}

	// Adjust for silent e
	if (word.endsWith("e")) {
		count--;
	}

	return Math.max(1, count);
}

// Cache for parsed pages
const pageCache = new Map<string, { data: EnhancedParsedPage; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedPage(pageId: string): Promise<EnhancedParsedPage | null> {
	const cached = pageCache.get(pageId);

	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.data;
	}

	const page = await fetchEnhancedNotionPage(pageId);
	if (page) {
		pageCache.set(pageId, { data: page, timestamp: Date.now() });
	}

	return page;
}
