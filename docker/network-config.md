# Configuration Réseau Docker : Laravel ↔ Supabase

Ce document explique la configuration réseau spéciale nécessaire pour connecter Laravel à Supabase local via Docker.

## 🚨 Problème initial

Quand on lance Laravel et Supabase dans des conteneurs Docker séparés, ils ne peuvent pas communiquer car :

1. **Réseaux isolés** : Chaque `docker-compose` crée son propre réseau
2. **Résolution DNS** : `localhost` et `host.docker.internal` ne fonctionnent pas entre conteneurs différents
3. **Ports inaccessibles** : Les ports internes ne sont pas exposés entre réseaux

## 🔍 Découverte de la solution

### Étape 1 : Identifier le réseau Supabase

```bash
# Lister tous les réseaux Docker
docker network ls

# Résultat montrant le réseau Supabase
NETWORK ID     NAME                                    DRIVER    SCOPE
1111c1d6ccfe   supabase_default                        bridge    local
1f3c6a09f9c2   laravel-supabase-app_laravel-development   bridge    local
```

### Étape 2 : Identifier les conteneurs Supabase

```bash
# Lister les conteneurs Supabase actifs
docker ps --filter "name=supabase" --format "table {{.Names}}\t{{.Ports}}"

# Résultat montrant les services essentiels
NAMES               PORTS
supabase-db         5432/tcp
supabase-kong       0.0.0.0:8000->8000/tcp
supabase-studio     3000/tcp
```

### Étape 3 : Test de connectivité

```bash
# ❌ Échec - Laravel ne peut pas résoudre localhost
DB_HOST=localhost
# Erreur: connection to server at "localhost", port 5432 failed

# ❌ Échec - host.docker.internal ne fonctionne pas entre conteneurs
DB_HOST=host.docker.internal  
# Erreur: Tenant or user not found

# ✅ Succès - Utilisation du nom du conteneur
DB_HOST=supabase-db
# Connexion réussie !
```

## 🛠️ Configuration finale

### 1. Modification du `compose.dev.yaml`

```yaml
networks:
  laravel-development:        # Réseau interne Laravel
  supabase_default:          # Réseau externe Supabase
    external: true           # ← CLÉS : Utilise le réseau existant

services:
  web:
    # ... autres configs ...
    networks:
      - laravel-development  # Pour la communication interne
      - supabase_default     # Pour accéder à Supabase
  
  php-fpm:
    # ... autres configs ...
    networks:
      - laravel-development
      - supabase_default     # ← ESSENTIEL pour la DB
  
  workspace:
    # ... autres configs ...
    networks:
      - laravel-development
      - supabase_default     # ← ESSENTIEL pour les commandes artisan
```

### 2. Configuration `.env`

```env
# ✅ Utilisation des noms de conteneurs Supabase
DB_HOST=supabase-db          # Nom du conteneur PostgreSQL
SUPABASE_URL=http://supabase-kong:8000  # Nom du conteneur API Gateway
```

## 🔬 Diagnostic et dépannage

### Vérifier la connectivité réseau

```bash
# Test ping depuis Laravel vers Supabase
docker-compose -f compose.dev.yaml exec workspace ping supabase-db

# Test de résolution DNS
docker-compose -f compose.dev.yaml exec workspace nslookup supabase-db

# Vérifier les réseaux d'un conteneur
docker inspect laravel-supabase-app-workspace-1 | grep NetworkMode
```

### Vérifier les logs de connexion

```bash
# Logs Laravel
docker-compose -f compose.dev.yaml logs php-fpm

# Logs Supabase DB
docker logs supabase-db

# Logs réseau détaillés
docker-compose -f compose.dev.yaml logs --tail=50
```

## 📊 Schéma de l'architecture réseau

```
┌─────────────────────┐    ┌─────────────────────┐
│  Réseau Laravel     │    │  Réseau Supabase    │
│  laravel-development│    │  supabase_default   │
│                     │    │                     │
│  ┌──────────────┐   │    │  ┌──────────────┐   │
│  │   nginx      │   │    │  │ supabase-db  │   │
│  │   php-fpm    │   │◄───┼──┤ supabase-kong│   │
│  │   workspace  │   │    │  │ supabase-*   │   │
│  └──────────────┘   │    │  └──────────────┘   │
└─────────────────────┘    └─────────────────────┘
         │                           ▲
         └───────────────────────────┘
              Communication via
           noms de conteneurs
```

## ⚠️ Points importants

1. **Ordre de démarrage** : Supabase doit être démarré AVANT Laravel
2. **Réseau externe** : `external: true` est crucial
3. **Noms de conteneurs** : Utiliser les noms exacts (supabase-db, supabase-kong)
4. **Ports internes** : Utiliser les ports internes (5432, 8000) pas les ports exposés
5. **Configuration locale uniquement** : Cette config ne fonctionne qu'avec Supabase local

## 🎯 Résultat final

Avec cette configuration :
- ✅ Laravel peut se connecter à la DB Supabase
- ✅ Laravel peut utiliser l'API Supabase
- ✅ Les migrations fonctionnent
- ✅ Artisan Tinker peut accéder aux tables
- ✅ Communication bidirectionnelle parfaite

## 🔄 Pour reproduire sur un autre projet

1. Copier la section `networks` du `compose.dev.yaml`
2. Ajouter `supabase_default` à tous les services nécessaires
3. Utiliser les noms de conteneurs dans `.env`
4. Tester avec `php artisan migrate:status`

Cette configuration transforme deux stacks Docker isolées en une architecture intégrée ! 🚀 

## 🔒 Configuration SSL/HTTPS avec Certbot

### 1. Configuration dans `compose.prod.yaml`

```yaml
services:
  web:
    volumes:
      - certbot-etc:/etc/letsencrypt:ro
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/certbot
    ports:
      - "80:80"
      - "443:443"

  certbot:
    image: certbot/certbot
    restart: unless-stopped
    volumes:
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  certbot-etc:
  certbot-var:
  web-root:
```

### 2. Configuration Nginx pour SSL

```nginx
server {
    listen 443 ssl;
    server_name votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    # Configuration SSL recommandée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

### 3. Renouvellement automatique des certificats

Le service Certbot est configuré pour :
- ✅ Vérifier le renouvellement toutes les 12 heures
- ✅ Renouveler automatiquement les certificats expirant dans moins de 30 jours
- ✅ Redémarrer automatiquement en cas d'échec

## 🚀 Déploiement en Production

### 1. Préparation

```bash
# Créer les volumes nécessaires
docker volume create certbot-etc
docker volume create certbot-var
docker volume create web-root

# Obtenir le certificat initial
docker-compose -f compose.prod.yaml run --rm certbot certonly --webroot -w /var/www/certbot -d votre-domaine.com
```

### 2. Démarrage des services

```bash
# Démarrer l'infrastructure
docker-compose -f compose.prod.yaml up -d

# Vérifier les logs
docker-compose -f compose.prod.yaml logs -f
```

### 3. Vérification de la sécurité

```bash
# Tester la configuration SSL
curl -vI https://votre-domaine.com

# Vérifier le statut des certificats
docker-compose -f compose.prod.yaml exec certbot certbot certificates
```

## 📊 Architecture de Production

```
┌─────────────────────────────────────────────────────────┐
│                    Production Stack                      │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │    Nginx     │    │   PHP-FPM    │    │  Redis   │  │
│  │  (SSL/443)   │◄───┤              │◄───┤          │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────┘  │
│         │                   │                           │
│  ┌──────▼───────┐    ┌──────▼───────┐                  │
│  │   Certbot    │    │   Laravel    │                  │
│  │  (Auto-Renew)│    │  Storage     │                  │
│  └──────────────┘    └──────────────┘                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🗄️ Configuration Supabase par Environnement

### 1. Environnement de Développement

```env
# .env.development
SUPABASE_URL=http://localhost:8000
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long

# Configuration Base de données
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

### 2. Environnement de Production

```env
# .env.production
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-clé-anon-de-production
SUPABASE_JWT_SECRET=votre-jwt-secret-de-production

# Configuration Base de données
DB_CONNECTION=pgsql
DB_HOST=votre-projet.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre-mot-de-passe-de-production
```

### 3. URLs Supabase par Environnement

#### Développement Local
- **URL API**: `http://localhost:8000`
- **URL Studio**: `http://localhost:3000`
- **URL Base de données**: `postgresql://postgres:postgres@localhost:5432/postgres`

#### Production
- **URL API**: `https://votre-projet.supabase.co`
- **URL Studio**: `https://votre-projet.supabase.co/project/default`
- **URL Base de données**: `postgresql://postgres:votre-mot-de-passe@votre-projet.supabase.co:5432/postgres`

### 4. Configuration des Réseaux Docker

#### Développement
```yaml
# compose.dev.yaml
services:
  php-fpm:
    networks:
      - laravel-development
      - supabase_default
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
      - SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}

networks:
  laravel-development:
  supabase_default:
    external: true
```

#### Production
```yaml
# compose.prod.yaml
services:
  php-fpm:
    networks:
      - laravel-production
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
      - SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}

networks:
  laravel-production:
```

### 5. Vérification de la Connexion

#### Développement
```bash
# Tester la connexion à Supabase local
curl http://localhost:8000/rest/v1/

# Vérifier la connexion à la base de données
psql postgresql://postgres:postgres@localhost:5432/postgres -c "\l"
```

#### Production
```bash
# Tester la connexion à Supabase Cloud
curl https://votre-projet.supabase.co/rest/v1/

# Vérifier la connexion à la base de données
psql postgresql://postgres:votre-mot-de-passe@votre-projet.supabase.co:5432/postgres -c "\l"
```

### 6. Gestion des Clés et Secrets

#### Développement
- Les clés de développement sont stockées dans `.env.development`
- Ne jamais commiter ce fichier dans Git
- Utiliser des valeurs par défaut pour le développement local

#### Production
- Les clés de production sont stockées dans `.env.production`
- Utiliser des secrets sécurisés
- Activer la rotation des clés régulièrement
- Limiter les accès IP si possible

### 7. Migration des Données

#### Développement vers Production
```bash
# Exporter les données de développement
pg_dump postgresql://postgres:postgres@localhost:5432/postgres > dev_backup.sql

# Importer en production
psql postgresql://postgres:votre-mot-de-passe@votre-projet.supabase.co:5432/postgres < dev_backup.sql
```

### 8. Monitoring et Logs

#### Développement
```bash
# Logs Supabase local
docker-compose logs supabase-db
docker-compose logs supabase-kong

# Vérifier les requêtes
docker-compose exec supabase-db psql -U postgres -c "SELECT * FROM pg_stat_activity;"
```

#### Production
```bash
# Logs via Dashboard Supabase
https://votre-projet.supabase.co/project/default/logs

# Métriques via Dashboard
https://votre-projet.supabase.co/project/default/metrics
```
