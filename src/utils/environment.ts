// Environment detection utilities

export function isElectron(): boolean {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
}

export function isWeb(): boolean {
  // More robust web detection
  if (typeof window === 'undefined') return false;
  
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined' && 
                   typeof document !== 'undefined' && 
                   typeof navigator !== 'undefined';
  
  // Check if we're NOT in Electron
  const isNotElectron = !isElectron();
  
  // Additional check: if we're running on Vercel or in a web deployment
  const isWebDeployment = typeof window !== 'undefined' && 
                         (window.location?.hostname?.includes('vercel.app') ||
                          window.location?.hostname?.includes('netlify.app') ||
                          window.location?.hostname?.includes('github.io'));
  
  const result = isBrowser && isNotElectron;
  
  // Debug logging for troubleshooting
  if (typeof window !== 'undefined' && window.console) {
    console.log('Environment detection:', {
      isBrowser,
      isNotElectron,
      isWebDeployment,
      result,
      hostname: window.location?.hostname
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
