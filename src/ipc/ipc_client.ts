// Web-compatible IPC client
// This file replaces all Node.js/Electron IPC functionality with web alternatives

import WebApiClient from '../api/client';

// Export the web API client as the IPC client for compatibility
export const IpcClient = WebApiClient;
export default WebApiClient;
