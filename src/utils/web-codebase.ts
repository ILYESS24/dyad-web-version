// Web-compatible version of codebase utilities
import { isWeb } from './environment';

export type CodebaseFile = {
  path: string;
  content: string;
  force?: boolean;
};

/**
 * Web-compatible codebase extraction that returns mock data
 */
export async function extractCodebase({
  appPath,
  chatContext,
  virtualFileSystem,
}: {
  appPath: string;
  chatContext: any;
  virtualFileSystem?: any;
}): Promise<{
  formattedOutput: string;
  files: CodebaseFile[];
}> {
  if (!isWeb()) {
    // Fallback to original implementation if not in web environment
    const { extractCodebase: originalExtractCodebase } = await import('./codebase');
    return originalExtractCodebase({ appPath, chatContext, virtualFileSystem });
  }

  // Web environment - return mock codebase data
  console.log('Using mock codebase data for web environment');
  
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
      }, null, 2)
    },
    {
      path: 'src/App.tsx',
      content: `import React from 'react';

export default function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🚀 Web Application</h1>
      <p>This is a web-compatible version of the app!</p>
    </div>
  );
}`
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
);`
    }
  ];

  const formattedOutput = mockFiles.map(file => 
    `<dyad-file path="${file.path}">
${file.content}
</dyad-file>

`
  ).join('');

  return {
    formattedOutput,
    files: mockFiles
  };
}

/**
 * Web-compatible file reading with cache
 */
export async function readFileWithCache(
  filePath: string,
  virtualFileSystem?: any,
): Promise<string | undefined> {
  if (!isWeb()) {
    // Fallback to original implementation if not in web environment
    const { readFileWithCache: originalReadFileWithCache } = await import('./codebase');
    return originalReadFileWithCache(filePath, virtualFileSystem);
  }

  // Web environment - return mock file content
  console.log('Using mock file reading for web environment:', filePath);
  return '// Mock file content for web environment';
}
