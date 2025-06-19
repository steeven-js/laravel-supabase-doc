# 🔗 Module 7 : Intégrations & Notifications

## 📋 Vue d'ensemble

Le Module 7 finalise la documentation du système Entreprises en couvrant les intégrations avec les autres modules (notifications, historique, seeding) et les systèmes automatiques. Ce module présente l'architecture d'intégration, les systèmes de notifications automatiques, et les outils de développement spécialisés.

## 🔔 Système de Notifications

### **📧 EntrepriseNotification - Classe Principale**

La classe `EntrepriseNotification` gère toutes les notifications liées aux entreprises :

```php
<?php
namespace App\Notifications;

use App\Models\Entreprise;
use Illuminate\Notifications\Notification;

class EntrepriseNotification extends Notification
{
    protected $entreprise;
    protected $action;
    protected $message;

    public function __construct(Entreprise $entreprise, string $action, ?string $message = null)
    {
        $this->entreprise = $entreprise;
        $this->action = $action;
        $this->message = $message;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        $actionMessages = [
            'created' => 'Une nouvelle entreprise a été créée',
            'updated' => 'Une entreprise a été modifiée',
            'deleted' => 'Une entreprise a été supprimée',
        ];

        $title = $actionMessages[$this->action] ?? 'Événement entreprise';
        $message = $this->message ?? "Entreprise: {$this->entreprise->nom}";

        return [
            'title' => $title,
            'message' => $message,
            'model_type' => 'entreprise',
            'model_id' => $this->entreprise->id,
            'action_url' => route('entreprises.show', $this->entreprise->id),
            'icon_type' => 'entreprise',
        ];
    }
}
```

#### **🎯 Caractéristiques de la Notification**

- **Canal unique** : `database` pour persistance
- **Actions trackées** : `created`, `updated`, `deleted`
- **Messages automatiques** : Générés selon l'action
- **URL d'action** : Lien direct vers la page de détail
- **Type d'icône** : `entreprise` pour l'interface

---

## 🔄 Trait SendsNotifications - Intégration Automatique

### **⚡ Fonctionnement Automatique**

Le trait `SendsNotifications` s'intègre automatiquement au modèle `Entreprise` via le système de boot de Laravel :

```php
// Dans Entreprise.php
use App\Traits\SendsNotifications;

class Entreprise extends Model
{
    use SendsNotifications;  // Activation automatique
    // ...
}
```

### **🔧 Mécanisme de Boot du Trait**

```php
protected static function bootSendsNotifications()
{
    // Événement lors de la création
    static::created(function ($model) {
        if (!static::$notificationsDisabled) {
            static::sendNotificationToAdmins($model, 'created');
        }
    });

    // Événement lors de la mise à jour
    static::updated(function ($model) {
        if (!static::$notificationsDisabled) {
            static::sendNotificationToAdmins($model, 'updated');
        }
    });

    // Événement lors de la suppression
    static::deleted(function ($model) {
        if (!static::$notificationsDisabled) {
            static::sendNotificationToAdmins($model, 'deleted');
        }
    });
}
```

#### **👥 Ciblage des Administrateurs**

```php
protected static function sendNotificationToAdmins($model, string $action, ?string $customMessage = null)
{
    // Récupération de tous les admins et super_admins
    $admins = User::whereHas('userRole', function ($query) {
        $query->whereIn('name', ['admin', 'super_admin']);
    })->get();

    if ($admins->isEmpty()) {
        return;
    }

    $notificationClass = static::getNotificationClass($model);

    if ($notificationClass) {
        foreach ($admins as $admin) {
            $admin->notify(new $notificationClass($model, $action, $customMessage));
        }
    }
}
```

---

## 📝 Système d'Historique Intégré

### **🔗 Trait HasHistorique**

Le modèle `Entreprise` utilise le trait `HasHistorique` pour un tracking automatique :

```php
// Dans Entreprise.php
use App\Traits\HasHistorique;

class Entreprise extends Model
{
    use HasHistorique;
    // ...
}
```

### **🔍 Accès à l'Historique**

#### **Dans le Contrôleur** :
```php
public function show(Entreprise $entreprise)
{
    $entreprise->load('clients.devis');
    
    // Récupération de l'historique avec utilisateur
    $historique = $entreprise->historique()
        ->with('user')
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Entreprises/Show', [
        'entreprise' => $entreprise,
        'historique' => $historique,
    ]);
}
```

---

## 🗂️ Routes et Navigation

### **📋 Routes Resource Standard**

```php
// Routes principales (resource standard)
Route::resource('entreprises', EntrepriseController::class);

// Génère automatiquement :
// GET    /entreprises           → index()
// GET    /entreprises/create    → create()
// POST   /entreprises           → store()
// GET    /entreprises/{id}      → show()
// GET    /entreprises/{id}/edit → edit()
// PATCH  /entreprises/{id}      → update()
// DELETE /entreprises/{id}      → destroy()
```

### **🔗 Routes d'Intégration**

#### **1. Historique Spécialisé**
```php
// Historique spécifique par entité
Route::get('/historique/entreprise/{entreprise}', 
    [HistoriqueController::class, 'entreprise']
)->name('historique.entreprise');
```

#### **2. Notifications**
```php
// Notifications accessibles à tous les utilisateurs authentifiés
Route::get('/notifications', [NotificationController::class, 'index'])
    ->name('notifications.index');

// API pour header (notifications temps réel)
Route::get('/notifications/api/header', [NotificationController::class, 'getForHeader'])
    ->name('notifications.api.header');
```

---

## 🌱 Système de Seeding et Données de Test

### **📊 EntrepriseSeeder - Structure Complète**

Le seeder `EntrepriseSeeder` crée des données réalistes pour le développement et les tests.

#### **🎯 Spécificités du Seeder**

##### **1. Localisation Française**
- **Faker français** : `fr_FR` pour des données réalistes
- **SIRET/SIREN** : Numéros d'entreprise français valides
- **Adresses** : Villes et codes postaux français
- **Téléphones** : Format téléphonique français

##### **2. Données Métier Réalistes**
- **Secteurs d'activité** : 10 secteurs business variés
- **Formes juridiques** : SARL, SAS, SA, EURL
- **Probabilités** : 95% d'entreprises actives, 70% avec nom commercial

---

## 🔄 Intégrations avec Autres Modules

### **👥 Relation avec le Module Clients**

#### **1. Liens Bidirectionnels**
```php
// Dans le modèle Client
public function entreprise()
{
    return $this->belongsTo(Entreprise::class);
}

// Dans le modèle Entreprise  
public function clients()
{
    return $this->hasMany(Client::class);
}
```

#### **2. Navigation Intégrée**
```typescript
// Liens de navigation dans les vues
<Link href={`/clients/create?entreprise_id=${entreprise.id}`}>
    <UserPlus className="mr-2 h-4 w-4" />
    Nouveau client
</Link>
```

### **📄 Intégration avec Devis/Factures**

#### **1. Relations Indirectes**
```
Entreprise → Clients → Devis
Entreprise → Clients → Factures
```

#### **2. Statistiques Agrégées**
```typescript
// Calcul du CA total via clients
const allDevis = entreprise.clients.flatMap(client =>
    client.devis.map(devis => ({ ...devis, client }))
);

const totalRevenue = allDevis
    .filter(d => d.statut === 'accepte')
    .reduce((sum, d) => sum + d.montant_ttc, 0);
```

---

## 🛡️ Sécurité et Contrôle d'Accès

### **🔒 Middleware de Protection**

```php
// Protection par authentification
Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('entreprises', EntrepriseController::class);
});

// Notifications réservées aux admins
Route::middleware(['admin'])->prefix('notifications')->group(function () {
    // Routes notifications admin
});
```

### **👥 Contrôle des Rôles**

#### **1. Accès aux Entreprises**
- **Tous les utilisateurs authentifiés** : Lecture/écriture entreprises
- **Admins** : Notifications, gestion avancée
- **Super Admins** : Monitoring, routes de développement

#### **2. Notifications Ciblées**
```php
// Seuls les admins et super_admins reçoivent les notifications
$admins = User::whereHas('userRole', function ($query) {
    $query->whereIn('name', ['admin', 'super_admin']);
})->get();
```

---

## ⚡ Optimisations et Performance

### **🔧 Optimisations Backend**

#### **1. Relations Optimisées**
```php
// Chargement optimisé avec relations imbriquées
$entreprise->load('clients.devis');

// WithCount pour éviter les requêtes N+1
Entreprise::withCount('clients')->get();
```

### **📊 Optimisations Frontend**

#### **1. Calculs Côté Client**
- **Statistiques temps réel** : Évite les appels API
- **Agrégations JavaScript** : Performance instantanée
- **Cache des calculs** : Possible avec `useMemo`

---

## 📚 Comparaison avec le Système Clients

### **🔄 Similitudes**

| Aspect | Entreprises | Clients |
|--------|-------------|---------|
| **Notifications** | ✅ Automatiques | ✅ Automatiques |
| **Historique** | ✅ HasHistorique | ✅ HasHistorique |
| **CRUD complet** | ✅ 7 méthodes | ✅ 7 méthodes |
| **Interface React** | ✅ 4 pages | ✅ 4 pages |
| **Seeder dédié** | ✅ EntrepriseSeeder | ✅ ClientSeeder |

### **⚖️ Différences**

| Aspect | Entreprises | Clients |
|--------|-------------|---------|
| **Envoi d'emails** | ❌ Non supporté | ✅ Système complet |
| **PDF dédiés** | ❌ Non nécessaire | ✅ Génération possible |
| **Relations principales** | → Clients | → Entreprise, Devis, Factures |
| **Champs métier** | SIRET, SIREN, secteur | Plus orienté contact |
| **Complexité** | 🟢 Simple | 🟠 Complexe |

---

## ✅ Récapitulatif Final

### **🎯 Systèmes Intégrés Documentés**

1. ✅ **Notifications automatiques** via `EntrepriseNotification` et `SendsNotifications`
2. ✅ **Historique complet** via `HasHistorique` et routes dédiées
3. ✅ **Seeding professionnel** avec données françaises réalistes
4. ✅ **Routes d'intégration** pour navigation multi-modules
5. ✅ **Sécurité et contrôles** d'accès par rôles
6. ✅ **Optimisations performance** backend et frontend

### **🔗 Points d'Intégration Majeurs**

- **Avec Clients** : Relations bidirectionnelles et navigation fluide
- **Avec Notifications** : Système automatique pour tous les admins
- **Avec Historique** : Tracking complet des actions
- **Avec Analytics** : Données historique dans les statistiques
- **Avec Seeding** : Données de test réalistes pour développement

### **📊 Architecture Complète**

Le Module 7 finalise une architecture d'entreprises **complètement intégrée** dans l'écosystème Dashboard Madinia, avec des systèmes automatiques, des intégrations fluides, et une maintenabilité optimale.

---

*Module 7 terminé - Documentation technique Entreprises 100% complète*
