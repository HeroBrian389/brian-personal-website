import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { talks } from "$lib/data/talks";

export const prerender = false;

export const load: PageLoad = ({ params }) => {
	const talk = talks.find((t) => t.slug === params.slug);
	if (!talk) {
		throw error(404, "Talk not found");
	}

	return {
		talk
	};
};
