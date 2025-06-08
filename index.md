---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Laravel-Supabase"
  text: "Documentation Complète"
  tagline: "Stack moderne avec Laravel, Supabase, Docker et déploiement en production"
  image:
    src: /logo.svg
    alt: Laravel Supabase
  actions:
    - theme: brand
      text: Guide de démarrage
      link: /QUICK_START
    - theme: alt
      text: Roadmap Architecture
      link: /architecture-roadmap

features:
  - title: 🏗️ Architecture Roadmap
    details: Compréhension complète de l'architecture Docker, Nginx, Laravel, et Supabase avec schémas détaillés
    link: /architecture-roadmap
    
  - title: 🚀 Démarrage Rapide
    details: Guide complet pour lancer le projet en développement et production avec Docker
    link: /QUICK_START
    
  - title: 🐳 Docker Multi-Environnements
    details: Configuration Docker optimisée pour le développement et la production
    link: /DOCKER_NETWORK_CONFIG
    
  - title: ⚙️ Dev vs Production
    details: Séparation claire des environnements avec bases de données distinctes
    link: /DEV-PORD
    
  - title: 🌐 Déploiement Production
    details: Instructions complètes pour déployer en production avec SSL et sécurité
    link: /PRODUCTION_DEPLOYMENT
    
  - title: 📊 Supabase Integration
    details: Configuration complète avec Supabase pour la base de données et l'authentification
    
  - title: 🔧 Scripts Automatisés
    details: Scripts bash pour simplifier le déploiement et la gestion des environnements
---

# 🚀 Laravel Supabase

Bienvenue dans la documentation du projet Laravel Supabase. Ce projet combine la puissance de Laravel avec les fonctionnalités de Supabase pour créer des applications web modernes et évolutives.

## 📚 Sections Principales

### Architecture
- [🏗️ Roadmap Architecture](/architecture-roadmap) - **Nouveau !** Compréhension complète de l'écosystème
- [Introduction](/guide/)
- [Installation](/guide/installation)
- [Configuration](/guide/configuration)

### Docker
- [Commandes Docker](/docker/commands)
- [Gestion des Images](/docker/images)
- [Configuration Réseau](/docker/network)
- [Docker Compose](/docker/compose)

### Supabase
- [Introduction](/supabase/)
- [Configuration](/supabase/configuration)
- [Migrations](/supabase/migrations)
- [Authentification](/supabase/auth)

### Déploiement
- [Production](/deployment/production)
- [Développement](/deployment/development)
- [SSL/HTTPS](/deployment/ssl)
- [Maintenance](/deployment/maintenance)

## 🛠️ Fonctionnalités

- 🔐 Authentification avec Supabase
- 🗄️ Base de données PostgreSQL
- 🚀 API RESTful
- 🔄 Migrations automatiques
- 🐳 Conteneurisation Docker
- 🔒 SSL/HTTPS
- 🌐 Environnements multiples

## 🚀 Démarrage Rapide

1. Cloner le repository
```bash
git clone https://github.com/steeven08/laravel-supabase.git
cd laravel-supabase
```

2. Installer les dépendances
```bash
composer install
npm install
```

3. Configurer l'environnement
```bash
cp .env.example .env
php artisan key:generate
```

4. Démarrer avec Docker
```bash
docker-compose up -d
```

## 📦 Prérequis

- PHP 8.2+
- Composer
- Node.js 18+
- Docker & Docker Compose
- Git

## 🔗 Liens Utiles

- [GitHub Repository](https://github.com/steeven08/laravel-supabase)
- [Documentation Laravel](https://laravel.com/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Docker](https://docs.docker.com/)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Consulter la [documentation](/guide/)
- Contacter l'équipe de support

## À propos du projet

Ce projet combine **Laravel** avec **Supabase** pour créer une application web moderne et scalable. La documentation couvre :

- Configuration Docker pour développement et production
- Intégration Supabase complète
- Déploiement sécurisé avec SSL
- Séparation des environnements
- Scripts d'automatisation

## Prérequis

- Docker et Docker Compose
- Node.js (pour les assets frontend)
- Compte Supabase
- Serveur de production (VPS/serveur dédié)

## Structure du projet

```
laravel-supabase/
├── docker/                 # Configurations Docker
├── scripts/               # Scripts bash d'automatisation
├── docs/                  # Documentation (VitePress)
├── app/                   # Application Laravel
└── compose.*.yaml         # Docker Compose files
```

