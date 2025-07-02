<script lang="ts">
  import { toggleMode, mode } from 'mode-watcher';
  import { Sun, Moon } from 'phosphor-svelte';

  function setCookie(value: string) {
    document.cookie = `mode=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
  }

  $effect(() => {
    const current = mode.current;
    if (typeof document !== 'undefined' && current) {
      setCookie(current);
    }
  });

  function handleToggle() {
    document.documentElement.classList.add('color-transition');
    const newMode = mode.current === 'dark' ? 'light' : 'dark';
    toggleMode();
    setCookie(newMode);
    setTimeout(() => {
      document.documentElement.classList.remove('color-transition');
    }, 1000);
  }
</script>

<button
  class="group fixed bottom-4 left-4 z-50 w-9 h-9 rounded-full border border-foreground/20 hover:border-foreground/40 text-foreground/60 hover:text-foreground transition-all duration-500"
  aria-label="Toggle theme"
  onclick={handleToggle}
>
  <span class="sr-only">Toggle theme</span>
  <Sun class="absolute inset-0 m-auto size-4 transition-opacity duration-500 {mode.current === 'dark' ? 'opacity-0' : 'opacity-100'}" />
  <Moon class="absolute inset-0 m-auto size-4 transition-opacity duration-500 {mode.current === 'dark' ? 'opacity-100' : 'opacity-0'}" />
  <div class="absolute inset-0 bg-foreground/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full"></div>
</button>

