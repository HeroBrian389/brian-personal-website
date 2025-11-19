<script lang="ts">
	const sections = [
		{
			label: "Edge City Fellows",
			title: "Building systems in Patagonia",
			body: [
				"I’m Brian Kelleher, one of the Edge City Fellows in Patagonia. At heart I’m a technologist and entrepreneur. When I was twelve, I built a movie streaming website so I could watch films in school, then trained machine learning models that predicted house prices. Patch, a young person accelerator, introduced me to entrepreneurship and from that launch pad I founded Microdoc, where we use AI to automate paperwork for doctors and hospitals.",
				"Technology is only half of the story. I studied mathematics and economics in college, living inside proofs, theorems, and lemmas. ChatGPT debuted at the start of my degree, so I watched academia and AI evolve together in real time. It was obvious that AI would change how we push back the frontier of knowledge—sometimes in predictable ways and sometimes in ways that still surprise me."
			]
		},
		{
			label: "Applied Research",
			title: "A four-stage AI proving pipeline",
			body: [
				"My background in mathematics and AI pushed me to design systems that might accelerate mathematical research. During Edge I set out to use AI to prove a novel result. I zeroed in on the Erdős problems, a legendary list of conjectures from Paul Erdős. To make progress I built a four-stage AI pipeline that looped through literature review, tractability assessment, approach analysis, and a proving framework.",
				"The system examined hundreds of problems before selecting the one it considered tractable. From there it worked autonomously for days—proving, reviewing, and iterating until it believed it held a solution. I orchestrated several model specialisations: GPT-5-pro, GPT-5 Thinking High, and GPT-5 Codex. Each owned a role in a recursive exploration of the textual search space.",
				"By the end of the sprint the system produced an approach it believes resolves Erdős’s Problem 1. Over the coming weeks I’ll work with advisors, mathematicians, and professors to validate the proof rigorously and prepare it for peer review."
			]
		},
		{
			label: "Life at Edge",
			title: "Focused work, wild interludes",
			body: [
				"Edge was a chance for deep, uninterrupted work, but it was also a license to experiment. I tried Gnosis Meditation, hiked most days, and chatted through the night in the sauna. I crossed into Chile illegally on a weekend trip and sprinted back when border control made their displeasure obvious. Mornings meant avocado toast at Forastera, surrounded by a colony of caffeinated Edge City goers.",
				"Edge is special because experimentation is the norm. You can host volleyball tournaments, run neuroscience studies, or dream up divination rituals. The program becomes whatever you build."
			]
		},
		{
			label: "Looking back",
			title: "What I’m taking with me",
			body: [
				"As the month closes, I’m reflecting on the work I shipped, the risks I took, and the people I met. There were stimulating conversations, long hours inside the proofs, and unexpected exploration. I learned from impressive technologists, thinkers, and builders, but the thread I’ll miss most is everyone’s kindness. When we scatter back to ordinary lives I hope to carry a piece of Edge with me—and leave a piece of me behind."
			]
		}
	];

	const pipelineStages = [
		{
			name: "Literature Review",
			description: "Autonomously scrape, cluster, and annotate prior work related to each Erdős conjecture."
		},
		{
			name: "Tractability Assessment",
			description: "Score every candidate problem across dimensionality, combinatorial explosion risk, and proof surface availability."
		},
		{
			name: "Approach Analysis",
			description: "Spin up specialised research agents that simulate proof strategies and critique one another."
		},
		{
			name: "Proving Framework",
			description: "Lock the high-confidence path into a recursive proving loop with verification and repair hooks."
		}
	];

	const photos = [
		{
			src: "/writing/edge-city/edge-city-01.jpeg",
			alt: "Edge City Fellows at Lago Lácar",
			caption: "Laguna view runs with the cohort"
		},
		{
			src: "/writing/edge-city/edge-city-02.jpg",
			alt: "Brian standing by a waterfall in Patagonia",
			caption: "Waterfall scouting between proof sessions"
		},
		{
			src: "/writing/edge-city/edge-city-03.jpg",
			alt: "Nightlife scene in San Martín de los Andes",
			caption: "Edge DJs keep the after-hours experiments alive"
		},
		{
			src: "/writing/edge-city/edge-city-04.jpg",
			alt: "Red walkways at the termas",
			caption: "Termas geométricas reset after long days"
		},
		{
			src: "/writing/edge-city/edge-city-05.jpg",
			alt: "Volcán Lanín at sunset",
			caption: "Lanín reminding us to keep climbing"
		}
	];

	let currentPhoto = $state(0);
	let activePhoto = $derived(photos[currentPhoto] ?? photos[0]);

	$effect(() => {
		const interval = setInterval(() => {
			currentPhoto = (currentPhoto + 1) % photos.length;
		}, 10000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Edge City Fellows, Patagonia - Brian Kelleher</title>
	<meta
		name="description"
		content="Dispatches from Edge City Patagonia: building AI proof systems, fellowships, and the humans who made it feel like home."
	/>
</svelte:head>

<div class="bg-background text-foreground">
	<article class="mx-auto max-w-4xl px-6 py-20 space-y-20">
		<header class="space-y-6">
			<p class="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light">
				Edge City Fellows · Patagonia, Argentina · November 19, 2025
			</p>
			<h1 class="text-4xl font-extralight leading-tight">
				Edge City was a lab for difficult work, deliberate living, and occasionally outrunning border
				patrol.
			</h1>
			<p class="text-muted-foreground text-lg font-light">
				This is a field note from a month of proofs, orchestration systems, thermal baths, meditation
				sessions, and the kindest technologists I know.
			</p>
		</header>

		<section class="space-y-12">
			{#each sections as section}
				<div class="border-b border-foreground/10 pb-12">
					<p class="text-xs uppercase tracking-[0.3em] text-muted-foreground/80 font-light mb-4">
						{section.label}
					</p>
					<h2 class="text-2xl font-extralight mb-6">{section.title}</h2>
					{#each section.body as paragraph}
						<p class="text-lg leading-relaxed font-light text-muted-foreground mb-6">
							{paragraph}
						</p>
					{/each}
				</div>
			{/each}
		</section>

		<section class="border-b border-foreground/10 pb-12">
			<p class="text-xs uppercase tracking-[0.3em] text-muted-foreground/80 font-light mb-4">
				Pipeline
			</p>
			<h2 class="text-2xl font-extralight mb-8">How the AI proof stack works</h2>
			<div class="space-y-6">
				{#each pipelineStages as stage, index}
					<div class="flex flex-col gap-2">
						<p class="text-sm uppercase tracking-[0.25em] text-muted-foreground font-light">
							{index + 1}. {stage.name}
						</p>
						<p class="text-base font-light text-muted-foreground/90">
							{stage.description}
						</p>
					</div>
				{/each}
			</div>
		</section>

		<section>
			<p class="text-xs uppercase tracking-[0.3em] text-muted-foreground/80 font-light mb-4">
				Scenes
			</p>
			<div class="grid gap-8">
				<div class="border border-foreground/10 p-6">
					<p class="text-sm uppercase tracking-[0.3em] text-muted-foreground font-light mb-4">
						Auto-advancing gallery · 10s cadence
					</p>
					<div class="relative overflow-hidden">
						{#each photos as photo, index}
							<img
								src={photo.src}
								alt={photo.alt}
								class={`${index === currentPhoto ? "opacity-100" : "opacity-0"} absolute inset-0 h-[28rem] w-full object-cover transition-opacity duration-[1000ms]`}
								aria-hidden={index === currentPhoto ? "false" : "true"}
								loading={index === 0 ? "eager" : "lazy"}
							/>
						{/each}
						<div class="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
						<div class="relative z-10 mt-[22rem]">
							{#if activePhoto}
								<p class="text-xs uppercase tracking-[0.3em] text-muted-foreground font-light">
									{activePhoto.caption}
								</p>
							{/if}
						</div>
					</div>
				</div>

				<div class="grid gap-6 border border-foreground/10 p-6">
					{#each photos as photo}
						<figure class="border-b border-foreground/10 pb-6 last:border-0 last:pb-0">
							<img
								src={photo.src}
								alt={photo.alt}
								loading="lazy"
								class="mb-4 h-64 w-full object-cover"
							/>
							<figcaption class="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light">
								{photo.caption}
							</figcaption>
						</figure>
					{/each}
				</div>
			</div>
		</section>
	</article>
</div>
