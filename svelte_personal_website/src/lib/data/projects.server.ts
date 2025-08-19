import { ProjectMetaSchema, type ProjectMeta } from './projects.schema';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const perProjectDir = resolve('src/lib/data/projects');

async function loadAllProjectMetas(): Promise<ProjectMeta[]> {
  const files = await readdir(perProjectDir);
  const jsonFiles = files.filter((f) => f.endsWith('.json') && f !== 'index.json');
  const metas: ProjectMeta[] = [];
  for (const file of jsonFiles) {
    const raw = await readFile(join(perProjectDir, file), 'utf8');
    const parsed = JSON.parse(raw);
    metas.push(ProjectMetaSchema.parse(parsed));
  }
  return metas;
}

let cachedMetasPromise: Promise<ProjectMeta[]> | null = null;
async function getMetas(): Promise<ProjectMeta[]> {
  if (!cachedMetasPromise) cachedMetasPromise = loadAllProjectMetas();
  return cachedMetasPromise;
}

export function invalidateProjectsCache(): void {
  cachedMetasPromise = null;
}

export async function getAllProjects(): Promise<ProjectMeta[]> {
  return await getMetas();
}

export async function getProjectBySlug(slug: string) {
  const metas = await getMetas();
  const meta = metas.find((p) => p.slug === slug);
  if (!meta) return null;

  const mdPath = resolve('src/lib/content/projects', slug, 'index.md');
  let longDescriptionMd = '';
  try {
    longDescriptionMd = await readFile(mdPath, 'utf8');
  } catch {}

  let codeSnippetContent: string | undefined;
  if (meta.codeSnippet?.path && !meta.codeSnippet.code) {
    try {
      const snippetPath = resolve('src/lib', meta.codeSnippet.path);
      codeSnippetContent = await readFile(snippetPath, 'utf8');
    } catch {}
  }

  return {
    ...meta,
    longDescription: longDescriptionMd || undefined,
    codeSnippet: meta.codeSnippet
      ? { language: meta.codeSnippet.language, code: meta.codeSnippet.code ?? codeSnippetContent }
      : undefined
  } as const;
}


