## Executive Summary

The `setup-project` script is a lightweight, repeatable way to bootstrap a new project with the exact documentation scaffolding you need to keep people and AI agents aligned from day one. It creates a clean workspace under `projects/active/<name>` and pre-populates high-signal docs (User Stories, Requirements, Design, Validation Strategy, Progress Tracker, Status Updates, Retrospective) so the “definition of done” and current state are always explicit and discoverable.

- Download: [/files/setup-project](/files/setup-project)
- Usage: `./setup-project <project-name>`
- Output: `projects/active/<project-name>/{docs, scripts, spikes, tests}` with all core docs

## Why This Increases Alignment

Alignment fails when intent, constraints, and acceptance criteria live in chat logs or tribal knowledge. This script enforces a single, canonical place for:

- Intent: `USER_STORY.md` articulates the primary user story with acceptance criteria.
- Constraints: `REQUIREMENTS.md` captures functional/technical requirements and out-of-scope items.
- Decisions: `DESIGN.md` documents architecture, options considered, and chosen trade-offs.
- Definition of Done: `VALIDATION_STRATEGY.md` encodes success metrics, tests, rollout/rollback.
- Execution State: `PROGRESS_TRACKER.md` and `STATUS_UPDATES.md` make progress legible over time.

That structure keeps human collaborators and AI tools working against the same source of truth, reduces ambiguity, and shortens the feedback loop.

## Giving AI a Scratch Pad (That Humans Can Read)

LLMs work best when they have a durable workspace to plan, reflect, and iterate. The generated project folder provides exactly that:

- Writeable context: Plain-text files the AI can read/write without fragile serialization.
- Iteration lanes: `spikes/` for throwaway exploration; `tests/` for executable verification; `docs/` for decisions.
- Traceability: Status updates are append-only; trackers make “what’s next?” explicit.

This transforms AI from a chat assistant into a contributory engineer with a shared notebook.

## Ensuring Clean, Consistent Documentation

Every project starts with the same high-quality skeleton:

- `README.md` with creation metadata (date, author) and quick links
- `USER_STORY.md` with acceptance criteria checklists
- `REQUIREMENTS.md` with Must/Should/Nice-to-have plus constraints and out-of-scope
- `DESIGN.md` covering current/proposed architecture, decisions, and implementation plan
- `VALIDATION_STRATEGY.md` for metrics, test plan, rollout/rollback, monitoring
- `PROGRESS_TRACKER.md` with milestones and sprint tasks
- `STATUS_UPDATES.md` for time-ordered updates
- `RETROSPECTIVE.md` to close the loop

Consistency reduces cognitive overhead, improves review quality, and makes projects searchable and comparable.

## Installation & Usage

```bash
# 1) Download the script
curl -fsSL https://briankelleher.ie/files/setup-project -o setup-project

# 2) Make it executable
chmod +x setup-project

# 3) Run from the repo root (creates projects/active/<name>)
./setup-project api-refactoring
```

The script is idempotent for new names and safely aborts if the path already exists.

## Template Details

- Folders: `scripts/`, `docs/`, `tests/`, `spikes/` are created under the new project.
- Guardrails: colored output for clarity; immediate, actionable next steps printed on success.
- Defaults: usable boilerplate with checklists to encourage fast first commits and incremental refinement.

## Integrating With AI Workflows

- Point your agent at `projects/active/<name>` and instruct it to:
    - Read all docs first; propose updates instead of writing code blindly.
    - Keep `PROGRESS_TRACKER.md` in sync with changes.
    - Record significant actions in `STATUS_UPDATES.md` (append at top).
- Optional: add hooks or background jobs that refuse to stop while unchecked items remain, ensuring forward motion is explicit.

## Safety & Limitations

- Non-destructive: refuses to overwrite existing projects.
- Local by default: no network calls; easy to audit.
- You still need judgment: templates don’t replace design thinking, they scaffold it.

## Appendix: Script Header & Usage

```bash
#!/bin/bash
# setup-project - Create a new project with the standard template structure
# Usage: ./setup-project <project-name>
```

Full source is embedded below as the code snippet and available for download above.
