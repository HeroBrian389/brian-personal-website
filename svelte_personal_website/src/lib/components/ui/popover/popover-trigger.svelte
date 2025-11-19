<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { Popover as PopoverPrimitive } from "bits-ui";
	import type { HTMLButtonAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: PopoverPrimitive.TriggerProps & HTMLButtonAttributes = $props();
</script>

<PopoverPrimitive.Trigger
	bind:ref
	data-slot="popover-trigger"
	class={cn("", className)}
	{...restProps}
/>
