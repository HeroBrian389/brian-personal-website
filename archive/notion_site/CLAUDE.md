# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brian Kelleher's personal website built with Next.js Notion Starter Kit. Uses Notion as a CMS to manage content, with a Next.js frontend for optimal performance.

## Key Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
npm run deploy

# Analyze bundle size
npm run analyze

# Run linting and formatting checks
npm test
# or individually:
npm run test:lint      # ESLint
npm run test:prettier  # Prettier
```

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 12.2.3 (Pages Router)
- **Language**: TypeScript (non-strict mode)
- **CMS**: Notion via react-notion-x
- **Deployment**: Vercel

### Key Directories
- `pages/`: Next.js pages with dynamic routing via `[pageId].tsx`
- `components/`: React components, notably `NotionPage.tsx` for rendering
- `lib/`: Core utilities including `notion-api.ts` for Notion integration
- `site.config.ts`: Main configuration file with all site settings

### Content Flow
1. Content is authored in Notion (root page: 149c09c3c6044fd495248cacffd5cf05)
2. `lib/notion-api.ts` fetches content using notion-client
3. `components/NotionPage.tsx` renders the content with react-notion-x
4. Dynamic routes in `pages/[pageId].tsx` handle all Notion pages

## Important Configuration

### site.config.ts
Central configuration for:
- Notion page IDs and navigation
- Site metadata (name, author, domain)
- Feature toggles (search, RSS, preview images)
- Social links and contact info

### Environment Variables
Optional analytics and caching:
- `NEXT_PUBLIC_FATHOM_ID`: Fathom Analytics
- `NEXT_PUBLIC_POSTHOG_ID`: PostHog Analytics
- `REDIS_HOST`, `REDIS_PASSWORD`: Redis caching (currently disabled)

## Development Guidelines

### When modifying components:
- The main page renderer is `NotionPage.tsx`
- Custom collection rendering is in `CustomCollection.tsx`
- All Notion block renderers are configured in `NotionPage.tsx`

### When updating styles:
- Global styles are in `styles/globals.css`
- Notion-specific styles are in `styles/notion.css`
- Component styles use CSS modules

### When adding new pages:
- Static pages go in `pages/` directory
- Dynamic Notion content is handled by `[pageId].tsx`
- API routes go in `pages/api/`

### Performance considerations:
- Images are optimized with next/image and LQIP
- Bundle size can be analyzed with `npm run analyze`
- Redis caching can be enabled via environment variables

## Testing
Currently only linting and formatting are configured. No unit tests exist.
To add tests, you would need to set up Jest or Vitest with React Testing Library.