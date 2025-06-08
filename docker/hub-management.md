# 🐳 Guide de Mise à Jour DockerHub - Laravel Supabase

Ce guide vous accompagne **étape par étape** pour mettre à jour vos repositories DockerHub avec les dernières versions de vos images Laravel-Supabase.

## 🎯 **Vue d'ensemble des images**

Notre projet contient **3 images principales** :

| **Image** | **Service** | **Description** | **Taille** |
|---|---|---|---|
| 🖥️ **web** | nginx | Reverse proxy, SSL, static files | ~49MB |
| ⚙️ **php-fpm** | Laravel | Backend PHP, Laravel app | ~634MB |
| 💻 **workspace** | Dev tools | Outils développement, CLI | ~831MB |

---

## 🚀 **ÉTAPE 1 : Préparation et Build**

### 1.1 📍 Positionnement 
```bash
cd /var/www/laravel-supabase
```

### 1.2 🧹 Nettoyage des anciennes images
```bash
# Supprimer les images non utilisées
docker image prune -f

# Supprimer les anciennes versions si nécessaire
docker images | grep laravel-supabase | grep -v latest | awk '{print $3}' | xargs docker rmi 2>/dev/null || true
```

### 1.3 🏗️ Build des nouvelles images
```bash
# Build production (nginx + php-fpm)
docker-compose -f compose.prod.yaml build --no-cache

# Build développement (workspace)
docker-compose -f compose.dev.yaml build workspace --no-cache
```

### 1.4 ✅ Vérification du build
```bash
# Vérifier que les images sont créées
docker images | grep laravel-supabase
```

---

## 🏷️ **ÉTAPE 2 : Taggage avec Versioning**

### 2.1 📅 Définir la version
```bash
# Définir la version (format: YYYYMMDD ou semantic versioning)
VERSION=$(date +%Y%m%d)
echo "Version: $VERSION"

# Ou utiliser une version sémantique
# VERSION="v1.2.0"
```

### 2.2 🏷️ Taggage des images

#### Image Web (Nginx)
```bash
# Tag latest
docker tag laravel-supabase_web:latest steeven08/laravel-supabase-web:latest

# Tag avec version
docker tag laravel-supabase_web:latest steeven08/laravel-supabase-web:$VERSION

# Tag production
docker tag laravel-supabase_web:latest steeven08/laravel-supabase-web:prod
```

#### Image PHP-FPM
```bash
# Tag latest
docker tag laravel-supabase_php-fpm:latest steeven08/laravel-supabase-php-fpm:latest

# Tag avec version
docker tag laravel-supabase_php-fpm:latest steeven08/laravel-supabase-php-fpm:$VERSION

# Tag production
docker tag laravel-supabase_php-fpm:latest steeven08/laravel-supabase-php-fpm:prod
```

#### Image Workspace
```bash
# Tag latest
docker tag laravel-supabase_workspace:latest steeven08/laravel-supabase-workspace:latest

# Tag avec version
docker tag laravel-supabase_workspace:latest steeven08/laravel-supabase-workspace:$VERSION

# Tag développement
docker tag laravel-supabase_workspace:latest steeven08/laravel-supabase-workspace:dev
```

### 2.3 ✅ Vérification des tags
```bash
# Voir tous les tags créés
docker images | grep steeven08/laravel-supabase
```

---

## 🚀 **ÉTAPE 3 : Connexion et Push DockerHub**

### 3.1 🔐 Connexion à DockerHub
```bash
# Connexion à DockerHub
docker login

# Entrer vos identifiants :
# Username: steeven08
# Password: [votre-token-ou-mot-de-passe]
```

### 3.2 📤 Push des images

#### Push Web (Nginx)
```bash
echo "🚀 Push image Web..."
docker push steeven08/laravel-supabase-web:latest
docker push steeven08/laravel-supabase-web:$VERSION
docker push steeven08/laravel-supabase-web:prod
```

#### Push PHP-FPM
```bash
echo "🚀 Push image PHP-FPM..."
docker push steeven08/laravel-supabase-php-fpm:latest
docker push steeven08/laravel-supabase-php-fpm:$VERSION
docker push steeven08/laravel-supabase-php-fpm:prod
```

#### Push Workspace
```bash
echo "🚀 Push image Workspace..."
docker push steeven08/laravel-supabase-workspace:latest
docker push steeven08/laravel-supabase-workspace:$VERSION
docker push steeven08/laravel-supabase-workspace:dev
```

---

## ✅ **ÉTAPE 4 : Vérification et Tests**

### 4.1 🔍 Vérification sur DockerHub
```bash
# Vérifier les images sur DockerHub via API
curl -s https://registry.hub.docker.com/v2/repositories/steeven08/laravel-supabase-web/tags | jq '.results[].name'
curl -s https://registry.hub.docker.com/v2/repositories/steeven08/laravel-supabase-php-fpm/tags | jq '.results[].name'
curl -s https://registry.hub.docker.com/v2/repositories/steeven08/laravel-supabase-workspace/tags | jq '.results[].name'
```

### 4.2 🧪 Test de pull
```bash
# Test pull des nouvelles images
docker pull steeven08/laravel-supabase-web:latest
docker pull steeven08/laravel-supabase-php-fpm:latest
docker pull steeven08/laravel-supabase-workspace:latest
```

### 4.3 ⚡ Test de fonctionnement
```bash
# Test rapide avec docker run
docker run --rm steeven08/laravel-supabase-php-fpm:latest php -v
docker run --rm steeven08/laravel-supabase-web:latest nginx -v
```

---

## 📚 **ÉTAPE 5 : Mise à Jour Documentation**

### 5.1 📝 Documenter la version
```bash
# Créer une note de version
echo "# Version $VERSION - $(date)" >> RELEASE_NOTES.md
echo "- Mise à jour des images DockerHub" >> RELEASE_NOTES.md
echo "- Images disponibles: web, php-fpm, workspace" >> RELEASE_NOTES.md
echo "- Tags: latest, $VERSION, prod/dev" >> RELEASE_NOTES.md
echo "" >> RELEASE_NOTES.md
```

### 5.2 📋 Mettre à jour le README
```bash
# Mettre à jour les références d'images dans le README
sed -i "s/laravel-supabase_web:latest/steeven08\/laravel-supabase-web:latest/g" README.md
sed -i "s/laravel-supabase_php-fpm:latest/steeven08\/laravel-supabase-php-fpm:latest/g" README.md
```

---

## 🤖 **Script d'Automatisation Complet**

Voici un script qui automatise tout le processus :

```bash
#!/bin/bash
# 📁 Fichier: scripts/update-dockerhub.sh

set -e  # Arrêter en cas d'erreur

# Configuration
DOCKER_USERNAME="steeven08"
VERSION=$(date +%Y%m%d)
IMAGES=("web" "php-fpm" "workspace")

echo "🚀 Mise à jour DockerHub - Version: $VERSION"

# Fonction de logging
log() {
    echo "[$(date +%Y-%m-%d\ %H:%M:%S)] $1"
}

# ÉTAPE 1: Build des images
log "🏗️ ÉTAPE 1: Build des images..."
docker-compose -f compose.prod.yaml build --no-cache
docker-compose -f compose.dev.yaml build workspace --no-cache

# ÉTAPE 2: Taggage
log "🏷️ ÉTAPE 2: Taggage des images..."
for image in "${IMAGES[@]}"; do
    log "Taggage de l'image $image..."
    
    # Définir le nom de l'image source
    if [ "$image" = "workspace" ]; then
        source_image="laravel-supabase_${image}:latest"
    else
        source_image="laravel-supabase_${image}:latest"
    fi
    
    # Tags pour toutes les images
    docker tag $source_image ${DOCKER_USERNAME}/laravel-supabase-${image}:latest
    docker tag $source_image ${DOCKER_USERNAME}/laravel-supabase-${image}:${VERSION}
    
    # Tags spécifiques
    if [ "$image" = "workspace" ]; then
        docker tag $source_image ${DOCKER_USERNAME}/laravel-supabase-${image}:dev
    else
        docker tag $source_image ${DOCKER_USERNAME}/laravel-supabase-${image}:prod
    fi
done

# ÉTAPE 3: Connexion DockerHub
log "🔐 ÉTAPE 3: Connexion DockerHub..."
docker login

# ÉTAPE 4: Push des images
log "📤 ÉTAPE 4: Push vers DockerHub..."
for image in "${IMAGES[@]}"; do
    log "Push de l'image $image..."
    
    docker push ${DOCKER_USERNAME}/laravel-supabase-${image}:latest
    docker push ${DOCKER_USERNAME}/laravel-supabase-${image}:${VERSION}
    
    if [ "$image" = "workspace" ]; then
        docker push ${DOCKER_USERNAME}/laravel-supabase-${image}:dev
    else
        docker push ${DOCKER_USERNAME}/laravel-supabase-${image}:prod
    fi
done

# ÉTAPE 5: Vérification
log "✅ ÉTAPE 5: Vérification..."
for image in "${IMAGES[@]}"; do
    echo "🔍 Vérification $image:"
    curl -s https://registry.hub.docker.com/v2/repositories/${DOCKER_USERNAME}/laravel-supabase-${image}/tags | jq -r '.results[0:3][] | "  ✅ " + .name + " (updated: " + .last_updated + ")"'
done

log "🎉 Mise à jour DockerHub terminée avec succès !"
log "📱 Vérifiez sur: https://hub.docker.com/u/${DOCKER_USERNAME}"

# ÉTAPE 6: Documentation
log "📚 ÉTAPE 6: Mise à jour documentation..."
echo "# Version $VERSION - $(date)" >> docs/RELEASE_NOTES.md
echo "- Mise à jour des images DockerHub" >> docs/RELEASE_NOTES.md
echo "- Images: web:$VERSION, php-fpm:$VERSION, workspace:$VERSION" >> docs/RELEASE_NOTES.md
echo "" >> docs/RELEASE_NOTES.md

log "✅ Documentation mise à jour !"
```

---

## 📊 **Résultats Attendus**

Après avoir suivi ces étapes, vous devriez avoir :

### 🏪 **Sur DockerHub** :
- ✅ `steeven08/laravel-supabase-web` avec tags : `latest`, `YYYYMMDD`, `prod`
- ✅ `steeven08/laravel-supabase-php-fpm` avec tags : `latest`, `YYYYMMDD`, `prod`  
- ✅ `steeven08/laravel-supabase-workspace` avec tags : `latest`, `YYYYMMDD`, `dev`

### 💻 **En local** :
- ✅ Images buildées et taggées
- ✅ Images poussées vers DockerHub
- ✅ Documentation mise à jour

### 🌐 **URLs DockerHub** :
- 🔗 [steeven08/laravel-supabase-web](https://hub.docker.com/r/steeven08/laravel-supabase-web)
- 🔗 [steeven08/laravel-supabase-php-fpm](https://hub.docker.com/r/steeven08/laravel-supabase-php-fpm)
- 🔗 [steeven08/laravel-supabase-workspace](https://hub.docker.com/r/steeven08/laravel-supabase-workspace)

---

## 🚨 **Dépannage**

### Problème de connexion DockerHub
```bash
# Réinitialiser les credentials
docker logout
docker login

# Vérifier les permissions
ls -la ~/.docker/config.json
```

### Images trop volumineuses
```bash
# Optimiser les images avec multi-stage build
# Voir les Dockerfile dans docker/production/ et docker/development/

# Analyser la taille des couches
docker history steeven08/laravel-supabase-php-fpm:latest
```

### Échec de push
```bash
# Vérifier l'espace disque
df -h

# Vérifier la connexion
ping registry.hub.docker.com

# Push avec retry
for i in {1..3}; do docker push steeven08/laravel-supabase-web:latest && break || sleep 5; done
```

---

## 📋 **Checklist de Mise à Jour**

- [ ] 🏗️ **Build** des nouvelles images
- [ ] 🏷️ **Taggage** avec versioning approprié
- [ ] 🔐 **Connexion** DockerHub réussie
- [ ] 📤 **Push** de toutes les images
- [ ] ✅ **Vérification** sur DockerHub
- [ ] 🧪 **Test** de pull des nouvelles images
- [ ] 📚 **Documentation** mise à jour
- [ ] 🚀 **Notification** équipe/utilisateurs

---

## ⚡ **Actions Rapides**

### 🏃‍♂️ Mise à jour rapide (latest seulement)
```bash
# Build + Tag + Push en une commande
docker-compose -f compose.prod.yaml build && \
docker tag laravel-supabase_web:latest steeven08/laravel-supabase-web:latest && \
docker tag laravel-supabase_php-fpm:latest steeven08/laravel-supabase-php-fpm:latest && \
docker push steeven08/laravel-supabase-web:latest && \
docker push steeven08/laravel-supabase-php-fpm:latest
```

### 🔍 Vérification rapide
```bash
# Vérifier les dernières versions sur DockerHub
curl -s https://registry.hub.docker.com/v2/repositories/steeven08/laravel-supabase-web/tags | jq -r '.results[0] | "Latest: " + .name + " - " + .last_updated'
```

**🎯 Ce guide vous permet de maintenir vos images DockerHub à jour facilement et de façon reproductible !** 