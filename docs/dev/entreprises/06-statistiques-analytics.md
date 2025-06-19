# 📊 Module 6 : Statistiques & Analytics Entreprises

## 📋 Vue d'ensemble

Le système de statistiques et analytics pour les entreprises fournit des métriques temps réel sophistiquées, calculées dynamiquement à partir des relations avec les clients et leurs devis. L'interface propose des tableaux de bord visuels, des indicateurs de performance et un système de tracking complet des actions.

## 🏗️ Architecture du Système Analytics

### 📊 **Calculs de Statistiques Temps Réel**

Le système utilise une approche d'agrégation en cascade pour calculer les métriques :

```typescript
// Agrégation de tous les devis via clients
const allDevis = entreprise.clients.flatMap(client =>
    client.devis.map(devis => ({ ...devis, client }))
);

const stats = {
    // 👥 MÉTRIQUES CLIENTS
    totalClients: entreprise.clients.length,
    activeClients: entreprise.clients.filter(c => c.actif).length,
    
    // 📄 MÉTRIQUES DEVIS
    totalQuotes: allDevis.length,
    acceptedQuotes: allDevis.filter(d => d.statut === 'accepte').length,
    pendingQuotes: allDevis.filter(d => d.statut === 'envoye').length,
    rejectedQuotes: allDevis.filter(d => d.statut === 'refuse').length,
    
    // 💰 MÉTRIQUES FINANCIÈRES
    totalRevenue: allDevis
        .filter(d => d.statut === 'accepte')
        .reduce((sum, d) => sum + d.montant_ttc, 0),
    averageQuoteValue: allDevis.length > 0
        ? allDevis.reduce((sum, d) => sum + d.montant_ttc, 0) / allDevis.length
        : 0,
    
    // 📈 MÉTRIQUES DE PERFORMANCE
    conversionRate: allDevis.length > 0
        ? (allDevis.filter(d => d.statut === 'accepte').length / allDevis.length) * 100
        : 0
};
```

### 🎯 **Types de Métriques Calculées**

#### **1. 👥 Métriques Clients**
- **Total Clients** : Nombre total de clients de l'entreprise
- **Clients Actifs** : Clients avec statut `actif = true`
- **Taux d'Activation** : Pourcentage de clients actifs

#### **2. 📄 Métriques Devis**
- **Total Devis** : Nombre total de devis émis
- **Devis Acceptés** : Devis avec statut `accepte`
- **Devis En Attente** : Devis avec statut `envoye`
- **Devis Refusés** : Devis avec statut `refuse`

#### **3. 💰 Métriques Financières**
- **Chiffre d'Affaires Total** : Somme des montants TTC des devis acceptés
- **Panier Moyen** : Montant moyen des devis (tous statuts)
- **CA Moyen par Client** : Revenus totaux divisés par nombre de clients

#### **4. 📈 Métriques de Performance**
- **Taux de Conversion** : Pourcentage de devis acceptés vs total
- **Taux de Refus** : Pourcentage de devis refusés
- **Valeur Moyenne** : Ticket moyen des transactions

---

## 📊 Interface de Statistiques

### **🎨 Onglet Stats - Tableaux de Bord**

L'onglet statistiques présente une grille de cartes métriques avec indicateurs visuels :

```typescript
{activeTab === 'stats' && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cartes de statistiques */}
    </div>
)}
```

#### **📱 Cartes de Métriques Standardisées**

Chaque métrique utilise un design uniforme avec :
- **Titre de la métrique**
- **Valeur principale** (grande taille)
- **Icône thématique** avec couleur
- **Indicateur de tendance** (évolution mensuelle)

```typescript
<Card>
    <CardContent className="p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-green-600">+12% ce mois</span>
        </div>
    </CardContent>
</Card>
```

### **🎨 Système de Couleurs Thématiques**

#### **Palette de Couleurs par Métrique**

| Métrique | Couleur | Justification |
|----------|---------|---------------|
| **Total Clients** | 🔵 Bleu | Couleur neutre pour données générales |
| **Clients Actifs** | 🟢 Vert | Positive, représente l'activité |
| **Taux de Conversion** | 🟣 Violet | Métrique complexe, couleur distinctive |
| **CA Total** | 🟠 Orange | Associée à l'argent et aux gains |
| **Total Devis** | 🟦 Indigo | Bleu foncé pour documents |
| **Devis Acceptés** | 🟢 Émeraude | Vert pour succès/validation |
| **Panier Moyen** | 🟡 Jaune | Couleur or pour valeur moyenne |

#### **Indicateurs de Tendance**

```typescript
// Tendance positive
<div className="mt-4 flex items-center text-sm">
    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
    <span className="text-green-600">+15% ce mois</span>
</div>

// Tendance négative
<div className="mt-4 flex items-center text-sm">
    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
    <span className="text-red-600">-2% ce mois</span>
</div>
```

---

## 📈 Analytics Avancés

### **💼 Vue d'Ensemble - Métriques Contextuelles**

L'en-tête de la page show.tsx présente un résumé des métriques clés :

```typescript
<div className="flex items-center gap-4 text-sm text-muted-foreground">
    <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        Entreprise depuis le {formatDate(entreprise.created_at)}
    </div>
    <div className="flex items-center gap-1">
        <Euro className="h-4 w-4" />
        {formatPrice(stats.totalRevenue)} de CA
    </div>
    <div className="flex items-center gap-1">
        <Users className="h-4 w-4" />
        {stats.totalClients} clients
    </div>
</div>
```

### **👥 Onglet Clients - Analytics Relationnels**

L'onglet clients fournit des métriques par client avec calculs dynamiques :

```typescript
// Calcul du CA par client en temps réel
{entreprise.clients.map((client) => {
    const clientRevenue = client.devis
        .filter(d => d.statut === 'accepte')
        .reduce((sum, d) => sum + d.montant_ttc, 0);
    
    return (
        <TableRow key={client.id}>
            <TableCell>{client.prenom} {client.nom}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <span>{client.devis.length}</span>
                    {client.devis.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                            ({client.devis.filter(d => d.statut === 'accepte').length} acceptés)
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell>{formatPrice(clientRevenue)}</TableCell>
            <TableCell>
                <Badge variant={client.actif ? 'default' : 'secondary'}>
                    {client.actif ? 'Actif' : 'Inactif'}
                </Badge>
            </TableCell>
        </TableRow>
    );
})}
```

### **🔍 Métriques Détaillées par Client**

Pour chaque client, le système calcule :
- **Nombre total de devis**
- **Nombre de devis acceptés**
- **Chiffre d'affaires généré**
- **Statut d'activité**
- **Taux de conversion individuel**

---

## 📋 Système de Tracking et Historique

### **📝 Onglet Historique - Analytics d'Actions**

L'onglet historique fournit un tracking complet des actions avec analytics :

```typescript
{activeTab === 'historique' && (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des actions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
                Suivi de toutes les actions effectuées sur cette entreprise ({historique.length})
            </p>
        </CardHeader>
    </Card>
)}
```

#### **🎨 Catégorisation Visuelle des Actions**

```typescript
const getActionIcon = (action: string) => {
    switch (action) {
        case 'creation':
            return <FileText className="h-4 w-4" />;
        case 'modification':
            return <Edit className="h-4 w-4" />;
        case 'changement_statut':
            return <CheckCircle className="h-4 w-4" />;
        case 'envoi_email':
            return <Mail className="h-4 w-4" />;
        case 'transformation':
            return <RotateCcw className="h-4 w-4" />;
        case 'suppression':
            return <Trash2 className="h-4 w-4" />;
        case 'archivage':
            return <FileX className="h-4 w-4" />;
        case 'restauration':
            return <RotateCcw className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
};

const getActionColor = (action: string) => {
    switch (action) {
        case 'creation':
            return 'bg-blue-100 text-blue-800';
        case 'modification':
            return 'bg-amber-100 text-amber-800';
        case 'changement_statut':
            return 'bg-green-100 text-green-800';
        case 'envoi_email':
            return 'bg-purple-100 text-purple-800';
        case 'transformation':
            return 'bg-emerald-100 text-emerald-800';
        case 'suppression':
            return 'bg-red-100 text-red-800';
        case 'archivage':
            return 'bg-gray-100 text-gray-800';
        case 'restauration':
            return 'bg-teal-100 text-teal-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
```

#### **📊 Données d'Action Enrichies**

Chaque action dans l'historique contient :

```typescript
interface HistoriqueAction {
    id: number;
    action: 'creation' | 'modification' | 'changement_statut' | 'envoi_email' | 
           'suppression' | 'archivage' | 'restauration' | 'transformation';
    titre: string;                  // Titre descriptif
    description?: string;           // Description détaillée
    donnees_avant?: any;           // État avant modification
    donnees_apres?: any;           // État après modification
    donnees_supplementaires?: any; // Métadonnées contextuelles
    created_at: string;           // Timestamp
    user?: {                      // Utilisateur ayant effectué l'action
        id: number;
        name: string;
        email: string;
    };
    user_nom: string;            // Nom utilisateur (fallback)
    user_email: string;          // Email utilisateur (fallback)
}
```

#### **🔍 Système de Détails Expandables**

```typescript
// Interface avec détails expandables
{(action.donnees_avant || action.donnees_apres) && (
    <details className="mt-2">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
            Voir les détails
        </summary>
        <div className="mt-2 text-xs bg-white p-2 rounded border">
            {action.donnees_avant && (
                <div className="mb-2">
                    <span className="font-medium text-red-600">Avant :</span>
                    <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                        {JSON.stringify(action.donnees_avant, null, 2)}
                    </pre>
                </div>
            )}
            {action.donnees_apres && (
                <div>
                    <span className="font-medium text-green-600">Après :</span>
                    <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                        {JSON.stringify(action.donnees_apres, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    </details>
)}
```

---

## 🔧 Optimisations de Performance

### **⚡ Calculs Optimisés**

#### **1. Agrégation Unique**
```typescript
// Une seule boucle pour tous les calculs
const allDevis = entreprise.clients.flatMap(client =>
    client.devis.map(devis => ({ ...devis, client }))
);

// Tous les calculs utilisent cette structure unique
const stats = {
    totalQuotes: allDevis.length,
    acceptedQuotes: allDevis.filter(d => d.statut === 'accepte').length,
    totalRevenue: allDevis
        .filter(d => d.statut === 'accepte')
        .reduce((sum, d) => sum + d.montant_ttc, 0),
    // ...
};
```

#### **2. Calculs Côté Client**
- ✅ **Temps réel** : Aucun appel API pour les métriques
- ✅ **Performance** : Calculs instantanés
- ✅ **Réactivité** : Interface responsive

#### **3. Mémorisation Possible**
```typescript
// Optimisation future possible avec useMemo
const stats = useMemo(() => {
    const allDevis = entreprise.clients.flatMap(client =>
        client.devis.map(devis => ({ ...devis, client }))
    );
    
    return {
        // Calculs complexes...
    };
}, [entreprise.clients]);
```

---

## 🌍 Formatage et Localisation

### **💰 Formatage Monétaire**

```typescript
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
};

// Exemples d'affichage
formatPrice(1234.56);  // "1 234,56 €"
formatPrice(0);        // "0,00 €"
```

### **📅 Formatage des Dates**

```typescript
// Date complète
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Date et heure pour historique
const formatActionDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
```

### **📊 Formatage des Pourcentages**

```typescript
// Taux de conversion avec une décimale
{stats.conversionRate.toFixed(1)}%

// Pourcentage d'évolution
<span className="text-green-600">+15% ce mois</span>
```

---

## 🎨 Design System Analytics

### **🔘 Composants d'Interface Standardisés**

#### **1. Cartes de Métriques**
- **Taille fixe** : 6 unités de padding
- **Icônes thématiques** : 12x12 avec couleurs spécifiques
- **Typographie** : Titre small, valeur 2xl bold
- **Indicateurs** : TrendingUp/Down avec couleurs sémantiques

#### **2. Badges de Statut**
```typescript
<Badge variant={entreprise.active ? 'default' : 'secondary'}>
    {entreprise.active ? 'Active' : 'Inactive'}
</Badge>

<Badge variant={client.actif ? 'default' : 'secondary'}>
    {client.actif ? 'Actif' : 'Inactif'}
</Badge>
```

#### **3. Tableaux Analytics**
- **Colonnes standardisées** : Nom, Contact, Métriques, Statut, Actions
- **Actions contextuelles** : Eye, Edit, More avec tailles uniformes
- **États vides** : Illustrations centrées avec CTA

### **🎯 Patterns UX pour Analytics**

#### **1. Progressive Disclosure**
- **Vue d'ensemble** : Métriques principales dans l'en-tête
- **Onglet Stats** : Détails complets en grille
- **Historique** : Timeline avec détails expandables

#### **2. Contexte Actionnable**
- **Métriques avec actions** : Nouveau client depuis stats clients
- **Navigation fluide** : Liens directs vers entités liées
- **Feedback immédiat** : Copy to clipboard avec toast

#### **3. Cohérence Visuelle**
- **Couleurs sémantiques** : Vert pour positif, rouge pour négatif
- **Icônes cohérentes** : Même iconographie dans tous les contextes
- **Espacements** : Grid system uniforme

---

## 📚 Architecture de Données

### **🔄 Flux de Données Analytics**

```
EntrepriseController.show()
    ↓
Charge entreprise avec relations
    ↓ load('clients.devis')
Entreprise + Clients + Devis
    ↓
Formatage pour React
    ↓
Calculs stats côté client
    ↓
Affichage temps réel
```

### **💾 Structure des Relations**

```sql
-- Entreprise (1) → Clients (N) → Devis (N)
entreprises.id → clients.entreprise_id
clients.id → devis.client_id

-- Requête optimisée dans EntrepriseController
$entreprise->load('clients.devis');
```

### **📊 Agrégations Supportées**

- ✅ **Count** : Nombre d'entités par catégorie
- ✅ **Sum** : Totaux financiers (CA, montants)
- ✅ **Average** : Moyennes (panier moyen)
- ✅ **Percentage** : Taux (conversion, activation)
- ✅ **Filter** : Segmentation par statut/critères

---

## 📚 Bonnes Pratiques Identifiées

### **✅ Performance Analytics**
- ✅ **Calculs côté client** : Évite les appels API
- ✅ **Agrégation unique** : Une boucle pour tous les calculs
- ✅ **Relations optimisées** : load() plutôt que queries multiples
- ✅ **Pagination évitée** : Données complètes pour analytics

### **✅ UX Analytics**
- ✅ **Temps réel** : Métriques instantanées
- ✅ **Contexte visuel** : Couleurs et icônes sémantiques
- ✅ **Progressive disclosure** : Niveaux de détail
- ✅ **Actions contextuelles** : Liens directs depuis métriques

### **✅ Code Quality**
- ✅ **Fonctions pures** : Calculs sans effets de bord
- ✅ **Types stricts** : TypeScript pour toutes les interfaces
- ✅ **Réutilisabilité** : Composants de cartes standardisés
- ✅ **Maintenance** : Logique centralisée et documentée

---

## 📚 Références

- **Page Show React** : `resources/js/pages/entreprises/show.tsx`
- **Types TypeScript** : Interfaces Entreprise et HistoriqueAction
- **Contrôleur Backend** : `app/Http/Controllers/EntrepriseController.php` (Module 4)
- **Composants UI** : `resources/js/components/ui/`

---

*Module 6 terminé - Système de statistiques et analytics complètement documenté* 