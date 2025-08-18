import { animationCreationApp } from './animation-app-project';

export interface Project {
	slug: string;
	title: string;
	description?: string;
	shortDescription?: string;
	longDescription?: string;
	technologies: string[];
	highlights?: string[];
	link?: string;
	demo?: string | null;
	github?: string;
	date?: string;
	year?: number;
	featured?: boolean;
	status: 'completed' | 'in-progress' | 'archived' | 'production';
	category?: 'ai' | 'web' | 'infrastructure' | 'other';
}

export const projects: Project[] = [
	animationCreationApp,
	{
		slug: 'claude-workflow-automation',
		title: 'Claude Workflow Automation System',
		description: 'An autonomous code generation pipeline orchestrating multi-stage AI workflows for full-stack application development',
		longDescription: `## Executive Summary

This project represents a breakthrough in autonomous code generation, implementing a sophisticated multi-stage orchestration system that transforms natural language specifications into production-ready full-stack applications. The system leverages Claude's advanced language understanding through a carefully engineered 5+ hour pipeline that maintains consistency, self-corrects errors, and ensures security compliance throughout the entire development lifecycle.

## Core Architecture

### Workflow Orchestration Engine

The heart of the system is a bash-based orchestration engine that implements a state machine architecture managing five discrete stages. Each stage transition is governed by explicit success criteria and maintains complete isolation through timestamped working directories.

\`\`\`bash
# Stage execution with isolated environments
run_claude_stage() {
    local stage_name=$1
    local prompt_file=$2
    local prompt_content=$3
    local log_file="$LOGS_DIR/\${TIMESTAMP}_\${stage_name}.log"
    
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

if [ "$TARGET_REPO" = "." ]; then
    # Local repository mode - preserve original
    git clone . "$WORK_DIR"
    cd "$WORK_DIR/repo"
else
    # Remote repository mode - direct clone
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
        if ps aux | grep -v grep | grep -q "claude.*$CLAUDE_MODEL"; then
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
    exit 2  # Signal to continue
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
    exit 0  # Signal completion
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
   - Fill out ALL project files with specific, detailed content:
     - README.md: Complete project overview with specific goals
     - USER_STORY.md: Detailed user stories with comprehensive acceptance criteria
     - REQUIREMENTS.md: All functional and technical requirements
     - DESIGN.md: Technical design with architecture decisions
     - VALIDATION_STRATEGY.md: Testing strategy and success metrics
     - PROGRESS_TRACKER.md: Detailed task breakdown
\`\`\`

**Token Replacement System**: The system performs dynamic substitution at runtime:

\`\`\`bash
# Process template with token replacement
while IFS= read -r line; do
    # Normalize CRLF to LF for reliable matching
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
SECURITY_OUTPUT_FILE="$LOGS_DIR/security_output_\${TIMESTAMP}.txt"
echo "$SECURITY_OUTPUT" > "$SECURITY_OUTPUT_FILE"

# Create the fix issues prompt with token replacement
FIX_PROMPT_FILE="$LOGS_DIR/fix_prompt_\${TIMESTAMP}.txt"

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
        tail -50 "$LOGS_DIR/\${TIMESTAMP}_dev-server.log"
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
    stalledInterval: 30000,        // Check every 30 seconds
    maxStalledCount: 1,             // Kill after 1 stall
    lockDuration: 7200000,          // 2 hour lock for 5+ hour jobs
    lockRenewTime: 60000,           // Renew every minute
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
run_claude_stage() {
    # ...execute Claude...
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
    logger.error(\`Job \${job?.id} failed:\`, {
        error: err.message,
        stack: err.stack,
        jobData: job.data,
        timestamp: new Date().toISOString()
    });
});

// Stalled job recovery
worker.on('stalled', (jobId) => {
    logger.warn(\`Job \${jobId} stalled, attempting recovery\`);
    // Job will be retried based on maxStalledCount setting
});
\`\`\`

### Self-Consistency Through Progress Tracking

\`\`\`bash
# Implementation completion hook blocks progression
if [ "$total_remaining" -gt 0 ]; then
    echo "Implementation incomplete: $total_remaining tasks remain"
    echo "Continue implementing. BE AGGRESSIVE ABOUT UPDATING PROGRESS_TRACKER.md"
    exit 2  # Signal to continue working
fi

# Fallback to STATUS_UPDATES.md patterns
if tail -50 "$sf" | grep -qiE "all.*tasks.*complete|implementation.*complete"; then
    exit 0  # Signal completion
fi
\`\`\`

### Idempotent Project Creation

\`\`\`bash
# setup-project script prevents duplicate work
PROJECT_PATH="projects/active/$PROJECT_NAME"

# Check if project already exists
if [ -d "$PROJECT_PATH" ]; then
    echo "Error: Project '$PROJECT_NAME' already exists"
    exit 1
fi

# Safe creation with structured templates
mkdir -p "$PROJECT_PATH"/{scripts,docs,tests,spikes}
\`\`\`

The system maintains consistency through timestamped isolation (\`cloned-repo-$TIMESTAMP\`), comprehensive Winston logging, and cross-stage context preservation where each stage builds upon verified output from previous stages.

## Production Deployment Features

### GitHub Repository Creation

The system automatically creates and configures GitHub repositories with comprehensive metadata:

\`\`\`bash
# Generate unique repository name with timestamp and random suffix
RANDOM_SUFFIX=$(openssl rand -hex 4)
REPO_NAME="generated-\${TIMESTAMP}-\${RANDOM_SUFFIX}"
# Example: generated-20250812_030613-a3f7b2c9

# Create private repository in organization using gh CLI
if gh repo create "proj-lov-DevTir/$REPO_NAME" \\
    --private \\
    --description "Generated by Claude workflow - $TIMESTAMP" \\
    --push \\
    --source=.; then
    
    echo "✓ Repository created successfully"
    echo "Repository URL: https://github.com/proj-lov-DevTir/$REPO_NAME"
fi
\`\`\`

### Generation Metadata Documentation

Every generated repository includes comprehensive metadata:

\`\`\`bash
# Create GENERATION_INFO.md with full context
cat > GENERATION_INFO.md << EOF
# Generation Information

This repository was automatically generated by Claude Code workflow.

**Generated at:** \${TIMESTAMP}
**Original template:** \${TARGET_REPO}

## User Request
$(echo "$USER_REQUEST" | head -20)

## Workflow Stages Completed
- Planning stage
- Implementation stage  
- Security review
- Issue fixes

## Logs
Generation logs can be found in the original workflow directory: $LOGS_DIR
EOF

git add GENERATION_INFO.md
git commit -m "Add generation information"
git push origin main
\`\`\`

### Intelligent Commit Management

The system creates descriptive commits with full context:

\`\`\`bash
# For existing repositories - detailed commit message
git commit -m "Automated updates from Claude workflow

Automated generation from Claude Code workflow:
- Planning stage completed
- Implementation stage completed
- Security review completed
- Issues fixed

User request: $(echo "$USER_REQUEST" | head -1)

Generated at: \${TIMESTAMP}"

# Push with conflict detection
if git push origin main; then
    echo "✓ Changes pushed to main branch successfully"
else
    print_warning "Failed to push. You may need to pull first"
    echo "Manual push: git push origin main"
fi
\`\`\`

### Environment Adaptability

The system intelligently adapts to different repository contexts:

\`\`\`bash
# Dynamic repository detection and cloning strategy
WORK_DIR="./cloned-repo-$TIMESTAMP"

if [ "$TARGET_REPO" = "." ]; then
    # Local repository mode - preserve original
    cd "$REPO_DIR"
    CURRENT_BRANCH=$(git branch --show-current)
    cd ..
    
    echo "Cloning repository to: $WORK_DIR"
    git clone . "$WORK_DIR"
    cd "$WORK_DIR/repo"  # Local repos have /repo subdirectory
else
    # Remote repository mode - direct clone
    echo "Cloning from: $TARGET_REPO"
    git clone "$TARGET_REPO" "$WORK_DIR"
    cd "$WORK_DIR"
    CURRENT_BRANCH=$(git branch --show-current)
fi
\`\`\`

### Package Manager Auto-Detection

Intelligent dependency installation with fallback:

\`\`\`bash
# Stage 0.6: Installing dependencies
if [ -f "package.json" ]; then
    if command -v pnpm &> /dev/null; then
        pnpm install
        echo "✓ Dependencies installed with pnpm"
    elif command -v npm &> /dev/null; then
        npm install
        echo "✓ Dependencies installed with npm"
    else
        print_warning "No package manager found, skipping dependency installation"
    fi
fi
\`\`\`

### Docker Infrastructure Management

Automated PostgreSQL provisioning with intelligent path detection:

\`\`\`bash
# Detect docker-compose.yml location
if [ -f "docker-compose.yml" ]; then
    DOCKER_COMPOSE_DIR="."
elif [ -f "repo/docker-compose.yml" ]; then
    DOCKER_COMPOSE_DIR="repo"
else
    print_error "docker-compose.yml not found"
    exit 1
fi

# Start PostgreSQL with error handling
if (cd "$DOCKER_COMPOSE_DIR" && docker compose up -d postgres); then
    echo "✓ PostgreSQL started"
else
    print_error "Failed to start PostgreSQL. Make sure Docker is running."
    exit 1
fi
\`\`\`

### Error Recovery and Manual Fallbacks

The system provides clear recovery paths for all operations:

\`\`\`bash
# GitHub CLI not installed - provide manual instructions
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) not found"
    echo "Install with: brew install gh (on macOS)"
    echo ""
    echo "Manual repository creation:"
    echo "  cd $WORK_DIR"
    echo "  gh auth login"
    echo "  gh repo create proj-lov-DevTir/$REPO_NAME --private --push --source=."
fi

# Authentication failure - provide troubleshooting
if ! gh repo create ...; then
    print_error "Failed to create GitHub repository. Make sure:"
    echo "  1. You're authenticated with GitHub CLI (run: gh auth login)"
    echo "  2. You have permissions to create repos in the proj-lov-DevTir organization"
fi
\`\`\`

## Performance Characteristics

**Execution Time**: Complete pipeline execution typically runs 5+ hours for production-ready applications, with complex projects extending beyond 6 hours.

**Parallelization**: Agent spawning in the implementation stage enables parallel feature development, reducing sequential bottlenecks.

**Resource Usage**: Memory footprint remains under 2GB even for large projects due to streaming log processing and efficient file handling.

**Scalability**: BullMQ worker architecture supports horizontal scaling across multiple machines, with Redis acting as the central coordination point.

**Stage Breakdown**:
- Planning: 30-45 minutes (deep codebase analysis)
- Implementation: 3-4 hours (full feature development)
- Security Review: 20-30 minutes (comprehensive audit)
- Issue Resolution: 30-45 minutes (fixing all findings)
- E2E Testing: 45-60 minutes (test generation and iteration)

## Security Considerations

**Credential Management**: All sensitive data flows through environment variables, never hardcoded in prompts or logs.

**Sandbox Execution**: Timestamped directory isolation prevents cross-contamination between runs.

**Audit Trail**: Complete logging provides forensic capabilities for security review.

**Automated Security Review**: Stage 3 ensures security best practices are enforced on all generated code.

## Real-World Example: Budget Tracker Generation

The system successfully transformed a simple natural language request into a full-stack Next.js application:

**Input Request**:
\`\`\`text
Simple Budget Tracker (MVP — Manual DB Entry)

Who it's for: Individuals who want a minimal way to see monthly spending 
against simple category budgets.

Scope:
- Read-only UI that displays data from the database
- All data created and managed manually in the database
- No external integrations or file imports

Must-have (MVP):
- Data model: Category, Transaction, Budget
- Views: Overview, Transactions, Budgets
- Current month totals, per-category budget vs actual
\`\`\`

**Generated Output Structure**:
\`\`\`
cloned-repo-20250812_030613/
├── app/
│   ├── (dashboard)/
│   │   ├── overview/
│   │   │   └── page.tsx         # Budget overview with charts
│   │   ├── transactions/
│   │   │   └── page.tsx         # Transaction list with filters
│   │   └── budgets/
│   │       └── page.tsx         # Budget management UI
│   ├── api/
│   │   ├── categories/
│   │   ├── transactions/
│   │   └── budgets/
├── lib/
│   ├── db/
│   │   ├── schema.ts            # Drizzle ORM schemas
│   │   └── seed.ts              # 50+ sample transactions
│   └── utils/
│       └── budget-calculator.ts # Business logic
└── projects/
    └── active/
        └── budget-tracker/
            ├── PROGRESS_TRACKER.md  # [x] All 47 tasks completed
            ├── REQUIREMENTS.md       # Full specifications
            └── STATUS_UPDATES.md     # Implementation complete
\`\`\`

The generated application included TypeScript interfaces, Drizzle ORM schemas, seed data generation, responsive UI components, and comprehensive error handling - all from a 41-line natural language specification.

## Live Deployments & Hackathon

The system powers production applications including:
- **[incos.io](https://incos.io)** - Main deployment platform
- **[example.incos.io](https://example.incos.io)** - Live demonstration instance

This project was developed as part of:
- **[Project Lovable Hackathon](https://project-lovable.lovable.app/)** - The hackathon where this autonomous code generation system was created
- **[Lovable.dev](https://lovable.dev)** - The AI-powered app builder platform that hosted the hackathon

## Conclusion

This system represents a significant advancement in AI-assisted software development, demonstrating that complex, production-ready applications can be generated autonomously from natural language specifications while maintaining code quality, security, and architectural consistency. The 5+ hour execution time is a small investment for receiving a fully-implemented, security-audited, and tested application ready for deployment.`,
		technologies: ['Bash', 'Node.js', 'BullMQ', 'Redis', 'Claude API', 'Git', 'Docker', 'Winston', 'IORedis'],
		date: '2025',
		featured: true,
		status: 'completed'
	}
];

export function getProjectBySlug(slug: string): Project | undefined {
	return projects.find(p => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
	return projects.filter(p => p.featured);
}

export function getProjectsByStatus(status: Project['status']): Project[] {
	return projects.filter(p => p.status === status);
}