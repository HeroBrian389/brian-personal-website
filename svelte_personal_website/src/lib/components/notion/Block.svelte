<script lang="ts">
	import type { EnhancedParsedBlock } from "$lib/notion/service";
	import RichText from "./RichText.svelte";

	let {
		block,
		enableTypography = true
	}: {
		block: EnhancedParsedBlock;
		enableTypography?: boolean;
	} = $props();

	// Apply typography enhancements
	function enhanceTypography(text: string): string {
		if (!enableTypography) return text;

		return (
			text
				// Smart quotes
				.replace(/"([^"]*)"/g, "\u201C$1\u201D")
				.replace(/'([^']*)'/g, "\u2018$1\u2019")
				// Em dashes
				.replace(/--/g, "—")
				// Ellipses
				.replace(/\.\.\./g, "…")
		);
	}
</script>

<div class="notion-block notion-{block.type}" data-block-id={block.id}>
	{#if block.type === "text" || block.type === "paragraph"}
		<p class="mb-4 leading-relaxed">
			{#each block.content as content}
				<RichText
					content={{
						...content,
						text: enhanceTypography(content.text)
					}}
				/>
			{/each}
		</p>
	{:else if block.type === "header" || block.type === "heading_1"}
		<h1 class="mt-8 mb-6 text-3xl font-normal">
			{#each block.content as content}
				<RichText
					content={{
						...content,
						text: enhanceTypography(content.text)
					}}
				/>
			{/each}
		</h1>
	{:else if block.type === "sub_header" || block.type === "heading_2"}
		<h2 class="mt-6 mb-4 text-2xl font-normal">
			{#each block.content as content}
				<RichText
					content={{
						...content,
						text: enhanceTypography(content.text)
					}}
				/>
			{/each}
		</h2>
	{:else if block.type === "sub_sub_header" || block.type === "heading_3"}
		<h3 class="mt-4 mb-3 text-xl font-light">
			{#each block.content as content}
				<RichText
					content={{
						...content,
						text: enhanceTypography(content.text)
					}}
				/>
			{/each}
		</h3>
	{:else if block.type === "quote"}
		<blockquote class="border-primary/30 my-6 border-l-4 pl-4 italic">
			{#each block.content as content}
				<RichText
					content={{
						...content,
						text: enhanceTypography(content.text)
					}}
				/>
			{/each}
		</blockquote>
	{:else if block.type === "bulleted_list"}
		<ul class="mb-4 list-inside list-disc space-y-1">
			<li>
				{#each block.content as content}
					<RichText
						content={{
							...content,
							text: enhanceTypography(content.text)
						}}
					/>
				{/each}
			</li>
		</ul>
	{:else if block.type === "numbered_list"}
		<ol class="mb-4 list-inside list-decimal space-y-1">
			<li>
				{#each block.content as content}
					<RichText
						content={{
							...content,
							text: enhanceTypography(content.text)
						}}
					/>
				{/each}
			</li>
		</ol>
	{:else if block.type === "code"}
		<pre class="bg-muted mb-4 overflow-x-auto rounded-lg p-4">
      <code class="text-sm">
        {#each block.content as content}
					{content.text}
				{/each}
      </code>
    </pre>
	{:else if block.type === "divider"}
		<hr class="border-border my-8 border-t" />
	{:else}
		<!-- Fallback for unknown block types -->
		<div class="mb-4">
			{#each block.content as content}
				<RichText {content} />
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Add custom styles for notion blocks */
	.notion-block {
		transition: opacity 0.2s ease;
	}

	/* Improve readability with optimal line length */
	p,
	blockquote,
	li {
		max-width: 65ch;
	}

	/* Add subtle hover effects for interactive feel */
	.notion-block:hover {
		opacity: 0.95;
	}
</style>
