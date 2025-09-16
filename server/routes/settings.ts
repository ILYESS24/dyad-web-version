import { Router } from 'express';
import { getDb } from '../db/index.js';

const router = Router();

// In-memory settings store (in production, use a database)
let userSettings: any = {
  selectedModel: {
    name: 'gpt-4o-mini',
    provider: 'openai'
  },
  providerSettings: {
    openai: {
      apiKey: {
        value: process.env.OPENAI_API_KEY || '',
        encryptionType: 'plaintext'
      }
    },
    anthropic: {
      apiKey: {
        value: process.env.ANTHROPIC_API_KEY || '',
        encryptionType: 'plaintext'
      }
    },
    google: {},
    auto: {
      apiKey: {
        value: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || '',
        encryptionType: 'plaintext'
      }
    }
  },
  githubUser: undefined,
  githubAccessToken: undefined,
  vercelAccessToken: undefined,
  supabase: undefined,
  neon: undefined,
  autoApproveChanges: false,
  telemetryConsent: 'opted_in',
  telemetryUserId: 'web-user-' + Math.random().toString(36).substr(2, 9),
  hasRunBefore: true,
  enableDyadPro: true,
  experiments: {},
  lastShownReleaseNotesVersion: '0.20.0-beta.1-web',
  maxChatTurnsInContext: 10,
  thinkingBudget: 'medium',
  enableProLazyEditsMode: false,
  enableProSmartFilesContextMode: false,
  proSmartContextOption: 'balanced',
  selectedTemplateId: 'nextjs',
  enableSupabaseWriteSqlMigration: false,
  selectedChatMode: 'build',
  acceptedCommunityCode: true,
  enableAutoFixProblems: true,
  enableNativeGit: false,
  enableAutoUpdate: true,
  releaseChannel: 'beta',
  runtimeMode2: 'host',
  isTestMode: process.env.NODE_ENV === 'development'
};

let envVars: any = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3001'
};

// Get settings
router.get('/', async (req, res) => {
  try {
    res.json(userSettings);
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const updates = req.body;
    userSettings = { ...userSettings, ...updates };
    res.json(userSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get environment variables
router.get('/env-vars', async (req, res) => {
  try {
    res.json(envVars);
  } catch (error) {
    console.error('Error getting env vars:', error);
    res.status(500).json({ error: 'Failed to get env vars' });
  }
});

// Update environment variables
router.put('/env-vars', async (req, res) => {
  try {
    const updates = req.body;
    envVars = { ...envVars, ...updates };
    res.json(envVars);
  } catch (error) {
    console.error('Error updating env vars:', error);
    res.status(500).json({ error: 'Failed to update env vars' });
  }
});

// Get user budget info (for Dyad Pro)
router.get('/user-budget', async (req, res) => {
  try {
    // Simulate user budget info
    res.json({
      totalCredits: 1000,
      usedCredits: 150,
      budgetResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
  } catch (error) {
    console.error('Error getting user budget:', error);
    res.status(500).json({ error: 'Failed to get user budget' });
  }
});

export { router as settingsRoutes };
