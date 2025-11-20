<script lang="ts">
	import TalkDetail from "$lib/components/talk-detail.svelte";
	import type { PageData } from "./$types";

	let { data } = $props<{ data: PageData }>();
	const { talk } = data;

	const pageTitle = $derived(`${talk.title} - Talks - Brian Kelleher`);
	const metaDescription = $derived(
		talk.description
			? talk.description.length > 160
				? `${talk.description.slice(0, 157)}…`
				: talk.description
			: `Details for ${talk.title} by Brian Kelleher`
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={metaDescription} />
	<link rel="canonical" href={`/talks/${talk.slug}`} />
</svelte:head>

<div class="bg-background min-h-screen">
	<div class="container mx-auto max-w-4xl px-4 pb-20">
		<div class="pt-12 pb-4">
			<a
				href="/talks"
				class="text-muted-foreground hover:text-foreground/80 text-xs font-light tracking-[0.2em] uppercase transition-colors duration-500"
			>
				← All Talks
			</a>
		</div>

		<TalkDetail {talk} />
	</div>
</div>
