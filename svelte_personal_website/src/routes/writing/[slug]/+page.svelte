<script lang="ts">
  import type { EnhancedParsedPage } from '$lib/notion/service';
  import PageRenderer from '$lib/components/notion/PageRenderer.svelte';
  import { Button } from '$lib/components/ui/button';
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  $: writingPage = data.writingPage;
  $: error = data.error;
</script>

<svelte:head>
  {#if writingPage}
    <title>{writingPage.title} - Brian Kelleher</title>
    <meta name="description" content="{writingPage.title} by Brian Kelleher" />
    <meta property="og:title" content="{writingPage.title} - Brian Kelleher" />
    <meta property="og:description" content="{writingPage.title} by Brian Kelleher" />
    <meta property="og:type" content="article" />
    <meta property="article:author" content="Brian Kelleher" />
    <meta property="article:published_time" content={new Date(writingPage.metadata.createdTime).toISOString()} />
    <meta property="article:modified_time" content={new Date(writingPage.metadata.lastEditedTime).toISOString()} />
  {:else}
    <title>Writing - Brian Kelleher</title>
  {/if}
</svelte:head>

<div class="container mx-auto px-8 py-20 max-w-4xl">
  <nav class="mb-20">
    <a 
      href="/writing" 
      class="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light hover:text-foreground transition-colors duration-300"
    >
      ← Writing
    </a>
  </nav>
  
  {#if error}
    <div class="py-8 border-b border-foreground/10">
      <h2 class="text-2xl font-extralight mb-4">Error</h2>
      <p class="text-muted-foreground font-light mb-8">{error}</p>
      <a 
        href="/writing" 
        class="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light hover:text-foreground transition-colors duration-300"
      >
        Return to Writing
      </a>
    </div>
  {:else if writingPage}
    <PageRenderer page={writingPage} />
  {/if}
</div>