# 🎯 Module 2 : Modèle Client & Relations

## 📋 Objectif du Module

Ce module documente en détail le modèle Eloquent `Client.php`, ses relations complexes, ses attributs, scopes, accesseurs et les traits utilisés. Il constitue le cœur du système de gestion des clients.

---

## 🏗️ Structure du Modèle Client

### **Définition de Classe**

```php
<?php

namespace App\Models;

use App\Traits\HasHistorique;
use App\Traits\SendsNotifications;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasHistorique, SendsNotifications;
    
    // 150 lignes de code
    // 7 relations Eloquent
    // 3 scopes personnalisés
    // 3 accesseurs calculés
    // 2 traits avancés
}
```

### **Analyse Structurelle**

| **Aspect** | **Détail** | **Complexité** | **Notes** |
|------------|------------|----------------|-----------|
| **Lignes de code** | 150 lignes | 🟡 Moyenne | Bien structuré et documenté |
| **Relations** | 7 relations | ⚡ Élevée | Couverture complète des entités |
| **Scopes** | 3 scopes | 🟢 Faible | Recherche et filtrage optimisés |
| **Accesseurs** | 3 accesseurs | 🟢 Faible | Données calculées intelligentes |
| **Traits** | 2 traits | 🟡 Moyenne | Fonctionnalités automatiques |

---

## 📊 Attributs et Configuration

### **Attributs Fillable (Mass Assignment)**

```php
protected $fillable = [
    'nom',           // ✅ Obligatoire - Nom de famille
    'prenom',        // ✅ Obligatoire - Prénom
    'email',         // ✅ Unique - Email de contact
    'telephone',     // 📞 Optionnel - Numéro de téléphone
    'adresse',       // 🏠 Optionnel - Adresse complète
    'ville',         // 🏙️ Optionnel - Ville
    'code_postal',   // 📮 Optionnel - Code postal
    'pays',          // 🌍 Optionnel - Pays (défaut: France)
    'actif',         // ✅ Boolean - Statut actif/inactif
    'notes',         // 📝 Optionnel - Notes internes
    'entreprise_id', // 🏢 FK - Relation entreprise (nullable)
];
```

#### **Détail des Attributs**

| **Attribut** | **Type** | **Contraintes** | **Valeur Défaut** | **Usage** |
|--------------|----------|-----------------|-------------------|-----------|
| `nom` | `string(255)` | **required** | - | Nom de famille obligatoire |
| `prenom` | `string(255)` | **required** | - | Prénom obligatoire |
| `email` | `string(255)` | **unique, email** | - | Contact principal unique |
| `telephone` | `string(255)` | nullable | - | Contact secondaire |
| `adresse` | `text` | nullable | - | Adresse postale complète |
| `ville` | `string(255)` | nullable | - | Ville de résidence |
| `code_postal` | `string(10)` | nullable | - | Code postal français |
| `pays` | `string(255)` | nullable | `'France'` | Pays de résidence |
| `actif` | `boolean` | - | `true` | Statut d'activation |
| `notes` | `text` | nullable | - | Notes internes libres |
| `entreprise_id` | `bigint` | **FK nullable** | `null` | Relation optionnelle |

### **Casts de Type (Type Casting)**

```php
protected $casts = [
    'actif' => 'boolean',  // ✅ Conversion automatique 0/1 → true/false
];
```

#### **Avantages des Casts**

- ✅ **Type Safety** : Garantit le type boolean pour `actif`
- ✅ **Simplicité** : Conversion automatique depuis la base
- ✅ **Cohérence** : Évite les erreurs de comparaison (`'0'` vs `false`)

---

## 🔗 Relations Eloquent Complètes

### **1. Relation Entreprise (N:1)**

```php
/**
 * Relation avec l'entreprise.
 * Un client peut appartenir à une entreprise (optionnel)
 */
public function entreprise(): BelongsTo
{
    return $this->belongsTo(Entreprise::class);
}
```

**Caractéristiques :**
- 🔄 **Type** : `BelongsTo` (Many-to-One)
- 🎯 **Cardinalité** : N clients → 1 entreprise
- ⚠️ **Nullable** : Un client peut ne pas avoir d'entreprise
- 🔑 **Clé étrangère** : `entreprise_id`

### **2. Relation Devis (1:N)**

```php
/**
 * Relation avec les devis.
 * Un client peut avoir plusieurs devis
 */
public function devis(): HasMany
{
    return $this->hasMany(Devis::class);
}
```

**Caractéristiques :**
- 🔄 **Type** : `HasMany` (One-to-Many)
- 🎯 **Cardinalité** : 1 client → N devis
- 📊 **Usage métier** : Suivi des propositions commerciales
- 🔄 **Cascade** : Gestion de la suppression des devis

### **3. Relation Factures (1:N)**

```php
/**
 * Relation avec les factures.
 * Un client peut avoir plusieurs factures
 */
public function factures(): HasMany
{
    return $this->hasMany(Facture::class);
}
```

**Caractéristiques :**
- 🔄 **Type** : `HasMany` (One-to-Many)
- 🎯 **Cardinalité** : 1 client → N factures
- 💰 **Usage métier** : Facturation et suivi financier
- 📈 **Analytics** : Calcul du CA par client

### **4. Relation Emails (1:N avec tri)**

```php
/**
 * Relation avec les emails envoyés.
 * Emails triés par date d'envoi décroissante
 */
public function emails(): HasMany
{
    return $this->hasMany(ClientEmail::class)->orderBy('date_envoi', 'desc');
}
```

**Caractéristiques :**
- 🔄 **Type** : `HasMany` avec tri automatique
- 📧 **Modèle cible** : `ClientEmail`
- 📅 **Tri** : `date_envoi DESC` (plus récents en premier)
- 📊 **Tracking** : Historique complet des communications

### **5. Relation Opportunités (1:N avec tri)**

```php
/**
 * Relation avec les opportunités.
 * Opportunités triées par date de création décroissante
 */
public function opportunities(): HasMany
{
    return $this->hasMany(Opportunity::class)->orderBy('created_at', 'desc');
}
```

**Caractéristiques :**
- 🔄 **Type** : `HasMany` avec tri automatique
- 🎯 **Usage métier** : Pipeline commercial et CRM
- 📊 **Suivi** : Étapes, probabilités, montants
- 🔄 **Workflow** : De prospection à fermeture

### **6. Relation Tickets (1:N avec tri)**

```php
/**
 * Relation avec les tickets.
 * Tickets triés par date de création décroissante
 */
public function tickets(): HasMany
{
    return $this->hasMany(Ticket::class)->orderBy('created_at', 'desc');
}
```

**Caractéristiques :**
- 🔄 **Type** : `HasMany` avec tri automatique
- 🎫 **Usage métier** : Support client et SAV
- 🏷️ **Gestion** : Priorités, statuts, assignation
- 📞 **Suivi** : Résolution et satisfaction

### **7. Relation Todos (1:N avec ordre)**

```php
/**
 * Relation avec les todos.
 * Todos triés par ordre croissant
 */
public function todos(): HasMany
{
    return $this->hasMany(Todo::class)->orderBy('ordre');
}
```

**Caractéristiques :**
- 🔄 **Type** : `HasMany` avec tri par ordre
- ✅ **Usage métier** : Tâches et rappels client
- 🔢 **Ordre** : Tri par priorité via champ `ordre`
- ⏰ **Échéances** : Gestion des dates limites

---

## 🎯 Scopes Personnalisés (Query Scopes)

### **1. Scope `actifs()` - Filtrage par Statut**

```php
/**
 * Scope pour les clients actifs uniquement
 * Usage: Client::actifs()->get()
 */
public function scopeActifs($query)
{
    return $query->where('actif', true);
}
```

**Utilisation :**
```php
// ✅ Récupérer uniquement les clients actifs
$clientsActifs = Client::actifs()->get();

// ✅ Combinaison avec d'autres méthodes
$clientsActifsAvecEntreprise = Client::actifs()
    ->with('entreprise')
    ->orderBy('nom')
    ->get();
```

### **2. Scope `rechercheNom()` - Recherche Textuelle**

```php
/**
 * Scope pour rechercher par nom ou prénom
 * Usage: Client::rechercheNom('Jean')->get()
 */
public function scopeRechercheNom($query, $terme)
{
    return $query->where(function ($q) use ($terme) {
        $q->where('nom', 'LIKE', "%{$terme}%")
          ->orWhere('prenom', 'LIKE', "%{$terme}%");
    });
}
```

**Utilisation :**
```php
// ✅ Recherche par nom ou prénom
$clients = Client::rechercheNom('Martin')->get();

// ✅ Recherche combinée avec filtres
$clientsRecherche = Client::actifs()
    ->rechercheNom('Jean')
    ->with('entreprise')
    ->get();
```

**Avantages :**
- 🔍 **Recherche intelligente** : nom OU prénom
- 💪 **Recherche partielle** : `LIKE` avec wildcards
- 🔄 **Combinable** : Peut être chaîné avec d'autres scopes

### **3. Scope `parEntreprise()` - Filtrage par Entreprise**

```php
/**
 * Scope pour les clients d'une entreprise spécifique
 * Usage: Client::parEntreprise(5)->get()
 */
public function scopeParEntreprise($query, $entrepriseId)
{
    return $query->where('entreprise_id', $entrepriseId);
}
```

**Utilisation :**
```php
// ✅ Clients d'une entreprise spécifique
$clientsEntreprise = Client::parEntreprise(5)->get();

// ✅ Clients actifs d'une entreprise
$clientsActifsEntreprise = Client::actifs()
    ->parEntreprise(5)
    ->get();
```

---

## ⚡ Accesseurs Calculés (Computed Attributes)

### **1. Accesseur `nomComplet` - Nom d'Affichage**

```php
/**
 * Retourne le nom complet du client
 * Usage: $client->nom_complet
 */
public function getNomCompletAttribute(): string
{
    return $this->prenom . ' ' . $this->nom;
}
```

**Utilisation :**
```php
$client = Client::find(1);
echo $client->nom_complet; // "Jean Martin"

// ✅ Utilisation dans les vues
{{ $client->nom_complet }}

// ✅ Utilisation dans les APIs
return response()->json([
    'nom_complet' => $client->nom_complet
]);
```

### **2. Accesseur `totalDevisAcceptes` - Calcul Financier**

```php
/**
 * Obtenir le total des devis acceptés du client
 * Usage: $client->total_devis_acceptes
 */
public function getTotalDevisAcceptesAttribute(): float
{
    return $this->devis()
                ->where('statut', 'accepte')
                ->sum('montant_ttc');
}
```

**Utilisation :**
```php
$client = Client::find(1);
$chiffreAffaires = $client->total_devis_acceptes; // Ex: 15750.00

// ✅ Formatage pour affichage
$caFormate = number_format($client->total_devis_acceptes, 2, ',', ' ') . ' €';
```

**Performance :**
- ⚠️ **Attention** : Requête SQL à chaque accès
- 💡 **Optimisation** : Utiliser avec parcimonie ou mettre en cache
- 🔄 **Alternative** : Calculer en batch et stocker

### **3. Accesseur `nombreDevisEnAttente` - Compteur Métier**

```php
/**
 * Obtenir le nombre de devis en attente
 * Usage: $client->nombre_devis_en_attente
 */
public function getNombreDevisEnAttenteAttribute(): int
{
    return $this->devis()
                ->whereIn('statut', ['brouillon', 'envoye'])
                ->count();
}
```

**Utilisation :**
```php
$client = Client::find(1);
$devisEnAttente = $client->nombre_devis_en_attente; // Ex: 3

// ✅ Conditionnels métier
if ($client->nombre_devis_en_attente > 0) {
    // Afficher badge "Devis en attente"
}
```

---

## 🔧 Traits Utilisés

### **1. Trait `HasHistorique` - Historique Automatique**

```php
use App\Traits\HasHistorique;
```

#### **Fonctionnalités Apportées**

| **Méthode** | **Usage** | **Description** |
|-------------|-----------|-----------------|
| `historique()` | `$client->historique` | Relation polymorphe vers les logs |
| `enregistrerHistorique()` | Manuel | Ajouter une entrée d'historique |
| `getHistoriqueCreation()` | Analytics | Récupérer l'historique de création |
| `getHistoriqueModifications()` | Audit | Liste des modifications |

#### **Événements Automatiques**

```php
// ✅ Création automatiquement loggée
$client = Client::create([...]);
// → Historique: "Création de Client #123"

// ✅ Modification automatiquement loggée
$client->update(['nom' => 'Nouveau nom']);
// → Historique: "Modification de Client #123"

// ✅ Suppression automatiquement loggée
$client->delete();
// → Historique: "Suppression de Client #123"
```

### **2. Trait `SendsNotifications` - Notifications Automatiques**

```php
use App\Traits\SendsNotifications;
```

#### **Fonctionnalités Apportées**

| **Méthode** | **Usage** | **Description** |
|-------------|-----------|-----------------|
| `sendCustomNotification()` | Manuel | Envoyer notification personnalisée |
| `disableNotifications()` | Statique | Désactiver temporairement |
| `enableNotifications()` | Statique | Réactiver les notifications |

#### **Notifications Automatiques**

```php
// ✅ Création notifie tous les admins
$client = Client::create([...]);
// → AdminNotification envoyée

// ✅ Modification notifie tous les admins
$client->update([...]);
// → AdminNotification envoyée

// ✅ Notification personnalisée
$client->sendCustomNotification('email_envoye', 'Email envoyé au client');
```

---

## 🚀 Exemples d'Utilisation Avancés

### **1. Requête Complexe avec Relations**

```php
// ✅ Chargement optimisé avec toutes les relations
$clients = Client::with([
    'entreprise',
    'devis' => function($query) {
        $query->where('statut', 'accepte')->orderBy('created_at', 'desc');
    },
    'emails' => function($query) {
        $query->limit(5); // 5 derniers emails
    },
    'opportunities.user',
    'tickets' => function($query) {
        $query->where('statut', '!=', 'ferme');
    }
])
->actifs()
->rechercheNom('Martin')
->orderBy('nom')
->paginate(20);
```

### **2. Calculs et Agrégations**

```php
// ✅ Statistiques par client
$client = Client::with(['devis', 'factures'])->find(1);

$stats = [
    'ca_total' => $client->total_devis_acceptes,
    'devis_en_attente' => $client->nombre_devis_en_attente,
    'factures_impayees' => $client->factures()
        ->where('statut', '!=', 'payee')
        ->count(),
    'derniere_communication' => $client->emails()->first()?->date_envoi,
];
```

---

## ⚡ Optimisations et Performance

### **1. Eager Loading Stratégique**

```php
// ❌ Problème N+1
$clients = Client::all();
foreach ($clients as $client) {
    echo $client->entreprise->nom; // Requête à chaque itération
}

// ✅ Solution optimisée
$clients = Client::with('entreprise')->all();
foreach ($clients as $client) {
    echo $client->entreprise->nom; // Pas de requête supplémentaire
}
```

### **2. Scopes Performants**

```php
// ✅ Index recommandés
// Migration: $table->index(['actif', 'created_at']);
$clientsRecents = Client::actifs()
    ->where('created_at', '>=', now()->subDays(30))
    ->orderBy('created_at', 'desc')
    ->get();
```

---

## 🎯 Bonnes Pratiques Identifiées

### **✅ Points Forts du Modèle**

1. **Relations bien définies** : Couverture complète de l'écosystème client
2. **Scopes utiles** : Recherche et filtrage optimisés
3. **Accesseurs intelligents** : Données calculées métier
4. **Traits réutilisables** : Historique et notifications automatiques
5. **Type safety** : Casts appropriés pour les booleans
6. **Documentation complète** : Chaque méthode est documentée

### **🔄 Améliorations Possibles**

1. **Cache des accesseurs** : Optimiser les calculs coûteux
2. **Validation personnalisée** : Ajouter des règles métier
3. **Events personnalisés** : Étendre les événements automatiques
4. **API Resources** : Transformation standardisée pour APIs
5. **Soft Deletes** : Gestion de la suppression logique

---

*Documentation générée le 19 janvier 2025 - Dashboard Madinia v2.0* 