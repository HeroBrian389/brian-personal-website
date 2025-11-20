<script lang="ts" module>
	import { cn } from "$lib/utils.js";
	import { tv } from "tailwind-variants";

	export const navigationMenuTriggerStyle = tv({
		base: "group relative inline-flex h-10 items-center justify-start text-xs font-light uppercase tracking-[0.2em] text-foreground/60 transition-colors duration-500 focus-visible:outline-none focus-visible:ring-0 hover:text-foreground/80 data-[state=open]:text-foreground disabled:pointer-events-none disabled:opacity-40"
	});
</script>

<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: NavigationMenuPrimitive.TriggerProps = $props();
</script>

<NavigationMenuPrimitive.Trigger
	bind:ref
	data-slot="navigation-menu-trigger"
	class={cn(navigationMenuTriggerStyle(), "group", className)}
	{...restProps}
>
	{@render children?.()}
</NavigationMenuPrimitive.Trigger>
