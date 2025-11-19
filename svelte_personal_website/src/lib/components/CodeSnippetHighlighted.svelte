<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let {
		code,
		language = "typescript",
		maxLines = 12
	}: {
		code: string;
		language?: string;
		maxLines?: number;
	} = $props();

	let highlightedHtml = $state("");
	let isLoading = $state(true);

	// Split code into lines and limit display
	let processedCode = $derived(() => {
		const lines = code.trim().split("\n");
		const truncated = lines.slice(0, maxLines);
		const hasMore = lines.length > maxLines;
		return {
			code: truncated.join("\n"),
			hasMore
		};
	});

	onMount(async () => {
		try {
			const { codeToHtml } = await import("shiki");

			const html = await codeToHtml(processedCode().code, {
				lang: language,
				theme: "github-dark-dimmed",
				transformers: [
					{
						pre(node) {
							// Remove default styles and add our classes
							delete node.properties["style"];
							node.properties["class"] = "shiki-pre";
						},
						code(node) {
							delete node.properties["style"];
						},
						line(node) {
							node.properties["class"] = "shiki-line";
						}
					}
				]
			});

			highlightedHtml = html;
			isLoading = false;
		} catch (error) {
			console.error("Failed to highlight code:", error);
			isLoading = false;
		}
	});
</script>

<div
	class="code-snippet-container border-foreground/10 relative overflow-hidden rounded-sm border bg-[#0d1117]"
>
	{#if isLoading}
		<div class="p-4">
			<pre class="text-foreground/40 font-mono text-xs"><code>{processedCode().code}</code
				></pre>
		</div>
	{:else}
		<div class="syntax-wrapper" in:fade={{ duration: 300 }}>
			{@html highlightedHtml}
			{#if processedCode().hasMore}
				<div class="px-4 pb-2">
					<span class="text-muted-foreground/60 font-mono text-xs">...</span>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Gradient fade at bottom -->
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/80 to-transparent"
	></div>

	<!-- Language indicator -->
	<div
		class="text-muted-foreground/40 bg-background/10 absolute top-2 right-2 rounded-sm px-2 py-1 text-[10px] font-light tracking-[0.2em] uppercase backdrop-blur-sm"
	>
		{language}
	</div>
</div>

<style>
	.code-snippet-container {
		font-size: 0.75rem;
		line-height: 1.5;
	}

	:global(.syntax-wrapper pre.shiki-pre) {
		margin: 0;
		padding: 1rem;
		background: transparent !important;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
	}

	:global(.syntax-wrapper pre.shiki-pre::-webkit-scrollbar) {
		display: none;
	}

	:global(.syntax-wrapper .shiki-line) {
		display: block;
		min-height: 1.125rem;
	}

	/* Custom color adjustments for better contrast */
	:global(.syntax-wrapper span) {
		font-family:
			ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
	}
</style>
