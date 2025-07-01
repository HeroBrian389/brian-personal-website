<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { ModeWatcher } from 'mode-watcher';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import { page } from '$app/stores';

	let { children } = $props();
	
	let currentPath = $derived($page.url.pathname);
</script>

<ModeWatcher />
<AudioPlayer />

<div class="min-h-screen bg-background">
	<header class="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
		<div class="container mx-auto px-4">
			<nav class="flex h-20 items-center justify-between">
				<a href="/" class="text-base font-extralight tracking-tight hover:text-foreground/80 transition-colors duration-500">
					Brian Kelleher
				</a>
				<div class="flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-light">
					<a href="/about" class="hover:text-foreground/80 transition-all duration-500 relative group {currentPath === '/about' ? 'text-foreground' : 'text-foreground/60'}">
						<span class="relative z-10">About</span>
						<div class="absolute inset-x-0 bottom-0 h-px bg-foreground/20 transition-transform duration-500 {currentPath === '/about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}"></div>
					</a>
					<a href="/writing" class="hover:text-foreground/80 transition-all duration-500 relative group {currentPath.startsWith('/writing') ? 'text-foreground' : 'text-foreground/60'}">
						<span class="relative z-10">Writing</span>
						<div class="absolute inset-x-0 bottom-0 h-px bg-foreground/20 transition-transform duration-500 {currentPath.startsWith('/writing') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}"></div>
					</a>
					<a href="/quotes" class="hover:text-foreground/80 transition-all duration-500 relative group {currentPath === '/quotes' ? 'text-foreground' : 'text-foreground/60'}">
						<span class="relative z-10">Quotes</span>
						<div class="absolute inset-x-0 bottom-0 h-px bg-foreground/20 transition-transform duration-500 {currentPath === '/quotes' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}"></div>
					</a>
					<a href="/art" class="hover:text-foreground/80 transition-all duration-500 relative group {currentPath === '/art' ? 'text-foreground' : 'text-foreground/60'}">
						<span class="relative z-10">Art</span>
						<div class="absolute inset-x-0 bottom-0 h-px bg-foreground/20 transition-transform duration-500 {currentPath === '/art' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}"></div>
					</a>
					<a href="/ponder" class="hover:text-foreground/80 transition-all duration-500 relative group {currentPath === '/ponder' ? 'text-foreground' : 'text-foreground/60'}">
						<span class="relative z-10">Ponder</span>
						<div class="absolute inset-x-0 bottom-0 h-px bg-foreground/20 transition-transform duration-500 {currentPath === '/ponder' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}"></div>
					</a>
				</div>
			</nav>
		</div>
		<!-- Subtle bottom border -->
		<div class="absolute bottom-0 left-0 right-0 h-px bg-foreground/10"></div>
	</header>

	<main class="flex-1 pt-20">
		{@render children()}
	</main>

	<footer class="border-t border-foreground/10">
		<div class="container mx-auto px-4 py-16">
			<div class="flex flex-col items-center justify-between gap-8 md:flex-row">
				<p class="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-light">
					© {new Date().getFullYear()} Brian Kelleher
				</p>
				<div class="flex gap-8">
					<a
						href="https://github.com/herobrian389"
						target="_blank"
						rel="noopener noreferrer"
						class="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground/80 transition-all duration-500 font-light"
					>
						GitHub
					</a>
					<a
						href="https://linkedin.com/in/briankelleher0"
						target="_blank"
						rel="noopener noreferrer"
						class="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground/80 transition-all duration-500 font-light"
					>
						LinkedIn
					</a>
					<a
						href="mailto:brian@microdoc.ie"
						class="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground/80 transition-all duration-500 font-light"
					>
						Email
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>