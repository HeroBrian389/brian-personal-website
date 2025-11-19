<script lang="ts">
	import { page } from "$app/stores";
	import { cn } from "$lib/utils";

	let {
		href,
		label,
		matchType = "exact",
		mobile = false,
		class: className = undefined,
		onclick = undefined
	} = $props<{
		href: string;
		label: string;
		matchType?: "exact" | "prefix" | undefined;
		mobile?: boolean;
		class?: string | undefined;
		onclick?: (() => void) | undefined;
	}>();

	let isActive = $derived(
		matchType === "exact"
			? $page.url.pathname === href
			: $page.url.pathname.startsWith(href)
	);
</script>

<a
	{href}
	{onclick}
	class={cn(
		"group/nav-link relative transition-all duration-500 hover:text-foreground/80",
		isActive ? "text-foreground" : "text-foreground/60",
		mobile
			? "block text-center text-2xl font-extralight tracking-wide hover:text-foreground"
			: "inline-flex h-10 items-center text-xs font-light tracking-[0.2em] uppercase",
		className
	)}
>
	<span class="relative z-10">{label}</span>
	<div
		class={cn(
			"bg-foreground/20 absolute right-0 left-0 h-px transition-transform duration-500",
			isActive ? "scale-x-100" : "scale-x-0 group-hover/nav-link:scale-x-100",
			mobile ? "-bottom-2" : "bottom-0"
		)}
	></div>
</a>
