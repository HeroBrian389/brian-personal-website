import { NextApiRequest, NextApiResponse } from 'next'
import { notion } from '../../lib/notion-api'
import * as fs from 'fs/promises'
import * as path from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // The root page ID from site.config.ts
    const rootPageId = '149c09c3c6044fd495248cacffd5cf05'
    
    console.log('Fetching root page...')
    const recordMap = await notion.getPage(rootPageId)
    
    // Analyze the structure
    const analysis = {
      recordMapKeys: Object.keys(recordMap),
      blockCount: Object.keys(recordMap.block || {}).length,
      blockTypes: {} as Record<string, number>,
      sampleBlocks: {} as Record<string, any>,
      collections: [] as any[],
      writingPages: [] as any[]
    }
    
    // Categorize blocks by type
    if (recordMap.block) {
      Object.entries(recordMap.block).forEach(([blockId, block]) => {
        if (block?.value?.type) {
          const type = block.value.type
          analysis.blockTypes[type] = (analysis.blockTypes[type] || 0) + 1
          
          // Save a sample of each type
          if (!analysis.sampleBlocks[type]) {
            analysis.sampleBlocks[type] = {
              id: blockId,
              properties: block.value.properties,
              parentId: block.value.parent_id
            }
          }
          
          // Look for writing/blog pages
          if (type === 'page' && block.value.properties?.title) {
            const title = block.value.properties.title
            const titleText = title?.[0]?.[0] || ''
            
            if (titleText.toLowerCase().includes('blog') || 
                titleText.toLowerCase().includes('writing') || 
                titleText.toLowerCase().includes('article') ||
                titleText.toLowerCase().includes('post') ||
                titleText.toLowerCase().includes('essay')) {
              analysis.writingPages.push({
                id: blockId,
                title: titleText,
                parentId: block.value.parent_id
              })
            }
          }
        }
      })
    }
    
    // Analyze collections
    if (recordMap.collection) {
      Object.entries(recordMap.collection).forEach(([collectionId, collection]) => {
        if (collection?.value) {
          const schema = collection.value.schema || {}
          analysis.collections.push({
            id: collectionId,
            name: collection.value.name,
            properties: Object.entries(schema).map(([id, prop]: [string, any]) => ({
              id,
              name: prop.name,
              type: prop.type
            }))
          })
        }
      })
    }
    
    // Save full data for offline analysis
    const dataDir = path.join(process.cwd(), 'notion-data')
    await fs.mkdir(dataDir, { recursive: true })
    
    await fs.writeFile(
      path.join(dataDir, 'root-page-analysis.json'),
      JSON.stringify(analysis, null, 2)
    )
    
    await fs.writeFile(
      path.join(dataDir, 'root-page-full.json'),
      JSON.stringify(recordMap, null, 2)
    )
    
    res.status(200).json({
      message: 'Analysis complete',
      analysis,
      savedTo: dataDir
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch Notion data',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}