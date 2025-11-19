export interface LocalWritingPost {
  slug: string;
  title: string;
  publishedAt: string; // ISO date string
  summary: string;
  heroImage: {
    src: string;
    alt: string;
  };
  readingTimeMinutes: number;
}

export const localWritingPosts: LocalWritingPost[] = [
  {
    slug: "edge-city-fellows",
    title: "Edge City Fellows, Patagonia",
    publishedAt: "2025-11-19",
    summary:
      "Edge offered rare time for deep AI work, long proofs, contraband border runs, and the kindest technologists I know.",
    heroImage: {
      src: "/writing/edge-city/edge-city-01.jpeg",
      alt: "Edge City Fellows pausing for a photo on a ridge above Lago Lácar"
    },
    readingTimeMinutes: 6
  }
];
