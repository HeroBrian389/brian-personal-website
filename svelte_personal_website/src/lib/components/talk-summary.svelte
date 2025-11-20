<script lang="ts">
	import type { Talk } from "$lib/data/talks";
	import { extractYouTubeId, youTubeThumbnailUrl } from "$lib/utils/youtube";

	let { talk } = $props<{ talk: Talk }>();

	const formattedDate = $derived(
		new Date(talk.dateISO).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric"
		})
	);

	function getExcerpt(description?: string): string | null {
		if (!description) return null;
		const trimmed = description.trim();
		if (trimmed.length <= 220) return trimmed;
		return `${trimmed.slice(0, 217)}…`;
	}

	const excerpt = $derived(getExcerpt(talk.description));
	const videoId = $derived(extractYouTubeId(talk.videoUrl));
	const videoThumbnail = $derived(youTubeThumbnailUrl(videoId));
</script>

<article class="group py-8 transition-all duration-700 first:pt-0">
	{#if videoThumbnail}
		<a
			href={`/talks/${talk.slug}`}
			class="border-foreground/10 hover:border-foreground/30 block overflow-hidden border transition-all duration-[1000ms] focus-visible:outline-none"
		>
			<div class="relative w-full overflow-hidden">
				<div class="aspect-video w-full">
					<img
						src={videoThumbnail}
						alt={`Thumbnail for ${talk.title}`}
						loading="lazy"
						decoding="async"
						class="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.02]"
					/>
				</div>
				<div
					class="from-background/40 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60 transition-opacity duration-[1000ms] group-hover:opacity-50"
				></div>
				<span
					class="border-foreground/20 bg-background/80 text-foreground/80 absolute bottom-4 left-4 rounded-sm border px-4 py-1 text-[10px] font-light tracking-[0.2em] uppercase"
				>
					Watch
				</span>
			</div>
		</a>
	{/if}

	<div
		class="mb-4 flex items-baseline justify-between gap-4"
		class:mt-6={Boolean(videoThumbnail)}
	>
		<a
			href={`/talks/${talk.slug}`}
			class="hover:text-foreground/80 transition-colors duration-500 focus-visible:outline-none"
		>
			<h2 class="text-2xl font-extralight md:text-3xl">
				{talk.title}
			</h2>
		</a>
		<a
			href={`/talks/${talk.slug}`}
			class="text-muted-foreground/70 hover:text-foreground/60 text-xs font-light tracking-[0.2em] uppercase transition-colors duration-500"
		>
			View Talk →
		</a>
	</div>

	<p class="text-muted-foreground/60 text-xs font-light tracking-[0.2em] uppercase">
		{formattedDate}{talk.location ? ` · ${talk.location}` : ""}
	</p>

	<p class="text-muted-foreground/80 mt-2 text-sm font-light">
		{#if talk.eventUrl}
			<a
				href={talk.eventUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="decoration-foreground/10 hover:text-foreground/80 hover:decoration-foreground/30 underline underline-offset-4 transition-colors duration-500"
			>
				{talk.event}
			</a>
		{:else}
			{talk.event}
		{/if}
	</p>

	{#if excerpt}
		<p class="text-muted-foreground/80 mt-6 text-base leading-relaxed font-light">
			{excerpt}
		</p>
	{/if}
</article>
