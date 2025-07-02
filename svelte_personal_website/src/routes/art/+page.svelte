<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  
  let selectedArtist = $state<string | null>(null);
  let hoveredArt = $state<string | null>(null);
  
  // Art collection data
  const artCollection = [
    {
      id: 'hiroshi-4',
      artist: 'Hiroshi Nagai',
      title: 'Plane Over Paradise',
      description: 'Aircraft soaring above tropical landscape',
      imageUrl: '/hiroshi-plane.avif',
      year: '1980s',
      style: 'City Pop',
      colors: ['#87CEEB', '#FF69B4', '#20B2AA', '#FFE4B5']
    },
    // Add more artworks as needed
  ];
  
  // Get unique artists
  const artists = Array.from(new Set(artCollection.map(art => art.artist)));
  
  // Filter artworks by selected artist
  let filteredArt = $derived(
    selectedArtist 
      ? artCollection.filter(art => art.artist === selectedArtist)
      : artCollection
  );
  
  onMount(() => {
    // Initialize any animations or lazy loading
  });
</script>

<svelte:head>
  <title>Art - Brian Kelleher</title>
  <meta name="description" content="A curated collection of visual art" />
</svelte:head>

<div class="min-h-screen bg-background">
  <div class="container mx-auto px-4 max-w-6xl">
    <!-- Compact header -->
    <div class="pt-12 pb-16">
      <div class="flex items-baseline justify-between mb-4" in:fade={{ duration: 800 }}>
        <h1 class="text-3xl font-extralight tracking-tight">Art</h1>
        <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground/40 font-light">
          {filteredArt.length} {filteredArt.length === 1 ? 'Piece' : 'Pieces'}
        </p>
      </div>
      <div class="h-px bg-foreground/10"></div>
    </div>
    
    <!-- Artist filter - minimal approach -->
    {#if artists.length > 1}
      <div class="flex gap-8 mb-16 text-xs uppercase tracking-[0.2em] font-light">
        <button
          onclick={() => selectedArtist = null}
          class="hover:text-foreground/80 transition-colors duration-500 relative group {selectedArtist === null ? 'text-foreground' : 'text-foreground/40'}"
        >
          <span class="relative z-10">All</span>
          <div class="absolute inset-x-0 bottom-0 h-px bg-foreground/20 transition-transform duration-500 {selectedArtist === null ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}"></div>
        </button>
        {#each artists as artist}
          <button
            onclick={() => selectedArtist = artist}
            class="hover:text-foreground/80 transition-colors duration-500 relative group {selectedArtist === artist ? 'text-foreground' : 'text-foreground/40'}"
          >
            <span class="relative z-10">{artist}</span>
            <div class="absolute inset-x-0 bottom-0 h-px bg-foreground/20 transition-transform duration-500 {selectedArtist === artist ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}"></div>
          </button>
        {/each}
      </div>
    {/if}
    
    <!-- Art grid - minimalist layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
      {#each filteredArt as art, i}
        <button
          class="group cursor-pointer w-full text-left"
          in:fade={{ duration: 600, delay: i * 100 }}
          onmouseenter={() => hoveredArt = art.id}
          onmouseleave={() => hoveredArt = null}
          aria-label="View {art.title}"
        >
          <div class="relative overflow-hidden bg-foreground/5">
            <img 
              src={art.imageUrl} 
              alt={art.title}
              class="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
            
            <!-- Subtle overlay on hover -->
            <div class="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 flex items-end p-6">
              <div>
                <h3 class="text-lg font-light mb-2">{art.title}</h3>
                <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground/60 font-light">
                  {art.artist} · {art.year}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Minimal caption below image -->
          <div class="mt-4">
            <p class="text-sm font-light text-foreground/80">{art.title}</p>
            <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground/40 font-light mt-1">
              {art.artist}
            </p>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  /* Ensure images maintain aspect ratio */
  img {
    aspect-ratio: 4/3;
    object-fit: cover;
  }
</style>