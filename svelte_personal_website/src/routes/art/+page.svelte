<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	// Art collection data
	const artCollection = [
		{
			id: "hiroshi-4",
			artist: "Hiroshi Nagai",
			title: "Plane Over Paradise",
			description: "Aircraft soaring above tropical landscape",
			imageUrl: "/hiroshi-plane.avif",
			year: "1980s",
			style: "City Pop",
			colors: ["#87CEEB", "#FF69B4", "#20B2AA", "#FFE4B5"]
		},
		{
			id: "banksy-1",
			artist: "Banksy",
			title: "Rage, the Flower Thrower",
			description: "A protestor throws a bouquet of flowers.",
			imageUrl: "/banksy-flower-thrower.jpeg",
			year: "2003",
			style: "Street Art",
			colors: ["#000000", "#FFFFFF", "#FF0000", "#00FF00"]
		},
		{
			id: "banksy-2",
			artist: "Banksy",
			title: "Girl with Balloon",
			description: "A young girl with her hand extended toward a red heart-shaped balloon.",
			imageUrl: "/banksy-girl-with-balloon.jpg",
			year: "2002",
			style: "Street Art",
			colors: ["#000000", "#FFFFFF", "#FF0000"]
		}
		// Add more artworks as needed
	];

	onMount(() => {
		// Initialize any animations or lazy loading
	});
</script>

<svelte:head>
	<title>Art - Brian Kelleher</title>
	<meta name="description" content="A curated collection of visual art" />
</svelte:head>

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
		<div class="grid grid-cols-1 gap-8 pb-20 md:grid-cols-2 lg:grid-cols-3">
			{#each artCollection as art, i (art.id)}
				<button
					class="group w-full cursor-pointer text-left"
					in:fade={{ duration: 600, delay: i * 100 }}
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
	</div>
</div>

<style>
	/* Ensure images maintain aspect ratio */
	img {
		aspect-ratio: 4/3;
		object-fit: cover;
	}
</style>
