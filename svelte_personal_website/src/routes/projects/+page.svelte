<script lang="ts">
	import { projects } from '$lib/data/projects';
	import { fade } from 'svelte/transition';

	let filter = $state<'all' | 'completed' | 'in-progress'>('all');
	
	let filteredProjects = $derived(
		filter === 'all' 
			? projects 
			: projects.filter(p => p.status === filter)
	);
</script>

<svelte:head>
	<title>Projects - Brian Kelleher</title>
	<meta name="description" content="A collection of my technical projects and experiments" />
</svelte:head>

<div class="min-h-[calc(100vh-5rem)] px-4 py-20">
	<div class="max-w-6xl mx-auto">
		<header class="mb-20">
			<h1 class="text-4xl font-extralight mb-6">Projects</h1>
			<p class="text-lg font-light text-muted-foreground max-w-3xl">
				A selection of technical projects and experiments. Each represents a journey of learning and creation.
			</p>
		</header>

		<div class="mb-12">
			<div class="flex gap-6">
				<button
					onclick={() => filter = 'all'}
					class="text-sm uppercase tracking-[0.2em] font-light pb-2 border-b transition-colors duration-500
						{filter === 'all' ? 'border-foreground/40' : 'border-transparent hover:border-foreground/20'}"
				>
					All
				</button>
				<button
					onclick={() => filter = 'completed'}
					class="text-sm uppercase tracking-[0.2em] font-light pb-2 border-b transition-colors duration-500
						{filter === 'completed' ? 'border-foreground/40' : 'border-transparent hover:border-foreground/20'}"
				>
					Completed
				</button>
				<button
					onclick={() => filter = 'in-progress'}
					class="text-sm uppercase tracking-[0.2em] font-light pb-2 border-b transition-colors duration-500
						{filter === 'in-progress' ? 'border-foreground/40' : 'border-transparent hover:border-foreground/20'}"
				>
					In Progress
				</button>
			</div>
		</div>

		<div class="space-y-8">
			{#each filteredProjects as project, i}
				<article 
					class="group py-8 border-b border-foreground/10 last:border-0"
					in:fade={{ duration: 1000, delay: i * 100 }}
				>
					<a href="/projects/{project.slug}" class="block">
						<div class="flex justify-between items-start mb-4">
							<h2 class="text-2xl font-extralight group-hover:text-foreground/80 transition-colors duration-500">
								{project.title}
							</h2>
							<p class="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light">
								{project.date}
							</p>
						</div>
						
						<p class="text-base font-light text-muted-foreground mb-6 max-w-3xl">
							{project.description}
						</p>

						<div class="flex flex-wrap gap-4 items-center">
							<div class="flex flex-wrap gap-3">
								{#each project.technologies as tech}
									<span class="text-xs uppercase tracking-[0.15em] font-light text-foreground/60">
										{tech}
									</span>
								{/each}
							</div>
							
							<div class="ml-auto flex items-center gap-6">
								{#if project.status === 'in-progress'}
									<span class="text-xs uppercase tracking-[0.2em] font-light text-foreground/40">
										In Progress
									</span>
								{/if}
								
								<span class="text-sm font-light text-foreground/40 group-hover:text-foreground/60 transition-colors duration-500">
									View Details →
								</span>
							</div>
						</div>
					</a>
				</article>
			{/each}
		</div>
	</div>
</div>