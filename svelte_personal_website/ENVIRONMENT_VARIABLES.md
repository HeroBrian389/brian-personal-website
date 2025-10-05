# Environment Variables Configuration

This document describes the environment variables used in the SvelteKit application.

## Setup

1. Copy `.env.example` to `.env`:

    ```bash
    cp .env.example .env
    ```

2. Update the values in `.env` with your actual configuration.

## Variables

### Server-side Variables (Private)

These variables are only available on the server and should contain sensitive information:

- `GITHUB_USERNAME` - Your GitHub username for fetching contribution data
- `NOTION_ROOT_PAGE_ID` - The root page ID for your Notion workspace
- `NOTION_PAGE_OVERTHINKING_VS_MISTHINKING` - Notion page ID for the "Overthinking vs Misthinking" article
- `NOTION_PAGE_WHY_DO_WE_COLLECT_STORIES` - Notion page ID for the "Why Do We Collect Stories" article
- `NOTION_PAGE_GOOD_WRITING_STEALS_SOUL` - Notion page ID for the "Good Writing Steals Soul" article
- `NOTION_PAGE_WITNESS_TO_OUR_LIVES` - Notion page ID for the "Witness to Our Lives" article
- `NOTION_PAGE_CURE_SOUL_BY_SENSES` - Notion page ID for the "Cure Soul by Senses" article
- `NOTION_PAGE_LEINSTER_FINAL_SPEECH` - Notion page ID for the "Leinster Final Speech" article

### Client-side Variables (Public)

These variables are available in both server and client code. They must be prefixed with `PUBLIC_`:

- `PUBLIC_GITHUB_PROFILE_URL` - Full URL to your GitHub profile
- `PUBLIC_LINKEDIN_PROFILE_URL` - Full URL to your LinkedIn profile
- `PUBLIC_EMAIL_ADDRESS` - Your contact email address
- `PUBLIC_GOOGLE_ANALYTICS_ID` - Google Analytics 4 measurement ID (e.g., `G-XXXXXXXXXX`)

## Usage in Code

### Server-side usage:

```typescript
import { env } from "$env/dynamic/private";

const username = env.GITHUB_USERNAME;
```

### Client-side usage:

```typescript
import { env } from "$env/dynamic/public";

const githubUrl = env.PUBLIC_GITHUB_PROFILE_URL;
```

## Security Notes

- Never commit your `.env` file to version control
- Keep sensitive information in server-side variables only
- Use the `PUBLIC_` prefix only for non-sensitive data that can be exposed to the client
