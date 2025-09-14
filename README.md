# Dyad Web - Version Web de l'Éditeur d'Applications IA

Cette version web de Dyad conserve **exactement la même interface** que l'application Electron originale, mais remplace les fonctionnalités impossibles sur le web par des équivalents cloud.

## 🎯 Fonctionnalités Conservées

✅ **Interface identique** : Sidebar, chat, panneau de prévisualisation, éditeur Monaco  
✅ **Chat avec IA** : Communication avec les APIs LLM (OpenAI, Anthropic, Google)  
✅ **Édition de code** : Monaco Editor avec coloration syntaxique  
✅ **Gestion des applications** : Création, modification, suppression  
✅ **Système de versions** : Historique des modifications  
✅ **Thèmes** : Mode sombre/clair  

## 🔄 Fonctionnalités Adaptées pour le Web

🔄 **Base de données** : SQLite local → PostgreSQL cloud  
🔄 **Stockage des fichiers** : Système de fichiers local → Stockage JSON en base  
🔄 **Compilation TypeScript** : Processus local → Service de build cloud  
🔄 **Exécution d'applications** : Serveurs locaux → URLs de prévisualisation  
🔄 **Communication** : IPC Electron → API REST + WebSocket  

## 🚀 Installation et Démarrage

### 1. Configuration de la base de données

```bash
# Créer une base PostgreSQL (ex: Neon, Supabase, ou local)
# Copier env.example vers .env et configurer DATABASE_URL
cp env.example .env
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de la base de données

```bash
# Générer les migrations
npm run db:generate

# Appliquer les migrations
npm run db:push
```

### 4. Configuration des APIs IA

Éditer `.env` et ajouter au moins une clé API :
```bash
OPENAI_API_KEY="your_key_here"
# ou
ANTHROPIC_API_KEY="your_key_here"
# ou  
GOOGLE_API_KEY="your_key_here"
```

### 5. Démarrage en développement

```bash
# Démarrer le client et le serveur
npm run dev
```

- **Frontend** : http://localhost:5173
- **API** : http://localhost:3001/api

## 📁 Structure du Projet

```
dyad-web/
├── src/                    # Interface React (identique à l'original)
│   ├── components/         # Composants UI (sidebar, chat, preview)
│   ├── api/               # Client API web (remplace IPC)
│   └── ipc/               # Adapter IPC vers API REST
├── server/                # Backend Node.js
│   ├── db/                # Schéma PostgreSQL
│   ├── routes/            # API REST endpoints
│   ├── services/          # Services (IA, build, fichiers)
│   └── websocket/         # Communication temps réel
└── drizzle/               # Migrations base de données
```

## 🔧 API Endpoints

### Applications
- `GET /api/apps` - Lister les applications
- `POST /api/apps` - Créer une application
- `GET /api/apps/:id` - Obtenir une application
- `PUT /api/apps/:id` - Modifier une application
- `DELETE /api/apps/:id` - Supprimer une application
- `POST /api/apps/:id/run` - Démarrer l'application
- `POST /api/apps/:id/stop` - Arrêter l'application

### Chat
- `GET /api/chat/:id/messages` - Obtenir les messages
- `POST /api/chat/:id/messages` - Envoyer un message (streaming)
- `GET /api/chat/app/:appId` - Chats d'une application

### Fichiers
- `GET /api/files/:appId/:path` - Obtenir un fichier
- `PUT /api/files/:appId/:path` - Sauvegarder un fichier
- `GET /api/files/:appId` - Lister les fichiers

### Build
- `POST /api/build/:appId` - Construire l'application
- `GET /api/build/:appId/status` - Statut du build

## 🌐 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Docker

```bash
# Construire l'image
docker build -t dyad-web .

# Lancer avec PostgreSQL
docker-compose up
```

### Variables d'environnement de production

```bash
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="..."
NODE_ENV="production"
FRONTEND_URL="https://your-domain.com"
```

## 🎨 Interface Utilisateur

L'interface est **100% identique** à l'original :

- **Sidebar collapsible** avec navigation Apps/Chat/Settings
- **Panneau de chat** avec streaming des réponses IA
- **Panneau de prévisualisation** avec modes : Preview/Code/Configure/Problems
- **Éditeur Monaco** avec coloration syntaxique complète
- **Gestion des versions** et historique Git
- **Thèmes** sombre/clair automatiques

## 🔗 Intégrations

- **OpenAI** : GPT-4, GPT-4o-mini
- **Anthropic** : Claude-3.5-Sonnet
- **Google** : Gemini-1.5-Flash
- **PostgreSQL** : Base de données cloud
- **WebSocket** : Mises à jour temps réel
- **Vercel** : Déploiement et build

## 📝 Notes Techniques

- **Monaco Editor** : Fonctionne nativement dans le navigateur
- **Streaming IA** : Réponses en temps réel via Server-Sent Events
- **Stockage fichiers** : JSON en base PostgreSQL (pas de système de fichiers)
- **Build process** : Simulé (peut être intégré avec Vercel/Netlify)
- **WebSocket** : Mises à jour temps réel des builds et fichiers

Cette version web offre **exactement la même expérience utilisateur** que l'application Electron originale, mais adaptée pour fonctionner dans un navigateur web.