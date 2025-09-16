# Configuration des Clés API

## 🔑 Configuration des Clés API

Pour utiliser l'application, ajoutez vos clés API dans le fichier `.env` :

```bash
# Clés API pour l'utilisation locale
OPENAI_API_KEY="votre_clé_openai_ici"
ANTHROPIC_API_KEY="votre_clé_anthropic_ici"
```

## 📋 Instructions

1. **Créez un fichier `.env`** à la racine du projet
2. **Copiez le contenu** de `env.example` dans `.env`
3. **Remplacez** les valeurs par vos vraies clés API
4. **Redémarrez** l'application

## ⚠️ Sécurité

- ❌ **Ne commitez JAMAIS** le fichier `.env`
- ✅ **Utilisez** des variables d'environnement en production
- ✅ **Ajoutez** `.env` à votre `.gitignore`

## 🚀 Déploiement

Pour Vercel, ajoutez ces variables dans les paramètres du projet :
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `DATABASE_URL`

## 📝 Obtenir vos clés API

### OpenAI
1. Allez sur [OpenAI Platform](https://platform.openai.com/api-keys)
2. Créez une nouvelle clé API
3. Copiez la clé et ajoutez-la à votre `.env`

### Anthropic
1. Allez sur [Anthropic Console](https://console.anthropic.com/)
2. Créez une nouvelle clé API
3. Copiez la clé et ajoutez-la à votre `.env`
