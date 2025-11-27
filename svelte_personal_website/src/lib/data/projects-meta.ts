// Project metadata only - content is stored in separate .md files
// See: src/lib/data/projects/content/*.md

import type { ProjectMeta } from "./projects.schema";

export const projectsMeta: Record<string, ProjectMeta> = {
	"animation-creation-app": {
		slug: "animation-creation-app",
		title: "AI-Powered Mathematical Animation Platform",
		shortDescription:
			"Platform transforming natural language into Manim-powered educational videos through multi-agent AI orchestration and custom spatial reasoning scaffolding",
		description:
			"Platform transforming natural language into Manim-powered educational videos through multi-agent AI orchestration and custom spatial reasoning scaffolding",
		codeSnippet: {
			code: `async def orchestrate_animation_generation(prompt: str):
    """Multi-agent orchestration for Manim video generation"""

    # Phase 1: Concept extraction with specialized agent
    concept_agent = ConceptExtractionAgent(
        model="gpt-4",
        math_knowledge_base=self.kb
    )
    concepts = await concept_agent.extract(prompt)

    # Phase 2: Parallel script generation with retry logic
    script_tasks = []
    for concept in concepts.segments:
        agent = ScriptGenerationAgent(
            templates=self.manim_templates,
            spatial_scaffolding=self.auto_composer
        )
        script_tasks.append(agent.generate_script(concept))

    scripts = await asyncio.gather(*script_tasks)

    # Phase 3: Manim code synthesis with validation
    manim_code = await self.synthesize_manim_code(
        scripts,
        auto_layout=True,  # AI doesn't handle positioning
        validate_syntax=True,
        inject_transitions=True
    )

    # Phase 4: Render with automatic error recovery
    try:
        video = await self.render_manim(manim_code)
    except SpatialConflictError as e:
        # Auto-resolve spatial conflicts
        manim_code = self.auto_composer.resolve_conflicts(manim_code)
        video = await self.render_manim(manim_code)

    return video`,
			language: "python"
		},
		technologies: [
			"Python",
			"Django",
			"FastAPI",
			"SvelteKit",
			"TypeScript",
			"MySQL",
			"Redis",
			"RabbitMQ",
			"Celery",
			"Docker",
			"AWS S3",
			"CloudFront",
			"Manim",
			"OpenAI API",
			"Anthropic API",
			"ElevenLabs",
			"WebSockets",
			"JWT",
			"MyPy"
		],
		highlights: [
			"Innovative spatial reasoning compensation framework for AI",
			"100+ custom Manim components with deterministic positioning",
			"8-stage AI workflow with OpenAI O3, Claude Opus 4, and direct Anthropic API",
			"ElevenLabs voice synchronization with word-level timing",
			"Auto-composition utilities that handle all spatial logic",
			"Fixed scene templates eliminating need for AI spatial understanding",
			"Intelligent math symbol placement and transformation tracking",
			"Four-pass code generation system with MyPy validation"
		],
		demo: null,
		featured: true,
		year: 2024,
		category: "ai"
	},

	"claude-workflow-automation": {
		slug: "claude-workflow-automation",
		title: "Claude Workflow Automation System",
		description:
			"An autonomous code generation pipeline orchestrating multi-stage AI workflows for full-stack application development",
		codeSnippet: {
			code: `#!/bin/bash
# Hook-based autonomous continuation mechanism

# Check all PROGRESS_TRACKER.md files for remaining tasks
find "$PROJECT_DIR/projects/active" -name "PROGRESS_TRACKER.md" | while read tracker; do
    remaining=$(grep -c "\\[ \\]" "$tracker" 2>/dev/null || echo 0)
    total_remaining=$((total_remaining + remaining))
done

if [ "$total_remaining" -gt 0 ]; then
    echo "Implementation incomplete: $total_remaining tasks remain" >&2
    echo "Continue implementing. BE AGGRESSIVE ABOUT UPDATING PROGRESS_TRACKER.md"
    exit 2  # Signal to continue autonomously
fi

# Prevent infinite loops with persistence mechanism
COUNTER_FILE="$PROJECT_DIR/.claude/implementation_unknown_counter"
current_count=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
next_count=$((current_count + 1))

if [ "$next_count" -gt "$MAX_UNKNOWN_ITERATIONS" ]; then
    echo "Stopping after $MAX_UNKNOWN_ITERATIONS continuation attempts"
    exit 0  # Signal completion
fi

echo "$next_count" > "$COUNTER_FILE"
exit 2  # Continue working`,
			language: "bash"
		},
		technologies: [
			"Bash",
			"Node.js",
			"BullMQ",
			"Redis",
			"Claude API",
			"Git",
			"Docker",
			"Winston",
			"IORedis"
		],
		date: "2025",
		featured: true,
		category: "ai"
	},

	"initial-thoughts-opus-gemini-codex": {
		slug: "initial-thoughts-opus-gemini-codex",
		title: "Initial thoughts: Opus 4.5 vs Gemini 3 Pro vs Codex-Max",
		description:
			"Three-model bakeoff debugging a 30-minute Celery/RabbitMQ crash and how each model judged the others.",
		technologies: ["Celery", "RabbitMQ", "Python", "OpenAI API", "Anthropic API"],
		date: "2025-11-26",
		featured: false,
		category: "infrastructure",
		codeSnippet: {
			language: "ini",
			code: `; RabbitMQ broker-side ack timeout (ms)
consumer_timeout = 1800000

; Celery worker (conceptual)
worker_prefetch_multiplier = 1
; late acks defer ACK until task completes
; task_acks_late = True
; add heartbeat to keep connection alive
broker_heartbeat = 60`
		}
	},

	"setup-project": {
		slug: "setup-project",
		title: "setup-project: Project Bootstrap Script",
		description:
			"Opinionated script that scaffolds a complete project workspace with aligned docs (user stories, requirements, design, validation, tracking) so humans and AI share the same scratch pad and definition of done.",
		technologies: ["Bash", "Unix", "Git"],
		date: "2025",
		category: "infrastructure",
		featured: true,
		codeSnippet: {
			code: `#!/bin/bash

# setup-project - Create a new project with the standard template structure
# Usage: ./setup-project <project-name>

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Check if project name is provided
if [ -z "$1" ]; then
    echo -e "\${RED}Error: Project name is required\${NC}"
    echo "Usage: ./setup-project <project-name>"
    echo "Example: ./setup-project api-refactoring"
    exit 1
fi

PROJECT_NAME="$1"
PROJECT_PATH="projects/active/$PROJECT_NAME"

# Check if project already exists
if [ -d "$PROJECT_PATH" ]; then
    echo -e "\${RED}Error: Project '$PROJECT_NAME' already exists\${NC}"
    exit 1
fi

# Create project structure
echo -e "\${YELLOW}Creating new project: $PROJECT_NAME\${NC}"
mkdir -p "$PROJECT_PATH"/{scripts,docs,tests,spikes}

echo -e "\${GREEN}Project '$PROJECT_NAME' created successfully!\${NC}"`,
			language: "bash"
		}
	}
};

export const getAllProjectMetas = (): ProjectMeta[] => {
	return Object.values(projectsMeta);
};

export const getProjectMeta = (slug: string): ProjectMeta | null => {
	return projectsMeta[slug] || null;
};
