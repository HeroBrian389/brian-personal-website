export type LocalWritingBlock =
	| { type: "paragraph"; text: string }
	| { type: "image"; src: string; alt: string; caption?: string };

export interface LocalWritingPost {
	slug: string;
	title: string;
	publishedAt: string; // ISO date
	readingTimeMinutes: number;
	summary: string;
	heroImage?: {
		src: string;
		alt: string;
	};
	body: LocalWritingBlock[];
}

export const localWritingPosts: LocalWritingPost[] = [
	{
		slug: "edge-city-fellows",
		title: "Edge City Fellows, Patagonia",
		publishedAt: "2025-11-19",
		readingTimeMinutes: 6,
		summary:
			"I’m Brian Kelleher, one of the Edge City Fellows in Patagonia. At heart, I’m a technologist and entrepreneur.",
		heroImage: {
			src: "/writing/edge-city/edge-city-01.jpeg",
			alt: "Edge City Fellows on a ridge above Lago Lácar"
		},
		body: [
			{
				type: "paragraph",
				text: "I’m Brian Kelleher, one of the Edge City Fellows in Patagonia. At heart, I’m a technologist and entrepreneur. When I was 12, I built a movie streaming website to watch TV in school and developed machine learning models to predict house prices. Patch, a young person accelerator, introduced me to the world of entrepreneurship, and from that experience, I founded Microdoc, which uses AI to automate paperwork for doctors and hospitals."
			},
			{
				type: "image",
				src: "/writing/edge-city/edge-city-01.jpeg",
				alt: "Edge City Fellows pausing above Lago Lácar",
				caption: "Laguna loops with the Edge City cohort"
			},
			{
				type: "paragraph",
				text: "As well as technology, I am fascinated with math. In college, I studied mathematics and economics and threw myself into proofs, theorems, and lemmas. It was a fascinating time to be a student – ChatGPT debuted at the beginning of my studies, and I had the opportunity to witness firsthand the co-evolution of academia and AI. It was clear then that AI would radically change how we push back the frontier of knowledge in all the expected ways and some which would be surprising."
			},
			{
				type: "paragraph",
				text: "My background in mathematics and AI inspired me to consider how I could help build systems to further mathematical research. During Edge, I set out to use AI to prove a novel mathematical result. In particular, I was interested in the Erdős problems, a set of conjectures formulated by prolific mathematician Paul Erdős. To solve this problem, I developed a 4-stage AI pipeline comprising 4 sections: literature review, tractability assessment, approach analysis, and the proving framework."
			},
			{
				type: "image",
				src: "/writing/edge-city/edge-city-02.jpg",
				alt: "Standing by a waterfall in Patagonia",
				caption: "Waterfall scouting between proof runs"
			},
			{
				type: "paragraph",
				text: "My system analysed hundreds of problems before selecting the one it thought was most tractable. After that, the system worked autonomously for days, proving, reviewing, and iterating, until it was confident that it had a solution to the problem. I used an orchestration of AI models: GPT-5-pro, GPT-5 thinking high, and GPT-5-codex. Each had a distinct role in the recursive process to explore the textual search space of possible mathematical statements."
			},
			{
				type: "paragraph",
				text: "In the end, the system produced an approach which the system believes would resolve Erdős's problem 1. Over the coming weeks, I will work with advisors, mathematicians, and professors to rigorously validate the correctness, with the goal of submitting this piece of work for peer review."
			},
			{
				type: "image",
				src: "/writing/edge-city/edge-city-03.jpg",
				alt: "Late-night Edge City gathering",
				caption: "Edge DJs keeping the after-hours experiments alive"
			},
			{
				type: "paragraph",
				text: "Edge was a great opportunity to get deep, focused work done, but it was also a chance to try new things, meet interesting people, and more deeply understand myself. I did Gnosis Meditation, went on hikes, and had late-night sauna chats. I crossed into Chile illegally on a weekend trip and got chased back by border control. I had countless avocado toasts in Forastera, always surrounded by a colony of caffeinated Edge City goers."
			},
			{
				type: "image",
				src: "/writing/edge-city/edge-city-04.jpg",
				alt: "Red walkways at the termas",
				caption: "Termas geométricas reset"
			},
			{
				type: "paragraph",
				text: "What makes Edge special is its capacity for experimentation. You are free to try unusual things, think in new ways, and find your tribe. Edge is ultimately what you make of it, whether that is volleyball tournaments, neuroscience research, or dinivation."
			},
			{
				type: "image",
				src: "/writing/edge-city/edge-city-05.jpg",
				alt: "Volcán Lanín at sunset",
				caption: "Lanín reminding us to keep climbing"
			},
			{
				type: "paragraph",
				text: "As this month draws to a close, I have a chance to reflect. On the work I did, the new things I tried, and the people I met. Stimulating conversations, deep work, and exploration. The impressive technologists, thinkers, and innovators I had the privilege of learning from. Although there is much to miss about Edge, the thing I will miss above all is the kindness and friendliness of the people here. As we depart back to our normal lives, I hope that I can carry a piece of Edge with me, and that I have left a piece of me behind for Edge."
			}
		]
	}
];

export const localWritingMap = Object.fromEntries(
	localWritingPosts.map((post) => [post.slug, post])
);
