# Module 2 : Modèle Entreprise & Relations

## Introduction

Le modèle `Entreprise` constitue l'**entité centrale** du système de gestion B2B du Dashboard Madinia. Avec ses **99 lignes de code**, il implémente une **architecture épurée** focalisée sur les **données métier essentielles** et les **relations stratégiques** vers les clients.

Ce module explore en détail la structure du modèle, ses **14 champs spécialisés**, ses **relations optimisées**, et ses **fonctionnalités avancées** via les traits intégrés.

---

## 🏗️ Structure du Modèle

### Vue d'ensemble

```php
<?php

namespace App\Models;

use App\Traits\HasHistorique;
use App\Traits\SendsNotifications;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entreprise extends Model
{
    use HasHistorique, SendsNotifications;
    
    // Configuration et relations (99 lignes total)
}
```

### Architecture du fichier

```
Entreprise.php (99 lignes)
├── Ligne 1-8   : Namespace et imports
├── Ligne 9-11  : Déclaration classe + traits  
├── Ligne 13-26 : Champs fillable (14 champs)
├── Ligne 28-32 : Casts de types
├── Ligne 34-38 : Relation clients (HasMany)
├── Ligne 40-45 : Scope actives
├── Ligne 47-53 : Scope recherche nom
├── Ligne 55-59 : Scope par secteur
├── Ligne 61-66 : Accesseur nom affichage
├── Ligne 68-77 : Accesseur adresse complète
└── Ligne 79-99 : Fin de classe
```

---

## 📊 Champs et Propriétés

### Champs Fillable (14 champs)

```php
protected $fillable = [
    // Identification (4 champs)
    'nom',              // string(255) - OBLIGATOIRE - Raison sociale
    'nom_commercial',   // string(255) - nullable - Nom d'usage
    'siret',           // string(255) - nullable + unique - Identification officielle
    'siren',           // string(255) - nullable - Numéro entreprise
    
    // Métier (1 champ)
    'secteur_activite', // string(255) - nullable - Catégorisation business
    
    // Géolocalisation (4 champs)
    'adresse',         // text - nullable - Adresse complète
    'ville',           // string(255) - nullable
    'code_postal',     // string(255) - nullable
    'pays',            // string(255) - nullable, default 'France'
    
    // Contact (3 champs)
    'telephone',       // string(255) - nullable
    'email',           // string(255) - nullable
    'site_web',        // string(255) - nullable
    
    // Gestion (2 champs)
    'active',          // boolean - default true
    'notes',           // text - nullable - Informations complémentaires
];
```

### Détail des champs métier

#### **Identification Enterprise**

```php
// Champ obligatoire unique
'nom' => 'required|string|max:255'
// Exemples : "Madinia SARL", "Tech Solutions SAS"

// Nom commercial optionnel (marque)
'nom_commercial' => 'nullable|string|max:255'  
// Exemples : "Madinia", "TechSol"

// SIRET : 14 chiffres (SIREN + NIC)
'siret' => 'nullable|string|unique:entreprises,siret'
// Format : 12345678901234 (validation côté client recommandée)

// SIREN : 9 chiffres (numéro entreprise)
'siren' => 'nullable|string|max:9'
// Format : 123456789 (extrait automatiquement du SIRET si besoin)
```

#### **Secteur d'Activité**

```php
'secteur_activite' => 'nullable|string|max:255'

// Exemples de valeurs courantes :
- "Informatique et services numériques"
- "Conseil en management"  
- "Commerce de détail"
- "Industrie manufacturière"
- "Services aux entreprises"
- "Santé et action sociale"
- "Éducation et formation"
```

#### **Géolocalisation Structurée**

```php
// Adresse complète libre
'adresse' => 'nullable|text'
// Exemple : "123 Avenue des Champs-Élysées\nBâtiment A, 3ème étage"

// Ville normalisée
'ville' => 'nullable|string|max:255'
// Exemple : "Paris", "Lyon", "Marseille"

// Code postal français/international
'code_postal' => 'nullable|string|max:10'
// Exemple : "75008", "69001", "AB1 2CD" (UK)

// Pays avec défaut France
'pays' => 'nullable|string|max:255|default:France'
// Gestion internationale possible
```

### Casts de Types

```php
protected $casts = [
    'active' => 'boolean',  // Conversion automatique 0/1 → false/true
];

// Utilisation automatique :
$entreprise->active; // boolean true/false (pas "1"/"0")
```

---

## 🔗 Relations Eloquent

### Relation Principale : Clients

```php
/**
 * Relation avec les clients.
 * Une entreprise peut avoir plusieurs clients
 */
public function clients(): HasMany
{
    return $this->hasMany(Client::class);
}
```

#### **Utilisation pratique**

```php
// Récupération des clients d'une entreprise
$entreprise = Entreprise::find(1);
$clients = $entreprise->clients; // Collection de clients

// Avec contraintes
$clientsActifs = $entreprise->clients()->where('actif', true)->get();

// Comptage optimisé (évite N+1)
$entreprises = Entreprise::withCount('clients')->get();
foreach ($entreprises as $entreprise) {
    echo $entreprise->clients_count; // Nombre de clients
}

// Eager loading pour performance
$entreprise = Entreprise::with('clients')->find(1);
// Les clients sont déjà chargés, pas de requête supplémentaire
```

### Relations Indirectes (via Clients)

Bien que non définies directement dans le modèle, les entreprises accèdent aux données via leurs clients :

```php
// Via les clients → Devis
$entreprise->load('clients.devis');
$devis = $entreprise->clients->flatMap->devis;

// Via les clients → Factures
$entreprise->load('clients.factures');
$factures = $entreprise->clients->flatMap->factures;

// Via les clients → Opportunités
$entreprise->load('clients.opportunities');
$opportunities = $entreprise->clients->flatMap->opportunities;

// Via les clients → Tickets
$entreprise->load('clients.tickets');
$tickets = $entreprise->clients->flatMap->tickets;
```

### Optimisations de Requêtes

```php
// Dans EntrepriseController::index()
Entreprise::withCount('clients')
    ->orderBy('created_at', 'desc')
    ->get();
// SQL : SELECT *, (SELECT COUNT(*) FROM clients WHERE...) as clients_count

// Dans EntrepriseController::show()
$entreprise->load('clients.devis');
// SQL optimisé avec eager loading, évite N+1

// Requêtes conditionnelles
$entreprise->loadCount([
    'clients',
    'clients as clients_actifs_count' => function ($query) {
        $query->where('actif', true);
    }
]);
```

---

## 🔍 Scopes Eloquent

### 1. Scope Actives

```php
/**
 * Scope pour les entreprises actives.
 */
public function scopeActives($query)
{
    return $query->where('active', true);
}
```

**Utilisation** :
```php
// Toutes les entreprises actives
$entreprisesActives = Entreprise::actives()->get();

// Combinaison avec autres contraintes
$entreprisesParisActives = Entreprise::actives()
    ->where('ville', 'Paris')
    ->get();

// Avec relations
$entreprisesAvecClients = Entreprise::actives()
    ->has('clients')
    ->withCount('clients')
    ->get();
```

### 2. Scope Recherche Nom

```php
/**
 * Scope pour rechercher par nom.
 */
public function scopeRechercheNom($query, $terme)
{
    return $query->where(function ($q) use ($terme) {
        $q->where('nom', 'LIKE', "%{$terme}%")
          ->orWhere('nom_commercial', 'LIKE', "%{$terme}%");
    });
}
```

**Utilisation** :
```php
// Recherche dans nom ou nom_commercial
$entreprises = Entreprise::rechercheNom('Madinia')->get();

// Recherche insensible à la casse (PostgreSQL)
$entreprises = Entreprise::rechercheNom('madinia')->get();

// Combinaison avec filtres
$entreprises = Entreprise::actives()
    ->rechercheNom('Tech')
    ->parSecteur('Informatique')
    ->get();
```

**Logique de recherche** :
- Recherche dans `nom` (raison sociale)
- **OU** recherche dans `nom_commercial` (marque)
- Recherche par **LIKE** avec wildcards `%terme%`
- **Insensible** aux espaces en début/fin (trim automatique)

### 3. Scope Par Secteur

```php
/**
 * Scope par secteur d'activité.
 */
public function scopeParSecteur($query, $secteur)
{
    return $query->where('secteur_activite', $secteur);
}
```

**Utilisation** :
```php
// Entreprises du secteur informatique
$techCompanies = Entreprise::parSecteur('Informatique et services numériques')->get();

// Statistiques par secteur
$secteurs = Entreprise::select('secteur_activite')
    ->groupBy('secteur_activite')
    ->havingRaw('COUNT(*) > 1')
    ->get();

// Combinaisons avancées
$grossesEntreprisesIT = Entreprise::parSecteur('Informatique')
    ->withCount('clients')
    ->having('clients_count', '>', 10)
    ->get();
```

### Chaînage des Scopes

```php
// Exemple de requête complexe avec chaînage
$entreprisesFiltrees = Entreprise::actives()
    ->rechercheNom($searchTerm)
    ->parSecteur($secteurFilter)
    ->withCount(['clients' => function ($query) {
        $query->where('actif', true);
    }])
    ->orderBy('clients_count', 'desc')
    ->paginate(15);

// SQL généré (approximatif) :
/*
SELECT entreprises.*, 
       (SELECT COUNT(*) FROM clients 
        WHERE clients.entreprise_id = entreprises.id 
        AND clients.actif = true) as clients_count
FROM entreprises 
WHERE active = true 
  AND (nom LIKE '%terme%' OR nom_commercial LIKE '%terme%')
  AND secteur_activite = 'Secteur'
ORDER BY clients_count DESC
LIMIT 15 OFFSET 0
*/
```

---

## 🎯 Accesseurs (Computed Properties)

### 1. Nom d'Affichage

```php
/**
 * Retourne le nom d'affichage (commercial ou nom).
 */
public function getNomAffichageAttribute(): string
{
    return $this->nom_commercial ?: $this->nom;
}
```

**Logique** :
- Si `nom_commercial` existe → utilise le nom commercial
- Sinon → utilise le `nom` (raison sociale)
- **Jamais null** : toujours une chaîne valide

**Utilisation** :
```php
$entreprise = Entreprise::find(1);

// Cas 1 : Avec nom commercial
// nom = "Madinia SARL", nom_commercial = "Madinia"
echo $entreprise->nom_affichage; // "Madinia"

// Cas 2 : Sans nom commercial  
// nom = "Tech Solutions SAS", nom_commercial = null
echo $entreprise->nom_affichage; // "Tech Solutions SAS"

// Dans Blade/React
<h1>{{ $entreprise->nom_affichage }}</h1>
// Ou en React : {entreprise.nom_affichage}
```

### 2. Adresse Complète

```php
/**
 * Retourne l'adresse complète.
 */
public function getAdresseCompleteAttribute(): string
{
    $adresse = $this->adresse;
    if ($this->ville) {
        $adresse .= ($adresse ? ', ' : '') . $this->code_postal . ' ' . $this->ville;
    }
    if ($this->pays && $this->pays !== 'France') {
        $adresse .= ', ' . $this->pays;
    }
    return $adresse;
}
```

**Logique de construction** :
1. **Base** : `adresse` (peut être vide)
2. **Ville** : Ajoute `code_postal + ville` si ville existe
3. **Pays** : Ajoute le pays seulement si différent de "France"
4. **Séparateurs** : Virgules intelligentes (pas de virgule en début)

**Exemples de sortie** :
```php
// Cas complet France
$entreprise = new Entreprise([
    'adresse' => '123 Avenue des Champs-Élysées',
    'code_postal' => '75008', 
    'ville' => 'Paris',
    'pays' => 'France'
]);
echo $entreprise->adresse_complete;
// "123 Avenue des Champs-Élysées, 75008 Paris"

// Cas international
$entreprise = new Entreprise([
    'adresse' => '10 Downing Street',
    'code_postal' => 'SW1A 2AA',
    'ville' => 'London', 
    'pays' => 'United Kingdom'
]);
echo $entreprise->adresse_complete;
// "10 Downing Street, SW1A 2AA London, United Kingdom"

// Cas minimal (ville uniquement)
$entreprise = new Entreprise([
    'adresse' => null,
    'code_postal' => '69001',
    'ville' => 'Lyon',
    'pays' => 'France'
]);
echo $entreprise->adresse_complete;
// "69001 Lyon"

// Cas vide
$entreprise = new Entreprise([
    'adresse' => null,
    'ville' => null
]);
echo $entreprise->adresse_complete;
// "" (chaîne vide)
```

**Utilisation pratique** :
```php
// Dans les templates
<div class="adresse">
    {{ $entreprise->adresse_complete }}
</div>

// Dans les APIs JSON
return [
    'id' => $entreprise->id,
    'nom' => $entreprise->nom_affichage,
    'adresse' => $entreprise->adresse_complete,
];

// Pour les mailings
$adressePostale = $entreprise->adresse_complete;
if ($adressePostale) {
    echo "Adresse : " . $adressePostale;
}
```

---

## 🧩 Traits Intégrés

### 1. HasHistorique

Le trait `HasHistorique` ajoute un **système de traçabilité automatique** à chaque entreprise.

```php
use App\Traits\HasHistorique;

// Fonctionnalités automatiques :
class Entreprise extends Model 
{
    use HasHistorique;
    
    // Événements automatiques déclenchés :
    // - created   : Lors de la création
    // - updated   : Lors de modifications  
    // - deleted   : Lors de suppression
}
```

**Historique automatique** :
```php
// Création d'entreprise
$entreprise = Entreprise::create([
    'nom' => 'Nouvelle Entreprise SARL',
    'secteur_activite' => 'Services'
]);
// → Historique "Création d'entreprise" automatiquement créé

// Modification
$entreprise->update(['secteur_activite' => 'Informatique']);
// → Historique "Modification d'entreprise" avec avant/après

// Récupération de l'historique
$historique = $entreprise->historique()
    ->with('user')
    ->orderBy('created_at', 'desc')
    ->get();
```

**Structure de l'historique** :
```php
// Exemple d'entrée historique
[
    'id' => 123,
    'historiable_type' => 'App\\Models\\Entreprise',
    'historiable_id' => 45,
    'action' => 'updated',
    'titre' => 'Modification d\'entreprise',
    'description' => 'Secteur d\'activité modifié',
    'donnees_avant' => ['secteur_activite' => 'Services'],
    'donnees_apres' => ['secteur_activite' => 'Informatique'],
    'user_id' => 12,
    'user_nom' => 'Jean Dupont',
    'user_email' => 'jean@example.com',
    'created_at' => '2025-01-19 14:30:00'
]
```

### 2. SendsNotifications

Le trait `SendsNotifications` envoie des **notifications automatiques** aux administrateurs.

```php
use App\Traits\SendsNotifications;

// Notifications automatiques déclenchées :
class Entreprise extends Model 
{
    use SendsNotifications;
    
    // Événements qui déclenchent des notifications :
    // - created   → Notification "Nouvelle entreprise créée"
    // - updated   → Notification "Entreprise modifiée"  
    // - deleted   → Notification "Entreprise supprimée"
}
```

**Types de notifications** :
```php
// Notification de création
AdminNotification::create([
    'type' => 'entreprise_created',
    'title' => 'Nouvelle entreprise créée',
    'message' => 'L\'entreprise "Madinia SARL" a été créée par Jean Dupont',
    'data' => [
        'entreprise_id' => 45,
        'entreprise_nom' => 'Madinia SARL',
        'created_by' => 'Jean Dupont'
    ],
    'user_id' => null, // Pour tous les admins
]);

// Notification de modification
AdminNotification::create([
    'type' => 'entreprise_updated', 
    'title' => 'Entreprise modifiée',
    'message' => 'L\'entreprise "Madinia SARL" a été modifiée',
    'data' => [
        'entreprise_id' => 45,
        'changes' => ['secteur_activite' => 'Informatique'],
        'updated_by' => 'Marie Martin'
    ]
]);
```

**Destinataires des notifications** :
```php
// Envoyées automatiquement à :
- Tous les utilisateurs avec le rôle 'admin'
- Tous les utilisateurs avec le rôle 'super_admin'

// Récupération côté admin
$notifications = Auth::user()->notifications()
    ->where('type', 'like', 'entreprise_%')
    ->orderBy('created_at', 'desc')
    ->get();
```

---

## 🔄 Relations Inverses et Dépendances

### Relations depuis autres modèles

```php
// Dans le modèle Client
class Client extends Model 
{
    public function entreprise(): BelongsTo
    {
        return $this->belongsTo(Entreprise::class);
    }
}

// Utilisation bidirectionnelle
$client = Client::find(1);
$entreprise = $client->entreprise; // Entreprise du client

$entreprise = Entreprise::find(1);
$clients = $entreprise->clients; // Clients de l'entreprise
```

### Contraintes d'Intégrité

```php
// Dans les migrations
Schema::table('clients', function (Blueprint $table) {
    $table->foreignId('entreprise_id')
          ->nullable()
          ->constrained('entreprises')
          ->nullOnDelete(); // Si entreprise supprimée → null
});

// Ou avec cascade selon les besoins métier
->cascadeOnDelete(); // Si entreprise supprimée → clients supprimés
```

### Gestion des Suppressions

```php
// Dans EntrepriseController::destroy()
public function destroy(Entreprise $entreprise)
{
    try {
        // Vérification des dépendances
        if ($entreprise->clients()->exists()) {
            return back()->with('error', 
                'Impossible de supprimer une entreprise avec des clients associés.');
        }
        
        $entreprise->delete();
        return redirect()->route('entreprises.index')
            ->with('success', 'Entreprise supprimée avec succès.');
            
    } catch (Exception $e) {
        return back()->with('error', 
            'Erreur lors de la suppression de l\'entreprise.');
    }
}

// Alternative : archivage plutôt que suppression
$entreprise->update(['active' => false]);
```

---

## 📊 Méthodes Calculées et Statistiques

### Ajout de méthodes personnalisées

Bien que non présentes dans le modèle actuel, voici des **extensions recommandées** :

```php
// Ajouts suggérés au modèle Entreprise
class Entreprise extends Model 
{
    /**
     * Nombre de clients actifs
     */
    public function getClientsActifsCountAttribute(): int
    {
        return $this->clients()->where('actif', true)->count();
    }
    
    /**
     * Chiffre d'affaires total (via devis acceptés)
     */
    public function getChiffreAffairesTotalAttribute(): float
    {
        return $this->clients()
            ->with('devis')
            ->get()
            ->flatMap->devis
            ->where('statut', 'accepte')
            ->sum('montant_total');
    }
    
    /**
     * Dernière activité (dernière modification client/devis/facture)
     */
    public function getDerniereActiviteAttribute(): ?Carbon
    {
        $dates = [];
        
        // Dernière modif clients
        $lastClient = $this->clients()->latest('updated_at')->first();
        if ($lastClient) $dates[] = $lastClient->updated_at;
        
        // Dernière modif devis via clients
        $lastDevis = $this->clients()
            ->with('devis')
            ->get()
            ->flatMap->devis
            ->sortByDesc('updated_at')
            ->first();
        if ($lastDevis) $dates[] = $lastDevis->updated_at;
        
        return $dates ? collect($dates)->max() : null;
    }
    
    /**
     * Secteur d'activité formaté
     */
    public function getSecteurFormateAttribute(): string
    {
        return $this->secteur_activite ?? 'Non spécifié';
    }
    
    /**
     * Statut affiché
     */
    public function getStatutAfficheAttribute(): string
    {
        return $this->active ? 'Active' : 'Inactive';
    }
}
```

### Utilisation des méthodes calculées

```php
// Dans les contrôleurs
$entreprise = Entreprise::with('clients.devis')->find(1);

$stats = [
    'clients_actifs' => $entreprise->clients_actifs_count,
    'chiffre_affaires' => $entreprise->chiffre_affaires_total,
    'derniere_activite' => $entreprise->derniere_activite,
    'secteur' => $entreprise->secteur_formate,
    'statut' => $entreprise->statut_affiche,
];

// Dans les APIs
return response()->json([
    'entreprise' => $entreprise,
    'statistiques' => $stats,
]);
```

---

## 🔧 Validation et Règles Métier

### Règles de validation

```php
// Dans EntrepriseController (store/update)
$rules = [
    'nom' => 'required|string|max:255',
    'nom_commercial' => 'nullable|string|max:255',
    'siret' => [
        'nullable',
        'string',
        'regex:/^[0-9]{14}$/', // 14 chiffres exactement
        'unique:entreprises,siret' . ($entreprise ? ',' . $entreprise->id : ''),
    ],
    'siren' => [
        'nullable', 
        'string',
        'regex:/^[0-9]{9}$/', // 9 chiffres exactement
    ],
    'secteur_activite' => 'nullable|string|max:255',
    'email' => 'nullable|email|max:255',
    'site_web' => 'nullable|url|max:255',
    'telephone' => [
        'nullable',
        'string',
        'regex:/^[0-9\s\-\+\(\)\.]+$/', // Format téléphone flexible
    ],
    'code_postal' => [
        'nullable',
        'string', 
        'regex:/^[0-9A-Z\s\-]{2,10}$/', // Codes postaux internationaux
    ],
    'active' => 'boolean',
];
```

### Validation côté modèle (recommandée)

```php
// Ajout de mutateurs pour nettoyage automatique
class Entreprise extends Model 
{
    /**
     * Nettoie le SIRET (supprime espaces, tirets)
     */
    public function setSiretAttribute($value)
    {
        $this->attributes['siret'] = $value ? 
            preg_replace('/[^0-9]/', '', $value) : null;
    }
    
    /**
     * Nettoie le SIREN
     */
    public function setSirenAttribute($value) 
    {
        $this->attributes['siren'] = $value ?
            preg_replace('/[^0-9]/', '', $value) : null;
    }
    
    /**
     * Formate l'email en minuscules
     */
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = $value ? 
            strtolower(trim($value)) : null;
    }
    
    /**
     * Nettoie l'URL (ajoute https si manquant)
     */
    public function setSiteWebAttribute($value)
    {
        if ($value && !preg_match('/^https?:\/\//', $value)) {
            $value = 'https://' . $value;
        }
        $this->attributes['site_web'] = $value;
    }
}
```

---

## 🎯 Bonnes Pratiques d'Utilisation

### 1. Chargement Optimisé

```php
// ✅ Correct : Évite les requêtes N+1
$entreprises = Entreprise::with(['clients' => function ($query) {
    $query->where('actif', true);
}])->get();

// ✅ Correct : Comptage optimisé
$entreprises = Entreprise::withCount([
    'clients',
    'clients as clients_actifs_count' => function ($query) {
        $query->where('actif', true);
    }
])->get();

// ❌ Incorrect : Provoque N+1 queries
$entreprises = Entreprise::all();
foreach ($entreprises as $entreprise) {
    echo $entreprise->clients->count(); // N requêtes supplémentaires
}
```

### 2. Filtrage Efficace

```php
// ✅ Correct : Utilise les scopes
$entreprises = Entreprise::actives()
    ->rechercheNom($searchTerm)
    ->parSecteur($secteur)
    ->get();

// ✅ Correct : Requête unique avec conditions
$entreprises = Entreprise::where('active', true)
    ->where(function ($q) use ($searchTerm) {
        $q->where('nom', 'LIKE', "%{$searchTerm}%")
          ->orWhere('nom_commercial', 'LIKE', "%{$searchTerm}%");
    })
    ->where('secteur_activite', $secteur)
    ->get();

// ❌ Incorrect : Filtrage en PHP
$entreprises = Entreprise::all()->filter(function ($entreprise) use ($searchTerm) {
    return strpos($entreprise->nom, $searchTerm) !== false;
}); // Charge toutes les entreprises en mémoire
```

### 3. Gestion des Relations

```php
// ✅ Correct : Vérification d'existence avant suppression
if ($entreprise->clients()->exists()) {
    return back()->with('error', 'Entreprise liée à des clients');
}

// ✅ Correct : Suppression avec transaction
DB::transaction(function () use ($entreprise) {
    // Archiver les clients plutôt que supprimer
    $entreprise->clients()->update(['actif' => false]);
    $entreprise->delete();
});

// ✅ Correct : Soft delete recommandé
class Entreprise extends Model 
{
    use SoftDeletes;
    
    protected $dates = ['deleted_at'];
}
```

### 4. Accesseurs Intelligents

```php
// ✅ Correct : Accesseurs avec valeurs par défaut
public function getNomAffichageAttribute(): string
{
    return $this->nom_commercial ?: $this->nom ?: 'Entreprise sans nom';
}

// ✅ Correct : Gestion des null dans adresse complète
public function getAdresseCompleteAttribute(): string
{
    $parts = array_filter([
        $this->adresse,
        trim(($this->code_postal ?? '') . ' ' . ($this->ville ?? '')),
        ($this->pays && $this->pays !== 'France') ? $this->pays : null
    ]);
    
    return implode(', ', $parts);
}
```

---

## 🎉 Conclusion

### Modèle Entreprise : Simplicité et Efficacité

Le modèle `Entreprise` illustre parfaitement les **principes SOLID** et **DRY** :

✅ **Single Responsibility** - Se concentre uniquement sur les données B2B  
✅ **Open/Closed** - Extensible via traits sans modification  
✅ **Interface Segregation** - Méthodes spécialisées via scopes  
✅ **Dependency Inversion** - Relations via interfaces Eloquent  

### Points Forts Architecturaux

🏗️ **Structure épurée** - 99 lignes pour une fonctionnalité complète  
🔗 **Relations optimisées** - HasMany vers clients avec eager loading  
🎯 **Scopes métier** - Recherche, filtrage et tri intégrés  
🧩 **Traits modulaires** - Historique et notifications automatiques  
📊 **Accesseurs intelligents** - Données calculées à la demande  

### Évolutions Recommandées

**Court terme** :
- Validation SIRET/SIREN via API gouvernementale
- Géolocalisation automatique des adresses
- Cache des statistiques calculées

**Moyen terme** :  
- Soft deletes pour préservation des données
- Méthodes de statistiques avancées
- Relations vers contrats et documents

**Long terme** :
- IA pour catégorisation automatique des secteurs
- Intégration APIs comptables (Sage, EBP)
- Système de scoring entreprise

Le modèle `Entreprise` constitue une **base solide** pour l'évolution du système de gestion B2B, alliant **simplicité d'usage** et **robustesse technique**.