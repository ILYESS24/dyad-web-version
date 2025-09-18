export function isWeb(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function isNode(): boolean {
  return false;
}

export function getEnvironment(): 'web' {
  return 'web';
}
