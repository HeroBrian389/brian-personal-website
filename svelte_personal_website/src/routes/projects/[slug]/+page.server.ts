import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getProjectBySlug } from '$lib/data/projects.server';
import { renderMarkdown } from '$lib/utils/markdown';

export const load: PageServerLoad = async ({ params }) => {
  const project = await getProjectBySlug(params.slug);
  if (!project) error(404, 'Project not found');

  const rendered = project.longDescription ? await renderMarkdown(project.longDescription) : '';

  return {
    project: { ...project, renderedLongDescription: rendered }
  };
};


