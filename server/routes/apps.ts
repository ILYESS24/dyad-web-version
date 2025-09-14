import { Router } from 'express';
import { getDb } from '../db/index.js';
import { apps, chats } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { generateCuteAppName } from '../utils/names.js';
import { createAppFiles } from '../services/fileService.js';

const router = Router();

// List all apps
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const appsList = await db.select().from(apps).orderBy(apps.createdAt);
    
    res.json({
      apps: appsList,
      appBasePath: '/apps' // Web equivalent of local path
    });
  } catch (error) {
    console.error('Error listing apps:', error);
    res.status(500).json({ error: 'Failed to list apps' });
  }
});

// Get a specific app
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.id);
    
    const [app] = await db.select().from(apps).where(eq(apps.id, appId));
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    res.json(app);
  } catch (error) {
    console.error('Error getting app:', error);
    res.status(500).json({ error: 'Failed to get app' });
  }
});

// Create a new app
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { name } = req.body;
    
    const appName = name || generateCuteAppName();
    const appPath = appName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    // Create app files structure
    const files = await createAppFiles(appName);
    
    // Insert app into database
    const [newApp] = await db.insert(apps).values({
      name: appName,
      path: appPath,
      files: files,
      installCommand: 'npm install',
      startCommand: 'npm run dev'
    }).returning();
    
    // Create initial chat for this app
    const [newChat] = await db.insert(chats).values({
      appId: newApp.id,
      summary: 'Initial chat'
    }).returning();
    
    res.json({
      app: newApp,
      chatId: newChat.id
    });
  } catch (error) {
    console.error('Error creating app:', error);
    res.status(500).json({ error: 'Failed to create app' });
  }
});

// Update app
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.id);
    const updates = req.body;
    
    const [updatedApp] = await db.update(apps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(apps.id, appId))
      .returning();
    
    if (!updatedApp) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    res.json(updatedApp);
  } catch (error) {
    console.error('Error updating app:', error);
    res.status(500).json({ error: 'Failed to update app' });
  }
});

// Delete app
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.id);
    
    // Delete related chats and messages first (cascade)
    await db.delete(chats).where(eq(chats.appId, appId));
    
    // Delete the app
    const result = await db.delete(apps).where(eq(apps.id, appId));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting app:', error);
    res.status(500).json({ error: 'Failed to delete app' });
  }
});

// Run app (start development server)
router.post('/:id/run', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.id);
    
    // Update app status to running
    await db.update(apps)
      .set({ isRunning: true })
      .where(eq(apps.id, appId));
    
    // In a real implementation, this would start a development server
    // For now, we'll simulate it
    const devUrl = `http://localhost:3000/apps/${appId}/preview`;
    
    res.json({
      success: true,
      url: devUrl,
      message: 'App started successfully'
    });
  } catch (error) {
    console.error('Error running app:', error);
    res.status(500).json({ error: 'Failed to run app' });
  }
});

// Stop app
router.post('/:id/stop', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.id);
    
    // Update app status to stopped
    await db.update(apps)
      .set({ isRunning: false })
      .where(eq(apps.id, appId));
    
    res.json({
      success: true,
      message: 'App stopped successfully'
    });
  } catch (error) {
    console.error('Error stopping app:', error);
    res.status(500).json({ error: 'Failed to stop app' });
  }
});

export { router as appRoutes };
