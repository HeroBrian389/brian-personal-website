import { fetchNotionPage } from '$lib/notion/service';
import { NOTION_CONFIG } from '$lib/notion/config.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const pageIds = Object.values(NOTION_CONFIG.writingPages);
    const pages = await Promise.all(pageIds.map(id => fetchNotionPage(id)));
    const writingPages = pages.filter((p): p is NonNullable<typeof p> => p !== null);
    
    // Create a mapping of page IDs to slugs
    const pageIdToSlug: Record<string, string> = {};
    Object.entries(NOTION_CONFIG.writingPages).forEach(([slug, pageId]) => {
      pageIdToSlug[pageId] = slug;
    });
    
    return {
      writingPages,
      pageIdToSlug
    };
  } catch (error) {
    console.error('Error loading writing pages:', error);
    return {
      writingPages: [],
      pageIdToSlug: {},
      error: 'Failed to load writing pages'
    };
  }
};