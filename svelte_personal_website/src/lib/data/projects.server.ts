import { readFile } from "fs/promises";
import { join } from "path";
import type { ProjectMeta } from "./projects.schema";
import { getAllProjectMetas, getProjectMeta } from "./projects-meta";

// Path to project content markdown files
const CONTENT_DIR = join(process.cwd(), "src/lib/data/projects/content");

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

async function getProjectContent(slug: string): Promise<string | null> {
	try {
		const filePath = join(CONTENT_DIR, `${slug}.md`);
		const content = await readFile(filePath, "utf-8");
		return content;
	} catch (error) {
		console.warn(`[projects.server.ts] Could not read content for ${slug}:`, error);
		return null;
	}
}

export async function getProjectBySlug(slug: string) {
	console.log("[projects.server.ts] Getting project by slug:", slug);

	const meta = getProjectMeta(slug);

	if (!meta) {
		console.log("[projects.server.ts] No project found for slug:", slug);
		return null;
	}

	console.log("[projects.server.ts] Found project:", meta.title);

	// Read the markdown content from the separate file
	const longDescription = await getProjectContent(slug);

	const result = {
		...meta,
		longDescription: longDescription || "",
		codeSnippet: meta.codeSnippet
	};

	console.log("[projects.server.ts] Returning project data:", {
		slug: result.slug,
		hasLongDescription: !!result.longDescription,
		longDescriptionLength: result.longDescription?.length || 0
	});

	return result;
}
