import { Router } from 'express';
import { getDb } from '../db/index.js';
import { apps } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Build an app
router.post('/:appId', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.appId);
    
    // Update build status to building
    await db.update(apps)
      .set({ buildStatus: 'building' })
      .where(eq(apps.id, appId));
    
    // Simulate build process
    setTimeout(async () => {
      try {
        await db.update(apps)
          .set({ 
            buildStatus: 'success',
            lastBuildAt: new Date()
          })
          .where(eq(apps.id, appId));
      } catch (error) {
        console.error('Build completion error:', error);
      }
    }, 3000);
    
    res.json({ 
      success: true, 
      message: 'Build started successfully' 
    });
  } catch (error) {
    console.error('Error starting build:', error);
    res.status(500).json({ error: 'Failed to start build' });
  }
});

// Get build status
router.get('/:appId/status', async (req, res) => {
  try {
    const db = getDb();
    const appId = parseInt(req.params.appId);
    
    const [app] = await db.select({
      buildStatus: apps.buildStatus,
      lastBuildAt: apps.lastBuildAt
    })
    .from(apps)
    .where(eq(apps.id, appId));
    
    if (!app) {
      return res.status(404).json({ error: 'App not found' });
    }
    
    res.json({
      status: app.buildStatus || 'idle',
      lastBuildAt: app.lastBuildAt
    });
  } catch (error) {
    console.error('Error getting build status:', error);
    res.status(500).json({ error: 'Failed to get build status' });
  }
});

export { router as buildRoutes };
