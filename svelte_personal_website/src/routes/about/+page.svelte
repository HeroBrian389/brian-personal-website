<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let age = $state(19);
	let yearsOfCoding = $state(8);
	let githubCommits = $state(0);

	// Calculate dynamic values
	onMount(() => {

		// Update age dynamically
		const birthYear = 2004; // Approximate based on being 19 in 2023
		const currentYear = new Date().getFullYear();
		age = currentYear - birthYear;

		// Update years of coding
		yearsOfCoding = age - 11;

		// Fetch GitHub contributions
		fetchGithubContributions();
	});

	async function fetchGithubContributions() {
		try {
			const response = await fetch("/api/github-contributions");
			const data = await response.json();

			if (data.success && data.contributions) {
				// Animate counter for GitHub commits
				const targetCommits = data.contributions;
				const duration = 2000;
				const steps = 50;
				const increment = targetCommits / steps;
				const stepDuration = duration / steps;

				const interval = setInterval(() => {
					if (githubCommits < targetCommits) {
						githubCommits = Math.min(githubCommits + increment, targetCommits);
					} else {
						githubCommits = targetCommits;
						clearInterval(interval);
					}
				}, stepDuration);
			} else {
				// Fallback value
				githubCommits = 2400;
			}
		} catch (error) {
			console.error("Error fetching GitHub contributions:", error);
			githubCommits = 2400;
		} finally {
			// GitHub loading complete
		}
	}

	// Timeline data
	const timeline = [
		{ year: 2015, age: 11, event: "Started building software" },
		{ year: 2017, age: 13, event: "Built 4x4x4 LED Cube" },
		{ year: 2020, age: 16, event: "Patch Accelerator participant" },
		{ year: 2022, age: 18, event: "Naughton Scholar, Founded MicroDoc" },
		{ year: 2023, age: 19, event: "Ireland's 30 Under 30 (youngest)" },
		{ year: 2024, age: 20, event: "Student Entrepreneur of the Year" }
	];


	// Side quests data
	const sideQuests = [
		{
			title: "4x4x4 LED Cube",
			description:
				"Built a programmable 64-LED cube at age 13 (2017). Hand-soldered 64 LEDs into a 3D matrix, programmed custom animations and patterns using Arduino. This early hardware project sparked my passion for bringing code into the physical world.",
			imageUrl: "/led-cube-2017.jpg",
			type: "project"
		},
		{
			title: "Claire de Lune Performance",
			description: "Performed at the annual Belvedere Musical Evening",
			videoId: "xntOJHojY84",
			type: "performance"
		},
		{
			title: "This House Supports the Freedom to Offend",
			description: "Phil chamber debate - October 20th, 2022",
			videoId: "In-LMDVmrew",
			links: [{ text: "Full Debate", url: "https://youtu.be/GyffYddSbQM" }],
			type: "debate"
		},
		{
			title: "Leinster Senior Schools Debating Win",
			description: "Champion debater at Leinster Schools competition",
			imageUrl: "/leinster-schools-win.jpg",
			type: "achievement"
		}
	];

	// Awards data
	const awards = [
		{
			title: "Student Entrepreneur of the Year",
			description: "Trinity Innovation Awards",
			link: "https://www.linkedin.com/posts/briankelleher0_i-was-delighted-to-receive-the-student-entrepreneur-activity-7266472974382247936-3E-x",
			year: 2024
		},
		{
			title: "Student Entrepreneur Awards - 2nd Place",
			description: "Enterprise Ireland",
			year: 2024
		},
		{
			title: "Business Post 30 Under 30",
			description: "Youngest recipient",
			link: "https://www.linkedin.com/posts/briankelleher0_30-under-30-the-next-generation-of-high-activity-7134607196553662466-np5S",
			year: 2023
		},
		{
			title: "Irish Times 50 to Watch",
			description: "Featured for 2024",
			link: "https://www.irishtimes.com/life-style/people/2024/01/06/50-people-to-watch-in-2024-from-film-and-music-to-arts-activism-and-more/",
			year: 2024
		},
		{
			title: "Young Innovator of the Year Finalist",
			description: "All-Ireland Business Foundation",
			link: "https://www.linkedin.com/posts/briankelleher0_honoured-to-be-named-as-a-young-innovator-activity-7207441692965097473-_Xc0",
			year: 2024
		},
		{
			title: "Smart Health Summit Speaker",
			description: "AI in Healthcare talk at Croke Park",
			link: "https://www.linkedin.com/posts/briankelleher0_im-delighted-to-be-speaking-at-the-smart-activity-7233145929074196480-OYo5",
			year: 2024
		},
		{
			title: "Hack Ireland Winner",
			description: "1st Place - €6,000 prize for 'Little Blue Booth' AI doctor",
			link: "https://www.linkedin.com/posts/briankelleher0_i-was-delighted-to-win-1st-place-6k-prize-activity-7300200983983194112-Hqg_",
			year: 2024
		},
		{
			title: "Entrepreneur First Builder Retreat",
			description: "English countryside retreat",
			link: "https://www.linkedin.com/posts/briankelleher0_i-spent-the-last-weekend-in-the-english-countryside-activity-7322948621589471235-OtlV",
			year: 2024
		},
		{
			title: "Naughton Scholar",
			description: "€20,000 scholarship",
			link: "https://dublinpeople.com/news/dublin/articles/2022/10/27/two-dublin-secondary-school-students-awarded-e20000-scholarships/",
			year: 2022
		},
		{
			title: "Emergent Ventures",
			description: "22nd cohort",
			link: "https://marginalrevolution.com/marginalrevolution/2022/10/emergent-ventures-22nd-cohort.html",
			year: 2022
		},
		{
			title: "BT Young Scientist",
			description: "Special Award & Highly Commended",
			year: null
		}
	];
</script>

<svelte:head>
	<title>About - Brian Kelleher</title>
	<meta
		name="description"
		content="19-year-old founder of MicroDoc, Trinity student, and Ireland's youngest 30 Under 30 recipient"
	/>
</svelte:head>

<div class="bg-background min-h-screen">
	<div class="container mx-auto max-w-4xl px-4">
		<!-- Hero Section - Full viewport -->
		<section
			class="flex h-[calc(100vh-5rem)] items-center justify-center"
			in:fade={{ duration: 1000 }}
		>
			<div class="max-w-2xl text-center">
				<h1 class="mb-8 text-4xl font-extralight tracking-tight md:text-5xl lg:text-6xl">
					Brian Kelleher
				</h1>

				<!-- Minimal separator -->
				<div class="mb-8 flex justify-center">
					<div class="bg-foreground/20 h-px w-24"></div>
				</div>

				<p
					class="text-muted-foreground mb-12 text-sm font-light tracking-[0.2em] uppercase"
				>
					Founder · Student · Builder
				</p>

				<!-- Key stats -->
				<div class="mx-auto grid max-w-md grid-cols-3 gap-8">
					<div>
						<p class="mb-2 text-2xl font-extralight">{age}</p>
						<p
							class="text-muted-foreground/60 text-xs font-light tracking-[0.2em] uppercase"
						>
							Years Old
						</p>
					</div>
					<div>
						<p class="mb-2 text-2xl font-extralight">{yearsOfCoding}</p>
						<p
							class="text-muted-foreground/60 text-xs font-light tracking-[0.2em] uppercase"
						>
							Years Coding
						</p>
					</div>
					<div>
						<p class="mb-2 text-2xl font-extralight">{Math.round(githubCommits)}</p>
						<p
							class="text-muted-foreground/60 text-xs font-light tracking-[0.2em] uppercase"
						>
							GitHub Commits
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Timeline Section -->
		<section class="border-foreground/10 border-b py-20">
			<h2 class="mb-16 text-center text-2xl font-extralight">Timeline</h2>
			<div class="space-y-0">
				{#each timeline as item, i}
					<div
						class="border-foreground/5 flex flex-col gap-3 border-b py-8 last:border-b-0 md:flex-row md:items-center md:gap-8"
						in:fade={{ duration: 600, delay: i * 100 }}
					>
						<p
							class="text-muted-foreground/60 text-sm font-light tracking-[0.2em] uppercase md:w-20"
						>
							{item.year}
						</p>
						<div class="bg-foreground/10 hidden h-px flex-1 md:block"></div>
						<p class="text-foreground/80 text-base font-light md:text-right">
							{item.event}
						</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Awards Section -->
		<section class="border-foreground/10 border-b py-20">
			<h2 class="mb-16 text-center text-2xl font-extralight">Recognition</h2>
			<div class="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
				{#each awards as award, i}
					<div class="group" in:fade={{ duration: 600, delay: 200 + i * 50 }}>
						<h3
							class="group-hover:text-foreground/80 mb-2 text-base font-light transition-colors duration-500"
						>
							{award.title}
						</h3>
						<p
							class="text-muted-foreground/60 mb-2 text-sm font-light tracking-[0.2em] uppercase"
						>
							{award.description}
						</p>
						<div class="flex items-center gap-4">
							{#if award.year}
								<p
									class="text-muted-foreground/40 text-xs font-light tracking-[0.2em] uppercase"
								>
									{award.year}
								</p>
							{/if}
							{#if award.link}
								<a
									href={award.link}
									target="_blank"
									rel="noopener noreferrer"
									class="text-muted-foreground/40 hover:text-foreground/60 text-xs font-light tracking-[0.2em] uppercase transition-colors duration-500"
								>
									View
								</a>
							{/if}
						</div>
						<div
							class="bg-foreground/5 mt-4 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
						></div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Side Quests -->
		<section class="border-foreground/10 border-b py-20">
			<h2 class="mb-16 text-center text-2xl font-extralight">Side Quests</h2>
			<div class="space-y-16">
				{#each sideQuests as quest, i}
					<div class="group" in:fade={{ duration: 600, delay: 300 + i * 100 }}>
						<h3 class="mb-4 text-lg font-light">{quest.title}</h3>
						<p class="text-muted-foreground/80 mb-6 max-w-2xl text-sm font-light">
							{quest.description}
						</p>

						{#if quest.videoId}
							<div
								class="bg-background relative mb-6 aspect-video w-full max-w-2xl overflow-hidden rounded-sm"
							>
								<iframe
									src="https://www.youtube-nocookie.com/embed/{quest.videoId}"
									title={quest.title}
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
									loading="lazy"
									sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
									class="absolute inset-0 h-full w-full"
								></iframe>
							</div>
						{/if}

						{#if quest.imageUrl}
							<div class="group relative mb-6">
								<div class="inline-block max-w-lg lg:max-w-xl">
									<div class="relative overflow-hidden rounded-sm">
										<img
											src={quest.imageUrl}
											alt={quest.title}
											class="h-auto w-full brightness-95 filter transition-all duration-1000 group-hover:brightness-100"
										/>
										<!-- Subtle border overlay -->
										<div
											class="border-foreground/10 group-hover:border-foreground/20 pointer-events-none absolute inset-0 rounded-sm border transition-all duration-1000"
										></div>
									</div>
								</div>
							</div>
						{/if}

						{#if quest.links}
							<div class="flex gap-4">
								{#each quest.links as link}
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										class="text-muted-foreground/60 hover:text-foreground/80 text-xs font-light tracking-[0.2em] uppercase transition-colors duration-500"
									>
										{link.text} →
									</a>
								{/each}
							</div>
						{/if}
						{#if i < sideQuests.length - 1}
							<div class="bg-foreground/5 mt-8 h-px"></div>
						{/if}
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	/* Keep styles section even if empty for now */
</style>
