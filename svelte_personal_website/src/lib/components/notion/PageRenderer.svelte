<script lang="ts">
	import { onMount } from "svelte";
	import type { EnhancedParsedPage } from "$lib/notion/service";
	import Block from "./Block.svelte";
	import { Progress } from "$lib/components/ui/progress";

	export let page: EnhancedParsedPage;
	export let showMetadata = true;
	export let showProgress = true;
	export let enableTypography = true;

	let scrollProgress = 0;
	let currentSection = "";

	// Calculate reading progress
	function updateProgress() {
		if (!showProgress) return;

		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight - windowHeight;
		const scrollTop = window.scrollY;

		scrollProgress = Math.min(100, (scrollTop / documentHeight) * 100);

		// Update current section based on scroll position
		const headings = document.querySelectorAll("h1, h2, h3");
		let current = "";

		headings.forEach((heading) => {
			const rect = heading.getBoundingClientRect();
			if (rect.top <= 100) {
				current = heading.textContent || "";
			}
		});

		currentSection = current;
	}

	onMount(() => {
		window.addEventListener("scroll", updateProgress);
		updateProgress();

		return () => {
			window.removeEventListener("scroll", updateProgress);
		};
	});

	// Format date
	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	}
</script>

<article class="notion-page">
	{#if showProgress}
		<div class="bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm">
			<Progress value={scrollProgress} class="h-1" />
			{#if currentSection}
				<div class="text-muted-foreground px-4 py-2 text-sm">
					Reading: {currentSection}
				</div>
			{/if}
		</div>
	{/if}

	<header class="mb-20 {showProgress ? "pt-16" : ""}">
		<h1 class="mb-8 text-4xl font-extralight md:text-5xl">{page.title}</h1>

		{#if showMetadata}
			<div class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase">
				<p>{formatDate(page.metadata.lastEditedTime)}</p>
			</div>
		{/if}
	</header>

	<div
		class="prose prose-lg dark:prose-invert prose-headings:font-normal prose-p:font-light prose-strong:font-normal max-w-none"
	>
		{#each page.enhancedBlocks as block}
			<Block {block} {enableTypography} />
		{/each}
	</div>

	<footer class="border-foreground/10 mt-20 border-t pt-8">
		<div class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase">
			<p>Published {formatDate(page.metadata.createdTime)}</p>
			{#if page.metadata.lastEditedTime !== page.metadata.createdTime}
				<p class="mt-2">Updated {formatDate(page.metadata.lastEditedTime)}</p>
			{/if}
		</div>
	</footer>
</article>

<style>
	/* Custom prose adjustments */
	:global(.prose) {
		--tw-prose-body: hsl(var(--foreground));
		--tw-prose-headings: hsl(var(--foreground));
		--tw-prose-links: hsl(var(--primary));
		--tw-prose-bold: hsl(var(--foreground));
		--tw-prose-counters: hsl(var(--muted-foreground));
		--tw-prose-bullets: hsl(var(--muted-foreground));
		--tw-prose-hr: hsl(var(--border));
		--tw-prose-quotes: hsl(var(--foreground));
		--tw-prose-quote-borders: hsl(var(--primary));
		--tw-prose-code: hsl(var(--foreground));
		--tw-prose-pre-code: hsl(var(--foreground));
		--tw-prose-pre-bg: hsl(var(--muted));
	}

	/* Smooth transitions */
	.notion-page {
		animation: fadeIn 1s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
