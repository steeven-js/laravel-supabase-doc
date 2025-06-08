# ⚙️ Configuration

Guide complet pour configurer et personnaliser votre environnement Laravel-Supabase selon vos besoins.

## 📋 Vue d'ensemble

Ce guide couvre tous les aspects de la configuration, depuis les variables d'environnement jusqu'aux optimisations avancées de performance.

### 🎯 Objectifs

- **Personnaliser l'environnement** selon vos besoins
- **Optimiser les performances** pour votre contexte
- **Configurer la sécurité** appropriée
- **Adapter les services** aux spécificités de votre projet

---

## 🔧 Variables d'environnement

### Configuration Laravel (.env)

#### Variables essentielles

```env
# Application
APP_NAME="Laravel Supabase"
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8080

# Base de données (Supabase)
DB_CONNECTION=pgsql
DB_HOST=kong
DB_PORT=8000
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-postgres-password

# Supabase Configuration
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Cache et Sessions
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

#### Variables Docker

```env
# Docker Configuration
UID=1000
GID=1000
NGINX_PORT=8080
VITE_PORT=5173

# XDebug (Développement)
XDEBUG_ENABLED=true
XDEBUG_MODE=develop,coverage,debug,profile
XDEBUG_HOST=host.docker.internal
XDEBUG_IDE_KEY=VSCODE
XDEBUG_LOG=/dev/stdout
XDEBUG_LOG_LEVEL=0
```

---

## 🗄️ Configuration Supabase

### Variables Supabase (.env)

#### Secrets de sécurité (IMPORTANT !)

```env
# CHANGEZ CES VALEURS EN PRODUCTION !
POSTGRES_PASSWORD=your-super-secret-and-long-postgres-password
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long

# Clés API générées
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Configuration Base de données

```env
# Database
POSTGRES_HOST=db
POSTGRES_DB=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres

# Connection Pooler
POOLER_TENANT_ID=your-tenant-id
POOLER_PROXY_PORT_TRANSACTION=6543
POOLER_PROXY_PORT_SESSION=5432
```

#### Configuration API

```env
# API Gateway
KONG_HTTP_PORT=8000
KONG_HTTPS_PORT=8443
API_EXTERNAL_URL=http://localhost:8000

# Auth Service
SITE_URL=http://localhost:8080
ADDITIONAL_REDIRECT_URLS=
JWT_EXPIRY=3600
DISABLE_SIGNUP=false

# Studio
STUDIO_DEFAULT_ORGANIZATION=Default Organization
STUDIO_DEFAULT_PROJECT=Default Project
STUDIO_PORT=3000
SUPABASE_PUBLIC_URL=http://localhost:8000
```

#### Paramètres de fonctionnalités

```env
# Email
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=true
SMTP_ADMIN_EMAIL=admin@example.com
SMTP_HOST=mailpit
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SENDER_NAME="Supabase"

# Phone
ENABLE_PHONE_SIGNUP=true
ENABLE_PHONE_AUTOCONFIRM=true

# Security
SECURITY_CAPTCHA_ENABLED=false
SECURITY_CAPTCHA_SECRET=your-captcha-secret
```

---

## 🐳 Configuration Docker

### Développement (compose.dev.yaml)

#### Personnalisation des ports

```yaml
services:
  web:
    ports:
      - "${NGINX_PORT:-8080}:80"  # Port customisable

  workspace:
    ports:
      - "${VITE_PORT:-5173}:5173"  # Port Vite customisable
```

#### Configuration XDebug

```yaml
services:
  php-fpm:
    build:
      args:
        XDEBUG_ENABLED: ${XDEBUG_ENABLED:-true}
        XDEBUG_MODE: ${XDEBUG_MODE:-develop,debug}
        XDEBUG_HOST: ${XDEBUG_HOST:-host.docker.internal}
        XDEBUG_IDE_KEY: ${XDEBUG_IDE_KEY:-VSCODE}
```

#### Volumes de développement

```yaml
services:
  web:
    volumes:
      - ./:/var/www                    # Code source
      - ./docker/development/nginx/nginx.conf:/etc/nginx/nginx.conf:ro

  php-fpm:
    volumes:
      - ./:/var/www                    # Code source
      - ./storage:/var/www/storage     # Storage persistant
```

### Production (compose.prod.yaml)

#### Optimisations SSL

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
```

#### Health checks

```yaml
services:
  php-fpm:
    healthcheck:
      test: ["CMD-SHELL", "php-fpm-healthcheck || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
```

---

## 🌐 Configuration Nginx

### Développement

```nginx
# docker/development/nginx/nginx.conf
events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logs détaillés pour le développement
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log debug;

    sendfile        on;
    keepalive_timeout  65;
    client_max_body_size 100M;  # Upload de fichiers volumineux

    server {
        listen 80;
        server_name localhost;
        root /var/www/public;
        index index.php index.html;

        # Hot reload pour Vite
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            try_files $uri @vite;
        }

        location @vite {
            proxy_pass http://host.docker.internal:5173;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            fastcgi_pass php-fpm:9000;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
            
            # Headers pour le développement
            fastcgi_param HTTP_X_FORWARDED_PROTO $scheme;
            fastcgi_read_timeout 300;
        }
    }
}
```

### Production

```nginx
# docker/production/nginx/nginx.conf
events {
    worker_connections  2048;
    use epoll;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logs optimisés pour la production
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Optimisations performance
    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  30;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Redirection HTTP vers HTTPS
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    # Configuration HTTPS
    server {
        listen 443 ssl http2;
        server_name your-domain.com;
        root /var/www/public;
        index index.php;

        # SSL Configuration
        ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;

        # Assets statiques
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            fastcgi_pass php-fpm:9000;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
            fastcgi_param HTTPS on;
        }

        # Let's Encrypt
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
    }
}
```

---

## 🐘 Configuration PHP

### Développement (php.ini-development)

```ini
[PHP]
memory_limit = 256M
post_max_size = 100M
upload_max_filesize = 100M
max_execution_time = 300

# Développement
display_errors = On
display_startup_errors = On
error_reporting = E_ALL
log_errors = On
error_log = /var/log/php/error.log

# Debug
html_errors = On
expose_php = On

# Session
session.cookie_httponly = 1
session.use_only_cookies = 1
session.cookie_secure = 0  # HTTP en développement
```

### Production (php.ini-production)

```ini
[PHP]
memory_limit = 512M
post_max_size = 20M
upload_max_filesize = 20M
max_execution_time = 60

# Production
display_errors = Off
display_startup_errors = Off
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT
log_errors = On
error_log = /var/log/php/error.log

# Sécurité
expose_php = Off
allow_url_fopen = Off
allow_url_include = Off

# Session sécurisée
session.cookie_httponly = 1
session.use_only_cookies = 1
session.cookie_secure = 1
session.cookie_samesite = "Strict"

# OPcache
opcache.enable = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 10000
opcache.revalidate_freq = 2
opcache.fast_shutdown = 1
```

---

## ⚡ Optimisations de performance

### Configuration Redis

```bash
# redis.conf personnalisé
maxmemory 512mb
maxmemory-policy allkeys-lru

# Persistance
save 900 1
save 300 10
save 60 10000

# Network
tcp-keepalive 300
timeout 0

# Logs
loglevel notice
logfile /var/log/redis/redis-server.log
```

### Configuration Laravel Cache

```php
// config/cache.php
'default' => env('CACHE_DRIVER', 'redis'),

'stores' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'cache',
        'lock_connection' => 'default',
    ],
],

'prefix' => env('CACHE_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_cache'),
```

### Configuration Queue

```php
// config/queue.php
'default' => env('QUEUE_CONNECTION', 'redis'),

'connections' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => env('REDIS_QUEUE', 'default'),
        'retry_after' => 90,
        'block_for' => null,
    ],
],
```

---

## 🔒 Configuration sécurité

### Headers de sécurité

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
        env('APP_URL', 'http://localhost:8080'),
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### Configuration des sessions

```php
// config/session.php
return [
    'driver' => env('SESSION_DRIVER', 'redis'),
    'lifetime' => env('SESSION_LIFETIME', 120),
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => env('SESSION_CONNECTION', null),
    'table' => 'sessions',
    'store' => env('SESSION_STORE', null),
    'lottery' => [2, 100],
    'cookie' => env('SESSION_COOKIE', Str::slug(env('APP_NAME', 'laravel'), '_').'_session'),
    'path' => '/',
    'domain' => env('SESSION_DOMAIN', null),
    'secure' => env('SESSION_SECURE_COOKIE', env('APP_ENV') === 'production'),
    'http_only' => true,
    'same_site' => 'lax',
];
```

---

## 🎨 Configuration Frontend

### Configuration Vite

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.tsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        watch: {
            usePolling: true,
        },
        hmr: {
            host: 'localhost',
        },
    },
    
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    utils: ['lodash', 'axios'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
})
```

### Configuration Tailwind

```javascript
// tailwind.config.js
module.exports = {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.tsx",
        "./resources/**/*.ts",
        "./resources/**/*.js",
    ],
    
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    900: '#1e3a8a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}
```

---

## 📊 Monitoring et logs

### Configuration des logs Laravel

```php
// config/logging.php
'channels' => [
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
        'days' => 14,
        'replace_placeholders' => true,
    ],
    
    'production' => [
        'driver' => 'stack',
        'channels' => ['daily', 'slack'],
        'ignore_exceptions' => false,
    ],
    
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel Log',
        'emoji' => ':boom:',
        'level' => env('LOG_LEVEL', 'critical'),
        'replace_placeholders' => true,
    ],
],
```

### Health Checks

```php
// routes/web.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'services' => [
            'database' => DB::connection()->getPdo() ? 'ok' : 'error',
            'cache' => Cache::store('redis')->get('health') !== null ? 'ok' : 'error',
            'storage' => Storage::disk('local')->exists('test') ? 'ok' : 'error',
        ],
    ]);
});
```

---

## 🔧 Scripts de configuration

### Script de configuration automatique

```bash
#!/bin/bash
# configure.sh

echo "🔧 Configuration Laravel-Supabase..."

# Vérifier les prérequis
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

# Demander les paramètres
read -p "Nom de l'application: " APP_NAME
read -p "Environnement (local/production): " APP_ENV
read -p "URL de l'application: " APP_URL
read -s -p "Mot de passe PostgreSQL: " POSTGRES_PASSWORD
echo

# Créer le fichier .env
cat > .env << EOF
APP_NAME="$APP_NAME"
APP_ENV=$APP_ENV
APP_KEY=base64:$(openssl rand -base64 32)
APP_DEBUG=$([ "$APP_ENV" = "local" ] && echo "true" || echo "false")
APP_URL=$APP_URL

# Database
DB_CONNECTION=pgsql
DB_HOST=kong
DB_PORT=8000
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=$POSTGRES_PASSWORD

# Supabase
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Docker
UID=$(id -u)
GID=$(id -g)
NGINX_PORT=8080
VITE_PORT=5173
EOF

echo "✅ Configuration terminée !"
echo "📝 Fichier .env créé avec les paramètres"
```

### Script d'optimisation

```bash
#!/bin/bash
# optimize.sh

echo "⚡ Optimisation Laravel pour la production..."

# Cache Laravel
docker compose exec php-fpm php artisan config:cache
docker compose exec php-fpm php artisan route:cache
docker compose exec php-fpm php artisan view:cache
docker compose exec php-fpm php artisan event:cache

# Assets frontend
docker compose exec workspace npm run build

# Optimisation Composer
docker compose exec php-fpm composer install --no-dev --optimize-autoloader

echo "✅ Optimisation terminée !"
```

---

## 📚 Ressources avancées

### Configuration par environnement

```php
// bootstrap/app.php
$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

// Configuration spécifique par environnement
if ($app->environment('production')) {
    $app->loadEnvironmentFrom('.env.production');
} elseif ($app->environment('staging')) {
    $app->loadEnvironmentFrom('.env.staging');
}
```

### Service Providers personnalisés

```php
// app/Providers/ConfigServiceProvider.php
class ConfigServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Configuration dynamique selon l'environnement
        if ($this->app->environment('production')) {
            config(['app.debug' => false]);
            config(['logging.default' => 'production']);
        }
    }
}
```

---

*Ce guide de configuration couvre tous les aspects pour adapter l'application Laravel-Supabase à vos besoins spécifiques.* 