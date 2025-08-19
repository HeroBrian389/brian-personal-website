# Adding New Projects

## Quick Start

To add a new project to your portfolio:

1. **Create the project JSON file** in `src/lib/data/projects/`:
   ```bash
   src/lib/data/projects/your-project-slug.json
   ```

2. **Create the markdown writeup** in `src/lib/data/projects-extracted/`:
   ```bash
   src/lib/data/projects-extracted/your-project-slug.md
   ```

3. **Run the generation script**:
   ```bash
   node scripts/generate-project-data.cjs
   ```

4. **Verify the build**:
   ```bash
   npm run check
   npm run build
   ```

## File Structure

### Project JSON (`src/lib/data/projects/your-project.json`)

```json
{
  "slug": "your-project-slug",
  "title": "Your Project Title",
  "description": "Brief description for the card view",
  "technologies": ["TypeScript", "React", "Node.js"],
  "github": "https://github.com/yourusername/project",
  "demo": "https://your-project.com",
  "featured": true,
  "order": 3,
  "codeSnippet": {
    "code": "// Your code snippet here\nconst example = 'code';",
    "language": "typescript"
  }
}
```

### Project Writeup (`src/lib/data/projects-extracted/your-project.md`)

```markdown
## Executive Summary

Brief overview of what the project does and why it's significant.

## Core Architecture

### Main Components

Detailed technical explanation of how the project works...

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Technical Implementation

### Algorithm Design

```typescript
// Code examples with proper markdown formatting
const implementation = () => {
  // Your code here
};
```

## Results and Impact

What you achieved with this project...
```

## Adding a New Project Step-by-Step

### Step 1: Create the JSON metadata

Create a new file `src/lib/data/projects/my-new-project.json`:

```json
{
  "slug": "my-new-project",
  "title": "My New Project",
  "description": "A revolutionary new approach to X",
  "technologies": ["Python", "TensorFlow", "Docker"],
  "github": "https://github.com/brian/my-project",
  "featured": false,
  "order": 10
}
```

### Step 2: Write the detailed markdown

Create `src/lib/data/projects-extracted/my-new-project.md` with your full technical writeup.

### Step 3: Generate the TypeScript data file

```bash
node scripts/generate-project-data.cjs
```

This script will:
- Read all JSON files from `src/lib/data/projects/`
- Match them with markdown files in `src/lib/data/projects-extracted/`
- Generate `src/lib/data/projects-data.ts` with all project data

### Step 4: Verify everything works

```bash
npm run check  # Check for TypeScript errors
npm run dev    # View in development
npm run build  # Ensure production build works
```

## Important Notes

1. **Slug Consistency**: The slug in the JSON must match the markdown filename
   - JSON: `"slug": "my-project"`
   - Markdown: `my-project.md`

2. **Markdown Escaping**: The generation script handles escaping automatically
   - Write normal markdown with backticks for code blocks
   - Don't worry about escaping for TypeScript template literals

3. **Order Field**: Controls the display order on the projects page
   - Lower numbers appear first
   - Featured projects are shown prominently regardless of order

4. **Code Snippets**: Optional but recommended for featured projects
   - Shows on the project card
   - Use the language field for proper syntax highlighting

## Troubleshooting

### Project not showing up
- Check that both JSON and markdown files exist
- Verify the slug matches between files
- Run the generation script again
- Check for build errors

### Markdown not rendering correctly
- Ensure you're using standard markdown syntax
- Check for unmatched backticks in code blocks
- Verify the generation script ran successfully

### Build errors after adding project
- Run `npm run check` to see TypeScript errors
- Ensure JSON is valid (no trailing commas, proper quotes)
- Check that all required fields are present in JSON

## Current Projects

The following projects are currently configured:
1. `claude-workflow-automation` - Claude Workflow Automation System
2. `animation-creation-app` - Mathematical Animation Platform

Both have extensive technical writeups demonstrating the expected level of detail for new projects.