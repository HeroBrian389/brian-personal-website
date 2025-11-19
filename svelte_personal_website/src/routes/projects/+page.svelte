<script lang="ts">
	import { fade } from "svelte/transition";
	import CodeSnippetHighlighted from "$lib/components/CodeSnippetHighlighted.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	const { projects } = data;
</script>

<svelte:head>
	<title>Projects - Brian Kelleher</title>
	<meta name="description" content="A collection of my technical projects and experiments" />
</svelte:head>

<div class="min-h-[calc(100vh-5rem)] px-4 py-20">
	<div class="mx-auto max-w-6xl">
		<header class="mb-20">
			<h1 class="mb-6 text-4xl font-extralight">Projects</h1>
			<p class="text-muted-foreground max-w-3xl text-lg font-light">
				A selection of technical projects and experiments.
			</p>
		</header>

		<div class="space-y-8">
			{#each projects as project, i}
				<article
					class="group border-foreground/10 border-b py-8 last:border-0"
					in:fade={{ duration: 1000, delay: i * 100 }}
				>
					<a href="/projects/{project.slug}" class="block">
						<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,320px]">
							<div>
								<div class="mb-4 flex items-start justify-between">
									<h2
										class="group-hover:text-foreground/80 text-2xl font-extralight transition-colors duration-500"
									>
										{project.title}
									</h2>
									<p
										class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase"
									>
										{project.date}
									</p>
								</div>

								<p
									class="text-muted-foreground mb-6 max-w-3xl text-base font-light"
								>
									{project.description}
								</p>

								<div class="flex flex-wrap items-center gap-4">
									<div class="flex flex-wrap gap-3">
										{#each project.technologies as tech}
											<span
												class="text-foreground/60 text-xs font-light tracking-[0.15em] uppercase"
											>
												{tech}
											</span>
										{/each}
									</div>

									<div class="ml-auto">
										<span
											class="text-foreground/40 group-hover:text-foreground/60 text-sm font-light transition-colors duration-500"
										>
											View Details →
										</span>
									</div>
								</div>
							</div>

							{#if project.codeSnippet && project.codeSnippet.code}
								<div class="lg:mt-8">
									<CodeSnippetHighlighted
										code={project.codeSnippet.code}
										language={project.codeSnippet.language}
									/>
								</div>
							{/if}
						</div>
					</a>
				</article>
			{/each}
		</div>
	</div>
</div>
