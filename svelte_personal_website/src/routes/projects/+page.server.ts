import type { PageServerLoad } from "./$types";
import { getAllProjects } from "$lib/data/projects.server";

export const load: PageServerLoad = async () => {
	const projects = await getAllProjects();
	return { projects };
};
