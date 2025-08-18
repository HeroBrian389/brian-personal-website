<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher<{ unlock: void }>();

	// Track cursor position (row, column)
	let cursorRow = $state(0);
	let cursorCol = $state(0);
	// Mode: 'normal' for vi navigation, 'insert' for text editing, 'command' for command-line
	let mode = $state<"normal" | "insert" | "command">("normal");
	let exBuffer = $state<string>("");
	let fileContent = $state<string[]>([
		"this is a vi file. Close it and you can see the projects (:"
	]);

	// Ensure cursor stays within bounds
	function clampCursor() {
		cursorRow = Math.max(0, Math.min(fileContent.length - 1, cursorRow));
		const lineLength = fileContent[cursorRow]?.length ?? 0;
		cursorCol = Math.max(0, Math.min(lineLength, cursorCol));
	}

	$effect(() => {
		function onKey(e: KeyboardEvent) {
			if (mode === "normal") {
				// Vi normal mode commands
				if (e.key === "h" || e.key === "ArrowLeft") {
					cursorCol = Math.max(0, cursorCol - 1);
					e.preventDefault();
					return;
				} else if (e.key === "j" || e.key === "ArrowDown") {
					cursorRow = Math.min(fileContent.length - 1, cursorRow + 1);
					clampCursor();
					e.preventDefault();
					return;
				} else if (e.key === "k" || e.key === "ArrowUp") {
					cursorRow = Math.max(0, cursorRow - 1);
					clampCursor();
					e.preventDefault();
					return;
				} else if (e.key === "l" || e.key === "ArrowRight") {
					const lineLength = fileContent[cursorRow]?.length ?? 0;
					cursorCol = Math.min(lineLength - 1, cursorCol + 1);
					e.preventDefault();
					return;
				} else if (e.key === "i") {
					// Enter insert mode
					mode = "insert";
					e.preventDefault();
					return;
				} else if (e.key === ":") {
					// Enter command mode
					mode = "command";
					exBuffer = ":";
					e.preventDefault();
					return;
				}
				// In normal mode, prevent any other typing
				e.preventDefault();
				return;
			} else if (mode === "insert") {
				// Insert mode - allow typing
				if (e.key === "Escape") {
					mode = "normal";
					clampCursor();
					e.preventDefault();
					return;
				} else if (e.key === "ArrowUp") {
					cursorRow = Math.max(0, cursorRow - 1);
					clampCursor();
					e.preventDefault();
					return;
				} else if (e.key === "ArrowDown") {
					cursorRow = Math.min(fileContent.length - 1, cursorRow + 1);
					clampCursor();
					e.preventDefault();
					return;
				} else if (e.key === "ArrowLeft") {
					cursorCol = Math.max(0, cursorCol - 1);
					e.preventDefault();
					return;
				} else if (e.key === "ArrowRight") {
					const lineLength = fileContent[cursorRow]?.length ?? 0;
					cursorCol = Math.min(lineLength, cursorCol + 1);
					e.preventDefault();
					return;
				} else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
					// Insert text
					let line = fileContent[cursorRow] ?? "";
					fileContent[cursorRow] =
						line.slice(0, cursorCol) + e.key + line.slice(cursorCol);
					cursorCol += 1;
					e.preventDefault();
					return;
				} else if (e.key === "Backspace") {
					let line = fileContent[cursorRow] ?? "";
					if (cursorCol > 0) {
						fileContent[cursorRow] =
							line.slice(0, cursorCol - 1) + line.slice(cursorCol);
						cursorCol -= 1;
					}
					e.preventDefault();
					return;
				} else if (e.key === "Enter") {
					// Split line at cursor
					let line = fileContent[cursorRow] ?? "";
					let beforeCursor = line.slice(0, cursorCol);
					let afterCursor = line.slice(cursorCol);
					fileContent[cursorRow] = beforeCursor;
					fileContent.splice(cursorRow + 1, 0, afterCursor);
					cursorRow += 1;
					cursorCol = 0;
					e.preventDefault();
					return;
				}
			} else if (mode === "command") {
				// Command mode
				if (e.key === "Escape") {
					mode = "normal";
					exBuffer = "";
					e.preventDefault();
					return;
				} else if (e.key === "Enter") {
					// Execute command
					const cmd = exBuffer.trim();
					if (cmd === ":q" || cmd === ":quit" || cmd === ":wq") {
						dispatch("unlock");
					}
					mode = "normal";
					exBuffer = "";
					e.preventDefault();
					return;
				} else if (e.key === "Backspace") {
					if (exBuffer.length > 1) {
						exBuffer = exBuffer.slice(0, -1);
					} else {
						// If we delete the ':', go back to normal mode
						mode = "normal";
						exBuffer = "";
					}
					e.preventDefault();
					return;
				} else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
					// Add to command buffer
					exBuffer += e.key;
					e.preventDefault();
					return;
				}
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
</script>

<div
	class="bg-background text-foreground relative flex h-full w-full flex-col overflow-hidden font-mono"
>
	<!-- Display the text file content -->
	<div class="content-area h-full flex-1">
		{#each fileContent as line}
			<div class="line">{line || "\u00A0"}</div>
		{/each}
	</div>

	<!-- Cursor block positioned by row and column -->
	<div
		class="cursor-block"
		style="top: calc({cursorRow} * 1.5em + 0.5em); left: calc({cursorCol}ch + 0.5em);"
	></div>

	<!-- Status bar -->
	{#if mode === "command"}
		<!-- Command-line area at bottom -->
		<div
			class="bg-background text-foreground border-foreground/20 absolute bottom-0 left-0 w-full border-t px-2 py-1 font-mono"
		>
			{exBuffer}<span class="cursor-command">_</span>
		</div>
	{:else if mode === "insert"}
		<div
			class="bg-background text-foreground border-foreground/20 absolute bottom-0 left-0 w-full border-t px-2 py-1 font-mono"
		>
			-- INSERT --
		</div>
	{:else}
		<div
			class="bg-background text-foreground border-foreground/20 absolute bottom-0 left-0 w-full border-t px-2 py-1 font-mono"
		>
			{cursorRow + 1},{cursorCol + 1}
		</div>
	{/if}
</div>

<style>
	/* Content area styling */
	.content-area {
		padding: 0.5em;
		line-height: 1.5em;
		font-size: 1em;
	}

	.line {
		height: 1.5em;
		white-space: pre;
	}

	/* Cursor block styling */
	.cursor-block {
		position: absolute;
		width: 1ch;
		height: 1.5em;
		background: currentColor;
		mix-blend-mode: difference;
		pointer-events: none;
		z-index: 10;
	}

	/* Command mode cursor */
	.cursor-command {
		animation: blink 1s infinite;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}
</style>
