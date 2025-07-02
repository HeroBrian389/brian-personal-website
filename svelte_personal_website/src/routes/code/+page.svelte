<script lang="ts">
	import LockedVi from "$lib/components/LockedVi.svelte";
	import ShellEmulator from "$lib/components/ShellEmulator.svelte";
	import { setTerminalState } from "$lib/terminal/terminal-state.svelte";
	import projects from "$lib/data/projects.json";

	let mode = $state<"locked" | "shell">("locked");
	let selectedProject = $state<any>(null);

	// Initialize terminal state when component loads
	const terminal = setTerminalState(projects);

	function handleUnlock() {
		mode = "shell";
	}

	function handleOpen(event: CustomEvent<string>) {
		const slug = event.detail;
		const project = projects.find((p) => p.slug === slug);
		if (project) {
			selectedProject = project;
		}
	}

	function handleClose(_event?: CustomEvent<string> | MouseEvent) {
		selectedProject = null;
		// Also update the terminal state to reflect that no project is open
		terminal.closeProject();
	}
</script>

<svelte:head>
	<title>Coding Section</title>
</svelte:head>

<div class="flex h-[calc(100vh-12rem)] w-full flex-col">
	{#if mode === "locked"}
		<LockedVi on:unlock={handleUnlock} />
	{:else}
		<!-- Split layout: Terminal always visible on left -->
		<div class="flex h-full w-full">
			<!-- Terminal Section - Always visible -->
			<div class="flex-1 {selectedProject ? 'w-1/2' : 'w-full'} transition-all duration-300">
				<ShellEmulator on:open={handleOpen} on:close={handleClose} />
			</div>

			<!-- Project Section - Only visible when project is selected -->
			{#if selectedProject}
				<div
					class="bg-card text-card-foreground border-foreground/10 relative w-1/2 overflow-auto border-l p-6"
				>
					<button
						class="text-muted-foreground hover:text-foreground absolute top-4 right-4 text-2xl transition-colors"
						onclick={handleClose}
					>
						×
					</button>
					<h2 class="mb-4 text-3xl font-extralight">{selectedProject.title}</h2>
					<p class="text-muted-foreground font-light">{selectedProject.description}</p>

					<!-- Additional project content can go here -->
					<div class="bg-muted/20 border-foreground/10 mt-8 rounded border p-4">
						<p class="text-muted-foreground text-sm font-light">
							Project slug: <code
								class="bg-background text-foreground rounded px-2 py-1"
								>{selectedProject.slug}</code
							>
						</p>
						<p class="text-muted-foreground mt-2 text-sm font-light">
							Type <code class="bg-background text-foreground rounded px-2 py-1"
								>kill {selectedProject.slug}</code
							> in the terminal to close this project.
						</p>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
