import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getProjectBySlug } from '$lib/data/projects.server';
import { renderMarkdown } from '$lib/utils/markdown';

export const load: PageServerLoad = async ({ params }) => {
  console.log('[+page.server.ts] Loading project with slug:', params.slug);
  
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    console.error('[+page.server.ts] Project not found for slug:', params.slug);
    error(404, 'Project not found');
  }

  console.log('[+page.server.ts] Project found:', {
    title: project.title,
    slug: project.slug,
    hasLongDescription: !!project.longDescription,
    longDescriptionLength: project.longDescription?.length || 0,
    longDescriptionPreview: project.longDescription?.substring(0, 100)
  });

  const rendered = project.longDescription ? await renderMarkdown(project.longDescription) : '';
  
  console.log('[+page.server.ts] Markdown rendered:', {
    hasRenderedContent: !!rendered,
    renderedLength: rendered.length,
    renderedPreview: rendered.substring(0, 100)
  });

  return {
    project: { ...project, renderedLongDescription: rendered }
  };
};


