<script lang="ts">
	import PageRenderer from "$lib/components/notion/PageRenderer.svelte";
	import LocalWritingRenderer from "$lib/components/writing/LocalWritingRenderer.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let writingPage = $derived(data.writingPage);
	let localPost = $derived(data.localPost);
	let error = $derived(data.error);

	function localDescription() {
		if (!localPost) return "";
		return (
			localPost.summary ||
			localPost.body.find((block) => block.type === "paragraph")?.text.slice(0, 160) ||
			localPost.title
		);
	}
</script>

<svelte:head>
	{#if writingPage}
		<title>{writingPage.title} - Brian Kelleher</title>
		<meta name="description" content="{writingPage.title} by Brian Kelleher" />
		<meta property="og:title" content="{writingPage.title} - Brian Kelleher" />
		<meta property="og:description" content="{writingPage.title} by Brian Kelleher" />
		<meta property="og:type" content="article" />
		<meta property="article:author" content="Brian Kelleher" />
		<meta
			property="article:published_time"
			content={new Date(writingPage.metadata.createdTime).toISOString()}
		/>
		<meta
			property="article:modified_time"
			content={new Date(writingPage.metadata.lastEditedTime).toISOString()}
		/>
	{:else if localPost}
		<title>{localPost.title} - Brian Kelleher</title>
		<meta name="description" content={localDescription()} />
		<meta property="og:title" content="{localPost.title} - Brian Kelleher" />
		<meta property="og:description" content={localDescription()} />
		<meta property="og:type" content="article" />
		<meta property="article:author" content="Brian Kelleher" />
		<meta property="article:published_time" content={localPost.publishedAt} />
		{#if localPost.heroImage}
			<meta
				property="og:image"
				content={`https://briankelleher.ie${localPost.heroImage.src}`}
			/>
			<meta property="og:image:alt" content={localPost.heroImage.alt} />
		{/if}
	{:else}
		<title>Writing - Brian Kelleher</title>
	{/if}
</svelte:head>

<div class="container mx-auto max-w-3xl px-6 py-20">
	<nav class="mb-2">
		<a
			href="/writing"
			class="text-muted-foreground hover:text-foreground text-sm font-light tracking-[0.2em] uppercase transition-colors duration-300"
		>
			← Writing
		</a>
	</nav>

	{#if error}
		<div class="border-foreground/10 border-b py-8">
			<h2 class="mb-4 text-2xl font-extralight">Error</h2>
			<p class="text-muted-foreground mb-8 font-light">{error}</p>
			<a
				href="/writing"
				class="text-muted-foreground hover:text-foreground text-sm font-light tracking-[0.2em] uppercase transition-colors duration-300"
			>
				Return to Writing
			</a>
		</div>
	{:else if writingPage}
		<PageRenderer page={writingPage} />
	{:else if localPost}
		<LocalWritingRenderer post={localPost} />
	{:else}
		<div class="border-foreground/10 border-b py-8">
			<h2 class="mb-4 text-2xl font-extralight">Missing</h2>
			<p class="text-muted-foreground mb-8 font-light">Post not found.</p>
			<a
				href="/writing"
				class="text-muted-foreground hover:text-foreground text-sm font-light tracking-[0.2em] uppercase transition-colors duration-300"
			>
				Return to Writing
			</a>
		</div>
	{/if}
</div>
