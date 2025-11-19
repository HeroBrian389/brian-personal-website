<script lang="ts">
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";
	import AudioPlayer from "$lib/components/AudioPlayer.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import NavLink from "$lib/components/NavLink.svelte";
	import NavGroup from "$lib/components/NavGroup.svelte";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu";
	import { browser } from "$app/environment";
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import { slide, fade } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import { onMount } from "svelte";
	import { socialLinks, navItems } from "$lib/config";

	const GA_TRACKING_ID = "G-T42K1XVFLT";

	const sendPageView = (url: URL) => {
		if (!browser || typeof window.gtag !== "function") {
			return;
		}

		window.gtag("config", GA_TRACKING_ID, {
			page_path: `${url.pathname}${url.search}${url.hash}`
		});
	};

	onMount(() => {
		if (!browser) {
			return;
		}

		window.dataLayer = window.dataLayer || [];
		sendPageView(new URL(window.location.href));
	});

	afterNavigate(({ to }) => {
		if (!to) {
			return;
		}

		sendPageView(to.url);
	});

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
				<div class="hidden md:flex">
					<NavigationMenu.Root viewport={false} class="flex">
						<NavigationMenu.List class="flex items-center gap-8">
							{#each navItems as item}
								{#if item.children}
									<NavGroup label={item.label} children={item.children} />
								{:else if item.href}
									<NavigationMenu.Item>
										<NavLink
											href={item.href}
											label={item.label}
											matchType={item.matchType}
										/>
									</NavigationMenu.Item>
								{/if}
							{/each}
						</NavigationMenu.List>
					</NavigationMenu.Root>
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
				<div class="w-full max-w-sm space-y-12 text-center">
					{#each navItems as item, i}
						<div transition:slide={{ duration: 400, delay: i * 50, easing: quintOut }}>
							{#if item.children}
								<div
									class="text-muted-foreground mb-4 text-xs font-bold tracking-widest uppercase opacity-50"
								>
									{item.label}
								</div>
								<div class="space-y-6">
									{#each item.children as child}
										{#if child.href}
											<NavLink
												href={child.href}
												label={child.label}
												matchType={child.matchType}
												mobile
												onclick={() => (isMobileMenuOpen = false)}
											/>
										{/if}
									{/each}
								</div>
							{:else if item.href}
								<NavLink
									href={item.href}
									label={item.label}
									matchType={item.matchType}
									mobile
									onclick={() => (isMobileMenuOpen = false)}
								/>
							{/if}
						</div>
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
