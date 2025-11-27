# How to Add New Projects

## Quick Guide (current pipeline)

1. **Add metadata**: update `src/lib/data/projects-meta.ts` (copy an existing entry).
2. **Add markdown writeup**: place `static/projects/content/your-project.md`.
3. **Verify build**: `npm run check && npm run build`.

## Example: Adding a New Project

### 1. Add metadata

In `src/lib/data/projects-meta.ts`, add an entry keyed by the slug:

```ts
"my-awesome-project": {
  slug: "my-awesome-project",
  title: "My Awesome Project",
  description: "Brief description for the project card",
  technologies: ["Python", "FastAPI", "PostgreSQL"],
  github: "https://github.com/username/project",
  demo: "https://project-demo.com",
  featured: true
}
```

### 2. Create Markdown writeup

`static/projects/content/my-awesome-project.md`:

```markdown
## Executive Summary

Your project overview...

## Technical Architecture

Detailed technical explanation...

## Key Features

- Feature 1
- Feature 2
```

### 3. Verify everything works

```bash
npm run check
npm run dev
npm run build
```

## Important Notes

- The `slug` in metadata must match the markdown filename (minus `.md`).
- Markdown lives in `static/projects/content/` and ships with the build—no generation step.
- Use `featured` and date fields in metadata; sorting is handled in `projects.server.ts`.
