#!/usr/bin/env node

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectsDir = resolve(__dirname, '../src/lib/data/projects');

async function cleanupJsonDescriptions() {
  console.log('🧹 Cleaning up longDescription from JSON files...\n');
  
  try {
    // Read all JSON files from projects directory
    const files = await readdir(projectsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'index.json');
    
    let cleanedCount = 0;
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
      
      // Remove longDescription field
      delete projectData.longDescription;
      
      // Write back to JSON file with nice formatting
      const cleanedJson = JSON.stringify(projectData, null, 2) + '\n';
      await writeFile(jsonPath, cleanedJson, 'utf8');
      
      console.log(`  ✅ Removed longDescription from ${file}`);
      cleanedCount++;
    }
    
    console.log(`\n✨ Cleanup complete!`);
    console.log(`   ${cleanedCount} files cleaned`);
    console.log(`   ${skippedCount} files skipped`);
    
    console.log(`
📝 Note: The longDescription content is now stored in markdown files at:
   src/lib/content/projects/[slug]/index.md
   
   The system will automatically read from these markdown files.
`);
    
  } catch (error) {
    console.error('❌ Error cleaning up JSON files:', error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupJsonDescriptions();