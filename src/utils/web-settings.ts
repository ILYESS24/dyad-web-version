// Web-compatible settings utilities
import { isWeb } from './environment';

export interface UserSettings {
  providerSettings?: any;
  defaultProvider?: string;
  defaultModel?: string;
  autoApprove?: boolean;
  telemetryEnabled?: boolean;
  autoUpdateEnabled?: boolean;
  enableDyadPro?: boolean;
  enableProSmartFilesContextMode?: boolean;
}

/**
 * Web-compatible settings management
 */
export const webSettings = {
  /**
   * Read settings from localStorage in web environment
   */
  readSettings(): UserSettings | null {
    if (!isWeb()) {
      // Fallback to original implementation if not in web environment
      const { readSettings: originalReadSettings } = require('./settings');
      return originalReadSettings();
    }

    try {
      const storedSettings = localStorage.getItem('dyad_user_settings');
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
    } catch (error) {
      console.error('Error reading settings from localStorage:', error);
    }

    // Return default settings for web environment
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
      enableDyadPro: false,
      enableProSmartFilesContextMode: false,
    };
  },

  /**
   * Write settings to localStorage in web environment
   */
  writeSettings(settings: UserSettings): void {
    if (!isWeb()) {
      // Fallback to original implementation if not in web environment
      const { writeSettings: originalWriteSettings } = require('./settings');
      return originalWriteSettings(settings);
    }

    try {
      localStorage.setItem('dyad_user_settings', JSON.stringify(settings));
      console.log('Settings saved to localStorage');
    } catch (error) {
      console.error('Error writing settings to localStorage:', error);
    }
  },

  /**
   * Get environment variables (mock for web)
   */
  getEnvVars(): Record<string, string> {
    if (!isWeb()) {
      // Fallback to original implementation if not in web environment
      const { getEnvVars: originalGetEnvVars } = require('./settings');
      return originalGetEnvVars();
    }

    // Return mock environment variables for web
    return {
      OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || "sk-proj-YOUR_OPENAI_API_KEY_HERE",
      ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || "sk-ant-YOUR_ANTHROPIC_API_KEY_HERE",
      GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || "YOUR_GOOGLE_API_KEY_HERE",
      NODE_ENV: 'production',
      VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
    };
  }
};
