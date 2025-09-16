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

  async runApp(appId: number, onOutput?: (output: any) => void): Promise<void> {
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
    // Import localStorage utils dynamically to avoid circular imports
    const { localStorageUtils } = await import('../utils/localStorage');
    
    console.log('Loading user settings from localStorage for web environment');
    return localStorageUtils.getUserSettings();
  }

  async setUserSettings(settings: any) {
    // Import localStorage utils dynamically to avoid circular imports
    const { localStorageUtils } = await import('../utils/localStorage');
    
    console.log('Saving user settings to localStorage for web environment:', settings);
    localStorageUtils.setUserSettings(settings);
    return settings; // Return the settings as if they were saved
  }

  async updateUserSettings(settings: any) {
    return this.setUserSettings(settings);
  }

  async getEnvVars() {
    // Import localStorage utils dynamically to avoid circular imports
    const { localStorageUtils } = await import('../utils/localStorage');
    
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
    const { localStorageUtils } = await import('../utils/localStorage');
    
    console.log(`Updating ${provider} API key in localStorage for web environment`);
    localStorageUtils.updateProviderApiKey(provider, apiKey);
  }

  // Delete provider API key (web environment)
  async deleteProviderApiKey(provider: string): Promise<void> {
    const { localStorageUtils } = await import('../utils/localStorage');
    
    console.log(`Deleting ${provider} API key from localStorage for web environment`);
    localStorageUtils.deleteProviderApiKey(provider);
  }

  // Language Models (web environment)
  async getLanguageModels({ providerId }: { providerId: string }): Promise<any[]> {
    console.log(`Loading language models for provider: ${providerId} in web environment`);
    
    // Return mock language models for web environment
    const mockModels: { [key: string]: any[] } = {
      openai: [
        {
          id: 'gpt-4o',
          name: 'GPT-4o',
          providerId: 'openai',
          description: 'Most capable GPT-4 model with vision capabilities',
          maxTokens: 128000,
          inputCost: 0.005,
          outputCost: 0.015,
          contextWindow: 128000,
        },
        {
          id: 'gpt-4o-mini',
          name: 'GPT-4o Mini',
          providerId: 'openai',
          description: 'Fast and affordable GPT-4 model',
          maxTokens: 128000,
          inputCost: 0.00015,
          outputCost: 0.0006,
          contextWindow: 128000,
        },
        {
          id: 'gpt-4-turbo',
          name: 'GPT-4 Turbo',
          providerId: 'openai',
          description: 'GPT-4 with improved performance',
          maxTokens: 128000,
          inputCost: 0.01,
          outputCost: 0.03,
          contextWindow: 128000,
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          providerId: 'openai',
          description: 'Fast and efficient GPT-3.5 model',
          maxTokens: 16385,
          inputCost: 0.0005,
          outputCost: 0.0015,
          contextWindow: 16385,
        },
      ],
      anthropic: [
        {
          id: 'claude-3-5-sonnet-20241022',
          name: 'Claude 3.5 Sonnet',
          providerId: 'anthropic',
          description: 'Most intelligent Claude model with enhanced capabilities',
          maxTokens: 200000,
          inputCost: 0.003,
          outputCost: 0.015,
          contextWindow: 200000,
        },
        {
          id: 'claude-3-5-haiku-20241022',
          name: 'Claude 3.5 Haiku',
          providerId: 'anthropic',
          description: 'Fast and efficient Claude model',
          maxTokens: 200000,
          inputCost: 0.0008,
          outputCost: 0.004,
          contextWindow: 200000,
        },
        {
          id: 'claude-3-opus-20240229',
          name: 'Claude 3 Opus',
          providerId: 'anthropic',
          description: 'Most powerful Claude 3 model',
          maxTokens: 200000,
          inputCost: 0.015,
          outputCost: 0.075,
          contextWindow: 200000,
        },
      ],
      google: [
        {
          id: 'gemini-1.5-pro',
          name: 'Gemini 1.5 Pro',
          providerId: 'google',
          description: 'Most capable Gemini model with large context',
          maxTokens: 2097152,
          inputCost: 0.00125,
          outputCost: 0.005,
          contextWindow: 2097152,
        },
        {
          id: 'gemini-1.5-flash',
          name: 'Gemini 1.5 Flash',
          providerId: 'google',
          description: 'Fast and efficient Gemini model',
          maxTokens: 1048576,
          inputCost: 0.000075,
          outputCost: 0.0003,
          contextWindow: 1048576,
        },
        {
          id: 'gemini-pro',
          name: 'Gemini Pro',
          providerId: 'google',
          description: 'Standard Gemini Pro model',
          maxTokens: 32768,
          inputCost: 0.0005,
          outputCost: 0.0015,
          contextWindow: 32768,
        },
      ],
    };

    return mockModels[providerId] || [];
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
}

export default WebApiClient;
