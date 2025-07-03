<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

<div class="flex h-[calc(100vh-5rem)] items-center justify-center">
	<div class="mx-auto max-w-4xl px-8 text-center">
		{#if visible}
			<div in:fade={{ duration: 2000, delay: 300 }}>
				<h1 class="mb-8 text-4xl leading-relaxed font-extralight">Welcome</h1>

				<div class="text-muted-foreground space-y-6 text-lg font-light">
					<p in:fade={{ duration: 1500, delay: 800 }}>
						I'm Brian. I build things.
					</p>

					<p in:fade={{ duration: 1500, delay: 1300 }}>
						Feel free to explore a bit.
					</p>
				</div>

				<div
					class="via-foreground/20 mt-20 h-px bg-gradient-to-r from-transparent to-transparent"
					in:fade={{ duration: 2000, delay: 3000 }}
				></div>
			</div>
		{/if}
	</div>
</div>
