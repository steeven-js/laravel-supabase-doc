# Guide de Déploiement Vercel - Documentation Dashboard Madinia

Ce guide vous explique comment déployer la documentation VitePress sur Vercel.

## 🚀 Prérequis

- Compte Vercel (gratuit sur [vercel.com](https://vercel.com))
- Repository Git hébergé (GitHub, GitLab, Bitbucket)
- Node.js 18+ installé localement

## ⚙️ Configuration Vercel

Le projet est déjà configuré avec le fichier `vercel.json` qui contient :

```json
{
  "name": "madinia-dashboard-docs",
  "version": 2,
  "buildCommand": "npm run docs:build",
  "outputDirectory": "docs/.vitepress/dist",
  "installCommand": "npm install",
  "framework": null,
  "public": false,
  "env": {
    "NODE_VERSION": "20"
  }
}
```

### Headers de sécurité
Les headers suivants sont configurés automatiquement :
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 📦 Déploiement automatique

### 1. Connecter le repository
1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec votre compte Git
3. Cliquer sur "New Project"
4. Importer votre repository

### 2. Configuration du projet
1. **Root Directory** : Sélectionner `documentation`
2. **Framework Preset** : None (détection automatique)
3. **Build Command** : `npm run docs:build` (auto-détecté)
4. **Output Directory** : `docs/.vitepress/dist` (auto-détecté)
5. **Install Command** : `npm install` (auto-détecté)

### 3. Variables d'environnement (optionnel)
Si nécessaire, ajouter des variables d'environnement :
- `NODE_VERSION`: `20`

### 4. Déployer
Cliquer sur "Deploy" et attendre que le build se termine.

## 🔄 Déploiement continu

### Branches configurées
- **Production** : `main` ou `master`
- **Preview** : Toutes les autres branches
- **Pull Requests** : Prévisualisations automatiques

### Workflow automatique
1. Push sur `main` → Déploiement en production
2. Push sur autre branche → Déploiement de prévisualisation
3. Pull Request → URL de prévisualisation dans les commentaires

## 🌐 Domaine personnalisé

### Configurer un domaine
1. Aller dans les paramètres du projet Vercel
2. Section "Domains"
3. Ajouter votre domaine personnalisé
4. Configurer les DNS selon les instructions

### Exemple de configuration DNS
```
Type: CNAME
Name: docs (ou www)
Value: your-project.vercel.app
```

## 📊 Monitoring et Analytics

### Métriques disponibles
- **Web Vitals** : Performance du site
- **Analytics** : Visiteurs et pages vues
- **Speed Insights** : Optimisations suggérées

### Activer les analytics
1. Aller dans les paramètres du projet
2. Section "Analytics"
3. Activer Vercel Analytics

## 🛠️ Dépannage

### Problèmes courants

#### Build échoue
```bash
# Vérifier localement
npm run docs:build
```

#### Erreur de path
- Vérifier que `Root Directory` est bien `documentation`
- Vérifier le `outputDirectory` dans `vercel.json`

#### Node.js version
- Assurer que `NODE_VERSION` est défini à `20`
- Vérifier la compatibilité des dépendances

### Logs de build
- Aller dans l'onglet "Functions" du projet
- Consulter les logs de build en cas d'erreur

## 🔐 Sécurité

### Headers configurés
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Protection par mot de passe (optionnel)
1. Aller dans les paramètres du projet
2. Section "Password Protection"
3. Activer et définir un mot de passe

## 📈 Optimisations

### Performance
- **Compression** : Automatique
- **CDN Global** : Activé par défaut
- **Edge Functions** : Disponibles si nécessaire

### SEO
- **Meta tags** : Configurés dans VitePress
- **Sitemap** : Généré automatiquement
- **Robots.txt** : À ajouter si nécessaire

## 🔄 Mise à jour

### Processus de mise à jour
1. Modifier la documentation localement
2. Tester avec `npm run docs:dev`
3. Committer et pusher sur la branche
4. Déploiement automatique sur Vercel

### Rollback
En cas de problème :
1. Aller dans l'onglet "Deployments"
2. Sélectionner un déploiement précédent
3. Cliquer sur "Promote to Production"

## 📞 Support

### Ressources utiles
- [Documentation Vercel](https://vercel.com/docs)
- [VitePress Deploy Guide](https://vitepress.dev/guide/deploy)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Contact
Pour des questions spécifiques au projet, contacter l'équipe de développement. 