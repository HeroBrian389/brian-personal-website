export function extractYouTubeId(url?: string | null, id?: string | null): string | null {
	if (id) return id;
	if (!url) return null;
	try {
		const parsed = new URL(url);
		if (parsed.hostname.includes("youtu.be")) {
			const segments = parsed.pathname.split("/").filter(Boolean);
			return segments[0] ?? null;
		}
		const vParam = parsed.searchParams.get("v");
		if (vParam) return vParam;
		if (parsed.pathname.includes("/embed/")) {
			const parts = parsed.pathname.split("/embed/");
			if (parts[1]) {
				const [first] = parts[1].split("/");
				return first ?? null;
			}
		}
	} catch {
		return null;
	}
	return null;
}

export function youTubeThumbnailUrl(id?: string | null): string | null {
	if (!id) return null;
	return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
