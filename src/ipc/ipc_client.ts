// Modified IPC client to use Web API instead of Electron IPC

import WebApiClient from '../api/client.js';

// Export the same interface as the original IPC client but use Web API
export const IpcClient = WebApiClient;
export default WebApiClient;
