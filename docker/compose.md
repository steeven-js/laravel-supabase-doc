# 🔧 Docker Compose

Guide complet pour l'orchestration multi-conteneurs avec Docker Compose dans le projet Laravel-Supabase.

## 📋 Vue d'ensemble

Docker Compose permet d'orchestrer plusieurs conteneurs et de définir l'infrastructure complète du projet dans des fichiers YAML déclaratifs.

### 🏗️ Fichiers de configuration

| Fichier | Environnement | Usage | Services |
|---------|---------------|-------|----------|
| `docker-compose.yml` | **Laravel Sail** | Développement complet | nginx, php-fpm, postgres, mysql, redis |
| `compose.dev.yaml` | **Développement** | Stack personnalisée | nginx, php-fpm, workspace, redis |
| `compose.prod.yaml` | **Production** | Stack optimisée | nginx, php-fpm, redis, certbot |

---

## 🚀 Commandes Docker Compose

### Démarrage des services

```bash
# Développement avec Sail
docker compose up -d

# Développement personnalisé
docker compose -f compose.dev.yaml up -d

# Production
docker compose -f compose.prod.yaml up -d
```

### Gestion des services

```bash
# Arrêter les services
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Redémarrer un service spécifique
docker compose restart web

# Voir les logs d'un service
docker compose logs -f php-fpm

# Exécuter une commande dans un conteneur
docker compose exec workspace bash
```

### Construction et mise à jour

```bash
# Construire les images
docker compose build

# Construire sans cache
docker compose build --no-cache

# Mettre à jour les images
docker compose pull
```

---

## 🏗️ Structure des fichiers Compose

### Développement (`compose.dev.yaml`)

```yaml
services:
  web:
    image: nginx:latest
    volumes:
      - ./:/var/www
      - ./docker/development/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "8080:80"
    networks:
      - laravel-development
      - supabase-dev_default
    depends_on:
      - php-fpm

  php-fpm:
    build:
      context: .
      dockerfile: ./docker/common/php-fpm/Dockerfile
      target: development
    env_file:
      - .env
    volumes:
      - ./:/var/www
    networks:
      - laravel-development
      - supabase-dev_default

  workspace:
    build:
      context: .
      dockerfile: ./docker/development/workspace/Dockerfile
    ports:
      - '5173:5173'
    tty: true
    stdin_open: true
    volumes:
      - ./:/var/www
    networks:
      - laravel-development
      - supabase-dev_default

networks:
  laravel-development:
  supabase-dev_default:
    external: true
```

### Production (`compose.prod.yaml`)

```yaml
services:
  web:
    build:
      context: .
      dockerfile: ./docker/production/nginx/Dockerfile
    restart: unless-stopped
    volumes:
      - laravel-storage-production:/var/www/storage:ro
      - laravel-public-assets:/var/www/public/build:ro
      - certbot-etc:/etc/letsencrypt:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - php-fpm

  certbot:
    image: certbot/certbot
    restart: unless-stopped
    volumes:
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/certbot

  php-fpm:
    build:
      context: .
      dockerfile: ./docker/common/php-fpm/Dockerfile
      target: production
    restart: unless-stopped
    volumes:
      - laravel-storage-production:/var/www/storage
    env_file:
      - .env.production
    healthcheck:
      test: ["CMD-SHELL", "php-fpm-healthcheck || exit 1"]

volumes:
  laravel-storage-production:
  laravel-public-assets:
  certbot-etc:
  certbot-var:
```

---

## 🌐 Réseaux Docker

### Communication inter-conteneurs

```yaml
networks:
  # Réseau interne Laravel
  laravel-development:
    driver: bridge
  
  # Réseau externe Supabase
  supabase-dev_default:
    external: true
```

#### Avantages des réseaux :
- **Isolation** : Séparation des environnements
- **Communication** : Services accessibles par nom
- **Sécurité** : Contrôle des accès
- **Flexibilité** : Connexion à des stacks externes

---

## 📦 Volumes Docker

### Types de volumes

| Type | Usage | Exemple | Persistance |
|------|-------|---------|-------------|
| **Bind Mount** | Développement | `./:/var/www` | Système hôte |
| **Volume nommé** | Production | `laravel-storage-production` | Docker |
| **tmpfs** | Cache temporaire | `/tmp` | RAM |

### Configuration des volumes

```yaml
volumes:
  # Volume nommé pour le storage Laravel
  laravel-storage-production:
    driver: local
  
  # Volume pour les assets compilés
  laravel-public-assets:
    driver: local
  
  # Certificats SSL
  certbot-etc:
    driver: local
```

---

## ⚙️ Variables d'environnement

### Fichiers d'environnement

```yaml
services:
  php-fpm:
    env_file:
      - .env                    # Développement
      - .env.production         # Production
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
```

### Variables importantes

| Variable | Développement | Production | Description |
|----------|---------------|------------|-------------|
| `APP_ENV` | `local` | `production` | Mode Laravel |
| `APP_DEBUG` | `true` | `false` | Debug activé |
| `APP_URL` | `http://localhost:8080` | `https://domain.com` | URL application |
| `SUPABASE_URL` | `http://localhost:8000` | URL externe | Endpoint Supabase |

---

## 🔄 Workflows recommandés

### Développement

```bash
# 1. Démarrer Supabase
cd ../supabase-project-dev
docker compose up -d

# 2. Démarrer Laravel
cd ../laravel-supabase
docker compose -f compose.dev.yaml up -d

# 3. Accéder au workspace
docker compose -f compose.dev.yaml exec workspace bash

# 4. Installer les dépendances
composer install
npm install
npm run dev
```

### Production

```bash
# 1. Démarrer Supabase
cd ../supabase-project
docker compose up -d

# 2. Construire les assets
npm run build

# 3. Démarrer la production
docker compose -f compose.prod.yaml up -d

# 4. Vérifier les services
docker compose -f compose.prod.yaml ps
```

---

## 🔍 Monitoring et debugging

### Vérification des services

```bash
# État des conteneurs
docker compose ps

# Logs en temps réel
docker compose logs -f

# Logs d'un service spécifique
docker compose logs nginx

# Inspection d'un conteneur
docker compose exec web ls -la /var/www
```

### Health checks

```yaml
healthcheck:
  test: ["CMD-SHELL", "curl -f http://localhost || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

---

## 🛠️ Optimisations avancées

### Cache des layers Docker

```yaml
# Utiliser BuildKit pour des builds plus rapides
services:
  app:
    build:
      context: .
      cache_from:
        - myapp:latest
      target: production
```

### Ressources limitées

```yaml
services:
  php-fpm:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

### Profiles pour environnements

```yaml
services:
  debug-tools:
    profiles: ["debug"]
    image: nicolaka/netshoot
```

```bash
# Activer un profile
docker compose --profile debug up -d
```

---

## 🚨 Dépannage commun

### Erreurs fréquentes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `port already in use` | Port occupé | Changer le port ou arrêter le service |
| `network not found` | Réseau externe absent | Créer le réseau Supabase |
| `volume mount failed` | Permissions | Fixer les permissions avec `chown` |
| `build failed` | Dockerfile incorrect | Vérifier le Dockerfile |

### Commandes de diagnostic

```bash
# Vérifier les réseaux
docker network ls

# Vérifier les volumes
docker volume ls

# Nettoyer le système
docker system prune -a

# Reconstruire tout
docker compose build --no-cache
docker compose up -d --force-recreate
```

---

## 📚 Ressources utiles

- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Networking in Compose](https://docs.docker.com/compose/networking/)
- [Variables in Compose](https://docs.docker.com/compose/environment-variables/)

---

*Cette documentation couvre l'utilisation complète de Docker Compose pour orchestrer les services Laravel-Supabase en développement et production.* 