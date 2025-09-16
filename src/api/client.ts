// Web API client to replace IPC client functionality

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class WebApiClient {
  private static instance: WebApiClient;

  static getInstance(): WebApiClient {
    if (!WebApiClient.instance) {
      WebApiClient.instance = new WebApiClient();
    }
    return WebApiClient.instance;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    // Handle streaming responses
    if (response.headers.get('content-type')?.includes('text/plain')) {
      return response.text() as Promise<T>;
    }

    return response.json();
  }

  // App management
  async listApps() {
    return this.request<{ apps: any[]; appBasePath: string }>('/apps');
  }

  async getApp(appId: number) {
    return this.request<any>(`/apps/${appId}`);
  }

  async createApp(params: { name?: string }) {
    return this.request<{ app: any; chatId: number }>('/apps', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async updateApp(appId: number, updates: any) {
    return this.request<any>(`/apps/${appId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteApp(appId: number) {
    return this.request<{ success: boolean }>(`/apps/${appId}`, {
      method: 'DELETE',
    });
  }

  async runApp(appId: number) {
    return this.request<{ success: boolean; url: string; message: string }>(`/apps/${appId}/run`, {
      method: 'POST',
    });
  }

  async stopApp(appId: number) {
    return this.request<{ success: boolean; message: string }>(`/apps/${appId}/stop`, {
      method: 'POST',
    });
  }

  // Chat management
  async getChat(chatId: number) {
    return this.request<{ messages: any[] }>(`/chat/${chatId}/messages`);
  }

  async getChatById(chatId: number) {
    return this.request<any>(`/chat/${chatId}`);
  }

  async getChatsByApp(appId: number) {
    return this.request<{ chats: any[] }>(`/chat/app/${appId}`);
  }

  async streamChatMessage(chatId: number, params: { prompt: string; attachments?: any[] }) {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: params.prompt,
        attachments: params.attachments || [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API Error: ${response.status}`);
    }

    return response;
  }

  // File management
  async getAppFile(appId: number, filePath: string) {
    return this.request<string>(`/files/${appId}/${encodeURIComponent(filePath)}`);
  }

  async saveAppFile(appId: number, filePath: string, content: string) {
    return this.request<{ success: boolean }>(`/files/${appId}/${encodeURIComponent(filePath)}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  // Settings
  async getSettings() {
    return this.request<any>('/settings');
  }

  async updateSettings(settings: any) {
    return this.request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Build management
  async buildApp(appId: number) {
    return this.request<{ success: boolean; message: string }>(`/build/${appId}`, {
      method: 'POST',
    });
  }

  async getBuildStatus(appId: number) {
    return this.request<{ status: string; message?: string }>(`/build/${appId}/status`);
  }

  // Version management
  async getVersions(appId: number) {
    return this.request<any[]>(`/versions/${appId}`);
  }

  async createVersion(appId: number, params: any) {
    return this.request<any>(`/versions/${appId}`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async checkoutVersion(appId: number, versionId: number) {
    return this.request<{ success: boolean }>(`/versions/${appId}/checkout/${versionId}`, {
      method: 'POST',
    });
  }

  // System info (simplified for web)
  async getSystemPlatform() {
    return 'web';
  }

  async getAppVersion() {
    return '0.20.0-beta.1-web';
  }

  // Window controls (not applicable for web)
  minimizeWindow() {
    console.log('Window controls not available in web version');
  }

  maximizeWindow() {
    console.log('Window controls not available in web version');
  }

  closeWindow() {
    console.log('Window controls not available in web version');
  }

  // Settings management (mock for web environment)
  async getUserSettings() {
    // Return mock settings for web environment with API keys from environment
    const mockSettings = {
      providerSettings: {
        openai: {
          apiKey: {
            value: import.meta.env.VITE_OPENAI_API_KEY || "sk-proj-YOUR_OPENAI_API_KEY_HERE"
          }
        },
        anthropic: {
          apiKey: {
            value: import.meta.env.VITE_ANTHROPIC_API_KEY || "sk-ant-YOUR_ANTHROPIC_API_KEY_HERE"
          }
        },
        google: {
          apiKey: {
            value: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_GOOGLE_API_KEY_HERE"
          }
        }
      },
      defaultProvider: "openai",
      defaultModel: "gpt-4o",
      autoApprove: true,
      telemetryEnabled: false,
      autoUpdateEnabled: false,
    };

    console.log('Returning mock settings for web environment');
    return mockSettings;
  }

  async updateUserSettings(settings: any) {
    console.log('Settings update requested in web environment:', settings);
    // In a real web environment, this would save to localStorage or a backend
    return { success: true };
  }

  async getEnvVars() {
    // Return mock environment variables for web environment with API keys from environment
    const mockEnvVars = {
      OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || "sk-proj-YOUR_OPENAI_API_KEY_HERE",
      ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || "sk-ant-YOUR_ANTHROPIC_API_KEY_HERE",
      GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_GOOGLE_API_KEY_HERE",
    };

    console.log('Returning mock environment variables for web environment');
    return mockEnvVars;
  }

  async updateEnvVars(envVars: any) {
    return this.request<any>('/env-vars', {
      method: 'PUT',
      body: JSON.stringify(envVars),
    });
  }

  // User budget info (for Dyad Pro)
  async getUserBudgetInfo() {
    return this.request<any>('/user-budget');
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Additional methods that might be called by the original code
  async doesReleaseNoteExist(params: { version: string }) {
    return this.request<{ exists: boolean; url?: string }>('/release-notes/check', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async editAppFile(appId: number, filePath: string, content: string) {
    return this.request<{ warning?: string }>(`/files/${appId}/${encodeURIComponent(filePath)}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  // Deep link handling (mock for web environment)
  onDeepLinkReceived(callback: (data: any) => void): () => void {
    // In a web environment, deep links are typically handled via URL parameters
    // For now, return a no-op unsubscribe function
    console.log('Deep link handling not implemented for web environment');
    return () => {
      console.log('Deep link unsubscribe (no-op in web environment)');
    };
  }

  // Language Model Providers (mock for web environment)
  async getLanguageModelProviders(): Promise<any[]> {
    // Return mock language model providers for web environment
    const providers = [
      {
        id: 'openai',
        name: 'OpenAI',
        hasFreeTier: false,
        websiteUrl: 'https://openai.com',
        gatewayPrefix: 'openai',
        type: 'cloud' as const,
        envVarName: 'OPENAI_API_KEY',
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        hasFreeTier: false,
        websiteUrl: 'https://anthropic.com',
        gatewayPrefix: 'anthropic',
        type: 'cloud' as const,
        envVarName: 'ANTHROPIC_API_KEY',
      },
      {
        id: 'google',
        name: 'Google',
        hasFreeTier: true,
        websiteUrl: 'https://ai.google.dev',
        gatewayPrefix: 'google',
        type: 'cloud' as const,
        envVarName: 'GOOGLE_API_KEY',
      },
    ];

    console.log('Returning mock language model providers for web environment');
    return providers;
  }

  // Get provider settings (mock for web environment)
  async getProviderSettings() {
    const mockProviderSettings = {
      openai: {
        apiKey: {
          value: import.meta.env.VITE_OPENAI_API_KEY || "sk-proj-YOUR_OPENAI_API_KEY_HERE"
        }
      },
      anthropic: {
        apiKey: {
          value: import.meta.env.VITE_ANTHROPIC_API_KEY || "sk-ant-YOUR_ANTHROPIC_API_KEY_HERE"
        }
      },
      google: {
        apiKey: {
          value: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_GOOGLE_API_KEY_HERE"
        }
      }
    };

    console.log('Returning mock provider settings for web environment');
    return mockProviderSettings;
  }

  // Node.js status check (mock for web environment)
  async getNodejsStatus(): Promise<any> {
    // Return mock Node.js status for web environment
    const mockStatus = {
      nodeVersion: "Web Environment",
      pnpmVersion: null,
      platform: "web",
    };

    console.log('Returning mock Node.js status for web environment');
    return mockStatus;
  }
}

export default WebApiClient;
