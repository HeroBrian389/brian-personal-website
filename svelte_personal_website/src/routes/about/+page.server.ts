import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Return empty object since we'll fetch GitHub contributions client-side
  return {};
};