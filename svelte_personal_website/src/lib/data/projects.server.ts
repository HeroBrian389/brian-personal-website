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
  console.log('[projects.server.ts] Getting project by slug:', slug);
  
  const metas = await getMetas();
  console.log('[projects.server.ts] Available projects:', metas.map(p => p.slug));
  
  const meta = metas.find((p) => p.slug === slug);
  if (!meta) {
    console.log('[projects.server.ts] No meta found for slug:', slug);
    return null;
  }
  
  console.log('[projects.server.ts] Found meta for project:', meta.title);

  const mdPath = resolve('src/lib/content/projects', slug, 'index.md');
  console.log('[projects.server.ts] Looking for markdown at:', mdPath);
  
  let longDescriptionMd = '';
  try {
    longDescriptionMd = await readFile(mdPath, 'utf8');
    console.log('[projects.server.ts] Markdown file read successfully:', {
      path: mdPath,
      length: longDescriptionMd.length,
      preview: longDescriptionMd.substring(0, 100)
    });
  } catch (err) {
    console.log('[projects.server.ts] Failed to read markdown file:', {
      path: mdPath,
      error: err instanceof Error ? err.message : String(err)
    });
  }

  let codeSnippetContent: string | undefined;
  if (meta.codeSnippet?.path && !meta.codeSnippet.code) {
    try {
      const snippetPath = resolve('src/lib', meta.codeSnippet.path);
      console.log('[projects.server.ts] Loading code snippet from:', snippetPath);
      codeSnippetContent = await readFile(snippetPath, 'utf8');
    } catch (err) {
      console.log('[projects.server.ts] Failed to read code snippet:', err);
    }
  }

  const result = {
    ...meta,
    longDescription: longDescriptionMd || undefined,
    codeSnippet: meta.codeSnippet
      ? { language: meta.codeSnippet.language, code: meta.codeSnippet.code ?? codeSnippetContent }
      : undefined
  } as const;
  
  console.log('[projects.server.ts] Returning project data:', {
    slug: result.slug,
    hasLongDescription: !!result.longDescription,
    longDescriptionLength: result.longDescription?.length || 0
  });
  
  return result;
}


