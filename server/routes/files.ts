import { Router } from 'express';
import { getDb } from '../db/index.js';
import { apps } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Get a specific file from an app
router.get('/:appId/:filePath(*)', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.appId);
    const filePath = req.params.filePath;
    
    const [app] = await db.select({
      files: apps.files
    })
    .from(apps)
    .where(eq(apps.id, appId));
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    const files = app.files as Record<string, string> || {};
    const content = files[filePath];
    
    if (content === undefined) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.send(content);
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({ error: 'Failed to get file' });
  }
});

// Save a file to an app
router.put('/:appId/:filePath(*)', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.appId);
    const filePath = req.params.filePath;
    const { content } = req.body;
    
    if (content === undefined) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Get current app files
    const [app] = await db.select({
      files: apps.files
    })
    .from(apps)
    .where(eq(apps.id, appId));
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    const files = app.files as Record<string, string> || {};
    files[filePath] = content;
    
    // Update app with new files
    await db.update(apps)
      .set({ 
        files: files,
        updatedAt: new Date()
      })
      .where(eq(apps.id, appId));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
});

// List all files in an app
router.get('/:appId', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.appId);
    
    const [app] = await db.select({
      files: apps.files
    })
    .from(apps)
    .where(eq(apps.id, appId));
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    const files = app.files as Record<string, string> || {};
    const fileList = Object.keys(files).map(path => ({
      path,
      name: path.split('/').pop(),
      size: files[path].length
    }));
    
    res.json({ files: fileList });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

export { router as fileRoutes };
