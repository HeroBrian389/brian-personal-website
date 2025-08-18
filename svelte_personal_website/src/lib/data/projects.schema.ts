import { z } from 'zod';

export const ProjectMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  technologies: z.array(z.string()),
  highlights: z.array(z.string()).optional(),
  link: z.string().url().optional(),
  demo: z.string().url().nullable().optional(),
  github: z.string().url().optional(),
  date: z.string().optional(),
  year: z.number().optional(),
  featured: z.boolean().optional(),
  category: z.enum(['ai', 'web', 'infrastructure', 'other']).optional(),
  codeSnippet: z
    .object({
      language: z.string(),
      code: z.string().optional(),
      path: z.string().optional()
    })
    .optional()
});

export type ProjectMeta = z.infer<typeof ProjectMetaSchema>;


