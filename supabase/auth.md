# 🔐 Authentification Supabase

Guide complet pour implémenter l'authentification avec Supabase dans votre application Laravel.

## 📋 Vue d'ensemble

L'authentification Supabase offre une solution complète et sécurisée pour gérer les utilisateurs, les sessions, et les permissions dans votre application Laravel.

### 🎯 Fonctionnalités

- **Authentification par email/mot de passe**
- **Authentification sociale** (Google, GitHub, Discord, etc.)
- **Authentification par téléphone** (SMS)
- **Magic Links** (liens magiques)
- **Multi-Factor Authentication** (MFA)
- **Row Level Security** (RLS)
- **Gestion des rôles** et permissions

---

## 🚀 Configuration initiale

### Installation des dépendances

```bash
# Installer le client Supabase pour PHP
docker compose exec php-fpm composer require supabase/supabase-php

# Installer le client Supabase pour JavaScript
docker compose exec workspace npm install @supabase/supabase-js
```

### Variables d'environnement

```env
# .env Laravel
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Configuration Auth
AUTH_PROVIDERS_ENABLED=email,google,github
AUTH_PASSWORD_MIN_LENGTH=8
AUTH_SESSION_TIMEOUT=3600
```

### Configuration Supabase Service

```php
// config/supabase.php
<?php

return [
    'url' => env('SUPABASE_URL'),
    'anon_key' => env('SUPABASE_ANON_KEY'),
    'service_key' => env('SUPABASE_SERVICE_KEY'),
    
    'auth' => [
        'redirect_to' => env('SUPABASE_AUTH_REDIRECT_TO', '/dashboard'),
        'auto_refresh_token' => true,
        'session_timeout' => env('AUTH_SESSION_TIMEOUT', 3600),
    ],
    
    'providers' => [
        'google' => [
            'enabled' => env('AUTH_GOOGLE_ENABLED', false),
            'client_id' => env('GOOGLE_CLIENT_ID'),
            'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        ],
        'github' => [
            'enabled' => env('AUTH_GITHUB_ENABLED', false),
            'client_id' => env('GITHUB_CLIENT_ID'),
            'client_secret' => env('GITHUB_CLIENT_SECRET'),
        ],
    ],
];
```

---

## 🔧 Service Provider Supabase

### Création du Service Provider

```php
// app/Providers/SupabaseServiceProvider.php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Supabase\CreateApi;

class SupabaseServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('supabase', function ($app) {
            return CreateApi::create(
                config('supabase.url'),
                config('supabase.anon_key')
            );
        });
        
        $this->app->singleton('supabase.admin', function ($app) {
            return CreateApi::create(
                config('supabase.url'),
                config('supabase.service_key')
            );
        });
    }

    public function boot()
    {
        $this->publishes([
            __DIR__.'/../../config/supabase.php' => config_path('supabase.php'),
        ], 'supabase-config');
    }
}
```

### Enregistrement du Service Provider

```php
// bootstrap/providers.php
return [
    App\Providers\SupabaseServiceProvider::class,
];
```

---

## 👤 Gestion des utilisateurs

### Model User étendu

```php
// app/Models/User.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'id',
        'email',
        'name',
        'avatar_url',
        'phone',
        'email_verified_at',
        'phone_verified_at',
        'provider',
        'provider_id',
        'metadata',
        'app_metadata',
    ];

    protected $hidden = [
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'metadata' => 'array',
        'app_metadata' => 'array',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    // Relations
    public function profiles()
    {
        return $this->hasOne(Profile::class);
    }
    
    public function sessions()
    {
        return $this->hasMany(UserSession::class);
    }
    
    // Méthodes utiles
    public function isEmailVerified()
    {
        return !is_null($this->email_verified_at);
    }
    
    public function isPhoneVerified()
    {
        return !is_null($this->phone_verified_at);
    }
    
    public function hasProvider(string $provider)
    {
        return $this->provider === $provider;
    }
}
```

### Migration Users

```php
// database/migrations/create_users_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique();
            $table->string('name')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('phone')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('provider')->nullable();
            $table->string('provider_id')->nullable();
            $table->json('metadata')->nullable();
            $table->json('app_metadata')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            $table->index(['provider', 'provider_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
```

---

## 🔐 Service d'authentification

### Service Auth personnalisé

```php
// app/Services/SupabaseAuthService.php
<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Supabase\CreateApi;

class SupabaseAuthService
{
    protected $supabase;
    protected $supabaseAdmin;

    public function __construct()
    {
        $this->supabase = app('supabase');
        $this->supabaseAdmin = app('supabase.admin');
    }

    /**
     * Inscription avec email/mot de passe
     */
    public function signUp(string $email, string $password, array $metadata = [])
    {
        try {
            $response = $this->supabase->auth->signUp([
                'email' => $email,
                'password' => $password,
                'options' => [
                    'data' => $metadata
                ]
            ]);

            if ($response['error']) {
                throw new \Exception($response['error']['message']);
            }

            return $this->createOrUpdateUser($response['data']['user']);
        } catch (\Exception $e) {
            Log::error('Supabase SignUp Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Connexion avec email/mot de passe
     */
    public function signIn(string $email, string $password)
    {
        try {
            $response = $this->supabase->auth->signInWithPassword([
                'email' => $email,
                'password' => $password,
            ]);

            if ($response['error']) {
                throw new \Exception($response['error']['message']);
            }

            $user = $this->createOrUpdateUser($response['data']['user']);
            Auth::login($user);

            return [
                'user' => $user,
                'session' => $response['data']['session']
            ];
        } catch (\Exception $e) {
            Log::error('Supabase SignIn Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Connexion avec Magic Link
     */
    public function signInWithMagicLink(string $email, string $redirectTo = null)
    {
        try {
            $response = $this->supabase->auth->signInWithOtp([
                'email' => $email,
                'options' => [
                    'emailRedirectTo' => $redirectTo ?? config('app.url') . '/auth/callback'
                ]
            ]);

            if ($response['error']) {
                throw new \Exception($response['error']['message']);
            }

            return $response['data'];
        } catch (\Exception $e) {
            Log::error('Supabase Magic Link Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Connexion avec provider OAuth
     */
    public function signInWithProvider(string $provider, string $redirectTo = null)
    {
        try {
            $response = $this->supabase->auth->signInWithOAuth([
                'provider' => $provider,
                'options' => [
                    'redirectTo' => $redirectTo ?? config('app.url') . '/auth/callback'
                ]
            ]);

            return $response['data']['url'];
        } catch (\Exception $e) {
            Log::error('Supabase OAuth Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Déconnexion
     */
    public function signOut()
    {
        try {
            $response = $this->supabase->auth->signOut();
            Auth::logout();
            
            return $response;
        } catch (\Exception $e) {
            Log::error('Supabase SignOut Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Récupérer l'utilisateur actuel
     */
    public function getUser()
    {
        try {
            $response = $this->supabase->auth->getUser();
            
            if ($response['error']) {
                return null;
            }

            return $this->createOrUpdateUser($response['data']['user']);
        } catch (\Exception $e) {
            Log::error('Supabase GetUser Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Réinitialiser le mot de passe
     */
    public function resetPassword(string $email)
    {
        try {
            $response = $this->supabase->auth->resetPasswordForEmail([
                'email' => $email,
                'redirectTo' => config('app.url') . '/auth/reset-password'
            ]);

            if ($response['error']) {
                throw new \Exception($response['error']['message']);
            }

            return $response['data'];
        } catch (\Exception $e) {
            Log::error('Supabase Reset Password Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Mettre à jour le mot de passe
     */
    public function updatePassword(string $newPassword)
    {
        try {
            $response = $this->supabase->auth->updateUser([
                'password' => $newPassword
            ]);

            if ($response['error']) {
                throw new \Exception($response['error']['message']);
            }

            return $response['data']['user'];
        } catch (\Exception $e) {
            Log::error('Supabase Update Password Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Créer ou mettre à jour un utilisateur local
     */
    protected function createOrUpdateUser($supabaseUser)
    {
        if (!$supabaseUser) {
            return null;
        }

        return User::updateOrCreate(
            ['id' => $supabaseUser['id']],
            [
                'email' => $supabaseUser['email'],
                'name' => $supabaseUser['user_metadata']['name'] ?? null,
                'avatar_url' => $supabaseUser['user_metadata']['avatar_url'] ?? null,
                'phone' => $supabaseUser['phone'] ?? null,
                'email_verified_at' => $supabaseUser['email_confirmed_at'] ?? null,
                'phone_verified_at' => $supabaseUser['phone_confirmed_at'] ?? null,
                'provider' => $supabaseUser['app_metadata']['provider'] ?? null,
                'provider_id' => $supabaseUser['app_metadata']['provider_id'] ?? null,
                'metadata' => $supabaseUser['user_metadata'] ?? [],
                'app_metadata' => $supabaseUser['app_metadata'] ?? [],
            ]
        );
    }
}
```

---

## 🎮 Contrôleurs d'authentification

### AuthController

```php
// app/Http/Controllers/AuthController.php
<?php

namespace App\Http\Controllers;

use App\Services\SupabaseAuthService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(SupabaseAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Afficher le formulaire de connexion
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /**
     * Traiter la connexion
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        try {
            $result = $this->authService->signIn(
                $request->email, 
                $request->password
            );

            return redirect()->intended('/dashboard')
                ->with('success', 'Connexion réussie !');
        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants ne correspondent pas.'],
            ]);
        }
    }

    /**
     * Afficher le formulaire d'inscription
     */
    public function showRegisterForm()
    {
        return view('auth.register');
    }

    /**
     * Traiter l'inscription
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            $user = $this->authService->signUp(
                $request->email,
                $request->password,
                ['name' => $request->name]
            );

            return redirect('/auth/verify-email')
                ->with('success', 'Inscription réussie ! Vérifiez votre email.');
        } catch (\Exception $e) {
            return back()
                ->withInput($request->only('name', 'email'))
                ->withErrors(['registration' => $e->getMessage()]);
        }
    }

    /**
     * Connexion avec Magic Link
     */
    public function magicLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            $this->authService->signInWithMagicLink($request->email);
            
            return back()->with('success', 'Magic link envoyé ! Vérifiez votre email.');
        } catch (\Exception $e) {
            return back()->withErrors(['email' => $e->getMessage()]);
        }
    }

    /**
     * Connexion avec provider OAuth
     */
    public function socialRedirect(string $provider)
    {
        try {
            $url = $this->authService->signInWithProvider($provider);
            return redirect($url);
        } catch (\Exception $e) {
            return redirect('/login')
                ->withErrors(['social' => 'Erreur de connexion sociale.']);
        }
    }

    /**
     * Callback après authentification
     */
    public function callback(Request $request)
    {
        try {
            // Récupérer l'utilisateur depuis Supabase
            $user = $this->authService->getUser();
            
            if ($user) {
                \Auth::login($user);
                return redirect('/dashboard');
            }
            
            return redirect('/login')
                ->withErrors(['auth' => 'Erreur d\'authentification.']);
        } catch (\Exception $e) {
            return redirect('/login')
                ->withErrors(['auth' => 'Erreur d\'authentification.']);
        }
    }

    /**
     * Déconnexion
     */
    public function logout()
    {
        try {
            $this->authService->signOut();
            return redirect('/');
        } catch (\Exception $e) {
            \Auth::logout();
            return redirect('/');
        }
    }

    /**
     * Réinitialiser le mot de passe
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        try {
            $this->authService->resetPassword($request->email);
            
            return back()->with('success', 'Email de réinitialisation envoyé !');
        } catch (\Exception $e) {
            return back()->withErrors(['email' => $e->getMessage()]);
        }
    }
}
```

---

## 🎨 Vues d'authentification

### Vue de connexion

```blade
{{-- resources/views/auth/login.blade.php --}}
@extends('layouts.app')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Connexion à votre compte
            </h2>
        </div>
        
        <form class="mt-8 space-y-6" method="POST" action="{{ route('login') }}">
            @csrf
            
            @if ($errors->any())
                <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    @foreach ($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif
            
            @if (session('success'))
                <div class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                    {{ session('success') }}
                </div>
            @endif

            <div>
                <input type="email" 
                       name="email" 
                       required 
                       class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                       placeholder="Adresse email"
                       value="{{ old('email') }}">
            </div>
            
            <div>
                <input type="password" 
                       name="password" 
                       required 
                       class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                       placeholder="Mot de passe">
            </div>

            <div>
                <button type="submit" 
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Se connecter
                </button>
            </div>
        </form>

        <!-- Magic Link -->
        <div class="mt-6">
            <form method="POST" action="{{ route('auth.magic-link') }}" class="space-y-4">
                @csrf
                <input type="email" 
                       name="email" 
                       placeholder="Email pour Magic Link"
                       class="w-full px-3 py-2 border border-gray-300 rounded-md">
                <button type="submit" 
                        class="w-full py-2 px-4 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Envoyer Magic Link
                </button>
            </form>
        </div>

        <!-- Connexion sociale -->
        <div class="mt-6 space-y-3">
            <a href="{{ route('auth.social', 'google') }}" 
               class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50">
                Continuer avec Google
            </a>
            
            <a href="{{ route('auth.social', 'github') }}" 
               class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50">
                Continuer avec GitHub
            </a>
        </div>

        <div class="text-center">
            <a href="{{ route('register') }}" class="text-indigo-600 hover:text-indigo-500">
                Pas encore de compte ? S'inscrire
            </a>
        </div>
    </div>
</div>
@endsection
```

---

## 🔒 Middleware d'authentification

### Middleware Supabase

```php
// app/Http/Middleware/SupabaseAuth.php
<?php

namespace App\Http\Middleware;

use App\Services\SupabaseAuthService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupabaseAuth
{
    protected $authService;

    public function __construct(SupabaseAuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handle(Request $request, Closure $next)
    {
        // Vérifier le token dans l'en-tête Authorization
        $token = $request->bearerToken();
        
        if ($token) {
            try {
                // Vérifier le token avec Supabase
                $user = $this->authService->getUser();
                
                if ($user) {
                    Auth::login($user);
                    return $next($request);
                }
            } catch (\Exception $e) {
                // Token invalide
            }
        }

        // Rediriger vers la page de connexion
        if ($request->expectsJson()) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        return redirect()->route('login');
    }
}
```

---

## 🚦 Routes d'authentification

```php
// routes/web.php
use App\Http\Controllers\AuthController;

// Routes d'authentification
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::post('/auth/magic-link', [AuthController::class, 'magicLink'])->name('auth.magic-link');
    Route::get('/auth/social/{provider}', [AuthController::class, 'socialRedirect'])->name('auth.social');
    
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->name('auth.reset-password');
});

// Callback après authentification
Route::get('/auth/callback', [AuthController::class, 'callback'])->name('auth.callback');

// Routes protégées
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');
});
```

---

## 🎯 Frontend JavaScript

### Client Supabase

```typescript
// resources/js/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.MIX_SUPABASE_URL!
const supabaseAnonKey = process.env.MIX_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  provider?: string
}

export interface AuthState {
  user: User | null
  session: any | null
  loading: boolean
}
```

### Hook React d'authentification

```typescript
// resources/js/hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../supabase'
import type { AuthState, User } from '../supabase'

const AuthContext = createContext<{
  auth: AuthState
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithProvider: (provider: string) => Promise<void>
}>({} as any)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth({ 
        user: session?.user || null, 
        session, 
        loading: false 
      })
    })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuth({ 
          user: session?.user || null, 
          session, 
          loading: false 
        })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const signInWithProvider = async (provider: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{
      auth,
      signIn,
      signUp,
      signOut,
      signInWithProvider
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

---

## 🛡️ Sécurité avancée

### Row Level Security (RLS)

```sql
-- Activer RLS sur la table profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs ne peuvent voir que leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Politique : les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### Rôles et permissions

```sql
-- Créer des rôles personnalisés
INSERT INTO auth.roles (id, name) VALUES 
  ('admin', 'Administrator'),
  ('user', 'Regular User'),
  ('moderator', 'Moderator');

-- Table de mapping user-role
CREATE TABLE public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_name TEXT REFERENCES auth.roles(name) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_name)
);

-- RLS pour user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
```

---

## 📊 Tests d'authentification

### Tests Feature

```php
// tests/Feature/AuthTest.php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Services\SupabaseAuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected $authService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authService = app(SupabaseAuthService::class);
    }

    /** @test */
    public function user_can_register()
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect('/auth/verify-email');
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    /** @test */
    public function user_can_login()
    {
        // Créer un utilisateur
        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($user);
    }

    /** @test */
    public function user_can_logout()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post('/logout');

        $response->assertRedirect('/');
        $this->assertGuest();
    }
}
```

---

## 🔧 Utilitaires et helpers

### Helper d'authentification

```php
// app/Helpers/AuthHelper.php
<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

class AuthHelper
{
    public static function user()
    {
        return Auth::user();
    }

    public static function check()
    {
        return Auth::check();
    }

    public static function hasRole(string $role)
    {
        $user = self::user();
        return $user && $user->roles()->where('name', $role)->exists();
    }

    public static function hasAnyRole(array $roles)
    {
        $user = self::user();
        return $user && $user->roles()->whereIn('name', $roles)->exists();
    }

    public static function can(string $permission)
    {
        $user = self::user();
        return $user && $user->can($permission);
    }
}
```

---

*Ce guide complet couvre tous les aspects de l'authentification Supabase avec Laravel, de la configuration de base aux fonctionnalités avancées.* 