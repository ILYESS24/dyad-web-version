// Web-compatible logger to replace electron-log

export interface LogFunctions {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

class WebLogger implements LogFunctions {
  private scope: string;

  constructor(scope: string) {
    this.scope = scope;
  }

  log(...args: any[]) {
    console.log(`[${this.scope}]`, ...args);
  }

  info(...args: any[]) {
    console.info(`[${this.scope}]`, ...args);
  }

  warn(...args: any[]) {
    console.warn(`[${this.scope}]`, ...args);
  }

  error(...args: any[]) {
    console.error(`[${this.scope}]`, ...args);
  }

  debug(...args: any[]) {
    // In web environment, always show debug logs
    if (typeof window !== 'undefined') {
      console.debug(`[${this.scope}]`, ...args);
    } else if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.debug(`[${this.scope}]`, ...args);
    }
  }
}

export default {
  scope: (scope: string): LogFunctions => new WebLogger(scope),
  log: (...args: any[]) => console.log(...args),
  info: (...args: any[]) => console.info(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
  debug: (...args: any[]) => {
    // In web environment, always show debug logs
    if (typeof window !== 'undefined') {
      console.debug(...args);
    } else if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.debug(...args);
    }
  }
};
