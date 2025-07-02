<script lang="ts">
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { ModeWatcher } from 'mode-watcher';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import { page } from '$app/stores';
	import { slide, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { socialLinks } from '$lib/config';

	let { children } = $props();
	
	let currentPath = $derived($page.url.pathname);
	let isMobileMenuOpen = $state(false);
	
	// Close mobile menu when route changes
	$effect(() => {
		currentPath;
		isMobileMenuOpen = false;
	});
	
	// Prevent body scroll when menu is open
	$effect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		
		return () => {
			document.body.style.overflow = '';
		};
	});
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
				
				<!-- Desktop navigation -->
				<div class="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-light">
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
				
				<!-- Mobile menu button -->
				<button
					onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
					class="md:hidden relative w-10 h-10 flex items-center justify-center text-foreground/60 hover:text-foreground/80 transition-colors duration-500 focus:outline-none"
					aria-label="Toggle menu"
				>
					<div class="w-6 h-4 relative flex flex-col justify-between">
						<span class="block h-px bg-current transition-all duration-500 origin-center {isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}"></span>
						<span class="block h-px bg-current transition-all duration-500 {isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}"></span>
						<span class="block h-px bg-current transition-all duration-500 origin-center {isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}"></span>
					</div>
				</button>
			</nav>
		</div>
		<!-- Subtle bottom border -->
		<div class="absolute bottom-0 left-0 right-0 h-px bg-foreground/10"></div>
	</header>
	
	<!-- Mobile menu overlay -->
	{#if isMobileMenuOpen}
		<div
			class="fixed inset-0 z-40 md:hidden"
			transition:fade={{ duration: 500, easing: quintOut }}
		>
			<!-- Background overlay -->
			<button
				class="absolute inset-0 bg-background/95 backdrop-blur-md"
				onclick={() => isMobileMenuOpen = false}
				aria-label="Close menu"
			></button>
			
			<!-- Menu content -->
			<nav class="relative h-full flex flex-col justify-center items-center px-8">
				<div class="w-full max-w-sm space-y-12">
					{#each [
						{ href: '/about', label: 'About' },
						{ href: '/writing', label: 'Writing' },
						{ href: '/quotes', label: 'Quotes' },
						{ href: '/art', label: 'Art' },
						{ href: '/ponder', label: 'Ponder' }
					] as item, i}
						<a
							href={item.href}
							class="block text-center group"
							transition:slide={{ duration: 400, delay: i * 50, easing: quintOut }}
						>
							<span class="relative inline-block text-2xl font-extralight tracking-wide {currentPath === item.href || (item.href === '/writing' && currentPath.startsWith('/writing')) ? 'text-foreground' : 'text-foreground/60'} hover:text-foreground transition-colors duration-500">
								{item.label}
								<div class="absolute -bottom-2 left-0 right-0 h-px bg-foreground/20 transition-transform duration-500 {currentPath === item.href || (item.href === '/writing' && currentPath.startsWith('/writing')) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}"></div>
							</span>
						</a>
					{/each}
				</div>
				
				<!-- Footer links in mobile menu -->
				<div class="absolute bottom-20 left-0 right-0">
					<div class="flex justify-center gap-8 px-8">
						{#each [
							{ href: socialLinks.github, label: 'GitHub' },
							{ href: socialLinks.linkedin, label: 'LinkedIn' },
							{ href: `mailto:${socialLinks.email}`, label: 'Email' }
						] as link, i}
							<a
								href={link.href}
								target={link.href.startsWith('http') ? '_blank' : undefined}
								rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
								class="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground/80 transition-all duration-500 font-light"
								transition:fade={{ duration: 400, delay: 200 + i * 50, easing: quintOut }}
							>
								{link.label}
							</a>
						{/each}
					</div>
				</div>
			</nav>
		</div>
	{/if}

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
						href={socialLinks.github}
						target="_blank"
						rel="noopener noreferrer"
						class="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground/80 transition-all duration-500 font-light"
					>
						GitHub
					</a>
					<a
						href={socialLinks.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						class="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground/80 transition-all duration-500 font-light"
					>
						LinkedIn
					</a>
					<a
						href={`mailto:${socialLinks.email}`}
						class="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-foreground/80 transition-all duration-500 font-light"
					>
						Email
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>