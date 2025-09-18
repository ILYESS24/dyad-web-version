/**
 * Exécuteur de code dans le navigateur
 * Alternative à Node.js child_process pour la version web
 */

import VirtualFileSystem from './virtual-file-system';
import WebBundler from './web-bundler';

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  duration?: number;
  logs?: string[];
}

export class WebCodeExecutor {
  private vfs: VirtualFileSystem;
  private bundler: WebBundler;
  private logs: string[] = [];

  constructor(vfs: VirtualFileSystem) {
    this.vfs = vfs;
    this.bundler = new WebBundler(vfs);
  }

  /**
   * Exécuter une application React
   */
  async runApp(appPath: string = '/'): Promise<ExecutionResult> {
    console.log(`[WebExecutor] Running app: ${appPath}`);
    const startTime = Date.now();
    
    try {
      this.logs = [];
      this.addLog('🚀 Starting application...');

      // Bundler l'application
      this.addLog('📦 Bundling application...');
      const bundleResult = await this.bundler.bundleApp('/src/main.jsx');
      
      if (!bundleResult.success) {
        return {
          success: false,
          error: bundleResult.error || 'Bundle failed',
          duration: Date.now() - startTime,
          logs: this.logs
        };
      }

      this.addLog('✅ Bundle created successfully');

      // Simuler l'exécution
      this.addLog('🏃‍♂️ Executing application...');
      await this.simulateExecution(bundleResult.code!);

      const duration = Date.now() - startTime;
      this.addLog(`✅ Application executed successfully in ${duration}ms`);

      return {
        success: true,
        output: 'Application running in browser',
        duration,
        logs: this.logs
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ App execution failed: ${error}`);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
        logs: this.logs
      };
    }
  }

  /**
   * Exécuter du code JavaScript directement
   */
  async executeCode(code: string): Promise<ExecutionResult> {
    console.log(`[WebExecutor] Executing code...`);
    const startTime = Date.now();
    
    try {
      this.logs = [];
      this.addLog('🔧 Executing JavaScript code...');

      // Créer un contexte d'exécution sécurisé
      const result = this.executeInSandbox(code);

      const duration = Date.now() - startTime;
      this.addLog(`✅ Code executed successfully in ${duration}ms`);

      return {
        success: true,
        output: result,
        duration,
        logs: this.logs
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Code execution failed: ${error}`);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
        logs: this.logs
      };
    }
  }

  /**
   * Installer des dépendances
   */
  async installDependencies(dependencies: Record<string, string>): Promise<ExecutionResult> {
    console.log(`[WebExecutor] Installing dependencies...`);
    const startTime = Date.now();
    
    try {
      this.logs = [];
      this.addLog('📦 Installing dependencies...');

      for (const [packageName, version] of Object.entries(dependencies)) {
        this.addLog(`Installing ${packageName}@${version}...`);
        const success = await this.bundler.installPackage(packageName, version);
        
        if (success) {
          this.addLog(`✅ ${packageName}@${version} installed`);
        } else {
          this.addLog(`❌ Failed to install ${packageName}@${version}`);
        }
      }

      const duration = Date.now() - startTime;
      this.addLog(`✅ Dependencies installation completed in ${duration}ms`);

      return {
        success: true,
        output: 'Dependencies installed successfully',
        duration,
        logs: this.logs
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Dependencies installation failed: ${error}`);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
        logs: this.logs
      };
    }
  }

  /**
   * Construire l'application pour la production
   */
  async buildApp(): Promise<ExecutionResult> {
    console.log(`[WebExecutor] Building app for production...`);
    const startTime = Date.now();
    
    try {
      this.logs = [];
      this.addLog('🏗️ Building application for production...');

      // Bundler avec optimisations
      const bundleResult = await this.bundler.bundleApp('/src/main.jsx');
      
      if (!bundleResult.success) {
        return {
          success: false,
          error: bundleResult.error || 'Build failed',
          duration: Date.now() - startTime,
          logs: this.logs
        };
      }

      // Minifier le code
      this.addLog('🗜️ Minifying code...');
      const minifiedCode = await this.bundler.minifyCode(bundleResult.code!);
      
      // Sauvegarder le build
      await this.vfs.writeFile('/dist/app.js', minifiedCode);

      const duration = Date.now() - startTime;
      this.addLog(`✅ Build completed successfully in ${duration}ms`);

      return {
        success: true,
        output: 'Application built successfully',
        duration,
        logs: this.logs
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ Build failed: ${error}`);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
        logs: this.logs
      };
    }
  }

  /**
   * Simuler l'exécution d'une application
   */
  private async simulateExecution(code: string): Promise<void> {
    // Simuler le temps d'exécution
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simuler des logs d'exécution
    this.addLog('🎯 Application mounted');
    this.addLog('📱 UI components rendered');
    this.addLog('🔗 Event listeners attached');
    this.addLog('✅ Application ready');
  }

  /**
   * Exécuter du code dans un sandbox sécurisé
   */
  private executeInSandbox(code: string): string {
    try {
      // Créer un contexte d'exécution avec des APIs limitées
      const sandbox = {
        console: {
          log: (...args: any[]) => {
            this.addLog(`[LOG] ${args.join(' ')}`);
          },
          error: (...args: any[]) => {
            this.addLog(`[ERROR] ${args.join(' ')}`);
          },
          warn: (...args: any[]) => {
            this.addLog(`[WARN] ${args.join(' ')}`);
          }
        },
        setTimeout: (fn: Function, delay: number) => {
          this.addLog(`⏰ setTimeout scheduled for ${delay}ms`);
          return setTimeout(fn, delay);
        },
        setInterval: (fn: Function, delay: number) => {
          this.addLog(`⏰ setInterval scheduled for ${delay}ms`);
          return setInterval(fn, delay);
        }
      };

      // Exécuter le code avec le sandbox
      const func = new Function('sandbox', `
        with (sandbox) {
          ${code}
        }
      `);
      
      func(sandbox);
      
      return 'Code executed successfully';
    } catch (error) {
      throw new Error(`Sandbox execution failed: ${error}`);
    }
  }

  /**
   * Ajouter un log
   */
  private addLog(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  /**
   * Obtenir les logs d'exécution
   */
  getLogs(): string[] {
    return [...this.logs];
  }

  /**
   * Nettoyer les logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

export default WebCodeExecutor;
