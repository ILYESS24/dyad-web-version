import { getDb } from '../db/index.js';
import { apps } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { getDyadWriteTags, getDyadDeleteTags, getDyadRenameTags } from '../utils/dyadTagParser.js';

export async function processAppChanges(appId: number, aiResponse: string) {
  try {
    const db = getDb();
    
    // Parse the AI response for file changes
    const writeTags = getDyadWriteTags(aiResponse);
    const deleteTags = getDyadDeleteTags(aiResponse);
    const renameTags = getDyadRenameTags(aiResponse);
    
    if (writeTags.length === 0 && deleteTags.length === 0 && renameTags.length === 0) {
      return; // No file changes
    }
    
    // Get current app files
    const [app] = await db.select().from(apps).where(eq(apps.id, appId));
    if (!app) {
      throw new Error('App not found');
    }
    
    let files = app.files || {};
    
    // Process write operations
    for (const tag of writeTags) {
      files[tag.path] = tag.content;
    }
    
    // Process delete operations
    for (const path of deleteTags) {
      delete files[path];
    }
    
    // Process rename operations
    for (const tag of renameTags) {
      if (files[tag.path]) {
        files[tag.newPath] = files[tag.path];
        delete files[tag.path];
      }
    }
    
    // Update app with new files
    await db.update(apps)
      .set({ 
        files: files,
        updatedAt: new Date(),
        buildStatus: 'building'
      })
      .where(eq(apps.id, appId));
    
    // Trigger build process (simplified for web version)
    await triggerBuild(appId);
    
  } catch (error) {
    console.error('Error processing app changes:', error);
    
    // Update build status to error
    const db = getDb();
    await db.update(apps)
      .set({ buildStatus: 'error' })
      .where(eq(apps.id, appId));
  }
}

async function triggerBuild(appId: number) {
  try {
    const db = getDb();
    
    // In a real web implementation, this would:
    // 1. Queue a build job
    // 2. Use a service like Vercel, Netlify, or custom build service
    // 3. Update the app with the build result
    
    // For now, we'll simulate a successful build
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await db.update(apps)
      .set({ 
        buildStatus: 'success',
        lastBuildAt: new Date()
      })
      .where(eq(apps.id, appId));
    
  } catch (error) {
    console.error('Build failed:', error);
    
    const db = getDb();
    await db.update(apps)
      .set({ buildStatus: 'error' })
      .where(eq(apps.id, appId));
  }
}
