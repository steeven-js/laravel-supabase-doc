# Laravel-Supabase Documentation

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/madinia/laravel-supabase-docs)

Documentation complète du projet Laravel-Supabase générée avec [VitePress](https://vitepress.dev/).

## 🚀 Déploiement automatique

Cette documentation est automatiquement déployée sur Vercel à chaque push sur la branche `main`.

## 🛠️ Développement local

```bash
# Installation des dépendances
npm install

# Développement avec hot-reload
npm run dev

# Build pour production
npm run build

# Prévisualiser la version build
npm run preview
```

## 📁 Structure

```
.
├── .vitepress/
│   ├── config.ts          # Configuration VitePress
│   └── theme/             # Thème personnalisé
├── *.md                   # Pages de documentation
├── package.json           # Dépendances et scripts
└── vercel.json           # Configuration Vercel
```

## 🔧 Configuration Vercel

### Variables d'environnement (optionnel)

Aucune variable d'environnement n'est requise pour le déploiement basique.

### Build Settings

- **Framework Preset**: VitePress
- **Build Command**: `npm run build`
- **Output Directory**: `.vitepress/dist`

## 📚 Contenu de la documentation

- **Guide de démarrage** - Installation et configuration initiale
- **Docker** - Configuration des environnements containerisés
- **Environnements** - Séparation dev/production
- **Déploiement** - Instructions de mise en production
- **Configuration des ports** - Cartographie des services

## 🔗 Liens utiles

- [Repository principal Laravel-Supabase](https://github.com/madinia/laravel-supabase)
- [Documentation VitePress](https://vitepress.dev/)
- [Vercel Documentation](https://vercel.com/docs)

## 📝 Contribution

Pour modifier la documentation :

1. Cloner ce repository
2. Faire vos modifications
3. Tester localement avec `npm run dev`
4. Créer une Pull Request

Les modifications seront automatiquement déployées après merge sur `main`.

## 📄 License

MIT License - voir le repository principal pour plus de détails. 