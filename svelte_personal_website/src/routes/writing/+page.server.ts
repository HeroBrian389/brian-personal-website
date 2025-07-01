import { fetchAllWritingPages } from '$lib/notion/service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const writingPages = await fetchAllWritingPages();
    return {
      writingPages
    };
  } catch (error) {
    console.error('Error loading writing pages:', error);
    return {
      writingPages: [],
      error: 'Failed to load writing pages'
    };
  }
};