import { Router } from 'express';
import { getDb } from '../db/index.js';
import { versions, apps } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// Get versions for an app
router.get('/:appId', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.appId);
    
    const appVersions = await db.select()
      .from(versions)
      .where(eq(versions.appId, appId))
      .orderBy(desc(versions.timestamp));
    
    res.json(appVersions);
  } catch (error) {
    console.error('Error getting versions:', error);
    res.status(500).json({ error: 'Failed to get versions' });
  }
});

// Create a new version
router.post('/:appId', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.appId);
    const { messageId, description } = req.body;
    
    const [newVersion] = await db.insert(versions).values({
      appId,
      messageId: messageId || null,
      description: description || 'New version'
    }).returning();
    
    res.json(newVersion);
  } catch (error) {
    console.error('Error creating version:', error);
    res.status(500).json({ error: 'Failed to create version' });
  }
});

// Checkout a specific version
router.post('/:appId/checkout/:versionId', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.appId);
    const versionId = parseInt(req.params.versionId);
    
    // Get the version
    const [version] = await db.select()
      .from(versions)
      .where(eq(versions.id, versionId));
    
    if (!version) {
      return res.status(404).json({ error: 'Version not found' });
    }
    
    // In a real implementation, this would restore the app state to that version
    // For now, we'll just return success
    res.json({ success: true, version });
  } catch (error) {
    console.error('Error checking out version:', error);
    res.status(500).json({ error: 'Failed to checkout version' });
  }
});

export { router as versionRoutes };
