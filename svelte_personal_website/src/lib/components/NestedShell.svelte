<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

	// Receive the project slug
	let { slug } = $props<{ slug: string }>();
	const dispatch = createEventDispatcher<{ close: void }>();

	let history = $state<string[]>([]);
	let input = $state<string>("");
	let container: HTMLDivElement;
	let inputEl: HTMLInputElement;

	function runCommand() {
		const cmd = input.trim();
		if (cmd === `kill ${slug}`) {
			dispatch("close");
		} else {
			history = [...history, `Unknown command: ${cmd}`];
		}
		input = "";
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === "Enter") {
			runCommand();
		}
	}

	$effect(() => {
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	});

	onMount(() => {
		inputEl?.focus();
	});
</script>

<div class="bg-background text-foreground flex h-full w-full flex-col p-4 font-mono">
	<div bind:this={container} class="mb-2 flex-1 space-y-1 overflow-y-auto">
		{#each history as line}
			<div>{line}</div>
		{/each}
	</div>
	<div class="flex items-center">
		<span class="mr-2">$</span>
		<input
			bind:this={inputEl}
			class="placeholder-foreground/50 flex-1 bg-transparent outline-none"
			placeholder={`Type "kill ${slug}" to close`}
			bind:value={input}
			onkeydown={onKey}
		/>
	</div>
</div>
