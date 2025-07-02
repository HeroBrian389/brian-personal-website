<script lang="ts">
	import { mode, toggleMode } from "mode-watcher";
	import { Sun, Moon } from "phosphor-svelte";

	let currentMode = $derived(mode.current);
</script>

<div class="fixed bottom-8 left-8 z-50">
	<button
		class="group bg-background border-foreground/10 hover:border-foreground/30 relative rounded-full border p-3 transition-all duration-500"
		onclick={toggleMode}
		aria-label="Toggle light or dark mode"
	>
		<span class="relative z-10 block flex h-4 w-4 items-center justify-center">
			{#if currentMode === "dark"}
				<Sun class="h-4 w-4" />
			{:else}
				<Moon class="h-4 w-4" />
			{/if}
		</span>
		<div
			class="bg-foreground/5 absolute inset-0 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100"
		></div>
	</button>
</div>
