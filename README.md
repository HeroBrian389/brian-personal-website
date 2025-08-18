# Brian Kelleher's Personal Website

This repository contains two implementations of Brian Kelleher's website. The original **Notion** version was built with Next.js and is now archived for reference only. The **SvelteKit** version is the active codebase.

## Projects

| Path | Description |
|------|-------------|
| [`svelte_personal_website/`](./svelte_personal_website) | Active SvelteKit implementation with a minimalist design language. |
| [`archive/notion_site/`](./archive/notion_site) | Legacy Next.js site using Notion as a CMS (archived). |

## Design Manifesto

The Svelte site adopts a contemplative minimalism:

- **Typography first** – extralight headlines, light body text and wide uppercase labels.
- **Spacious layouts** – generous whitespace and full-height sections.
- **Monochromatic palette** – subtle shades of the foreground with muted text.
- **Subtle interactions** – long fade transitions and ghost buttons with minimal borders.
- **No decorative clutter** – icons or bold elements only when necessary.

## Getting Started

### Notion Site (archived)

This codebase is no longer maintained and has been moved to the archive folder.

```bash
cd archive/notion_site
npm install            # install dependencies
npm run dev            # run locally
npm run build          # build for production
npm start              # start production server
```

### Svelte Site

```bash
cd svelte_personal_website
npm install            # install dependencies
npm run dev            # run locally
npm run build          # build for production
npm run preview        # preview the production build
```

## Related Documentation

- [`CLAUDE.md`](./CLAUDE.md) — overall project guidelines, Svelte conventions and design language.
- [`archive/notion_site/CLAUDE.md`](./archive/notion_site/CLAUDE.md) — architecture and development tips for the archived Next.js site.

Feel free to explore each directory's README for more detailed usage instructions.
