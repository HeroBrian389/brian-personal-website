# Adding New Projects

## Quick Start (current pipeline)

1. **Add metadata** in `src/lib/data/projects-meta.ts` (copy an existing entry and adjust fields).
2. **Add the markdown writeup** in `static/projects/content/your-project-slug.md`.
3. **Verify the build**:
   ```bash
   npm run check
   npm run build
   ```

## Metadata entry (`src/lib/data/projects-meta.ts`)

Add an object keyed by your slug:

```ts
"your-project-slug": {
  slug: "your-project-slug",
  title: "Your Project Title",
  description: "Brief description for the card view",
  technologies: ["TypeScript", "Svelte", "Node.js"],
  github: "https://github.com/yourusername/project",
  demo: "https://your-project.com",
  featured: true
}
```

## Markdown writeup (`static/projects/content/your-project-slug.md`)

````markdown
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

```typescript
// Code examples with proper markdown formatting
const implementation = () => {
  // Your code here
};
```
````

## Steps in detail

1. **Add metadata** in `src/lib/data/projects-meta.ts` matching your slug.
2. **Add markdown** in `static/projects/content/<slug>.md` with the full writeup.
3. **Run checks/build** to ensure everything renders: `npm run check && npm run build`.

## Important Notes

- **Slug consistency:** The metadata slug must match the markdown filename (minus `.md`).
- **Markdown location:** All project markdown lives in `static/projects/content/` so it ships with the build—no generation script needed.
- **Code snippets:** Keep short code snippets in the metadata entry; they render on project cards.
- **Order/featured:** Use the `featured` flag and, if needed, date fields in metadata; sorting is handled in `projects.server.ts`.
