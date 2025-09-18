// Web-compatible paths
import { isWeb } from '../utils/environment';

export function getDyadAppPath(appPath: string): string {
  if (isWeb()) {
    // In web environment, use virtual app paths
    return `/virtual-apps/${appPath}`;
  }
  // Fallback for non-web (should not happen in web version)
  return `/fallback-apps/${appPath}`;
}

export function getTypeScriptCachePath(): string {
  if (isWeb()) {
    // In web environment, use virtual cache path
    return `/virtual-cache/typescript`;
  }
  return `/fallback-cache/typescript`;
}

export function getAppsPath(): string {
  if (isWeb()) {
    return `/virtual-apps`;
  }
  return `/fallback-apps`;
}

export function getSettingsPath(): string {
  if (isWeb()) {
    return `/virtual-settings`;
  }
  return `/fallback-settings`;
}

export function getLogsPath(): string {
  if (isWeb()) {
    return `/virtual-logs`;
  }
  return `/fallback-logs`;
}

export function getTemplatesPath(): string {
  if (isWeb()) {
    return `/virtual-templates`;
  }
  return `/fallback-templates`;
}

export function getModelsPath(): string {
  if (isWeb()) {
    return `/virtual-models`;
  }
  return `/fallback-models`;
}

// Web-compatible path utilities
export function join(...paths: string[]): string {
  if (isWeb()) {
    return paths.join('/').replace(/\/+/g, '/');
  }
  return paths.join('/');
}

export function basename(path: string): string {
  if (isWeb()) {
    return path.split('/').pop() || '';
  }
  return path.split('/').pop() || '';
}

export function dirname(path: string): string {
  if (isWeb()) {
    const parts = path.split('/');
    parts.pop();
    return parts.join('/') || '/';
  }
  const parts = path.split('/');
  parts.pop();
  return parts.join('/') || '/';
}

export function extname(path: string): string {
  if (isWeb()) {
    const lastDot = path.lastIndexOf('.');
    return lastDot > 0 ? path.slice(lastDot) : '';
  }
  const lastDot = path.lastIndexOf('.');
  return lastDot > 0 ? path.slice(lastDot) : '';
}

export function relative(from: string, to: string): string {
  if (isWeb()) {
    // Simple relative path calculation for web
    const fromParts = from.split('/');
    const toParts = to.split('/');
    
    let i = 0;
    while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
      i++;
    }
    
    const relativeParts = toParts.slice(i);
    return relativeParts.join('/');
  }
  return to;
}

export function normalize(path: string): string {
  if (isWeb()) {
    return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }
  return path;
}

export function resolve(...paths: string[]): string {
  if (isWeb()) {
    const resolved = paths.join('/').replace(/\/+/g, '/');
    return resolved.startsWith('/') ? resolved : '/' + resolved;
  }
  return paths.join('/');
}

export function isAbsolute(path: string): boolean {
  if (isWeb()) {
    return path.startsWith('/');
  }
  return path.startsWith('/');
}

// Mock functions for compatibility
function getElectron(): any {
  if (isWeb()) {
    return null;
  }
  return null;
}