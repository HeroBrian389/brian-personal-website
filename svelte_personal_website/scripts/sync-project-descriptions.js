#!/usr/bin/env node

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectsDir = resolve(__dirname, '../src/lib/data/projects');
const contentDir = resolve(__dirname, '../src/lib/content/projects');

async function syncProjectDescriptions() {
  console.log('🔄 Syncing project descriptions from JSON to markdown files...\n');
  
  try {
    // Read all JSON files from projects directory
    const files = await readdir(projectsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'index.json');
    
    let syncedCount = 0;
    let skippedCount = 0;
    
    for (const file of jsonFiles) {
      const jsonPath = join(projectsDir, file);
      const projectName = file.replace('.json', '');
      
      console.log(`📁 Processing ${projectName}...`);
      
      // Read JSON file
      const jsonContent = await readFile(jsonPath, 'utf8');
      const projectData = JSON.parse(jsonContent);
      
      if (!projectData.longDescription) {
        console.log(`  ⏭️  No longDescription found, skipping`);
        skippedCount++;
        continue;
      }
      
      // Prepare markdown content
      // The longDescription in JSON already includes markdown formatting
      const markdownContent = projectData.longDescription;
      
      // Write to markdown file
      const mdPath = join(contentDir, projectData.slug, 'index.md');
      
      // Check current content
      let currentContent = '';
      try {
        currentContent = await readFile(mdPath, 'utf8');
      } catch (err) {
        console.log(`  📝 Creating new markdown file`);
      }
      
      // Only write if content is different or file doesn't exist
      if (currentContent !== markdownContent) {
        await writeFile(mdPath, markdownContent, 'utf8');
        console.log(`  ✅ Updated ${projectData.slug}/index.md`);
        console.log(`     (${markdownContent.length} characters)`);
        syncedCount++;
      } else {
        console.log(`  ⏭️  Content already up to date`);
        skippedCount++;
      }
    }
    
    console.log(`\n✨ Sync complete!`);
    console.log(`   ${syncedCount} files updated`);
    console.log(`   ${skippedCount} files skipped`);
    
    // Optional: Clean up JSON files after sync
    const cleanupPrompt = `
After syncing, you may want to remove the longDescription from JSON files
to avoid duplication. The markdown files are now the source of truth.

To clean up JSON files, you can:
1. Remove the "longDescription" field from each JSON
2. Keep other metadata (title, technologies, etc.) in JSON
3. The system will read descriptions from markdown files
`;
    console.log(cleanupPrompt);
    
  } catch (error) {
    console.error('❌ Error syncing descriptions:', error);
    process.exit(1);
  }
}

// Run the sync
syncProjectDescriptions();