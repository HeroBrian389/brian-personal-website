## Executive Summary

This project represents a breakthrough in autonomous code generation, implementing a sophisticated multi-stage orchestration system that transforms natural language specifications into production-ready full-stack applications. The system leverages Claude's advanced language understanding through a carefully engineered 5+ hour pipeline that maintains consistency, self-corrects errors, and ensures security compliance throughout the entire development lifecycle.

## Core Architecture

### Workflow Orchestration Engine

The heart of the system is a bash-based orchestration engine that implements a state machine architecture managing five discrete stages. Each stage transition is governed by explicit success criteria and maintains complete isolation through timestamped working directories.

\`\`\`bash

# Stage execution with isolated environments

run*claude_stage() {
local stage_name=$1
    local prompt_file=$2
    local prompt_content=$3
    local log_file="$LOGS_DIR/\${TIMESTAMP}*\${stage_name}.log"

    # Save prompt to avoid shell escaping issues
    PROMPT_FILE="$LOGS_DIR/prompt_\${TIMESTAMP}_\${stage_name}.txt"
    echo "$prompt_content" > "$PROMPT_FILE"

    # Execute Claude with project context
    CLAUDE_PROJECT_DIR="$(pwd)" claude \\
        --dangerously-skip-permissions \\
        --model="$CLAUDE_MODEL" \\
        -p "$(cat "$PROMPT_FILE")" 2>&1 | tee -a "$log_file"

}
\`\`\`

**Dynamic Environment Provisioning**: Each workflow execution creates an isolated environment by cloning the target repository into a timestamped directory:

\`\`\`bash

# Clone repo to isolated directory for parallel safety

WORK_DIR="./cloned-repo-$TIMESTAMP"

if [ "$TARGET_REPO" = "." ]; then # Local repository mode - preserve original
git clone . "$WORK_DIR"
    cd "$WORK_DIR/repo"
else # Remote repository mode - direct clone
git clone "$TARGET_REPO" "$WORK_DIR"
cd "$WORK_DIR"
fi
\`\`\`

**Process Monitoring**: A background monitor provides real-time status during the 5+ hour execution:

\`\`\`bash

# Background monitor for long-running Claude processes

(
while true; do
sleep 30
if ps aux | grep -v grep | grep -q "claude.\*$CLAUDE_MODEL"; then
            echo "[$(date +%H:%M:%S)] Claude is still processing..."
else
break
fi
done
) &
MONITOR_PID=$!
\`\`\`

### Hook-Based Completion Detection System

The most innovative aspect is the hook-based completion detection mechanism that creates a feedback loop for autonomous operation:

\`\`\`bash
#!/bin/bash

# check-implementation-complete.sh

# Determine project directory from runner context

PROJECT_DIR="\${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Collect all PROGRESS_TRACKER.md files

trackers=()
while IFS= read -r -d '' f; do
trackers+=("$f")
done < <(find "$PROJECT_DIR/projects/active" -type f \\
-name "PROGRESS_TRACKER.md" -print0 2>/dev/null || true)

# Count remaining tasks across all trackers

total_remaining=0
for t in "\${trackers[@]}"; do
if grep -q "\\[ \\]" "$t" 2>/dev/null; then
        rem=$(grep -c "\\[ \\]" "$t" 2>/dev/null || echo 0)
        total_remaining=$((total_remaining + rem))
fi
done

if [ "$total_remaining" -gt 0 ]; then
echo "Implementation incomplete: $total_remaining tasks remain" >&2
exit 2 # Signal to continue
fi
\`\`\`

**Intelligent Iteration Control**: The system prevents infinite loops through a persistence mechanism:

\`\`\`bash

# Limit continuation attempts to prevent infinite loops

MAX_UNKNOWN="\${MAX_UNKNOWN_ITERATIONS:-5}"
COUNTER_FILE="$PROJECT_DIR/.claude/implementation_unknown_counter"

current_count=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
next_count=$((current_count + 1))
echo "$next_count" > "$COUNTER_FILE"

if [ "$next_count" -gt "$MAX_UNKNOWN" ]; then
echo "Stopping after $MAX_UNKNOWN continuation attempts" >&2
exit 0 # Signal completion
fi
\`\`\`

### Settings Management and LSP Integration

The system manipulates Claude's settings through programmatic JSON modification:

\`\`\`bash

# Dynamic hook registration in .claude/settings.json

enable_implementation_hook() {
local settings_file="$1/.claude/settings.json"
mkdir -p "$1/.claude"

    # Inject Stop hook for completion detection
    cat > "$settings_file" << 'EOF'

{
"hooks": {
"Stop": [{
"hooks": [{
"type": "command",
"command": "/path/to/check-implementation-complete.sh"
}]
}]
}
}
EOF
echo "✓ Implementation completion hook enabled"
}

# Clean removal after stage completion

disable_implementation_hook() {
local settings_file="$1/.claude/settings.json"
    if command -v jq &> /dev/null; then
        jq 'del(.hooks.Stop)' "$settings_file" > "$settings_file.tmp"
        mv "$settings_file.tmp" "$settings_file"
fi
}
\`\`\`

The CLAUDE_PROJECT_DIR environment variable ensures hooks execute in the correct project context, enabling full LSP functionality for code navigation and type checking.

## Prompt Engineering Architecture

### Stage 1: Planning Phase

The planning prompt implements a structured approach to requirements analysis:

\`\`\`markdown

# PLANNING STAGE

I have a user request here:
<user request>
[USER_REQUEST]
</user request>

To start, I want you to read over the codebase. Research deeply to find
all relevant context. Don't write code yet - focus on researching,
analysing and understanding.

Critical constraint: Authentication and identity are managed separately.
Ignore any auth-related requests or changes in this workflow.

Please follow these steps:

1. **Codebase Analysis**
    - Analyze the project structure and architecture
    - Understand relevant files, patterns, and dependencies
    - Review existing pages and components to understand implementation patterns
    - Identify all template/placeholder content that needs updating

2. **Create Project Structure**
    - Use the ./setup-project script to create a new project
    - The project name should be descriptive and kebab-case

3. **Populate Project Documentation**
    - Fill out ALL project files with specific, detailed content: - README.md: Complete project overview with specific goals - USER_STORY.md: Detailed user stories with comprehensive acceptance criteria - REQUIREMENTS.md: All functional and technical requirements - DESIGN.md: Technical design with architecture decisions - VALIDATION_STRATEGY.md: Testing strategy and success metrics - PROGRESS_TRACKER.md: Detailed task breakdown
      \`\`\`

**Token Replacement System**: The system performs dynamic substitution at runtime:

\`\`\`bash

# Process template with token replacement

while IFS= read -r line; do # Normalize CRLF to LF for reliable matching
line=\${line%$'\\r'}
    if [ "$line" = "[USER_REQUEST]" ]; then
cat "$USER_REQUEST_FILE"
    else
        echo "$line"
fi
done < "$PROMPTS_DIR/01-planning.md" > "$PLANNING_PROMPT_FILE"
\`\`\`

### Stage 2: Implementation Phase

The implementation prompt enforces systematic development with agent spawning:

\`\`\`markdown

# IMPLEMENTATION STAGE

Read over the project in the projects directory. Research in the codebase.
Once you have a deep understanding of what to do, implement it in full.
Don't stop until it is fully implemented.

Please follow these steps:

1. **Review Project Documentation**
    - Read all files in the project directory thoroughly
    - Understand the requirements, design decisions, and implementation plan
    - Review the task breakdown in PROGRESS_TRACKER.md

2. **Research Codebase Patterns**
    - Study existing code patterns and conventions
    - Understand the tech stack and architectural patterns
    - Review CLAUDE.md for project-specific guidelines

3. **Systematic Implementation**
    - Work through tasks in logical order
    - Update PROGRESS_TRACKER.md as you complete tasks
    - Follow the existing code style and patterns exactly
    - Use the TodoWrite tool to track your progress

4. **Complete Implementation**
    - Implement ALL functionality described in the requirements
    - Update ALL template pages with real, meaningful content
    - Ensure all acceptance criteria are met

5. **Code Quality**
    - Follow TypeScript strict mode requirements
    - Ensure proper error handling
    - Add appropriate loading states

6. **Verification**
    - Run pnpm check to ensure no TypeScript errors
    - Run pnpm run build to ensure the project builds successfully
    - Test all functionality manually

Remember: This is a FULL implementation. Do not leave any placeholders.

Spawn lots of agents to complete the sub tasks. Give extremely detailed
implementation plans for the sub-agents.
\`\`\`

### Stage 3: Security Review

The security review prompt (03-security-review.md) implements a comprehensive 7-category audit:

**Structured Vulnerability Assessment**: Each finding must include severity level (Critical/High/Medium/Low), specific file locations with line numbers, impact analysis, and code-level remediation examples.

**Defense-in-Depth Coverage**: The audit spans authentication/authorization, input validation, data protection, API security, common vulnerabilities (OWASP Top 10), third-party dependencies, and infrastructure security.

**Machine-Parseable Output**: The prompt requires structured output format that can be programmatically parsed in the subsequent fix stage, enabling automated remediation.

### Stage 4: Issue Resolution

The fix issues stage implements systematic remediation with dynamic context injection:

\`\`\`bash

# Stage 4: Fix Issues - Dynamic Security Context Injection

# Save security output to handle multi-line content safely

SECURITY*OUTPUT_FILE="$LOGS_DIR/security_output*\${TIMESTAMP}.txt"
echo "$SECURITY_OUTPUT" > "$SECURITY_OUTPUT_FILE"

# Create the fix issues prompt with token replacement

FIX*PROMPT_FILE="$LOGS_DIR/fix_prompt*\${TIMESTAMP}.txt"

# Process template and inject security findings

while IFS= read -r line; do
line=\${line%$'\\r'}  # Normalize CRLF endings
    if [ "$line" = "[SECURITY_REVIEW_OUTPUT]" ]; then
cat "$SECURITY_OUTPUT_FILE"  # Inject full security audit
    else
        echo "$line"
fi
done < "$PROMPTS_DIR/04-fix-issues.md" > "$FIX_PROMPT_FILE"
\`\`\`

**Real Security Output Example** that gets injected:
\`\`\`markdown

## Security Audit Complete

### Critical Findings Requiring Immediate Action:

1. **Organization Provisioning API** - Completely unprotected
2. **JWT Secret Fallback** - Uses default "your-secret-key"
3. **Missing Organization Context** - JWT tokens lack org isolation
4. **Exposed OAuth Credentials** - Real credentials in .env.example

### High Priority Issues:

5. **No Rate Limiting** - All endpoints vulnerable to abuse
6. **Open Redirect Vulnerability** - Unvalidated redirect parameter
7. **Insufficient Input Validation** - Missing Zod schemas

### Immediate Actions Required:

1. Add authentication to /app/api/provision-organization/route.ts (2 hours)
2. Fix JWT secret fallback in /lib/auth/utils.ts (1 hour)
3. Remove OAuth credentials from .env.example (30 minutes)
4. Implement rate limiting (6 hours)
   \`\`\`

The fix stage systematically addresses each finding with verification loops ensuring no regressions.

### Stage 5: E2E Testing Infrastructure

The E2E testing stage (currently disabled) implements comprehensive validation with full infrastructure provisioning:

\`\`\`bash

# Stage 5: E2E Testing Setup

# Start PostgreSQL with health checks

if [ -f "docker-compose.yml" ]; then
DOCKER_COMPOSE_DIR="."
elif [ -f "repo/docker-compose.yml" ]; then
DOCKER_COMPOSE_DIR="repo"
fi

# Start PostgreSQL container

(cd "$DOCKER_COMPOSE_DIR" && docker compose up -d postgres)

# Wait for PostgreSQL readiness (30 second timeout)

for i in {1..30}; do
if docker compose exec -T postgres pg_isready -U postgres; then
echo "✓ PostgreSQL is ready"
break
fi
if [ $i -eq 30 ]; then
print_error "PostgreSQL failed to start in time"
docker compose logs postgres
exit 1
fi
sleep 1
done

# Database setup with environment configuration

export DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
export POSTGRES_URL="postgresql://postgres:postgres@localhost:54322/postgres"

# Run migrations and seeding

pnpm db:migrate
pnpm db:seed

# Start Next.js dev server in background

pnpm dev > "$LOGS_DIR/\${TIMESTAMP}_dev-server.log" 2>&1 &
DEV_SERVER_PID=$!

# Wait for dev server (60 second timeout)

for i in {1..60}; do
if curl -s http://localhost:3000 > /dev/null 2>&1; then
echo "✓ Dev server is ready"
break
fi
if [ $i -eq 60 ]; then
tail -50 "$LOGS_DIR/\${TIMESTAMP}\_dev-server.log"
kill $DEV_SERVER_PID
exit 1
fi
sleep 1
done

# Run E2E testing stage with Claude

E2E_PROMPT=$(cat "$PROMPTS_DIR/05-e2e-testing.md")
run_claude_stage "05-e2e-testing" "$PROMPTS_DIR/05-e2e-testing.md" "$E2E_PROMPT"

# Cleanup infrastructure

kill $DEV_SERVER_PID 2>/dev/null
docker compose down
\`\`\`

The E2E testing prompt enforces iterative test development with Playwright, requiring 100% pass rate through continuous test refinement and fix cycles.

## Distributed Processing Architecture

### BullMQ Worker System

The worker implementation enables distributed job processing through Redis queues:

\`\`\`javascript
// worker.js - BullMQ distributed job processor
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { spawn } from 'child_process';

const redisConnection = new IORedis(process.env.REDIS_URL || {
host: process.env.REDIS_HOST || 'localhost',
port: process.env.REDIS_PORT || 6379,
password: process.env.REDIS_PASSWORD,
tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
maxRetriesPerRequest: null,
enableReadyCheck: false
});

const worker = new Worker(
'code-generation',
async (job) => {
const { user_brief, github_repo } = job.data;
const jobId = job.id;

    // Spawn workflow with environment injection
    const env = {
      ...process.env,
      USER_BRIEF: user_brief,
      TARGET_REPO: github_repo,
      JOB_ID: jobId
    };

    const child = spawn('/bin/bash', [scriptPath], {
      env,
      cwd: path.resolve(__dirname, '../..'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Handle stalled jobs
    job.on('stalled', () => {
      logger.warn(\`Job \${jobId} stalled, killing process\`);
      child.kill('SIGTERM');
    });

    return { success: true, stdout, stderr, jobId };

},
{
connection: redisConnection,
concurrency: process.env.WORKER_CONCURRENCY || 1,
stalledInterval: 30000, // Check every 30 seconds
maxStalledCount: 1, // Kill after 1 stall
lockDuration: 7200000, // 2 hour lock for 5+ hour jobs
lockRenewTime: 60000, // Renew every minute
}
);

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
await worker.close();
await redisConnection.quit();
process.exit(0);
});
\`\`\`

## Error Correction and Self-Consistency Mechanisms

### Multi-Layer Validation

The system implements defense-in-depth validation at every stage:

\`\`\`bash

# Build-time validation in Stage 2 (Implementation)

run_claude_stage() { # ...execute Claude...
CLAUDE_EXIT_CODE=\${PIPESTATUS[0]}

    if [ $CLAUDE_EXIT_CODE -eq 0 ]; then
        echo "✓ Stage completed successfully"
    else
        print_error "Stage failed with exit code $CLAUDE_EXIT_CODE"
        # Show last 20 lines of log for debugging
        tail -20 "$log_file"
        exit 1
    fi

}
\`\`\`

### Failure Recovery with Forensic Logging

\`\`\`javascript
// Worker error handling with comprehensive logging
worker.on('failed', (job, err) => {
logger.error(\`Job \${job?.id} failed:\
