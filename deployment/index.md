# 🚀 Guide de Déploiement

Guide complet pour déployer l'application Laravel-Supabase en développement et production avec Docker.

## 📋 Vue d'ensemble

Ce guide couvre tous les aspects du déploiement, depuis l'environnement de développement local jusqu'à la production sécurisée avec SSL/HTTPS.

### 🎯 Objectifs

- **Environnement de développement** optimal et efficace
- **Déploiement en production** sécurisé et performant
- **Gestion des environnements** séparés et isolés
- **SSL/HTTPS automatique** avec Let's Encrypt
- **Monitoring et maintenance** des applications

---

## 🗺️ Guides disponibles

### 🔧 [Environnement de Développement](./development)
Configuration optimale pour le développement local.

**Contenu :**
- Installation Docker et dépendances
- Configuration des environnements dev
- Hot reload et debugging
- Tests et validation

### 🏭 [Déploiement Production](./production)
Guide complet pour déployer en production.

**Contenu :**
- Configuration serveur de production
- SSL/HTTPS avec Let's Encrypt
- Variables d'environnement sécurisées
- Optimisations performance

### ⚙️ [Gestion des Environnements](./environments)
Stratégies pour gérer plusieurs environnements.

**Contenu :**
- Séparation dev/staging/prod
- Variables d'environnement
- Bases de données isolées
- Workflow CI/CD

### 🔒 [SSL/HTTPS](./ssl)
Configuration SSL automatique et sécurité.

**Contenu :**
- Certificats Let's Encrypt
- Configuration Nginx SSL
- Renouvellement automatique
- Sécurité avancée

### 🛠️ [Maintenance](./maintenance)
Maintenance et monitoring des applications.

**Contenu :**
- Logs et monitoring
- Backup et restauration
- Mise à jour des services
- Dépannage

---

## 🏗️ Architecture de déploiement

### Développement

```
🔧 Environnement Développement
├── 🐳 Docker Compose (compose.dev.yaml)
│   ├── nginx:8080 (dev server)
│   ├── php-fpm (avec XDebug)
│   ├── workspace (Vite + tools)
│   └── redis (cache local)
├── 🗄️ Supabase Dev (supabase-project-dev)
│   ├── kong:8000 (API Gateway)
│   ├── postgres:5432 (DB locale)
│   └── studio (interface admin)
└── 🔗 Réseaux
    ├── laravel-development
    └── supabase-dev_default
```

### Production

```
🏭 Environnement Production
├── 🐳 Docker Compose (compose.prod.yaml)
│   ├── nginx:80,443 (SSL terminaison)
│   ├── php-fpm (optimisé OPcache)
│   ├── certbot (SSL automatique)
│   └── redis (cache persistant)
├── 🗄️ Supabase Prod (supabase-project)
│   ├── kong:8000 (API Gateway)
│   ├── postgres:5432 (DB production)
│   └── volumes persistants
└── 🔗 Réseaux
    ├── laravel-production
    └── supabase-standalone_default
```

---

## 🚀 Démarrage rapide

### Développement (3 étapes)

```bash
# 1. Cloner le projet
git clone https://github.com/steeven-js/laravel-supabase.git
cd laravel-supabase

# 2. Démarrer Supabase
cd ../supabase-project-dev
docker compose up -d

# 3. Démarrer Laravel
cd ../laravel-supabase
docker compose -f compose.dev.yaml up -d
```

**✅ Application disponible sur http://localhost:8080**

### Production (4 étapes)

```bash
# 1. Préparer le serveur
apt update && apt install docker.io docker-compose-plugin

# 2. Configurer le domaine (DNS)
# Pointer votre domaine vers l'IP du serveur

# 3. Démarrer Supabase
cd supabase-project
docker compose up -d

# 4. Démarrer Laravel avec SSL
cd ../laravel-supabase
docker compose -f compose.prod.yaml up -d
```

**✅ Application disponible sur https://votre-domaine.com**

---

## 🔧 Prérequis techniques

### Serveur de développement

| Composant | Minimum | Recommandé |
|-----------|---------|------------|
| **RAM** | 4GB | 8GB |
| **CPU** | 2 cores | 4+ cores |
| **Stockage** | 20GB | 50GB SSD |
| **OS** | Linux/macOS/Windows | Ubuntu 22.04+ |

### Serveur de production

| Composant | Minimum | Recommandé |
|-----------|---------|------------|
| **RAM** | 2GB | 4GB+ |
| **CPU** | 1 core | 2+ cores |
| **Stockage** | 20GB SSD | 50GB+ SSD |
| **OS** | Ubuntu 20.04+ | Ubuntu 22.04+ |
| **Réseau** | 100Mbps | 1Gbps |

### Logiciels requis

```bash
# Docker et Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose Plugin
apt install docker-compose-plugin

# Git
apt install git

# Node.js (pour build assets)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install nodejs
```

---

## 🌍 Environnements et URLs

### Développement local

| Service | URL | Credentials |
|---------|-----|-------------|
| **Laravel App** | http://localhost:8080 | - |
| **Supabase Studio** | http://localhost:8000 | supabase / password |
| **Vite Dev Server** | http://localhost:5173 | - |
| **Mailpit** | http://localhost:8025 | - |

### Production

| Service | URL | Configuration |
|---------|-----|---------------|
| **Application** | https://votre-domaine.com | SSL automatique |
| **Supabase** | https://supabase-domain.com | SSL requis |
| **Admin** | https://votre-domaine.com/admin | Auth protégée |

---

## 🔄 Workflow de déploiement

### 1. Développement

```bash
# Démarrer l'environnement
./scripts/start-dev.sh

# Développer avec hot reload
npm run dev

# Tests
php artisan test
npm run test
```

### 2. Staging (optionnel)

```bash
# Build pour staging
npm run build

# Déployer sur staging
./scripts/deploy-staging.sh
```

### 3. Production

```bash
# Build optimisé
npm run build

# Déployer en production
./scripts/deploy-production.sh

# Vérifier le déploiement
./scripts/health-check.sh
```

---

## 📊 Variables d'environnement

### Configuration par environnement

| Variable | Développement | Production | Description |
|----------|---------------|------------|-------------|
| `APP_ENV` | `local` | `production` | Mode Laravel |
| `APP_DEBUG` | `true` | `false` | Debug activé |
| `APP_URL` | `http://localhost:8080` | `https://domain.com` | URL application |
| `SUPABASE_URL` | `http://localhost:8000` | `https://project.supabase.co` | Endpoint Supabase |
| `NGINX_PORT` | `8080` | `80` | Port Nginx |

### Fichiers de configuration

```bash
laravel-supabase/
├── .env                    # Développement
├── .env.example           # Template
├── .env.production        # Production
└── .env.staging          # Staging (optionnel)
```

---

## 🔍 Monitoring et logs

### Logs disponibles

```bash
# Logs Laravel
docker compose logs php-fpm

# Logs Nginx
docker compose logs web

# Logs Supabase
cd ../supabase-project
docker compose logs kong

# Logs systeme
journalctl -u docker.service
```

### Health checks

```bash
# Vérifier les services
docker compose ps

# Test de connectivité
curl -f http://localhost:8080/health
curl -f http://localhost:8000/health

# Monitoring des ressources
docker stats
```

---

## 🚨 Dépannage courant

### Problèmes fréquents

| Problème | Symptôme | Solution |
|----------|----------|----------|
| **Port occupé** | Port 8080 in use | Arrêter le service ou changer le port |
| **SSL échoue** | Certificate error | Vérifier DNS et firewall |
| **Build failed** | Docker build error | Nettoyer le cache Docker |
| **DB connexion** | Connection refused | Vérifier réseau Supabase |

### Commandes utiles

```bash
# Redémarrer tous les services
docker compose down && docker compose up -d

# Nettoyer Docker
docker system prune -a

# Vérifier les réseaux
docker network ls

# Réinitialiser complètement
./scripts/reset-environment.sh
```

---

## 📚 Ressources et liens utiles

### Documentation

- [🏗️ Architecture Roadmap](../architecture-roadmap) - Vue d'ensemble complète
- [🐳 Docker](../docker/) - Configuration conteneurs  
- [🗄️ Supabase](../supabase/) - Base de données et API
- [📚 Guide](../guide/) - Guide utilisateur

### Outils externes

- [Docker Documentation](https://docs.docker.com/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Laravel Deployment](https://laravel.com/docs/deployment)

---

## 🎯 Prochaines étapes

1. **[Configurer l'environnement de développement](./development)**
2. **[Préparer le déploiement en production](./production)**
3. **[Sécuriser avec SSL/HTTPS](./ssl)**
4. **[Configurer la maintenance](./maintenance)**

---

*Ce guide de déploiement couvre tous les aspects pour faire fonctionner l'application Laravel-Supabase dans tous les environnements.* 