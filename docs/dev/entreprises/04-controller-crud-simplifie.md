# 🎮 Module 4 : EntrepriseController - CRUD Simplifié

## 📋 Vue d'ensemble

L'`EntrepriseController` implémente un système CRUD optimisé et simplifié, spécialement conçu pour la gestion des entreprises B2B. Contrairement aux contrôleurs plus complexes comme `ClientController`, il se concentre sur l'essentiel avec une logique métier claire et des validations spécialisées.

## 🏗️ Architecture du Contrôleur

### 📁 Fichier : `EntrepriseController.php` (180 lignes)

```php
<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Exception;

class EntrepriseController extends Controller
{
    // 7 méthodes CRUD principales
    // Gestion d'erreurs unifiée
    // Intégration Inertia.js
    // Validation métier spécialisée
}
```

### 🎯 Caractéristiques Principales

- ✅ **CRUD Complet** : 7 méthodes standard Laravel
- ✅ **Validation Spécialisée** : SIRET, URL, email
- ✅ **Gestion d'Erreurs** : Try/catch avec messages utilisateur
- ✅ **Relations Optimisées** : `withCount()` et `load()`
- ✅ **Intégration Inertia** : Pages React directes
- ✅ **Messages Contextuels** : Avec emojis et noms d'entreprise

## 📋 Méthodes CRUD Détaillées

### **1. Index - Liste des Entreprises**

```php
public function index()
{
    $entreprises = Entreprise::withCount('clients')
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('entreprises/index', [
        'entreprises' => $entreprises
    ]);
}
```

**🔍 Points Clés :**
- ✅ `withCount('clients')` : Optimise en évitant N+1 queries
- ✅ `orderBy('created_at', 'desc')` : Plus récentes en premier
- ✅ Retour Inertia direct vers React
- ✅ Données simples, pas de pagination complexe

**📊 Données Fournies :**
```javascript
// Côté React
entreprises: [
  {
    id: 1,
    nom: "Digital Innovation SAS",
    nom_commercial: "Digital Innovation",
    secteur_activite: "IT",
    clients_count: 3,  // ← Optimisation withCount
    active: true,
    created_at: "2025-01-19T..."
  }
]
```

### **2. Create - Formulaire de Création**

```php
public function create()
{
    return Inertia::render('entreprises/create');
}
```

**🎯 Simplicité Maximale :**
- ✅ Aucune donnée supplémentaire nécessaire
- ✅ Pas de listes déroulantes complexes
- ✅ Secteurs d'activité en saisie libre
- ✅ Page React autonome

### **3. Store - Création d'Entreprise**

```php
public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'nom_commercial' => 'nullable|string|max:255',
            'siret' => 'nullable|string|unique:entreprises,siret',
            'siren' => 'nullable|string|max:9',
            'secteur_activite' => 'nullable|string|max:255',
            'adresse' => 'nullable|string',
            'ville' => 'nullable|string|max:255',
            'code_postal' => 'nullable|string|max:10',
            'pays' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'site_web' => 'nullable|url|max:255',
            'notes' => 'nullable|string',
        ]);

        $entreprise = Entreprise::create($validated);

        return redirect()->route('entreprises.index')
            ->with('success', '✅ Entreprise ' . 
                ($entreprise->nom_commercial ?: $entreprise->nom) . 
                ' créée avec succès !');

    } catch (ValidationException $e) {
        return back()
            ->withErrors($e->errors())
            ->withInput()
            ->with('error', '❌ Erreur de validation.');
    } catch (Exception $e) {
        return back()
            ->withInput()
            ->with('error', '❌ Une erreur est survenue.');
    }
}
```

**🔍 Validations Spécialisées :**

#### **SIRET Unique**
```php
'siret' => 'nullable|string|unique:entreprises,siret'
```
- ✅ Nullable : Entreprises internationales sans SIRET
- ✅ Unique : Évite les doublons français
- ✅ String : Format flexible

#### **Email et URL**
```php
'email' => 'nullable|email|max:255',
'site_web' => 'nullable|url|max:255',
```
- ✅ Validation automatique des formats
- ✅ Optionnels mais vérifiés si fournis

#### **Champs Flexibles**
```php
'secteur_activite' => 'nullable|string|max:255', // Pas d'enum !
'adresse' => 'nullable|string',                  // Text libre
'siren' => 'nullable|string|max:9',              // 9 caractères max
```

**💡 Message de Succès Intelligent :**
```php
'✅ Entreprise ' . ($entreprise->nom_commercial ?: $entreprise->nom) . ' créée avec succès !'
```
- Utilise le nom commercial si disponible
- Sinon utilise le nom complet
- Message personnalisé et engageant

### **4. Show - Affichage Détaillé**

```php
public function show(Entreprise $entreprise)
{
    $entreprise->load('clients.devis');

    // Récupérer l'historique avec utilisateurs
    $historique = $entreprise->historique()
        ->with('user')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($action) {
            return [
                'id' => $action->id,
                'action' => $action->action,
                'titre' => $action->titre,
                'description' => $action->description,
                'donnees_avant' => $action->donnees_avant,
                'donnees_apres' => $action->donnees_apres,
                'donnees_supplementaires' => $action->donnees_supplementaires,
                'created_at' => $action->created_at->toISOString(),
                'user' => $action->user ? [
                    'id' => $action->user->id,
                    'name' => $action->user->name,
                    'email' => $action->user->email,
                ] : null,
                'user_nom' => $action->user_nom,
                'user_email' => $action->user_email,
            ];
        });

    return Inertia::render('entreprises/show', [
        'entreprise' => $entreprise,
        'historique' => $historique
    ]);
}
```

**🔍 Chargement des Relations :**

#### **Relations Imbriquées**
```php
$entreprise->load('clients.devis');
```
- ✅ Charge clients ET leurs devis
- ✅ Évite les requêtes N+1
- ✅ Données nécessaires pour les statistiques

#### **Historique Optimisé**
```php
$historique = $entreprise->historique()
    ->with('user')                    // Relation user si existe
    ->orderBy('created_at', 'desc')   // Plus récent en premier
    ->get()
    ->map(function ($action) {        // Formatage pour React
        // Transformation en format standardisé
    });
```

**📊 Données Formatées pour React :**
```javascript
// Structure standardisée côté frontend
{
  entreprise: {
    id: 1,
    nom: "Digital Innovation SAS",
    clients: [
      {
        id: 1,
        devis: [...] // Devis du client
      }
    ]
  },
  historique: [
    {
      id: 1,
      action: "created",
      created_at: "2025-01-19T...",
      user: { name: "Admin", email: "..." }
    }
  ]
}
```

### **5. Edit - Formulaire d'Édition**

```php
public function edit(Entreprise $entreprise)
{
    return Inertia::render('entreprises/edit', [
        'entreprise' => $entreprise
    ]);
}
```

**🎯 Simplicité :**
- ✅ Seules les données de l'entreprise
- ✅ Pas de relations chargées (inutiles pour l'édition)
- ✅ Page React autonome

### **6. Update - Mise à Jour**

```php
public function update(Request $request, Entreprise $entreprise)
{
    try {
        $validated = $request->validate([
            // ... mêmes validations que store
            'siret' => 'nullable|string|unique:entreprises,siret,' . $entreprise->id,
            'active' => 'boolean', // ← Nouveau : gestion du statut
            // ...
        ]);

        $entreprise->update($validated);

        return redirect()->route('entreprises.index')
            ->with('success', '🎉 Entreprise ' . 
                ($entreprise->nom_commercial ?: $entreprise->nom) . 
                ' mise à jour avec succès !');

    } catch (ValidationException $e) {
        // ... gestion d'erreurs identique
    }
}
```

**🔍 Différences avec Store :**

#### **SIRET Unique avec Exception**
```php
'siret' => 'nullable|string|unique:entreprises,siret,' . $entreprise->id
```
- ✅ Exclut l'entreprise actuelle de la vérification
- ✅ Permet de modifier sans changer le SIRET

#### **Gestion Statut Actif**
```php
'active' => 'boolean',
```
- ✅ Ajouté uniquement en update
- ✅ Permet d'activer/désactiver l'entreprise

### **7. Destroy - Suppression**

```php
public function destroy(Entreprise $entreprise)
{
    try {
        $nom_entreprise = $entreprise->nom_commercial ?: $entreprise->nom;
        $entreprise->delete();

        return redirect()->route('entreprises.index')
            ->with('warning', '⚠️ Entreprise ' . $nom_entreprise . ' supprimée avec succès.');

    } catch (Exception $e) {
        return back()
            ->with('error', '❌ Impossible de supprimer l\'entreprise. ' .
                'Elle pourrait être liée à d\'autres données.');
    }
}
```

**🔍 Sécurités Implémentées :**
- ✅ Sauvegarde du nom avant suppression
- ✅ Gestion d'exception pour contraintes FK
- ✅ Message d'erreur explicite si problème
- ✅ Type de toast 'warning' pour suppression

## 🎯 Différences avec ClientController

### **📊 Comparaison Fonctionnelle**

| Fonctionnalité | EntrepriseController | ClientController |
|----------------|---------------------|------------------|
| **Lignes de code** | 180 | 552 |
| **Complexité** | ⭐⭐ Simple | ⭐⭐⭐⭐⭐ Complexe |
| **Emails** | ❌ Aucun | ✅ Système complet |
| **PDF** | ❌ Aucun | ✅ Génération |
| **Relations** | Clients | Entreprise, Devis, Factures, Emails |
| **Validations** | SIRET, URL | Multiples formats |
| **Pagination** | ❌ Simple get() | ✅ Pagination avancée |

### **🎯 Points Communs**

- ✅ **Structure CRUD** : Même pattern Laravel
- ✅ **Inertia.js** : Intégration identique
- ✅ **Gestion d'erreurs** : Try/catch similaire
- ✅ **Messages flash** : Même système de notifications
- ✅ **Traits** : HasHistorique et SendsNotifications

### **⚡ Avantages de la Simplicité**

1. **Performance** : Moins de requêtes complexes
2. **Maintenance** : Code plus lisible et debuggable
3. **Évolutivité** : Plus facile d'ajouter des fonctionnalités
4. **Tests** : Plus simple à tester unitairement

## 🔧 Optimisations Techniques

### **📈 Performances**

#### **Relations Optimisées**
```php
// Index : Compte sans charger
Entreprise::withCount('clients')

// Show : Charge relations nécessaires
$entreprise->load('clients.devis')
```

#### **Requêtes Minimales**
```php
// Une seule requête pour la liste
->orderBy('created_at', 'desc')->get()

// Pas de pagination complexe (simplicité)
```

### **🛡️ Sécurité**

#### **Validation Stricte**
```php
// Types explicites
'email' => 'nullable|email|max:255',
'site_web' => 'nullable|url|max:255',

// Limites de taille
'nom' => 'required|string|max:255',
'siren' => 'nullable|string|max:9',
```

#### **Gestion d'Exceptions**
```php
try {
    // Opération
} catch (ValidationException $e) {
    // Erreurs utilisateur
} catch (Exception $e) {
    // Erreurs système
}
```

## 🔗 Intégration avec l'Écosystème

### **📋 Routes Web**

```php
// Routes ressource standard
Route::resource('entreprises', EntrepriseController::class);
```

**Routes générées :**
- `GET /entreprises` → index()
- `GET /entreprises/create` → create()
- `POST /entreprises` → store()
- `GET /entreprises/{entreprise}` → show()
- `GET /entreprises/{entreprise}/edit` → edit()
- `PUT/PATCH /entreprises/{entreprise}` → update()
- `DELETE /entreprises/{entreprise}` → destroy()

### **🔔 Notifications Automatiques**

Grâce au trait `SendsNotifications` :

```php
// Actions qui déclenchent des notifications automatiques
$entreprise = Entreprise::create($validated); // → notification création
$entreprise->update($validated);              // → notification modification
$entreprise->delete();                        // → notification suppression
```

### **📝 Historique Automatique**

Grâce au trait `HasHistorique` :

```php
// Toutes les actions sont automatiquement loggées
// Voir l'historique dans show() via $entreprise->historique()
```

## 🧪 Tests et Validation

### **🔍 Scénarios de Test Recommandés**

#### **Validation SIRET**
```php
// Test unicité SIRET
$entreprise1 = Entreprise::create(['nom' => 'Test 1', 'siret' => '12345678901234']);
$entreprise2 = Entreprise::create(['nom' => 'Test 2', 'siret' => '12345678901234']); // Doit échouer
```

#### **Messages Personnalisés**
```php
// Test nom commercial vs nom
$entreprise = Entreprise::create([
    'nom' => 'Entreprise Longue SARL',
    'nom_commercial' => 'EntrepriseCourte'
]);
// Message doit utiliser 'EntrepriseCourte'
```

#### **Relations et Performances**
```php
// Test withCount
$entreprises = Entreprise::withCount('clients')->get();
// Doit éviter N+1 queries
```

## 📚 Bonnes Pratiques Identifiées

### **✅ Pattern de Validation**
```php
// Même structure pour store() et update()
$validated = $request->validate([...]);
$model->create($validated); // ou ->update($validated)
```

### **✅ Messages Contextuels**
```php
// Utilisation du nom d'affichage optimal
($entreprise->nom_commercial ?: $entreprise->nom)
```

### **✅ Gestion d'Erreurs Unifiée**
```php
try {
    // Logique métier
} catch (ValidationException $e) {
    return back()->withErrors($e->errors())->withInput();
} catch (Exception $e) {
    return back()->with('error', 'Message générique');
}
```

### **✅ Optimisation Relations**
```php
// Selon le contexte
withCount() // Pour les listes
load()      // Pour les détails
with()      // Pour les requêtes initiales
```

---

## 📚 Références

- **Contrôleur** : `app/Http/Controllers/EntrepriseController.php`
- **Modèle** : `app/Models/Entreprise.php` (Module 2)
- **Routes** : `routes/web.php` ligne 60-61
- **Pages React** : `resources/js/pages/entreprises/`

---

*Module 4 terminé - Contrôleur et logique CRUD documentés* 