<script lang="ts">
  import type { ParsedRichText } from '$lib/notion/parser';
  
  export let content: ParsedRichText;
</script>

{#if content.href}
  <a 
    href={content.href} 
    class="underline decoration-primary/30 hover:decoration-primary transition-colors"
    target={content.href.startsWith('http') ? '_blank' : undefined}
    rel={content.href.startsWith('http') ? 'noopener noreferrer' : undefined}
  >
    <span
      class:font-bold={content.annotations.bold}
      class:italic={content.annotations.italic}
      class:line-through={content.annotations.strikethrough}
      class:underline={content.annotations.underline}
      class:font-mono={content.annotations.code}
      class:text-sm={content.annotations.code}
      class:bg-muted={content.annotations.code}
      class:px-1={content.annotations.code}
      class:rounded={content.annotations.code}
      style={content.annotations.color ? `color: ${content.annotations.color}` : undefined}
    >
      {content.text}
    </span>
  </a>
{:else}
  <span
    class:font-bold={content.annotations.bold}
    class:italic={content.annotations.italic}
    class:line-through={content.annotations.strikethrough}
    class:underline={content.annotations.underline}
    class:font-mono={content.annotations.code}
    class:text-sm={content.annotations.code}
    class:bg-muted={content.annotations.code}
    class:px-1={content.annotations.code}
    class:rounded={content.annotations.code}
    style={content.annotations.color ? `color: ${content.annotations.color}` : undefined}
  >
    {content.text}
  </span>
{/if}