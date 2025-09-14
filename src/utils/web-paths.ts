// Web-compatible path utilities to replace Node.js paths

export function getDyadAppPath(appPath: string): string {
  // For web version, use localStorage or mock paths
  return `/apps/${appPath}`;
}

export function getTypeScriptCachePath(): string {
  // For web version, use browser cache or mock
  return '/cache/typescript';
}

export function getUserDataPath(): string {
  // For web version, use browser storage
  return '/user-data';
}

export function getElectron(): any {
  // Mock electron for web compatibility
  return null;
}
