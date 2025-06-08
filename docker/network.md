# 🌐 Réseau Docker

Guide complet pour la configuration et gestion des réseaux Docker dans le projet Laravel-Supabase.

## 📋 Vue d'ensemble

La configuration réseau Docker permet la communication entre conteneurs, l'isolation des environnements et la connexion avec des services externes comme Supabase.

### 🏗️ Architecture réseau

```
🌐 Architecture Réseau Docker
├── 🔗 laravel-development (Bridge)
│   ├── nginx:8080
│   ├── php-fpm:9000
│   ├── workspace:5173
│   └── redis:6379
├── 🔗 laravel-production (Bridge)
│   ├── nginx:80,443
│   ├── php-fpm:9000
│   ├── redis:6379
│   └── certbot
├── 🔗 supabase-dev_default (External)
│   ├── kong:8000
│   ├── postgres:5432
│   ├── gotrue
│   └── storage
└── 🔗 supabase-standalone_default (External)
    ├── kong:8000
    ├── postgres:5432
    └── services production
```

---

## 🔧 Configuration des réseaux

### Réseaux par environnement

| Réseau | Type | Usage | Services connectés |
|--------|------|-------|-------------------|
| `laravel-development` | Bridge interne | Développement | nginx, php-fpm, workspace, redis |
| `laravel-production` | Bridge interne | Production | nginx, php-fpm, redis, certbot |
| `supabase-dev_default` | External | DB développement | Services Supabase dev |
| `supabase-standalone_default` | External | DB production | Services Supabase prod |

### Création des réseaux

```bash
# Créer le réseau de développement
docker network create laravel-development

# Créer le réseau de production
docker network create laravel-production

# Lister les réseaux existants
docker network ls

# Inspecter un réseau
docker network inspect laravel-development
```

---

## 🚀 Communication inter-conteneurs

### Résolution DNS automatique

Docker fournit une résolution DNS automatique par nom de service :

```yaml
# Dans compose.dev.yaml
services:
  web:
    image: nginx:latest
    networks:
      - laravel-development
  
  php-fpm:
    build: ./docker/common/php-fpm/Dockerfile
    networks:
      - laravel-development

# nginx peut contacter php-fpm via : http://php-fpm:9000
```

### Configuration Nginx

```nginx
# docker/development/nginx/nginx.conf
server {
    listen 80;
    root /var/www/public;
    
    location ~ \.php$ {
        # Communication par nom de service Docker
        fastcgi_pass php-fpm:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### Communication Laravel vers Supabase

```php
// Configuration Laravel (.env)
SUPABASE_URL=http://kong:8000  // En développement via réseau Docker
SUPABASE_URL=https://your-project.supabase.co  // En production externe
```

---

## 🔗 Réseaux externes et bridge

### Connexion aux réseaux Supabase

```yaml
# compose.dev.yaml
networks:
  laravel-development:
    driver: bridge
  
  # Connexion au réseau Supabase externe
  supabase-dev_default:
    external: true
```

### Vérification des réseaux externes

```bash
# Vérifier si le réseau Supabase existe
docker network ls | grep supabase

# Si le réseau n'existe pas, le créer
docker network create supabase-dev_default

# Ou démarrer Supabase d'abord
cd ../supabase-project-dev
docker compose up -d
```

---

## 🔒 Isolation et sécurité réseau

### Isolation des environnements

```yaml
# Les réseaux séparés empêchent les communications non autorisées
services:
  # Service développement - réseau dev uniquement
  app-dev:
    networks:
      - laravel-development
  
  # Service production - réseau prod uniquement  
  app-prod:
    networks:
      - laravel-production
```

### Restrictions d'accès

```yaml
# Limiter l'exposition des ports
services:
  redis:
    ports: []  # Pas d'exposition externe
    networks:
      - laravel-development
  
  nginx:
    ports:
      - "8080:80"  # Exposition uniquement du port nécessaire
    networks:
      - laravel-development
```

---

## 🌍 Exposition des ports

### Mapping des ports

| Service | Port interne | Port externe | Environnement |
|---------|--------------|--------------|---------------|
| nginx | 80 | 8080 | Développement |
| nginx | 80, 443 | 80, 443 | Production |
| php-fpm | 9000 | - | Interne uniquement |
| workspace | 5173 | 5173 | Développement (Vite) |
| redis | 6379 | - | Interne uniquement |

### Configuration des ports

```yaml
services:
  web:
    ports:
      - "8080:80"           # HTTP développement
      - "5173:5173"         # Vite Hot Reload
    networks:
      - laravel-development

  php-fpm:
    # Pas d'exposition externe, communication interne uniquement
    expose:
      - "9000"
    networks:
      - laravel-development
```

---

## 🔍 Debugging réseau

### Inspection des réseaux

```bash
# Voir les conteneurs connectés à un réseau
docker network inspect laravel-development

# Voir les réseaux d'un conteneur
docker inspect container_name | grep NetworkMode

# Tester la connectivité
docker exec -it php-fpm ping nginx
docker exec -it php-fpm curl http://nginx
```

### Outils de diagnostic

```bash
# Installer des outils réseau dans un conteneur
docker exec -it php-fpm apt-get update && apt-get install -y iputils-ping curl telnet

# Tester une connexion spécifique
docker exec -it php-fpm telnet redis 6379
docker exec -it php-fpm curl http://kong:8000/health

# Vérifier les routes réseau
docker exec -it php-fpm ip route
```

### Container de debug réseau

```yaml
# Ajouter un conteneur de debug temporaire
services:
  netshoot:
    image: nicolaka/netshoot
    command: sleep infinity
    networks:
      - laravel-development
      - supabase-dev_default
```

```bash
# Utiliser netshoot pour diagnostiquer
docker exec -it netshoot-container bash
# Puis dans le conteneur :
nslookup php-fpm
ping kong
curl http://kong:8000
```

---

## ⚙️ Configuration avancée

### Réseaux personnalisés avec IPAM

```yaml
networks:
  laravel-custom:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
          gateway: 172.20.0.1
```

### Alias réseau

```yaml
services:
  database:
    image: postgres:15
    networks:
      laravel-development:
        aliases:
          - db
          - postgres
          - database
```

### Variables d'environnement réseau

```yaml
services:
  app:
    environment:
      - DB_HOST=database
      - REDIS_HOST=redis
      - SUPABASE_URL=http://kong:8000
    networks:
      - laravel-development
      - supabase-dev_default
```

---

## 🚀 Optimisations performance

### MTU et configuration réseau

```yaml
networks:
  laravel-development:
    driver: bridge
    driver_opts:
      com.docker.network.driver.mtu: 1450
```

### DNS personnalisé

```yaml
services:
  app:
    dns:
      - 8.8.8.8
      - 1.1.1.1
    networks:
      - laravel-development
```

---

## 🔄 Workflows réseau

### Séquence de démarrage

```bash
# 1. Vérifier les réseaux existants
docker network ls

# 2. Démarrer Supabase (crée son réseau)
cd ../supabase-project-dev
docker compose up -d

# 3. Vérifier la création du réseau Supabase
docker network ls | grep supabase

# 4. Démarrer Laravel (utilise le réseau Supabase)
cd ../laravel-supabase
docker compose -f compose.dev.yaml up -d

# 5. Vérifier la connectivité
docker compose -f compose.dev.yaml exec php-fpm curl http://kong:8000
```

### Test de connectivité automatisé

```bash
#!/bin/bash
# scripts/test-network.sh

echo "🔍 Test de connectivité réseau..."

# Test connexion interne Laravel
echo "Testing nginx -> php-fpm..."
docker compose -f compose.dev.yaml exec nginx curl -f http://php-fpm:9000/ping || echo "❌ php-fpm unreachable"

# Test connexion Redis
echo "Testing php-fpm -> redis..."
docker compose -f compose.dev.yaml exec php-fpm redis-cli -h redis ping || echo "❌ redis unreachable"

# Test connexion Supabase
echo "Testing php-fpm -> supabase..."
docker compose -f compose.dev.yaml exec php-fpm curl -f http://kong:8000/health || echo "❌ supabase unreachable"

echo "✅ Tests terminés"
```

---

## 🚨 Problèmes courants

### Résolution de problèmes

| Problème | Symptôme | Solution |
|----------|----------|----------|
| **Réseau externe non trouvé** | `network not found` | Démarrer Supabase d'abord |
| **Service non accessible** | Connection refused | Vérifier les réseaux du service |
| **Port déjà utilisé** | Port binding failed | Changer le port ou arrêter le service |
| **DNS ne résout pas** | Name resolution failed | Vérifier les alias réseau |

### Commandes de dépannage

```bash
# Recréer les réseaux
docker network rm laravel-development
docker network create laravel-development

# Redémarrer avec nouvelles configurations réseau
docker compose down
docker compose up -d --force-recreate

# Nettoyer les réseaux orphelins
docker network prune
```

---

## 📊 Monitoring réseau

### Métriques réseau

```bash
# Statistiques réseau des conteneurs
docker stats --format "table {{.Container}}\t{{.NetIO}}"

# Traffic réseau détaillé
docker exec -it container_name iftop
docker exec -it container_name nethogs
```

### Logs réseau

```bash
# Logs de connexion nginx
docker compose logs nginx | grep -E "(upstream|proxy)"

# Logs de connexion php-fpm
docker compose logs php-fpm | grep -E "(connect|connection)"
```

---

## 📚 Ressources utiles

- [Docker Networking](https://docs.docker.com/network/)
- [Compose Networking](https://docs.docker.com/compose/networking/)
- [Network Troubleshooting](https://docs.docker.com/network/troubleshooting/)
- [Bridge Network Driver](https://docs.docker.com/network/bridge/)

---

*Cette documentation couvre la configuration complète des réseaux Docker pour assurer une communication optimale et sécurisée entre tous les services du projet Laravel-Supabase.* 