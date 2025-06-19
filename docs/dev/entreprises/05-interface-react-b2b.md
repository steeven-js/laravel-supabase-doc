# ⚛️ Module 5 : Interface React - Gestion B2B

## 📋 Vue d'ensemble

L'interface React pour les entreprises implémente une solution B2B complète et moderne, avec des fonctionnalités spécialisées pour la gestion d'entreprises françaises et internationales. L'interface se distingue par sa richesse fonctionnelle, ses filtres avancés et son système d'onglets pour les vues détaillées.

## 🏗️ Architecture des Pages React

### 📊 **Structure Générale (2341+ lignes)**

| Page | Lignes | Complexité | Fonctionnalités Principales |
|------|--------|------------|------------------------------|
| `index.tsx` | 461 | ⭐⭐⭐ | Liste, filtres, pagination, sélection multiple |
| `create.tsx` | 943 | ⭐⭐⭐⭐⭐ | Formulaire wizard, validation temps réel, NAF |
| `edit.tsx` | 878 | ⭐⭐⭐⭐ | Édition, gestion statut, historique |
| `show.tsx` | 959 | ⭐⭐⭐⭐⭐ | Onglets, statistiques, clients, analytics |

### 🎯 **Types TypeScript Communs**

```typescript
interface Entreprise {
    id: number;
    nom: string;                    // Raison sociale (obligatoire)
    nom_commercial?: string;        // Nom commercial (optionnel)
    siret?: string;                // SIRET français (unique)
    siren?: string;                // SIREN dérivé
    secteur_activite?: string;     // Secteur NAF ou libre
    
    // Adresse complète
    adresse?: string;
    ville?: string;
    code_postal?: string;
    pays?: string;
    
    // Contact
    telephone?: string;
    email?: string;
    site_web?: string;
    
    // Gestion
    active: boolean;               // Statut actif/inactif
    notes?: string;                // Notes libres
    
    // Relations calculées
    clients_count?: number;        // Nombre de clients (withCount)
    clients?: Client[];            // Clients avec devis
    created_at: string;           // Date de création
}
```

---

## 📋 Page Index - Liste Avancée

### **📁 Fichier : `index.tsx` (461 lignes)**

La page index implémente une interface de liste sophistiquée avec filtrage multi-critères et gestion de la sélection multiple.

#### **🔍 Système de Filtrage Avancé**

```typescript
// États de filtrage
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
const [secteurFilter, setSecteurFilter] = useState<string>('all');
```

**Filtres Disponibles :**

1. **🔍 Recherche Textuelle Multi-Champs**
```typescript
const matchesSearch = !searchTerm.trim() || [
    entreprise.nom,
    entreprise.nom_commercial,
    entreprise.email,
    entreprise.telephone,
    entreprise.ville,
    entreprise.secteur_activite
].some(field => {
    if (!field) return false;
    return field.toLowerCase().includes(searchTerm.toLowerCase());
});
```

2. **📊 Filtre par Statut**
```typescript
const matchesStatus =
    statusFilter === 'all' ||
    (statusFilter === 'active' && entreprise.active) ||
    (statusFilter === 'inactive' && !entreprise.active);
```

3. **🏢 Filtre par Secteur d'Activité**
```typescript
// Secteurs uniques générés dynamiquement
const uniqueSecteurs = useMemo(() => {
    const secteurs = entreprises
        .map(entreprise => entreprise.secteur_activite)
        .filter((secteur): secteur is string => Boolean(secteur))
        .filter((secteur, index, array) => array.indexOf(secteur) === index)
        .sort();
    return secteurs;
}, [entreprises]);
```

#### **📊 Système de Tri Multi-Colonnes**

```typescript
const [sortField, setSortField] = useState<keyof Entreprise>('nom');
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

// Tri intelligent avec gestion des valeurs nulles
filtered.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Normalisation pour les chaînes
    if (sortField === 'nom' || sortField === 'nom_commercial') {
        aValue = (aValue as string)?.toLowerCase() || '';
        bValue = (bValue as string)?.toLowerCase() || '';
    }

    // Gestion des valeurs undefined/null
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
    if (bValue == null) return sortDirection === 'asc' ? -1 : 1;

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
});
```

#### **✅ Sélection Multiple et Actions de Masse**

```typescript
const [selectedEntreprises, setSelectedEntreprises] = useState<number[]>([]);

// Sélection globale avec état indéterminé
const isAllSelected = paginatedEntreprises.length > 0 && 
    selectedEntreprises.length === paginatedEntreprises.length;
const isIndeterminate = selectedEntreprises.length > 0 && 
    selectedEntreprises.length < paginatedEntreprises.length;

// Actions disponibles pour la sélection multiple
{selectedEntreprises.length > 0 && (
    <>
        <Button variant="outline" size="sm" onClick={handleDeleteSelected}>
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer ({selectedEntreprises.length})
        </Button>
        <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
        </Button>
    </>
)}
```

#### **📄 Pagination Avancée**

```typescript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);

// Calcul automatique des pages
const totalPages = Math.ceil(filteredAndSortedEntreprises.length / itemsPerPage);

// Navigation intelligente avec boutons numériques
{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
    if (page > totalPages) return null;
    return (
        <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
            className="w-8 pagination-button"
        >
            {page}
        </Button>
    );
})}
```

---

## 🆕 Page Create - Formulaire Wizard B2B

### **📁 Fichier : `create.tsx` (943 lignes)**

La page de création implémente un formulaire wizard sophistiqué avec validation temps réel et guide utilisateur.

#### **🧭 Architecture Wizard par Sections**

```typescript
interface Section {
    id: string;
    label: string;
    description: string;
    icon: React.ComponentType;
    required: boolean;
}

const sections: Section[] = [
    {
        id: 'company',
        label: 'Informations entreprise',
        description: 'Nom, secteur d\'activité',
        icon: Building2,
        required: true
    },
    {
        id: 'contact',
        label: 'Contact & Adresse',
        description: 'Email, téléphone, adresse',
        icon: MapPin,
        required: false
    },
    {
        id: 'legal',
        label: 'Informations légales',
        description: 'SIRET, SIREN',
        icon: Shield,
        required: false
    },
    {
        id: 'business',
        label: 'Paramètres métier',
        description: 'Statut, configuration',
        icon: Users,
        required: false
    },
    {
        id: 'notes',
        label: 'Notes & Observations',
        description: 'Informations complémentaires',
        icon: FileText,
        required: false
    }
];
```

#### **📊 Système de Progression et Validation**

```typescript
// Calcul dynamique de la progression
const completedSections = useMemo(() => {
    const completed = new Set<string>();
    
    // Section company
    if (data.nom && data.secteur_activite) {
        completed.add('company');
    }
    
    // Section contact
    if (data.email || data.telephone || data.adresse) {
        completed.add('contact');
    }
    
    // Section legal
    if (data.siret || data.siren) {
        completed.add('legal');
    }
    
    // Section business (toujours validée)
    completed.add('business');
    
    // Section notes
    if (data.notes) {
        completed.add('notes');
    }
    
    return completed;
}, [data]);

const progressPercentage = Math.round((completedSections.size / sections.length) * 100);
```

#### **🇫🇷 Système NAF - Secteurs d'Activité Français**

```typescript
// Liste complète des codes NAF français (150+ secteurs)
const SECTEURS_ACTIVITE = [
    "01.11Z-Culture de céréales (sauf riz), légumineuses et graines oléagineuses",
    "62.01Z-Programmation informatique",
    "62.02A-Conseil en systèmes et logiciels informatiques",
    "70.22Z-Conseil pour les affaires et autres conseils de gestion",
    // ... 150+ secteurs complets
];

// Recherche intelligente dans les secteurs
const [secteurSearch, setSecteurSearch] = useState('');
const filteredSecteurs = useMemo(() => {
    if (!secteurSearch.trim()) return SECTEURS_ACTIVITE;
    return SECTEURS_ACTIVITE.filter(secteur =>
        secteur.toLowerCase().includes(secteurSearch.toLowerCase())
    );
}, [secteurSearch]);
```

**Interface Secteur avec Recherche :**
```typescript
<Select
    value={data.secteur_activite}
    onValueChange={(value) => setData('secteur_activite', value)}
    required
    open={secteurOpen}
    onOpenChange={handleSecteurOpenChange}
>
    <SelectTrigger>
        <SelectValue placeholder="Sélectionnez le secteur d'activité de l'entreprise" />
    </SelectTrigger>
    <SelectContent className="p-0">
        {/* Barre de recherche intégrée */}
        <div className="sticky top-0 z-10 bg-background p-2 border-b shadow-sm">
            <Input
                placeholder="Rechercher un secteur d'activité..."
                value={secteurSearch}
                onChange={(e) => setSecteurSearch(e.target.value)}
                className="h-8 text-sm"
                autoFocus
            />
        </div>
        <div className="max-h-48 overflow-y-auto">
            {filteredSecteurs.length > 0 ? (
                filteredSecteurs.map((secteur) => (
                    <SelectItem key={secteur} value={secteur}>
                        {secteur}
                    </SelectItem>
                ))
            ) : (
                <div className="p-4 text-sm text-muted-foreground text-center">
                    Aucun secteur trouvé pour "{secteurSearch}"
                </div>
            )}
        </div>
    </SelectContent>
</Select>
```

#### **✅ Validation Temps Réel avec Indicateurs Visuels**

```typescript
const getFieldStatus = (field: string, value: string) => {
    const hasError = errors[field];
    const hasValue = value && value.trim().length > 0;
    
    if (hasError) return 'error';
    if (hasValue) return 'success';
    return 'neutral';
};

const renderFieldIcon = (status: string) => {
    switch (status) {
        case 'success':
            return <Check className="h-4 w-4 text-green-500" />;
        case 'error':
            return <X className="h-4 w-4 text-red-500" />;
        case 'neutral':
            return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
        default:
            return null;
    }
};
```

#### **🏢 Champs Spécialisés B2B**

**Champs Obligatoires :**
```typescript
// Nom légal (raison sociale) - OBLIGATOIRE
<Label htmlFor="nom" className="flex items-center gap-2">
    Nom légal
    <span className="text-destructive">*</span>
    {renderFieldIcon(getFieldStatus('nom', data.nom))}
</Label>

// Secteur d'activité - OBLIGATOIRE
<Label htmlFor="secteur_activite" className="flex items-center gap-2">
    Secteur d'activité
    <span className="text-destructive">*</span>
    {renderFieldIcon(getFieldStatus('secteur_activite', data.secteur_activite))}
</Label>
```

**Champs Métier Spécialisés :**
```typescript
// SIRET avec validation format
<Input
    id="siret"
    value={data.siret}
    onChange={(e) => setData('siret', e.target.value)}
    placeholder="12345678901234"
    maxLength={14}
    pattern="[0-9]{14}"
/>

// Site web avec validation URL
<Input
    id="site_web"
    type="url"
    value={data.site_web}
    onChange={(e) => setData('site_web', e.target.value)}
    placeholder="https://www.exemple.com"
/>
```

---

## 👁️ Page Show - Vue Détaillée avec Onglets

### **📁 Fichier : `show.tsx` (959 lignes)**

La page de visualisation implémente un système d'onglets avancé avec statistiques temps réel et analytics.

#### **📊 Système d'Onglets Complet**

```typescript
const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'stats' | 'historique'>('overview');
```

**Onglets Disponibles :**

1. **📋 Overview** : Vue d'ensemble de l'entreprise
2. **👥 Clients** : Liste des clients avec leurs devis
3. **📊 Stats** : Statistiques détaillées et analytics
4. **📝 Historique** : Journal des actions

#### **📈 Calculs de Statistiques Temps Réel**

```typescript
// Agrégation de tous les devis via clients
const allDevis = entreprise.clients.flatMap(client =>
    client.devis.map(devis => ({ ...devis, client }))
);

const stats = {
    // Métriques clients
    totalClients: entreprise.clients.length,
    activeClients: entreprise.clients.filter(c => c.actif).length,
    
    // Métriques devis
    totalQuotes: allDevis.length,
    acceptedQuotes: allDevis.filter(d => d.statut === 'accepte').length,
    pendingQuotes: allDevis.filter(d => d.statut === 'envoye').length,
    rejectedQuotes: allDevis.filter(d => d.statut === 'refuse').length,
    
    // Métriques financières
    totalRevenue: allDevis
        .filter(d => d.statut === 'accepte')
        .reduce((sum, d) => sum + d.montant_ttc, 0),
    averageQuoteValue: allDevis.length > 0
        ? allDevis.reduce((sum, d) => sum + d.montant_ttc, 0) / allDevis.length
        : 0
};
```

#### **🎨 Indicateurs Visuels et Badges**

```typescript
const getStatusVariant = (statut: string) => {
    switch (statut) {
        case 'accepte':
            return 'default';       // Vert
        case 'envoye':
            return 'outline';       // Neutre
        case 'refuse':
            return 'destructive';   // Rouge
        case 'expire':
            return 'destructive';   // Rouge
        default:
            return 'secondary';     // Gris
    }
};

const getStatusIcon = (statut: string) => {
    switch (statut) {
        case 'accepte':
            return <CheckCircle className="h-4 w-4" />;
        case 'envoye':
            return <Eye className="h-4 w-4" />;
        case 'refuse':
            return <XCircle className="h-4 w-4" />;
        case 'expire':
            return <FileX className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
};
```

#### **💼 Vue Overview - Informations Entreprise**

**Affichage des Informations Légales :**
```typescript
// Gestion nom commercial vs nom légal
<h1 className="text-3xl font-bold">
    {entreprise.nom_commercial || entreprise.nom}
</h1>
{entreprise.nom_commercial && (
    <p className="text-muted-foreground">
        {entreprise.nom} {/* Raison sociale */}
    </p>
)}

// Informations SIRET/SIREN
{entreprise.siret && (
    <div className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        <span>SIRET: {entreprise.siret}</span>
        <Button variant="ghost" size="sm" 
                onClick={() => copyToClipboard(entreprise.siret!, 'SIRET')}>
            <Copy className="h-4 w-4" />
        </Button>
    </div>
)}
```

#### **👥 Onglet Clients - Gestion Relations**

```typescript
// Tableau des clients avec leurs métriques
<Table>
    <TableHeader>
        <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Devis</TableHead>
            <TableHead>CA Réalisé</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {entreprise.clients.map((client) => {
            const clientRevenue = client.devis
                .filter(d => d.statut === 'accepte')
                .reduce((sum, d) => sum + d.montant_ttc, 0);
            
            return (
                <TableRow key={client.id}>
                    <TableCell>
                        <Link href={`/clients/${client.id}`}>
                            {client.nom} {client.prenom}
                        </Link>
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.devis.length}</TableCell>
                    <TableCell>{formatPrice(clientRevenue)}</TableCell>
                    <TableCell>
                        <Badge variant={client.actif ? 'default' : 'secondary'}>
                            {client.actif ? 'Actif' : 'Inactif'}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <Button size="sm" variant="ghost" asChild>
                            <Link href={`/clients/${client.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                    </TableCell>
                </TableRow>
            );
        })}
    </TableBody>
</Table>
```

---

## ✏️ Page Edit - Formulaire d'Édition

### **📁 Fichier : `edit.tsx` (878 lignes)**

La page d'édition reprend la structure wizard de create.tsx avec des adaptations pour la modification.

#### **🔄 Différences avec Create**

1. **Pré-remplissage des données** existantes
2. **Gestion du statut actif/inactif**
3. **Validation SIRET avec exception** (unique sauf instance actuelle)
4. **Historique des modifications** visible

#### **⚙️ Gestion du Statut**

```typescript
// Toggle actif/inactif spécifique à l'édition
<div className="flex items-center space-x-2">
    <Checkbox
        id="active"
        checked={data.active}
        onCheckedChange={(checked) => setData('active', checked as boolean)}
    />
    <Label htmlFor="active">Entreprise active</Label>
</div>
```

---

## 🎨 Design System et UX

### **🎯 Principes UX B2B**

#### **1. Efficacité Professionnelle**
- ✅ Filtres rapides et combinables
- ✅ Actions de masse pour la productivité
- ✅ Navigation par onglets intuitive
- ✅ Validation temps réel pour éviter les erreurs

#### **2. Spécialisation Métier**
- ✅ Champs SIRET/SIREN avec validation française
- ✅ Secteurs NAF officiels avec recherche
- ✅ Distinction nom légal/commercial
- ✅ Indicateurs visuels de statut entreprise

#### **3. Analytics Intégrées**
- ✅ Statistiques temps réel calculées
- ✅ Métriques clients et revenus
- ✅ Tableaux de bord par entreprise
- ✅ Historique complet des actions

### **🎨 Composants UI Réutilisés**

```typescript
// Composants shadcn/ui utilisés
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
```

### **🌟 Patterns d'Interface Spécialisés**

#### **📊 Cartes de Statistiques**
```typescript
<Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
        <div className="text-2xl font-bold">{stats.totalClients}</div>
        <p className="text-xs text-muted-foreground">
            {stats.activeClients} actifs
        </p>
    </CardContent>
</Card>
```

#### **🔍 Barres de Recherche Contextuelles**
```typescript
// Recherche avec icône intégrée
<div className="relative">
    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
        placeholder="Rechercher des entreprises..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 w-full sm:w-[300px]"
    />
</div>
```

---

## 🔧 Optimisations Techniques

### **⚡ Performances**

#### **1. Mémorisation des Calculs Coûteux**
```typescript
// Filtrage et tri optimisés avec useMemo
const filteredAndSortedEntreprises = useMemo(() => {
    // Logique de filtrage/tri complexe
}, [entreprises, searchTerm, statusFilter, secteurFilter, sortField, sortDirection]);

// Secteurs uniques calculés une seule fois
const uniqueSecteurs = useMemo(() => {
    return entreprises
        .map(entreprise => entreprise.secteur_activite)
        .filter((secteur): secteur is string => Boolean(secteur))
        .filter((secteur, index, array) => array.indexOf(secteur) === index)
        .sort();
}, [entreprises]);
```

#### **2. Pagination Optimisée**
```typescript
// Pagination côté client pour petites listes
const paginatedEntreprises = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedEntreprises.slice(startIndex, startIndex + itemsPerPage);
}, [filteredAndSortedEntreprises, currentPage, itemsPerPage]);
```

### **🛡️ Gestion d'Erreurs**

#### **1. Validation Côté Client**
```typescript
// Validation des champs obligatoires
const isFormValid = data.nom && data.secteur_activite;

// Messages d'erreur contextuels
const getFieldError = (field: string) => {
    return errors[field];
};
```

#### **2. États de Chargement**
```typescript
// Désactivation des boutons pendant traitement
<Button
    onClick={handleSubmit}
    disabled={processing || !isFormValid}
    className="min-w-[140px]"
>
    {processing ? 'Création...' : 'Créer l\'entreprise'}
</Button>
```

---

## 🌍 Internationalisation et Localisation

### **🇫🇷 Spécificités Françaises**

#### **1. Codes NAF Officiels**
- ✅ 150+ secteurs d'activité français
- ✅ Recherche intelligente dans les codes
- ✅ Format officiel avec codes et descriptions

#### **2. Validation SIRET/SIREN**
- ✅ Format 14 chiffres pour SIRET
- ✅ Unicité garantie en base
- ✅ Calcul automatique SIREN depuis SIRET

#### **3. Formatage Monétaire**
```typescript
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
};
```

### **🌐 Support International**

#### **1. Champs Optionnels**
- ✅ SIRET/SIREN optionnels pour entreprises étrangères
- ✅ Pays configurable (défaut: France)
- ✅ Secteurs libres si NAF non applicable

#### **2. Formats Adaptatifs**
```typescript
// Dates localisées
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
```

---

## 📚 Bonnes Pratiques Identifiées

### **✅ Architecture Modulaire**
- ✅ **Composants réutilisables** : shadcn/ui standardisé
- ✅ **Hooks personnalisés** : Logique métier externalisée
- ✅ **Types TypeScript** : Interfaces strictes et cohérentes
- ✅ **Séparation des responsabilités** : UI / Logique / Données

### **✅ UX Professionnelle**
- ✅ **Feedback immédiat** : Validation temps réel
- ✅ **États intermédiaires** : Loading, success, error
- ✅ **Navigation intuitive** : Breadcrumbs, onglets, retour
- ✅ **Accessibilité** : Labels, aria, keyboard navigation

### **✅ Performance Optimisée**
- ✅ **Mémorisation** : useMemo pour calculs coûteux
- ✅ **Pagination** : Chargement par chunks
- ✅ **Filtrage côté client** : Réactivité instantanée
- ✅ **Lazy loading** : Composants à la demande

### **✅ Gestion d'État Moderne**
- ✅ **React hooks** : useState, useEffect, useMemo
- ✅ **Inertia.js** : State management automatique
- ✅ **Validation temps réel** : UX sans interruption
- ✅ **Persistence** : URL state, local storage

---

## 📚 Références

- **Pages React** : `resources/js/pages/entreprises/`
- **Composants UI** : `resources/js/components/ui/`
- **Types** : Interfaces définies dans chaque page
- **Contrôleur Backend** : `app/Http/Controllers/EntrepriseController.php` (Module 4)

---

*Module 5 terminé - Interface React B2B complètement documentée* 