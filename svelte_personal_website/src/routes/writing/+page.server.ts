import { localWritingPosts } from "$lib/content/writing/local-posts";
import { fetchNotionPage } from "$lib/notion/service";
import { NOTION_CONFIG } from "$lib/notion/config.server";
import type { PageServerLoad } from "./$types";

type WritingListEntry = {
	slug: string;
	title: string;
	excerpt: string;
	date: number;
	source: "notion" | "local";
	heroImage?: { src: string; alt: string };
	readingTimeMinutes?: number;
};

export const load: PageServerLoad = async () => {
	try {
		const notionEntries = await loadNotionEntries();
		const localEntries = localWritingPosts.map((post) => ({
			slug: post.slug,
			title: post.title,
			excerpt: post.summary,
			date: new Date(post.publishedAt).getTime(),
			source: "local" as const,
			heroImage: post.heroImage,
			readingTimeMinutes: post.readingTimeMinutes
		}));

		const combined = [...notionEntries, ...localEntries].sort((a, b) => b.date - a.date);

		return {
			writingPages: combined
		};
	} catch (error) {
		console.error("Error loading writing pages:", error);
		return {
			writingPages: [],
			error: "Failed to load writing pages"
		};
	}
};

async function loadNotionEntries(): Promise<WritingListEntry[]> {
	const entries: WritingListEntry[] = [];
	const slugsAndIds = Object.entries(NOTION_CONFIG.writingPages);

	await Promise.all(
		slugsAndIds.map(async ([slug, pageId]) => {
			const page = await fetchNotionPage(pageId);
			if (!page) return;
			entries.push({
				slug,
				title: page.title,
				excerpt: page.blocks[0]?.content?.map((content) => content.text).join("") || "",
				date: page.metadata.lastEditedTime,
				source: "notion"
			});
		})
	);

	return entries;
}
