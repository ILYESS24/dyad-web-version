import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/index.js';
import { setupRoutes } from './routes/index.js';
import { setupWebSocket } from './websocket/index.js';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized');

    // Setup routes
    setupRoutes(app);

    // Setup WebSocket for real-time updates
    setupWebSocket(server);

    const PORT = process.env.PORT || 3001;

    server.listen(PORT, () => {
      console.log(`🚀 Dyad Web Server running on port ${PORT}`);
      console.log(`📱 Frontend: http://localhost:5173`);
      console.log(`🔧 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
