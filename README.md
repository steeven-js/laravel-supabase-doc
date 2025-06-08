# Documentation VitePress - Laravel-Supabase

Cette documentation est générée avec [VitePress](https://vitepress.dev/), un générateur de sites statiques moderne optimisé pour la documentation technique.

## 🚀 Commandes disponibles

### Développement
```bash
# Lancer le serveur de développement avec hot-reload
npm run docs:dev
```
La documentation sera accessible sur `http://localhost:5174`

### Construction
```bash
# Construire la documentation statique
npm run docs:build
```
Les fichiers sont générés dans `docs/.vitepress/dist/`

### Prévisualisation
```bash
# Prévisualiser la version construite
npm run docs:preview
```

## 📁 Structure de la documentation

```
docs/
├── .vitepress/
│   ├── config.ts          # Configuration VitePress
│   ├── theme/             # Thème personnalisé
│   ├── dist/              # Site généré (ignoré par git)
│   └── cache/             # Cache VitePress (ignoré par git)
├── index.md               # Page d'accueil
├── QUICK_START.md         # Guide de démarrage
├── DEV-PORD.md           # Environnements dev vs prod
├── PRODUCTION_DEPLOYMENT.md # Déploiement production
├── DOCKER_NETWORK_CONFIG.md # Configuration Docker
├── api-examples.md        # Exemples d'API VitePress
└── markdown-examples.md   # Exemples Markdown VitePress
```

## ✏️ Éditer la documentation

### Ajouter une nouvelle page
1. Créer un fichier `.md` dans le dossier `docs/`
2. Ajouter la page à la navigation dans `docs/.vitepress/config.ts`

### Modifier la configuration
Éditez `docs/.vitepress/config.ts` pour :
- Modifier le titre et la description
- Ajouter/supprimer des pages de navigation
- Configurer la sidebar
- Personnaliser le thème

### Syntaxe Markdown étendue
VitePress supporte :
- Markdown standard
- Blocs de code avec coloration syntaxique
- Conteneurs personnalisés (tips, warnings, etc.)
- Composants Vue dans Markdown
- Frontmatter YAML

## 🎨 Fonctionnalités activées

- ✅ Recherche locale intégrée
- ✅ Navigation responsive
- ✅ Mode sombre/clair automatique
- ✅ Liens GitHub configurés
- ✅ Footer personnalisé
- ✅ Hot-reload en développement

## 🔧 Configuration actuelle

La documentation est configurée pour :
- **Titre** : Laravel-Supabase Documentation
- **Description** : Documentation complète du projet Laravel avec Supabase
- **Thème** : Default theme avec customisation
- **Recherche** : Locale (intégrée)
- **Repository** : Lien vers GitHub configuré

## 📚 Ressources

- [Documentation VitePress](https://vitepress.dev/)
- [Guide Markdown](https://vitepress.dev/guide/markdown)
- [Configuration du thème](https://vitepress.dev/reference/default-theme-config)
- [Déploiement](https://vitepress.dev/guide/deploy) 