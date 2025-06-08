# 🏠 Images Docker

Guide complet pour la création, gestion et optimisation des images Docker dans le projet Laravel-Supabase.

## 📋 Vue d'ensemble

Les images Docker sont les templates de nos conteneurs. Ce guide couvre la construction, l'optimisation et la gestion du cycle de vie des images.

### 🏗️ Architecture des images

```
📦 Images Docker du projet
├── 🐘 php-fpm (Multi-stage)
│   ├── 🔨 builder (Construction)
│   ├── 🏭 production (Runtime optimisé)
│   └── 🛠️ development (Debug + tools)
├── 🌐 nginx (Production)
│   ├── Assets statiques
│   ├── Configuration SSL
│   └── Optimisations Gzip
└── 💼 workspace (Développement)
    ├── Node.js + npm
    ├── Composer
    └── Outils développement
```

---

## 🔨 Construction des images

### Images PHP-FPM (Multi-stage)

Le Dockerfile principal utilise une approche multi-stage pour optimiser la taille et séparer les environnements :

```dockerfile
# Stage 1: Builder
FROM php:8.4-fpm AS builder
RUN apt-get update && apt-get install -y \
    curl unzip libpq-dev libonig-dev \
    && docker-php-ext-install pdo_pgsql opcache
COPY . /var/www
RUN composer install --no-dev --optimize-autoloader

# Stage 2: Production
FROM php:8.4-fpm AS production
COPY --from=builder /var/www /var/www
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
USER www-data

# Stage 3: Development
FROM production AS development
RUN pecl install xdebug && docker-php-ext-enable xdebug
USER www-data
```

### Construction des images

```bash
# Image de développement
docker build -t laravel-supabase:dev \
  --target development \
  -f docker/common/php-fpm/Dockerfile .

# Image de production
docker build -t laravel-supabase:prod \
  --target production \
  -f docker/common/php-fpm/Dockerfile .

# Image Nginx de production
docker build -t laravel-supabase-nginx:prod \
  -f docker/production/nginx/Dockerfile .
```

---

## 📊 Gestion des tags et versions

### Stratégie de versioning

| Tag | Usage | Exemple | Description |
|-----|-------|---------|-------------|
| `latest` | Production courante | `myapp:latest` | Version stable actuelle |
| `dev` | Développement | `myapp:dev` | Version développement |
| `v1.2.3` | Version spécifique | `myapp:v1.2.3` | Release sémantique |
| `sha-abc123` | Commit spécifique | `myapp:sha-abc123` | Build CI/CD |

### Commandes de tagging

```bash
# Tag avec version
docker tag laravel-supabase:prod laravel-supabase:v1.0.0

# Tag latest
docker tag laravel-supabase:prod laravel-supabase:latest

# Tag avec hash de commit
git_hash=$(git rev-parse --short HEAD)
docker tag laravel-supabase:prod laravel-supabase:sha-$git_hash

# Voir les tags
docker images laravel-supabase
```

---

## 🚀 Publication sur Docker Hub

### Configuration du repository

```bash
# Se connecter à Docker Hub
docker login

# Tag pour Docker Hub
docker tag laravel-supabase:prod username/laravel-supabase:latest
docker tag laravel-supabase:prod username/laravel-supabase:v1.0.0

# Push vers Docker Hub
docker push username/laravel-supabase:latest
docker push username/laravel-supabase:v1.0.0
```

### Script de publication automatisé

```bash
#!/bin/bash
# scripts/push-images.sh

set -e

# Variables
DOCKER_USERNAME="your-username"
APP_NAME="laravel-supabase"
VERSION=${1:-"latest"}

# Build des images
echo "🔨 Construction des images..."
docker build -t $APP_NAME:web -f docker/production/nginx/Dockerfile .
docker build -t $APP_NAME:php-fpm --target production -f docker/common/php-fpm/Dockerfile .
docker build -t $APP_NAME:workspace -f docker/development/workspace/Dockerfile .

# Tag pour Docker Hub
echo "🏷️ Tagging des images..."
docker tag $APP_NAME:web $DOCKER_USERNAME/$APP_NAME-web:$VERSION
docker tag $APP_NAME:php-fpm $DOCKER_USERNAME/$APP_NAME-php-fpm:$VERSION
docker tag $APP_NAME:workspace $DOCKER_USERNAME/$APP_NAME-workspace:$VERSION

# Push vers Docker Hub
echo "🚀 Push vers Docker Hub..."
docker push $DOCKER_USERNAME/$APP_NAME-web:$VERSION
docker push $DOCKER_USERNAME/$APP_NAME-php-fpm:$VERSION
docker push $DOCKER_USERNAME/$APP_NAME-workspace:$VERSION

echo "✅ Images publiées avec succès !"
```

---

## ⚡ Optimisation des images

### Réduction de la taille

#### 1. Utilisation d'images de base minimales

```dockerfile
# ❌ Image lourde
FROM ubuntu:latest

# ✅ Image optimisée
FROM php:8.4-fpm-alpine
```

#### 2. Multi-stage builds

```dockerfile
# ✅ Optimisation avec multi-stage
FROM node:18 AS assets-builder
COPY package*.json ./
RUN npm ci --only=production
RUN npm run build

FROM php:8.4-fpm AS production
# Copier seulement les assets compilés
COPY --from=assets-builder /app/public/build /var/www/public/build
```

#### 3. Nettoyage des caches

```dockerfile
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    && apt-get autoremove -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
```

### Optimisations PHP

```dockerfile
# Installation des extensions en une seule couche
RUN docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    pdo_pgsql \
    opcache \
    intl \
    zip \
    bcmath

# Configuration OPcache pour production
RUN echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.revalidate_freq=2" >> /usr/local/etc/php/conf.d/opcache.ini
```

---

## 🔍 Analyse et inspection des images

### Inspection des images

```bash
# Informations détaillées sur une image
docker inspect laravel-supabase:prod

# Historique des layers
docker history laravel-supabase:prod

# Taille des images
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### Analyse de la taille avec dive

```bash
# Installer dive pour analyser les layers
docker run --rm -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  wagoodman/dive:latest laravel-supabase:prod
```

### Scan de sécurité

```bash
# Scan avec Docker Scout
docker scout quickview laravel-supabase:prod

# Scan avec Trivy
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image laravel-supabase:prod
```

---

## 🗄️ Registry privé

### Configuration d'un registry local

```yaml
# docker-compose.registry.yml
version: '3.8'
services:
  registry:
    image: registry:2
    ports:
      - "5000:5000"
    volumes:
      - registry-data:/var/lib/registry

volumes:
  registry-data:
```

### Utilisation du registry

```bash
# Démarrer le registry
docker compose -f docker-compose.registry.yml up -d

# Tag pour le registry local
docker tag laravel-supabase:prod localhost:5000/laravel-supabase:prod

# Push vers le registry local
docker push localhost:5000/laravel-supabase:prod

# Pull depuis le registry local
docker pull localhost:5000/laravel-supabase:prod
```

---

## 🔄 Cache et optimisations de build

### BuildKit et cache

```bash
# Activer BuildKit
export DOCKER_BUILDKIT=1

# Build avec cache depuis registry
docker build \
  --cache-from laravel-supabase:latest \
  --tag laravel-supabase:new \
  .

# Cache multi-stage
docker build \
  --cache-from laravel-supabase:builder \
  --cache-from laravel-supabase:prod \
  --tag laravel-supabase:optimized \
  .
```

### Cache mount pour Composer

```dockerfile
# Cache Composer avec BuildKit
RUN --mount=type=cache,target=/root/.composer/cache \
    composer install --no-dev --optimize-autoloader
```

---

## 📦 Gestion des layers

### Bonnes pratiques pour les layers

```dockerfile
# ❌ Multiples layers inutiles
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y unzip
RUN rm -rf /var/lib/apt/lists/*

# ✅ Layer unique optimisé
RUN apt-get update \
    && apt-get install -y curl unzip \
    && rm -rf /var/lib/apt/lists/*
```

### Ordre optimal des instructions

```dockerfile
# 1. Instructions qui changent rarement en premier
FROM php:8.4-fpm

# 2. Installation des dépendances système
RUN apt-get update && apt-get install -y...

# 3. Configuration PHP
COPY php.ini /usr/local/etc/php/

# 4. Installation Composer
RUN curl -sS https://getcomposer.org/installer | php

# 5. Copie des fichiers de dépendances
COPY composer.json composer.lock ./

# 6. Installation des dépendances PHP
RUN composer install --no-dev

# 7. Copie du code application (change souvent)
COPY . .

# 8. Configuration finale
RUN chown -R www-data:www-data /var/www
```

---

## 🚨 Dépannage des images

### Problèmes courants

| Problème | Symptôme | Solution |
|----------|----------|----------|
| **Image trop lourde** | Build lent, storage plein | Multi-stage build, alpine |
| **Permissions** | Erreur 403/404 dans container | Fixer les permissions avec `chown` |
| **Extensions manquantes** | Erreur PHP | Installer avec `docker-php-ext-install` |
| **Cache obsolète** | Changements non pris en compte | Build avec `--no-cache` |

### Debugging d'une image

```bash
# Entrer dans une image pour debug
docker run -it --rm laravel-supabase:prod bash

# Vérifier les permissions
docker run --rm laravel-supabase:prod ls -la /var/www

# Tester une commande spécifique
docker run --rm laravel-supabase:prod php -v
```

---

## 📊 Monitoring des images

### Métriques importantes

```bash
# Taille totale des images
docker system df

# Images par taille
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | sort -k3 -h

# Images non utilisées
docker images --filter "dangling=true"

# Nettoyage des images non utilisées
docker image prune -a
```

### Automatisation du nettoyage

```bash
#!/bin/bash
# Nettoyage automatique des images

# Supprimer les images non taguées
docker rmi $(docker images -f "dangling=true" -q) 2>/dev/null || true

# Supprimer les anciennes versions (garder les 3 dernières)
docker images laravel-supabase --format "{{.Tag}}" | grep -v latest | tail -n +4 | xargs -I {} docker rmi laravel-supabase:{} 2>/dev/null || true

echo "✅ Nettoyage terminé"
```

---

## 📚 Ressources utiles

- [Docker Images Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage builds](https://docs.docker.com/develop/dev-best-practices/#use-multi-stage-builds)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Docker BuildKit](https://docs.docker.com/develop/dev-best-practices/#enable-buildkit)

---

*Cette documentation couvre la gestion complète des images Docker pour optimiser les performances, la sécurité et la maintenabilité du projet Laravel-Supabase.* 