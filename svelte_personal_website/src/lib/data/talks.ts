export interface Talk {
	slug: string;
	title: string;
	event: string;
	eventUrl?: string;
	dateISO: string; // YYYY-MM-DD
	location?: string;
	slidesUrl?: string; // canonical share link
	pdfPath?: string; // local static embed fallback
	videoUrl?: string;
	description?: string;
	keyPoints?: string[];
}

export const talks: Talk[] = [
	{
		slug: "ai-crm-sales-agent-2025-11-20",
		title: "How to build an AI CRM/sales agent",
		event: "Remote session",
		dateISO: "2025-11-20",
		location: "Online",
		pdfPath: "/talks/how-to-build-an-ai-crm.pdf",
		videoUrl: "https://youtu.be/44Pdj-DTerY",
		description:
			"An end-to-end walkthrough of designing, deploying, and hardening an AI-native CRM/sales agent: from ingesting customer data and wiring tool access to evaluating dialogues, enforcing policies, and measuring impact in production.",
		keyPoints: [
			"Architecture for syncing CRM data, summarizing accounts, and exposing safe tool adapters for email, calendar, and deal updates.",
			"Conversation flows that mix scripted intent detection with multi-turn reasoning, guardrails, and retrieval for compliance-grade responses.",
			"Evaluation strategies (simulated prospects, red-team prompts, latency/cost dashboards) to ship reliably and iterate post-launch."
		]
	},
	{
		slug: "edge-city-patagonia-2025-10-29",
		title: "How to use AI to Ship Production Code",
		event: "Edge Fellowship Workshop · Edge City, Patagonia",
		eventUrl: "https://app.sola.day/event/detail/16784",
		dateISO: "2025-10-29",
		location: "Le Village, San Martín de los Andes, Argentina",
		pdfPath: "/talks/how-to-use-ai-to-ship-production-code.pdf",
		videoUrl: "https://youtu.be/5dCNHaV8UPM",
		description:
			"A hands-on session for the Edge Community on moving from vibe-coded prototypes to production systems, unpacking the frameworks I use to ship reliable code with AI assistants after thousands of hours working with Claude, Codex, and Gemini.",
		keyPoints: [
			"Why AI-written code often fails production standards and how to close that gap with process and tooling.",
			"Battle-tested frameworks for shipping: aligning on requirements, orchestrating models, and enforcing rigorous verification before deployment.",
			"Lessons from spending thousands on frontier AI tooling and scaling an AI-only engineering workflow."
		]
	},
	{
		slug: "augmented-engineer-dublin-2025-09-11",
		title: "How to do hard real-world coding with AI",
		event: "The Augmented Software Engineer — Agentic-Coding vs. Vibe-Coding",
		eventUrl: "https://www.meetup.com/the-augmented-software-engineer/events/310409681/",
		dateISO: "2025-09-11",
		location: "Baseline, Dublin",
		slidesUrl: "https://pitch.com/v/how-to-do-hard-real-world-coding-with-ai-5avpfa",
		pdfPath: "/talks/how-to-do-hard-real-world-coding-with-ai.pdf",
		videoUrl: "https://www.youtube.com/watch?v=SYsBEzcbcyU",
		description:
			"A practical framework for using AI to complete non-trivial, multi-hour engineering tasks: move beyond toy prompts to a four-phase pipeline (Understanding → Planning → Implementing → Checking) with rigorous verification and iteration.",
		keyPoints: [
			"Success criteria on two axes: accuracy (valid, idiomatic code; no regressions) and completeness (finish the end-to-end task).",
			"Four-phase pipeline: Understanding, Planning, Implementing, Checking — loop until checks pass.",
			"Prep the workspace with opinionated config files (AGENTS.md, CLAUDE.md, .cursorrules) and CI/type-checking.",
			"Use a project bootstrap script (./setup-project <name>) to create docs like REQUIREMENTS, DESIGN, VALIDATION_STRATEGY, PROGRESS_TRACKER.",
			"Verification: LLM-to-LLM self-consistency checks, strict TS type-checking, static analysis, tests, and logs everywhere.",
			"Get better outputs with model choice, prompt sampling + selection, orchestration into sub-tasks, tool use (e.g., calculator), and context engineering.",
			"Practical ops tips: persistent shells (e.g., screen) to run long flows; respawn agents automatically when checks fail."
		]
	}
];
