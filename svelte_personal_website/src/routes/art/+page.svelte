<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

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
    {
      id: 'banksy-1',
      artist: 'Banksy',
      title: 'Rage, the Flower Thrower',
      description: 'A protestor throws a bouquet of flowers.',
      imageUrl: '/banksy-flower-thrower.jpeg',
      year: '2003',
      style: 'Street Art',
      colors: ['#000000', '#FFFFFF', '#FF0000', '#00FF00']
    },
    {
      id: 'banksy-2',
      artist: 'Banksy',
      title: 'Girl with Balloon',
      description: 'A young girl with her hand extended toward a red heart-shaped balloon.',
      imageUrl: '/banksy-girl-with-balloon.jpg',
      year: '2002',
      style: 'Street Art',
      colors: ['#000000', '#FFFFFF', '#FF0000']
    }
    // Add more artworks as needed
  ];

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
          {artCollection.length} {artCollection.length === 1 ? 'Piece' : 'Pieces'}
        </p>
      </div>
      <div class="h-px bg-foreground/10"></div>
    </div>

    <!-- Art grid - minimalist layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
      {#each artCollection as art, i}
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