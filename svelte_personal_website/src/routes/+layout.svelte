<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import AudioPlayer from "$lib/components/AudioPlayer.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import { page } from "$app/stores";
	import { slide, fade } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { socialLinks } from "$lib/config";

	let { children } = $props();

	let currentPath = $derived($page.url.pathname);
	let isMobileMenuOpen = $state(false);

	// Close mobile menu when route changes
	$effect(() => {
		// Access currentPath to trigger the effect
		void currentPath;
		isMobileMenuOpen = false;
	});

	// Prevent body scroll when menu is open
	$effect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	});
</script>

<ModeWatcher />
<AudioPlayer />
<ThemeToggle />

<div class="bg-background min-h-screen">
	<header class="bg-background/80 fixed top-0 z-50 w-full backdrop-blur-sm">
		<div class="container mx-auto px-4">
			<nav class="flex h-20 items-center justify-between">
				<a
					href="/"
					class="hover:text-foreground/80 text-base font-extralight tracking-tight transition-colors duration-500"
				>
					Brian Kelleher
				</a>

				<!-- Desktop navigation -->
				<div
					class="hidden items-center gap-8 text-xs font-light tracking-[0.2em] uppercase md:flex"
				>
					<a
						href="/about"
						class="hover:text-foreground/80 group relative transition-all duration-500 {currentPath ===
						'/about'
							? 'text-foreground'
							: 'text-foreground/60'}"
					>
						<span class="relative z-10">About</span>
						<div
							class="bg-foreground/20 absolute inset-x-0 bottom-0 h-px transition-transform duration-500 {currentPath ===
							'/about'
								? 'scale-x-100'
								: 'scale-x-0 group-hover:scale-x-100'}"
						></div>
					</a>
					<a
						href="/writing"
						class="hover:text-foreground/80 group relative transition-all duration-500 {currentPath.startsWith(
							'/writing'
						)
							? 'text-foreground'
							: 'text-foreground/60'}"
					>
						<span class="relative z-10">Writing</span>
						<div
							class="bg-foreground/20 absolute inset-x-0 bottom-0 h-px transition-transform duration-500 {currentPath.startsWith(
								'/writing'
							)
								? 'scale-x-100'
								: 'scale-x-0 group-hover:scale-x-100'}"
						></div>
					</a>
					<a
						href="/quotes"
						class="hover:text-foreground/80 group relative transition-all duration-500 {currentPath ===
						'/quotes'
							? 'text-foreground'
							: 'text-foreground/60'}"
					>
						<span class="relative z-10">Quotes</span>
						<div
							class="bg-foreground/20 absolute inset-x-0 bottom-0 h-px transition-transform duration-500 {currentPath ===
							'/quotes'
								? 'scale-x-100'
								: 'scale-x-0 group-hover:scale-x-100'}"
						></div>
					</a>
					<a
						href="/art"
						class="hover:text-foreground/80 group relative transition-all duration-500 {currentPath ===
						'/art'
							? 'text-foreground'
							: 'text-foreground/60'}"
					>
						<span class="relative z-10">Art</span>
						<div
							class="bg-foreground/20 absolute inset-x-0 bottom-0 h-px transition-transform duration-500 {currentPath ===
							'/art'
								? 'scale-x-100'
								: 'scale-x-0 group-hover:scale-x-100'}"
						></div>
					</a>
					<a
						href="/projects"
						class="hover:text-foreground/80 group relative transition-all duration-500 {currentPath.startsWith(
							'/projects'
						)
							? 'text-foreground'
							: 'text-foreground/60'}"
					>
						<span class="relative z-10">Projects</span>
						<div
							class="bg-foreground/20 absolute inset-x-0 bottom-0 h-px transition-transform duration-500 {currentPath.startsWith(
								'/projects'
							)
								? 'scale-x-100'
								: 'scale-x-0 group-hover:scale-x-100'}"
						></div>
					</a>
					<a
						href="/talks"
						class="hover:text-foreground/80 group relative transition-all duration-500 {currentPath.startsWith(
							'/talks'
						)
							? 'text-foreground'
							: 'text-foreground/60'}"
					>
						<span class="relative z-10">Talks</span>
						<div
							class="bg-foreground/20 absolute inset-x-0 bottom-0 h-px transition-transform duration-500 {currentPath.startsWith(
								'/talks'
							)
								? 'scale-x-100'
								: 'scale-x-0 group-hover:scale-x-100'}"
						></div>
					</a>
					<a
						href="/ponder"
						class="hover:text-foreground/80 group relative transition-all duration-500 {currentPath ===
						'/ponder'
							? 'text-foreground'
							: 'text-foreground/60'}"
					>
						<span class="relative z-10">Ponder</span>
						<div
							class="bg-foreground/20 absolute inset-x-0 bottom-0 h-px transition-transform duration-500 {currentPath ===
							'/ponder'
								? 'scale-x-100'
								: 'scale-x-0 group-hover:scale-x-100'}"
						></div>
					</a>
				</div>

				<!-- Mobile menu button -->
				<button
					onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
					class="text-foreground/60 hover:text-foreground/80 relative flex h-10 w-10 items-center justify-center transition-colors duration-500 focus:outline-none md:hidden"
					aria-label="Toggle menu"
				>
					<div class="relative flex h-4 w-6 flex-col justify-between">
						<span
							class="block h-px origin-center bg-current transition-all duration-500 {isMobileMenuOpen
								? 'translate-y-[8px] rotate-45'
								: ''}"
						></span>
						<span
							class="block h-px bg-current transition-all duration-500 {isMobileMenuOpen
								? 'scale-x-0 opacity-0'
								: ''}"
						></span>
						<span
							class="block h-px origin-center bg-current transition-all duration-500 {isMobileMenuOpen
								? '-translate-y-[8px] -rotate-45'
								: ''}"
						></span>
					</div>
				</button>
			</nav>
		</div>
		<!-- Subtle bottom border -->
		<div class="bg-foreground/10 absolute right-0 bottom-0 left-0 h-px"></div>
	</header>

	<!-- Mobile menu overlay -->
	{#if isMobileMenuOpen}
		<div
			class="fixed inset-0 z-40 md:hidden"
			transition:fade={{ duration: 500, easing: quintOut }}
		>
			<!-- Background overlay -->
			<button
				class="bg-background/95 absolute inset-0 backdrop-blur-md"
				onclick={() => (isMobileMenuOpen = false)}
				aria-label="Close menu"
			></button>

			<!-- Menu content -->
			<nav class="relative flex h-full flex-col items-center justify-center px-8">
				<div class="w-full max-w-sm space-y-12">
					{#each [{ href: "/about", label: "About" }, { href: "/writing", label: "Writing" }, { href: "/quotes", label: "Quotes" }, { href: "/art", label: "Art" }, { href: "/projects", label: "Projects" }, { href: "/ponder", label: "Ponder" }] as item, i (item.href)}
						<a
							href={item.href}
							class="group block text-center"
							transition:slide={{ duration: 400, delay: i * 50, easing: quintOut }}
						>
							<span
								class="relative inline-block text-2xl font-extralight tracking-wide {currentPath ===
									item.href ||
								(item.href === '/writing' && currentPath.startsWith('/writing')) ||
								(item.href === '/projects' && currentPath.startsWith('/projects'))
									? 'text-foreground'
									: 'text-foreground/60'} hover:text-foreground transition-colors duration-500"
							>
								{item.label}
								<div
									class="bg-foreground/20 absolute right-0 -bottom-2 left-0 h-px transition-transform duration-500 {currentPath ===
										item.href ||
									(item.href === '/writing' &&
										currentPath.startsWith('/writing')) ||
									(item.href === '/projects' &&
										currentPath.startsWith('/projects'))
										? 'scale-x-100'
										: 'scale-x-0 group-hover:scale-x-100'}"
								></div>
							</span>
						</a>
					{/each}
				</div>

				<!-- Footer links in mobile menu -->
				<div class="absolute right-0 bottom-20 left-0">
					<div class="flex justify-center gap-8 px-8">
						{#each [{ href: socialLinks.github, label: "GitHub" }, { href: socialLinks.linkedin, label: "LinkedIn" }, { href: `mailto:${socialLinks.email}`, label: "Email" }] as link, i (link.href)}
							<a
								href={link.href}
								target={link.href.startsWith("http") ? "_blank" : undefined}
								rel={link.href.startsWith("http")
									? "noopener noreferrer"
									: undefined}
								class="text-muted-foreground/60 hover:text-foreground/80 text-xs font-light tracking-[0.2em] uppercase transition-all duration-500"
								transition:fade={{
									duration: 400,
									delay: 200 + i * 50,
									easing: quintOut
								}}
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

	<footer class="border-foreground/10 border-t">
		<div class="container mx-auto px-4 py-16">
			<div class="flex flex-col items-center justify-between gap-8 md:flex-row">
				<p class="text-muted-foreground/60 text-xs font-light tracking-[0.2em] uppercase">
					© {new Date().getFullYear()} Brian Kelleher
				</p>
				<div class="flex gap-8">
					<a
						href={socialLinks.github}
						target="_blank"
						rel="noopener noreferrer"
						class="text-muted-foreground/60 hover:text-foreground/80 text-xs font-light tracking-[0.2em] uppercase transition-all duration-500"
					>
						GitHub
					</a>
					<a
						href={socialLinks.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						class="text-muted-foreground/60 hover:text-foreground/80 text-xs font-light tracking-[0.2em] uppercase transition-all duration-500"
					>
						LinkedIn
					</a>
					<a
						href={`mailto:${socialLinks.email}`}
						class="text-muted-foreground/60 hover:text-foreground/80 text-xs font-light tracking-[0.2em] uppercase transition-all duration-500"
					>
						Email
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>
