import { env } from "$env/dynamic/private";

// Site configuration - uses environment variables with fallbacks
export const NOTION_CONFIG = {
	rootPageId: env["NOTION_ROOT_PAGE_ID"] || "149c09c3c6044fd495248cacffd5cf05",
	// Add specific writing page IDs here
	writingPages: {
		"overthinking-vs-misthinking":
			env["NOTION_PAGE_OVERTHINKING_VS_MISTHINKING"] ||
			"26a5b55f-f5bd-405d-aaf0-a96979d817eb",
		"why-do-we-collect-stories":
			env["NOTION_PAGE_WHY_DO_WE_COLLECT_STORIES"] || "44b00c27-5430-4b65-95c8-f78097dd8e82",
		"good-writing-steals-soul":
			env["NOTION_PAGE_GOOD_WRITING_STEALS_SOUL"] || "6ffc4de7-f506-4421-bef1-1db03b8bd4cd",
		"witness-to-our-lives":
			env["NOTION_PAGE_WITNESS_TO_OUR_LIVES"] || "943ccbc2-08b0-4941-9f14-f0a16aa000fc",
		"cure-soul-by-senses":
			env["NOTION_PAGE_CURE_SOUL_BY_SENSES"] || "97add8d8-fb23-4a00-bb75-b1c651b6ac6a",
		"leinster-final-speech":
			env["NOTION_PAGE_LEINSTER_FINAL_SPEECH"] || "b2197937-3321-442f-8376-117a3a55f08d"
	}
};
