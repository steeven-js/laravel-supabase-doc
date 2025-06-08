# 🏭 Guide de déploiement production

Guide complet pour déployer l'application Laravel Supabase en production avec SSL/HTTPS.

## 🎯 Résultat final

- **🔗 Site sécurisé :** HTTPS avec certificats Let's Encrypt
- **⚡ Performance optimisée :** HTTP/2, gzip, cache
- **🛡️ Sécurité renforcée :** HSTS, CSP, rate limiting
- **🔄 Renouvellement automatique :** Certificats SSL

## 📋 Prérequis

- Serveur Linux avec Docker et Docker Compose
- Nom de domaine pointant vers le serveur
- Ports 80 et 443 ouverts
- Email valide pour Let's Encrypt

## 🚀 Déploiement étape par étape

### 1. 📥 Cloner le projet
```bash
git clone <repository-url>
cd laravel-supabase
```

### 2. 🔧 Configuration initiale
```bash
# Créer les répertoires pour les certificats
mkdir -p ./certbot/conf/live/
mkdir -p ./certbot/www/

# Configurer les permissions
chmod -R 755 ./certbot/
```

### 3. 🌐 Configurer le domaine
Modifiez les fichiers suivants avec votre domaine :

**`docker/production/nginx/nginx.conf`** :
```nginx
server_name VOTRE-DOMAINE.COM;
ssl_certificate /etc/letsencrypt/live/VOTRE-DOMAINE.COM/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/VOTRE-DOMAINE.COM/privkey.pem;
```

### 4. 🔐 Obtenir les certificats SSL
```bash
# Démarrer les services (nginx démarrera en HTTP temporairement)
docker-compose -f compose.prod.yaml up -d php-fpm redis

# Obtenir les certificats Let's Encrypt
docker-compose -f compose.prod.yaml run --rm --entrypoint="" certbot \
  certbot certonly --webroot -w /var/www/certbot \
  --email VOTRE-EMAIL@DOMAIN.COM -d VOTRE-DOMAINE.COM \
  --rsa-key-size 4096 --agree-tos --force-renewal
```

### 5. 🚀 Démarrer en production
```bash
# Démarrer tous les services
docker-compose -f compose.prod.yaml up -d --build

# Vérifier que tous les services sont en cours d'exécution
docker-compose -f compose.prod.yaml ps
```

### 6. ✅ Vérification
```bash
# Test HTTP → HTTPS redirection
curl -I http://VOTRE-DOMAINE.COM/

# Test HTTPS
curl -I https://VOTRE-DOMAINE.COM/

# Vérifier les certificats
docker-compose -f compose.prod.yaml run --rm --entrypoint="" certbot \
  certbot certificates
```

## 🏗️ Architecture production

### 🐳 Services Docker
- **nginx** : Reverse proxy avec SSL termination
- **php-fpm** : Backend Laravel optimisé
- **redis** : Cache et sessions
- **certbot** : Gestion des certificats SSL

### 📁 Structure des fichiers
```
laravel-supabase/
├── compose.prod.yaml              # Configuration Docker production
├── docker/production/
│   ├── nginx/
│   │   ├── nginx.conf            # Configuration nginx avec SSL
│   │   └── Dockerfile            # Image nginx personnalisée
│   └── php-fpm/
│       ├── entrypoint.sh         # Script de démarrage PHP-FPM
│       └── Dockerfile            # Image PHP-FPM optimisée
└── certbot/                      # Volume pour certificats SSL
    ├── conf/                     # Configuration certbot
    └── www/                      # Challenges Let's Encrypt
```

## 🔐 Configuration sécurité

### 🛡️ Headers de sécurité activés
- **HSTS** : Force HTTPS pendant 1 an
- **X-Frame-Options** : Protection contre clickjacking
- **X-Content-Type-Options** : Prévient MIME sniffing
- **X-XSS-Protection** : Protection XSS navigateur
- **Referrer-Policy** : Contrôle des informations referer

### 🚦 Rate limiting
- **Zone login** : 5 requêtes/minute sur `/login`, `/register`, `/password`

### 🔒 SSL/TLS
- **Protocoles** : TLSv1.2 et TLSv1.3 uniquement
- **Ciphers** : Suite cryptographique moderne et sécurisée
- **OCSP Stapling** : Vérification rapide des certificats

## 🔄 Maintenance

### 📋 Commandes utiles
```bash
# Voir les logs
docker-compose -f compose.prod.yaml logs -f

# Redémarrer un service
docker-compose -f compose.prod.yaml restart nginx

# Mettre à jour l'application
git pull
docker-compose -f compose.prod.yaml up -d --build

# Renouveler manuellement les certificats
docker-compose -f compose.prod.yaml run --rm --entrypoint="" certbot \
  certbot renew --force-renewal
```

### 🔍 Monitoring
```bash
# Health check nginx
curl https://VOTRE-DOMAINE.COM/health

# Status des certificats
docker-compose -f compose.prod.yaml run --rm --entrypoint="" certbot \
  certbot certificates

# Logs nginx
docker-compose -f compose.prod.yaml logs nginx

# Logs PHP-FPM
docker-compose -f compose.prod.yaml logs php-fpm
```

## 🚨 Dépannage

### ❌ Problèmes courants

**1. Certificats non trouvés**
```bash
# Vérifier que les certificats existent
docker-compose -f compose.prod.yaml run --rm --entrypoint="" certbot \
  ls -la /etc/letsencrypt/live/
```

**2. Erreur 502 Bad Gateway**
```bash
# Vérifier que PHP-FPM fonctionne
docker-compose -f compose.prod.yaml logs php-fpm
docker-compose -f compose.prod.yaml restart php-fpm
```

**3. Let's Encrypt challenges échouent**
```bash
# Vérifier que le domaine pointe vers le serveur
nslookup VOTRE-DOMAINE.COM

# Vérifier que le port 80 est accessible
curl -I http://VOTRE-DOMAINE.COM/.well-known/acme-challenge/test
```

## 📈 Optimisations

### ⚡ Performance
- **HTTP/2** activé
- **Gzip compression** pour les assets
- **Cache static** 1 an pour images/CSS/JS
- **FastCGI optimizations** pour PHP

### 🔧 Configuration PHP-FPM
- **Mode production** PHP
- **OPcache** activé
- **Health checks** configurés

## 🔄 Renouvellement automatique

Le service `certbot` inclus renouvelle automatiquement les certificats tous les 12h.

### 🕒 Vérification manuelle
```bash
# Forcer le renouvellement (test)
docker-compose -f compose.prod.yaml run --rm --entrypoint="" certbot \
  certbot renew --dry-run

# Renouvellement réel
docker-compose -f compose.prod.yaml run --rm --entrypoint="" certbot \
  certbot renew --force-renewal
```

## 🗄️ Configuration Supabase en Production

### 1. Variables d'environnement
```env
# Configuration Supabase Production
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-clé-anon
SUPABASE_JWT_SECRET=votre-jwt-secret

# Configuration Base de données
DB_CONNECTION=pgsql
DB_HOST=votre-projet.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre-mot-de-passe
```

### 2. Migration des données
```bash
# Vérifier la connexion à la base de données
php artisan db:monitor

# Exécuter les migrations
php artisan migrate --force

# Vérifier le statut des migrations
php artisan migrate:status
```

### 3. Configuration du réseau
```yaml
# compose.prod.yaml
services:
  php-fpm:
    networks:
      - laravel-production
      - supabase-standalone_default
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
      - SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}

networks:
  laravel-production:
  supabase-standalone_default:
    external: true
```

### 4. Vérification de la connexion
```bash
# Tester la connexion Supabase
php artisan supabase:test-connection

# Vérifier les logs de connexion
docker-compose -f compose.prod.yaml logs php-fpm | grep "Supabase"
```

### 5. Sécurité Supabase
- ✅ Utiliser des clés d'API sécurisées
- ✅ Activer l'authentification JWT
- ✅ Configurer les politiques RLS
- ✅ Limiter les accès IP si nécessaire

### 6. Monitoring Supabase
```bash
# Vérifier les requêtes actives
php artisan supabase:monitor

# Vérifier les erreurs de connexion
docker-compose -f compose.prod.yaml logs php-fpm | grep "Error"
```

## 🗄️ Déploiement Supabase en Production

### 1. Configuration du Projet Supabase

#### Création du Projet
1. Aller sur [app.supabase.com](https://app.supabase.com)
2. Cliquer sur "New Project"
3. Remplir les informations :
   - Nom du projet
   - Mot de passe de la base de données
   - Région (choisir la plus proche de vos utilisateurs)
   - Plan (Free tier pour commencer)

#### Configuration des Variables d'Environnement
```env
# .env.production
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-clé-anon
SUPABASE_JWT_SECRET=votre-jwt-secret

# Configuration Base de données
DB_CONNECTION=pgsql
DB_HOST=votre-projet.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre-mot-de-passe
```

### 2. Sécurité Supabase

#### Configuration des RLS (Row Level Security)
```sql
-- Exemple de politique RLS pour la table users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs peuvent voir leurs propres données"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres données"
ON users FOR UPDATE
USING (auth.uid() = id);
```

#### Configuration des API Keys
1. Aller dans Project Settings > API
2. Copier les clés :
   - `anon` key (publique)
   - `service_role` key (privée)
3. Configurer les restrictions :
   - Limiter les domaines autorisés
   - Activer la protection JWT
   - Configurer les limites de taux

### 3. Migration des Données

#### Préparation
```bash
# Sauvegarder la base de développement
pg_dump postgresql://postgres:postgres@localhost:5432/postgres > dev_backup.sql

# Vérifier la sauvegarde
head -n 20 dev_backup.sql
```

#### Import en Production
```bash
# Importer les données
psql postgresql://postgres:votre-mot-de-passe@votre-projet.supabase.co:5432/postgres < dev_backup.sql

# Vérifier l'import
psql postgresql://postgres:votre-mot-de-passe@votre-projet.supabase.co:5432/postgres -c "\dt"
```

### 4. Configuration du Réseau

#### Configuration Docker
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

#### Configuration Nginx
```nginx
# Configuration pour Supabase
location /supabase/ {
    proxy_pass https://votre-projet.supabase.co/;
    proxy_set_header Host votre-projet.supabase.co;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 5. Monitoring et Maintenance

#### Dashboard Supabase
- **Logs**: `https://votre-projet.supabase.co/project/default/logs`
- **Métriques**: `https://votre-projet.supabase.co/project/default/metrics`
- **Base de données**: `https://votre-projet.supabase.co/project/default/editor`

#### Commandes de Vérification
```bash
# Tester la connexion API
curl https://votre-projet.supabase.co/rest/v1/

# Vérifier la base de données
psql postgresql://postgres:votre-mot-de-passe@votre-projet.supabase.co:5432/postgres -c "\l"

# Vérifier les migrations
php artisan migrate:status
```

### 6. Sauvegarde et Restauration

#### Sauvegarde Automatique
```bash
# Script de sauvegarde quotidienne
#!/bin/bash
BACKUP_DIR="/var/backups/supabase"
DATE=$(date +%Y%m%d)
pg_dump postgresql://postgres:votre-mot-de-passe@votre-projet.supabase.co:5432/postgres > "$BACKUP_DIR/backup_$DATE.sql"
```

#### Restauration
```bash
# Restaurer une sauvegarde
psql postgresql://postgres:votre-mot-de-passe@votre-projet.supabase.co:5432/postgres < backup_20240315.sql
```

### 7. Optimisation des Performances

#### Configuration de la Base de Données
```sql
-- Optimisation des index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- Configuration des paramètres
ALTER SYSTEM SET max_connections = '100';
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '768MB';
```

#### Configuration du Cache
```php
// config/cache.php
'supabase' => [
    'driver' => 'redis',
    'connection' => 'supabase',
    'ttl' => 3600,
],
```

### 8. Dépannage

#### Problèmes Courants

1. **Erreur de Connexion**
```bash
# Vérifier les logs
docker-compose -f compose.prod.yaml logs php-fpm | grep "Supabase"

# Tester la connexion
curl -v https://votre-projet.supabase.co/rest/v1/
```

2. **Erreurs de Migration**
```bash
# Vérifier les migrations
php artisan migrate:status

# Forcer la migration
php artisan migrate --force
```

3. **Problèmes de Performance**
```bash
# Vérifier les requêtes lentes
psql postgresql://postgres:votre-mot-de-passe@votre-projet.supabase.co:5432/postgres -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"
```

## 📊 Architecture Production avec Supabase

```
┌─────────────────────────────────────────────────────────┐
│                    Production Stack                      │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │    Nginx     │    │   PHP-FPM    │    │  Redis   │  │
│  │  (SSL/443)   │◄───┤              │◄───┤          │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────┘  │
│         │                   │                           │
│  ┌──────▼───────┐    ┌──────▼───────┐    ┌──────────┐  │
│  │   Certbot    │    │   Laravel    │    │ Supabase │  │
│  │  (Auto-Renew)│    │  Storage     │◄───┤  Cloud   │  │
│  └──────────────┘    └──────────────┘    └──────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
``` 