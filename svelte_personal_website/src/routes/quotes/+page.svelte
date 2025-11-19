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

	// --- Debug helpers for investigating double fade ---
	function infoFor(el: Element | null) {
		if (!el) return null;
		const cs = getComputedStyle(el);
		return {
			opacity: cs.opacity,
			transitionProperty: cs.transitionProperty,
			transitionDuration: cs.transitionDuration,
			transitionTimingFunction: cs.transitionTimingFunction,
			styleAttr: (el as HTMLElement).getAttribute("style") || null
		};
	}

	function logTransitionStart(label: string, e: TransitionEvent) {
		if (e.propertyName !== "opacity" || e.target !== e.currentTarget) return;
		try {
			const target = e.target as Element;
			const opacity = getComputedStyle(target).opacity;
			console.log(`[QUOTES] ${label} opacity transitionstart`, {
				when: new Date().toISOString(),
				computedOpacity: opacity
			});
		} catch (err) {
			console.log(`[QUOTES] ${label} opacity transitionstart`, new Date().toISOString());
		}
	}

	function logTransitionEnd(label: string, e: TransitionEvent) {
		if (e.propertyName !== "opacity" || e.target !== e.currentTarget) return;
		try {
			const target = e.target as Element;
			const opacity = getComputedStyle(target).opacity;
			console.log(`[QUOTES] ${label} opacity transitionend`, {
				when: new Date().toISOString(),
				computedOpacity: opacity
			});
		} catch (err) {
			console.log(`[QUOTES] ${label} opacity transitionend`, new Date().toISOString());
		}
	}

	let currentContainer = $state<HTMLDivElement | null>(null);
	let nextContainer = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (currentContainer) {
			console.log("[QUOTES] currentContainer mounted");
		} else {
			console.log("[QUOTES] currentContainer unmounted");
		}
	});

	$effect(() => {
		if (nextContainer) {
			console.log("[QUOTES] nextContainer mounted");
		} else {
			console.log("[QUOTES] nextContainer unmounted");
		}
	});

	let unsubscribeLineWidth: (() => void) | null = null;
	unsubscribeLineWidth = lineWidth.subscribe((v) => {
		console.log("[QUOTES] lineWidth tween value", v);
	});

	let prevNextOpacity = $state(0);
	$effect(() => {
		if (prevNextOpacity <= 0.5 && nextOpacity > 0.5) {
			console.log(
				"[QUOTES] nextOpacity crossed 0.5 → showing next separator",
				new Date().toISOString()
			);
		}
		prevNextOpacity = nextOpacity;
	});

	$effect(() => {
		console.log("[QUOTES] currentOpacity", currentOpacity);
	});

	$effect(() => {
		console.log("[QUOTES] nextOpacity", nextOpacity);
	});

	$effect(() => {
		console.log("[QUOTES] currentQuote changed", currentQuote ? currentQuote.id : null);
	});

	$effect(() => {
		console.log("[QUOTES] nextQuote changed", nextQuote ? nextQuote.id : null);
	});

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

	let transitionSeq = 0;

	// Get a new quote following the cycle
	async function getNewQuote(source: "manual" | "auto" = "auto", override?: Quote) {
		const seq = ++transitionSeq;
		const start = performance.now();
		console.log(`[QUOTES][${seq}] getNewQuote(${source}) at`, new Date().toISOString());
		if (isTransitioning || quotes.length === 0) {
			console.log(
				`[QUOTES][${seq}] Skipping - isTransitioning:`,
				isTransitioning,
				"quotes.length:",
				quotes.length
			);
			return;
		}

		isTransitioning = true;
		console.log(`[QUOTES][${seq}] Starting transition`);

		// Reset auto-advance timer
		startAutoAdvance();

		// Determine next quote
		const newQuote = override ?? getNextQuoteInCycle();
		if (newQuote) {
			console.log(`[QUOTES][${seq}] Loading new quote:`, newQuote.id);
			nextQuote = newQuote;
		}

		console.log(`[QUOTES][${seq}] Phase A: fade OUT current start`, {
			currentInfo: infoFor(currentContainer)
		});

		// Start fade out of current
		currentOpacity = 0;
		console.log(`[QUOTES][${seq}] lineWidth.set(0)`);
		lineWidth.set(0);

		// Wait for fade out to complete
		console.log(`[QUOTES][${seq}] Waiting 1000ms for fade out...`);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log(
			`[QUOTES][${seq}] Phase A: fade OUT current end @ ${Math.round(performance.now() - start)}ms`,
			{ currentInfo: infoFor(currentContainer) }
		);

		// Wait a moment with nothing on screen
		console.log(`[QUOTES][${seq}] Waiting 200ms with empty screen...`);
		await new Promise((resolve) => setTimeout(resolve, 200));
		console.log(
			`[QUOTES][${seq}] Empty screen period complete @ ${Math.round(performance.now() - start)}ms`
		);

		// Start fade in of next quote
		console.log(`[QUOTES][${seq}] Phase B: fade IN next start at`, new Date().toISOString());
		nextOpacity = 1;
		console.log(`[QUOTES][${seq}] lineWidth.set(100)`);
		lineWidth.set(100);

		// Wait for fade in to complete
		console.log(`[QUOTES][${seq}] Waiting 2000ms for fade in...`);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		console.log(
			`[QUOTES][${seq}] Phase B: fade IN next end @ ${Math.round(performance.now() - start)}ms`
		);

		// Pre-swap diagnostics
		console.log(`[QUOTES][${seq}] Pre-swap diagnostics`, {
			currentQuoteId: currentQuote?.id ?? null,
			nextQuoteId: nextQuote?.id ?? null,
			currentInfo: infoFor(currentContainer),
			nextInfo: infoFor(nextContainer),
			isNextAfterCurrent:
				currentContainer && nextContainer
					? Boolean(
							currentContainer.compareDocumentPosition(nextContainer) &
								Node.DOCUMENT_POSITION_FOLLOWING
						)
					: null
		});

		// Swap quotes (two-phase) with transition suppression to avoid a second crossfade
		suppressTransitions = true;
		console.log(`[QUOTES][${seq}] Suppressing transitions for swap`);
		currentQuote = nextQuote;
		currentOpacity = 1;
		nextOpacity = 0;
		nextQuote = null;
		console.log(
			`[QUOTES][${seq}] Swap applied (set current=next, currentOpacity=1, nextOpacity=0, cleared nextQuote)`
		);
		queueMicrotask(() => {
			suppressTransitions = false;
			console.log(`[QUOTES][${seq}] Re-enabled transitions after swap`);
			console.log(`[QUOTES][${seq}] Post-swap microtask diagnostics`, {
				currentInfo: infoFor(currentContainer),
				nextInfo: infoFor(nextContainer),
				bothContainersExist: Boolean(currentContainer && nextContainer)
			});
		});

		isTransitioning = false;
		console.log(
			`[QUOTES][${seq}] Transition complete @ ${Math.round(performance.now() - start)}ms`
		);
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
				console.log(
					"[QUOTES] onMount → expanding lineWidth to 100",
					new Date().toISOString()
				);
				lineWidth.set(100);
			}, 100);

			// Start auto-advance
			startAutoAdvance();
		}

		// Cleanup on unmount
		return () => {
			stopAutoAdvance();
			if (unsubscribeLineWidth) unsubscribeLineWidth();
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
						bind:this={currentContainer}
						class="absolute inset-0 flex flex-col items-center justify-center"
						style="opacity: {currentOpacity}; transition: {suppressTransitions
							? 'none'
							: `opacity ${currentOpacity === 0 ? '1000ms' : '2000ms'} ease-in-out`}"
						ontransitionstart={(e) => logTransitionStart("currentContainer", e)}
						ontransitionend={(e) => logTransitionEnd("currentContainer", e)}
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
						bind:this={nextContainer}
						class="absolute inset-0 flex flex-col items-center justify-center"
						style="opacity: {nextOpacity}; transition: {suppressTransitions
							? 'none'
							: 'opacity 2000ms ease-in-out'}"
						ontransitionstart={(e) => logTransitionStart("nextContainer", e)}
						ontransitionend={(e) => logTransitionEnd("nextContainer", e)}
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
