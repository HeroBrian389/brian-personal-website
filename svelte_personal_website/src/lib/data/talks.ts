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
    slug: "augmented-engineer-dublin-2025-09-11",
    title: "How to do hard real-world coding with AI",
    event: "The Augmented Software Engineer — Agentic-Coding vs. Vibe-Coding",
    eventUrl:
      "https://www.meetup.com/the-augmented-software-engineer/events/310409681/",
    dateISO: "2025-09-11",
    location: "Baseline, Dublin",
    slidesUrl:
      "https://pitch.com/v/how-to-do-hard-real-world-coding-with-ai-5avpfa",
    pdfPath: "/talks/how-to-do-hard-real-world-coding-with-ai.pdf",
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
