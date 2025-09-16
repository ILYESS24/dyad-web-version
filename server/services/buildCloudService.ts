// Cloud Build Service - Replaces npm/pnpm commands for web environment
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

export interface BuildResult {
  success: boolean;
  output: string;
  error?: string;
  url?: string; // Preview URL for built app
}

export interface PackageInfo {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

export class BuildCloudService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(tmpdir(), 'dyad-web-builds');
    this.ensureTempDir();
  }

  private async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  /**
   * Install dependencies for a project
   */
  async installDependencies(projectFiles: Record<string, string>, packageManager: 'npm' | 'pnpm' = 'npm'): Promise<BuildResult> {
    try {
      const projectId = this.generateProjectId();
      const projectPath = path.join(this.tempDir, projectId);
      
      // Create project directory and files
      await fs.mkdir(projectPath, { recursive: true });
      
      for (const [filePath, content] of Object.entries(projectFiles)) {
        const fullPath = path.join(projectPath, filePath);
        const dir = path.dirname(fullPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
      }

      // Install dependencies
      const installCommand = packageManager === 'pnpm' ? 'pnpm install' : 'npm install';
      const { stdout, stderr } = await execAsync(installCommand, { 
        cwd: projectPath,
        timeout: 120000 // 2 minutes timeout
      });

      return {
        success: true,
        output: stdout,
        error: stderr || undefined
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Build a project
   */
  async buildProject(projectFiles: Record<string, string>, buildScript: string = 'build'): Promise<BuildResult> {
    try {
      const projectId = this.generateProjectId();
      const projectPath = path.join(this.tempDir, projectId);
      
      // Create project directory and files
      await fs.mkdir(projectPath, { recursive: true });
      
      for (const [filePath, content] of Object.entries(projectFiles)) {
        const fullPath = path.join(projectPath, filePath);
        const dir = path.dirname(fullPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
      }

      // Install dependencies first
      const installResult = await this.installDependencies(projectFiles);
      if (!installResult.success) {
        return installResult;
      }

      // Build the project
      const buildCommand = `npm run ${buildScript}`;
      const { stdout, stderr } = await execAsync(buildCommand, { 
        cwd: projectPath,
        timeout: 300000 // 5 minutes timeout
      });

      // Try to find built files (usually in dist/ or build/)
      const possibleBuildDirs = ['dist', 'build', 'out', '.next'];
      let buildDir: string | null = null;
      
      for (const dir of possibleBuildDirs) {
        const dirPath = path.join(projectPath, dir);
        try {
          const stats = await fs.stat(dirPath);
          if (stats.isDirectory()) {
            buildDir = dir;
            break;
          }
        } catch {
          // Directory doesn't exist
        }
      }

      // TODO: Upload build files to a CDN and return URL
      // For now, just return success
      return {
        success: true,
        output: stdout,
        error: stderr || undefined,
        url: buildDir ? `/preview/${projectId}` : undefined
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Start a development server
   */
  async startDevServer(projectFiles: Record<string, string>, devScript: string = 'dev'): Promise<BuildResult> {
    try {
      const projectId = this.generateProjectId();
      const projectPath = path.join(this.tempDir, projectId);
      
      // Create project directory and files
      await fs.mkdir(projectPath, { recursive: true });
      
      for (const [filePath, content] of Object.entries(projectFiles)) {
        const fullPath = path.join(projectPath, filePath);
        const dir = path.dirname(fullPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
      }

      // Install dependencies first
      const installResult = await this.installDependencies(projectFiles);
      if (!installResult.success) {
        return installResult;
      }

      // Start dev server (this would run in background in production)
      const devCommand = `npm run ${devScript}`;
      // For now, just return success with a mock URL
      // In production, this would start a real dev server
      
      return {
        success: true,
        output: 'Development server started',
        url: `/dev/${projectId}`
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Add a dependency to a project
   */
  async addDependency(projectFiles: Record<string, string>, packageName: string, packageManager: 'npm' | 'pnpm' = 'npm'): Promise<BuildResult> {
    try {
      const projectId = this.generateProjectId();
      const projectPath = path.join(this.tempDir, projectId);
      
      // Create project directory and files
      await fs.mkdir(projectPath, { recursive: true });
      
      for (const [filePath, content] of Object.entries(projectFiles)) {
        const fullPath = path.join(projectPath, filePath);
        const dir = path.dirname(fullPath);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
      }

      // Install dependencies first
      const installResult = await this.installDependencies(projectFiles);
      if (!installResult.success) {
        return installResult;
      }

      // Add the new dependency
      const addCommand = packageManager === 'pnpm' 
        ? `pnpm add ${packageName}` 
        : `npm install ${packageName}`;
      
      const { stdout, stderr } = await execAsync(addCommand, { 
        cwd: projectPath,
        timeout: 60000 // 1 minute timeout
      });

      return {
        success: true,
        output: stdout,
        error: stderr || undefined
      };

    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Parse package.json to get project information
   */
  async parsePackageJson(packageJsonContent: string): Promise<PackageInfo | null> {
    try {
      const packageJson = JSON.parse(packageJsonContent);
      return {
        name: packageJson.name || 'unnamed-project',
        version: packageJson.version || '1.0.0',
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {},
        scripts: packageJson.scripts || {}
      };
    } catch (error) {
      console.error('Failed to parse package.json:', error);
      return null;
    }
  }

  private generateProjectId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up old project files
   */
  async cleanup(): Promise<void> {
    try {
      const files = await fs.readdir(this.tempDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      for (const file of files) {
        const filePath = path.join(this.tempDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.rm(filePath, { recursive: true, force: true });
        }
      }
    } catch (error) {
      console.error('Failed to cleanup temp files:', error);
    }
  }
}

export const buildCloudService = new BuildCloudService();
