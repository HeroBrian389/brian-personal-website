# Notion Content Implementation Plan for SvelteKit

## Executive Summary

This document outlines a comprehensive plan for implementing custom parsing and display of Notion content in the SvelteKit project. The plan focuses on creating a flexible, performant system that extracts text content from Notion blocks and transforms it into a custom format optimized for typography and reading experience.

## 1. Architecture Decisions

### 1.1 API Choice: Official Notion API vs notion-client

**Recommendation: Use the Official Notion API**

**Rationale:**

- **Type Safety**: The official SDK (`@notionhq/client`) provides comprehensive TypeScript types
- **Maintenance**: Officially supported and regularly updated
- **Features**: Direct access to all Notion API features including pagination, filtering, and real-time updates
- **Stability**: More stable API contract compared to unofficial clients
- **Rate Limiting**: Built-in rate limit handling

**Implementation approach:**

```typescript
// lib/notion/client.ts
import { Client } from "@notionhq/client";

export const notion = new Client({
	auth: process.env.NOTION_TOKEN
});
```

### 1.2 Data Flow Architecture

```
Notion API → Parser → Transformer → Cache → SvelteKit Components
     ↓          ↓          ↓           ↓              ↓
  Raw Blocks  AST-like  Custom     Redis/     Reactive Svelte
             Structure   Format    SQLite      Components
```

## 2. Notion Block Structure Analysis

Based on the current implementation analysis, Notion blocks have the following key properties:

```typescript
interface NotionBlock {
	id: string;
	type: string; // 'paragraph', 'heading_1', 'heading_2', 'heading_3', 'bulleted_list_item', etc.
	created_time: string;
	last_edited_time: string;
	has_children: boolean;
	archived: boolean;
	parent: {
		type: string;
		page_id?: string;
		block_id?: string;
	};
	// Type-specific properties
	[blockType: string]: any;
}
```

### 2.1 Common Block Types for Writing Content

1. **Text Blocks**: paragraph, heading_1, heading_2, heading_3
2. **List Blocks**: bulleted_list_item, numbered_list_item, to_do
3. **Quote Blocks**: quote, callout
4. **Code Blocks**: code
5. **Media Blocks**: image, video, file, bookmark
6. **Layout Blocks**: divider, column_list, column

## 3. Custom Parsing Strategies

### 3.1 Parser Architecture

```typescript
// lib/notion/parser/types.ts
export interface ParsedBlock {
	id: string;
	type: BlockType;
	content: ParsedContent;
	metadata: BlockMetadata;
	children?: ParsedBlock[];
}

export interface ParsedContent {
	text?: RichText[];
	caption?: RichText[];
	language?: string; // for code blocks
	checked?: boolean; // for to_do blocks
}

export interface BlockMetadata {
	createdTime: Date;
	lastEditedTime: Date;
	wordCount: number;
	readingTime: number;
	level?: number; // for headings
}

export interface RichText {
	plain_text: string;
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
```

### 3.2 Block-Specific Parsers

```typescript
// lib/notion/parser/parsers.ts
export class BlockParser {
	private parsers: Map<string, (block: any) => ParsedContent>;

	constructor() {
		this.parsers = new Map([
			["paragraph", this.parseParagraph],
			["heading_1", this.parseHeading],
			["heading_2", this.parseHeading],
			["heading_3", this.parseHeading],
			["bulleted_list_item", this.parseListItem],
			["numbered_list_item", this.parseListItem],
			["quote", this.parseQuote],
			["code", this.parseCode],
			["callout", this.parseCallout]
		]);
	}

	parse(block: any): ParsedBlock {
		const parser = this.parsers.get(block.type) || this.parseDefault;
		const content = parser(block);
		const metadata = this.extractMetadata(block, content);

		return {
			id: block.id,
			type: block.type,
			content,
			metadata
		};
	}

	private extractMetadata(block: any, content: ParsedContent): BlockMetadata {
		const text = this.extractPlainText(content);
		return {
			createdTime: new Date(block.created_time),
			lastEditedTime: new Date(block.last_edited_time),
			wordCount: this.countWords(text),
			readingTime: Math.ceil(this.countWords(text) / 200), // 200 words per minute
			level: this.getHeadingLevel(block.type)
		};
	}
}
```

## 4. Data Transformation Pipeline

### 4.1 Content Transformer

```typescript
// lib/notion/transformer/content-transformer.ts
export class ContentTransformer {
	async transform(blocks: ParsedBlock[]): Promise<TransformedContent> {
		const content = {
			blocks: await this.enhanceBlocks(blocks),
			metadata: this.calculateMetadata(blocks),
			structure: this.analyzeStructure(blocks),
			typography: this.analyzeTypography(blocks)
		};

		return content;
	}

	private async enhanceBlocks(blocks: ParsedBlock[]): Promise<EnhancedBlock[]> {
		return Promise.all(
			blocks.map(async (block) => {
				const enhanced = { ...block };

				// Add typography enhancements
				if (block.type === "paragraph") {
					enhanced.typography = this.analyzeBlockTypography(block);
				}

				// Add semantic analysis
				enhanced.semantics = await this.analyzeSemantics(block);

				// Add reading metrics
				enhanced.metrics = this.calculateBlockMetrics(block);

				return enhanced;
			})
		);
	}

	private analyzeTypography(blocks: ParsedBlock[]): TypographyAnalysis {
		return {
			averageSentenceLength: this.calculateAvgSentenceLength(blocks),
			paragraphLengths: this.getParagraphLengths(blocks),
			headingHierarchy: this.analyzeHeadingStructure(blocks),
			emphasisUsage: this.analyzeEmphasis(blocks)
		};
	}
}
```

### 4.2 Custom Format Schema

```typescript
// lib/notion/types/transformed.ts
export interface TransformedContent {
	blocks: EnhancedBlock[];
	metadata: ContentMetadata;
	structure: ContentStructure;
	typography: TypographyAnalysis;
}

export interface ContentMetadata {
	totalWords: number;
	totalReadingTime: number;
	lastModified: Date;
	complexity: "simple" | "moderate" | "complex";
	topics: string[];
}

export interface ContentStructure {
	outline: OutlineItem[];
	sections: Section[];
	hasTableOfContents: boolean;
	depth: number;
}
```

## 5. Storage and Caching Strategy

### 5.1 Multi-Layer Caching

```typescript
// lib/notion/cache/strategy.ts
export class CacheStrategy {
	private memoryCache: Map<string, CachedContent>;
	private redis?: Redis;
	private sqlite?: Database;

	constructor(config: CacheConfig) {
		this.memoryCache = new Map();
		if (config.redis) {
			this.redis = new Redis(config.redis);
		}
		if (config.sqlite) {
			this.sqlite = new Database(config.sqlite.path);
		}
	}

	async get(key: string): Promise<TransformedContent | null> {
		// L1: Memory cache (instant)
		const memory = this.memoryCache.get(key);
		if (memory && !this.isExpired(memory)) {
			return memory.content;
		}

		// L2: Redis cache (fast)
		if (this.redis) {
			const cached = await this.redis.get(key);
			if (cached) {
				const parsed = JSON.parse(cached);
				this.memoryCache.set(key, parsed);
				return parsed.content;
			}
		}

		// L3: SQLite (persistent)
		if (this.sqlite) {
			const row = this.sqlite.prepare("SELECT * FROM cache WHERE key = ?").get(key);
			if (row && !this.isExpired(row)) {
				const content = JSON.parse(row.content);
				await this.promoteToUpperCaches(key, content);
				return content;
			}
		}

		return null;
	}

	async set(key: string, content: TransformedContent, ttl?: number): Promise<void> {
		const cached: CachedContent = {
			content,
			timestamp: Date.now(),
			ttl: ttl || 3600000 // 1 hour default
		};

		// Write to all cache layers
		this.memoryCache.set(key, cached);

		if (this.redis) {
			await this.redis.setex(key, cached.ttl / 1000, JSON.stringify(cached));
		}

		if (this.sqlite) {
			this.sqlite
				.prepare(
					`
        INSERT OR REPLACE INTO cache (key, content, timestamp, ttl)
        VALUES (?, ?, ?, ?)
      `
				)
				.run(key, JSON.stringify(content), cached.timestamp, cached.ttl);
		}
	}
}
```

### 5.2 Cache Invalidation

```typescript
// lib/notion/cache/invalidation.ts
export class CacheInvalidation {
	constructor(
		private cache: CacheStrategy,
		private notion: Client
	) {}

	async setupWebhook(): Promise<void> {
		// Implement Notion webhook listener for real-time updates
	}

	async invalidateBlock(blockId: string): Promise<void> {
		const keys = await this.getRelatedCacheKeys(blockId);
		await Promise.all(keys.map((key) => this.cache.delete(key)));
	}

	async refreshContent(pageId: string): Promise<TransformedContent> {
		const fresh = await this.fetchAndTransform(pageId);
		await this.cache.set(`page:${pageId}`, fresh);
		return fresh;
	}
}
```

## 6. Component Architecture

### 6.1 Core Components

```typescript
// lib/components/notion/index.ts
export { default as NotionRenderer } from "./NotionRenderer.svelte";
export { default as NotionBlock } from "./NotionBlock.svelte";
export { default as NotionText } from "./NotionText.svelte";
export { default as NotionHeading } from "./NotionHeading.svelte";
export { default as NotionList } from "./NotionList.svelte";
export { default as NotionCode } from "./NotionCode.svelte";
export { default as NotionQuote } from "./NotionQuote.svelte";
```

### 6.2 Main Renderer Component

```svelte
<!-- lib/components/notion/NotionRenderer.svelte -->
<script lang="ts">
	import { onMount } from "svelte";
	import type { TransformedContent } from "$lib/notion/types";
	import NotionBlock from "./NotionBlock.svelte";
	import ReadingProgress from "./ReadingProgress.svelte";
	import TableOfContents from "./TableOfContents.svelte";
	import TypographyControls from "./TypographyControls.svelte";

	export let content: TransformedContent;
	export let options: RenderOptions = {};

	let readingProgress = 0;
	let activeSection = "";

	onMount(() => {
		// Setup intersection observer for reading progress
		setupReadingTracking();
	});
</script>

<article class="notion-content">
	{#if options.showControls}
		<TypographyControls />
	{/if}

	{#if options.showProgress}
		<ReadingProgress {readingProgress} />
	{/if}

	{#if options.showToc && content.structure.hasTableOfContents}
		<TableOfContents outline={content.structure.outline} {activeSection} />
	{/if}

	<div class="notion-blocks">
		{#each content.blocks as block}
			<NotionBlock {block} />
		{/each}
	</div>
</article>

<style>
	.notion-content {
		@apply prose prose-lg mx-auto max-w-4xl;
	}
</style>
```

### 6.3 Block Component

```svelte
<!-- lib/components/notion/NotionBlock.svelte -->
<script lang="ts">
	import type { EnhancedBlock } from "$lib/notion/types";
	import NotionText from "./NotionText.svelte";
	import NotionHeading from "./NotionHeading.svelte";
	import NotionList from "./NotionList.svelte";
	import NotionCode from "./NotionCode.svelte";
	import NotionQuote from "./NotionQuote.svelte";

	export let block: EnhancedBlock;

	const components = {
		paragraph: NotionText,
		heading_1: NotionHeading,
		heading_2: NotionHeading,
		heading_3: NotionHeading,
		bulleted_list_item: NotionList,
		numbered_list_item: NotionList,
		code: NotionCode,
		quote: NotionQuote
	};

	$: Component = components[block.type] || NotionText;
</script>

<div class="notion-block notion-block-{block.type}" data-block-id={block.id}>
	<Component {block} />
</div>

<style>
	.notion-block {
		@apply mb-4;
	}
</style>
```

## 7. Specific Features Implementation

### 7.1 Typography Enhancements

```typescript
// lib/notion/features/typography.ts
export class TypographyEnhancer {
	enhance(text: string): EnhancedText {
		return {
			original: text,
			enhanced: this.applyEnhancements(text),
			features: this.detectFeatures(text)
		};
	}

	private applyEnhancements(text: string): string {
		let enhanced = text;

		// Smart quotes
		enhanced = enhanced.replace(/"/g, (match, offset) => {
			return this.isOpeningQuote(enhanced, offset) ? '"' : '"';
		});

		// Em dashes
		enhanced = enhanced.replace(/--/g, "—");

		// Ellipses
		enhanced = enhanced.replace(/\.\.\./g, "…");

		// Prevent widows and orphans
		enhanced = this.preventWidows(enhanced);

		return enhanced;
	}

	private detectFeatures(text: string): TypographyFeatures {
		return {
			hasSmartQuotes: /[""'']/g.test(text),
			hasEmDashes: /—/g.test(text),
			avgWordsPerSentence: this.calculateAvgWordsPerSentence(text),
			fleschScore: this.calculateFleschScore(text)
		};
	}
}
```

### 7.2 Reading Time Calculator

```typescript
// lib/notion/features/reading-time.ts
export class ReadingTimeCalculator {
	private readonly WPM = 200; // Average reading speed
	private readonly IMAGE_TIME = 12; // seconds per image

	calculate(content: TransformedContent): ReadingMetrics {
		const textTime = this.calculateTextTime(content);
		const imageTime = this.calculateImageTime(content);
		const codeTime = this.calculateCodeTime(content);

		const totalSeconds = textTime + imageTime + codeTime;

		return {
			minutes: Math.ceil(totalSeconds / 60),
			seconds: totalSeconds,
			words: content.metadata.totalWords,
			breakdown: {
				text: textTime,
				images: imageTime,
				code: codeTime
			}
		};
	}

	private calculateTextTime(content: TransformedContent): number {
		return (content.metadata.totalWords / this.WPM) * 60;
	}

	private calculateCodeTime(content: TransformedContent): number {
		const codeBlocks = content.blocks.filter((b) => b.type === "code");
		// Code reading is slower, estimate 100 WPM
		return codeBlocks.reduce((acc, block) => {
			const words = this.countWords(block.content.text?.[0]?.plain_text || "");
			return acc + (words / 100) * 60;
		}, 0);
	}
}
```

### 7.3 Content Analysis

```typescript
// lib/notion/features/content-analysis.ts
export class ContentAnalyzer {
	analyze(content: TransformedContent): ContentAnalysis {
		return {
			complexity: this.analyzeComplexity(content),
			topics: this.extractTopics(content),
			sentiment: this.analyzeSentiment(content),
			structure: this.analyzeStructure(content),
			quality: this.assessQuality(content)
		};
	}

	private analyzeComplexity(content: TransformedContent): ComplexityScore {
		const factors = {
			sentenceLength: this.avgSentenceLength(content),
			wordLength: this.avgWordLength(content),
			vocabularyDiversity: this.vocabularyDiversity(content),
			technicalTerms: this.countTechnicalTerms(content)
		};

		return {
			score: this.calculateComplexityScore(factors),
			level: this.getComplexityLevel(factors),
			factors
		};
	}

	private extractTopics(content: TransformedContent): Topic[] {
		// Use TF-IDF or similar algorithm to extract key topics
		const words = this.extractWords(content);
		const frequencies = this.calculateTermFrequencies(words);
		return this.identifyTopics(frequencies);
	}
}
```

## 8. API Routes Implementation

```typescript
// src/routes/api/notion/[pageId]/+server.ts
import { json } from "@sveltejs/kit";
import { notion } from "$lib/notion/client";
import { BlockParser } from "$lib/notion/parser";
import { ContentTransformer } from "$lib/notion/transformer";
import { CacheStrategy } from "$lib/notion/cache";

export async function GET({ params, url }) {
	const { pageId } = params;
	const refresh = url.searchParams.get("refresh") === "true";

	try {
		// Check cache first
		if (!refresh) {
			const cached = await cache.get(`page:${pageId}`);
			if (cached) {
				return json(cached);
			}
		}

		// Fetch from Notion
		const blocks = await fetchAllBlocks(pageId);

		// Parse blocks
		const parsed = blocks.map((block) => parser.parse(block));

		// Transform content
		const transformed = await transformer.transform(parsed);

		// Cache result
		await cache.set(`page:${pageId}`, transformed);

		return json(transformed);
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}

async function fetchAllBlocks(pageId: string) {
	const blocks = [];
	let cursor;

	do {
		const response = await notion.blocks.children.list({
			block_id: pageId,
			start_cursor: cursor
		});

		blocks.push(...response.results);
		cursor = response.next_cursor;
	} while (cursor);

	return blocks;
}
```

## 9. Performance Optimizations

### 9.1 Incremental Loading

- Load first screen content immediately
- Lazy load remaining blocks as user scrolls
- Preload next likely content based on reading patterns

### 9.2 Block-Level Caching

- Cache individual blocks to enable partial updates
- Use content hashing for efficient invalidation
- Implement stale-while-revalidate pattern

### 9.3 Worker Thread Processing

- Move heavy parsing/transformation to Web Workers
- Implement streaming parser for large documents
- Use SharedArrayBuffer for efficient data transfer

## 10. Migration Path

### Phase 1: Core Infrastructure (Week 1-2)

1. Set up Notion API client
2. Implement basic block parser
3. Create simple transformer
4. Build basic cache layer

### Phase 2: Component Development (Week 3-4)

1. Create core Svelte components
2. Implement basic rendering
3. Add typography enhancements
4. Build reading progress tracker

### Phase 3: Advanced Features (Week 5-6)

1. Implement content analysis
2. Add advanced caching
3. Build real-time sync
4. Create editing interface (if needed)

### Phase 4: Optimization & Polish (Week 7-8)

1. Performance optimization
2. Accessibility improvements
3. SEO enhancements
4. Testing & documentation

## Conclusion

This implementation plan provides a robust foundation for building a custom Notion content parser and renderer in SvelteKit. The architecture is designed to be:

- **Performant**: Multi-layer caching and incremental loading
- **Flexible**: Modular parser and transformer system
- **Feature-rich**: Typography enhancements, reading analytics, and content analysis
- **Maintainable**: Clear separation of concerns and TypeScript throughout
- **Scalable**: Designed to handle large documents and real-time updates

The system can be extended with additional features like collaborative editing, version control, and advanced analytics as needed.
