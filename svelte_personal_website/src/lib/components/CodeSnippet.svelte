<script lang="ts">
	let {
		code,
		language = "typescript",
		maxLines = 8
	}: {
		code: string;
		language?: string;
		maxLines?: number;
	} = $props();

	// Split code into lines and limit display
	let codeLines = $derived(code.trim().split("\n").slice(0, maxLines));
	let hasMore = $derived(code.trim().split("\n").length > maxLines);
</script>

<div class="border-foreground/10 bg-background/50 relative overflow-hidden rounded-sm border">
	<pre class="overflow-x-auto p-4 font-mono text-xs"><code class="language-{language}"
			>{#each codeLines as line, i}
				{#if i > 0}{"\n"}{/if}{line}{/each}{#if hasMore}
				<span class="text-muted-foreground/60">...</span>{/if}</code
		></pre>

	<!-- Gradient fade at bottom -->
	<div
		class="from-background pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t to-transparent"
	></div>

	<!-- Language indicator -->
	<div
		class="text-muted-foreground/40 absolute top-2 right-2 text-[10px] font-light tracking-[0.2em] uppercase"
	>
		{language}
	</div>
</div>

<style>
	pre {
		scrollbar-width: none;
	}

	pre::-webkit-scrollbar {
		display: none;
	}
</style>
