import type { ProjectMeta } from "./projects.schema";
import { getAllProjectMetas, getProjectData } from "./projects-data";

export function invalidateProjectsCache(): void {
	// No-op since we're using static data now
}

export async function getAllProjects(): Promise<ProjectMeta[]> {
	const metas = getAllProjectMetas();

	const score = (meta: ProjectMeta) => {
		// Prefer full ISO dates; fall back to year; otherwise 0
		if (meta.date) {
			// Allow bare years like "2025" or full dates
			const parsed = Date.parse(meta.date.length === 4 ? `${meta.date}-01-01` : meta.date);
			if (!Number.isNaN(parsed)) return parsed;
		}
		if (meta.year) return meta.year;
		return 0;
	};

	// Newest first
	return metas.sort((a, b) => score(b) - score(a));
}

export async function getProjectBySlug(slug: string) {
	console.log("[projects.server.ts] Getting project by slug:", slug);

	const projectData = getProjectData(slug);

	if (!projectData) {
		console.log("[projects.server.ts] No project found for slug:", slug);
		return null;
	}

	console.log("[projects.server.ts] Found project:", projectData.meta.title);

	const result = {
		...projectData.meta,
		longDescription: projectData.longDescription,
		codeSnippet: projectData.meta.codeSnippet
	};

	console.log("[projects.server.ts] Returning project data:", {
		slug: result.slug,
		hasLongDescription: !!result.longDescription,
		longDescriptionLength: result.longDescription?.length || 0
	});

	return result;
}
