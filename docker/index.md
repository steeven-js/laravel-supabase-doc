# 🐳 Docker

Documentation complète pour la gestion Docker du projet Laravel-Supabase.

## 📋 Guides disponibles

### 🏗️ [Commandes Docker](./commands)
Guide complet des commandes Docker essentielles pour le projet.

**Contenu :**
- Commandes de base Docker
- Gestion des conteneurs
- Surveillance et logs
- Dépannage

### 🏠 [Gestion des Images](./images)
Création, gestion et optimisation des images Docker.

**Contenu :**
- Construction des images
- Optimisation de la taille
- Versioning des images
- Bonnes pratiques

### 🌐 [Configuration Réseau](./network)
Configuration et gestion des réseaux Docker.

**Contenu :**
- Réseaux Docker
- Communication inter-conteneurs
- Exposition des ports
- Isolation réseau

### 🔧 [Docker Compose](./compose)
Orchestration multi-conteneurs avec Docker Compose.

**Contenu :**
- Configuration des services
- Variables d'environnement
- Volumes et persistance
- Orchestration

### 🏪 [Gestion Docker Hub](./hub-management)
Guide complet pour la gestion des images sur Docker Hub.

**Contenu :**
- Connexion et authentification
- Push/Pull des images
- Gestion des tags
- Automatisation CI/CD

### ⚙️ [Configuration Réseau Avancée](./network-config)
Configuration réseau avancée pour les environnements complexes.

**Contenu :**
- Réseaux personnalisés
- Proxy et load balancing
- Sécurité réseau
- Monitoring

## 🎯 Démarrage rapide

1. **Premiers pas** : Consultez les [commandes Docker](./commands)
2. **Images** : Apprenez la [gestion des images](./images)
3. **Docker Hub** : Suivez le [guide Docker Hub](./hub-management)
4. **Réseau** : Configurez le [réseau Docker](./network)

## 📊 Architecture Docker

```
🐳 Architecture Docker Laravel-Supabase
├── 🖥️ nginx (Reverse Proxy)
│   ├── Port 80/443
│   ├── SSL Termination
│   └── Static files
├── ⚙️ php-fpm (Backend)
│   ├── Laravel Application
│   ├── PHP 8.2
│   └── Extensions
├── 💾 redis (Cache)
│   ├── Sessions
│   ├── Cache applicatif
│   └── Queue jobs
├── 🔐 certbot (SSL)
│   ├── Let's Encrypt
│   ├── Auto-renewal
│   └── Certificate management
└── 🌐 Networks
    ├── laravel-production
    ├── laravel-development
    └── supabase-standalone
```

## 🚀 Services disponibles

| **Service** | **Production** | **Développement** | **Description** |
|---|---|---|---|
| **nginx** | ✅ Port 80/443 | ✅ Port 8080 | Reverse proxy |
| **php-fpm** | ✅ Optimisé | ✅ Debug activé | Backend Laravel |
| **redis** | ✅ Persistant | ✅ Cache local | Cache et sessions |
| **certbot** | ✅ SSL auto | ❌ Non requis | Certificats SSL |

## ⚡ Actions rapides

- **🏗️ Construire les images** → [Guide Images](./images)
- **🚀 Démarrer les services** → [Guide Compose](./compose)
- **🏪 Publier sur Docker Hub** → [Guide Hub](./hub-management)
- **🌐 Configurer le réseau** → [Guide Réseau](./network)
- **🔧 Commandes utiles** → [Guide Commandes](./commands) 