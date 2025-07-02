<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { getTerminalState } from "$lib/terminal/terminal-state.svelte";

	const dispatch = createEventDispatcher<{
		open: string;
		close: string;
	}>();
	const terminal = getTerminalState();

	let container: HTMLDivElement;

	// Global keydown handler
	$effect(() => {
		function handleGlobalKeydown(e: KeyboardEvent) {
			// Don't capture keystrokes if user is typing in other inputs
			if (
				e.target &&
				(e.target as Element).tagName === "INPUT" &&
				(e.target as Element) !== document.body
			) {
				return;
			}

			if (e.key === "Enter") {
				e.preventDefault();
				const result = terminal.executeCommand(terminal.currentInput);

				// Handle project actions
				if (result.close) {
					dispatch("close", result.close);
				}
				if (result.open) {
					// Dispatch open event after a short delay to show the message
					setTimeout(() => dispatch("open", result.open!), 500);
				}
			} else if (e.key === "Backspace") {
				e.preventDefault();
				terminal.deleteCharacter();
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				terminal.moveCursorLeft();
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				terminal.moveCursorRight();
			} else if (e.key === "Tab") {
				e.preventDefault();
				terminal.handleTabCompletion();
			} else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
				// Regular character input
				e.preventDefault();
				terminal.insertCharacter(e.key);
			}
		}

		window.addEventListener("keydown", handleGlobalKeydown);
		return () => window.removeEventListener("keydown", handleGlobalKeydown);
	});

	// Auto-scroll to bottom when terminal buffer changes
	$effect(() => {
		if (container && terminal.terminalBuffer) {
			container.scrollTop = container.scrollHeight;
		}
	});
</script>

<div class="bg-background text-foreground relative flex h-full w-full flex-col px-4 py-4 font-mono">
	<div bind:this={container} class="flex-1 space-y-1 overflow-y-auto pb-8">
		{#each terminal.terminalBuffer as entry, i}
			{#if entry.type === "prompt"}
				<div class="relative flex items-start">
					<span class="mr-2 text-green-400">$</span>
					{#if i === terminal.currentPromptIndex && terminal.isCurrentPromptActive}
						<!-- This is the active prompt where user is typing -->
						<div class="relative flex-1 font-mono">
							<!-- Display the current input text -->
							<span class="whitespace-pre">{terminal.currentInput}</span>
							<!-- Solid block cursor positioned at cursor position -->
							<div
								class="bg-foreground pointer-events-none absolute top-0 h-[1.5em] w-[1ch]"
								style="left: calc({terminal.cursorPosition}ch); mix-blend-mode: difference;"
							></div>
						</div>
					{:else}
						<!-- This is a completed prompt showing the command that was executed -->
						<span class="whitespace-pre">{entry.content}</span>
					{/if}
				</div>
			{:else if entry.type === "output"}
				<div class="text-foreground/90 pl-4 whitespace-pre-wrap">
					{entry.content}
				</div>
			{/if}
		{/each}
	</div>
</div>
