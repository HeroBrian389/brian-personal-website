<script lang="ts">
	import { page } from "$app/stores";
	import { cn } from "$lib/utils";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu";
	import type { NavItem } from "$lib/config";

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

	let contentRef = $state<HTMLElement | null>(null);
</script>

<NavigationMenu.Item class="relative">
	<NavigationMenu.Trigger
		class={cn(
			"group/nav-trigger relative text-xs font-light tracking-[0.2em] uppercase transition-all duration-500",
			isActive ? "text-foreground" : "text-foreground/60"
		)}
	>
		<span class="relative z-10">
			{label}
		</span>
		<div
			class={cn(
				"bg-foreground/20 absolute right-0 bottom-0 left-0 h-px origin-center transition-transform duration-500",
				isActive
					? "scale-x-100"
					: "scale-x-0 group-hover/nav-trigger:scale-x-100 group-data-[state=open]/nav-trigger:scale-x-100"
			)}
		></div>
	</NavigationMenu.Trigger>
	<NavigationMenu.Content bind:ref={contentRef} class="pt-6">
		<div class="dropdown-container border-foreground/10 bg-background/95 text-foreground/80 min-w-[14rem] space-y-3 border px-6 py-4 backdrop-blur-md">
			{#each children as child (child.href ?? child.label)}
				{#if child.href}
					<a
						href={child.href}
						class={cn(
							"block text-xs font-light tracking-[0.2em] uppercase transition-colors duration-500",
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
