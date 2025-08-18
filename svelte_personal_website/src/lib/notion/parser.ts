// Types for parsed content
export interface ParsedRichText {
	text: string;
	annotations: {
		bold?: boolean;
		italic?: boolean;
		strikethrough?: boolean;
		underline?: boolean;
		code?: boolean;
		color?: string;
	};
	href?: string;
}

export interface ParsedBlock {
	id: string;
	type: string;
	content: ParsedRichText[];
	metadata: {
		createdTime: number;
		lastEditedTime: number;
		wordCount: number;
		readingTime: number; // in minutes
	};
	children?: ParsedBlock[];
}

export interface ParsedPage {
	id: string;
	title: string;
	blocks: ParsedBlock[];
	metadata: {
		totalWords: number;
		totalReadingTime: number;
		createdTime: number;
		lastEditedTime: number;
	};
}

// Parse Notion's rich text format
export function parseRichText(richTextArray: any[]): ParsedRichText[] {
	if (!richTextArray || !Array.isArray(richTextArray)) {
		return [];
	}

	return richTextArray.map((item) => {
		// Handle different formats
		if (Array.isArray(item)) {
			const [text, formats] = item;
			const annotations: ParsedRichText["annotations"] = {};
			let href: string | undefined = undefined;

			if (formats && Array.isArray(formats)) {
				formats.forEach((format: any) => {
					if (Array.isArray(format)) {
						const [type, value] = format;
						switch (type) {
							case "b":
								annotations.bold = true;
								break;
							case "i":
								annotations.italic = true;
								break;
							case "s":
								annotations.strikethrough = true;
								break;
							case "u":
								annotations.underline = true;
								break;
							case "c":
								annotations.code = true;
								break;
							case "h":
								annotations.color = value;
								break;
							case "a":
								// This is a link
								href = value;
								break;
						}
					}
				});
			}

			return href ? { text, annotations, href } : { text, annotations };
		}

		// Fallback for plain text
		return { text: String(item), annotations: {} };
	});
}

// Calculate word count and reading time
function calculateMetrics(text: string): { wordCount: number; readingTime: number } {
	const words = text
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0);
	const wordCount = words.length;
	// Average reading speed: 200 words per minute
	const readingTime = Math.ceil(wordCount / 200);

	return { wordCount, readingTime };
}

// Parse a single block
export function parseBlock(block: any): ParsedBlock | null {
	if (!block || !block.value) return null;

	const { id, type, properties, created_time, last_edited_time } = block.value;

	// Extract text content
	let content: ParsedRichText[] = [];
	let plainText = "";

	if (properties?.title) {
		content = parseRichText(properties.title);
		plainText = content.map((c) => c.text).join("");
	} else if (properties?.caption) {
		content = parseRichText(properties.caption);
		plainText = content.map((c) => c.text).join("");
	}

	const metrics = calculateMetrics(plainText);

	return {
		id,
		type,
		content,
		metadata: {
			createdTime: created_time || Date.now(),
			lastEditedTime: last_edited_time || Date.now(),
			...metrics
		}
	};
}

// Parse a full page from Notion
export function parsePage(recordMap: any): ParsedPage | null {
	if (!recordMap || !recordMap.block) return null;

	// Find the page block
	const pageBlock = Object.values(recordMap.block).find(
		(block: any) => block.value?.type === "page"
	) as any;

	if (!pageBlock?.value) return null;

	const { id, properties, created_time, last_edited_time, content: contentIds } = pageBlock.value;

	// Extract title
	const title = properties?.title
		? parseRichText(properties.title)
				.map((t) => t.text)
				.join("")
		: "Untitled";

	// Parse all content blocks
	const blocks: ParsedBlock[] = [];
	let totalWords = 0;

	if (contentIds && Array.isArray(contentIds)) {
		contentIds.forEach((contentId) => {
			const blockData = recordMap.block[contentId];
			const parsedBlock = parseBlock(blockData);

			if (parsedBlock) {
				blocks.push(parsedBlock);
				totalWords += parsedBlock.metadata.wordCount;
			}
		});
	}

	// Calculate total reading time based on total words
	const totalReadingTime = Math.ceil(totalWords / 200);

	return {
		id,
		title,
		blocks,
		metadata: {
			totalWords,
			totalReadingTime,
			createdTime: created_time || Date.now(),
			lastEditedTime: last_edited_time || Date.now()
		}
	};
}

// Enhanced parser with semantic analysis
export interface EnhancedParsedBlock extends ParsedBlock {
	semantics: {
		isQuote: boolean;
		isCode: boolean;
		isHeading: boolean;
		headingLevel?: number;
		language?: string; // for code blocks
	};
	typography: {
		hasSmartQuotes: boolean;
		hasEmDashes: boolean;
		sentenceCount: number;
		avgWordsPerSentence: number;
	};
}

export function enhanceBlock(block: ParsedBlock): EnhancedParsedBlock {
	const plainText = block.content.map((c) => c.text).join("");

	// Semantic analysis
	const isHeading = block.type.startsWith("header") || block.type.startsWith("sub_");
	const headingLevel = block.type.includes("sub_sub_")
		? 3
		: block.type.includes("sub_")
			? 2
			: block.type.includes("header")
				? 1
				: undefined;

	const semantics = {
		isQuote: block.type === "quote",
		isCode: block.type === "code",
		isHeading,
		...(headingLevel !== undefined && { headingLevel })
	};

	// Typography analysis
	const sentences = plainText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
	const typography = {
		hasSmartQuotes: /[""'']/g.test(plainText),
		hasEmDashes: /—|--/g.test(plainText),
		sentenceCount: sentences.length,
		avgWordsPerSentence:
			sentences.length > 0
				? sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) /
					sentences.length
				: 0
	};

	return {
		...block,
		semantics,
		typography
	};
}
