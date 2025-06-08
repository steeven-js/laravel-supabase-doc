# ⚙️ Configuration Supabase

Guide complet pour configurer Supabase avec Laravel, incluant la base de données, l'authentification, et les services avancés.

## 📋 Vue d'ensemble

Ce guide couvre toutes les configurations nécessaires pour intégrer Supabase efficacement dans votre application Laravel.

### 🎯 Objectifs

- **Configurer l'environnement** Supabase 
- **Paramétrer la base de données** PostgreSQL
- **Configurer l'authentification** et les providers
- **Optimiser les performances** et la sécurité
- **Gérer les environnements** multiples

---

## 🚀 Configuration initiale

### Variables d'environnement Supabase

```env
# .env - Configuration Supabase de base
############
# Secrets - CHANGEZ EN PRODUCTION !
############
POSTGRES_PASSWORD=your-super-secret-and-long-postgres-password
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long

# Clés API Supabase (générées automatiquement)
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

############
# Database
############
POSTGRES_HOST=db
POSTGRES_DB=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres

############
# API Gateway (Kong)
############
KONG_HTTP_PORT=8000
KONG_HTTPS_PORT=8443
API_EXTERNAL_URL=http://localhost:8000

############
# Auth Service
############
SITE_URL=http://localhost:8080
ADDITIONAL_REDIRECT_URLS=
JWT_EXPIRY=3600
DISABLE_SIGNUP=false

############
# Studio (Interface d'administration)
############
STUDIO_DEFAULT_ORGANIZATION=Default Organization
STUDIO_DEFAULT_PROJECT=Default Project
STUDIO_PORT=3000
SUPABASE_PUBLIC_URL=http://localhost:8000

############
# Email & Phone
############
ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=true
ENABLE_PHONE_SIGNUP=true
ENABLE_PHONE_AUTOCONFIRM=true

############
# Monitoring & Logs
############
LOGFLARE_API_KEY=your_logflare_api_key
LOGFLARE_SOURCE_TOKEN=your_logflare_source_token
```

### Configuration Laravel pour Supabase

```env
# .env Laravel - Connexion à Supabase
# Base de données via Supabase Kong Gateway
DB_CONNECTION=pgsql
DB_HOST=kong
DB_PORT=8000
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-postgres-password

# Configuration Supabase pour Laravel
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Configuration connexion directe PostgreSQL (optionnel)
POSTGRES_DIRECT_HOST=localhost
POSTGRES_DIRECT_PORT=5432
```

---

## 🗄️ Configuration base de données

### Configuration PostgreSQL avancée

```yaml
# supabase-project/docker-compose.yml
services:
  db:
    image: supabase/postgres:15.1.0.117
    healthcheck:
      test: pg_isready -U postgres -h localhost
      interval: 5s
      timeout: 5s
      retries: 10
    command:
      - postgres
      - -c
      - config_file=/etc/postgresql/postgresql.conf
      - -c
      - log_min_messages=fatal
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      POSTGRES_HOST: /var/run/postgresql
      PGPORT: 5432
      POSTGRES_PORT: 5432
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXP: ${JWT_EXPIRY}
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./volumes/db/realtime.sql:/docker-entrypoint-initdb.d/migrations/99-realtime.sql:Z
      - ./volumes/db/webhooks.sql:/docker-entrypoint-initdb.d/init-scripts/98-webhooks.sql:Z
      - ./volumes/db/roles.sql:/docker-entrypoint-initdb.d/init-scripts/99-roles.sql:Z
```

### Configuration des extensions PostgreSQL

```sql
-- Extensions Supabase essentielles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgjwt";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgaudit";

-- Extensions avancées (optionnelles)
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
```

### Schémas et privilèges

```sql
-- Créer les schémas nécessaires
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS realtime;
CREATE SCHEMA IF NOT EXISTS supabase_functions;

-- Configurer les privilèges
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Privilèges par défaut pour les nouvelles tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
```

---

## 🔐 Configuration authentification

### Providers d'authentification

```env
# Configuration des providers OAuth

############
# Google OAuth
############
GOOGLE_ENABLED=true
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/v1/callback

############
# GitHub OAuth
############
GITHUB_ENABLED=true
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/v1/callback

############
# Discord OAuth
############
DISCORD_ENABLED=false
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

############
# Facebook OAuth
############
FACEBOOK_ENABLED=false
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

############
# Twitter OAuth
############
TWITTER_ENABLED=false
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
```

### Configuration JWT

```env
# Configuration JWT avancée
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
JWT_EXP=3600
JWT_AUD=authenticated
JWT_DEFAULT_GROUP_NAME=authenticated

# Configuration des claims personnalisés
JWT_CUSTOM_CLAIMS={"role": "authenticated", "email": "user@example.com"}
```

### Paramètres de sécurité

```env
# Politiques de mot de passe
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_LETTERS=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SYMBOLS=false
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true

# Limitation des tentatives
RATE_LIMIT_EMAIL_SENT=60
RATE_LIMIT_SMS_SENT=60
RATE_LIMIT_ANONYMOUS_USERS=100

# Session et tokens
REFRESH_TOKEN_ROTATION_ENABLED=true
SECURITY_REFRESH_TOKEN_REUSE_INTERVAL=10
SECURITY_CAPTCHA_ENABLED=false
SECURITY_CAPTCHA_SECRET=your-captcha-secret-key
```

---

## 📧 Configuration Email

### Service Email (SMTP)

```env
# Configuration SMTP pour l'envoi d'emails
SMTP_ADMIN_EMAIL=admin@example.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_SENDER_NAME=Your App Name

# Configuration emails d'authentification
MAILER_AUTOCONFIRM=false
MAILER_SECURE_EMAIL_CHANGE_ENABLED=true
MAILER_OTP_EXP=3600
MAILER_OTP_LENGTH=6

# Templates d'emails personnalisés
MAILER_TEMPLATES_INVITE=/path/to/invite.html
MAILER_TEMPLATES_CONFIRMATION=/path/to/confirmation.html
MAILER_TEMPLATES_RECOVERY=/path/to/recovery.html
MAILER_TEMPLATES_EMAIL_CHANGE=/path/to/email_change.html
```

### Templates email personnalisés

```html
<!-- Templates d'emails dans volumes/functions/templates/ -->

<!-- confirmation.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmez votre email</title>
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1>Bienvenue !</h1>
        <p>Cliquez sur le lien ci-dessous pour confirmer votre email :</p>
        <a href="{{ .ConfirmationURL }}" 
           style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Confirmer mon email
        </a>
        <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
    </div>
</body>
</html>

<!-- recovery.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Réinitialiser votre mot de passe</title>
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h1>Réinitialisation de mot de passe</h1>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="{{ .ConfirmationURL }}" 
           style="background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Réinitialiser mon mot de passe
        </a>
        <p>Ce lien expire dans 24 heures.</p>
    </div>
</body>
</html>
```

---

## 🔄 Configuration Realtime

### Service Realtime

```yaml
# Configuration Realtime dans docker-compose.yml
realtime:
  container_name: supabase-realtime
  image: supabase/realtime:v2.10.1
  depends_on:
    db:
      condition: service_healthy
  restart: unless-stopped
  environment:
    PORT: 4000
    DB_HOST: db
    DB_PORT: 5432
    DB_USER: supabase_realtime_admin
    DB_PASSWORD: ${POSTGRES_PASSWORD}
    DB_NAME: postgres
    DB_AFTER_CONNECT_QUERY: 'SET search_path TO _realtime'
    DB_ENC_KEY: supabaserealtime
    API_JWT_SECRET: ${JWT_SECRET}
    FLY_ALLOC_ID: fly123
    FLY_APP_NAME: realtime
    SECRET_KEY_BASE: UpNVntn3cDxHJpq99YMc1T1AQgQpc8kfYTuRgBiYa15BLrx8etQoXz3gZv1/u2oq
    ERL_AFLAGS: -proto_dist inet_tcp
    ENABLE_TAILSCALE: "false"
    DNS_NODES: "''"
  command: >
    sh -c "/app/bin/migrate && /app/bin/realtime eval 'Realtime.Release.seeds(Realtime.Repo)' && /app/bin/server"
```

### Configuration des souscriptions

```sql
-- Configurer la réplication pour Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;

-- Créer les triggers pour Realtime
CREATE OR REPLACE FUNCTION notify_realtime_change()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('realtime:public:' || TG_TABLE_NAME, json_build_object(
    'type', TG_OP,
    'record', row_to_json(NEW),
    'old_record', row_to_json(OLD)
  )::text);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Appliquer les triggers
CREATE TRIGGER messages_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION notify_realtime_change();
```

---

## 📁 Configuration Storage

### Service Storage

```yaml
# Configuration Storage
storage:
  container_name: supabase-storage
  image: supabase/storage-api:v0.40.4
  depends_on:
    db:
      condition: service_healthy
    rest:
      condition: service_started
  restart: unless-stopped
  environment:
    ANON_KEY: ${ANON_KEY}
    SERVICE_KEY: ${SERVICE_ROLE_KEY}
    POSTGREST_URL: http://rest:3000
    PGRST_JWT_SECRET: ${JWT_SECRET}
    DATABASE_URL: postgresql://supabase_storage_admin:${POSTGRES_PASSWORD}@db:5432/postgres
    FILE_SIZE_LIMIT: 52428800
    STORAGE_BACKEND: file
    FILE_STORAGE_BACKEND_PATH: /var/lib/storage
    TENANT_ID: stub
    REGION: stub
    GLOBAL_S3_BUCKET: stub
  volumes:
    - storage-data:/var/lib/storage
```

### Configuration des buckets

```sql
-- Créer les buckets de stockage
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('documents', 'documents', false),
  ('images', 'images', true),
  ('videos', 'videos', false);

-- Configurer les politiques de sécurité
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 🔍 Configuration API

### PostgREST

```yaml
# Configuration PostgREST API
rest:
  container_name: supabase-rest
  image: postgrest/postgrest:v11.2.0
  depends_on:
    db:
      condition: service_healthy
  restart: unless-stopped
  environment:
    PGRST_DB_URI: postgresql://authenticator:${POSTGRES_PASSWORD}@db:5432/postgres
    PGRST_DB_SCHEMAS: public,storage,graphql_public
    PGRST_DB_ANON_ROLE: anon
    PGRST_JWT_SECRET: ${JWT_SECRET}
    PGRST_DB_USE_LEGACY_GUCS: "false"
    PGRST_APP_SETTINGS_JWT_SECRET: ${JWT_SECRET}
    PGRST_APP_SETTINGS_JWT_EXP: ${JWT_EXPIRY}
  command: "postgrest"
```

### Configuration Kong Gateway

```yaml
# Configuration Kong API Gateway
kong:
  container_name: supabase-kong
  image: kong:2.8.1
  restart: unless-stopped
  ports:
    - "8000:8000/tcp"
    - "8443:8443/tcp"
  environment:
    KONG_DATABASE: "off"
    KONG_DECLARATIVE_CONFIG: /var/lib/kong/kong.yml
    KONG_DNS_ORDER: LAST,A,CNAME
    KONG_PLUGINS: request-transformer,cors,key-auth,acl,basic-auth
    KONG_NGINX_PROXY_PROXY_BUFFER_SIZE: 160k
    KONG_NGINX_PROXY_PROXY_BUFFERS: 64 160k
  volumes:
    - ./volumes/api/kong.yml:/var/lib/kong/kong.yml:ro
```

### Configuration Kong (kong.yml)

```yaml
# volumes/api/kong.yml
_format_version: "1.1"

consumers:
  - username: anon
    keyauth_credentials:
      - key: ${ANON_KEY}
  - username: service_role
    keyauth_credentials:
      - key: ${SERVICE_ROLE_KEY}

acls:
  - consumer: anon
    group: anon
  - consumer: service_role
    group: admin

services:
  - name: auth-v1-open
    url: http://auth:9999/verify
    plugins:
      - name: cors
        config:
          origins:
            - "*"
          methods:
            - GET
            - POST
            - OPTIONS
          headers:
            - Accept
            - Authorization
            - Content-Type

  - name: rest-v1
    url: http://rest:3000/
    plugins:
      - name: key-auth
        config:
          hide_credentials: false
      - name: acl
        config:
          hide_groups_header: false
          allow:
            - anon
            - admin

routes:
  - service: rest-v1
    name: rest-v1-all
    strip_path: true
    paths:
      - "/rest/v1/"

  - service: auth-v1-open
    name: auth-v1-verify
    strip_path: true
    paths:
      - "/auth/v1/verify"
```

---

## 🚀 Configuration Edge Functions

### Service Functions

```yaml
# Configuration Edge Functions
functions:
  container_name: supabase-edge-functions
  image: supabase/edge-runtime:v1.8.2
  restart: unless-stopped
  environment:
    JWT_SECRET: ${JWT_SECRET}
    SUPABASE_URL: http://kong:8000
    SUPABASE_ANON_KEY: ${ANON_KEY}
    SUPABASE_SERVICE_ROLE_KEY: ${SERVICE_ROLE_KEY}
  volumes:
    - ./volumes/functions:/home/deno/functions:Z
  command:
    - start
    - --main-service
    - /home/deno/functions/main
```

### Exemple de fonction Edge

```typescript
// volumes/functions/hello-world/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Créer le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Récupérer l'utilisateur connecté
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    const { name } = await req.json()

    const data = {
      message: `Hello ${name || 'World'}!`,
      user: user?.email || 'anonymous',
      timestamp: new Date().toISOString(),
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400 
      },
    )
  }
})
```

---

## 📊 Monitoring et Analytics

### Configuration Logflare

```env
# Configuration Logflare pour les logs
LOGFLARE_API_KEY=your_logflare_api_key
LOGFLARE_SOURCE_TOKEN=your_logflare_source_token
LOGFLARE_URL=https://api.logflare.app
```

### Configuration métriques

```yaml
# Prometheus et Grafana (optionnel)
prometheus:
  image: prom/prometheus:latest
  container_name: supabase-prometheus
  restart: unless-stopped
  ports:
    - "9090:9090"
  volumes:
    - ./volumes/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana:latest
  container_name: supabase-grafana
  restart: unless-stopped
  ports:
    - "3001:3000"
  environment:
    GF_SECURITY_ADMIN_PASSWORD: admin
  volumes:
    - grafana-data:/var/lib/grafana
```

---

## 🔒 Configuration de sécurité

### Configuration RLS (Row Level Security)

```sql
-- Activer RLS par défaut
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Politiques de base
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public posts are viewable by everyone" ON public.posts
  FOR SELECT USING (published = true);

CREATE POLICY "Users can insert own posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);
```

### Configuration des rôles

```sql
-- Créer des rôles personnalisés
CREATE ROLE premium_user;
CREATE ROLE moderator;
CREATE ROLE admin;

-- Configurer les privilèges
GRANT SELECT ON ALL TABLES IN SCHEMA public TO premium_user;
GRANT INSERT, UPDATE, DELETE ON public.posts TO moderator;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;

-- Fonction pour vérifier les rôles
CREATE OR REPLACE FUNCTION auth.has_role(required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🔧 Scripts de configuration

### Script de configuration automatique

```bash
#!/bin/bash
# configure-supabase.sh

echo "🔧 Configuration Supabase..."

# Variables
SUPABASE_DIR="supabase-project-dev"
ENV_FILE="$SUPABASE_DIR/.env"

# Vérifier si le dossier existe
if [ ! -d "$SUPABASE_DIR" ]; then
    echo "❌ Dossier $SUPABASE_DIR non trouvé"
    exit 1
fi

# Générer des secrets sécurisés
POSTGRES_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

echo "📝 Génération des secrets..."

# Créer le fichier .env
cat > "$ENV_FILE" << EOF
############
# Secrets
############
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
JWT_SECRET=$JWT_SECRET

############
# Configuration générée automatiquement
############
POSTGRES_HOST=db
POSTGRES_DB=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres

KONG_HTTP_PORT=8000
KONG_HTTPS_PORT=8443
API_EXTERNAL_URL=http://localhost:8000

SITE_URL=http://localhost:8080
JWT_EXPIRY=3600
DISABLE_SIGNUP=false

STUDIO_DEFAULT_ORGANIZATION=Default Organization
STUDIO_DEFAULT_PROJECT=Default Project
STUDIO_PORT=3000
SUPABASE_PUBLIC_URL=http://localhost:8000

ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=true
ENABLE_PHONE_SIGNUP=true
ENABLE_PHONE_AUTOCONFIRM=true
EOF

echo "✅ Configuration terminée !"
echo "📁 Fichier créé : $ENV_FILE"
echo "🔐 Mot de passe PostgreSQL : $POSTGRES_PASSWORD"
echo "🔑 JWT Secret généré automatiquement"
```

### Script de validation

```bash
#!/bin/bash
# validate-supabase.sh

echo "🔍 Validation configuration Supabase..."

# Vérifier les services
echo "📊 Vérification des services..."

services=("kong:8000" "db:5432" "rest:3000" "auth:9999" "storage:5000")

for service in "${services[@]}"; do
    host_port=(${service//:/ })
    host=${host_port[0]}
    port=${host_port[1]}
    
    if docker compose exec $host nc -z localhost $port; then
        echo "✅ $service : OK"
    else
        echo "❌ $service : ERREUR"
    fi
done

# Vérifier l'API
echo "🌐 Test API..."
curl -s -H "apikey: $ANON_KEY" http://localhost:8000/rest/v1/ && echo "✅ API REST : OK" || echo "❌ API REST : ERREUR"

# Vérifier l'authentification
echo "🔐 Test Auth..."
curl -s http://localhost:8000/auth/v1/health && echo "✅ Auth : OK" || echo "❌ Auth : ERREUR"

echo "✅ Validation terminée !"
```

---

## 📚 Configuration par environnement

### Développement

```env
# .env.development
API_EXTERNAL_URL=http://localhost:8000
SITE_URL=http://localhost:8080
ENABLE_EMAIL_AUTOCONFIRM=true
ENABLE_PHONE_AUTOCONFIRM=true
DISABLE_SIGNUP=false
```

### Staging

```env
# .env.staging
API_EXTERNAL_URL=https://staging-api.yourdomain.com
SITE_URL=https://staging.yourdomain.com
ENABLE_EMAIL_AUTOCONFIRM=false
ENABLE_PHONE_AUTOCONFIRM=false
DISABLE_SIGNUP=false
```

### Production

```env
# .env.production
API_EXTERNAL_URL=https://api.yourdomain.com
SITE_URL=https://yourdomain.com
ENABLE_EMAIL_AUTOCONFIRM=false
ENABLE_PHONE_AUTOCONFIRM=false
DISABLE_SIGNUP=false

# Sécurité renforcée
RATE_LIMIT_EMAIL_SENT=10
RATE_LIMIT_SMS_SENT=5
SECURITY_CAPTCHA_ENABLED=true
```

---

*Ce guide couvre toutes les configurations nécessaires pour déployer et optimiser Supabase avec Laravel dans tous les environnements.* 