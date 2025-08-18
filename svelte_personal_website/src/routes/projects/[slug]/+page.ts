import { getProjectBySlug } from '$lib/data/projects';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const project = getProjectBySlug(params.slug);
	
	if (!project) {
		error(404, 'Project not found');
	}
	
	return {
		project
	};
};