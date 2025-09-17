// Web-compatible path utilities
import { isWeb } from './environment';

/**
 * Web-compatible path utilities
 */
export const webPaths = {
  /**
   * Get user data directory (mock for web)
   */
  getUserDataPath(): string {
    if (!isWeb()) {
      // Fallback to original implementation if not in web environment
      const { paths } = require('./paths');
      return paths.getUserDataPath();
    }
    return '/mock-user-data';
  },

  /**
   * Get apps directory (mock for web)
   */
  getAppsPath(): string {
    if (!isWeb()) {
      const { paths } = require('./paths');
      return paths.getAppsPath();
    }
    return '/mock-apps';
  },

  /**
   * Get settings file path (mock for web)
   */
  getSettingsPath(): string {
    if (!isWeb()) {
      const { paths } = require('./paths');
      return paths.getSettingsPath();
    }
    return '/mock-settings.json';
  },

  /**
   * Get logs directory (mock for web)
   */
  getLogsPath(): string {
    if (!isWeb()) {
      const { paths } = require('./paths');
      return paths.getLogsPath();
    }
    return '/mock-logs';
  },

  /**
   * Get temp directory (mock for web)
   */
  getTempPath(): string {
    if (!isWeb()) {
      const { paths } = require('./paths');
      return paths.getTempPath();
    }
    return '/tmp';
  },

  /**
   * Join paths (web-compatible)
   */
  join(...paths: string[]): string {
    if (!isWeb()) {
      const path = require('node:path');
      return path.join(...paths);
    }
    // Simple web implementation
    return paths.filter(p => p && p !== '/').join('/');
  },

  /**
   * Get basename (web-compatible)
   */
  basename(path: string): string {
    if (!isWeb()) {
      const pathModule = require('node:path');
      return pathModule.basename(path);
    }
    // Simple web implementation
    return path.split('/').pop() || path;
  },

  /**
   * Get dirname (web-compatible)
   */
  dirname(path: string): string {
    if (!isWeb()) {
      const pathModule = require('node:path');
      return pathModule.dirname(path);
    }
    // Simple web implementation
    const parts = path.split('/');
    parts.pop();
    return parts.join('/') || '/';
  },

  /**
   * Check if path is absolute (web-compatible)
   */
  isAbsolute(path: string): boolean {
    if (!isWeb()) {
      const pathModule = require('node:path');
      return pathModule.isAbsolute(path);
    }
    // Simple web implementation
    return path.startsWith('/');
  },

  /**
   * Resolve path (web-compatible)
   */
  resolve(...paths: string[]): string {
    if (!isWeb()) {
      const path = require('node:path');
      return path.resolve(...paths);
    }
    // Simple web implementation
    return '/' + paths.filter(p => p && p !== '/').join('/');
  }
};