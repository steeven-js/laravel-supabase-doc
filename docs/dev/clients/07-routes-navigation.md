# Module 7 : Routes & Navigation - Système Clients

## Vue d'ensemble

Le système de routage pour la gestion des clients utilise **Laravel Routes** avec **Inertia.js** pour une navigation seamless. Le module clients dispose de **37+ routes spécialisées** réparties entre routes principales, routes API, et routes auxiliaires, toutes organisées dans une architecture RESTful avec protection par middleware.

---

## 🛣️ Architecture du Routage

### Structure organisationnelle

```
routes/
├── web.php           # Routes principales (clients + modules liés)
├── settings.php      # Routes paramètres utilisateur
├── auth.php         # Routes authentification
└── console.php      # Routes console/artisan
```

### Patterns de routage

- **RESTful Resources** - Utilisation de `Route::resource()`
- **Route Model Binding** - Résolution automatique des modèles
- **Route Groups** - Organisation par middleware et préfixes
- **Named Routes** - Nommage consistant pour Inertia.js
- **Route Caching** - Optimisation des performances

---

## 👥 Routes Principales Clients

### Route Resource de base

```php
// Routes pour les clients
Route::resource('clients', ClientController::class);
```

**Routes générées automatiquement :**

| Méthode | URI | Action | Nom | Description |
|---------|-----|--------|-----|-------------|
| GET | `/clients` | `index` | `clients.index` | Liste des clients |
| GET | `/clients/create` | `create` | `clients.create` | Formulaire de création |
| POST | `/clients` | `store` | `clients.store` | Enregistrer nouveau client |
| GET | `/clients/{client}` | `show` | `clients.show` | Afficher un client |
| GET | `/clients/{client}/edit` | `edit` | `clients.edit` | Formulaire d'édition |
| PUT/PATCH | `/clients/{client}` | `update` | `clients.update` | Mettre à jour client |
| DELETE | `/clients/{client}` | `destroy` | `clients.destroy` | Supprimer client |

### Route Email spécialisée

```php
// Envoi d'emails aux clients
Route::post('clients/{client}/send-email', [ClientController::class, 'sendEmail'])
    ->name('clients.send-email');
```

**Fonctionnalités :**
- Envoi d'emails personnalisés
- Support des pièces jointes
- Tracking des envois
- Gestion des CC

---

## 🎯 Routes Opportunités

### Routes liées aux clients

```php
// Routes pour les opportunités
Route::post('clients/{client}/opportunities', [OpportunityController::class, 'store'])
    ->name('opportunities.store');

Route::patch('opportunities/{opportunity}', [OpportunityController::class, 'update'])
    ->name('opportunities.update');

Route::delete('opportunities/{opportunity}', [OpportunityController::class, 'destroy'])
    ->name('opportunities.destroy');
```

**Caractéristiques :**
- **Création liée** - Nouvelles opportunités attachées au client
- **Gestion indépendante** - Modification/suppression par ID
- **Route Model Binding** - Résolution automatique des modèles

### Utilisation dans React

```typescript
// Création d'opportunité depuis la page client
const handleSaveOpportunity = async () => {
    router.post(`/clients/${client.id}/opportunities`, {
        nom: opportunityForm.nom,
        description: opportunityForm.description,
        etape: opportunityForm.etape,
        probabilite: Number(opportunityForm.probabilite),
        montant: Number(opportunityForm.montant),
        date_cloture_prevue: opportunityForm.date_cloture_prevue,
        notes: opportunityForm.notes
    }, {
        onSuccess: () => {
            toast.success('Opportunité créée avec succès');
            resetOpportunityForm();
        }
    });
};

// Modification d'opportunité existante
const handleUpdateOpportunity = async (opportunityId: number) => {
    router.patch(`/opportunities/${opportunityId}`, {
        ...opportunityForm
    }, {
        onSuccess: () => {
            toast.success('Opportunité mise à jour');
        }
    });
};
```

---

## 🎫 Routes Tickets Support

### Routes complètes de gestion

```php
// Routes pour les tickets
Route::post('clients/{client}/tickets', [TicketController::class, 'store'])
    ->name('tickets.store');

Route::patch('tickets/{ticket}', [TicketController::class, 'update'])
    ->name('tickets.update');

Route::delete('tickets/{ticket}', [TicketController::class, 'destroy'])
    ->name('tickets.destroy');

// Actions spécialisées pour les tickets
Route::patch('tickets/{ticket}/resoudre', [TicketController::class, 'resoudre'])
    ->name('tickets.resoudre');

Route::patch('tickets/{ticket}/fermer', [TicketController::class, 'fermer'])
    ->name('tickets.fermer');

Route::patch('tickets/{ticket}/reouvrir', [TicketController::class, 'reouvrir'])
    ->name('tickets.reouvrir');

Route::patch('tickets/{ticket}/assigner', [TicketController::class, 'assigner'])
    ->name('tickets.assigner');
```

### Route API auxiliaire

```php
// API pour récupérer la liste des utilisateurs
Route::get('api/users', [TicketController::class, 'getUsers'])
    ->name('api.users');
```

**Workflow tickets :**
1. **Création** - `POST /clients/{client}/tickets`
2. **Modification** - `PATCH /tickets/{ticket}`
3. **Résolution** - `PATCH /tickets/{ticket}/resoudre`
4. **Fermeture** - `PATCH /tickets/{ticket}/fermer`
5. **Réouverture** - `PATCH /tickets/{ticket}/reouvrir`
6. **Assignation** - `PATCH /tickets/{ticket}/assigner`

### Utilisation dans l'interface

```typescript
// Résoudre un ticket
const handleResolveTicket = async (ticketId: number) => {
    router.patch(`/tickets/${ticketId}/resoudre`, {
        solution: ticketForm.solution,
        notes_resolution: ticketForm.notes_resolution
    }, {
        onSuccess: () => {
            toast.success('Ticket résolu avec succès');
        }
    });
};

// Assigner un ticket
const handleAssignTicket = async (ticketId: number, userId: number) => {
    router.patch(`/tickets/${ticketId}/assigner`, {
        user_id: userId
    }, {
        onSuccess: () => {
            toast.success('Ticket assigné');
        }
    });
};
```

---

## ✅ Routes Todos

### Routes de gestion complète

```php
// Routes pour les todos
Route::post('clients/{client}/todos', [TodoController::class, 'store'])
    ->name('todos.store');

Route::put('clients/{client}/todos/{todo}', [TodoController::class, 'update'])
    ->name('todos.update');

Route::delete('clients/{client}/todos/{todo}', [TodoController::class, 'destroy'])
    ->name('todos.destroy');

Route::patch('clients/{client}/todos/{todo}/toggle', [TodoController::class, 'toggle'])
    ->name('todos.toggle');

Route::patch('clients/{client}/todos/reorder', [TodoController::class, 'reorder'])
    ->name('todos.reorder');
```

**Fonctionnalités spécialisées :**
- **Toggle completion** - Marquer terminé/non-terminé
- **Réorganisation** - Drag & drop avec sauvegarde de l'ordre
- **Scoping client** - Tous les todos liés au client

### Intégration Drag & Drop

```typescript
// Réorganisation des todos
const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex(todo => todo.id === active.id);
    const newIndex = todos.findIndex(todo => todo.id === over.id);
    
    const newTodos = arrayMove(todos, oldIndex, newIndex);
    
    // Mise à jour immédiate de l'UI
    setTodos(newTodos);
    
    // Synchronisation avec le backend
    router.patch(`/clients/${client.id}/todos/reorder`, {
        todo_id: active.id,
        new_order: newIndex + 1
    });
};

// Toggle état todo
const handleToggleTodo = async (todoId: number) => {
    router.patch(`/clients/${client.id}/todos/${todoId}/toggle`, {}, {
        onSuccess: () => {
            // Actualisation automatique de l'UI via Inertia
        }
    });
};
```

---

## 🔒 Middlewares et Protection

### Middleware d'authentification

```php
// Toutes les routes clients sont protégées
Route::middleware(['auth', 'verified'])->group(function () {
    // Routes clients ici
});
```

**Vérifications :**
- **auth** - Utilisateur connecté
- **verified** - Email vérifié
- **Pas de restriction de rôle** - Tous les utilisateurs authentifiés

### AdminMiddleware

```php
class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('error', 'Vous devez être connecté pour accéder à cette page.');
        }

        // Tous les utilisateurs connectés ont accès aux fonctions admin
        if (!Auth::user()->isAdmin()) {
            abort(403, 'Accès non autorisé. Permissions d\'administrateur requises.');
        }

        return $next($request);
    }
}
```

### SuperAdminMiddleware

```php
// Routes d'administration - Protection renforcée
Route::middleware(['superadmin'])->prefix('admin')->name('admin.')->group(function () {
    // Routes super admin
});
```

---

## 🔗 Route Model Binding

### Configuration automatique

```php
// Laravel résout automatiquement les modèles
Route::get('clients/{client}', [ClientController::class, 'show']);
// {client} devient une instance du modèle Client

Route::patch('tickets/{ticket}/resoudre', [TicketController::class, 'resoudre']);
// {ticket} devient une instance du modèle Ticket
```

### Avantages

- **Résolution automatique** - Pas besoin de `find()` manuel
- **404 automatique** - Si modèle non trouvé
- **Type hinting** - Dans les méthodes du contrôleur
- **Performance** - Optimisation des requêtes

### Exemple dans le contrôleur

```php
public function show(Client $client)
{
    // $client est automatiquement résolu
    // Si client inexistant → 404 automatique
    
    return Inertia::render('clients/show', [
        'client' => $client->load([
            'entreprise',
            'devis',
            'emails',
            'opportunities',
            'tickets',
            'todos' => function($query) {
                $query->orderBy('ordre');
            }
        ]),
        'historique' => $client->historique()->with('user')->latest()->get(),
    ]);
}
```

---

## 📍 Nommage des Routes

### Convention de nommage

```php
// Format standard : {resource}.{action}
'clients.index'    // GET /clients
'clients.create'   // GET /clients/create
'clients.store'    // POST /clients
'clients.show'     // GET /clients/{client}
'clients.edit'     // GET /clients/{client}/edit
'clients.update'   // PUT/PATCH /clients/{client}
'clients.destroy'  // DELETE /clients/{client}

// Actions personnalisées : {resource}.{custom-action}
'clients.send-email'        // POST /clients/{client}/send-email
'opportunities.store'       // POST /clients/{client}/opportunities
'tickets.resoudre'         // PATCH /tickets/{ticket}/resoudre
'todos.toggle'             // PATCH /clients/{client}/todos/{todo}/toggle
```

### Utilisation avec route() helper

```php
// Dans les contrôleurs
return redirect()->route('clients.show', $client);
return redirect()->route('clients.index')->with('success', 'Client créé');

// Dans Blade (si utilisé)
<a href="{{ route('clients.edit', $client) }}">Modifier</a>
```

### Utilisation avec Inertia.js

```typescript
// Navigation programmatique
router.visit(route('clients.show', client.id));
router.get(route('clients.index'));

// Dans les formulaires
router.post(route('clients.store'), formData);
router.patch(route('clients.update', client.id), formData);

// Actions spécialisées
router.post(route('clients.send-email', client.id), emailData);
router.patch(route('tickets.resoudre', ticket.id), resolutionData);
```

---

## 🌐 Navigation Inertia.js

### Configuration de base

```typescript
// resources/js/app.tsx
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    title: (title) => `${title} - Dashboard Madinia`,
    resolve: (name) => resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx')
    ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
```

### Navigation dans les composants

```typescript
import { Link, router } from '@inertiajs/react';

// Navigation avec Link
<Link href="/clients" className="nav-link">
    Clients
</Link>

<Link href={`/clients/${client.id}`} className="btn-primary">
    Voir le client
</Link>

// Navigation programmatique
const handleDeleteClient = () => {
    router.delete(`/clients/${client.id}`, {
        onSuccess: () => {
            toast.success('Client supprimé');
        },
        onError: () => {
            toast.error('Erreur lors de la suppression');
        }
    });
};

// Navigation avec données
const handleCreateClient = () => {
    router.post('/clients', formData, {
        onSuccess: () => {
            router.visit('/clients');
        }
    });
};
```

### Breadcrumbs dynamiques

```typescript
// Configuration des breadcrumbs par page
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Clients',
        href: '/clients',
    },
    {
        title: client.nom,
        href: `/clients/${client.id}`,
    },
];

// Utilisation dans le layout
<AppLayout breadcrumbs={breadcrumbs}>
    {/* Contenu de la page */}
</AppLayout>
```

---

## 🔄 Redirections et Réponses

### Redirections après actions

```php
// Dans ClientController
public function store(Request $request)
{
    $client = Client::create($validated);
    
    return redirect()
        ->route('clients.show', $client)
        ->with('success', 'Client créé avec succès');
}

public function update(Request $request, Client $client)
{
    $client->update($validated);
    
    return redirect()
        ->route('clients.show', $client)
        ->with('success', 'Client mis à jour');
}

public function destroy(Client $client)
{
    $client->delete();
    
    return redirect()
        ->route('clients.index')
        ->with('success', 'Client supprimé');
}
```

### Réponses API

```php
// Actions AJAX avec réponses JSON
public function sendEmail(Request $request, Client $client)
{
    // Logique d'envoi email
    
    return response()->json([
        'success' => true,
        'message' => 'Email envoyé avec succès',
        'email_id' => $email->id
    ]);
}

public function toggle(Request $request, Client $client, Todo $todo)
{
    $todo->update(['termine' => !$todo->termine]);
    
    return response()->json([
        'success' => true,
        'todo' => $todo->fresh()
    ]);
}
```

### Gestion des erreurs

```php
// Réponses d'erreur standardisées
public function store(Request $request)
{
    try {
        $client = Client::create($validated);
        return redirect()->route('clients.show', $client);
    } catch (\Exception $e) {
        return redirect()
            ->back()
            ->withInput()
            ->with('error', 'Erreur lors de la création du client');
    }
}
```

---

## 📊 Routes API Spécialisées

### API interne pour les widgets

```php
// API pour récupérer les utilisateurs (tickets)
Route::get('api/users', [TicketController::class, 'getUsers'])
    ->name('api.users');

// API pour l'historique (widgets React)
Route::prefix('api/historique')->name('api.historique.')->group(function () {
    Route::get('/{type}/{id}', [HistoriqueController::class, 'apiHistoriqueEntite'])
        ->name('entite');
});
```

### Utilisation côté React

```typescript
// Chargement des utilisateurs pour les tickets
useEffect(() => {
    const loadUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();
            setUsers(users);
        } catch (error) {
            console.error('Erreur lors du chargement des utilisateurs:', error);
        }
    };

    loadUsers();
}, []);

// Chargement de l'historique
useEffect(() => {
    const loadHistorique = async () => {
        try {
            const response = await fetch(`/api/historique/client/${client.id}`);
            const historique = await response.json();
            setHistorique(historique);
        } catch (error) {
            console.error('Erreur historique:', error);
        }
    };

    loadHistorique();
}, [client.id]);
```

---

## ⚡ Optimisations et Performance

### Route Caching

```bash
# Mise en cache des routes (production)
php artisan route:cache

# Effacer le cache des routes
php artisan route:clear

# Lister toutes les routes
php artisan route:list --name=clients
```

### Eager Loading dans les routes

```php
// Optimisation des requêtes avec eager loading
public function show(Client $client)
{
    $client->load([
        'entreprise',
        'devis' => function($query) {
            $query->latest()->take(10);
        },
        'emails' => function($query) {
            $query->with('user')->latest()->take(20);
        },
        'opportunities' => function($query) {
            $query->with('user')->latest();
        },
        'tickets' => function($query) {
            $query->with(['user', 'creator'])->latest();
        },
        'todos' => function($query) {
            $query->with('user')->orderBy('ordre');
        }
    ]);

    return Inertia::render('clients/show', [
        'client' => $client,
        'historique' => $client->historique()
            ->with('user')
            ->latest()
            ->paginate(50)
    ]);
}
```

### Pagination optimisée

```php
// Pagination pour les grandes listes
public function index(Request $request)
{
    $clients = Client::with('entreprise')
        ->when($request->search, function($query, $search) {
            $query->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        })
        ->when($request->actif !== null, function($query) use ($request) {
            $query->where('actif', $request->boolean('actif'));
        })
        ->latest()
        ->paginate(15)
        ->withQueryString();

    return Inertia::render('clients/index', [
        'clients' => $clients,
        'filters' => $request->only(['search', 'actif'])
    ]);
}
```

---

## 🛡️ Sécurité et Validation

### Protection CSRF

```php
// Automatique pour toutes les routes POST/PUT/PATCH/DELETE
// Token CSRF inclus automatiquement dans les formulaires Inertia

// Vérification manuelle si nécessaire
if (!hash_equals(session()->token(), $request->input('_token'))) {
    abort(419, 'Token CSRF invalide');
}
```

### Rate Limiting

```php
// Dans RouteServiceProvider ou directement sur les routes
Route::middleware(['throttle:60,1'])->group(function () {
    Route::post('clients/{client}/send-email', [ClientController::class, 'sendEmail']);
});

// Rate limiting personnalisé pour les emails
Route::middleware(['throttle:10,1'])->group(function () {
    Route::post('clients/{client}/send-email', [ClientController::class, 'sendEmail']);
});
```

### Validation des paramètres

```php
// Validation automatique avec FormRequest
public function store(StoreClientRequest $request)
{
    // Validation automatique avant l'exécution
    $client = Client::create($request->validated());
    return redirect()->route('clients.show', $client);
}

// Validation des IDs numériques
Route::get('clients/{client}', [ClientController::class, 'show'])
    ->where('client', '[0-9]+');

Route::patch('tickets/{ticket}/resoudre', [TicketController::class, 'resoudre'])
    ->where('ticket', '[0-9]+');
```

---

## 📱 Routes et Navigation Mobile

### Responsive navigation

```typescript
// Navigation adaptative selon la taille d'écran
const isMobile = window.innerWidth < 768;

const navigateToClient = (clientId: number) => {
    if (isMobile) {
        // Navigation directe sur mobile
        router.visit(`/clients/${clientId}`);
    } else {
        // Ouverture dans nouvelle fenêtre sur desktop
        window.open(`/clients/${clientId}`, '_blank');
    }
};
```

### Breadcrumbs mobile

```typescript
// Breadcrumbs condensés pour mobile
const mobileBreadcrumbs = breadcrumbs.slice(-2); // Garde seulement les 2 derniers

<div className="block md:hidden">
    <Breadcrumbs breadcrumbs={mobileBreadcrumbs} />
</div>
<div className="hidden md:block">
    <Breadcrumbs breadcrumbs={breadcrumbs} />
</div>
```

---

## 🎉 Conclusion

Le système de routage clients du Dashboard Madinia offre :

### Architecture robuste

✅ **37+ routes spécialisées** couvrant tous les besoins clients  
✅ **RESTful design** avec route model binding automatique  
✅ **Protection multicouche** via middlewares d'authentification  
✅ **Navigation Inertia.js** seamless sans rechargement de page  
✅ **API intégrées** pour les fonctionnalités avancées  

### Fonctionnalités avancées

✅ **Gestion complète** - CRUD + actions spécialisées  
✅ **Relations automatiques** - Opportunités, tickets, todos  
✅ **Optimisations** - Eager loading, pagination, cache  
✅ **Sécurité** - CSRF, rate limiting, validation  
✅ **Mobile responsive** - Navigation adaptative  

### Performance et évolutivité

✅ **Route caching** pour la production  
✅ **Lazy loading** des composants React  
✅ **Pagination optimisée** pour les grandes listes  
✅ **Eager loading** intelligent des relations  
✅ **API modulaire** pour l'extensibilité  

Cette architecture de routage modulaire et performante constitue la fondation technique solide pour toute la navigation du système de gestion des clients. 