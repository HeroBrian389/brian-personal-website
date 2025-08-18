# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains two separate implementations of Brian Kelleher's personal website:

1. **Svelte Personal Website** (`/svelte_personal_website/`) - The active SvelteKit implementation
2. **Notion Site** (`/archive/notion_site/`) - A Next.js-based website using Notion as a CMS (archived)

## Notion Site Development Commands (Archived)

```bash
cd archive/notion_site

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

# Run linting and formatting checks
npm test
```

## Svelte Site Development Commands

```bash
cd svelte_personal_website

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run e2e tests only
npm run test:e2e

# Linting and formatting
npm run lint
npm run format
```

## Architecture Overview

### Notion Site Architecture
- **Framework**: Next.js 12.2.3 with Pages Router
- **Language**: TypeScript
- **CMS**: Notion via react-notion-x
- **Key Configuration**: `site.config.ts` contains all site settings
- **Content Flow**: Notion → notion-client → react-notion-x → Next.js pages
- **Dynamic Routing**: All Notion pages handled by `pages/[pageId].tsx`

### Svelte Site Architecture
- **Framework**: SvelteKit with Svelte 5
- **Language**: TypeScript
- **UI Components**: Comprehensive shadcn/ui component library in `src/lib/components/ui/`
- **Icons**: phosphor-svelte (preferred over lucide-svelte)
- **Styling**: TailwindCSS v4
- **Testing**: Vitest for unit tests, Playwright for e2e tests
- **Routing**: File-based routing in `src/routes/`

## Key Configuration Files

### Notion Site
- `site.config.ts` - Main configuration (Notion IDs, metadata, features)
- Root Notion Page ID: `149c09c3c6044fd495248cacffd5cf05`
- Domain: `briankelleher.ie`

### Svelte Site
- `svelte.config.js` - SvelteKit configuration
- `vite.config.ts` - Build configuration
- `components.json` - UI component library settings

## Important Development Notes

1. **Component Libraries**: The Svelte site includes an extensive UI component library. When adding features, check existing components first in `src/lib/components/ui/`.

2. **Icons**: Always use phosphor-svelte for icons instead of lucide-svelte or other icon libraries. Import icons from 'phosphor-svelte'.

3. **Testing**: The Svelte site has a complete testing setup. Always run tests before committing:
   - Unit tests: `npm run test:unit`
   - E2e tests: `npm run test:e2e`

4. **Type Safety**: Both projects use TypeScript. Ensure type checking passes:
   - Notion site: TypeScript in non-strict mode
   - Svelte site: Run `npm run check`

5. **Migration Status**: The migration from the Notion-based site to the Svelte implementation is complete. The Notion site has been archived for reference.

## Svelte 5 and SvelteKit Development Guidelines

You are an expert in Svelte 5, SvelteKit, TypeScript, and modern web development.

Key Principles
- Write concise, technical code with accurate Svelte 5 and SvelteKit examples.
- Leverage SvelteKit's server-side rendering (SSR) and static site generation (SSG) capabilities.
- Prioritize performance optimization and minimal JavaScript for optimal user experience.
- Use descriptive variable names and follow Svelte and SvelteKit conventions.
- Organize files using SvelteKit's file-based routing system.

Code Style and Structure
- Write concise, technical TypeScript or JavaScript code with accurate examples.
- Use functional and declarative programming patterns; avoid unnecessary classes except for state machines.
- Prefer iteration and modularization over code duplication.
- Structure files: component logic, markup, styles, helpers, types.
- Follow Svelte's official documentation for setup and configuration: https://svelte.dev/docs

Naming Conventions
- Use lowercase with hyphens for component files (e.g., `components/auth-form.svelte`).
- Use PascalCase for component names in imports and usage.
- Use camelCase for variables, functions, and props.

TypeScript Usage
- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use const objects instead.
- Use functional components with TypeScript interfaces for props.
- Enable strict mode in TypeScript for better type safety.

Svelte 5 Runes (ALWAYS use these patterns)
- `$state`: Declare reactive state
  ```typescript
  let count = $state(0);
  ```
- `$derived`: Compute derived values (replaces Svelte 4's `$:`)
  ```typescript
  let doubled = $derived(count * 2);
  // Svelte 4: $: doubled = count * 2;
  ```
- `$effect`: Manage side effects and lifecycle
  ```typescript
  $effect(() => {
    console.log(`Count is now ${count}`);
  });
  ```
- `$props`: Declare component props (replaces Svelte 4's `export let`)
  ```typescript
  let { optionalProp = 42, requiredProp } = $props();
  // Svelte 4: export let optionalProp = 42; export let requiredProp;
  ```
- `$bindable`: Create two-way bindable props
  ```typescript
  let { bindableProp = $bindable() } = $props();
  ```
- `$inspect`: Debug reactive state (development only)
  ```typescript
  $inspect(count);
  ```

Svelte 4 → Svelte 5 Migration Guide
| Svelte 4 Pattern | Svelte 5 Pattern | Notes |
|------------------|------------------|-------|
| `export let prop` | `let { prop } = $props()` | Props must be destructured from $props() |
| `export let prop = defaultValue` | `let { prop = defaultValue } = $props()` | Default values in destructuring |
| `$: derived = value * 2` | `let derived = $derived(value * 2)` | Use $derived for reactive computations |
| `$: { console.log(value) }` | `$effect(() => { console.log(value) })` | Use $effect for side effects |
| `let count = 0` | `let count = $state(0)` | Use $state for reactive variables |
| `onMount(() => {})` | Still valid, or use `$effect` | onMount/onDestroy still work |
| `beforeUpdate/afterUpdate` | `$effect.pre()` / `$effect()` | These are deprecated |
| Store subscriptions `$store` | Still work | But consider using runes instead |
| `bind:value` | Still works | Use `$bindable()` for two-way props |

UI and Styling
- Use Tailwind CSS for utility-first styling approach.
- Leverage Shadcn components for pre-built, customizable UI elements.
- Import Shadcn components from `$lib/components/ui`.
- Organize Tailwind classes using the `cn()` utility from `$lib/utils`.
- Use Svelte's built-in transition and animation features.

Design Patterns & Style Guidelines
- **Minimalist Approach**: Prefer clean, direct layouts without excessive decoration
- **Typography**: Use font-normal for headings instead of bold, modest sizes (text-4xl for main headings, text-lg for body)
- **Spacing**: Generous whitespace between sections (mb-20 for major sections)
- **Animations**: Subtle and purposeful - fade, scale, and fly transitions with tasteful delays
- **Color Usage**: Primarily grayscale with strategic use of primary color for links and accents
- **Card Components**: Simple borders with hover:shadow-lg for interactive elements
- **No Decorative Elements**: Avoid emojis, excessive icons, or ornamental components
- **Direct Communication**: Headlines and descriptions should be concise and straightforward
- **Interactive States**: Subtle hover effects (hover:text-foreground/80, hover:shadow-lg)
- **Layout**: Max-width containers (max-w-6xl) with consistent padding (px-4)

Shadcn Color Conventions
- Use `background` and `foreground` convention for colors.
- Define CSS variables without color space function:
  ```css
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  ```
- Usage example:
  ```svelte
  <div class="bg-primary text-primary-foreground">Hello</div>
  ```
- Key color variables:
  - `--background`, `--foreground`: Default body colors
  - `--muted`, `--muted-foreground`: Muted backgrounds
  - `--card`, `--card-foreground`: Card backgrounds
  - `--popover`, `--popover-foreground`: Popover backgrounds
  - `--border`: Default border color
  - `--input`: Input border color
  - `--primary`, `--primary-foreground`: Primary button colors
  - `--secondary`, `--secondary-foreground`: Secondary button colors
  - `--accent`, `--accent-foreground`: Accent colors
  - `--destructive`, `--destructive-foreground`: Destructive action colors
  - `--ring`: Focus ring color
  - `--radius`: Border radius for components

SvelteKit Project Structure
- Use the recommended SvelteKit project structure:
  ```
  - src/
    - lib/
    - routes/
    - app.html
  - static/
  - svelte.config.js
  - vite.config.js
  ```

Component Development
- Create .svelte files for Svelte components.
- Use .svelte.ts files for component logic and state machines.
- Implement proper component composition and reusability.
- Use Svelte's props for data passing.
- Leverage Svelte's reactive declarations for local state management.

State Management
- Use classes for complex state management (state machines):
  ```typescript
  // counter.svelte.ts
  class Counter {
    count = $state(0);
    incrementor = $state(1);
    
    increment() {
      this.count += this.incrementor;
    }
    
    resetCount() {
      this.count = 0;
    }
    
    resetIncrementor() {
      this.incrementor = 1;
    }
  }

  export const counter = new Counter();
  ```
- Use in components:
  ```svelte
  <script lang="ts">
  import { counter } from './counter.svelte.ts';
  </script>

  <button on:click={() => counter.increment()}>
    Count: {counter.count}
  </button>
  ```

Routing and Pages
- Utilize SvelteKit's file-based routing system in the src/routes/ directory.
- Implement dynamic routes using [slug] syntax.
- Use load functions for server-side data fetching and pre-rendering.
- Implement proper error handling with +error.svelte pages.

Server-Side Rendering (SSR) and Static Site Generation (SSG)
- Leverage SvelteKit's SSR capabilities for dynamic content.
- Implement SSG for static pages using prerender option.
- Use the adapter-auto for automatic deployment configuration.

Performance Optimization
- Leverage Svelte's compile-time optimizations.
- Use `{#key}` blocks to force re-rendering of components when needed.
- Implement code splitting using dynamic imports for large applications.
- Profile and monitor performance using browser developer tools.
- Use `$effect.tracking()` to optimize effect dependencies.
- Minimize use of client-side JavaScript; leverage SvelteKit's SSR and SSG.
- Implement proper lazy loading for images and other assets.

Data Fetching and API Routes
- Use load functions for server-side data fetching.
- Implement proper error handling for data fetching operations.
- Create API routes in the src/routes/api/ directory.
- Implement proper request handling and response formatting in API routes.
- Use SvelteKit's hooks for global API middleware.

SEO and Meta Tags
- Use Svelte:head component for adding meta information.
- Implement canonical URLs for proper SEO.
- Create reusable SEO components for consistent meta tag management.

Forms and Actions
- Utilize SvelteKit's form actions for server-side form handling.
- Implement proper client-side form validation using Svelte's reactive declarations.
- Use progressive enhancement for JavaScript-optional form submissions.

Internationalization (i18n) with Paraglide.js
- Use Paraglide.js for internationalization: https://inlang.com/m/gerre34r/library-inlang-paraglideJs
- Install Paraglide.js: `npm install @inlang/paraglide-js`
- Set up language files in the `languages` directory.
- Use the `t` function to translate strings:
  ```svelte
  <script>
  import { t } from '@inlang/paraglide-js';
  </script>

  <h1>{t('welcome_message')}</h1>
  ```
- Support multiple languages and RTL layouts.
- Ensure text scaling and font adjustments for accessibility.

Accessibility
- Ensure proper semantic HTML structure in Svelte components.
- Implement ARIA attributes where necessary.
- Ensure keyboard navigation support for interactive elements.
- Use Svelte's bind:this for managing focus programmatically.

Key Conventions
1. Embrace Svelte's simplicity and avoid over-engineering solutions.
2. Use SvelteKit for full-stack applications with SSR and API routes.
3. Prioritize Web Vitals (LCP, FID, CLS) for performance optimization.
4. Use environment variables for configuration management.
5. Follow Svelte's best practices for component composition and state management.
6. Ensure cross-browser compatibility by testing on multiple platforms.
7. Keep your Svelte and SvelteKit versions up to date.

Documentation
- Svelte 5 Runes: https://svelte-5-preview.vercel.app/docs/runes
- Svelte Documentation: https://svelte.dev/docs
- SvelteKit Documentation: https://kit.svelte.dev/docs
- Paraglide.js Documentation: https://inlang.com/m/gerre34r/library-inlang-paraglideJs/usage

Refer to Svelte, SvelteKit, and Paraglide.js documentation for detailed information on components, internationalization, and best practices.

## Minimalist Design Language

The website follows a contemplative, minimalist design language inspired by the quotes page. This aesthetic should be applied consistently across all pages.

### Core Principles

1. **Typography First**
   - Use `font-extralight` for main content (headlines, quotes)
   - Use `font-light` for body text and secondary content
   - Use `font-normal` sparingly, only for emphasis
   - Uppercase with wide letter-spacing (`tracking-[0.2em]`) for labels and metadata
   - No bold fonts unless absolutely necessary

2. **Spacious Layouts**
   - Full viewport height sections where appropriate (`h-[calc(100vh-5rem)]`)
   - Generous whitespace between elements (`mb-20` for major sections)
   - Centered content with breathing room (`max-w-4xl mx-auto px-8`)
   - Empty space is a design element, not wasted space

3. **Monochromatic Palette**
   - Primary colors through opacity: `foreground/10`, `foreground/20`, `foreground/40`
   - Muted colors for secondary text: `text-muted-foreground`
   - No bright accent colors or colorful badges
   - Subtle gradients only (e.g., `from-foreground/[0.02] to-transparent`)

4. **Subtle Interactions**
   - Slow, deliberate transitions (1000ms for major transitions)
   - Fade effects over slide or scale animations
   - Minimal borders that appear on hover (`border-foreground/10 hover:border-foreground/30`)
   - Ghost buttons with subtle backgrounds
   - No bouncy, playful, or attention-grabbing animations

5. **No Decorative Elements**
   - No icons (phosphor-svelte or otherwise) unless functionally necessary
   - No emojis or playful elements
   - No cards or boxes - use open layouts with subtle dividers
   - Thin lines (`h-px`) for visual separation

6. **Contemplative Pacing**
   - Long transition durations create a meditative feel
   - Auto-advancing content (like quotes) every 10 seconds
   - Smooth scrolling between sections
   - Ambient background music at low volume (20%)

### Implementation Examples

**Instead of cards:**
```svelte
<!-- Don't use this -->
<Card class="p-6">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
</Card>

<!-- Use this -->
<div class="py-8 border-b border-foreground/10">
  <h2 class="text-2xl font-extralight mb-4">Title</h2>
</div>
```

**For metadata:**
```svelte
<!-- Don't use this -->
<div class="flex items-center gap-2">
  <Calendar class="w-4 h-4" />
  <span>Jan 1, 2024</span>
</div>

<!-- Use this -->
<p class="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light">
  Jan 1, 2024
</p>
```

**For buttons:**
```svelte
<button class="group relative px-8 py-3 text-sm uppercase tracking-[0.2em] font-light
               border border-foreground/20 hover:border-foreground/40 
               transition-all duration-500">
  <span class="relative z-10">Next</span>
  <div class="absolute inset-0 bg-foreground/5 scale-x-0 group-hover:scale-x-100 
               transition-transform duration-500 origin-left"></div>
</button>
```