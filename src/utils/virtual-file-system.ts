/**
 * Système de fichiers virtuel utilisant IndexedDB
 * Alternative à Node.js fs pour la version web
 */

import Dexie, { Table } from 'dexie';

export interface VirtualFile {
  id?: number;
  path: string;
  content: string;
  type: 'file' | 'directory';
  size: number;
  created: Date;
  modified: Date;
  appId: string;
}

export interface VirtualDirectory {
  id?: number;
  path: string;
  children: string[];
  created: Date;
  modified: Date;
  appId: string;
}

class VirtualFileSystemDB extends Dexie {
  files!: Table<VirtualFile>;
  directories!: Table<VirtualDirectory>;

  constructor() {
    super('VirtualFileSystem');
    this.version(1).stores({
      files: '++id, path, type, appId, created, modified',
      directories: '++id, path, appId, created, modified'
    });
  }
}

const db = new VirtualFileSystemDB();

export class VirtualFileSystem {
  private appId: string;

  constructor(appId: string) {
    this.appId = appId;
  }

  /**
   * Créer un fichier virtuel
   */
  async writeFile(path: string, content: string): Promise<void> {
    console.log(`[VFS] Writing file: ${path}`);
    
    const file: VirtualFile = {
      path: this.normalizePath(path),
      content,
      type: 'file',
      size: new Blob([content]).size,
      created: new Date(),
      modified: new Date(),
      appId: this.appId
    };

    await db.files.put(file);
    console.log(`✅ File written: ${path} (${file.size} bytes)`);
  }

  /**
   * Lire un fichier virtuel
   */
  async readFile(path: string): Promise<string> {
    console.log(`[VFS] Reading file: ${path}`);
    
    const file = await db.files
      .where('path')
      .equals(this.normalizePath(path))
      .and(f => f.appId === this.appId)
      .first();

    if (!file) {
      throw new Error(`File not found: ${path}`);
    }

    console.log(`✅ File read: ${path} (${file.size} bytes)`);
    return file.content;
  }

  /**
   * Supprimer un fichier virtuel
   */
  async deleteFile(path: string): Promise<void> {
    console.log(`[VFS] Deleting file: ${path}`);
    
    await db.files
      .where('path')
      .equals(this.normalizePath(path))
      .and(f => f.appId === this.appId)
      .delete();

    console.log(`✅ File deleted: ${path}`);
  }

  /**
   * Lister les fichiers d'un répertoire
   */
  async readdir(path: string): Promise<string[]> {
    console.log(`[VFS] Reading directory: ${path}`);
    
    const normalizedPath = this.normalizePath(path);
    const files = await db.files
      .where('path')
      .startsWith(normalizedPath)
      .and(f => f.appId === this.appId)
      .toArray();

    const directories = await db.directories
      .where('path')
      .startsWith(normalizedPath)
      .and(d => d.appId === this.appId)
      .toArray();

    const items = [
      ...files.map(f => f.path),
      ...directories.map(d => d.path)
    ];

    console.log(`✅ Directory read: ${path} (${items.length} items)`);
    return items;
  }

  /**
   * Créer un répertoire
   */
  async mkdir(path: string): Promise<void> {
    console.log(`[VFS] Creating directory: ${path}`);
    
    const directory: VirtualDirectory = {
      path: this.normalizePath(path),
      children: [],
      created: new Date(),
      modified: new Date(),
      appId: this.appId
    };

    await db.directories.put(directory);
    console.log(`✅ Directory created: ${path}`);
  }

  /**
   * Vérifier si un fichier/répertoire existe
   */
  async exists(path: string): Promise<boolean> {
    const file = await db.files
      .where('path')
      .equals(this.normalizePath(path))
      .and(f => f.appId === this.appId)
      .first();

    const directory = await db.directories
      .where('path')
      .equals(this.normalizePath(path))
      .and(d => d.appId === this.appId)
      .first();

    return !!(file || directory);
  }

  /**
   * Obtenir les statistiques d'un fichier
   */
  async stat(path: string): Promise<{ size: number; isFile: boolean; isDirectory: boolean }> {
    const file = await db.files
      .where('path')
      .equals(this.normalizePath(path))
      .and(f => f.appId === this.appId)
      .first();

    if (file) {
      return {
        size: file.size,
        isFile: true,
        isDirectory: false
      };
    }

    const directory = await db.directories
      .where('path')
      .equals(this.normalizePath(path))
      .and(d => d.appId === this.appId)
      .first();

    if (directory) {
      return {
        size: 0,
        isFile: false,
        isDirectory: true
      };
    }

    throw new Error(`Path not found: ${path}`);
  }

  /**
   * Normaliser le chemin
   */
  private normalizePath(path: string): string {
    return path.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '');
  }

  /**
   * Initialiser la structure de base d'une app
   */
  async initializeApp(appName: string): Promise<void> {
    console.log(`[VFS] Initializing app structure for: ${appName}`);
    
    // Créer la structure de base
    await this.mkdir('/');
    await this.mkdir('/src');
    await this.mkdir('/public');
    
    // Créer les fichiers de base
    await this.writeFile('/package.json', JSON.stringify({
      name: appName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      },
      dependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0'
      },
      devDependencies: {
        vite: '^4.0.0',
        '@vitejs/plugin-react': '^3.0.0'
      }
    }, null, 2));

    await this.writeFile('/vite.config.js', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})`);

    await this.writeFile('/index.html', `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`);

    await this.writeFile('/src/main.jsx', `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`);

    await this.writeFile('/src/App.jsx', `import React from 'react'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 ${appName}</h1>
      <p>Bienvenue dans votre nouvelle application React !</p>
      <p>Cette application fonctionne dans le navigateur avec notre système de fichiers virtuel.</p>
      <button 
        onClick={() => alert('Salut depuis le web !')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Cliquer ici
      </button>
    </div>
  )
}

export default App`);

    console.log(`✅ App structure initialized for: ${appName}`);
  }
}

export default VirtualFileSystem;
