<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import NestedShell from "$lib/components/NestedShell.svelte";

	let { selectedProject } = $props<{
		selectedProject: { slug: string; title: string; description: string };
	}>();
	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<div class="bg-background flex h-[calc(100vh-15rem)] w-full">
	<div class="text-foreground w-1/2 bg-black p-4 font-mono">
		<NestedShell slug={selectedProject.slug} on:close={() => dispatch("close")} />
	</div>
	<div class="bg-card text-card-foreground relative w-1/2 overflow-auto p-6">
		<button
			class="text-destructive-foreground hover:text-destructive absolute top-4 right-4 text-2xl"
			onclick={() => dispatch("close")}
		>
			×
		</button>
		<h2 class="mb-4 text-3xl font-extralight">{selectedProject.title}</h2>
		<p class="font-light">{selectedProject.description}</p>
	</div>
</div>
