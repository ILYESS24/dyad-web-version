import { Router } from 'express';

const router = Router();

// Check if release notes exist for a version
router.post('/check', async (req, res) => {
  try {
    const { version } = req.body;
    
    // Simulate release notes check
    // In a real implementation, this would check a database or file system
    const hasReleaseNotes = version && version !== '0.20.0-beta.1-web';
    
    if (hasReleaseNotes) {
      res.json({
        exists: true,
        url: `https://github.com/dyad-sh/dyad/releases/tag/v${version}`
      });
    } else {
      res.json({
        exists: false
      });
    }
  } catch (error) {
    console.error('Error checking release notes:', error);
    res.status(500).json({ error: 'Failed to check release notes' });
  }
});

export { router as releaseNotesRoutes };
