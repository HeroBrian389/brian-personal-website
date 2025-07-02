// src/routes/sitemap.xml/+server.ts

import { getPublishedPosts } from '$lib/notion/service';

// IMPORTANT: Change this to your production domain
const siteURL = 'https://briankelleher.ie';

// List of static pages
const staticPages = [
  '/',
  '/about',
  '/art',
  '/ponder',
  '/quotes',
  '/writing'
];

/** @type {import('./$types').RequestHandler} */
export async function GET({ setHeaders }) {
  setHeaders({
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
  });

  const posts = await getPublishedPosts();

  const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="https://www.w3.org/1999/xhtml"
      xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
      xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
      <!-- Static Pages -->
      ${staticPages
        .map(
          (page) => `
        <url>
          <loc>${siteURL}${page}</loc>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `
        )
        .join('')}

      <!-- Dynamic Pages (Writing) -->
      ${posts
        .map(
          (post) => `
        <url>
          <loc>${siteURL}/writing/${post.slug}</loc>
          <changefreq>weekly</changefreq>
          <lastmod>${new Date(post.date).toISOString()}</lastmod>
          <priority>0.8</priority>
        </url>
      `
        )
        .join('')}
    </urlset>`;

  return new Response(sitemap.trim());
}
