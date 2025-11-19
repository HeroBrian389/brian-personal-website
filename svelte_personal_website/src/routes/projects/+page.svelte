<script lang="ts">
	import { fade } from 'svelte/transition';
	import CodeSnippetHighlighted from '$lib/components/CodeSnippetHighlighted.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { projects } = data;
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
				A selection of technical projects and experiments.
			</p>
		</header>


		<div class="space-y-8">
			{#each projects as project, i}
				<article 
					class="group py-8 border-b border-foreground/10 last:border-0"
					in:fade={{ duration: 1000, delay: i * 100 }}
				>
					<a href="/projects/{project.slug}" class="block">
						<div class="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
							<div>
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
									
									<div class="ml-auto">
										<span class="text-sm font-light text-foreground/40 group-hover:text-foreground/60 transition-colors duration-500">
											View Details →
										</span>
									</div>
								</div>
							</div>
							
							{#if project.codeSnippet && project.codeSnippet.code}
								<div class="lg:mt-8">
									<CodeSnippetHighlighted code={project.codeSnippet.code} language={project.codeSnippet.language} />
								</div>
							{/if}
						</div>
					</a>
				</article>
			{/each}
		</div>
	</div>
</div>