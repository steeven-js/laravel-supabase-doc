# 🔧 Commandes Docker

Guide de référence complet pour toutes les commandes Docker essentielles du projet Laravel-Supabase.

## 📋 Vue d'ensemble

Ce guide couvre toutes les commandes Docker nécessaires pour développer, déboguer et déployer l'application Laravel-Supabase efficacement.

### 🎯 Objectifs

- **Maîtriser les commandes** Docker de base et avancées
- **Gérer les conteneurs** en développement et production
- **Déboguer efficacement** les problèmes Docker
- **Optimiser les workflows** de développement

---

## 🚀 Commandes de base

### Gestion des conteneurs

```bash
# Démarrer tous les services
docker compose up -d

# Démarrer un environnement spécifique
docker compose -f compose.dev.yaml up -d
docker compose -f compose.prod.yaml up -d

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Redémarrer un service spécifique
docker compose restart web
docker compose restart php-fpm

# Redémarrer tous les services
docker compose restart
```

### État des services

```bash
# Voir l'état des conteneurs
docker compose ps

# Voir tous les conteneurs (même arrêtés)
docker compose ps -a

# Statistiques en temps réel
docker stats

# Statistiques d'un conteneur spécifique
docker stats laravel-supabase-web-1
```

---

## 📊 Surveillance et logs

### Logs des services

```bash
# Logs de tous les services
docker compose logs

# Logs en temps réel
docker compose logs -f

# Logs d'un service spécifique
docker compose logs web
docker compose logs php-fpm
docker compose logs redis

# Logs avec horodatage
docker compose logs -t web

# Dernières 50 lignes
docker compose logs --tail=50 php-fpm

# Logs depuis une date
docker compose logs --since=2024-01-01 web
```

### Inspection détaillée

```bash
# Inspecter un conteneur
docker inspect laravel-supabase-web-1

# Voir les processus dans un conteneur
docker compose top web

# Utilisation des ressources
docker compose exec web htop

# Informations réseau d'un conteneur
docker inspect laravel-supabase-web-1 | grep -E "(IPAddress|NetworkMode)"
```

---

## 🖥️ Exécution de commandes

### Accès aux conteneurs

```bash
# Shell interactif dans un conteneur
docker compose exec web bash
docker compose exec php-fpm bash
docker compose exec workspace bash

# Exécuter une commande sans shell interactif
docker compose exec web ls -la /var/www
docker compose exec php-fpm php -v

# Exécuter en tant qu'utilisateur spécifique
docker compose exec --user root web bash
```

### Commandes Laravel courantes

```bash
# Artisan commands
docker compose exec php-fpm php artisan migrate
docker compose exec php-fpm php artisan db:seed
docker compose exec php-fpm php artisan cache:clear
docker compose exec php-fpm php artisan config:clear
docker compose exec php-fpm php artisan route:list

# Composer commands
docker compose exec php-fpm composer install
docker compose exec php-fpm composer update
docker compose exec php-fpm composer dump-autoload

# Tests
docker compose exec php-fpm php artisan test
docker compose exec php-fpm vendor/bin/phpunit
```

### Commandes frontend

```bash
# NPM dans le workspace
docker compose exec workspace npm install
docker compose exec workspace npm run dev
docker compose exec workspace npm run build
docker compose exec workspace npm run test

# Yarn alternative
docker compose exec workspace yarn install
docker compose exec workspace yarn dev
```

---

## 🔨 Construction et gestion des images

### Build des images

```bash
# Construire toutes les images
docker compose build

# Construire sans cache
docker compose build --no-cache

# Construire une image spécifique
docker compose build web
docker compose build php-fpm

# Build avec pull des images de base
docker compose build --pull
```

### Gestion des images

```bash
# Lister les images
docker images

# Lister les images du projet
docker images | grep laravel-supabase

# Supprimer une image
docker rmi laravel-supabase:latest

# Supprimer les images non utilisées
docker image prune

# Supprimer toutes les images non utilisées
docker image prune -a

# Voir l'espace utilisé
docker system df
```

### Tags et publication

```bash
# Tagger une image
docker tag laravel-supabase:latest username/laravel-supabase:v1.0.0

# Push vers Docker Hub
docker push username/laravel-supabase:v1.0.0

# Pull une image
docker pull username/laravel-supabase:latest
```

---

## 🌐 Gestion des réseaux

### Réseaux Docker

```bash
# Lister les réseaux
docker network ls

# Inspecter un réseau
docker network inspect laravel-development

# Créer un réseau
docker network create laravel-custom

# Supprimer un réseau
docker network rm laravel-custom

# Nettoyer les réseaux orphelins
docker network prune
```

### Connexion des conteneurs

```bash
# Connecter un conteneur à un réseau
docker network connect laravel-development container_name

# Déconnecter un conteneur d'un réseau
docker network disconnect laravel-development container_name

# Voir les conteneurs connectés à un réseau
docker network inspect laravel-development | grep -A 10 "Containers"
```

---

## 📦 Gestion des volumes

### Volumes Docker

```bash
# Lister les volumes
docker volume ls

# Inspecter un volume
docker volume inspect laravel-storage-production

# Créer un volume
docker volume create my-volume

# Supprimer un volume
docker volume rm volume_name

# Nettoyer les volumes orphelins
docker volume prune
```

### Backup et restauration

```bash
# Backup d'un volume
docker run --rm -v laravel-storage-production:/data -v $(pwd):/backup alpine tar czf /backup/storage-backup.tar.gz /data

# Restaurer un volume
docker run --rm -v laravel-storage-production:/data -v $(pwd):/backup alpine tar xzf /backup/storage-backup.tar.gz -C /

# Copier des fichiers vers/depuis un conteneur
docker cp ./local-file.txt container_name:/path/to/file.txt
docker cp container_name:/path/to/file.txt ./local-file.txt
```

---

## 🔍 Debugging et dépannage

### Diagnostic des problèmes

```bash
# Voir les événements Docker
docker events

# Historique d'un conteneur
docker history image_name

# Processus en cours dans un conteneur
docker compose exec web ps aux

# Variables d'environnement d'un conteneur
docker compose exec web env

# Tester la connectivité réseau
docker compose exec web ping php-fpm
docker compose exec php-fpm curl http://redis:6379
```

### Health checks

```bash
# Vérifier le health status
docker compose ps

# Logs de health check
docker inspect --format='{{json .State.Health}}' container_name

# Forcer un health check
docker compose exec web sh -c 'curl -f http://localhost || exit 1'
```

### Performance et ressources

```bash
# Utilisation CPU et mémoire
docker stats --no-stream

# Utilisation disque
docker system df

# Processus système affectés par Docker
ps aux | grep docker

# Logs système Docker
sudo journalctl -u docker.service
```

---

## 🔄 Workflows avancés

### Développement

```bash
# Workflow développement complet
#!/bin/bash
# start-dev.sh

echo "🚀 Démarrage environnement développement..."

# 1. Nettoyer si nécessaire
docker compose down

# 2. Démarrer Supabase
cd ../supabase-project-dev
docker compose up -d

# 3. Attendre que Supabase soit prêt
echo "⏳ Attente Supabase..."
sleep 10

# 4. Démarrer Laravel
cd ../laravel-supabase
docker compose -f compose.dev.yaml up -d

# 5. Installer les dépendances
docker compose -f compose.dev.yaml exec workspace composer install
docker compose -f compose.dev.yaml exec workspace npm install

echo "✅ Environnement prêt sur http://localhost:8080"
```

### Production

```bash
# Workflow production
#!/bin/bash
# deploy-prod.sh

echo "🏭 Déploiement production..."

# 1. Build les assets
npm run build

# 2. Construire les images
docker compose -f compose.prod.yaml build --no-cache

# 3. Démarrer les services
docker compose -f compose.prod.yaml up -d

# 4. Vérifier la santé
sleep 30
docker compose -f compose.prod.yaml ps

echo "✅ Production déployée"
```

---

## 🧹 Nettoyage et maintenance

### Nettoyage régulier

```bash
# Nettoyage complet du système
docker system prune -a --volumes

# Nettoyage sélectif
docker container prune  # Conteneurs arrêtés
docker image prune -a   # Images non utilisées
docker volume prune     # Volumes orphelins
docker network prune    # Réseaux orphelins

# Forcer la suppression de tout
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker rmi $(docker images -q)
```

### Maintenance des images

```bash
# Mise à jour des images de base
docker compose pull

# Reconstruction complète
docker compose build --no-cache --pull

# Rotation des logs Docker
sudo sh -c 'echo "{\"log-driver\":\"json-file\",\"log-opts\":{\"max-size\":\"10m\",\"max-file\":\"3\"}}" > /etc/docker/daemon.json'
sudo systemctl restart docker
```

---

## 🚨 Commandes d'urgence

### Récupération d'erreurs

```bash
# Arrêt d'urgence de tous les conteneurs
docker kill $(docker ps -q)

# Redémarrage complet du service Docker
sudo systemctl restart docker

# Vérifier l'espace disque
df -h
docker system df

# Libérer de l'espace rapidement
docker system prune -a --volumes --force
```

### Diagnostic réseau

```bash
# Tester la connectivité Docker
docker run --rm alpine ping -c 3 google.com

# Vérifier les ports ouverts
netstat -tlnp | grep :8080
ss -tlnp | grep :8080

# Tester les DNS
docker run --rm alpine nslookup google.com
```

---

## 📋 Aliases utiles

### Configuration bash

```bash
# Ajouter à ~/.bashrc ou ~/.zshrc

# Aliases Docker Compose
alias dc='docker compose'
alias dcup='docker compose up -d'
alias dcdown='docker compose down'
alias dcps='docker compose ps'
alias dclogs='docker compose logs -f'

# Aliases développement
alias dev-start='cd ../supabase-project-dev && docker compose up -d && cd ../laravel-supabase && docker compose -f compose.dev.yaml up -d'
alias dev-stop='docker compose -f compose.dev.yaml down && cd ../supabase-project-dev && docker compose down && cd ../laravel-supabase'

# Aliases Laravel
alias laravel-exec='docker compose exec php-fpm'
alias artisan='docker compose exec php-fpm php artisan'
alias composer='docker compose exec php-fpm composer'

# Aliases utiles
alias docker-clean='docker system prune -a --volumes'
alias docker-stats='docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"'
```

---

## 🔧 Scripts d'automatisation

### Script de monitoring

```bash
#!/bin/bash
# monitor.sh

echo "📊 Monitoring Docker Laravel-Supabase"
echo "======================================"

echo "🐳 État des conteneurs:"
docker compose ps

echo -e "\n📈 Utilisation des ressources:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo -e "\n🌐 Réseaux:"
docker network ls | grep -E "(laravel|supabase)"

echo -e "\n📦 Volumes:"
docker volume ls | grep -E "(laravel|supabase)"

echo -e "\n💾 Espace disque Docker:"
docker system df
```

### Script de tests

```bash
#!/bin/bash
# test-docker.sh

echo "🧪 Tests de connectivité Docker"
echo "==============================="

# Test Nginx
echo "Testing Nginx..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 || echo "❌ Nginx failed"

# Test Supabase
echo "Testing Supabase..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 || echo "❌ Supabase failed"

# Test communication interne
echo "Testing internal communication..."
docker compose exec php-fpm curl -s http://redis:6379 || echo "❌ Redis connection failed"

echo "✅ Tests terminés"
```

---

## 📚 Ressources et références

### Documentation officielle

- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/docker/)
- [Docker Compose Reference](https://docs.docker.com/compose/reference/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

### Outils complémentaires

```bash
# Installation d'outils utiles
docker run --rm -it wagoodman/dive:latest  # Analyse des images
docker run --rm -it nicolaka/netshoot     # Debug réseau
docker run --rm -it alpine/htop           # Monitoring processus
```

---

## 🎯 Commandes par cas d'usage

### Développement quotidien

```bash
# Démarrer la journée
dcup

# Voir les logs
dclogs

# Accéder au workspace
docker compose exec workspace bash

# Tests rapides
artisan test

# Fin de journée
dcdown
```

### Debugging

```bash
# Analyser un problème
docker compose ps
docker compose logs problematic-service
docker compose exec problematic-service bash

# Tester la connectivité
docker compose exec web ping php-fpm
docker compose exec php-fpm curl http://redis:6379
```

### Mise en production

```bash
# Préparer la production
npm run build
docker compose -f compose.prod.yaml build
docker compose -f compose.prod.yaml up -d

# Vérifier le déploiement
docker compose -f compose.prod.yaml ps
curl -f https://votre-domaine.com
```

---

*Ce guide de référence couvre toutes les commandes Docker essentielles pour travailler efficacement avec le projet Laravel-Supabase.* 