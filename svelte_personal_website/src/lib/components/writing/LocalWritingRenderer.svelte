<script lang="ts">
	import type { LocalWritingPost } from "$lib/content/writing/local-posts";
	import { Progress } from "$lib/components/ui/progress";

	let { post }: { post: LocalWritingPost } = $props();

	let scrollProgress = $state(0);
	let currentSection = $state("");

	function updateProgress() {
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight - windowHeight;
		const scrollTop = window.scrollY;

		scrollProgress = documentHeight <= 0 ? 0 : Math.min(100, (scrollTop / documentHeight) * 100);

		const headings = document.querySelectorAll("h1, h2, h3");
		let current = "";

		headings.forEach((heading) => {
			const rect = heading.getBoundingClientRect();
			if (rect.top <= 100) {
				current = heading.textContent || "";
			}
		});

		currentSection = current;
	}

	$effect(() => {
		updateProgress();
		window.addEventListener("scroll", updateProgress);
		return () => window.removeEventListener("scroll", updateProgress);
	});

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	}
</script>

<article class="notion-page">
	<div class="bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm">
		<Progress value={scrollProgress} class="h-1" />
		{#if currentSection}
			<div class="text-muted-foreground px-4 py-2 text-sm">Reading: {currentSection}</div>
		{/if}
	</div>

	<header class="mb-20 pt-16">
		<h1 class="mb-8 text-4xl font-extralight md:text-5xl">{post.title}</h1>
		<div class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase">
			<p>{formatDate(post.publishedAt)}</p>
		</div>
	</header>

	<div class="prose prose-lg dark:prose-invert prose-headings:font-normal prose-p:font-light prose-strong:font-normal max-w-none">
		{#each post.body as block}
			{#if block.type === "paragraph"}
				<p>{block.text}</p>
			{:else if block.type === "image"}
				<figure class="notion-image">
					<img src={block.src} alt={block.alt} loading="lazy" />
					{#if block.caption}
						<figcaption>{block.caption}</figcaption>
					{/if}
				</figure>
			{/if}
		{/each}
	</div>

	<footer class="border-foreground/10 mt-20 border-t pt-8">
		<div class="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase">
			<p>Published {formatDate(post.publishedAt)}</p>
		</div>
	</footer>
</article>

<style>
	:global(.prose) {
		--tw-prose-body: hsl(var(--foreground));
		--tw-prose-headings: hsl(var(--foreground));
		--tw-prose-links: hsl(var(--primary));
		--tw-prose-bold: hsl(var(--foreground));
		--tw-prose-counters: hsl(var(--muted-foreground));
		--tw-prose-bullets: hsl(var(--muted-foreground));
		--tw-prose-hr: hsl(var(--border));
		--tw-prose-quotes: hsl(var(--foreground));
		--tw-prose-quote-borders: hsl(var(--primary));
		--tw-prose-code: hsl(var(--foreground));
		--tw-prose-pre-code: hsl(var(--foreground));
		--tw-prose-pre-bg: hsl(var(--muted));
	}

	.notion-page {
		animation: fadeIn 1s ease-in-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.notion-image {
		margin: 2.5rem 0;
	}

	.notion-image img {
		width: 100%;
		border-radius: var(--radius, 0px);
		border: 1px solid hsl(var(--border));
		object-fit: cover;
	}

	.notion-image figcaption {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: hsl(var(--muted-foreground));
	}
</style>
