<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { quintOut } from 'svelte/easing';
  
  // Garden Path data structure
  interface PonderVideo {
    id: string;
    title: string;
    prompt: string;
    author: string;
    duration: string;
    transition?: string; // Text shown between videos
  }
  
  // The garden of thoughts
  const gardenPath: PonderVideo[] = [
    {
      id: 'kYfNvmF0Bqw',
      title: 'Secrets of Life',
      prompt: 'What walls have you built around your life?',
      author: 'Steve Jobs',
      duration: '1:47'
    },
    {
      id: 'uEl2KUZ3JWA',
      title: 'Sam Altman on Choosing Projects, Creating Value, and Finding Purpose',
      prompt: 'What would you create if you knew everything would change?',
      author: 'Sam Altman',
      duration: '10:40',
      transition: 'Pause. Think deeply. Are you living in a way that reaches up? Continue when ready'
    }
  ];
  
  // Track which videos are in view
  let videosInView = $state<Set<number>>(new Set());
  let scrollY = $state(0);
  let innerHeight = $state(0);
  
  // Scroll position for energy calculations
  // The energy orbs are positioned absolutely in document space
  
  // Smooth animations
  const lineWidth = tweened(0, { duration: 800, easing: quintOut });
  
  // Check if element is in viewport
  function checkInView() {
    const elements = document.querySelectorAll('.garden-clearing');
    const newInView = new Set<number>();
    
    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < innerHeight && rect.bottom > 0;
      if (inView) {
        newInView.add(index);
      }
    });
    
    videosInView = newInView;
  }
  
  onMount(() => {
    setTimeout(() => {
      lineWidth.set(100);
    }, 100);
    
    checkInView();
    
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  });
  
  // Handle scroll to next clearing
  function scrollToNext(index: number) {
    const nextClearing = document.querySelector(`#clearing-${index + 1}`);
    if (nextClearing) {
      nextClearing.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
</script>

<svelte:head>
  <title>Ponder - Brian Kelleher</title>
  <meta name="description" content="A garden path of thoughts worth contemplating" />
</svelte:head>

<svelte:window bind:scrollY bind:innerHeight on:scroll={checkInView} />

<div class="bg-background relative">
  <!-- Pulsing Energy Orbs - Multi-layered for depth -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden">
    <!-- Energy orb 1 - Blue depths -->
    <div class="energy-field" style="left: -300px; top: 20vh;">
      <div class="energy-orb-core energy-orb-1-core"></div>
      <div class="energy-orb-glow energy-orb-1-glow"></div>
      <div class="energy-orb-halo energy-orb-1-halo"></div>
    </div>
    
    <!-- Energy orb 2 - Violet whispers -->
    <div class="energy-field" style="right: -250px; top: 60vh;">
      <div class="energy-orb-core energy-orb-2-core"></div>
      <div class="energy-orb-glow energy-orb-2-glow"></div>
      <div class="energy-orb-halo energy-orb-2-halo"></div>
    </div>
    
    <!-- Energy orb 3 - Rose dreams -->
    <div class="energy-field" style="left: 50%; top: 110vh; transform: translateX(-50%);">
      <div class="energy-orb-core energy-orb-3-core"></div>
      <div class="energy-orb-glow energy-orb-3-glow"></div>
      <div class="energy-orb-halo energy-orb-3-halo"></div>
    </div>
    
    <!-- Energy orb 4 - Emerald pulse -->
    <div class="energy-field" style="right: -225px; top: 180vh;">
      <div class="energy-orb-core energy-orb-4-core"></div>
      <div class="energy-orb-glow energy-orb-4-glow"></div>
      <div class="energy-orb-halo energy-orb-4-halo"></div>
    </div>
    
    <!-- Energy orb 5 - Amber glow -->
    <div class="energy-field" style="left: -275px; top: 250vh;">
      <div class="energy-orb-core energy-orb-5-core"></div>
      <div class="energy-orb-glow energy-orb-5-glow"></div>
      <div class="energy-orb-halo energy-orb-5-halo"></div>
    </div>
  </div>
  
  <!-- Garden Entry -->
  <header class="h-screen flex items-center justify-center text-center px-4">
    <div>
      <h1 class="text-5xl md:text-6xl font-extralight mb-8" in:fade={{ duration: 2000, delay: 100 }}>
        Ponder
      </h1>
      <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light mb-16" in:fade={{ duration: 2000, delay: 300 }}>
        A garden path of contemplation
      </p>
      
      <!-- Minimal separator line -->
      <div class="flex justify-center mb-16" in:fade={{ duration: 2000, delay: 500 }}>
        <div 
          class="h-px bg-foreground/20 transition-all duration-1000"
          style="width: {$lineWidth}px"
        ></div>
      </div>
      
      <button
        onclick={() => scrollToNext(-1)}
        class="text-sm uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground/80 transition-all duration-1000 font-light"
        in:fade={{ duration: 2000, delay: 700 }}
      >
        Begin the journey ↓
      </button>
    </div>
  </header>
  
  <!-- The Garden Path -->
  <div class="relative">
    {#each gardenPath as video, index}
      <!-- Path between clearings -->
      {#if index > 0}
        <div class="h-[calc(100vh-5rem)] flex items-center justify-center text-center px-4">
          <p class="text-sm uppercase tracking-[0.3em] text-muted-foreground/40 font-light">
            {video.transition || '• • •'}
          </p>
        </div>
      {/if}
      
      <!-- Garden Clearing -->
      <section 
        id="clearing-{index}"
        class="garden-clearing min-h-screen py-20 flex items-center"
      >
        <div class="container mx-auto px-4 max-w-4xl">
          <!-- Video Container -->
          <div class="mb-16">
            <div class="aspect-video relative bg-black/5 backdrop-blur-sm overflow-hidden rounded-sm">
              {#if videosInView.has(index)}
                <iframe
                  src="https://www.youtube.com/embed/{video.id}?autoplay=0&rel=0&modestbranding=1"
                  title={video.title}
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="absolute inset-0 w-full h-full"
                  in:fade={{ duration: 1000 }}
                ></iframe>
              {/if}
            </div>
          </div>
          
          <!-- Video Details -->
          <div class="text-center">
            <h2 class="text-2xl font-extralight mb-4">{video.title}</h2>
            
            <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground/60 font-light mb-8">
              {video.author}
            </p>
            
            <!-- Continue indicator -->
            {#if index < gardenPath.length - 1}
              <button
                onclick={() => scrollToNext(index)}
                class="mt-16 text-sm uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground/60 transition-all duration-1000 font-light"
              >
                Continue ↓
              </button>
            {/if}
          </div>
        </div>
      </section>
    {/each}
    
    <!-- Garden Exit -->
    <div class="h-screen flex items-center justify-center text-center px-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-muted-foreground/40 font-light mb-8">
          End of the path
        </p>
        <button
          onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          class="text-sm uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground/80 transition-all duration-1000 font-light"
        >
          Return to beginning ↑
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  /* Minimal focus styles */
  button:focus-visible {
    outline: 1px solid hsl(var(--foreground) / 0.2);
    outline-offset: 4px;
  }
  
  /* Ensure iframe is responsive */
  iframe {
    border: 0;
  }
  
  /* Smooth all transitions */
  * {
    transition-property: opacity, transform;
    transition-duration: 300ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Garden path smooth scroll */
  html {
    scroll-behavior: smooth;
  }
  
  /* Subtle animation for continuation text */
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  
  button:hover {
    animation: float 2s ease-in-out infinite;
  }
  
  /* Energy field container */
  .energy-field {
    position: absolute;
    width: 800px;
    height: 800px;
    margin: -400px;
  }
  
  /* Three-layer orb system for depth */
  .energy-orb-core,
  .energy-orb-glow,
  .energy-orb-halo {
    position: absolute;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    will-change: transform, opacity, filter;
  }
  
  /* Core - bright center */
  .energy-orb-core {
    filter: blur(20px);
    mix-blend-mode: screen;
  }
  
  /* Glow - middle layer */
  .energy-orb-glow {
    filter: blur(60px);
    mix-blend-mode: lighten;
  }
  
  /* Halo - outer aura */
  .energy-orb-halo {
    filter: blur(120px);
    mix-blend-mode: screen;
    opacity: 0.5;
  }
  
  /* Orb 1 - Deep ocean */
  .energy-orb-1-core {
    width: 120px;
    height: 120px;
    background: radial-gradient(circle at 40% 40%, 
      rgba(147, 197, 253, 0.08) 0%, 
      rgba(59, 130, 246, 0.06) 40%, 
      transparent 70%);
    animation: morphCore1 20s ease-in-out infinite;
  }
  
  .energy-orb-1-glow {
    width: 350px;
    height: 350px;
    background: radial-gradient(ellipse at center, 
      rgba(59, 130, 246, 0.04) 0%, 
      rgba(37, 99, 235, 0.02) 30%, 
      transparent 70%);
    animation: morphGlow1 20s ease-in-out infinite;
  }
  
  .energy-orb-1-halo {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle at center, 
      rgba(96, 165, 250, 0.02) 0%, 
      transparent 60%);
    animation: morphHalo1 20s ease-in-out infinite;
  }
  
  /* Orb 2 - Mystic violet */
  .energy-orb-2-core {
    width: 100px;
    height: 100px;
    background: radial-gradient(circle at 60% 40%, 
      rgba(196, 181, 253, 0.07) 0%, 
      rgba(139, 92, 246, 0.05) 40%, 
      transparent 70%);
    animation: morphCore2 25s ease-in-out infinite;
  }
  
  .energy-orb-2-glow {
    width: 300px;
    height: 300px;
    background: radial-gradient(ellipse at center, 
      rgba(139, 92, 246, 0.03) 0%, 
      rgba(109, 40, 217, 0.015) 35%, 
      transparent 70%);
    animation: morphGlow2 25s ease-in-out infinite;
  }
  
  .energy-orb-2-halo {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle at center, 
      rgba(167, 139, 250, 0.015) 0%, 
      transparent 65%);
    animation: morphHalo2 25s ease-in-out infinite;
  }
  
  /* Orb 3 - Rose nebula */
  .energy-orb-3-core {
    width: 150px;
    height: 150px;
    background: radial-gradient(circle at 45% 45%, 
      rgba(251, 207, 232, 0.06) 0%, 
      rgba(236, 72, 153, 0.04) 35%, 
      transparent 65%);
    animation: morphCore3 30s ease-in-out infinite;
  }
  
  .energy-orb-3-glow {
    width: 400px;
    height: 400px;
    background: radial-gradient(ellipse at center, 
      rgba(236, 72, 153, 0.025) 0%, 
      rgba(219, 39, 119, 0.01) 40%, 
      transparent 70%);
    animation: morphGlow3 30s ease-in-out infinite;
  }
  
  .energy-orb-3-halo {
    width: 700px;
    height: 700px;
    background: radial-gradient(circle at center, 
      rgba(244, 114, 182, 0.01) 0%, 
      transparent 60%);
    animation: morphHalo3 30s ease-in-out infinite;
  }
  
  /* Complex morphing animations */
  @keyframes morphCore1 {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
      opacity: 0.8;
      border-radius: 50%;
    }
    25% { 
      transform: translate(-50%, -50%) scale(1.3) rotate(90deg);
      opacity: 1;
      border-radius: 40% 60% 60% 40%;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.1) rotate(180deg);
      opacity: 0.9;
      border-radius: 60% 40% 50% 50%;
    }
    75% { 
      transform: translate(-50%, -50%) scale(1.2) rotate(270deg);
      opacity: 0.95;
      border-radius: 50% 50% 40% 60%;
    }
  }
  
  @keyframes morphGlow1 {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.15);
      opacity: 0.8;
    }
  }
  
  @keyframes morphHalo1 {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
      filter: blur(120px) hue-rotate(0deg);
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.1) rotate(180deg);
      filter: blur(100px) hue-rotate(20deg);
    }
  }
  
  /* Continue with similar patterns for other orbs... */
  @keyframes morphCore2 {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.7;
      border-radius: 50%;
    }
    33% { 
      transform: translate(-50%, -50%) scale(1.4);
      opacity: 0.9;
      border-radius: 45% 55% 55% 45%;
    }
    66% { 
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.85;
      border-radius: 55% 45% 45% 55%;
    }
  }
  
  @keyframes morphGlow2 {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1) rotate(0deg);
      opacity: 0.5;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.2) rotate(-180deg);
      opacity: 0.7;
    }
  }
  
  @keyframes morphCore3 {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    25% { 
      transform: translate(-50%, -50%) scale(1.15);
      opacity: 0.75;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.3);
      opacity: 0.8;
    }
    75% { 
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0.7;
    }
  }
  
  /* Prismatic color shifts */
  @keyframes prismatic {
    0%, 100% { filter: hue-rotate(0deg) saturate(1); }
    50% { filter: hue-rotate(30deg) saturate(1.2); }
  }
  
  /* Apply subtle color shifting to all glows */
  .energy-orb-glow {
    animation-name: morphGlow1, prismatic;
    animation-duration: 20s, 40s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
</style>