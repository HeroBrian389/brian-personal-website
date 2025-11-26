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
		slug: "nature-of-work-in-age-of-ai",
		title: "The nature of work in the Age of AI",
		publishedAt: "2025-11-26",
		readingTimeMinutes: 9,
		summary:
			"As AI progress continues to accelerate, our relationship with work will change. The kinds of work we do will evolve, but so will the proportion and nature of the work.",
		body: [
			{
				type: "paragraph",
				text: `As AI progress continues to accelerate, our relationship with work will change. The kinds of work we do will evolve, but so will the proportion and nature of the work.`
			},
			{
				type: "paragraph",
				text: `AI has unlocked and will continue to unlock new kinds of work. There are trivial examples of new work like "prompt engineer" and "evals engineer" that are directly created as a result of advanced large language models (LLMs), but more interestingly, there are new ways of applying the technology. Like revolutionary inventions before it, technologists and innovators will apply AI to further science, push back the frontier of knowledge, and improve economic efficiency. Already, we have seen nascent examples of this, like customer service agents, AI coders, and general-purpose chatbots.`
			},
			{
				type: "paragraph",
				text: `As impressive as contemporary agents are, they have serious limitations. They hallucinate (make things up), make mistakes, and misinterpret. They have poor epistemic access and are generally unable to tell whether they are correct when answering a difficult question. They lack key context about your personal and professional life which severely limits their usefulness, and even if you spend time educating them about the nuances of your life, all progress is lost when you open a new chat. In other words, they operate like eager junior employees you have just hired.`
			},
			{
				type: "paragraph",
				text: `We should recognise and adapt to AI's shortcomings, rather than losing all hope in the technology and ridding ourselves of it entirely. We should treat it like an eager junior employee: one who is prone to mistakes, assumptions, and forgetfulness. Analogies from the real world can help with this. Let's consider for a moment what kind of workflows you might use if you hired a junior lawyer.`
			},
			{
				type: "paragraph",
				text: `Each day, you might carefully plan out the work they will do. You would think about which systems they need access to and the tools they require to do a good job. You would periodically check in to ensure they are on the right track and help if they face issues. Finally, when they are confident they have completed the piece of work, it will be passed off for review. For straightforward work, you might give it a cursory glance, and for more complex tasks, you would analyse every line in detail.`
			},
			{
				type: "paragraph",
				text: `Contrast this with how people work with AI. Most people spend 30 seconds writing a prompt, 1 minute reviewing the output, and if it isn't perfect, they gasp in exasperation and proclaim, "AI is useless, I'm never using it again". Indeed, AI work is far from what the best humans can produce, and in some domains, the AI output is unusable, regardless of the time and effort spent on improving the system.`
			},
			{
				type: "paragraph",
				text: `However, I think that there is a tendency to work with AI systems like you would a human without recognising the fundamental limitations and differences between them. If people spent the same amount of time planning, prompting, and reviewing AI work as human work, I think the results would be as good, if not better than a junior employee. As people become more comfortable with these systems (and in particular, their limitations), they will become more proficient at delegation to AI.`
			},
			{
				type: "paragraph",
				text: `Over time, expert humans find their workday comprises planning and reviewing with little execution; at least, this has been my experience with software development. I now delegate the vast majority of software development tasks to my collection of agents. AI's exhaustive memory, attention to detail, and speed of iteration mean that I operate in a supervisor role, ensuring that the agent stays on task and helping it evaluate more nuanced architectural decisions. My agents run in parallel, and my time is now spent directing them or checking their work.`
			},
			{
				type: "paragraph",
				text: `This trend away from execution and towards verification raises important questions about the nature of verification. We should ask: what other ways are there to verify a piece of work? Is a human required to do the verification? Is the verification expensive? Is it even possible to verify this piece of work? I believe the answer to each of these questions will tell us a lot about what will emerge in the coming years.`
			},
			{
				type: "paragraph",
				text: `Consider "What other ways are there to verify a piece of work?" If AI generates code, we can read over the code to see if it compiles, or we can use a compiling tool. We can read over the code to spot errors, or we can use an error-checking tool. We can read over the code to identify business logic issues, or we can run business logic tests. In each case, we can use tools to improve autonomous verification, giving the AI agent greater capacity to work on very difficult tasks, given that it can now easily check its own work.`
			},
			{
				type: "paragraph",
				text: `Next, we might ask, "Is a human required to do the verification?" This will be particularly salient in the coming years, given the popularity of AI in regulated fields like medicine, law, and finance, where the stakes are high and the penalties for failure are large. As AI systems become more capable, though, I think it is highly likely we will see a new class of insurance products emerge specifically for AI agents. Humans, like AI, make mistakes, and that is why, in most cases, we mandate that they acquire insurance to protect themselves and the people they harm. I see no reason this couldn't be extended to sufficiently accurate and intelligent AI.`
			},
			{
				type: "paragraph",
				text: `I find the insurance idea compelling because it seems to be a simple risk calculation. As a risk underwriter, the only relevant factors are: what is the risk of a given event, how much it costs if the event happens, and the propensity of your competitors to offer insurance at a given price. Given that people are largely fearful of AI, the firms willing to offer insurance will be able to charge a premium. This is especially noteworthy given that many AI systems outperform professionals (e.g. AI doctors had 91% accuracy in differential diagnosis, compared to 75% for humans, Goh E, Gallo R, Hom J, et al. 2024) and that this accuracy will continue to improve. These accurate AI systems will result in fewer insurance payouts, all while paying inflated insurance premiums due to irrationality and fear around their efficacy.`
			},
			{
				type: "paragraph",
				text: `Now, we may ask, "Is verification expensive?" Some verification, like running a code compile check, will cost microcents of energy, and other verification, like drug discovery trials, will cost billions. The extent to which AI work can be verified cheaply will strongly influence its adoption, and in particular, the change that happens in a given industry. The cost of verification is part of a broader class of problems which relate to bottlenecks. In some cases, the bottleneck in an industry is intellectual labour, but often there are regulatory, physical, and sociological barriers preventing a faster rate of progress.`
			},
			{
				type: "paragraph",
				text: `Lastly, we ponder, "Is it even possible to verify this piece of work?" In particular, I think this is relevant in cases where verification is impossible and where work relates to taste. It is hard to know how a piece of art will be received by a wider audience: the litany of terrible movies, music, and advertisement campaigns attests to this. I'm sure we all remember when Kylie Jenner solved racism with a can of Pepsi.`
			},
			{
				type: "paragraph",
				text: `As well as public reception, even the leap from idea to implementation can be hard to conceptualise or communicate. Some of the most prolific directors and founders have a singular and unrelenting taste, which can be difficult to appreciate against the safety of statistical arbitrage, where key decisions are made with A/B tests. Steve Jobs famously refused to do market surveys of new product features: a philosophy undoubtedly drawn from the realisation that great things are not produced from consensus.`
			},
			{
				type: "paragraph",
				text: `As well as being difficult to verify, opinionated strategy decisions and the public perception of art can take decades to unfold. When Netflix cannibalised its DVD shipping business, it wasn't clear that its movie streaming business would become the behemoth it is today. Similarly, hallowed artists like Vincent Van Gogh were considered unremarkable in their time, and only now do we recognise him as an exceptional artist. Unpredictable decisions, which require time to mature, are difficult to calibrate against.`
			},
			{
				type: "paragraph",
				text: `In other words, for certain work, verification of a choice or artistic vision takes years, decades or centuries. Of course, what you optimise for affects the ability of AI to verify that it made a good decision. For instance, it may be easier to predict and verify whether a superhero franchise movie will be profitable over 5 years when compared to a timeless cult classic. Regardless, verification is difficult for uncertain decisions over long time horizons.`
			},
			{
				type: "paragraph",
				text: `This uncertainty, combined with the high monetary and opportunity costs, will prevent AI from being the ultimate decision maker in matters of design and strategy in the near future. However, despite AI's limitations in this area, I think it will be used by decision makers, artists, and founders to iterate, prototype, and research significantly faster than before. It will reduce barriers to entry and enable new kinds of expression and experimentation.`
			},
			{
				type: "paragraph",
				text: `Ultimately, we can predict the rate at which AI will change a given job or industry by how easily its output can be verified. Our work will shift from doing to verification. Expert humans will have the greatest leverage, as they can most quickly review complex outputs in their field.`
			},
			{
				type: "paragraph",
				text: `In medicine, education, and law, informal uses of AI will proliferate quickly while institutional adoption will take decades. For readers interested in thriving in the age of AI, I recommend becoming intimately familiar with AI to deeply understand its limitations and strengths. Use it daily on problems in your professional and personal life, and think about how you would have responded differently if you were the AI. It will also be valuable to pick an area where verification is difficult, expensive, or forbidden.`
			}
		]
	},
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
