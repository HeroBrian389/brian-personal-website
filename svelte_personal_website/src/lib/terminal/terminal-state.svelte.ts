import { getContext, setContext } from "svelte";

export type TerminalEntry = {
	type: "prompt" | "output";
	content: string;
};

export class TerminalState {
	terminalBuffer = $state<TerminalEntry[]>([
		{ type: "output", content: 'Welcome to the project terminal! Type "help" for commands.' },
		{ type: "prompt", content: "" }
	]);

	currentInput = $state<string>("");
	cursorPosition = $state<number>(0);
	isActive = $state<boolean>(true); // Terminal is always active for global capture
	currentProject = $state<string | null>(null); // Track currently open project

	projects: { slug: string }[] = [];

	constructor(projects: { slug: string }[]) {
		this.projects = projects;
	}

	// Move cursor left
	moveCursorLeft() {
		this.cursorPosition = Math.max(0, this.cursorPosition - 1);
	}

	// Move cursor right
	moveCursorRight() {
		this.cursorPosition = Math.min(this.currentInput.length, this.cursorPosition + 1);
	}

	// Insert character at cursor position
	insertCharacter(char: string) {
		const before = this.currentInput.slice(0, this.cursorPosition);
		const after = this.currentInput.slice(this.cursorPosition);
		this.currentInput = before + char + after;
		this.cursorPosition += 1;
	}

	// Delete character before cursor (backspace)
	deleteCharacter() {
		if (this.cursorPosition > 0) {
			const before = this.currentInput.slice(0, this.cursorPosition - 1);
			const after = this.currentInput.slice(this.cursorPosition);
			this.currentInput = before + after;
			this.cursorPosition -= 1;
		}
	}

	// Close current project
	closeProject() {
		this.currentProject = null;
	}

	// Execute command and add to buffer
	executeCommand(cmd: string) {
		// Update the current prompt to show the executed command
		const lastPromptIndex = this.terminalBuffer.length - 1;
		this.terminalBuffer[lastPromptIndex] = {
			type: "prompt",
			content: cmd
		};

		let projectToOpen = null;
		let projectToClose = null;

		// Add command output
		if (cmd === "ls") {
			this.terminalBuffer.push({
				type: "output",
				content: this.projects.map((p) => p.slug).join("  ")
			});
		} else if (cmd === "help") {
			this.terminalBuffer.push({
				type: "output",
				content:
					"Available commands:\n  ls         - list projects\n  open <slug> - open project\n  kill <slug> - close project\n  help       - show this help"
			});
		} else if (cmd.startsWith("open ")) {
			const slug = cmd.slice(5).trim();
			const project = this.projects.find((p) => p.slug === slug);
			if (project) {
				// If there's already a project open, close it first
				if (this.currentProject) {
					projectToClose = this.currentProject;
					this.terminalBuffer.push({
						type: "output",
						content: `Closing ${this.currentProject}...`
					});
				}

				this.terminalBuffer.push({
					type: "output",
					content: `Opening ${slug}...`
				});

				// Update current project and return slug to open
				this.currentProject = slug;
				projectToOpen = slug;
			} else {
				this.terminalBuffer.push({
					type: "output",
					content: `Project '${slug}' not found. Use 'ls' to see available projects.`
				});
			}
		} else if (cmd.startsWith("kill ")) {
			const slug = cmd.slice(5).trim();
			if (this.currentProject === slug) {
				this.terminalBuffer.push({
					type: "output",
					content: `Closing ${slug}...`
				});
				projectToClose = slug;
				this.currentProject = null;
			} else if (this.currentProject) {
				this.terminalBuffer.push({
					type: "output",
					content: `Project '${slug}' is not currently open. Currently open: ${this.currentProject}`
				});
			} else {
				this.terminalBuffer.push({
					type: "output",
					content: `No project is currently open.`
				});
			}
		} else if (cmd.trim() === "") {
			// Empty command, just add new prompt
		} else {
			this.terminalBuffer.push({
				type: "output",
				content: `Command not found: ${cmd}. Type 'help' for available commands.`
			});
		}

		// Always add new prompt and reset input
		this.terminalBuffer.push({ type: "prompt", content: "" });
		this.currentInput = "";
		this.cursorPosition = 0;

		// Return project actions for the component
		return {
			open: projectToOpen,
			close: projectToClose
		};
	}

	// Handle tab completion
	handleTabCompletion() {
		if (this.currentInput.startsWith("open ")) {
			const partial = this.currentInput.slice(5).toLowerCase();
			const matches = this.projects.filter((p) => p.slug.toLowerCase().startsWith(partial));

			if (matches.length === 1) {
				// Complete the command
				this.currentInput = `open ${matches[0].slug}`;
				this.cursorPosition = this.currentInput.length;
			} else if (matches.length > 1) {
				// Show possible matches
				const lastPromptIndex = this.terminalBuffer.length - 1;
				this.terminalBuffer[lastPromptIndex] = {
					type: "prompt",
					content: this.currentInput
				};
				this.terminalBuffer.push({
					type: "output",
					content: matches.map((m) => m.slug).join("  ")
				});
				this.terminalBuffer.push({ type: "prompt", content: "" });
				this.currentInput = "";
				this.cursorPosition = 0;
			}
		} else if (this.currentInput.startsWith("kill ")) {
			const partial = this.currentInput.slice(5).toLowerCase();
			const matches = this.projects.filter((p) => p.slug.toLowerCase().startsWith(partial));

			if (matches.length === 1) {
				// Complete the command
				this.currentInput = `kill ${matches[0].slug}`;
				this.cursorPosition = this.currentInput.length;
			} else if (matches.length > 1) {
				// Show possible matches
				const lastPromptIndex = this.terminalBuffer.length - 1;
				this.terminalBuffer[lastPromptIndex] = {
					type: "prompt",
					content: this.currentInput
				};
				this.terminalBuffer.push({
					type: "output",
					content: matches.map((m) => m.slug).join("  ")
				});
				this.terminalBuffer.push({ type: "prompt", content: "" });
				this.currentInput = "";
				this.cursorPosition = 0;
			}
		} else if (
			this.currentInput === "l" ||
			this.currentInput === "ls".slice(0, this.currentInput.length)
		) {
			this.currentInput = "ls";
			this.cursorPosition = this.currentInput.length;
		}
	}

	// Get the current prompt index (last one in buffer)
	get currentPromptIndex() {
		return this.terminalBuffer.length - 1;
	}

	// Check if current prompt is active (empty content)
	get isCurrentPromptActive() {
		const currentPrompt = this.terminalBuffer[this.currentPromptIndex];
		return currentPrompt?.type === "prompt" && currentPrompt?.content === "";
	}
}

const TERMINAL_SYMBOL_KEY = "terminal-state";

export function setTerminalState(projects: { slug: string }[]): TerminalState {
	return setContext(Symbol.for(TERMINAL_SYMBOL_KEY), new TerminalState(projects));
}

export function getTerminalState(): TerminalState {
	return getContext(Symbol.for(TERMINAL_SYMBOL_KEY));
}
