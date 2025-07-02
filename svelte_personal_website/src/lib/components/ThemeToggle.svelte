<script lang="ts">
  import { mode, toggleMode } from 'mode-watcher';
  import { Sun, Moon } from 'phosphor-svelte';
  import { fade } from 'svelte/transition';

  let currentMode = $derived(mode.current);
</script>

<div class="fixed bottom-8 left-8 z-50">
  <button
    class="group relative p-3 bg-background border border-foreground/10 hover:border-foreground/30 transition-all duration-500 rounded-full"
    onclick={toggleMode}
    aria-label="Toggle light or dark mode"
  >
    <span class="relative z-10 block w-4 h-4 flex items-center justify-center">
      {#if currentMode === 'dark'}
        <Sun class="w-4 h-4" />
      {:else}
        <Moon class="w-4 h-4" />
      {/if}
    </span>
    <div class="absolute inset-0 bg-foreground/5 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
  </button>
</div>
