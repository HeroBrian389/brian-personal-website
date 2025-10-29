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
      class="block overflow-hidden border border-foreground/10 transition-all duration-[1000ms] hover:border-foreground/30 focus-visible:outline-none"
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
        <div class="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent transition-opacity duration-[1000ms] opacity-60 group-hover:opacity-50"></div>
        <span
          class="absolute bottom-4 left-4 rounded-sm border border-foreground/20 bg-background/80 px-4 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-foreground/80"
        >
          Watch
        </span>
      </div>
    </a>
  {/if}

  <div class="mb-4 flex items-baseline justify-between gap-4" class:mt-6={Boolean(videoThumbnail)}>
    <a
      href={`/talks/${talk.slug}`}
      class="transition-colors duration-500 hover:text-foreground/80 focus-visible:outline-none"
    >
      <h2 class="text-2xl font-extralight md:text-3xl">
        {talk.title}
      </h2>
    </a>
    <a
      href={`/talks/${talk.slug}`}
      class="text-xs font-light uppercase tracking-[0.2em] text-muted-foreground/70 transition-colors duration-500 hover:text-foreground/60"
    >
      View Talk →
    </a>
  </div>

  <p class="text-xs font-light uppercase tracking-[0.2em] text-muted-foreground/60">
    {formattedDate}{talk.location ? ` · ${talk.location}` : ""}
  </p>

  <p class="mt-2 text-sm font-light text-muted-foreground/80">
    {#if talk.eventUrl}
      <a
        href={talk.eventUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="underline decoration-foreground/10 underline-offset-4 transition-colors duration-500 hover:text-foreground/80 hover:decoration-foreground/30"
      >
        {talk.event}
      </a>
    {:else}
      {talk.event}
    {/if}
  </p>

  {#if excerpt}
    <p class="mt-6 text-base font-light leading-relaxed text-muted-foreground/80">
      {excerpt}
    </p>
  {/if}
</article>
