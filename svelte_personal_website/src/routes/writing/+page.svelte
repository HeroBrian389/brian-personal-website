<script lang="ts">
  import type { ParsedPage } from '$lib/notion/parser';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';
  
  export let data: PageData;
  let writingPages: ParsedPage[] = [];
  let pageIdToSlug: Record<string, string> = {};
  let error: string | null = null;

  $: writingPages = data.writingPages || [];
  $: pageIdToSlug = data.pageIdToSlug || {};
  $: error = data.error || null;
  
  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-4 max-w-4xl">
    <!-- Compact header integrated with first essay -->
    <div class="pt-12 pb-8">
      <div class="flex items-baseline justify-between mb-4" in:fade={{ duration: 800 }}>
        <h1 class="text-3xl font-extralight tracking-tight">Writing</h1>
        <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground/40 font-light">
          {writingPages.length} {writingPages.length === 1 ? 'Essay' : 'Essays'}
        </p>
      </div>
      <div class="h-px bg-foreground/10"></div>
    </div>
    
    <!-- Essays list -->
    <div class="pb-20">
      {#if error}
        <div class="text-center py-20">
          <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light">
            Error loading content
          </p>
        </div>
      {:else if writingPages.length === 0}
        <div class="text-center py-20">
          <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light">
            No writing yet
          </p>
        </div>
      {:else}
        <div class="space-y-0">
          {#each writingPages as page, i}
            <a 
              href="/writing/{getSlug(page.id)}" 
              class="group block py-10 border-b border-foreground/10 last:border-b-0 transition-all duration-500 first:pt-0"
              in:fade={{ duration: 600, delay: i * 100 }}
            >
              <!-- Title -->
              <h2 class="text-2xl md:text-3xl font-extralight mb-4 group-hover:text-foreground/80 transition-colors duration-500">
                {page.title}
              </h2>
              
              <!-- Excerpt -->
              <p class="text-base font-light text-muted-foreground/80 leading-relaxed mb-6 line-clamp-2">
                {#if page.blocks.length > 0}
                  {page.blocks[0].content.map(c => c.text).join('')}
                {:else}
                  ...
                {/if}
              </p>
              
              <!-- Metadata -->
              <div class="text-sm">
                <p class="uppercase tracking-[0.2em] text-muted-foreground/60 font-light">
                  {formatDate(page.metadata.lastEditedTime)}
                </p>
              </div>
              
              <!-- Hover indicator -->
              <div class="mt-6 h-px bg-foreground/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>