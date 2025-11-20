<script lang="ts">
	import { fade } from "svelte/transition";
	import { talks as talksData } from "$lib/data/talks";
	import TalkSummary from "$lib/components/talk-summary.svelte";

	let talks = $derived([...talksData].sort((a, b) => b.dateISO.localeCompare(a.dateISO)));
</script>

<svelte:head>
	<title>Talks - Brian Kelleher</title>
	<meta name="description" content="Talks and presentations by Brian Kelleher" />
	<link rel="canonical" href="/talks" />
</svelte:head>

<div class="bg-background min-h-screen">
	<div class="container mx-auto max-w-4xl px-4">
		<!-- Header -->
		<div class="pt-12 pb-8">
			<div class="mb-4 flex items-baseline justify-between" in:fade={{ duration: 800 }}>
				<h1 class="text-3xl font-extralight tracking-tight">Talks</h1>
				<p class="text-muted-foreground/40 text-xs font-light tracking-[0.2em] uppercase">
					{talks.length}
					{talks.length === 1 ? "Talk" : "Talks"}
				</p>
			</div>
			<div class="bg-foreground/10 h-px"></div>
		</div>

		<!-- Talks list -->
		<div class="pb-20">
			{#if talks.length === 0}
				<div class="py-20 text-center">
					<p class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase">
						No talks yet
					</p>
				</div>
			{:else}
				<div class="space-y-0">
					{#each talks as t, i}
						<div in:fade={{ duration: 600, delay: i * 100 }}>
							<TalkSummary talk={t} />
							{#if i < talks.length - 1}
								<div class="bg-foreground/10 my-10 h-px w-full"></div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
