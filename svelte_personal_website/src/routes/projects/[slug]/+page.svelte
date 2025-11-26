<script lang="ts">
	import { fade } from "svelte/transition";
	import type { PageData } from "./$types";
	import "./+page.css";
	import { onMount } from "svelte";

	let { data }: { data: PageData } = $props();
	const { project } = data;

	$effect(() => {
		console.log("[+page.svelte] Project data received:", {
			title: project.title,
			slug: project.slug,
			hasRenderedLongDescription: !!project.renderedLongDescription,
			renderedLongDescriptionLength: project.renderedLongDescription?.length || 0,
			renderedLongDescriptionPreview: project.renderedLongDescription?.substring(0, 100)
		});
	});

	onMount(() => {
		console.log("[+page.svelte] Component mounted with project:", project.title);
		console.log("[+page.svelte] Full project object:", project);
	});
</script>

<svelte:head>
	<title>{project.title} - Brian Kelleher</title>
	<meta name="description" content={project.description} />
</svelte:head>

<div class="min-h-[calc(100vh-5rem)] px-4 py-20">
	<div class="mx-auto max-w-4xl">
		<div in:fade={{ duration: 1000 }}>
			<a
				href="/projects"
				class="text-muted-foreground hover:text-foreground mb-12 inline-block text-sm font-light
					   tracking-[0.2em] uppercase transition-colors duration-500"
			>
				← Back to Projects
			</a>

			<header class="mb-20">
				<div class="mb-6 space-y-4">
					<h1 class="text-4xl font-extralight leading-tight">{project.title}</h1>
					{#if project.date}
						<p
							class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase"
						>
							{project.date}
						</p>
					{/if}
				</div>

				<p class="text-muted-foreground mb-8 text-lg font-light">
					{project.description}
				</p>

				<div class="flex flex-wrap gap-6 text-sm">
					{#if project.link}
						<a
							href={project.link}
							target="_blank"
							rel="noopener noreferrer"
							class="text-foreground/60 hover:text-foreground font-light tracking-[0.2em]
								   uppercase transition-colors duration-500"
						>
							Live Site →
						</a>
					{/if}

					{#if project.github}
						<a
							href={project.github}
							target="_blank"
							rel="noopener noreferrer"
							class="text-foreground/60 hover:text-foreground font-light tracking-[0.2em]
								   uppercase transition-colors duration-500"
						>
							Source Code →
						</a>
					{/if}
				</div>
			</header>

			{#if project.renderedLongDescription}
				<section class="prose prose-invert mb-20 max-w-none">
					<div class="markdown-content">{@html project.renderedLongDescription}</div>
				</section>
			{/if}

			<section class="mb-20">
				<h2
					class="text-muted-foreground mb-8 text-sm font-light tracking-[0.2em] uppercase"
				>
					Technologies
				</h2>
				<div class="flex flex-wrap gap-4">
					{#each project.technologies as tech}
						<span class="border-foreground/20 border px-6 py-3 text-sm font-light">
							{tech}
						</span>
					{/each}
				</div>
			</section>

			<nav class="border-foreground/10 border-t pt-12">
				<a
					href="/projects"
					class="group hover:text-foreground/80 inline-flex items-center gap-4 text-sm font-light tracking-[0.2em]
						   uppercase transition-colors duration-500"
				>
					<span>← View All Projects</span>
				</a>
			</nav>
		</div>
	</div>
</div>
