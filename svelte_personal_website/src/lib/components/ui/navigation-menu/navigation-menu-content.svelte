<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.ContentProps = $props();
</script>

<NavigationMenuPrimitive.Content
	bind:ref
	data-slot="navigation-menu-content"
	class={cn(
		"pointer-events-auto top-full left-0 w-full origin-top transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=closed]:translate-y-2 data-[state=open]:scale-100 data-[state=closed]:scale-[0.985] md:absolute md:w-auto",
		className
	)}
	{...restProps}
/>
