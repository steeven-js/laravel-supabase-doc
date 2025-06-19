# Module 1 : Vue d'ensemble Architecture Entreprises

## Introduction

Le système de gestion des **entreprises** du Dashboard Madinia constitue un **pilier central** de l'architecture métier. Contrairement au système clients qui gère les contacts individuels, le module entreprises se concentre sur la **gestion B2B** avec des spécificités métier (SIRET, secteurs d'activité) et sert de **pivot relationnel** vers les clients et leurs devis/factures.

---

## 🏗️ Architecture Générale

### Vue d'ensemble du système

```
Dashboard Madinia - Architecture Entreprises
├── 🏢 ENTREPRISES (Module Central)
│   ├── Données B2B (SIRET, SIREN, secteurs)
│   ├── Relations vers clients
│   └── Statistiques calculées
│
├── 👥 CLIENTS (Module Dépendant)
│   ├── Attachés à une entreprise
│   ├── Héritent du contexte B2B
│   └── Génèrent devis/factures
│
└── 📊 ANALYTICS (Module Dérivé)
    ├── Agrégations par entreprise
    ├── Revenus via clients
    └── Statistiques sectorielles
```

### Position dans l'écosystème

**Rôle de pivot** : Les entreprises servent de **point d'entrée principal** pour :
- **Gestion commerciale** B2B avec informations métier
- **Centralisation des clients** d'une même structure
- **Agrégation des données** financières (via clients → devis → factures)
- **Segmentation sectorielle** pour analyses business

---

## 🎯 Modèle en Couches

### 1. Couche Données (Database)

```sql
-- Table entreprises (14 champs spécialisés)
CREATE TABLE entreprises (
    id BIGINT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,              -- Seul champ obligatoire
    nom_commercial VARCHAR(255),            -- Nom d'usage
    siret VARCHAR(255) UNIQUE,              -- Identification unique
    siren VARCHAR(255),                     -- Numéro entreprise
    secteur_activite VARCHAR(255),          -- Catégorisation métier
    
    -- Adresse complète
    adresse TEXT,
    ville VARCHAR(255),
    code_postal VARCHAR(255),
    pays VARCHAR(255) DEFAULT 'France',
    
    -- Contact
    telephone VARCHAR(255),
    email VARCHAR(255),
    site_web VARCHAR(255),
    
    -- Gestion
    active BOOLEAN DEFAULT true,
    notes TEXT,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**Contraintes métier** :
- `nom` : Champ obligatoire pour identification
- `siret` : Unique pour éviter les doublons
- `active` : Statut par défaut à `true`
- `pays` : Défaut à "France" pour localisation

### 2. Couche Modèle (Eloquent)

```php
class Entreprise extends Model
{
    use HasHistorique, SendsNotifications;
    
    // 14 champs fillable pour assignation en masse
    protected $fillable = [
        'nom', 'nom_commercial', 'siret', 'siren', 'secteur_activite',
        'adresse', 'ville', 'code_postal', 'pays', 
        'telephone', 'email', 'site_web', 'active', 'notes'
    ];
    
    // Relation principale : clients
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }
    
    // Scopes métier
    public function scopeActives($query)         // Entreprises actives
    public function scopeRechercheNom($query)    // Recherche textuelle
    public function scopeParSecteur($query)      // Filtrage sectoriel
    
    // Accesseurs calculés
    public function getNomAffichageAttribute()   // Commercial ou nom
    public function getAdresseCompleteAttribute() // Adresse formatée
}
```

**Traits intégrés** :
- **HasHistorique** : Traçabilité automatique des actions
- **SendsNotifications** : Notifications aux admins

### 3. Couche Contrôleur (HTTP)

```php
class EntrepriseController extends Controller
{
    // CRUD Simplifié (pas d'emails ni PDF comme clients)
    public function index()    // Liste avec compteurs clients
    public function create()   // Formulaire création
    public function store()    // Validation et sauvegarde
    public function show()     // Détails avec clients et historique
    public function edit()     // Formulaire édition
    public function update()   // Modification avec validation SIRET unique
    public function destroy()  // Suppression avec vérification relations
}
```

**Logique spécifique** :
- `withCount('clients')` dans `index()` pour statistiques
- Validation SIRET unique avec exception pour modification
- Chargement `load('clients.devis')` pour statistiques calculées

### 4. Couche Présentation (React)

```typescript
// Structure des pages React (2341+ lignes total)
pages/entreprises/
├── index.tsx     (461 lignes) - Liste avec filtres secteur/statut
├── create.tsx    (267 lignes) - Formulaire création B2B
├── edit.tsx      (289 lignes) - Formulaire édition
└── show.tsx      (959 lignes) - Vue détaillée avec onglets analytics
```

**Interface orientée B2B** :
- Filtrage par **secteur d'activité**
- Validation **SIRET/SIREN** côté client
- **Onglets spécialisés** (vue d'ensemble, clients, stats, historique)
- **Statistiques calculées** en temps réel

---

## 🔄 Flow de Données

### Schéma du flow principal

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ENTREPRISES   │───▶│     CLIENTS     │───▶│ DEVIS/FACTURES  │
│                 │    │                 │    │                 │
│ • Données B2B   │    │ • Contacts      │    │ • Documents     │
│ • SIRET/SIREN   │    │ • Opportunités  │    │ • Montants      │
│ • Secteur       │    │ • Tickets       │    │ • PDFs          │
│ • Coordonnées   │    │ • Todos         │    │ • Emails        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                     ┌─────────────────┐
                     │   STATISTIQUES  │
                     │                 │
                     │ • Revenus/entrep│
                     │ • Clients actifs│
                     │ • Devis en cours│
                     │ • Analytics     │
                     └─────────────────┘
```

### 1. Flux de création

```
Utilisateur → Formulaire B2B → Validation → Sauvegarde → Notifications
    │              │              │             │            │
    │              │              │             │            ▼
    │              │              │             │       Admins alertés
    │              │              │             ▼
    │              │              │        Historique créé
    │              │              ▼
    │              │         SIRET unique vérifié
    │              ▼
    │         Champs B2B validés
    ▼
Saisit données entreprise
```

### 2. Flux de consultation

```
Page show → Chargement relations → Calculs statistiques → Affichage onglets
     │            │                       │                    │
     │            │                       │                    ▼
     │            │                       │              Vue d'ensemble
     │            │                       │              Clients
     │            │                       │              Statistiques
     │            │                       │              Historique
     │            │                       ▼
     │            │              Revenus = Σ(clients.devis)
     │            │              Clients actifs
     │            │              Devis en cours
     │            ▼
     │       load('clients.devis')
     │       historique()->with('user')
     ▼
Entreprise sélectionnée
```

### 3. Flux de statistiques

```
Frontend → API entreprise → Relations → Calculs → Cache → Affichage
    │           │             │          │        │         │
    │           │             │          │        │         ▼
    │           │             │          │        │    Jauges React
    │           │             │          │        ▼
    │           │             │          │   Cache 5min
    │           │             │          ▼
    │           │             │     Agrégations SQL
    │           │             ▼
    │           │        Clients → Devis → Montants
    │           ▼
    │      Eager loading optimisé
    ▼
Demande analytics
```

---

## 🔍 Différences avec le Système Clients

### Comparaison architecturale

| Aspect | 🏢 **Entreprises** | 👥 **Clients** |
|--------|-------------------|-----------------|
| **Complexité** | Simple (CRUD de base) | Complexe (emails, PDF, workflows) |
| **Champs** | 14 champs B2B spécialisés | 16+ champs personnels + relations |
| **Relations** | HasMany clients | BelongsTo entreprise + 6 autres relations |
| **Emails** | ❌ Aucun système email | ✅ ClientEmailMailable + tracking |
| **PDF** | ❌ Pas de génération PDF | ✅ React PDF avec templates |
| **Notifications** | ✅ Basiques (CRUD only) | ✅ Avancées (emails, workflows) |
| **Workflows** | ❌ Statut simple actif/inactif | ✅ Opportunités, tickets, todos |
| **Interface** | 4 pages React (2341 lignes) | 4 pages React (4773 lignes) |
| **Statistiques** | ✅ Calculées via relations | ✅ Directes + via entreprise |

### Spécificités techniques

#### **Entreprises (Plus Simple)**

```php
// Validation de base
$validated = $request->validate([
    'nom' => 'required|string|max:255',
    'siret' => 'nullable|string|unique:entreprises,siret',
    'email' => 'nullable|email|max:255',
    // ... autres champs B2B
]);

// Pas d'emails spécialisés
// Pas de PDF
// Statut binaire (active/inactive)
```

#### **Clients (Plus Complexe)**

```php
// Validation étendue + relations
$validated = $request->validate([
    'nom' => 'required|string|max:255',
    'entreprise_id' => 'nullable|exists:entreprises,id',
    'email' => 'required|email|unique:clients,email',
    // ... champs personnels + métier
]);

// Système d'emails complet
// Génération PDF React
// Workflows multi-états
// Relations complexes (6+ modèles)
```

### Rôles architecturaux

#### **Entreprises : Pivot Central**
- **Point d'entrée** pour la gestion B2B
- **Conteneur** pour les clients d'une structure
- **Agrégateur** de statistiques métier
- **Simplificateur** des workflows complexes

#### **Clients : Nœud Opérationnel**
- **Acteurs principaux** des workflows
- **Générateurs** de documents (devis/factures)
- **Destinataires** des communications
- **Porteurs** de l'activité commerciale

---

## 📊 Analytics et Statistiques

### Modèle de calcul des métriques

```php
// Dans EntrepriseController::show()
$entreprise->load('clients.devis');

// Statistiques calculées côté backend
$stats = [
    'clients_total' => $entreprise->clients->count(),
    'clients_actifs' => $entreprise->clients->where('actif', true)->count(),
    'devis_total' => $entreprise->clients->sum(fn($client) => $client->devis->count()),
    'devis_acceptes' => $entreprise->clients->sum(fn($client) => 
        $client->devis->where('statut', 'accepte')->count()
    ),
    'revenus_total' => $entreprise->clients->sum(fn($client) => 
        $client->devis->where('statut', 'accepte')->sum('montant_total')
    ),
];
```

### Interface Analytics React

```typescript
// Dans show.tsx - Onglet Statistiques
const StatistiquesTab = ({ entreprise }) => {
    const stats = useMemo(() => {
        const clients = entreprise.clients || [];
        const devis = clients.flatMap(client => client.devis || []);
        
        return {
            clientsActifs: clients.filter(c => c.actif).length,
            devisEnCours: devis.filter(d => d.statut === 'en_attente').length,
            devisAcceptes: devis.filter(d => d.statut === 'accepte').length,
            revenus: devis
                .filter(d => d.statut === 'accepte')
                .reduce((sum, d) => sum + (d.montant_total || 0), 0)
        };
    }, [entreprise]);

    return (
        <div className="grid-2">
            <div className="info-card">
                <div className="info-icon-users"></div>
                <div>
                    <div className="text-2xl font-bold text-green-600">
                        {stats.clientsActifs}
                    </div>
                    <div className="text-sm text-gray-600">Clients actifs</div>
                </div>
            </div>
            {/* Autres métriques... */}
        </div>
    );
};
```

---

## 🔄 Intégrations avec l'Écosystème

### Relations en cascade

```php
// Impact d'une modification d'entreprise
Entreprise::updated() 
    → HasHistorique trait 
        → Historique créé
    → SendsNotifications trait 
        → AdminNotification envoyée

// Suppression avec vérifications
Entreprise::deleting()
    → Vérifier clients associés
    → Empêcher si relations actives
    → Ou proposition de transfert/archivage
```

### Workflows intégrés

**Création d'entreprise** :
1. Validation des données B2B (SIRET unique)
2. Sauvegarde avec traits automatiques
3. Notification aux admins
4. Historique de création
5. Redirection vers liste avec message succès

**Ajout de client** :
1. Sélection entreprise existante ou création
2. Association automatique `client.entreprise_id`
3. Héritage du contexte B2B
4. Statistiques entreprise mises à jour automatiquement

**Génération de devis** :
1. Client sélectionné (avec entreprise)
2. Informations entreprise pré-remplies
3. Calculs intégrés dans les statistiques entreprise
4. Analytics globales mises à jour

---

## 🛡️ Sécurité et Validation

### Règles de validation métier

```php
// Création
'siret' => 'nullable|string|unique:entreprises,siret'

// Modification (exception pour l'entreprise courante)
'siret' => 'nullable|string|unique:entreprises,siret,' . $entreprise->id

// Autres validations
'email' => 'nullable|email|max:255'
'site_web' => 'nullable|url|max:255'
'nom' => 'required|string|max:255'  // Seul champ obligatoire
```

### Protection des données

```php
// Soft delete préférable pour conservation des relations
// Ou archivage via champ 'active'
if ($entreprise->clients()->exists()) {
    throw new \Exception('Impossible de supprimer une entreprise avec des clients associés');
}

// Alternative : archivage
$entreprise->update(['active' => false]);
```

### Audit et traçabilité

```php
// Via HasHistorique - Automatique
- Création → Historique avec données complètes
- Modification → Avant/Après avec utilisateur
- Archivage → Trace de l'action

// Via SendsNotifications - Automatique  
- Notifications aux admins/super_admins
- Personnalisation possible via sendCustomNotification()
```

---

## ⚡ Performance et Optimisations

### Optimisations de requêtes

```php
// Liste avec compteurs (évite N+1)
Entreprise::withCount('clients')->orderBy('created_at', 'desc')->get()

// Détails avec relations (eager loading)
$entreprise->load('clients.devis')

// Historique avec utilisateurs
$entreprise->historique()->with('user')->latest()->get()
```

### Cache des statistiques

```php
// Mise en cache recommandée pour les statistiques lourdes
Cache::remember("entreprise_stats_{$entreprise->id}", 300, function() use ($entreprise) {
    return [
        'revenus_total' => $entreprise->clients->sum(fn($client) => 
            $client->devis->where('statut', 'accepte')->sum('montant_total')
        ),
        'derniere_activite' => $entreprise->clients->max('updated_at'),
    ];
});
```

### Pagination et filtrage

```typescript
// Frontend optimisé avec filtres en mémoire
const filteredEntreprises = useMemo(() => {
    return entreprises.filter(entreprise => {
        const matchesSearch = searchTerm === '' || 
            entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSecteur = secteurFilter === 'all' || 
            entreprise.secteur_activite === secteurFilter;
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'active' && entreprise.active);
        
        return matchesSearch && matchesSecteur && matchesStatus;
    });
}, [entreprises, searchTerm, secteurFilter, statusFilter]);
```

---

## 🎯 Évolutions et Extensibilité

### Améliorations possibles

**Court terme** :
- ✅ API de validation SIRET/SIREN (service externe)
- ✅ Import/export Excel des entreprises
- ✅ Géolocalisation des adresses
- ✅ Templates d'entreprises par secteur

**Moyen terme** :
- ✅ Dashboard analytics avancé par secteur
- ✅ Comparaisons benchmarks sectoriels
- ✅ Notifications automatiques sur seuils
- ✅ Intégration CRM externe

**Long terme** :
- ✅ IA pour catégorisation automatique
- ✅ Prédictions commerciales par entreprise
- ✅ Analyses sectorielles avancées
- ✅ API publique pour partenaires

### Architecture évolutive

```php
// Structure préparée pour l'extension
class Entreprise extends Model
{
    // Traits extensibles
    use HasHistorique, SendsNotifications, HasGeolocation, HasAnalytics;
    
    // Relations prêtes pour extension
    public function contracts() // Contrats futurs
    public function documents() // Documents légaux
    public function contacts()  // Contacts multiples
    public function subsidiaries() // Filiales
}
```

---

## 🎉 Conclusion

### Architecture équilibrée

Le système **entreprises** du Dashboard Madinia représente un **équilibre optimal** entre simplicité et fonctionnalité :

✅ **Simplicité assumée** - CRUD efficace sans complexité excessive  
✅ **Rôle de pivot** - Point central pour l'organisation des données B2B  
✅ **Intégration native** - Traits partagés avec écosystème clients  
✅ **Statistiques calculées** - Analytics via relations sans duplication  
✅ **Interface moderne** - React avec filtres sectoriels et onglets  

### Positionnement stratégique

**Point d'entrée B2B** : Les entreprises servent de **porte d'entrée principale** pour la gestion commerciale, permettant une **vision globale** avant de descendre dans les détails clients.

**Simplicité volontaire** : Contrairement aux clients avec leurs workflows complexes, les entreprises restent **volontairement simples** pour se concentrer sur leur rôle de **conteneur organisationnel**.

**Évolutivité préservée** : L'architecture permet des **extensions futures** sans refonte majeure, grâce aux traits modulaires et aux relations Eloquent extensibles.

Cette approche **pragmatique** offre une **base solide** pour la gestion B2B tout en préservant la **flexibilité** nécessaire aux évolutions métier futures. 