// Environment detection utilities

export function isElectron(): boolean {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
}

export function isWeb(): boolean {
  // Force web environment detection for Vercel deployment
  if (typeof window === 'undefined') return false;
  
  // Always return true if we're in a browser (since we removed all Node.js dependencies)
  const isBrowser = typeof window !== 'undefined' && 
                   typeof document !== 'undefined' && 
                   typeof navigator !== 'undefined';
  
  // Since we removed all Node.js dependencies, if we're in a browser, we're in web mode
  const result = isBrowser;
  
  // Debug logging for troubleshooting
  if (typeof window !== 'undefined' && window.console) {
    console.log('Environment detection (FORCED WEB):', {
      isBrowser,
      result,
      hostname: window.location?.hostname,
      userAgent: navigator?.userAgent
    });
  }
  
  return result;
}

export function isNode(): boolean {
  return typeof process !== 'undefined' && process.versions && process.versions.node;
}

export function getEnvironment(): 'electron' | 'web' | 'node' {
  if (isElectron()) return 'electron';
  if (isNode()) return 'node';
  return 'web';
}
