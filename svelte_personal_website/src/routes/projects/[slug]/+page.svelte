<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import './+page.css';
	
	let { data }: { data: PageData } = $props();
	const { project } = data;
</script>

<svelte:head>
	<title>{project.title} - Brian Kelleher</title>
	<meta name="description" content={project.description} />
</svelte:head>

<div class="min-h-[calc(100vh-5rem)] px-4 py-20">
	<div class="max-w-4xl mx-auto">
		<div in:fade={{ duration: 1000 }}>
			<a 
				href="/projects" 
				class="inline-block text-sm uppercase tracking-[0.2em] font-light text-muted-foreground 
					   hover:text-foreground transition-colors duration-500 mb-12"
			>
				← Back to Projects
			</a>

			<header class="mb-20">
				<div class="flex justify-between items-start mb-6">
					<h1 class="text-4xl font-extralight">{project.title}</h1>
					{#if project.date}
						<p class="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light">
							{project.date}
						</p>
					{/if}
				</div>
				
				<p class="text-lg font-light text-muted-foreground mb-8">
					{project.description}
				</p>

				<div class="flex flex-wrap gap-6 text-sm">
					{#if project.link}
						<a 
							href={project.link} 
							target="_blank" 
							rel="noopener noreferrer"
							class="uppercase tracking-[0.2em] font-light text-foreground/60 
								   hover:text-foreground transition-colors duration-500"
						>
							Live Site →
						</a>
					{/if}
					
					{#if project.github}
						<a 
							href={project.github} 
							target="_blank" 
							rel="noopener noreferrer"
							class="uppercase tracking-[0.2em] font-light text-foreground/60 
								   hover:text-foreground transition-colors duration-500"
						>
							Source Code →
						</a>
					{/if}
				</div>
			</header>

			{#if project.renderedLongDescription}
				<section class="mb-20 prose prose-invert max-w-none">
					<div class="markdown-content">{@html project.renderedLongDescription}</div>
				</section>
			{/if}

			<section class="mb-20">
				<h2 class="text-sm uppercase tracking-[0.2em] font-light text-muted-foreground mb-8">
					Technologies
				</h2>
				<div class="flex flex-wrap gap-4">
					{#each project.technologies as tech}
						<span class="px-6 py-3 border border-foreground/20 text-sm font-light">
							{tech}
						</span>
					{/each}
				</div>
			</section>

			<nav class="pt-12 border-t border-foreground/10">
				<a 
					href="/projects"
					class="group inline-flex items-center gap-4 text-sm uppercase tracking-[0.2em] font-light
						   hover:text-foreground/80 transition-colors duration-500"
				>
					<span>← View All Projects</span>
				</a>
			</nav>
		</div>
	</div>
</div>