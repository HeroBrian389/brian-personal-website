<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	
	let visible = false;
	
	onMount(() => {
		visible = true;
	});
</script>

<div class="h-[calc(100vh-5rem)] flex items-center justify-center">
	<div class="max-w-4xl mx-auto px-8 text-center">
		{#if visible}
			<div in:fade={{ duration: 2000, delay: 300 }}>
				<h1 class="text-4xl font-extralight mb-8 leading-relaxed">
					Welcome, wanderer
				</h1>
				
				<div class="space-y-6 text-lg font-light text-muted-foreground">
					<p in:fade={{ duration: 1500, delay: 800 }}>
						Feel free to come in and stay a while
					</p>
					
					<p in:fade={{ duration: 1500, delay: 1300 }}>
						Breathe slower. Notice the trees swaying
					</p>
					
					<p in:fade={{ duration: 1500, delay: 1800 }}>
						Time moves differently here
					</p>
					
					<p in:fade={{ duration: 1500, delay: 2300 }}>
						Come back whenever you need to forget
					</p>
				</div>
				
				<div 
					class="mt-20 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
					in:fade={{ duration: 2000, delay: 3000 }}
				></div>
			</div>
		{/if}
	</div>
</div>
