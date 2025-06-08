# 🗄️ Introduction à Supabase

Supabase est un Backend-as-a-Service open source qui fournit une alternative moderne à Firebase. Dans ce projet, Supabase remplace la base de données MySQL traditionnelle par PostgreSQL avec des fonctionnalités avancées.

## 🎯 Pourquoi Supabase ?

### ✨ Avantages clés

- **🐘 PostgreSQL** - Base de données relationnelle puissante
- **🔐 Authentification intégrée** - JWT, OAuth, Magic Links
- **📡 API REST automatique** - Génération automatique d'API
- **🚀 Real-time** - WebSockets pour données temps réel
- **📦 Storage** - Gestion de fichiers avec CDN
- **🛡️ RLS (Row Level Security)** - Sécurité au niveau des lignes

### 🏗️ Architecture Supabase

```
🗄️ Supabase Stack
├── 🌐 Kong API Gateway
│   ├── Port 8000 (Point d'entrée unique)
│   ├── Authentification JWT
│   └── Routage des requêtes
├── 🔐 GoTrue (Auth Service)
│   ├── Gestion utilisateurs
│   ├── Sessions JWT
│   └── Providers OAuth
├── 🐘 PostgreSQL Database
│   ├── Port 5432 (via Supavisor)
│   ├── Extensions activées
│   └── Schémas configurés
├── 📡 Realtime Server
│   ├── WebSockets
│   ├── Subscriptions
│   └── Broadcast
├── 📦 Storage Server
│   ├── Upload de fichiers
│   ├── Transformation d'images
│   └── CDN intégré
└── 📊 Studio Dashboard
    ├── Interface admin (port 8000)
    ├── Éditeur SQL
    └── Gestion des données
```

---

## 🚀 Installation et configuration

### Environnements Supabase

Le projet utilise deux instances Supabase séparées :

| Environnement | Dossier | Port | Usage |
|---------------|---------|------|-------|
| **Développement** | `supabase-project-dev/` | 8000 | Tests et développement local |
| **Production** | `supabase-project/` | 8000 | Application en production |

### Démarrage rapide

```bash
# Développement
cd supabase-project-dev
docker compose up -d

# Production  
cd supabase-project
docker compose up -d
```

### Vérification de l'installation

```bash
# Vérifier les services
docker compose ps

# Tester l'API
curl http://localhost:8000/rest/v1/

# Accéder au Studio
open http://localhost:8000
```

---

## 🔧 Configuration Laravel

### Variables d'environnement

```env
# .env (développement)
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# .env.production (production)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_KEY=your-production-service-key
```

### Configuration des services

```php
// config/services.php
'supabase' => [
    'url' => env('SUPABASE_URL'),
    'key' => env('SUPABASE_ANON_KEY'),
    'service_key' => env('SUPABASE_SERVICE_KEY'),
],
```

---

## 🔐 Authentification

### Configuration GoTrue

```yaml
# docker-compose.yml (Supabase)
auth:
  image: supabase/gotrue:latest
  environment:
    GOTRUE_API_HOST: 0.0.0.0
    GOTRUE_API_PORT: 9999
    GOTRUE_DB_DRIVER: postgres
    GOTRUE_DB_DATABASE_URL: postgres://postgres:your-super-secret-and-long-postgres-password@db:5432/postgres
    GOTRUE_SITE_URL: http://localhost:8080
    GOTRUE_URI_ALLOW_LIST: "*"
    GOTRUE_JWT_SECRET: your-super-secret-jwt-token-with-at-least-32-characters-long
```

### Intégration Laravel

```php
// app/Http/Controllers/Auth/AuthenticatedSessionController.php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AuthenticatedSessionController extends Controller
{
    public function store(Request $request)
    {
        $response = Http::post(config('services.supabase.url') . '/auth/v1/token', [
            'email' => $request->email,
            'password' => $request->password,
            'grant_type' => 'password'
        ], [
            'apikey' => config('services.supabase.key'),
            'Content-Type' => 'application/json'
        ]);

        if ($response->successful()) {
            $token = $response->json()['access_token'];
            session(['supabase_token' => $token]);
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors(['email' => 'Invalid credentials']);
    }
}
```

---

## 📡 API REST automatique

### Utilisation des tables

Supabase génère automatiquement une API REST pour chaque table :

```php
// Récupérer des utilisateurs
$users = Http::withHeaders([
    'apikey' => config('services.supabase.key'),
    'Authorization' => 'Bearer ' . session('supabase_token')
])
->get(config('services.supabase.url') . '/rest/v1/users')
->json();

// Créer un utilisateur
$newUser = Http::withHeaders([
    'apikey' => config('services.supabase.key'),
    'Authorization' => 'Bearer ' . session('supabase_token'),
    'Content-Type' => 'application/json'
])
->post(config('services.supabase.url') . '/rest/v1/users', [
    'name' => 'John Doe',
    'email' => 'john@example.com'
])
->json();
```

### Filtres et requêtes

```php
// Filtrage
$activeUsers = Http::withHeaders([
    'apikey' => config('services.supabase.key')
])
->get(config('services.supabase.url') . '/rest/v1/users?active=eq.true')
->json();

// Tri et limitation
$recentUsers = Http::withHeaders([
    'apikey' => config('services.supabase.key')
])
->get(config('services.supabase.url') . '/rest/v1/users?order=created_at.desc&limit=10')
->json();
```

---

## 🚀 Temps réel (Realtime)

### Configuration WebSocket

```javascript
// resources/js/supabase-realtime.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://localhost:8000'
const supabaseKey = 'your-anon-key'
const supabase = createClient(supabaseUrl, supabaseKey)

// Écouter les changements sur une table
const subscription = supabase
  .channel('users_changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'users' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

### Intégration React

```tsx
// resources/js/components/UsersList.tsx
import { useEffect, useState } from 'react'

export default function UsersList() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        // Écouter les nouveaux utilisateurs
        const subscription = supabase
            .channel('users')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'users' },
                (payload) => {
                    setUsers(current => [...current, payload.new])
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>{user.name}</div>
            ))}
        </div>
    )
}
```

---

## 📦 Storage et fichiers

### Configuration Storage

```php
// Upload de fichier
public function uploadFile(Request $request)
{
    $file = $request->file('upload');
    $fileName = time() . '_' . $file->getClientOriginalName();
    
    $response = Http::attach(
        'file', file_get_contents($file), $fileName
    )->withHeaders([
        'apikey' => config('services.supabase.key'),
        'Authorization' => 'Bearer ' . session('supabase_token')
    ])->post(config('services.supabase.url') . '/storage/v1/object/uploads/' . $fileName);

    return $response->json();
}
```

### Gestion des images

```php
// Génération d'URL publique
public function getPublicUrl($fileName)
{
    return config('services.supabase.url') . '/storage/v1/object/public/uploads/' . $fileName;
}

// Transformation d'image
public function getResizedImage($fileName, $width = 300, $height = 200)
{
    return config('services.supabase.url') . '/storage/v1/render/image/public/uploads/' . $fileName . '?width=' . $width . '&height=' . $height;
}
```

---

## 🛡️ Sécurité (RLS)

### Row Level Security

```sql
-- Activer RLS sur une table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs ne voient que leurs propres données
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Politique : les utilisateurs peuvent modifier leurs propres données
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);
```

### Roles et permissions

```sql
-- Créer un rôle personnalisé
CREATE ROLE app_user;

-- Accorder des permissions spécifiques
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
GRANT USAGE ON SEQUENCE users_id_seq TO app_user;
```

---

## 📊 Studio Dashboard

### Fonctionnalités principales

- **🗂️ Table Editor** - CRUD visuel sur les données
- **🔍 SQL Editor** - Exécution de requêtes SQL
- **👥 Auth Management** - Gestion des utilisateurs
- **📦 Storage Browser** - Navigateur de fichiers
- **📡 API Docs** - Documentation auto-générée
- **📈 Analytics** - Métriques d'utilisation

### Accès et navigation

```bash
# Accéder au Studio
open http://localhost:8000

# Identifiants par défaut
Username: supabase
Password: this_password_is_insecure_and_should_be_updated
```

---

## 🔧 Migration et données

### Import de données existantes

```sql
-- Créer les tables
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer des données de test
INSERT INTO users (email, name) VALUES
    ('admin@example.com', 'Administrator'),
    ('user@example.com', 'Regular User');
```

### Synchronisation avec Laravel

```php
// Migration Laravel correspondante
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }
}
```

---

## 🚨 Dépannage

### Problèmes courants

| Problème | Symptôme | Solution |
|----------|----------|----------|
| **Connexion refusée** | Connection refused | Vérifier que Supabase est démarré |
| **Clé API invalide** | 401 Unauthorized | Vérifier SUPABASE_ANON_KEY |
| **CORS Error** | Blocked by CORS | Configurer GOTRUE_SITE_URL |
| **RLS Block** | 403 Forbidden | Vérifier les politiques RLS |

### Logs et debugging

```bash
# Logs Supabase
docker compose logs auth
docker compose logs rest
docker compose logs realtime

# Test de l'API
curl -H "apikey: your-anon-key" http://localhost:8000/rest/v1/
```

---

## 📚 Ressources utiles

- [Documentation Supabase](https://supabase.com/docs) - Guide officiel
- [API Reference](https://supabase.com/docs/reference/api) - Référence API
- [Self-hosting Guide](https://supabase.com/docs/guides/self-hosting) - Installation autonome
- [PostgreSQL Docs](https://www.postgresql.org/docs/) - Documentation PostgreSQL

---

*Cette introduction couvre les bases de Supabase dans le contexte du projet Laravel. Consultez les guides spécialisés pour approfondir chaque aspect.* 