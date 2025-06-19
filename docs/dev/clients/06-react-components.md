# Module 6 : Composants React - Interface Utilisateur Clients

## Vue d'ensemble

Les composants React du système de gestion des clients constituent une interface utilisateur sophistiquée avec **4 composants principaux** totalisant **4773 lignes de code**. Cette interface offre une expérience utilisateur moderne avec filtrage avancé, formulaires multi-sections, et une vue détaillée complète.

---

## 🏗️ Architecture des Composants Clients

### Structure des fichiers

```
resources/js/pages/clients/
├── index.tsx        # 505 lignes - Liste des clients
├── create.tsx       # 996 lignes - Création client
├── edit.tsx         # 947 lignes - Édition client  
└── show.tsx         # 3071 lignes - Vue détaillée client
```

### Stack technique
- **React 18** avec TypeScript
- **Inertia.js** pour la navigation
- **shadcn/ui** composants UI
- **@dnd-kit** pour le drag & drop
- **sonner** pour les notifications
- **Lucide React** pour les icônes

---

## 📋 Composant Index (Liste des Clients)

### Fichier : `pages/clients/index.tsx` (505 lignes)

#### Interface et Types

```typescript
interface Client {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    ville?: string;
    actif: boolean;
    entreprise?: {
        nom: string;
        nom_commercial?: string;
    };
    created_at: string;
}

interface Props {
    clients: Client[];
}
```

#### Fonctionnalités principales

**1. Système de filtrage avancé**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
const [cityFilter, setCityFilter] = useState<string>('all');

// Recherche multi-champs
const matchesSearch = !searchTermLower ||
    (client.nom?.toLowerCase().includes(searchTermLower)) ||
    (client.prenom?.toLowerCase().includes(searchTermLower)) ||
    (client.email?.toLowerCase().includes(searchTermLower)) ||
    (client.telephone?.toLowerCase().includes(searchTermLower)) ||
    (client.ville?.toLowerCase().includes(searchTermLower)) ||
    (client.entreprise?.nom?.toLowerCase().includes(searchTermLower)) ||
    (client.entreprise?.nom_commercial?.toLowerCase().includes(searchTermLower));
```

**2. Tri dynamique**
```typescript
const [sortField, setSortField] = useState<keyof Client>('nom');
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

const handleSort = (field: keyof Client) => {
    if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortField(field);
        setSortDirection('asc');
    }
};
```

**3. Pagination**
```typescript
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);

const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);
const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedClients.slice(startIndex, startIndex + itemsPerPage);
}, [filteredAndSortedClients, currentPage, itemsPerPage]);
```

**4. Sélection multiple**
```typescript
const [selectedClients, setSelectedClients] = useState<number[]>([]);

const handleSelectAll = (checked: boolean) => {
    if (checked) {
        setSelectedClients(paginatedClients.map(client => client.id));
    } else {
        setSelectedClients([]);
    }
};

const handleSelectClient = (clientId: number, checked: boolean) => {
    if (checked) {
        setSelectedClients(prev => [...prev, clientId]);
    } else {
        setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
};
```

**5. Actions sur les clients**
```typescript
// Suppression avec confirmation
const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    client: Client | null;
}>({ isOpen: false, client: null });

const handleDeleteClient = async (deleteUrl: string, onClose: () => void) => {
    setIsDeleting(true);
    router.delete(deleteUrl, {
        onSuccess: () => {
            setIsDeleting(false);
            onClose();
            toast.success('Client supprimé avec succès');
        },
        onError: () => {
            setIsDeleting(false);
            toast.error('Erreur lors de la suppression');
        }
    });
};

// Suppression en lot
const handleDeleteSelected = () => {
    router.post('/clients/delete-multiple', {
        client_ids: selectedClients
    }, {
        onSuccess: () => {
            toast.success(`${selectedClients.length} client(s) supprimé(s)`);
            setSelectedClients([]);
        }
    });
};
```

#### Structure du tableau

```tsx
<Table>
    <TableHeader>
        <TableRow>
            <TableHead className="w-[50px]">
                <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                />
            </TableHead>
            <TableHead>
                <Button variant="ghost" onClick={() => handleSort('nom')}>
                    Nom <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        {paginatedClients.map((client) => (
            <TableRow key={client.id}>
                {/* Contenu des cellules */}
            </TableRow>
        ))}
    </TableBody>
</Table>
```

---

## ➕ Composant Create (Création Client)

### Fichier : `pages/clients/create.tsx` (996 lignes)

#### Interface de données

```typescript
interface Props {
    entreprises: Entreprise[];
}

interface NewEntreprise {
    nom: string;
    nom_commercial: string;
    adresse: string;
    ville: string;
    code_postal: string;
    pays: string;
    siret: string;
    email: string;
    telephone: string;
    site_web: string;
}
```

#### Formulaire multi-sections

**1. Gestion des sections**
```typescript
const [activeSection, setActiveSection] = useState<'personal' | 'contact' | 'business' | 'notes'>('personal');
const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

const sections = [
    {
        id: 'personal',
        label: 'Informations personnelles',
        icon: User,
        required: true,
        description: 'Nom, prénom et email'
    },
    {
        id: 'contact',
        label: 'Informations de contact',
        icon: Phone,
        required: false,
        description: 'Téléphone et adresse'
    },
    {
        id: 'business',
        label: 'Informations professionnelles',
        icon: Building2,
        required: false,
        description: 'Entreprise et fonction'
    },
    {
        id: 'notes',
        label: 'Notes',
        icon: FileText,
        required: false,
        description: 'Remarques et commentaires'
    }
];
```

**2. Formulaire Inertia.js**
```typescript
const { data, setData, post, processing, errors, clearErrors } = useForm({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'France',
    entreprise_id: 'none',
    actif: true as boolean,
    notes: '',
});
```

**3. Validation en temps réel**
```typescript
const getFieldStatus = (field: string, value: string) => {
    if (getFieldError(field)) return 'error';
    if (value && !getFieldError(field)) return 'success';
    return 'default';
};

const renderFieldIcon = (status: string) => {
    switch (status) {
        case 'success':
            return <Check className="h-4 w-4 text-green-500" />;
        case 'error':
            return <AlertCircle className="h-4 w-4 text-red-500" />;
        default:
            return null;
    }
};
```

**4. Création d'entreprise intégrée**
```typescript
const [showEntrepriseModal, setShowEntrepriseModal] = useState(false);
const [newEntreprise, setNewEntreprise] = useState<NewEntreprise>({
    nom: '',
    nom_commercial: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'France',
    siret: '',
    email: '',
    telephone: '',
    site_web: '',
});

const handleCreateEntreprise = async () => {
    setIsCreatingEntreprise(true);
    
    router.post('/entreprises', newEntreprise, {
        onSuccess: (response) => {
            const newEntrepriseData = response.props.entreprise;
            setEntreprises(prev => [...prev, newEntrepriseData]);
            setData('entreprise_id', newEntrepriseData.id.toString());
            setShowEntrepriseModal(false);
            toast.success('Entreprise créée avec succès');
        },
        onError: () => {
            toast.error('Erreur lors de la création de l\'entreprise');
        },
        onFinish: () => setIsCreatingEntreprise(false)
    });
};
```

**5. Recherche d'entreprises**
```typescript
const [entrepriseSearch, setEntrepriseSearch] = useState('');

const filteredEntreprises = useMemo(() => {
    if (!entrepriseSearch.trim()) return entreprises;
    
    const searchTerm = entrepriseSearch.toLowerCase().trim();
    return entreprises.filter(entreprise =>
        (entreprise.nom || '').toLowerCase().includes(searchTerm) ||
        (entreprise.nom_commercial || '').toLowerCase().includes(searchTerm)
    );
}, [entreprises, entrepriseSearch]);
```

#### Surveillance de la completion

```typescript
useEffect(() => {
    const newCompleted = new Set<string>();

    // Section personal
    if (data.nom && data.prenom && data.email) {
        newCompleted.add('personal');
    }

    // Section contact
    if (data.telephone || data.adresse || data.ville) {
        newCompleted.add('contact');
    }

    // Section business (toujours complète car optionnelle)
    newCompleted.add('business');

    // Section notes (toujours complète car optionnelle)
    newCompleted.add('notes');

    setCompletedSections(newCompleted);
}, [data]);
```

---

## ✏️ Composant Edit (Édition Client)

### Fichier : `pages/clients/edit.tsx` (947 lignes)

#### Spécificités de l'édition

**1. Pré-remplissage des données**
```typescript
const { data, setData, patch, processing, errors, isDirty: formIsDirty, reset } = useForm({
    nom: client.nom || '',
    prenom: client.prenom || '',
    email: client.email || '',
    telephone: client.telephone || '',
    adresse: client.adresse || '',
    ville: client.ville || '',
    code_postal: client.code_postal || '',
    pays: client.pays || 'France',
    entreprise_id: client.entreprise_id?.toString() || 'none',
    actif: client.actif,
    notes: client.notes || '',
});
```

**2. Détection des modifications**
```typescript
const [isDirty, setIsDirty] = useState(false);
const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);

useEffect(() => {
    setIsDirty(formIsDirty);
    setShowUnsavedChanges(formIsDirty);
}, [formIsDirty]);
```

**3. Soumission avec PATCH**
```typescript
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(`/clients/${client.id}`, {
        onSuccess: () => {
            toast.success('Client modifié avec succès');
            setIsDirty(false);
            setShowUnsavedChanges(false);
        },
        onError: () => {
            toast.error('Une erreur est survenue lors de la modification');
        }
    });
};
```

**4. Réinitialisation**
```typescript
const handleReset = () => {
    reset();
    setIsDirty(false);
    setShowUnsavedChanges(false);
    toast.info('Formulaire réinitialisé');
};
```

---

## 👀 Composant Show (Vue Détaillée)

### Fichier : `pages/clients/show.tsx` (3071 lignes)

#### Interface client complète

```typescript
interface Client {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    code_postal?: string;
    pays?: string;
    actif: boolean;
    notes?: string;
    entreprise?: {
        id: number;
        nom: string;
        nom_commercial?: string;
    };
    devis: Array<{
        id: number;
        numero_devis: string;
        objet: string;
        statut: string;
        date_devis: string;
        montant_ttc: number;
    }>;
    emails?: Array<{
        id: number;
        objet: string;
        contenu: string;
        cc?: string;
        attachments?: Array<{
            original_name: string;
            stored_name: string;
            path: string;
            size: number;
            mime_type: string;
        }>;
        date_envoi: string;
        statut: 'envoye' | 'echec';
        user: {
            id: number;
            name: string;
        };
    }>;
    opportunities?: Array<{
        id: number;
        nom: string;
        description: string;
        etape: string;
        probabilite: number;
        montant: number;
        date_cloture_prevue: string;
        date_cloture_reelle?: string;
        notes?: string;
        user: {
            id: number;
            name: string;
        };
        created_at: string;
        updated_at: string;
    }>;
    tickets?: Array<{
        id: number;
        titre: string;
        description: string;
        priorite: string;
        statut: string;
        type: string;
        date_echeance?: string;
        date_resolution?: string;
        temps_estime?: number;
        temps_passe: number;
        progression: number;
        notes_internes?: string;
        solution?: string;
        visible_client: boolean;
        user: {
            id: number;
            name: string;
        };
        creator: {
            id: number;
            name: string;
        };
        created_at: string;
        updated_at: string;
    }>;
    todos?: Array<{
        id: number;
        titre: string;
        description?: string;
        termine: boolean;
        ordre: number;
        priorite: string;
        date_echeance?: string;
        user: {
            id: number;
            name: string;
        };
        created_at: string;
        updated_at: string;
    }>;
    created_at: string;
}
```

#### Fonctionnalités avancées

**1. Envoi d'emails avec pièces jointes**
```typescript
const [emailForm, setEmailForm] = useState({
    objet: '',
    contenu: '',
    cc: '',
    attachments: [] as File[]
});

const handleSendEmail = async () => {
    const formData = new FormData();
    formData.append('objet', emailForm.objet);
    formData.append('contenu', emailForm.contenu);
    formData.append('cc', emailForm.cc);
    
    emailForm.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file);
    });

    router.post(`/clients/${client.id}/emails`, formData, {
        forceFormData: true,
        onSuccess: () => {
            toast.success('Email envoyé avec succès');
            setEmailForm({ objet: '', contenu: '', cc: '', attachments: [] });
        },
        onError: () => {
            toast.error('Erreur lors de l\'envoi de l\'email');
        }
    });
};
```

**2. Gestion des opportunités**
```typescript
const [opportunityForm, setOpportunityForm] = useState({
    nom: '',
    description: '',
    etape: 'prospection',
    probabilite: 0,
    montant: 0,
    date_cloture_prevue: '',
    notes: ''
});

const handleSaveOpportunity = async () => {
    const submitData = {
        ...opportunityForm,
        client_id: client.id,
        montant: Number(opportunityForm.montant),
        probabilite: Number(opportunityForm.probabilite)
    };

    router.post('/opportunities', submitData, {
        onSuccess: () => {
            toast.success('Opportunité créée avec succès');
            resetOpportunityForm();
        }
    });
};
```

**3. Système de tickets**
```typescript
const [ticketForm, setTicketForm] = useState({
    titre: '',
    description: '',
    priorite: 'moyenne',
    type: 'question',
    date_echeance: '',
    temps_estime: '',
    notes_internes: '',
    visible_client: true,
    user_id: auth.user.id
});

const handleSaveTicket = async () => {
    router.post('/tickets', {
        ...ticketForm,
        client_id: client.id,
        temps_estime: ticketForm.temps_estime ? Number(ticketForm.temps_estime) : null
    }, {
        onSuccess: () => {
            toast.success('Ticket créé avec succès');
            resetTicketForm();
        }
    });
};
```

**4. Todos avec drag & drop**
```typescript
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';

const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex(todo => todo.id === active.id);
    const newIndex = todos.findIndex(todo => todo.id === over.id);
    
    const newTodos = arrayMove(todos, oldIndex, newIndex);
    
    // Mise à jour immédiate de l'UI
    setTodos(newTodos);
    
    // Synchronisation avec le backend
    router.post('/todos/reorder', {
        todo_id: active.id,
        new_order: newIndex + 1
    });
};

const SortableTodoItem = ({ todo }: { todo: any }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {/* Contenu du todo */}
        </div>
    );
};
```

**5. Jauges interactives**
```typescript
const handleJaugeClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    const validPercentage = Math.max(0, Math.min(100, percentage));
    
    setOpportunityForm(prev => ({
        ...prev,
        probabilite: validPercentage
    }));
};

const handleProgressionJaugeClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    const validPercentage = Math.max(0, Math.min(100, percentage));
    
    setTicketForm(prev => ({
        ...prev,
        progression: validPercentage
    }));
};
```

#### Fonctions utilitaires

```typescript
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getStatusVariant = (statut: string) => {
    switch (statut) {
        case 'brouillon': return 'secondary';
        case 'envoye': return 'default';
        case 'accepte': return 'default';
        case 'refuse': return 'destructive';
        case 'expire': return 'secondary';
        default: return 'default';
    }
};

const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
        toast.success(`${label} copié dans le presse-papiers`);
    });
};
```

---

## 🎨 Composants UI Réutilisables

### Composants shadcn/ui utilisés

| Composant | Utilisation | Fichiers |
|-----------|-------------|----------|
| `Button` | Actions, navigation | Tous |
| `Card` | Conteneurs de sections | Tous |
| `Input` | Champs de saisie | create, edit |
| `Label` | Étiquettes de champs | create, edit |
| `Table` | Affichage des listes | index, show |
| `Badge` | Statuts et étiquettes | index, show |
| `Select` | Listes déroulantes | create, edit |
| `Checkbox` | Sélections multiples | index, create, edit |
| `Textarea` | Textes longs | create, edit, show |
| `Dialog` | Modales | create, edit, show |
| `Separator` | Séparateurs visuels | create, edit, show |

### Icônes Lucide React

```typescript
import {
    Plus, Eye, Edit, Trash2, Users, Search, Filter, Download,
    ArrowLeft, Save, User, Building2, MapPin, Mail, Phone,
    FileText, AlertCircle, Check, X, Calendar, Euro,
    TrendingUp, TrendingDown, BarChart3, Copy, CheckCircle,
    XCircle, Clock, Send, History, Loader2, Target,
    Percent, DollarSign, Edit3, AlertTriangle, Bug,
    HelpCircle, Settings, UserCheck, Timer, CheckSquare,
    RotateCcw, ListTodo, GripVertical, Paperclip, Upload
} from 'lucide-react';
```

---

## 🔧 Gestion d'État avec Hooks

### useState pour l'état local

```typescript
// États de filtrage et tri (index.tsx)
const [selectedClients, setSelectedClients] = useState<number[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
const [sortField, setSortField] = useState<keyof Client>('nom');
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

// États de formulaire (create.tsx, edit.tsx)
const [activeSection, setActiveSection] = useState<'personal' | 'contact' | 'business' | 'notes'>('personal');
const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
const [entrepriseSearch, setEntrepriseSearch] = useState('');
const [showEntrepriseModal, setShowEntrepriseModal] = useState(false);

// États complexes (show.tsx)
const [emailForm, setEmailForm] = useState({
    objet: '',
    contenu: '',
    cc: '',
    attachments: [] as File[]
});
const [opportunityForm, setOpportunityForm] = useState({
    nom: '',
    description: '',
    etape: 'prospection',
    probabilite: 0,
    montant: 0,
    date_cloture_prevue: '',
    notes: ''
});
```

### useForm d'Inertia.js

```typescript
// Création
const { data, setData, post, processing, errors, clearErrors } = useForm({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'France',
    entreprise_id: 'none',
    actif: true as boolean,
    notes: '',
});

// Édition avec données pré-remplies
const { data, setData, patch, processing, errors, isDirty: formIsDirty, reset } = useForm({
    nom: client.nom || '',
    prenom: client.prenom || '',
    email: client.email || '',
    // ... autres champs
});
```

### useMemo pour l'optimisation

```typescript
// Filtrage et tri optimisés
const filteredAndSortedClients = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase().trim();

    const filtered = clients.filter(client => {
        const matchesSearch = !searchTermLower ||
            (client.nom?.toLowerCase().includes(searchTermLower)) ||
            (client.prenom?.toLowerCase().includes(searchTermLower)) ||
            (client.email?.toLowerCase().includes(searchTermLower));
        
        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && client.actif) ||
            (statusFilter === 'inactive' && !client.actif);

        return matchesSearch && matchesStatus;
    });

    // Tri avec gestion des valeurs null
    filtered.sort((a, b) => {
        let aValue: any = a[sortField];
        let bValue: any = b[sortField];
        
        if (sortField === 'nom' || sortField === 'prenom' || sortField === 'email') {
            aValue = (aValue || '').toLowerCase();
            bValue = (bValue || '').toLowerCase();
        }
        
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortDirection === 'asc' ? 1 : -1;
        if (bValue == null) return sortDirection === 'asc' ? -1 : 1;
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    return filtered;
}, [clients, searchTerm, statusFilter, sortField, sortDirection]);

// Pagination optimisée
const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedClients.slice(startIndex, startIndex + itemsPerPage);
}, [filteredAndSortedClients, currentPage, itemsPerPage]);

// Recherche d'entreprises optimisée
const filteredEntreprises = useMemo(() => {
    if (!entrepriseSearch.trim()) return entreprises;
    
    const searchTerm = entrepriseSearch.toLowerCase().trim();
    return entreprises.filter(entreprise =>
        (entreprise.nom || '').toLowerCase().includes(searchTerm) ||
        (entreprise.nom_commercial || '').toLowerCase().includes(searchTerm)
    );
}, [entreprises, entrepriseSearch]);
```

### useEffect pour les effets de bord

```typescript
// Surveillance de la completion des sections
useEffect(() => {
    const newCompleted = new Set<string>();

    // Section personal
    if (data.nom && data.prenom && data.email) {
        newCompleted.add('personal');
    }

    // Section contact
    if (data.telephone || data.adresse || data.ville) {
        newCompleted.add('contact');
    }

    setCompletedSections(newCompleted);
}, [data]);

// Surveillance des modifications
useEffect(() => {
    setIsDirty(formIsDirty);
    setShowUnsavedChanges(formIsDirty);
}, [formIsDirty]);

// Chargement des utilisateurs
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
```

---

## 📱 Responsive Design et UX

### Adaptation mobile

```typescript
// Navigation mobile avec breadcrumbs condensés
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Clients',
        href: '/clients',
    },
];

// Formulaires en sections pour mobile
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
    <div>
        <Label htmlFor="nom">Nom *</Label>
        <Input
            id="nom"
            value={data.nom}
            onChange={(e) => setData('nom', e.target.value)}
            className={getFieldStatus('nom', data.nom) === 'error' ? 'border-red-500' : ''}
        />
    </div>
</div>

// Tableaux responsive avec scroll horizontal
<div className="rounded-md border overflow-x-auto">
    <Table>
        {/* Contenu du tableau */}
    </Table>
</div>
```

### Animations et transitions

```typescript
// États de chargement
{processing && (
    <div className="flex items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Enregistrement...
    </div>
)}

// Transitions entre sections
<div className={`transition-all duration-300 ${
    activeSection === 'personal' ? 'opacity-100' : 'opacity-50'
}`}>
    {/* Contenu de la section */}
</div>

// Feedback visuel pour les actions
const renderFieldIcon = (status: string) => {
    switch (status) {
        case 'success':
            return <Check className="h-4 w-4 text-green-500 animate-in fade-in-0" />;
        case 'error':
            return <AlertCircle className="h-4 w-4 text-red-500 animate-in fade-in-0" />;
        default:
            return null;
    }
};
```

---

## 🔍 Fonctionnalités Avancées

### Recherche intelligente

```typescript
const matchesSearch = !searchTermLower ||
    // Recherche dans les données client
    (client.nom?.toLowerCase().includes(searchTermLower)) ||
    (client.prenom?.toLowerCase().includes(searchTermLower)) ||
    (client.email?.toLowerCase().includes(searchTermLower)) ||
    (client.telephone?.toLowerCase().includes(searchTermLower)) ||
    (client.ville?.toLowerCase().includes(searchTermLower)) ||
    // Recherche dans les données entreprise
    (client.entreprise?.nom?.toLowerCase().includes(searchTermLower)) ||
    (client.entreprise?.nom_commercial?.toLowerCase().includes(searchTermLower));
```

### Actions en lot

```typescript
// Sélection et actions groupées
const handleDeleteSelected = () => {
    if (selectedClients.length === 0) {
        toast.error('Aucun client sélectionné');
        return;
    }

    router.post('/clients/delete-multiple', {
        client_ids: selectedClients
    }, {
        onSuccess: () => {
            toast.success(`${selectedClients.length} client(s) supprimé(s)`);
            setSelectedClients([]);
        },
        onError: () => {
            toast.error('Erreur lors de la suppression');
        }
    });
};

// Exports et rapports
const handleExportSelected = () => {
    if (selectedClients.length === 0) {
        toast.error('Aucun client sélectionné');
        return;
    }

    router.post('/clients/export', {
        client_ids: selectedClients,
        format: 'csv'
    });
};
```

### Validation côté client

```typescript
const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.nom.trim()) {
        newErrors.nom = 'Le nom est obligatoire';
    }

    if (!data.prenom.trim()) {
        newErrors.prenom = 'Le prénom est obligatoire';
    }

    if (!data.email.trim()) {
        newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email = 'Format d\'email invalide';
    }

    if (data.telephone && !/^[0-9+\-\s()]+$/.test(data.telephone)) {
        newErrors.telephone = 'Format de téléphone invalide';
    }

    return newErrors;
};
```

---

## 📊 Performance et Optimisation

### Optimisations implémentées

**1. Mémorisation des calculs coûteux**
```typescript
const filteredAndSortedClients = useMemo(() => {
    // Logique de filtrage et tri
}, [clients, searchTerm, statusFilter, sortField, sortDirection]);

const paginatedClients = useMemo(() => {
    // Logique de pagination
}, [filteredAndSortedClients, currentPage, itemsPerPage]);
```

**2. Réduction des re-rendus**
```typescript
const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
}, []);

const handleSort = useCallback((field: keyof Client) => {
    if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortField(field);
        setSortDirection('asc');
    }
}, [sortField, sortDirection]);
```

**3. Chargement différé des données**
```typescript
useEffect(() => {
    const loadUserList = async () => {
        if (showUserSelector) {
            try {
                const response = await fetch('/api/users');
                const users = await response.json();
                setUsers(users);
            } catch (error) {
                console.error('Erreur chargement utilisateurs:', error);
            }
        }
    };

    loadUserList();
}, [showUserSelector]);
```

### Gestion des erreurs

```typescript
const handleAsyncAction = async (action: () => Promise<void>) => {
    try {
        setLoading(true);
        await action();
        toast.success('Action réussie');
    } catch (error) {
        console.error('Erreur:', error);
        toast.error('Une erreur est survenue');
    } finally {
        setLoading(false);
    }
};
```

---

## 🎯 Types TypeScript Spécialisés

### Types de base

```typescript
type ClientStatus = 'all' | 'active' | 'inactive';
type SectionType = 'personal' | 'contact' | 'business' | 'notes';
type SortDirection = 'asc' | 'desc';
type FieldStatus = 'default' | 'success' | 'error';

interface ClientFormData {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    code_postal: string;
    pays: string;
    entreprise_id: string;
    actif: boolean;
    notes: string;
}

interface FilterState {
    search: string;
    status: ClientStatus;
    city: string;
    page: number;
    perPage: number;
    sortField: keyof Client;
    sortDirection: SortDirection;
}
```

### Types pour les actions

```typescript
interface DeleteDialogState {
    isOpen: boolean;
    client: Client | null;
}

interface EmailFormData {
    objet: string;
    contenu: string;
    cc: string;
    attachments: File[];
}

interface OpportunityFormData {
    nom: string;
    description: string;
    etape: string;
    probabilite: number;
    montant: number;
    date_cloture_prevue: string;
    notes: string;
}

interface TicketFormData {
    titre: string;
    description: string;
    priorite: string;
    type: string;
    date_echeance: string;
    temps_estime: string;
    notes_internes: string;
    visible_client: boolean;
    user_id: number;
}
```

### Types pour les événements

```typescript
type ClientActionHandler = (clientId: number) => void;
type FormSubmitHandler = (e: React.FormEvent) => void;
type SearchChangeHandler = (value: string) => void;
type SelectChangeHandler = (value: string) => void;
type CheckboxChangeHandler = (checked: boolean) => void;
type FileChangeHandler = (files: File[]) => void;
```

---

## 🎉 Conclusion

Les composants React du système de gestion des clients représentent **4773 lignes de code** sophistiquées offrant :

### Fonctionnalités implémentées

✅ **Liste interactive** - Filtrage, tri, pagination, sélection multiple  
✅ **Formulaires avancés** - Multi-sections, validation temps réel, auto-complétion  
✅ **Vue détaillée complète** - Gestion emails, opportunités, tickets, todos  
✅ **Intégration entreprises** - Recherche, création à la volée  
✅ **Drag & drop** - Réorganisation des todos  
✅ **Responsive design** - Adaptation mobile/desktop  
✅ **Performance optimisée** - Mémorisation, lazy loading  
✅ **Type safety** - TypeScript complet  

### Architecture technique

- **React 18** avec hooks modernes
- **Inertia.js** pour la navigation seamless
- **shadcn/ui** pour l'UI moderne
- **@dnd-kit** pour les interactions avancées
- **TypeScript** pour la robustesse du code

### Expérience utilisateur

- **Interface intuitive** avec feedback immédiat
- **Actions rapides** avec raccourcis clavier
- **Gestion d'erreurs** gracieuse
- **Notifications** contextuelles
- **Navigation fluide** entre les sections

Cette architecture modulaire et performante constitue une base solide pour la gestion des clients du Dashboard Madinia.