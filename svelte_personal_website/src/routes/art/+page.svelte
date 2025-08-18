<script lang="ts">
	import { onMount } from "svelte";
	import { fade, fly, scale } from "svelte/transition";

	// Reactive state
	let selectedArt = $state<typeof artCollection[0] | null>(null);
	let isExpanded = $state(false);

	// Art collection data
	const artCollection = [
		{
			id: "hiroshi-4",
			artist: "Hiroshi Nagai",
			title: "Plane Over Paradise",
			description: "In this suspended moment between earth and sky, we witness the peculiar dance of modernity against eternity. The aircraft — that silver promise of elsewhere — traces its path above waters that have known no time. Here is the eternal summer of memory, where palm trees lean into winds that never came, where horizons dissolve into pastels of impossible afternoons. Nagai gives us not a place but a feeling: the ache of paradise always glimpsed, never inhabited, forever departing on the next flight out.",
			imageUrl: "/hiroshi-plane.avif",
			year: "1980s",
			style: "City Pop"
		},
		{
			id: "banksy-1",
			artist: "Banksy",
			title: "Rage, the Flower Thrower",
			description: "What terrible beauty in this gesture — the body coiled in violence, the arm drawn back with revolutionary fervor, yet releasing only petals into the indifferent air. Here stands every protestor who ever was: masked against identification, anonymous in their fury, yet betraying in this substitution the deepest human truth. That even in our rage, perhaps especially in our rage, we cannot escape the desire to create rather than destroy. The flowers arc through space like hope itself — fragile, temporary, but thrown with all the force we reserve for stones.",
			imageUrl: "/banksy-flower-thrower.jpeg",
			year: "2003",
			style: "Street Art"
		},
		{
			id: "banksy-2",
			artist: "Banksy",
			title: "Girl with Balloon",
			description: "To reach is to lose — this is the child's first lesson and the adult's last meditation. The balloon, heart-shaped and ascending, carries with it every love we almost held, every dream that slipped through fingers too young to know the weight of letting go. The girl's silhouette speaks to our universal childhood, that moment before we learned that some things drift away not from cruelty but from the simple physics of being lighter than air. In her extended hand lives both the reaching and the release, the having and the mourning, all suspended in the breath before acceptance.",
			imageUrl: "/banksy-girl-with-balloon.jpg",
			year: "2002",
			style: "Street Art"
		}
		// Add more artworks as needed
	];

	// Handle artwork selection
	function selectArt(art: typeof artCollection[0]) {
		selectedArt = art;
		isExpanded = true;
	}

	function closeExpanded() {
		isExpanded = false;
		// Delay clearing selection for smoother transition
		setTimeout(() => {
			selectedArt = null;
		}, 300);
	}

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (!isExpanded) return;

		if (event.key === "Escape") {
			closeExpanded();
		} else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			event.preventDefault();
			const currentIndex = artCollection.findIndex(art => art.id === selectedArt?.id);
			let newIndex = currentIndex;

			if (event.key === "ArrowUp" && currentIndex > 0) {
				newIndex = currentIndex - 1;
			} else if (event.key === "ArrowDown" && currentIndex < artCollection.length - 1) {
				newIndex = currentIndex + 1;
			}

			if (newIndex !== currentIndex) {
				selectedArt = artCollection[newIndex] ?? null;
			}
		}
	}

	onMount(() => {
		// Initialize any animations or lazy loading
	});
</script>

<svelte:head>
	<title>Art - Brian Kelleher</title>
	<meta name="description" content="A curated collection of visual art" />
</svelte:head>

<svelte:window on:keydown={handleKeydown} />

<div class="bg-background min-h-screen">
	<div class="container mx-auto max-w-6xl px-4">
		<!-- Compact header -->
		<div class="pt-12 pb-16">
			<div class="mb-4 flex items-baseline justify-between" in:fade={{ duration: 800 }}>
				<h1 class="text-3xl font-extralight tracking-tight">Art</h1>
				<p class="text-muted-foreground/40 text-xs font-light tracking-[0.2em] uppercase">
					{artCollection.length}
					{artCollection.length === 1 ? "Piece" : "Pieces"}
				</p>
			</div>
			<div class="bg-foreground/10 h-px"></div>
		</div>

		<!-- Art grid - minimalist layout -->
		{#if !isExpanded}
			<div class="grid grid-cols-1 gap-8 pb-20 md:grid-cols-2 lg:grid-cols-3"
				in:fade={{ duration: 500 }}>
				{#each artCollection as art, i (art.id)}
					<button
						class="group w-full cursor-pointer text-left"
						in:fade={{ duration: 600, delay: i * 100 }}
						onclick={() => selectArt(art)}
						aria-label="View {art.title}"
					>
						<div class="bg-foreground/5 relative overflow-hidden">
							<img
								src={art.imageUrl}
								alt={art.title}
								class="h-auto w-full object-cover transition-transform duration-1000 group-hover:scale-105"
								loading="lazy"
							/>

							<!-- Subtle overlay on hover -->
							<div
								class="bg-background/80 absolute inset-0 flex items-end p-6 opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
							>
								<div>
									<h3 class="mb-2 text-lg font-light">{art.title}</h3>
									<p
										class="text-muted-foreground/60 text-sm font-light tracking-[0.2em] uppercase"
									>
										{art.artist} · {art.year}
									</p>
								</div>
							</div>
						</div>

						<!-- Minimal caption below image -->
						<div class="mt-4">
							<p class="text-foreground/80 text-sm font-light">{art.title}</p>
							<p
								class="text-muted-foreground/40 mt-1 text-xs font-light tracking-[0.2em] uppercase"
							>
								{art.artist}
							</p>
						</div>
					</button>
				{/each}
			</div>
		{/if}

		<!-- Expanded view - YouTube-style layout -->
		{#if isExpanded && selectedArt}
			<div class="fixed inset-0 z-50 bg-background" 
				in:fade={{ duration: 300 }}
				out:fade={{ duration: 300 }}>
				<div class="h-full flex">
					<!-- Main image area (left side) -->
					<div class="flex-1 flex flex-col min-h-0">
						<!-- Header with close button -->
						<div class="flex justify-between items-center p-4 flex-shrink-0">
							<div in:fly={{ y: -20, duration: 500, delay: 200 }}>
								<h2 class="text-2xl font-extralight">{selectedArt.title}</h2>
								<p class="text-muted-foreground/60 text-sm font-light tracking-[0.2em] uppercase mt-1">
									{selectedArt.artist} · {selectedArt.year}
								</p>
							</div>
							<button
								onclick={closeExpanded}
								class="p-2 hover:bg-foreground/10 rounded-full transition-colors duration-300"
								aria-label="Close expanded view"
								in:scale={{ duration: 500, delay: 300 }}
							>
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<!-- Scrollable content area -->
						<div class="flex-1 overflow-y-auto min-h-0">
							<!-- Large image -->
							<div class="flex items-center justify-center p-8 min-h-[400px]"
								in:scale={{ duration: 500, start: 0.8, opacity: 0 }}>
								<img
									src={selectedArt.imageUrl}
									alt={selectedArt.title}
									class="max-w-full h-auto object-contain shadow-2xl"
									style="max-height: 70vh;"
								/>
							</div>

							<!-- Description -->
							<div class="p-8 max-w-4xl mx-auto" in:fly={{ y: 20, duration: 500, delay: 400 }}>
								<p class="text-foreground/70 font-light leading-relaxed text-lg">{selectedArt.description}</p>
							</div>
						</div>
					</div>

					<!-- Thumbnails sidebar (right side) -->
					<div class="w-80 bg-foreground/5 overflow-y-auto border-l border-foreground/10">
						<div class="p-4">
							<p class="text-xs font-light tracking-[0.2em] uppercase text-muted-foreground/60 mb-4">
								Collection · {artCollection.length} pieces
							</p>
							<div class="space-y-3">
								{#each artCollection as art, i (art.id)}
									<button
										onclick={() => selectedArt = art}
										class="w-full group transition-all duration-300 {art.id === selectedArt.id ? 'ring-2 ring-foreground/30' : ''}"
										in:fly={{ x: 50, duration: 500, delay: 100 + i * 50 }}
									>
										<div class="flex gap-3 p-2 hover:bg-foreground/10 rounded">
											<img
												src={art.imageUrl}
												alt={art.title}
												class="w-20 h-20 object-cover rounded {art.id === selectedArt.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} transition-opacity duration-300"
											/>
											<div class="flex-1 text-left">
												<p class="text-sm font-light text-foreground/80">{art.title}</p>
												<p class="text-xs font-light tracking-[0.1em] uppercase text-muted-foreground/60 mt-1">
													{art.artist}
												</p>
												<p class="text-xs text-muted-foreground/40 mt-2">
													{art.year} · {art.style}
												</p>
											</div>
										</div>
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Ensure images maintain aspect ratio */
	img {
		aspect-ratio: 4/3;
		object-fit: cover;
	}
</style>
