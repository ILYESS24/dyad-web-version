// Local Storage utilities for web environment
// This replaces the file system storage used in Electron

const STORAGE_KEYS = {
  USER_SETTINGS: 'dyad_user_settings',
  ENV_VARS: 'dyad_env_vars',
  PROVIDER_SETTINGS: 'dyad_provider_settings',
} as const;

export interface UserSettings {
  providerSettings: {
    [provider: string]: {
      apiKey: {
        value: string;
      };
    };
  };
  defaultProvider: string;
  defaultModel: string;
  autoApprove: boolean;
  telemetryEnabled: boolean;
  autoUpdateEnabled: boolean;
}

export interface EnvVars {
  [key: string]: string;
}

export const localStorageUtils = {
  // User Settings
  getUserSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading user settings from localStorage:', error);
    }

    // Return default settings
    return {
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
  },

  setUserSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving user settings to localStorage:', error);
    }
  },

  // Environment Variables
  getEnvVars(): EnvVars {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ENV_VARS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading env vars from localStorage:', error);
    }

    // Return default env vars
    return {
      OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || "sk-proj-YOUR_OPENAI_API_KEY_HERE",
      ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || "sk-ant-YOUR_ANTHROPIC_API_KEY_HERE",
      GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_GOOGLE_API_KEY_HERE",
    };
  },

  setEnvVars(envVars: EnvVars): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ENV_VARS, JSON.stringify(envVars));
    } catch (error) {
      console.error('Error saving env vars to localStorage:', error);
    }
  },

  // Provider Settings (for backward compatibility)
  getProviderSettings() {
    const userSettings = this.getUserSettings();
    return userSettings.providerSettings;
  },

  setProviderSettings(providerSettings: any): void {
    const userSettings = this.getUserSettings();
    userSettings.providerSettings = providerSettings;
    this.setUserSettings(userSettings);
  },

  // Update specific provider API key
  updateProviderApiKey(provider: string, apiKey: string): void {
    const userSettings = this.getUserSettings();
    if (!userSettings.providerSettings[provider]) {
      userSettings.providerSettings[provider] = { apiKey: { value: '' } };
    }
    userSettings.providerSettings[provider].apiKey.value = apiKey;
    this.setUserSettings(userSettings);

    // Also update env vars if applicable
    const envVarName = this.getEnvVarNameForProvider(provider);
    if (envVarName) {
      const envVars = this.getEnvVars();
      envVars[envVarName] = apiKey;
      this.setEnvVars(envVars);
    }
  },

  // Delete provider API key
  deleteProviderApiKey(provider: string): void {
    const userSettings = this.getUserSettings();
    if (userSettings.providerSettings[provider]) {
      userSettings.providerSettings[provider].apiKey.value = '';
      this.setUserSettings(userSettings);
    }

    // Also clear env vars if applicable
    const envVarName = this.getEnvVarNameForProvider(provider);
    if (envVarName) {
      const envVars = this.getEnvVars();
      envVars[envVarName] = '';
      this.setEnvVars(envVars);
    }
  },

  // Get environment variable name for provider
  getEnvVarNameForProvider(provider: string): string | null {
    const envVarMap: { [key: string]: string } = {
      openai: 'OPENAI_API_KEY',
      anthropic: 'ANTHROPIC_API_KEY',
      google: 'GOOGLE_API_KEY',
      azure: 'AZURE_API_KEY',
    };
    return envVarMap[provider] || null;
  },

  // Clear all data (useful for debugging)
  clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Check if localStorage is available
  isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
};
