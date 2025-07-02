<script lang="ts">
  import { page } from '$app/stores';
  import { fade } from 'svelte/transition';
</script>

<div class="h-[calc(100vh-5rem)] flex items-center justify-center text-center">
  <div class="max-w-2xl mx-auto px-8">
    <div in:fade={{ duration: 2000, delay: 300 }}>
      <h1 class="text-9xl font-extralight text-foreground/10 mb-8">
        {$page.status}
      </h1>
      
      {#if $page.status === 404}
        <h2 class="text-2xl font-light mb-4">This page seems to be missing.</h2>
        <p class="text-lg font-light text-muted-foreground">
          Not to worry. Feel free to rest here a moment. Time moves differently in this space.
        </p>
      {:else}
        <h2 class="text-2xl font-light mb-4">There was a flicker in the connection.</h2>
        <p class="text-lg font-light text-muted-foreground">
          These things happen. Take a slow breath while we sort it out. The issue has been noted.
        </p>
      {/if}

      <div class="mt-12">
        <a href="/" 
           class="text-sm uppercase tracking-[0.2em] font-light text-foreground/60 hover:text-foreground transition-colors duration-500">
          Return to the path
        </a>
      </div>
    </div>
  </div>
</div>
