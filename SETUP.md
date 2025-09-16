# 🔧 Configuration des Clés API - Dyad Web

## ✅ **Réponse à votre question :**

**OUI**, vous devez ajouter des clés API pour que l'application fonctionne correctement. Voici ce qui est nécessaire :

## 🔑 **Clés API Requises**

### 1. **Clé API IA (OBLIGATOIRE)**
Vous devez avoir **au moins une** de ces clés :

```bash
# Dans votre fichier .env
OPENAI_API_KEY="sk-your-openai-key-here"
# OU
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key-here"  
# OU
GOOGLE_API_KEY="your-google-api-key-here"
```

### 2. **Base de données (OBLIGATOIRE)**
```bash
DATABASE_URL="postgresql://username:password@host:port/database"
```

## 🚀 **Configuration Rapide**

### Option 1 : Base de données locale (PostgreSQL)
```bash
# Installer PostgreSQL localement
# Puis configurer :
DATABASE_URL="postgresql://postgres:password@localhost:5432/dyad_web"
```

### Option 2 : Base de données cloud (Recommandé)
- **Neon** : https://neon.tech (gratuit)
- **Supabase** : https://supabase.com (gratuit)
- **Railway** : https://railway.app (gratuit)

## 📝 **Étapes de Configuration**

### 1. Créer le fichier `.env`
```bash
cp env.example .env
```

### 2. Éditer `.env` avec vos clés
```bash
# Base de données
DATABASE_URL="postgresql://username:password@host:port/database"

# IA (au moins une requise)
OPENAI_API_KEY="sk-your-key-here"
# OU ANTHROPIC_API_KEY="sk-ant-your-key"
# OU GOOGLE_API_KEY="your-key"

# Serveur
PORT=3001
NODE_ENV=development
```

### 3. Configurer la base de données
```bash
npm run db:generate
npm run db:push
```

### 4. Démarrer l'application
```bash
npm install
npm run dev
```

## 🔗 **Où obtenir les clés API**

### OpenAI
1. Aller sur https://platform.openai.com
2. Créer un compte
3. Aller dans "API Keys"
4. Créer une nouvelle clé

### Anthropic (Claude)
1. Aller sur https://console.anthropic.com
2. Créer un compte
3. Aller dans "API Keys"
4. Créer une nouvelle clé

### Google (Gemini)
1. Aller sur https://makersuite.google.com
2. Créer un projet
3. Activer l'API Gemini
4. Créer une clé API

## 🐳 **Alternative : Docker (Plus Simple)**

Si vous préférez, utilisez Docker qui configure tout automatiquement :

```bash
# 1. Éditer docker-compose.yml et ajouter vos clés API
# 2. Lancer avec Docker
docker-compose up
```

## ⚠️ **Important**

- **Au moins une clé IA** est requise pour le chat
- **La base de données** est requise pour sauvegarder les applications
- Les clés sont automatiquement détectées au démarrage
- L'interface s'adapte selon les clés disponibles

## 🎯 **Vérification**

Une fois configuré, vous devriez voir :
- ✅ **Chat fonctionnel** avec l'IA
- ✅ **Création d'applications** qui fonctionne
- ✅ **Éditeur Monaco** avec coloration syntaxique
- ✅ **Prévisualisation** des applications

L'interface sera **exactement identique** à l'original, mais maintenant fonctionnelle sur le web !
