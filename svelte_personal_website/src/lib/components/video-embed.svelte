<script lang="ts">
  import { extractYouTubeId, youTubeThumbnailUrl } from "$lib/utils/youtube";

  // Lightweight, privacy-friendly YouTube embed with click-to-play.
  // Svelte 5 runes: props + minimal local state.
  let {
    videoUrl,
    videoId,
    title = "Video",
    autoplay = true
  } = $props<{
    videoUrl?: string;
    videoId?: string;
    title?: string;
    autoplay?: boolean;
  }>();

  const id = $derived(extractYouTubeId(videoUrl, videoId));
  const thumb = $derived(youTubeThumbnailUrl(id) ?? "");
  let active = $state(false);

  function activate() {
    active = true;
  }
</script>

{#if id}
  <div class="group relative w-full">
    {#if !active}
      <!-- Poster / click-to-play -->
      <button
        type="button"
        class="block w-full overflow-hidden border border-foreground/10 focus:outline-none"
        aria-label={`Play video: ${title}`}
        onclick={activate}
      >
        <div class="relative w-full aspect-video">
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            class="h-full w-full object-cover"
            decoding="async"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-foreground/[0.12] to-transparent transition-opacity duration-[1000ms] opacity-80 group-hover:opacity-70"
          ></div>
          <!-- Minimal play affordance (text only, no icon) -->
          <div
            class="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span
              class="rounded-sm border border-foreground/20 bg-background/70 px-6 py-2 text-xs uppercase tracking-[0.2em] font-light text-foreground/80 transition-colors duration-500 group-hover:border-foreground/30 group-hover:text-foreground"
            >
              Play
            </span>
          </div>
        </div>
      </button>
    {:else}
      <!-- Real iframe only after click -->
      <div class="w-full overflow-hidden border border-foreground/10">
        <div class="w-full aspect-video">
          <iframe
            class="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    {/if}
  </div>
{:else}
  <!-- Fallback: render nothing if we cannot parse an ID. -->
  <div class="text-sm text-muted-foreground">Video unavailable.</div>
{/if}

<style>
  /* No extra styles; all Tailwind utility classes. */
  /* Component keeps a low-JS, minimal aesthetic, matching Talks page. */
  /* Slow transitions baked via long duration classes above. */
  :global(img) { color: transparent; }
  /* Avoid layout shift by always reserving aspect ratio. */
</style>
