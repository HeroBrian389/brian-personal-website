#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directories
const projectsDir = 'src/lib/data/projects';
const extractedDir = 'src/lib/data/projects-extracted';

// Read all project JSON files
const projectFiles = fs.readdirSync(projectsDir).filter(f => f.endsWith('.json'));
const projects = {};

console.log('Loading projects:');
for (const file of projectFiles) {
  const json = JSON.parse(fs.readFileSync(path.join(projectsDir, file), 'utf8'));
  const slug = json.slug;
  
  // Try to find matching markdown file
  const mdFile = `${slug}.md`;
  const mdPath = path.join(extractedDir, mdFile);
  
  let markdown = '';
  if (fs.existsSync(mdPath)) {
    markdown = fs.readFileSync(mdPath, 'utf8');
    console.log(`  ${slug}: Found markdown (${markdown.length} chars)`);
  }
  
  if (!markdown) {
    console.log(`  ${slug}: No markdown found, using description`);
    markdown = json.description || '';
  }
  
  projects[slug] = {
    json,
    markdown
  };
}

// Fix the markdown content - unescape the over-escaped backticks
function fixMarkdownEscaping(md) {
  // Replace \` with ` (these were already escaped in the original file)
  return md.replace(/\\`/g, '`');
}

// Create the TypeScript file content
let tsContent = `// Auto-generated project data - DO NOT EDIT MANUALLY
// Generated on ${new Date().toISOString()}
// Run 'node scripts/generate-project-data.cjs' to regenerate

import type { ProjectMeta } from './projects.schema';

export const projectsData: Record<string, { meta: ProjectMeta; longDescription: string }> = {
`;

// Add each project
const projectEntries = [];
for (const [slug, data] of Object.entries(projects)) {
  const fixedMd = fixMarkdownEscaping(data.markdown);
  const escapedMd = fixedMd.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
  const jsonStr = JSON.stringify(data.json, null, 4).split('\n').map((line, i) => i === 0 ? line : '    ' + line).join('\n');
  
  projectEntries.push(`  '${slug}': {
    meta: ${jsonStr},
    longDescription: \`${escapedMd}\`
  }`);
}

tsContent += projectEntries.join(',\n');
tsContent += `
};

export const getAllProjectMetas = (): ProjectMeta[] => {
  return Object.values(projectsData).map(p => p.meta);
};

export const getProjectData = (slug: string) => {
  return projectsData[slug] || null;
};
`;

// Write the TypeScript file
fs.writeFileSync('src/lib/data/projects-data.ts', tsContent);

console.log('\n✅ Generated src/lib/data/projects-data.ts');
console.log(`   Total size: ${tsContent.length} chars`);
console.log(`   Projects included: ${Object.keys(projects).join(', ')}`);