import { Express } from 'express';
import { appRoutes } from './apps.js';
import { chatRoutes } from './chat.js';
import { settingsRoutes } from './settings.js';
import { versionRoutes } from './versions.js';
import { buildRoutes } from './build.js';
import { fileRoutes } from './files.js';
import { releaseNotesRoutes } from './release-notes.js';

export function setupRoutes(app: Express) {
  // API routes
  app.use('/api/apps', appRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/versions', versionRoutes);
  app.use('/api/build', buildRoutes);
  app.use('/api/files', fileRoutes);
  app.use('/api/release-notes', releaseNotesRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    const express = require('express');
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }
}
