# How to Add New Projects

## Quick Guide

To add a new project to your portfolio:

1. **Create JSON metadata**: `src/lib/data/projects/your-project.json`
2. **Create markdown writeup**: `src/lib/data/projects-extracted/your-project.md`
3. **Generate TypeScript data**: `node scripts/generate-project-data.cjs`
4. **Verify build**: `npm run check && npm run build`

## Example: Adding a New Project

### 1. Create JSON file

`src/lib/data/projects/my-awesome-project.json`:

```json
{
	"slug": "my-awesome-project",
	"title": "My Awesome Project",
	"description": "Brief description for the project card",
	"technologies": ["Python", "FastAPI", "PostgreSQL"],
	"github": "https://github.com/username/project",
	"demo": "https://project-demo.com",
	"featured": true,
	"order": 3,
	"codeSnippet": {
		"code": "def main():\n    return 'Hello World'",
		"language": "python"
	}
}
```

### 2. Create Markdown writeup

`src/lib/data/projects-extracted/my-awesome-project.md`:

```markdown
## Executive Summary

Your project overview...

## Technical Architecture

Detailed technical explanation...

## Key Features

- Feature 1
- Feature 2
```

### 3. Generate the data

```bash
node scripts/generate-project-data.cjs
```

### 4. Verify everything works

```bash
npm run check
npm run dev
```

## Important Notes

- The `slug` in JSON must match the markdown filename (minus .md extension)
- The generation script handles all markdown escaping automatically
- Both Claude and Animation projects have extensive writeups as examples
- Order field controls display order (lower = first)

## Current Projects

1. **claude-workflow-automation** (38,301 chars) - Autonomous code generation pipeline
2. **animation-creation-app** (42,117 chars) - Mathematical animation platform

Both projects include complete technical writeups demonstrating the expected level of detail.
