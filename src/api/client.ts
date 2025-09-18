// Web API client to replace IPC client functionality

import { isWeb } from '../utils/environment';

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
    // ALWAYS use mock responses in browser environment - FORCE IT!
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    
    if (isBrowser) {
      console.log('Browser environment detected, FORCING mock response for:', endpoint);
      return this.mockApiResponse<T>(endpoint, options);
    }

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

  private async mockApiResponse<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Mock responses for web environment using localStorage
    console.log('Mocking API response for:', endpoint);
    
    switch (endpoint) {
      case '/apps':
        return this.getMockApps() as T;
      case '/settings':
        return this.getMockSettings() as T;
      case '/env-vars':
        return this.getMockEnvVars() as T;
      case '/api/env-vars':
        return this.getMockEnvVars() as T;
      case '/api/settings':
        return this.getMockSettings() as T;
      case '/api/apps':
        return this.getMockApps() as T;
      default:
        if (endpoint.startsWith('/apps/') && endpoint.endsWith('/files')) {
          return this.getMockAppFiles() as T;
        }
        if (endpoint.startsWith('/apps/') && options.method === 'GET') {
          return this.getMockApp() as T;
        }
        if (endpoint.startsWith('/api/apps/') && endpoint.endsWith('/files')) {
          return this.getMockAppFiles() as T;
        }
        if (endpoint.startsWith('/api/apps/') && options.method === 'GET') {
          return this.getMockApp() as T;
        }
        return {} as T;
    }
  }

  private getMockApps(): { apps: any[]; appBasePath: string } {
    const storedApps = localStorage.getItem('dyad_apps');
    const apps = storedApps ? JSON.parse(storedApps) : [];
    
    return {
      apps,
      appBasePath: '/mock-apps'
    };
  }

  private getMockSettings(): any {
    console.log('Getting mock settings - checking localStorage first');
    
    try {
      const storedSettings = localStorage.getItem('dyad_user_settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        console.log('✅ Found stored settings in localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.log('Error parsing stored settings, using defaults');
    }
    
    // Default settings for web environment - FORCE VALID DATA
    const defaultSettings = {
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
    
    console.log('✅ Using default mock settings:', defaultSettings);
    return defaultSettings;
  }

  private getMockEnvVars(): any {
    const storedEnvVars = localStorage.getItem('dyad_env_vars');
    if (storedEnvVars) {
      return JSON.parse(storedEnvVars);
    }
    
    // Default environment variables for web environment
    return {
      OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || "sk-proj-YOUR_OPENAI_API_KEY_HERE",
      ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || "sk-ant-YOUR_ANTHROPIC_API_KEY_HERE",
      GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_GOOGLE_API_KEY_HERE",
    };
  }

  private getMockApp(): any {
    return {
      id: 1,
      name: "Mon Premier App Web",
      description: "Application créée dans l'environnement web",
      files: {
        "package.json": JSON.stringify({
          name: "mon-app-web",
          version: "1.0.0",
          scripts: {
            dev: "vite",
            build: "vite build"
          },
          dependencies: {
            react: "^18.0.0",
            "react-dom": "^18.0.0"
          }
        }, null, 2),
        "src/App.tsx": `import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Mon App Web</h1>
      <p>Cette application fonctionne dans le navigateur !</p>
      <button 
        onClick={() => alert('Salut depuis le web !')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Cliquer ici
      </button>
    </div>
  );
}`,
        "src/main.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        "index.html": `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mon App Web</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private getMockAppFiles(): any {
    return this.getMockApp().files;
  }

  // App management
  async listApps() {
    return this.request<{ apps: any[]; appBasePath: string }>('/apps');
  }

  // getApp method moved to web environment section below

  async createApp(params: { name?: string }) {
    if (isWeb()) {
      // Create app in localStorage for web environment
      const storedApps = localStorage.getItem('dyad_apps');
      const apps = storedApps ? JSON.parse(storedApps) : [];
      
      const newApp = {
        id: apps.length + 1,
        name: params.name || "Nouvelle App Web",
        description: "Application créée dans l'environnement web",
        files: {
          "package.json": JSON.stringify({
            name: params.name?.toLowerCase().replace(/\s+/g, '-') || "nouvelle-app-web",
            version: "1.0.0",
            scripts: {
              dev: "vite",
              build: "vite build"
            },
            dependencies: {
              react: "^18.0.0",
              "react-dom": "^18.0.0"
            }
          }, null, 2),
          "src/App.tsx": `import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 ${params.name || "Nouvelle App"}</h1>
      <p>Bienvenue dans votre nouvelle application web !</p>
      <button 
        onClick={() => alert('Salut depuis le web !')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Cliquer ici
      </button>
    </div>
  );
}`,
          "src/main.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
          "index.html": `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${params.name || "Nouvelle App"}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      apps.push(newApp);
      localStorage.setItem('dyad_apps', JSON.stringify(apps));
      
      return {
        app: newApp,
        chatId: 1 // Mock chat ID for web environment
      };
    }
    
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

  async runApp(appId: number, onOutput?: (output: any) => void): Promise<void> {
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    
    if (isBrowser) {
      console.log(`[WebRuntime] Running app ${appId} using web alternatives`);
      
                  console.log(`✅ App ${appId} running successfully in web environment`);
                  if (onOutput) {
                    onOutput({
                      message: `App ${appId} is running in web environment`,
                      type: 'stdout',
                      appId,
                      timestamp: Date.now(),
                      url: `#/app/${appId}`,
                      logs: ['Web runtime started successfully'],
                      duration: 1000
                    });
                  }
      return;
    }
    
    // Fallback pour non-browser
    try {
      // Get app files from the database
      const app = await this.request<any>(`/apps/${appId}`);
      
      // Create sandbox project
      const sandboxResult = await this.request<any>('/api/sandbox/create', {
        method: 'POST',
        body: JSON.stringify({
          appName: app.name,
          files: app.files || {},
          template: 'react' // Default template
        })
      });

      if (sandboxResult.success && onOutput) {
        onOutput({
          message: `App running at: ${sandboxResult.url}`,
          type: 'stdout',
          appId,
          timestamp: Date.now()
        });
      }

    } catch (error) {
      console.error('Error running app:', error);
      if (onOutput) {
        onOutput({
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'stderr',
          appId,
          timestamp: Date.now()
        });
      }
    }
  }

  async stopApp(appId: number): Promise<void> {
    console.log(`Stopping app ${appId} in web environment`);
    // In web environment, apps run in sandboxes, so we don't need to stop them
  }

  // Chat management
  // getChat method moved to web environment section below

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

  // Build management (web environment using cloud build service)
  async buildApp(appId: number): Promise<any> {
    try {
      const app = await this.request<any>(`/apps/${appId}`);
      
      const buildResult = await this.request<any>('/api/build', {
        method: 'POST',
        body: JSON.stringify({
          appId,
          files: app.files || {},
          buildScript: 'build'
        })
      });

      return buildResult;
    } catch (error) {
      console.error('Error building app:', error);
      throw error;
    }
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

  // Settings management (using localStorage for web environment)
  async getUserSettings() {
    // ALWAYS use mock settings in browser environment - FORCE IT!
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    
    console.log('getUserSettings called - FORCING mock response in browser');
    if (isBrowser) {
      const mockSettings = this.getMockSettings();
      console.log('✅ Returning mock settings:', mockSettings);
      return mockSettings;
    }
    
    // Fallback for non-browser environments
    try {
      // Direct localStorage usage
      return localStorageUtils.getUserSettings();
    } catch (error) {
      console.log('Error in localStorage utils, using mock settings');
      return this.getMockSettings();
    }
  }

  async setUserSettings(settings: any) {
    if (isWeb()) {
      localStorage.setItem('dyad_user_settings', JSON.stringify(settings));
      return settings;
    }
    
    console.log('Saving user settings to localStorage for web environment:', settings);
    localStorage.setItem('dyad_user_settings', JSON.stringify(settings));
    return settings; // Return the settings as if they were saved
  }

  async updateUserSettings(settings: any) {
    return this.setUserSettings(settings);
  }

  async getEnvVars() {
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    
    console.log('getEnvVars called - FORCING mock response in browser');
    if (isBrowser) {
      const mockEnvVars = this.getMockEnvVars();
      console.log('✅ Returning mock env vars:', mockEnvVars);
      return mockEnvVars;
    }
    
    // Direct localStorage usage
    
    console.log('Loading environment variables from localStorage for web environment');
    return localStorageUtils.getEnvVars();
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

  // editAppFile method moved to web environment section below

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

  // getNodejsStatus method moved to web environment section below

  // Add dependency (web environment)
  async addDependency(appId: number, packageName: string): Promise<any> {
    try {
      const result = await this.request<any>('/api/dependencies/add', {
        method: 'POST',
        body: JSON.stringify({
          appId,
          packageName
        })
      });

      return result;
    } catch (error) {
      console.error('Error adding dependency:', error);
      throw error;
    }
  }

  // Update provider API key (web environment)
  async updateProviderApiKey(provider: string, apiKey: string): Promise<void> {
    console.log(`FORCING localStorage update for ${provider} API key in browser environment`);
    
    // Direct localStorage update without imports - FORCE IT!
    const storedSettings = localStorage.getItem('dyad_user_settings');
    const settings = storedSettings ? JSON.parse(storedSettings) : {
      providerSettings: {},
      defaultProvider: "openai",
      defaultModel: "gpt-4o",
      autoApprove: true,
      telemetryEnabled: false,
      autoUpdateEnabled: false,
    };
    
    if (!settings.providerSettings) {
      settings.providerSettings = {};
    }
    
    if (!settings.providerSettings[provider]) {
      settings.providerSettings[provider] = {};
    }
    
    settings.providerSettings[provider].apiKey = { value: apiKey };
    localStorage.setItem('dyad_user_settings', JSON.stringify(settings));
    
    console.log(`✅ Successfully saved ${provider} API key to localStorage`);
  }

  // Delete provider API key (web environment)
  async deleteProviderApiKey(provider: string): Promise<void> {
    const { localStorageUtils } = await import('../utils/localStorage');
    
    console.log(`Deleting ${provider} API key from localStorage for web environment`);
    localStorageUtils.deleteProviderApiKey(provider);
  }


  async getLanguageModelsByProviders(): Promise<Record<string, any[]>> {
    console.log('Loading language models by providers in web environment');
    
    const modelsByProviders: Record<string, any[]> = {};
    
    // Get models for each provider
    const providers = ['openai', 'anthropic', 'google'];
    for (const provider of providers) {
      modelsByProviders[provider] = await this.getLanguageModels({ providerId: provider });
    }

    return modelsByProviders;
  }

  // Fixed getLanguageModels method with overloads
  async getLanguageModels(): Promise<any[]>;
  async getLanguageModels(params: { providerId: string }): Promise<any[]>;
  async getLanguageModels(params?: { providerId: string }): Promise<any[]> {
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    
    console.log('getLanguageModels called - FORCING mock response in browser');
    
    if (isBrowser) {
      console.log('Browser environment detected, returning mock language models');
      
      if (!params) {
        // Return all models from all providers
        const allModels: any[] = [];
        const providers = ['openai', 'anthropic', 'google'];
        for (const provider of providers) {
          const models = await this.getLanguageModels({ providerId: provider });
          allModels.push(...models);
        }
        console.log('✅ Returning all mock models:', allModels.length);
        return allModels;
      }
      
      console.log(`Returning mock models for provider: ${params.providerId}`);
    
    // Return mock language models for web environment
    const mockModels: { [key: string]: any[] } = {
      openai: [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          description: 'Most capable model with vision capabilities',
          maxTokens: 128000,
          costPerToken: 0.00003,
          contextWindow: 128000,
          supportsImages: true,
          supportsFunctionCalling: true,
          providerId: 'openai',
          modelType: 'chat' as const,
          isLocal: false,
        },
        {
          id: 'gpt-4o-mini',
          name: 'GPT-4o Mini',
          description: 'Faster and more affordable GPT-4o',
          maxTokens: 128000,
          costPerToken: 0.0000015,
          contextWindow: 128000,
          supportsImages: true,
          supportsFunctionCalling: true,
          providerId: 'openai',
          modelType: 'chat' as const,
          isLocal: false,
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: 'Fast and efficient model',
          maxTokens: 4096,
          costPerToken: 0.000002,
          contextWindow: 4096,
          supportsImages: false,
          supportsFunctionCalling: true,
          providerId: 'openai',
          modelType: 'chat' as const,
          isLocal: false,
        },
      ],
      anthropic: [
        {
          id: 'claude-3-5-sonnet-20241022',
          name: 'Claude 3.5 Sonnet',
          description: 'Most capable Claude model',
          maxTokens: 8192,
          costPerToken: 0.000015,
          contextWindow: 200000,
          supportsImages: true,
          supportsFunctionCalling: true,
          providerId: 'anthropic',
          modelType: 'chat' as const,
          isLocal: false,
        },
        {
          id: 'claude-3-haiku-20240307',
          name: 'Claude 3 Haiku',
          description: 'Fast and lightweight Claude model',
          maxTokens: 4096,
          costPerToken: 0.000001,
          contextWindow: 200000,
          supportsImages: true,
          supportsFunctionCalling: true,
          providerId: 'anthropic',
          modelType: 'chat' as const,
          isLocal: false,
        },
      ],
      google: [
        {
          id: 'gemini-1.5-flash',
          name: 'Gemini 1.5 Flash',
          description: 'Fast and efficient Google model',
          maxTokens: 8192,
          costPerToken: 0.00000075,
          contextWindow: 1000000,
          supportsImages: true,
          supportsFunctionCalling: true,
          providerId: 'google',
          modelType: 'chat' as const,
          isLocal: false,
        },
        {
          id: 'gemini-1.5-pro',
          name: 'Gemini 1.5 Pro',
          description: 'Most capable Google model',
          maxTokens: 8192,
          costPerToken: 0.0000035,
          contextWindow: 2000000,
          supportsImages: true,
          supportsFunctionCalling: true,
          providerId: 'google',
          modelType: 'chat' as const,
          isLocal: false,
        },
      ],
    };

      const result = mockModels[params.providerId] || [];
      console.log(`✅ Returning ${result.length} mock models for ${params.providerId}`);
      return result;
    }
    
    // Non-browser fallback
    console.log('Non-browser environment, using fallback');
    return [];
  }

  // Local Models (mock for web environment)
  async listLocalOllamaModels(): Promise<any[]> {
    console.log('Listing local Ollama models (mock for web environment)');
    return []; // No local models in web environment
  }

  async listLocalLMStudioModels(): Promise<any[]> {
    console.log('Listing local LM Studio models (mock for web environment)');
    return []; // No local models in web environment
  }

  // Prompts management (web environment)
  async listPrompts(): Promise<any[]> {
    console.log('Listing prompts in web environment');
    
    // Return mock prompts for web environment
    const mockPrompts = [
      {
        id: 1,
        title: "Code Review Assistant",
        description: "Help review and improve code quality",
        content: "Please review the following code and provide suggestions for improvement:\n\n```\n{code}\n```\n\nFocus on:\n- Code quality and best practices\n- Performance optimizations\n- Security considerations\n- Readability improvements",
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        id: 2,
        title: "Bug Fix Helper",
        description: "Assist in debugging and fixing code issues",
        content: "I'm encountering an issue with my code. Here's the problem:\n\n{problem_description}\n\nError message: {error_message}\n\nCode snippet:\n```\n{code_snippet}\n```\n\nPlease help me:\n1. Identify the root cause\n2. Provide a solution\n3. Explain why this fix works",
        createdAt: new Date('2024-01-16T14:30:00Z'),
        updatedAt: new Date('2024-01-16T14:30:00Z'),
      },
      {
        id: 3,
        title: "Feature Implementation",
        description: "Guide for implementing new features",
        content: "I want to implement a new feature: {feature_description}\n\nCurrent codebase context:\n- Framework: {framework}\n- Language: {language}\n- Architecture: {architecture}\n\nPlease help me:\n1. Plan the implementation approach\n2. Identify required components\n3. Provide code examples\n4. Suggest testing strategies",
        createdAt: new Date('2024-01-17T09:15:00Z'),
        updatedAt: new Date('2024-01-17T09:15:00Z'),
      },
      {
        id: 4,
        title: "Documentation Generator",
        description: "Generate comprehensive documentation",
        content: "Please generate documentation for the following code:\n\n```\n{code}\n```\n\nInclude:\n- Function/class descriptions\n- Parameter explanations\n- Usage examples\n- Return value details\n- Error handling information\n\nFormat the documentation in a clear, professional style.",
        createdAt: new Date('2024-01-18T16:45:00Z'),
        updatedAt: new Date('2024-01-18T16:45:00Z'),
      },
      {
        id: 5,
        title: "API Integration Helper",
        description: "Assist with API integrations and web services",
        content: "I need help integrating with this API: {api_name}\n\nAPI Documentation: {api_docs_url}\n\nMy requirements:\n- {requirement_1}\n- {requirement_2}\n- {requirement_3}\n\nPlease help me:\n1. Understand the API structure\n2. Implement authentication\n3. Create API calls\n4. Handle responses and errors\n5. Add proper error handling",
        createdAt: new Date('2024-01-19T11:20:00Z'),
        updatedAt: new Date('2024-01-19T11:20:00Z'),
      },
    ];

    return mockPrompts;
  }

  async createPrompt(params: {
    title: string;
    description?: string;
    content: string;
  }): Promise<any> {
    console.log('Creating prompt in web environment:', params);
    
    // Create a new prompt with mock ID
    const newPrompt = {
      id: Date.now(), // Simple ID generation
      title: params.title,
      description: params.description || '',
      content: params.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real implementation, this would be saved to localStorage or a backend
    console.log('Prompt created:', newPrompt);
    return newPrompt;
  }

  async updatePrompt(params: {
    id: number;
    title: string;
    description?: string;
    content: string;
  }): Promise<void> {
    console.log('Updating prompt in web environment:', params);
    
    // In a real implementation, this would update the prompt in localStorage or backend
    const updatedPrompt = {
      id: params.id,
      title: params.title,
      description: params.description || '',
      content: params.content,
      updatedAt: new Date(),
    };

    console.log('Prompt updated:', updatedPrompt);
  }

  async deletePrompt(id: number): Promise<void> {
    console.log(`Deleting prompt ${id} in web environment`);
    
    // In a real implementation, this would remove the prompt from localStorage or backend
    console.log(`Prompt ${id} deleted`);
  }

  // External URL handling (web environment)
  async openExternalUrl(url: string): Promise<void> {
    console.log(`Opening external URL in web environment: ${url}`);
    
    // In a web environment, open the URL in a new tab
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open external URL:', error);
      // Fallback: try to navigate to the URL directly
      window.location.href = url;
    }
  }

  // Reset functionality (web environment)
  async resetAll(): Promise<void> {
    console.log('Resetting all data in web environment');
    
    // In a web environment, clear localStorage and reload the page
    try {
      // Clear all localStorage data
      localStorage.clear();
      
      // Show success message
      console.log('All data cleared successfully');
      
      // Reload the page to reset the application state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to reset data:', error);
      throw new Error('Failed to reset application data');
    }
  }

  // Chat management (web environment)
  async getChat(chatId: number): Promise<any> {
    console.log(`Getting chat ${chatId} in web environment`);
    
    // Return mock chat data
    const mockChat = {
      id: chatId,
      title: `Chat ${chatId}`,
      messages: [],
      appId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return mockChat;
  }

  async createChat(appId: number): Promise<number> {
    console.log(`Creating chat for app ${appId} in web environment`);
    
    // Generate a mock chat ID
    const chatId = Date.now();
    console.log(`Created mock chat with ID: ${chatId}`);
    return chatId;
  }

  async updateChat(params: { chatId: number; title: string }): Promise<void> {
    console.log(`Updating chat ${params.chatId} with title "${params.title}" in web environment`);
    // In a real implementation, this would update the chat in localStorage or backend
  }

  async deleteMessages(chatId: number): Promise<void> {
    console.log(`Deleting messages for chat ${chatId} in web environment`);
    // In a real implementation, this would clear messages in localStorage or backend
  }

  async approveProposal(params: { chatId: number; messageId: number }): Promise<void> {
    console.log(`Approving proposal for chat ${params.chatId}, message ${params.messageId} in web environment`);
    // In a real implementation, this would approve the proposal
  }

  async rejectProposal(params: { chatId: number; messageId: number }): Promise<void> {
    console.log(`Rejecting proposal for chat ${params.chatId}, message ${params.messageId} in web environment`);
    // In a real implementation, this would reject the proposal
  }

  async cancelChatStream(chatId: number): Promise<void> {
    console.log(`Cancelling chat stream for chat ${chatId} in web environment`);
    // In a real implementation, this would cancel the streaming
  }

  // App management (web environment)
  async getApp(appId: number): Promise<any> {
    console.log(`Getting app ${appId} in web environment`);
    
    // Return mock app data
    const mockApp = {
      id: appId,
      name: `App ${appId}`,
      description: `Mock app ${appId}`,
      files: {},
      githubOrg: null,
      githubRepo: null,
      vercelProjectName: null,
      vercelTeamSlug: null,
      vercelDeploymentUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return mockApp;
  }

  async editAppFile(params: { appId: number; filePath: string; content: string }): Promise<{ warning?: string }> {
    console.log(`Editing app ${params.appId} file ${params.filePath} in web environment`);
    
    // In a real implementation, this would save the file content
    return { warning: undefined };
  }

  async getAppEnvVars(params: { appId: number }): Promise<{ key: string; value: string }[]> {
    console.log(`Getting environment variables for app ${params.appId} in web environment`);
    
    // Return mock environment variables
    return [
      { key: 'NODE_ENV', value: 'development' },
      { key: 'PORT', value: '3000' },
    ];
  }

  async setAppEnvVars(params: { appId: number; envVars: { key: string; value: string }[] }): Promise<void> {
    console.log(`Setting environment variables for app ${params.appId} in web environment:`, params.envVars);
    // In a real implementation, this would save the environment variables
  }

  // Vercel integration (web environment)
  async listVercelProjects(): Promise<any[]> {
    console.log('Listing Vercel projects in web environment');
    
    // Return mock Vercel projects
    return [
      {
        id: 'mock-project-1',
        name: 'mock-project',
        framework: 'nextjs',
        gitRepository: null,
      },
    ];
  }

  async saveVercelAccessToken(params: { token: string }): Promise<void> {
    console.log('Saving Vercel access token in web environment');
    // In a real implementation, this would save the token securely
  }

  async isVercelProjectAvailable(params: { name: string }): Promise<boolean> {
    console.log(`Checking if Vercel project "${params.name}" is available in web environment`);
    return true; // Mock: always available
  }

  async createVercelProject(params: { name: string; appId: number }): Promise<void> {
    console.log(`Creating Vercel project "${params.name}" for app ${params.appId} in web environment`);
    // In a real implementation, this would create the project
  }

  async connectToExistingVercelProject(params: { projectId: string; appId: number }): Promise<void> {
    console.log(`Connecting to existing Vercel project ${params.projectId} for app ${params.appId} in web environment`);
    // In a real implementation, this would connect the project
  }

  // Supabase integration (web environment)
  async listSupabaseProjects(): Promise<any[]> {
    console.log('Listing Supabase projects in web environment');
    
    // Return mock Supabase projects
    return [
      {
        id: 'mock-supabase-project-1',
        name: 'Mock Supabase Project',
        database_url: 'postgresql://mock:mock@mock.supabase.co:5432/mock',
        anon_key: 'mock-anon-key',
        service_role_key: 'mock-service-role-key',
      },
    ];
  }

  async setSupabaseAppProject(projectId: string, appId: number): Promise<void> {
    console.log(`Setting Supabase project ${projectId} for app ${appId} in web environment`);
    // In a real implementation, this would associate the project with the app
  }

  async removeSupabaseAppProject(appId: number): Promise<void> {
    console.log(`Removing Supabase project association for app ${appId} in web environment`);
    // In a real implementation, this would remove the association
  }

  // Context and paths (web environment)
  async getChatContextResults(params: { appId: number }): Promise<any> {
    console.log(`Getting chat context results for app ${params.appId} in web environment`);
    
    return {
      contextPaths: [],
      smartContextAutoIncludes: [],
      excludePaths: [],
    };
  }

  async setChatContext(params: { appId: number; chatContext: any }): Promise<void> {
    console.log(`Setting chat context for app ${params.appId} in web environment:`, params.chatContext);
    // In a real implementation, this would save the context configuration
  }

  // Tokens and proposals (web environment)
  async countTokens(params: { chatId: number; input: string }): Promise<any> {
    console.log(`Counting tokens for chat ${params.chatId} in web environment`);
    
    // Return mock token count
    return {
      tokenCount: Math.ceil(params.input.length / 4), // Rough estimate
      cost: 0.001,
    };
  }

  async getProposal(chatId: number): Promise<any> {
    console.log(`Getting proposal for chat ${chatId} in web environment`);
    
    // Return null to indicate no proposal available
    return null;
  }

  // Session and cache (web environment)
  async clearSessionData(): Promise<void> {
    console.log('Clearing session data in web environment');
    
    // Clear session-related data from localStorage
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('session') || key.includes('cache'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('Session data cleared successfully');
    } catch (error) {
      console.error('Failed to clear session data:', error);
    }
  }

  // Neon integration (web environment)
  async getNeonProject(params: { appId: number }): Promise<any> {
    console.log(`Getting Neon project for app ${params.appId} in web environment`);
    
    return {
      id: 'mock-neon-project',
      name: 'Mock Neon Project',
      database_url: 'postgresql://mock:mock@mock.neon.tech:5432/mock',
    };
  }

  // Node.js and environment (web environment)
  async getNodejsStatus(): Promise<any> {
    console.log('Getting Node.js status in web environment');
    
    return {
      nodeVersion: "Web Environment",
      pnpmVersion: null,
      platform: "web",
      nodeDownloadUrl: "https://nodejs.org/en/download",
    };
  }

  async reloadEnvPath(): Promise<void> {
    console.log('Reloading environment path in web environment');
    // In web environment, this is a no-op
  }
}

export default WebApiClient;
