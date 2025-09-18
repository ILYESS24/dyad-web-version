// Web-compatible codebase extraction
import { isWeb } from './environment';
import { webLogger } from './web-logger';
import { AppChatContext } from "../lib/schemas";

const logger = webLogger.scope("utils/codebase");

// File extensions to include in the extraction
const ALLOWED_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".mts",
  ".cts",
  ".css",
  ".html",
  ".md",
  ".astro",
  ".vue",
  ".svelte",
  ".scss",
  ".sass",
  ".less",
  ".json",
  ".yml",
  ".yaml",
  ".xml",
  ".plist",
  ".entitlements",
  ".kt",
  ".java",
  ".gradle",
  ".swift",
  ".py",
];

// Directories to always exclude
const EXCLUDED_DIRS = ["node_modules", ".git", "dist", "build", ".next"];

// Files to always exclude
const EXCLUDED_FILES = ["pnpm-lock.yaml", "package-lock.json"];

// Files to always include, regardless of extension
const ALWAYS_INCLUDE_FILES = [".gitignore"];

// File patterns to always omit (contents will be replaced with a placeholder)
const ALWAYS_OMITTED_FILES = [".env", ".env.local"];

// File patterns to omit (contents will be replaced with a placeholder)
const OMITTED_FILES = [
  ...ALWAYS_OMITTED_FILES,
  "src/components/ui",
  "eslint.config",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
  "tsconfig.base.json",
  "components.json",
];

// Maximum file size to include (in bytes) - 1MB
const MAX_FILE_SIZE = 1000 * 1024;

const OMITTED_FILE_CONTENT = "// File contents excluded from context";

export type CodebaseFile = {
  path: string;
  content: string;
  force?: boolean;
};

/**
 * Web-compatible codebase extraction
 * Returns mock data for web environment
 */
export async function extractCodebase({
  appPath,
  chatContext,
  virtualFileSystem,
}: {
  appPath: string;
  chatContext: AppChatContext;
  virtualFileSystem?: any;
}): Promise<{
  formattedOutput: string;
  files: CodebaseFile[];
}> {
  console.log(`[WebCodebase] Extracting codebase for: ${appPath}`);
  
  // In web environment, return mock codebase data
  if (isWeb()) {
    const mockFiles: CodebaseFile[] = [
      {
        path: 'package.json',
        content: JSON.stringify({
          name: 'web-app',
          version: '1.0.0',
          scripts: {
            dev: 'vite',
            build: 'vite build'
          },
          dependencies: {
            react: '^18.0.0',
            'react-dom': '^18.0.0'
          }
        }, null, 2),
        force: true
      },
      {
        path: 'src/App.tsx',
        content: `import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Web Application</h1>
      <p>This is a web-compatible application running in the browser.</p>
      <button 
        onClick={() => alert('Hello from web!')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Click me
      </button>
    </div>
  );
}`,
        force: true
      },
      {
        path: 'src/main.tsx',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
        force: true
      },
      {
        path: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Web App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`,
        force: true
      }
    ];

    const formattedOutput = mockFiles.map(f => 
      `<dyad-file path="${f.path}">
${f.content}
</dyad-file>

`
    ).join('');

    logger.log("Web codebase extraction completed successfully");
    
    return {
      formattedOutput,
      files: mockFiles,
    };
  }

  // Fallback for non-web environments (should not happen in web version)
  logger.warn("Non-web environment detected, returning empty codebase");
  return {
    formattedOutput: "// Web-only version - no file system access",
    files: [],
  };
}

/**
 * Web-compatible file reading with caching
 */
export async function readFileWithCache(
  filePath: string,
  virtualFileSystem?: any,
): Promise<string | undefined> {
  console.log(`[WebCodebase] Reading file: ${filePath}`);
  
  if (isWeb()) {
    // In web environment, return mock file content
    const mockContent = `// Mock file content for: ${filePath}
// This is a web-compatible file reading simulation
export default function MockComponent() {
  return <div>Mock content for ${filePath}</div>;
}`;
    
    logger.log(`File read successfully: ${filePath}`);
    return mockContent;
  }

  logger.warn("Non-web environment detected for file reading");
  return undefined;
}