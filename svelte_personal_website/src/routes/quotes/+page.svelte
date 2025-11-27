<script lang="ts">
	import { onMount } from "svelte";
	import { tweened } from "svelte/motion";
	import { fade } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import type { Quote } from "$lib/notion/quotes-service";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let quotes = $state<Quote[]>(data.quotes || []);
	let currentQuote = $state<Quote | null>(null);
	let nextQuote = $state<Quote | null>(null);
	let isTransitioning = $state(false);
	let autoAdvanceInterval: ReturnType<typeof setInterval> | null = null;
	let currentOpacity = $state(1);
	let nextOpacity = $state(0);
	let suppressTransitions = $state(false);

	// Quote cycling state
	let shuffledQuotes = $state<Quote[]>([]);
	let currentQuoteIndex = $state(0);

	// Smooth animations with consistent timing
	const lineWidth = tweened(0, { duration: 800, easing: quintOut });

	// Shuffle quotes array
	function shuffleArray<T>(array: T[]): T[] {
		const shuffled: T[] = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = shuffled[i]!;
			shuffled[i] = shuffled[j]!;
			shuffled[j] = temp;
		}
		return shuffled;
	}

	// Get the next quote in the shuffled order
	function getNextQuoteInCycle(): Quote | null {
		if (shuffledQuotes.length === 0) return null;

		currentQuoteIndex = (currentQuoteIndex + 1) % shuffledQuotes.length;
		return shuffledQuotes[currentQuoteIndex] ?? null;
	}

	// Get a new quote following the cycle
	async function getNewQuote(_source: "manual" | "auto" = "auto", override?: Quote) {
		if (isTransitioning || quotes.length === 0) {
			return;
		}

		isTransitioning = true;

		// Reset auto-advance timer
		startAutoAdvance();

		// Determine next quote
		const newQuote = override ?? getNextQuoteInCycle();
		if (newQuote) {
			nextQuote = newQuote;
		}

		// Start fade out of current
		currentOpacity = 0;
		lineWidth.set(0);

		// Wait for fade out to complete
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Wait a moment with nothing on screen
		await new Promise((resolve) => setTimeout(resolve, 200));

		// Start fade in of next quote
		nextOpacity = 1;
		lineWidth.set(100);

		// Wait for fade in to complete
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Swap quotes (two-phase) with transition suppression to avoid a second crossfade
		suppressTransitions = true;
		currentQuote = nextQuote;
		currentOpacity = 1;
		nextOpacity = 0;
		nextQuote = null;
		queueMicrotask(() => {
			suppressTransitions = false;
		});

		isTransitioning = false;
	}

	// Start auto-advance
	function startAutoAdvance() {
		stopAutoAdvance();
		autoAdvanceInterval = setInterval(() => {
			getNewQuote("auto");
		}, 10000);
	}

	// Stop auto-advance
	function stopAutoAdvance() {
		if (autoAdvanceInterval) {
			clearInterval(autoAdvanceInterval);
			autoAdvanceInterval = null;
		}
	}

	// Initialize
	onMount(() => {
		if (quotes.length > 0) {
			// Shuffle quotes on page load
			shuffledQuotes = shuffleArray(quotes);
			currentQuoteIndex = 0;
			currentQuote = shuffledQuotes[0] ?? null;
			currentOpacity = 1;
			nextOpacity = 0;
			setTimeout(() => {
				lineWidth.set(100);
			}, 100);

			// Start auto-advance
			startAutoAdvance();
		}

		// Cleanup on unmount
		return () => {
			stopAutoAdvance();
		};
	});

	// Keyboard navigation
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === " " || e.key === "Enter") {
			e.preventDefault();
			getNewQuote("manual");
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<svelte:head>
	<title>Quotes - Brian Kelleher</title>
	<meta name="description" content="A curated collection of thoughts and wisdom" />
</svelte:head>

<div class="bg-background min-h-screen overflow-hidden">
	<div class="container mx-auto max-w-6xl px-4">
		<!-- Main quote display - full viewport height minus header -->
		<div class="relative flex h-[calc(100vh-5rem)] items-center justify-center">
			<div class="relative mx-auto w-full max-w-4xl px-8">
				<!-- Current quote -->
				{#if currentQuote}
					<div
						class="absolute inset-0 flex flex-col items-center justify-center"
						style="opacity: {currentOpacity}; transition: {suppressTransitions
							? 'none'
							: `opacity ${currentOpacity === 0 ? '1000ms' : '2000ms'} ease-in-out`}"
					>
						<!-- Quote text -->
						<div class="w-full">
							<p
								class="text-center text-xl leading-tight font-extralight tracking-tight md:text-2xl lg:text-3xl"
							>
								{currentQuote.text}
							</p>
						</div>

						<!-- Minimal separator line -->
						<div class="mt-12 mb-8 flex justify-center">
							<div class="bg-foreground/20 h-px" style="width: {$lineWidth}px"></div>
						</div>

						<!-- Author -->
						{#if currentQuote.author}
							<div class="text-center">
								<p
									class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase"
								>
									{currentQuote.author}
								</p>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Next quote (pre-loaded but invisible) -->
				{#if nextQuote}
					<div
						class="absolute inset-0 flex flex-col items-center justify-center"
						style="opacity: {nextOpacity}; transition: {suppressTransitions
							? 'none'
							: 'opacity 2000ms ease-in-out'}"
					>
						<!-- Quote text -->
						<div class="w-full">
							<p
								class="text-center text-xl leading-tight font-extralight tracking-tight md:text-2xl lg:text-3xl"
							>
								{nextQuote.text}
							</p>
						</div>

						<!-- Minimal separator line -->
						<div class="mt-12 mb-8 flex justify-center">
							<div
								class="bg-foreground/20 h-px"
								style="width: {nextOpacity > 0.5 ? 100 : 0}px"
							></div>
						</div>

						<!-- Author -->
						{#if nextQuote.author}
							<div class="text-center">
								<p
									class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase"
								>
									{nextQuote.author}
								</p>
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Minimal action button - positioned at bottom -->
			<div class="absolute bottom-16 left-1/2 -translate-x-1/2">
				<button
					onclick={() => getNewQuote("manual")}
					disabled={isTransitioning}
					class="group border-foreground/20 hover:border-foreground/40 disabled:hover:border-foreground/20 relative border px-8 py-3
                 text-sm font-light tracking-[0.2em]
                 uppercase transition-all duration-500 disabled:opacity-50"
				>
					<span class="relative z-10">Next</span>
					<div
						class="bg-foreground/5 absolute inset-0 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
					></div>
				</button>
			</div>
		</div>

		<!-- Minimal grid -->
		<div class="grid grid-cols-1 gap-8 py-20 md:grid-cols-2 lg:grid-cols-3">
			{#each quotes as quote, i}
				<button
					onclick={async () => {
						await getNewQuote("manual", quote);
					}}
					class="group hover:border-foreground/10 relative overflow-hidden border border-transparent
                 p-8 text-left transition-all duration-500"
					in:fade={{ duration: 400, delay: Math.min(i * 50, 200) }}
				>
					<!-- Hover background -->
					<div
						class="from-foreground/[0.02] absolute inset-0 bg-gradient-to-br to-transparent
                      opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>

					<!-- Content -->
					<div class="relative">
						<p
							class="text-foreground/70 group-hover:text-foreground/90 mb-4 text-sm leading-relaxed transition-colors duration-300"
						>
							{quote.text}
						</p>
						{#if quote.author}
							<p
								class="text-muted-foreground/60 group-hover:text-muted-foreground text-xs tracking-wider uppercase transition-colors duration-300"
							>
								{quote.author}
							</p>
						{/if}
					</div>

					<!-- Subtle indicator -->
					<div
						class="bg-foreground/10 absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
					></div>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Minimal focus styles */
	button:focus-visible {
		outline: 1px solid hsl(var(--foreground) / 0.2);
		outline-offset: 4px;
	}

	/* Smooth all transitions */
	* {
		transition-property: opacity, transform;
		transition-duration: 300ms;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
