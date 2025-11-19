<script lang="ts">
	import { page } from "$app/stores";
	import { cn } from "$lib/utils";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu";
	import type { NavItem } from "$lib/config";
	import { onMount } from "svelte";

	let { label, children = [] } = $props<{
		label: string;
		children: NavItem[];
	}>();

	const isChildActive = (child: NavItem) => {
		if (!child.href) return false;
		return child.matchType === "exact"
			? $page.url.pathname === child.href
			: $page.url.pathname.startsWith(child.href);
	};

	let isActive = $derived(children.some(isChildActive));

	// Logging setup
	console.log(`[NavGroup:${label}] Component initialized`);
	
	let contentRef = $state<HTMLElement | null>(null);
	let containerRef = $state<HTMLDivElement | null>(null);

	onMount(() => {
		console.log(`[NavGroup:${label}] Component mounted`);
		
		// Set up MutationObserver to watch for data-state changes
		if (contentRef) {
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
						const newState = contentRef?.getAttribute('data-state');
						console.log(`[NavGroup:${label}] data-state changed to:`, newState);
						console.log(`[NavGroup:${label}] contentRef classes:`, contentRef?.className);
						console.log(`[NavGroup:${label}] contentRef computed style opacity:`, 
							contentRef ? window.getComputedStyle(contentRef).opacity : 'N/A');
						console.log(`[NavGroup:${label}] contentRef computed style visibility:`, 
							contentRef ? window.getComputedStyle(contentRef).visibility : 'N/A');
						console.log(`[NavGroup:${label}] contentRef computed style display:`, 
							contentRef ? window.getComputedStyle(contentRef).display : 'N/A');
					}
				});
			});

			observer.observe(contentRef, { attributes: true });
			
			console.log(`[NavGroup:${label}] Initial data-state:`, contentRef.getAttribute('data-state'));
			
			return () => {
				observer.disconnect();
			};
		}
		
		return () => {};
	});

	// Watch container for animation events
	$effect(() => {
		const container = containerRef;
		if (container) {
			const onAnimationStart = (e: AnimationEvent) => {
				console.log(`[NavGroup:${label}] Animation started:`, e.animationName, 'on', e.target);
			};
			const onAnimationEnd = (e: AnimationEvent) => {
				console.log(`[NavGroup:${label}] Animation ended:`, e.animationName, 'on', e.target);
			};
			
			container.addEventListener('animationstart', onAnimationStart);
			container.addEventListener('animationend', onAnimationEnd);
			
			return () => {
				container.removeEventListener('animationstart', onAnimationStart);
				container.removeEventListener('animationend', onAnimationEnd);
			};
		}
		
		return () => {};
	});
</script>

<style>
	@keyframes dropdown-fade-in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Animate entire dropdown container when parent content is open */
	:global([data-state="open"]) .dropdown-container {
		animation: dropdown-fade-in 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	/* Start invisible */
	:global([data-state="closed"]) .dropdown-container {
		opacity: 0;
	}
</style>

<NavigationMenu.Item class="relative">
	<NavigationMenu.Trigger
		class={cn(
			"group/nav-trigger relative text-xs font-light uppercase tracking-[0.2em] transition-all duration-500",
			isActive ? "text-foreground" : "text-foreground/60"
		)}
	>
		<span class="relative z-10">
			{label}
		</span>
		<div
			class={cn(
				"bg-foreground/20 absolute bottom-0 left-0 right-0 h-px origin-center transition-transform duration-500",
				isActive
					? "scale-x-100"
					: "scale-x-0 group-data-[state=open]/nav-trigger:scale-x-100 group-hover/nav-trigger:scale-x-100"
			)}
		></div>
	</NavigationMenu.Trigger>
	<NavigationMenu.Content bind:ref={contentRef} class="pt-6">
		<div 
			bind:this={containerRef}
			class="dropdown-container border border-foreground/10 bg-background/95 text-foreground/80 min-w-[14rem] space-y-3 px-6 py-4 backdrop-blur-md"
		>
			{#each children as child (child.href ?? child.label)}
				{#if child.href}
					<a
						href={child.href}
						class={cn(
							"block text-xs font-light uppercase tracking-[0.2em] transition-colors duration-500",
							isChildActive(child)
								? "text-foreground"
								: "text-foreground/60 hover:text-foreground/90"
						)}
					>
						{child.label}
					</a>
				{/if}
			{/each}
		</div>
	</NavigationMenu.Content>
</NavigationMenu.Item>
