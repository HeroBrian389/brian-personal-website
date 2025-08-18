<script lang="ts">
	
	let { 
		code, 
		language = 'typescript',
		maxLines = 8
	}: {
		code: string;
		language?: string;
		maxLines?: number;
	} = $props();
	
	// Split code into lines and limit display
	let codeLines = $derived(code.trim().split('\n').slice(0, maxLines));
	let hasMore = $derived(code.trim().split('\n').length > maxLines);
</script>

<div class="relative overflow-hidden rounded-sm border border-foreground/10 bg-background/50">
	<pre class="p-4 text-xs font-mono overflow-x-auto"><code class="language-{language}">{#each codeLines as line, i}
{#if i > 0}{"\n"}{/if}{line}{/each}{#if hasMore}
<span class="text-muted-foreground/60">...</span>{/if}</code></pre>
	
	<!-- Gradient fade at bottom -->
	<div class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
	
	<!-- Language indicator -->
	<div class="absolute top-2 right-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 font-light">
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