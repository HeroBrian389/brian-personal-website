<script lang="ts">
	import { page } from "$app/stores";
	import { fade } from "svelte/transition";
</script>

<div class="flex h-[calc(100vh-5rem)] items-center justify-center text-center">
	<div class="mx-auto max-w-2xl px-8">
		<div in:fade={{ duration: 2000, delay: 300 }}>
			<h1 class="text-foreground/10 mb-8 text-9xl font-extralight">
				{$page.status}
			</h1>

			{#if $page.status === 404}
				<h2 class="mb-4 text-2xl font-light">This page seems to be missing.</h2>
				<p class="text-muted-foreground text-lg font-light">
					Not to worry. Feel free to rest here a moment. Time moves differently in this
					space.
				</p>
			{:else}
				<h2 class="mb-4 text-2xl font-light">There was a flicker in the connection.</h2>
				<p class="text-muted-foreground text-lg font-light">
					These things happen. Take a slow breath while we sort it out. The issue has been
					noted.
				</p>
			{/if}

			<div class="mt-12">
				<a
					href="/"
					class="text-foreground/60 hover:text-foreground text-sm font-light tracking-[0.2em] uppercase transition-colors duration-500"
				>
					Return to the path
				</a>
			</div>
		</div>
	</div>
</div>
