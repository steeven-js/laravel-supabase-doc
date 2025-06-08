# 📚 Guide Utilisateur

Bienvenue dans le guide complet du projet Laravel-Supabase ! Cette section vous accompagne depuis l'installation jusqu'à la maîtrise complète du stack.

## 🎯 Objectifs du guide

Ce guide vous permettra de :
- **Installer et configurer** l'environnement de développement
- **Comprendre l'architecture** Docker + Laravel + Supabase  
- **Développer efficacement** avec les outils intégrés
- **Déployer en production** en toute sécurité

---

## 🗺️ Parcours d'apprentissage

### 🚀 Niveau Débutant

1. **[Démarrage Rapide](./quick-start)** - Lancer le projet en 10 minutes
2. **[Installation](./installation)** - Installation complète étape par étape
3. **[Configuration](./configuration)** - Paramétrage de l'environnement

### ⚙️ Niveau Intermédiaire

4. **[Configuration des Ports](./port-configuration)** - Gestion des ports et réseau
5. **[Exemples API](./examples/api-examples)** - Intégration Supabase pratique
6. **[Exemples Markdown](./examples/markdown-examples)** - Documentation avancée

---

## 🏗️ Stack technologique

### Backend
- **Laravel 11** - Framework PHP moderne
- **PHP 8.4** - Version optimisée avec JIT
- **Supabase** - Backend-as-a-Service PostgreSQL

### Frontend  
- **React + TypeScript** - Interface utilisateur moderne
- **Inertia.js** - Pont entre Laravel et React
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first

### Infrastructure
- **Docker** - Conteneurisation complète
- **Nginx** - Reverse proxy et serveur web
- **Redis** - Cache et gestion des sessions
- **PostgreSQL** - Base de données via Supabase

---

## 🎪 Fonctionnalités principales

### 🔐 Authentification complète
- Inscription / Connexion
- Réinitialisation de mot de passe
- Vérification email
- Sessions sécurisées

### 👤 Gestion utilisateurs
- Profils utilisateur
- Paramètres de compte
- Préférences d'apparence
- Sécurité du compte

### 🎨 Interface moderne
- Design responsive
- Mode sombre/clair
- Composants réutilisables
- Navigation intuitive

### 🚀 Performance optimisée
- Cache Redis intégré
- Assets compilés et minifiés
- Images Docker optimisées
- SSL/HTTPS en production

---

## 🛠️ Environnements disponibles

### 🔧 Développement

```bash
# Démarrage rapide développement
cd supabase-project-dev && docker compose up -d
cd ../laravel-supabase && docker compose -f compose.dev.yaml up -d
```

**Caractéristiques :**
- ✅ Hot reload (Vite)
- ✅ XDebug activé
- ✅ Base Supabase locale
- ✅ Volumes montés
- ✅ Port 8080

### 🏭 Production

```bash
# Démarrage production
cd supabase-project && docker compose up -d
cd ../laravel-supabase && docker compose -f compose.prod.yaml up -d
```

**Caractéristiques :**
- ✅ SSL/HTTPS automatique
- ✅ Assets optimisés
- ✅ OPcache activé
- ✅ Health checks
- ✅ Restart automatique

---

## 📂 Structure du projet

```
laravel-supabase/
├── 🐳 Docker
│   ├── compose.dev.yaml      # Développement
│   ├── compose.prod.yaml     # Production
│   └── docker/               # Configurations Docker
├── 🎨 Frontend
│   ├── resources/js/         # Code React/TypeScript
│   ├── resources/css/        # Styles Tailwind
│   └── public/               # Assets statiques
├── ⚙️ Backend
│   ├── app/                  # Code Laravel
│   ├── routes/               # Routes API/Web
│   └── database/             # Migrations/Seeders
├── 📚 Documentation
│   ├── docs/                 # Documentation VitePress
│   └── README.md             # Guide principal
└── 🛠️ Configuration
    ├── .env                  # Variables développement
    ├── .env.production       # Variables production
    └── composer.json         # Dépendances PHP
```

---

## 🚀 Démarrage en 3 étapes

### 1️⃣ Cloner et préparer

```bash
git clone https://github.com/steeven-js/laravel-supabase.git
cd laravel-supabase
cp .env.example .env
```

### 2️⃣ Démarrer Supabase

```bash
cd ../supabase-project-dev
docker compose up -d
```

### 3️⃣ Lancer Laravel

```bash
cd ../laravel-supabase
docker compose -f compose.dev.yaml up -d
```

**🎉 Votre application est disponible sur http://localhost:8080**

---

## 🔗 Liens rapides

### 📖 Documentation technique
- [🏗️ Architecture Roadmap](../architecture-roadmap) - Vue d'ensemble complète
- [🐳 Docker](../docker/) - Configuration conteneurs
- [🗄️ Supabase](../supabase/) - Base de données et API
- [🚀 Déploiement](../deployment/) - Production et SSL

### 🛠️ Outils développement
- **Supabase Studio** : http://localhost:8000
- **Application Laravel** : http://localhost:8080  
- **Vite Dev Server** : http://localhost:5173
- **Documentation** : https://laravel-supabase-docs.vercel.app

### 🐙 Repositories
- **Code source** : https://github.com/steeven-js/laravel-supabase
- **Documentation** : https://github.com/steeven-js/laravel-supabase/tree/master/docs

---

## 🤝 Contribution

### Comment contribuer ?

1. **Fork** le projet
2. **Créer une branche** (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir une Pull Request**

### Conventions

- **Code** : PSR-12 pour PHP, Prettier pour TypeScript
- **Messages** : Conventional Commits
- **Tests** : PHPUnit + Jest obligatoires
- **Documentation** : Mettre à jour en français

---

## 📞 Support et communauté

### 🆘 Besoin d'aide ?

- **Issues GitHub** : Pour les bugs et demandes de fonctionnalités
- **Discussions** : Pour les questions générales
- **Documentation** : Consultez les guides détaillés

### 📈 Statistiques du projet

- **Framework** : Laravel 11
- **Base de données** : PostgreSQL via Supabase
- **Environnement** : Docker Compose
- **CI/CD** : GitHub Actions
- **Déploiement** : Production SSL automatique

---

## 🎓 Ressources d'apprentissage

### 📚 Documentation officielle

- [Laravel](https://laravel.com/docs) - Framework PHP
- [Supabase](https://supabase.com/docs) - Backend-as-a-Service
- [Docker](https://docs.docker.com/) - Conteneurisation
- [React](https://react.dev/) - Interface utilisateur

### 🎯 Tutoriels recommandés

- **Laravel + Inertia** : [Documentation Inertia](https://inertiajs.com/)
- **Tailwind CSS** : [Tailwind UI](https://tailwindui.com/)
- **TypeScript** : [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**🚀 Prêt à commencer ? Suivez le [Guide de démarrage rapide](./quick-start) !** 