<script lang="ts">
  import { fade } from "svelte/transition";
  import { talks as talksData } from "$lib/data/talks";

  let talks = $derived(
    [...talksData].sort((a, b) => b.dateISO.localeCompare(a.dateISO))
  );

  function formatDate(dateISO: string): string {
    return new Date(dateISO).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
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
          {talks.length} {talks.length === 1 ? "Talk" : "Talks"}
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
            <article
              class="group border-foreground/10 border-b py-10 transition-all duration-700 first:pt-0 last:border-b-0"
              in:fade={{ duration: 600, delay: i * 100 }}
            >
              <div class="mb-3 flex items-start justify-between gap-4">
                <h2 class="text-2xl font-extralight group-hover:text-foreground/80 transition-colors duration-500 md:text-3xl">
                  {t.title}
                </h2>
              </div>

              {#if t.description}
                <p class="text-muted-foreground/80 mb-6 text-base leading-relaxed font-light">
                  {t.description}
                </p>
              {/if}

              <div class="mb-4 flex flex-col gap-1 text-sm">
                <p class="text-muted-foreground/60 font-light tracking-[0.2em] uppercase">
                  {formatDate(t.dateISO)}{t.location ? ` · ${t.location}` : ""}
                </p>
                <p class="text-muted-foreground/80 font-light">
                  {#if t.eventUrl}
                    <a
                      href={t.eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="hover:text-foreground/80 transition-colors duration-500 underline decoration-foreground/20 hover:decoration-foreground/40 underline-offset-4"
                    >
                      {t.event}
                    </a>
                  {:else}
                    {t.event}
                  {/if}
                </p>
              </div>

              <!-- Embedded deck -->
              {#if t.pdfPath}
                <div class="mt-8">
                  <div class="border border-foreground/10 overflow-hidden">
                    <div class="bg-foreground/5 h-12 flex items-center justify-between px-4">
                      <p class="text-xs font-light tracking-[0.2em] uppercase text-muted-foreground/80">
                        Presentation
                      </p>
                      <div class="flex items-center gap-4">
                        {#if t.slidesUrl}
                          <a
                            href={t.slidesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-xs font-light tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground/80 transition-colors duration-500"
                            >Open on Pitch →</a
                          >
                        {/if}
                        <a
                          href={t.pdfPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-xs font-light tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground/80 transition-colors duration-500"
                          >Open PDF →</a
                        >
                      </div>
                    </div>
                    <iframe
                      src={`${t.pdfPath}#toolbar=0&view=FitH`}
                      title={`Slides: ${t.title}`}
                      loading="lazy"
                      class="w-full h-[70vh]"
                    ></iframe>
                    <div class="bg-foreground/5 h-px"></div>
                  </div>
                </div>
              {/if}

              <!-- Details -->
              {#if t.keyPoints?.length}
                <div class="mt-10">
                  <h3 class="text-lg font-extralight mb-4">Talk overview</h3>
                  <ul class="space-y-2">
                    {#each t.keyPoints as point}
                      <li class="text-base font-light text-muted-foreground leading-relaxed">{point}</li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </article>
          {/each}
        </div>
      {/if}
    </div>
  </div>
  
</div>
