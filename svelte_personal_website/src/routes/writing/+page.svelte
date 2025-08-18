<script lang="ts">
	import { fade } from "svelte/transition";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let writingPages = $derived(data.writingPages || []);
	let pageIdToSlug = $derived((data.pageIdToSlug || {}) as Record<string, string>);
	let error = $derived(data.error || null);

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	}

	function getSlug(pageId: string): string {
		return pageIdToSlug[pageId] || pageId;
	}
</script>

<svelte:head>
	<title>Writing - Brian Kelleher</title>
	<meta name="description" content="Essays and thoughts by Brian Kelleher" />
</svelte:head>

<div class="bg-background min-h-screen">
	<div class="container mx-auto max-w-4xl px-4">
		<!-- Compact header integrated with first essay -->
		<div class="pt-12 pb-8">
			<div class="mb-4 flex items-baseline justify-between" in:fade={{ duration: 800 }}>
				<h1 class="text-3xl font-extralight tracking-tight">Writing</h1>
				<p class="text-muted-foreground/40 text-xs font-light tracking-[0.2em] uppercase">
					{writingPages.length}
					{writingPages.length === 1 ? "Essay" : "Essays"}
				</p>
			</div>
			<div class="bg-foreground/10 h-px"></div>
		</div>

		<!-- Essays list -->
		<div class="pb-20">
			{#if error}
				<div class="py-20 text-center">
					<p class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase">
						Error loading content
					</p>
				</div>
			{:else if writingPages.length === 0}
				<div class="py-20 text-center">
					<p class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase">
						No writing yet
					</p>
				</div>
			{:else}
				<div class="space-y-0">
					{#each writingPages as page, i}
						<a
							href="/writing/{getSlug(page.id)}"
							class="group border-foreground/10 block border-b py-10 transition-all duration-500 first:pt-0 last:border-b-0"
							in:fade={{ duration: 600, delay: i * 100 }}
						>
							<!-- Title -->
							<h2
								class="group-hover:text-foreground/80 mb-4 text-2xl font-extralight transition-colors duration-500 md:text-3xl"
							>
								{page.title}
							</h2>

							<!-- Excerpt -->
							<p
								class="text-muted-foreground/80 mb-6 line-clamp-2 text-base leading-relaxed font-light"
							>
								{#if page.blocks.length > 0}
									{page.blocks[0]?.content.map((c) => c.text).join("")}
								{:else}
									...
								{/if}
							</p>

							<!-- Metadata -->
							<div class="text-sm">
								<p
									class="text-muted-foreground/60 font-light tracking-[0.2em] uppercase"
								>
									{formatDate(page.metadata.lastEditedTime)}
								</p>
							</div>

							<!-- Hover indicator -->
							<div
								class="bg-foreground/10 mt-6 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
							></div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
