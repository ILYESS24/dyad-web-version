// Cloud Services API Routes
import { Router } from 'express';
import { buildCloudService } from '../services/buildCloudService';
import { sandboxService } from '../services/sandboxService';

const router = Router();

// Build endpoints
router.post('/build', async (req, res) => {
  try {
    const { appId, files, buildScript = 'build' } = req.body;
    
    if (!files) {
      return res.status(400).json({ 
        success: false, 
        error: 'Files are required' 
      });
    }

    const result = await buildCloudService.buildProject(files, buildScript);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Development server endpoints
router.post('/dev', async (req, res) => {
  try {
    const { appId, files, devScript = 'dev' } = req.body;
    
    if (!files) {
      return res.status(400).json({ 
        success: false, 
        error: 'Files are required' 
      });
    }

    const result = await buildCloudService.startDevServer(files, devScript);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Install dependencies
router.post('/install', async (req, res) => {
  try {
    const { files, packageManager = 'npm' } = req.body;
    
    if (!files) {
      return res.status(400).json({ 
        success: false, 
        error: 'Files are required' 
      });
    }

    const result = await buildCloudService.installDependencies(files, packageManager);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Sandbox endpoints
router.post('/sandbox/create', async (req, res) => {
  try {
    const { appName, files, template } = req.body;
    
    if (!appName || !files) {
      return res.status(400).json({ 
        success: false, 
        error: 'App name and files are required' 
      });
    }

    let result;
    
    // Auto-detect template if not provided
    const detectedTemplate = template || sandboxService.detectTemplate(files);
    
    switch (detectedTemplate) {
      case 'react':
        result = await sandboxService.createReactProject(appName, files);
        break;
      case 'vite-react':
      case 'vite':
        result = await sandboxService.createViteProject(appName, files);
        break;
      case 'nextjs':
      case 'next':
        result = await sandboxService.createNextProject(appName, files);
        break;
      default:
        result = await sandboxService.createReactProject(appName, files);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Dependencies endpoints
router.post('/dependencies/add', async (req, res) => {
  try {
    const { appId, packageName, packageManager = 'npm' } = req.body;
    
    if (!packageName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Package name is required' 
      });
    }

    // In a real implementation, we would get the app files from the database
    // For now, return a mock response
    res.json({
      success: true,
      message: `Dependency ${packageName} added successfully`,
      output: `Added ${packageName}@latest`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Parse package.json
router.post('/parse-package', async (req, res) => {
  try {
    const { packageJsonContent } = req.body;
    
    if (!packageJsonContent) {
      return res.status(400).json({ 
        success: false, 
        error: 'Package.json content is required' 
      });
    }

    const packageInfo = await buildCloudService.parsePackageJson(packageJsonContent);
    
    if (!packageInfo) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid package.json format' 
      });
    }

    res.json({
      success: true,
      packageInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Cloud services are running',
    services: {
      buildService: 'active',
      sandboxService: 'active'
    }
  });
});

export default router;
