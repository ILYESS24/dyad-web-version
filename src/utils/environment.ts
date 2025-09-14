// Environment detection utilities

export function isElectron(): boolean {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
}

export function isWeb(): boolean {
  return typeof window !== 'undefined' && !isElectron();
}

export function isNode(): boolean {
  return typeof process !== 'undefined' && process.versions && process.versions.node;
}

export function getEnvironment(): 'electron' | 'web' | 'node' {
  if (isElectron()) return 'electron';
  if (isNode()) return 'node';
  return 'web';
}
