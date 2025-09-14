import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export function setupWebSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join app-specific rooms for real-time updates
    socket.on('join-app', (appId: number) => {
      socket.join(`app-${appId}`);
      console.log(`Client ${socket.id} joined app-${appId}`);
    });

    // Leave app rooms
    socket.on('leave-app', (appId: number) => {
      socket.leave(`app-${appId}`);
      console.log(`Client ${socket.id} left app-${appId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Export functions to emit events
  return {
    emitAppUpdate: (appId: number, data: any) => {
      io.to(`app-${appId}`).emit('app-update', data);
    },
    emitBuildStatus: (appId: number, status: string) => {
      io.to(`app-${appId}`).emit('build-status', { appId, status });
    },
    emitFileChange: (appId: number, filePath: string, content: string) => {
      io.to(`app-${appId}`).emit('file-change', { appId, filePath, content });
    }
  };
}
