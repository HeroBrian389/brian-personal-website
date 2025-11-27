import type { ProjectMeta } from "./projects.schema";
import { getAllProjectMetas, getProjectMeta } from "./projects-meta";

// Static content is served from /projects/content/*.md (placed in static/)
const CONTENT_BASE_PATH = "/projects/content";

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

async function getProjectContent(slug: string, fetchFn: typeof fetch): Promise<string | null> {
	try {
		const response = await fetchFn(`${CONTENT_BASE_PATH}/${slug}.md`);
		if (!response.ok) {
			console.warn(
				`[projects.server.ts] Could not fetch content for ${slug}: ${response.status} ${response.statusText}`
			);
			return null;
		}

		const content = await response.text();
		return content;
	} catch (error) {
		console.warn(`[projects.server.ts] Could not read content for ${slug}:`, error);
		return null;
	}
}

export async function getProjectBySlug(slug: string, fetchFn: typeof fetch) {
	const meta = getProjectMeta(slug);

	if (!meta) {
		return null;
	}

	// Fetch the markdown content from static assets
	const longDescription = await getProjectContent(slug, fetchFn);

	const result = {
		...meta,
		longDescription: longDescription || "",
		codeSnippet: meta.codeSnippet
	};

	return result;
}
