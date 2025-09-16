// Sandbox Service - Integrates with StackBlitz/CodeSandbox for web execution
import fetch from 'node-fetch';

export interface SandboxProject {
  id: string;
  title: string;
  description: string;
  files: Record<string, string>;
  template: string;
  dependencies?: Record<string, string>;
}

export interface SandboxResult {
  success: boolean;
  sandboxId?: string;
  url?: string;
  error?: string;
}

export class SandboxService {
  private stackblitzApiUrl = 'https://stackblitz.com/run';

  /**
   * Create a new StackBlitz project
   */
  async createStackBlitzProject(project: SandboxProject): Promise<SandboxResult> {
    try {
      // StackBlitz API integration
      const stackblitzData = {
        title: project.title,
        description: project.description,
        template: project.template || 'react',
        files: project.files,
        dependencies: project.dependencies || {},
        settings: {
          compile: {
            trigger: 'auto',
            clearConsole: false
          },
          bundler: 'vite'
        }
      };

      // For now, return a mock URL
      // In production, this would make a real API call to StackBlitz
      const sandboxId = this.generateSandboxId();
      
      return {
        success: true,
        sandboxId,
        url: `https://stackblitz.com/edit/${sandboxId}`
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Create a React project in StackBlitz
   */
  async createReactProject(appName: string, files: Record<string, string>): Promise<SandboxResult> {
    const project: SandboxProject = {
      id: this.generateSandboxId(),
      title: appName,
      description: `Dyad Web App: ${appName}`,
      files: {
        'package.json': JSON.stringify({
          name: appName.toLowerCase().replace(/\s+/g, '-'),
          version: '0.1.0',
          private: true,
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0',
            'react-scripts': '5.0.1'
          },
          scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build',
            test: 'react-scripts test',
            eject: 'react-scripts eject'
          },
          browserslist: {
            production: ['>0.2%', 'not dead', 'not op_mini all'],
            development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version']
          }
        }, null, 2),
        'public/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="${appName}" />
    <title>${appName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,
        'src/index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        'src/index.css': `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
        ...files
      },
      template: 'react'
    };

    return this.createStackBlitzProject(project);
  }

  /**
   * Create a Vite project in StackBlitz
   */
  async createViteProject(appName: string, files: Record<string, string>): Promise<SandboxResult> {
    const project: SandboxProject = {
      id: this.generateSandboxId(),
      title: appName,
      description: `Dyad Web App: ${appName}`,
      files: {
        'package.json': JSON.stringify({
          name: appName.toLowerCase().replace(/\s+/g, '-'),
          private: true,
          version: '0.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview'
          },
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0'
          },
          devDependencies: {
            '@types/react': '^18.2.43',
            '@types/react-dom': '^18.2.17',
            '@vitejs/plugin-react': '^4.2.1',
            vite: '^5.0.8'
          }
        }, null, 2),
        'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`,
        'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
        'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
        'src/index.css': `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}`,
        ...files
      },
      template: 'vite-react'
    };

    return this.createStackBlitzProject(project);
  }

  /**
   * Create a Next.js project in StackBlitz
   */
  async createNextProject(appName: string, files: Record<string, string>): Promise<SandboxResult> {
    const project: SandboxProject = {
      id: this.generateSandboxId(),
      title: appName,
      description: `Dyad Web App: ${appName}`,
      files: {
        'package.json': JSON.stringify({
          name: appName.toLowerCase().replace(/\s+/g, '-'),
          version: '0.1.0',
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
            lint: 'next lint'
          },
          dependencies: {
            react: '^18',
            'react-dom': '^18',
            next: '14.0.4'
          },
          devDependencies: {
            typescript: '^5',
            '@types/node': '^20',
            '@types/react': '^18',
            '@types/react-dom': '^18',
            eslint: '^8',
            'eslint-config-next': '14.0.4'
          }
        }, null, 2),
        'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig`,
        'tsconfig.json': `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,
        'pages/_app.tsx': `import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}`,
        'pages/index.tsx': `import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div>
      <h1>${appName}</h1>
      <p>Welcome to your Next.js app!</p>
    </div>
  )
}

export default Home`,
        ...files
      },
      template: 'nextjs'
    };

    return this.createStackBlitzProject(project);
  }

  private generateSandboxId(): string {
    return `dyad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get project template based on package.json
   */
  detectTemplate(files: Record<string, string>): string {
    const packageJson = files['package.json'];
    if (!packageJson) return 'vanilla';

    try {
      const pkg = JSON.parse(packageJson);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.next) return 'nextjs';
      if (deps['@vitejs/plugin-react'] || deps.vite) return 'vite-react';
      if (deps['react-scripts']) return 'react';
      if (deps.vue) return 'vue';
      if (deps.svelte) return 'svelte';
      if (deps.angular) return 'angular';
      
      return 'vanilla';
    } catch {
      return 'vanilla';
    }
  }
}

export const sandboxService = new SandboxService();
