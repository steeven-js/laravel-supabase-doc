# Documentation VitePress - Dashboard Madinia

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

## 🌐 Déploiement Vercel

### Configuration automatique
Le projet est configuré pour un déploiement automatique sur Vercel avec :
- **Build Command** : `npm run docs:build`
- **Output Directory** : `docs/.vitepress/dist`
- **Node Version** : 20
- **Headers de sécurité** : Configurés automatiquement

### Déploiement manuel
1. Connecter le repository à Vercel
2. Sélectionner le dossier `documentation` comme racine du projet
3. Vercel détectera automatiquement la configuration via `vercel.json`
4. Déployer !

### URL de production
Une fois déployé, la documentation sera accessible sur votre domaine Vercel personnalisé.

## 📁 Structure de la documentation

```
docs/
├── .vitepress/
│   ├── config.mts         # Configuration VitePress
│   ├── theme/             # Thème personnalisé
│   ├── dist/              # Site généré (ignoré par git)
│   └── cache/             # Cache VitePress (ignoré par git)
├── index.md               # Page d'accueil
├── planning-redaction.md  # Planning de rédaction
├── guide-introduction.md  # Module 1 : Introduction
├── gestion-utilisateurs.md # Module 2 : Utilisateurs
├── gestion-clients-entreprises.md # Module 3 : Clients
├── gestion-devis.md       # Module 4 : Devis
├── gestion-factures.md    # Module 5 : Factures
├── catalogue-services.md  # Module 6 : Services
├── emails-et-templates.md # Module 7 : Emails
├── api-examples.md        # Exemples d'API VitePress
└── markdown-examples.md   # Exemples Markdown VitePress
```

## ✏️ Éditer la documentation

### Ajouter une nouvelle page
1. Créer un fichier `.md` dans le dossier `docs/`
2. Ajouter la page à la navigation dans `docs/.vitepress/config.mts`

### Modifier la configuration
Éditez `docs/.vitepress/config.mts` pour :
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
- ✅ Déploiement automatique Vercel
- ✅ Headers de sécurité configurés

## 🔧 Configuration actuelle

La documentation est configurée pour :
- **Titre** : Documentation Dashboard Madinia
- **Description** : Documentation complète pour les administrateurs du Dashboard Madinia
- **Thème** : Default theme avec customisation
- **Recherche** : Locale (intégrée)
- **Repository** : Lien vers GitHub configuré
- **Déploiement** : Vercel avec configuration automatique

## 📈 Progression de la documentation

- ✅ **Module 1** : Introduction et Prise en Main
- ✅ **Module 2** : Gestion des Utilisateurs et Permissions
- ✅ **Module 3** : Gestion des Clients et Entreprises
- ✅ **Module 4** : Gestion des Devis
- ✅ **Module 5** : Gestion des Factures
- ✅ **Module 6** : Catalogue de Services
- ✅ **Module 7** : Système d'Emails et Templates
- 📝 **Module 8** : Tableaux de Bord et Analytics
- ⏳ **Module 9** : Dépannage et FAQ
- ⏳ **Module 10** : Maintenance et Commandes

**Progression actuelle : 7/10 modules (70%)**

## 📚 Ressources

- [Documentation VitePress](https://vitepress.dev/)
- [Guide Markdown](https://vitepress.dev/guide/markdown)
- [Configuration du thème](https://vitepress.dev/reference/default-theme-config)
- [Déploiement Vercel](https://vercel.com/docs)
- [Dashboard Madinia](https://github.com/madinia/dashboard) 