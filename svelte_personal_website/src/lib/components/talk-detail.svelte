<script lang="ts">
  import VideoEmbed from "$lib/components/video-embed.svelte";
  import type { Talk } from "$lib/data/talks";

  let { talk } = $props<{ talk: Talk }>();

  const formattedDate = $derived(
    new Date(talk.dateISO).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  );
</script>

<article class="group border-foreground/10 border-b py-10 first:pt-0 last:border-b-0">
  <div class="mb-3 flex items-start justify-between gap-4">
    <h1 class="text-3xl font-extralight transition-colors duration-500 group-hover:text-foreground/80 md:text-4xl">
      {talk.title}
    </h1>
  </div>

  {#if talk.description}
    <p class="text-muted-foreground/80 mb-6 text-base leading-relaxed font-light">
      {talk.description}
    </p>
  {/if}

  <div class="mb-4 flex flex-col gap-1 text-sm">
    <p class="text-muted-foreground/60 font-light tracking-[0.2em] uppercase">
      {formattedDate}{talk.location ? ` · ${talk.location}` : ""}
    </p>
    <p class="text-muted-foreground/80 font-light">
      {#if talk.eventUrl}
        <a
          href={talk.eventUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors duration-500 underline decoration-foreground/20 underline-offset-4 hover:text-foreground/80 hover:decoration-foreground/40"
        >
          {talk.event}
        </a>
      {:else}
        {talk.event}
      {/if}
    </p>
  </div>

  {#if talk.pdfPath || talk.slidesUrl}
    <div class="mt-8">
      <div class="border border-foreground/10 overflow-hidden">
        <div class="bg-foreground/5 flex h-12 items-center justify-between px-4">
          <p class="text-xs font-light uppercase tracking-[0.2em] text-muted-foreground/80">
            Presentation
          </p>
          <div class="flex items-center gap-4">
            {#if talk.slidesUrl}
              <a
                href={talk.slidesUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-light uppercase tracking-[0.2em] text-foreground/60 transition-colors duration-500 hover:text-foreground/80"
                >Open Slides →</a
              >
            {/if}
            {#if talk.pdfPath}
              <a
                href={talk.pdfPath}
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-light uppercase tracking-[0.2em] text-foreground/60 transition-colors duration-500 hover:text-foreground/80"
              >
                Open PDF →
              </a>
            {/if}
          </div>
        </div>

        {#if talk.pdfPath}
          <iframe
            src={`${talk.pdfPath}#toolbar=0&view=FitH`}
            title={`Slides: ${talk.title}`}
            loading="lazy"
            class="h-[70vh] w-full"
          ></iframe>
        {:else}
          <div class="bg-foreground/5 px-4 py-16 text-center text-xs font-light uppercase tracking-[0.2em] text-muted-foreground/70">
            Slides available via external link
          </div>
        {/if}

        <div class="bg-foreground/5 h-px"></div>
      </div>
    </div>
  {/if}

  {#if talk.videoUrl}
    <div class="mt-10">
      <div class="border border-foreground/10 overflow-hidden">
        <div class="bg-foreground/5 flex h-12 items-center justify-between px-4">
          <p class="text-xs font-light uppercase tracking-[0.2em] text-muted-foreground/80">
            Recording
          </p>
          <a
            href={talk.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-light uppercase tracking-[0.2em] text-foreground/60 transition-colors duration-500 hover:text-foreground/80"
          >
            Open on YouTube →
          </a>
        </div>
        <VideoEmbed videoUrl={talk.videoUrl} title={`Recording: ${talk.title}`} />
        <div class="bg-foreground/5 h-px"></div>
      </div>
    </div>
  {/if}

  {#if talk.keyPoints?.length}
    <div class="mt-10">
      <h2 class="text-lg font-extralight mb-4">Talk overview</h2>
      <ul class="space-y-2">
        {#each talk.keyPoints as point}
          <li class="text-base font-light leading-relaxed text-muted-foreground">{point}</li>
        {/each}
      </ul>
    </div>
  {/if}
</article>
