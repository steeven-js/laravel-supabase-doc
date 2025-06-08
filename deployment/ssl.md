# 🔒 SSL/HTTPS Configuration

Guide complet pour configurer SSL/HTTPS avec Let's Encrypt dans votre environnement Laravel-Supabase de production.

## 📋 Vue d'ensemble

La sécurisation avec SSL/HTTPS est essentielle pour protéger les données en transit et garantir la confiance des utilisateurs.

### 🎯 Objectifs

- **Configurer SSL/TLS** avec Let's Encrypt
- **Automatiser le renouvellement** des certificats
- **Optimiser la sécurité** avec les bonnes pratiques
- **Gérer les redirections** HTTP vers HTTPS
- **Configurer HSTS** et autres headers de sécurité

---

## 🚀 Configuration Let's Encrypt

### Service Certbot

```yaml
# compose.prod.yaml - Service Certbot
services:
  certbot:
    image: certbot/certbot:latest
    container_name: laravel-supabase-certbot
    restart: unless-stopped
    volumes:
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/certbot
    environment:
      - CERTBOT_EMAIL=${CERTBOT_EMAIL}
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

  web:
    build:
      context: .
      dockerfile: docker/production/nginx/Dockerfile
    container_name: laravel-supabase-web
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/var/www
      - certbot-etc:/etc/letsencrypt:ro
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/certbot
    environment:
      - DOMAIN=${DOMAIN}
      - CERTBOT_EMAIL=${CERTBOT_EMAIL}
    depends_on:
      - php-fpm
      - certbot

volumes:
  certbot-etc:
    driver: local
  certbot-var:
    driver: local
  web-root:
    driver: local
```

### Variables d'environnement

```env
# .env - Configuration SSL
DOMAIN=yourdomain.com
CERTBOT_EMAIL=admin@yourdomain.com
SSL_RENEWAL_INTERVAL=12h

# Configuration avancée
SSL_PROTOCOLS=TLSv1.2 TLSv1.3
SSL_CIPHERS=ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384
SSL_PREFER_SERVER_CIPHERS=off
SSL_SESSION_CACHE=shared:le_nginx_SSL:10m
SSL_SESSION_TIMEOUT=1440m
SSL_SESSION_TICKETS=off

# HSTS (HTTP Strict Transport Security)
HSTS_MAX_AGE=31536000
HSTS_INCLUDE_SUBDOMAINS=true
HSTS_PRELOAD=true
```

---

## 🌐 Configuration Nginx SSL

### Configuration SSL principale

```nginx
# docker/production/nginx/nginx.conf
events {
    worker_connections 2048;
    use epoll;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 30;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=10r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:le_nginx_SSL:10m;
    ssl_session_timeout 1440m;
    ssl_session_tickets off;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';" always;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name ${DOMAIN} www.${DOMAIN};
        server_tokens off;

        # Let's Encrypt validation
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # Redirect all other traffic to HTTPS
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name ${DOMAIN} www.${DOMAIN};
        server_tokens off;
        root /var/www/public;
        index index.php index.html;

        # SSL Certificates
        ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/${DOMAIN}/chain.pem;

        # OCSP Stapling
        ssl_stapling on;
        ssl_stapling_verify on;
        resolver 8.8.8.8 8.8.4.4 valid=300s;
        resolver_timeout 5s;

        # Rate limiting for sensitive endpoints
        location /login {
            limit_req zone=login burst=5 nodelay;
            try_files $uri $uri/ /index.php?$query_string;
        }

        location /api/ {
            limit_req zone=api burst=20 nodelay;
            try_files $uri $uri/ /index.php?$query_string;
        }

        # Static files with long cache
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary "Accept-Encoding";
            access_log off;
        }

        # PHP handling
        location ~ \.php$ {
            try_files $uri =404;
            fastcgi_split_path_info ^(.+\.php)(/.+)$;
            fastcgi_pass php-fpm:9000;
            fastcgi_index index.php;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_param PATH_INFO $fastcgi_path_info;
            fastcgi_param HTTPS on;
            fastcgi_param HTTP_SCHEME https;
            
            # Security
            fastcgi_param HTTP_PROXY "";
            fastcgi_read_timeout 300;
            fastcgi_buffer_size 128k;
            fastcgi_buffers 4 256k;
            fastcgi_busy_buffers_size 256k;
        }

        # Deny access to hidden files
        location ~ /\. {
            deny all;
        }

        # Laravel specific
        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        # Security txt
        location = /.well-known/security.txt {
            return 301 https://$host/security.txt;
        }
    }
}
```

---

## 🔐 Script d'initialisation SSL

### Script initial d'obtention de certificats

```bash
#!/bin/bash
# scripts/init-ssl.sh

set -e

# Variables
DOMAIN=${DOMAIN:-"yourdomain.com"}
CERTBOT_EMAIL=${CERTBOT_EMAIL:-"admin@yourdomain.com"}
DATA_PATH="./data/certbot"
NGINX_CONF="./docker/production/nginx/nginx.conf"

echo "🔒 Initialisation SSL pour $DOMAIN..."

# Vérifier les prérequis
if [ -z "$DOMAIN" ] || [ -z "$CERTBOT_EMAIL" ]; then
    echo "❌ Variables DOMAIN et CERTBOT_EMAIL requises"
    exit 1
fi

# Créer les dossiers nécessaires
mkdir -p "$DATA_PATH"/{conf,www}
mkdir -p "$DATA_PATH/conf/live/$DOMAIN"

# Vérifier si les certificats existent déjà
if [ -d "$DATA_PATH/conf/live/$DOMAIN" ]; then
    echo "🔍 Certificats existants trouvés"
    read -p "Remplacer les certificats existants ? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "⏭️  Utilisation des certificats existants"
        exit 0
    fi
fi

# Télécharger les paramètres SSL recommandés
echo "📥 Téléchargement des paramètres SSL..."
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$DATA_PATH/conf/options-ssl-nginx.conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$DATA_PATH/conf/ssl-dhparams.pem"

# Créer un certificat factice pour nginx
echo "🔧 Création d'un certificat temporaire..."
docker compose run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:4096 -days 1\
    -keyout '/etc/letsencrypt/live/$DOMAIN/privkey.pem' \
    -out '/etc/letsencrypt/live/$DOMAIN/fullchain.pem' \
    -subj '/CN=localhost'" certbot

# Démarrer nginx avec le certificat temporaire
echo "🚀 Démarrage de nginx..."
docker compose up --force-recreate -d web

# Supprimer le certificat temporaire
echo "🗑️  Suppression du certificat temporaire..."
docker compose run --rm --entrypoint "\
    rm -Rf /etc/letsencrypt/live/$DOMAIN && \
    rm -Rf /etc/letsencrypt/archive/$DOMAIN && \
    rm -Rf /etc/letsencrypt/renewal/$DOMAIN.conf" certbot

# Obtenir le vrai certificat
echo "🏆 Obtention du certificat Let's Encrypt..."
docker compose run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
    --email $CERTBOT_EMAIL \
    -d $DOMAIN \
    -d www.$DOMAIN \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot

# Recharger nginx
echo "🔄 Rechargement de nginx..."
docker compose exec web nginx -s reload

echo "✅ SSL configuré avec succès pour $DOMAIN !"
echo "🌐 Site accessible sur : https://$DOMAIN"
```

---

## 🔄 Script de renouvellement automatique

### Cron pour renouvellement

```bash
#!/bin/bash
# scripts/renew-ssl.sh

set -e

DOMAIN=${DOMAIN:-"yourdomain.com"}
COMPOSE_FILE="compose.prod.yaml"

echo "🔄 Vérification du renouvellement SSL..."

# Vérifier et renouveler les certificats
if docker compose -f $COMPOSE_FILE run --rm certbot renew --quiet; then
    echo "✅ Certificats vérifiés/renouvelés"
    
    # Recharger nginx seulement si nécessaire
    if docker compose -f $COMPOSE_FILE exec web nginx -t; then
        docker compose -f $COMPOSE_FILE exec web nginx -s reload
        echo "🔄 Nginx rechargé"
    else
        echo "❌ Erreur de configuration nginx"
        exit 1
    fi
else
    echo "❌ Erreur lors du renouvellement"
    exit 1
fi

# Nettoyage des anciens certificats
docker compose -f $COMPOSE_FILE run --rm certbot certificates

echo "✅ Renouvellement terminé"
```

### Configuration crontab

```bash
# Ajouter au crontab du serveur
# Exécute le renouvellement tous les jours à 2h du matin
0 2 * * * /path/to/laravel-supabase/scripts/renew-ssl.sh >> /var/log/ssl-renewal.log 2>&1

# Vérification hebdomadaire des certificats
0 1 * * 0 /path/to/laravel-supabase/scripts/check-ssl.sh >> /var/log/ssl-check.log 2>&1
```

---

## 🛡️ Configuration sécurité avancée

### Headers de sécurité Laravel

```php
// app/Http/Middleware/SecurityHeaders.php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // HSTS
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // Prevent clickjacking
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // XSS Protection
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Content Security Policy
        $csp = "default-src 'self'; " .
               "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " .
               "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " .
               "font-src 'self' https://fonts.gstatic.com; " .
               "img-src 'self' data: https:; " .
               "connect-src 'self' " . config('supabase.url') . "; " .
               "frame-ancestors 'self';";
        
        $response->headers->set('Content-Security-Policy', $csp);

        // Permissions Policy
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return $response;
    }
}
```

### Enregistrement du middleware

```php
// bootstrap/app.php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\SecurityHeaders::class,
        ]);
    })
    ->create();
```

---

## 🔍 Monitoring SSL

### Script de vérification SSL

```bash
#!/bin/bash
# scripts/check-ssl.sh

DOMAIN=${DOMAIN:-"yourdomain.com"}
ALERT_DAYS=30

echo "🔍 Vérification SSL pour $DOMAIN..."

# Vérifier l'expiration du certificat
EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_TIMESTAMP=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_TIMESTAMP - $CURRENT_TIMESTAMP) / 86400 ))

echo "📅 Certificat expire le : $EXPIRY_DATE"
echo "⏰ Jours restants : $DAYS_UNTIL_EXPIRY"

# Alertes
if [ $DAYS_UNTIL_EXPIRY -lt $ALERT_DAYS ]; then
    echo "⚠️  ALERTE : Certificat expire dans $DAYS_UNTIL_EXPIRY jours !"
    
    # Envoyer une notification (optionnel)
    if command -v mail >/dev/null 2>&1; then
        echo "Certificat SSL pour $DOMAIN expire dans $DAYS_UNTIL_EXPIRY jours" | \
        mail -s "⚠️ Expiration SSL $DOMAIN" $CERTBOT_EMAIL
    fi
    
    exit 1
else
    echo "✅ Certificat valide"
fi

# Vérifier la configuration SSL
echo "🔧 Test de la configuration SSL..."
SSL_GRADE=$(curl -s "https://api.ssllabs.com/api/v3/analyze?host=$DOMAIN&publish=off&startNew=off&all=done" | \
           jq -r '.endpoints[0].grade // "Unknown"')

echo "🏆 Note SSL Labs : $SSL_GRADE"

# Vérifier HSTS
echo "🛡️  Vérification HSTS..."
HSTS_HEADER=$(curl -s -I https://$DOMAIN | grep -i strict-transport-security || echo "HSTS non configuré")
echo "   $HSTS_HEADER"

# Vérifier la chaîne de certificats
echo "🔗 Vérification de la chaîne de certificats..."
CHAIN_VALID=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 -verify_return_error 2>/dev/null && echo "✅ Valide" || echo "❌ Invalide")
echo "   $CHAIN_VALID"

echo "✅ Vérification SSL terminée"
```

---

## 🚀 Déploiement avec SSL

### Docker Compose production complet

```yaml
# compose.prod.yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: docker/production/nginx/Dockerfile
      args:
        NGINX_VERSION: 1.25-alpine
    container_name: laravel-supabase-web
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./storage/app/public:/var/www/storage/app/public:ro
      - certbot-etc:/etc/letsencrypt:ro
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/certbot
    environment:
      - DOMAIN=${DOMAIN}
    depends_on:
      - php-fpm
    networks:
      - laravel-network

  php-fpm:
    build:
      context: .
      dockerfile: docker/production/php-fpm/Dockerfile
      args:
        PHP_VERSION: 8.4-fpm-alpine
    container_name: laravel-supabase-php-fpm
    restart: unless-stopped
    volumes:
      - ./:/var/www
      - ./storage:/var/www/storage
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
    networks:
      - laravel-network

  certbot:
    image: certbot/certbot:latest
    container_name: laravel-supabase-certbot
    restart: unless-stopped
    volumes:
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/certbot
    environment:
      - CERTBOT_EMAIL=${CERTBOT_EMAIL}
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew --quiet; sleep 12h & wait $${!}; done;'"
    networks:
      - laravel-network

  redis:
    image: redis:7-alpine
    container_name: laravel-supabase-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    networks:
      - laravel-network

volumes:
  certbot-etc:
    driver: local
  certbot-var:
    driver: local
  web-root:
    driver: local
  redis-data:
    driver: local

networks:
  laravel-network:
    driver: bridge
```

---

## 📊 Surveillance et alertes

### Monitoring avec healthchecks

```yaml
# healthchecks pour SSL
services:
  web:
    healthcheck:
      test: ["CMD", "curl", "-f", "https://localhost/up"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  ssl-monitor:
    image: alpine:latest
    container_name: ssl-monitor
    restart: unless-stopped
    volumes:
      - ./scripts:/scripts
    command: >
      sh -c "
        apk add --no-cache curl openssl &&
        while true; do
          /scripts/check-ssl.sh || echo 'SSL check failed';
          sleep 3600;
        done
      "
    environment:
      - DOMAIN=${DOMAIN}
      - CERTBOT_EMAIL=${CERTBOT_EMAIL}
```

### Intégration avec Grafana

```yaml
# Métriques SSL pour Grafana
prometheus:
  image: prom/prometheus:latest
  container_name: prometheus
  restart: unless-stopped
  ports:
    - "9090:9090"
  volumes:
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus-data:/prometheus

blackbox_exporter:
  image: prom/blackbox-exporter:latest
  container_name: blackbox-exporter
  restart: unless-stopped
  ports:
    - "9115:9115"
  volumes:
    - ./monitoring/blackbox.yml:/etc/blackbox_exporter/config.yml
```

```yaml
# monitoring/blackbox.yml
modules:
  http_2xx:
    prober: http
    http:
      method: GET
      preferred_ip_protocol: ip4
      follow_redirects: true
      fail_if_ssl: false
      fail_if_not_ssl: true
      tls_config:
        insecure_skip_verify: false
  
  http_ssl_expire:
    prober: http
    http:
      method: GET
      fail_if_ssl: false
      fail_if_not_ssl: true
      tls_config:
        insecure_skip_verify: false
```

---

## 🔧 Dépannage SSL

### Problèmes courants

| Problème | Symptôme | Solution |
|----------|----------|----------|
| **Certificat expiré** | ERR_CERT_DATE_INVALID | `docker compose run --rm certbot renew --force-renewal` |
| **Chaîne incomplète** | Navigateur affiche un avertissement | Vérifier `fullchain.pem` vs `cert.pem` |
| **Port 80 bloqué** | Échec de validation ACME | Vérifier firewall et redirections |
| **Erreur nginx** | 502 Bad Gateway | `docker compose logs web` |

### Commandes de diagnostic

```bash
# Tester la configuration SSL
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Vérifier les certificats Certbot
docker compose run --rm certbot certificates

# Tester la configuration nginx
docker compose exec web nginx -t

# Voir les logs de renouvellement
docker compose logs certbot

# Test de performance SSL
curl -w "@curl-format.txt" -o /dev/null -s "https://yourdomain.com"
```

### Formats de test curl

```bash
# curl-format.txt
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

---

*Ce guide couvre une configuration SSL/HTTPS complète et sécurisée pour votre application Laravel-Supabase en production.* 