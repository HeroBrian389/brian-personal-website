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
		const pageIds = Object.values(NOTION_CONFIG.writingPages);
		const pages = await Promise.all(pageIds.map((id) => fetchNotionPage(id)));
		const writingPages = pages.filter((p): p is NonNullable<typeof p> => p !== null);

		const notionEntries: WritingListEntry[] = writingPages.map((page) => {
			const slug =
				Object.entries(NOTION_CONFIG.writingPages).find(([, pageId]) => pageId === page.id)?.[0] ||
				page.id;
			const excerpt = page.blocks[0]?.content?.map((content) => content.text).join("") || "";
			return {
				slug,
				title: page.title,
				excerpt,
				date: page.metadata.lastEditedTime,
				source: "notion"
			};
		});

		const localEntries: WritingListEntry[] = localWritingPosts.map((post) => ({
			slug: post.slug,
			title: post.title,
			excerpt: post.summary,
			date: new Date(post.publishedAt).getTime(),
			source: "local",
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
