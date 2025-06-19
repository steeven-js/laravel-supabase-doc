# Module 6: Composants React - Interface Utilisateur

## Vue d'ensemble

Le Dashboard Madinia utilise une architecture React moderne basée sur **Inertia.js** avec **TypeScript**, **Tailwind CSS**, et **shadcn/ui**. L'interface utilisateur est composée de composants modulaires et réutilisables qui forment un système de design cohérent.

---

## 🏗️ Architecture des Composants

### Structure organisationnelle

```
resources/js/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants de base (shadcn/ui)
│   ├── pdf/            # Composants PDF (React-PDF)
│   └── *.tsx           # Composants applicatifs
├── pages/              # Pages de l'application
│   ├── admin/
│   ├── clients/
│   ├── devis/
│   ├── factures/
│   └── ...
├── layouts/            # Layouts principaux
├── hooks/              # Hooks personnalisés
├── types/              # Définitions TypeScript
└── lib/                # Utilitaires
```

---

## 🎨 Système de Design

### Thématique et couleurs

Le système utilise **CSS variables** avec support du mode sombre :

```css
:root {
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --accent: oklch(0.97 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --sidebar: oklch(0.985 0 0);
    --radius: 0.625rem;
}

.dark {
    --primary: oklch(0.985 0 0);
    --secondary: oklch(0.269 0 0);
    /* ... autres variables mode sombre */
}
```

### Classes utilitaires personnalisées

```css
.page-container {
    @apply flex h-full flex-1 flex-col gap-6 rounded-xl p-4;
}

.page-header {
    @apply flex items-center justify-between;
}

.page-title {
    @apply text-3xl font-bold tracking-tight;
}

.page-subtitle {
    @apply text-muted-foreground;
}
```

---

## 🧩 Composants de Base (UI)

### Catalogue des composants shadcn/ui

| Composant | Description | Utilisation |
|-----------|-------------|-------------|
| `Avatar` | Photos de profil | Menu utilisateur, listes |
| `Badge` | Étiquettes colorées | Statuts, catégories |
| `Button` | Boutons d'action | Formulaires, actions |
| `Card` | Conteneurs de contenu | Sections, widgets |
| `Dialog` | Fenêtres modales | Confirmations, formulaires |
| `Input` | Champs de saisie | Formulaires |
| `Select` | Listes déroulantes | Sélections |
| `Table` | Tableaux de données | Listes clients, devis, factures |
| `Tabs` | Onglets | Navigation contextuelle |
| `Toast` | Notifications | Feedback utilisateur |

### Exemple d'implémentation

```typescript
// components/ui/button.tsx
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground",
                outline: "border border-input bg-background hover:bg-accent",
                secondary: "bg-secondary text-secondary-foreground",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);
```

---

## 🏠 Composants de Layout

### AppHeader

**Fichier :** `components/app-header.tsx`

**Fonctionnalités :**
- Navigation principale responsive
- Menu utilisateur avec avatar
- Dropdown des notifications
- Breadcrumbs contextuels
- Menu mobile avec Sheet

**Structure :**
```typescript
interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];
```

### AppSidebar

**Fichier :** `components/app-sidebar.tsx`

**Fonctionnalités :**
- Navigation latérale avec groupes
- Gestion des permissions (admin/super_admin)
- Indicateurs de navigation active
- Collapsible et responsive

### Navigation adaptative

**Mobile :**
- Menu hamburger (Sheet)
- Navigation simplifiée
- Touch-friendly

**Desktop :**
- Sidebar persistante
- Navigation horizontale
- Tooltips informatifs

---

## 📝 Composants de Formulaires

### Structure type

```typescript
// Exemple : Formulaire client
interface ClientFormData {
    nom: string;
    email: string;
    telephone?: string;
    entreprise_id?: number;
}

function ClientForm({ client, onSubmit }: ClientFormProps) {
    const { data, setData, post, processing, errors } = useForm<ClientFormData>({
        nom: client?.nom || '',
        email: client?.email || '',
        telephone: client?.telephone || '',
        entreprise_id: client?.entreprise_id || undefined,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('clients.store'), {
            onSuccess: () => {
                toast.success('Client créé avec succès');
            },
            onError: () => {
                toast.error('Erreur lors de la création');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                        id="nom"
                        value={data.nom}
                        onChange={(e) => setData('nom', e.target.value)}
                        className={errors.nom ? 'border-destructive' : ''}
                    />
                    {errors.nom && <p className="text-sm text-destructive">{errors.nom}</p>}
                </div>
                {/* ... autres champs */}
            </div>
            
            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button">
                    Annuler
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
            </div>
        </form>
    );
}
```

---

## 📊 Composants de Données

### Tableaux avec DataTable

**Fonctionnalités :**
- Tri multi-colonnes
- Pagination
- Filtrage et recherche
- Sélection multiple
- Actions en lot

**Exemple :**
```typescript
interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    searchPlaceholder?: string;
    pagination?: boolean;
}

function DataTable<TData>({ columns, data, searchPlaceholder }: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    return (
        <div className="space-y-4">
            {/* Barre de recherche et filtres */}
            <div className="flex items-center justify-between">
                <Input
                    placeholder={searchPlaceholder || "Filtrer..."}
                    value={(table.getColumn("nom")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("nom")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            {/* Tableau */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Aucun résultat.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} sur{" "}
                    {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Précédent
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Suivant
                    </Button>
                </div>
            </div>
        </div>
    );
}
```

---

## 📄 Composants PDF

### Architecture React-PDF

**Fichiers principaux :**
- `DevisPdfPreview.tsx` (32KB, 775 lignes)
- `FacturePdfPreview.tsx` (28KB, 680 lignes)
- `PdfSaveButton.tsx` (5.1KB, 145 lignes)

### DevisPdfPreview

**Fonctionnalités :**
- Génération PDF professionnel
- Template responsive
- Calculs automatiques
- Intégration Supabase
- Preview en temps réel

**Structure :**
```typescript
interface DevisPdfPreviewProps {
    devis: Devis;
    lignes: LigneDevis[];
    client: Client;
    entreprise?: Entreprise;
    madinia: Madinia;
}

export default function DevisPdfPreview({ 
    devis, 
    lignes, 
    client, 
    entreprise, 
    madinia 
}: DevisPdfPreviewProps) {
    // Calculs
    const sousTotal = lignes.reduce((total, ligne) => 
        total + (ligne.quantite * ligne.prix_unitaire), 0
    );
    const tva = sousTotal * 0.2;
    const totalTTC = sousTotal + tva;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* En-tête avec logos */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.companyName}>{madinia.nom}</Text>
                    </View>
                    <View style={styles.documentInfo}>
                        <Text style={styles.documentTitle}>DEVIS</Text>
                        <Text style={styles.documentNumber}>N° {devis.numero_devis}</Text>
                    </View>
                </View>

                {/* Informations client/entreprise */}
                <View style={styles.clientInfo}>
                    <View style={styles.clientColumn}>
                        <Text style={styles.sectionTitle}>Émetteur</Text>
                        <Text style={styles.companyInfo}>{madinia.nom}</Text>
                        <Text style={styles.addressInfo}>{madinia.adresse}</Text>
                        <Text style={styles.contactInfo}>
                            Email: {madinia.email}
                        </Text>
                    </View>
                    
                    <View style={styles.clientColumn}>
                        <Text style={styles.sectionTitle}>Destinataire</Text>
                        {entreprise ? (
                            <>
                                <Text style={styles.companyInfo}>{entreprise.nom}</Text>
                                <Text style={styles.clientName}>
                                    À l'attention de : {client.nom}
                                </Text>
                            </>
                        ) : (
                            <Text style={styles.clientName}>{client.nom}</Text>
                        )}
                        <Text style={styles.contactInfo}>Email: {client.email}</Text>
                    </View>
                </View>

                {/* Tableau des prestations */}
                <View style={styles.servicesTable}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableCell, styles.descriptionColumn]}>
                            Description
                        </Text>
                        <Text style={[styles.tableCell, styles.quantityColumn]}>
                            Quantité
                        </Text>
                        <Text style={[styles.tableCell, styles.priceColumn]}>
                            Prix unitaire
                        </Text>
                        <Text style={[styles.tableCell, styles.totalColumn]}>
                            Total HT
                        </Text>
                    </View>
                    
                    {lignes.map((ligne, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.descriptionColumn]}>
                                {ligne.service?.nom}
                            </Text>
                            <Text style={[styles.tableCell, styles.quantityColumn]}>
                                {ligne.quantite} {formatUnite(ligne.service?.unite, ligne.quantite)}
                            </Text>
                            <Text style={[styles.tableCell, styles.priceColumn]}>
                                {ligne.prix_unitaire.toLocaleString('fr-FR')} €
                            </Text>
                            <Text style={[styles.tableCell, styles.totalColumn]}>
                                {(ligne.quantite * ligne.prix_unitaire).toLocaleString('fr-FR')} €
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totaux */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalsContainer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Sous-total HT :</Text>
                            <Text style={styles.totalValue}>
                                {sousTotal.toLocaleString('fr-FR')} €
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TVA (20%) :</Text>
                            <Text style={styles.totalValue}>
                                {tva.toLocaleString('fr-FR')} €
                            </Text>
                        </View>
                        <View style={[styles.totalRow, styles.grandTotalRow]}>
                            <Text style={styles.grandTotalLabel}>Total TTC :</Text>
                            <Text style={styles.grandTotalValue}>
                                {totalTTC.toLocaleString('fr-FR')} €
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Conditions */}
                <View style={styles.conditions}>
                    <Text style={styles.conditionsTitle}>Conditions :</Text>
                    <Text style={styles.conditionsText}>
                        • Devis valable 30 jours
                        • Acompte de 30% à la commande
                        • Solde à la livraison
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
```

### PdfSaveButton

**Fonctionnalités :**
- Sauvegarde locale et Supabase
- États de chargement
- Gestion d'erreurs
- Feedback utilisateur

---

## 🔧 Hooks Personnalisés

### useAppearance

**Fichier :** `hooks/use-appearance.tsx`

**Fonction :** Gestion du thème clair/sombre

```typescript
interface AppearanceContextType {
    appearance: Appearance;
    setAppearance: (appearance: Appearance) => void;
}

export function useAppearance() {
    const context = useContext(AppearanceContext);
    if (!context) {
        throw new Error('useAppearance must be used within AppearanceProvider');
    }
    return context;
}
```

### useInitials

**Fichier :** `hooks/use-initials.tsx`

**Fonction :** Génération d'initiales pour avatars

```typescript
export function useInitials() {
    return useCallback((name: string) => {
        return name
            .split(' ')
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, []);
}
```

---

## 🗂️ Types TypeScript

### Interfaces principales

```typescript
// types/index.d.ts
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    user_role_id?: number;
    user_role?: UserRole;
    role?: string;
}

export interface UserRole {
    id: number;
    name: 'super_admin' | 'admin';
    display_name: string;
    description?: string;
    permissions?: string[];
    is_active: boolean;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    requiresSuperAdmin?: boolean;
    requiresAdmin?: boolean;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}
```

---

## 🎯 Composants Spécialisés

### NotificationsDropdown

**Fichier :** `components/notifications-dropdown.tsx` (12KB, 289 lignes)

**Fonctionnalités :**
- Affichage des notifications en temps réel
- Badge de compteur
- Actions (marquer comme lu, supprimer)
- Auto-refresh

### EmailTemplateSelector

**Fichier :** `components/EmailTemplateSelector.tsx` (16KB, 364 lignes)

**Fonctionnalités :**
- Sélection de templates d'email
- Preview en temps réel
- Variables dynamiques
- Validation

### DeleteConfirmationDialog

**Fichier :** `components/ui/delete-confirmation-dialog.tsx`

**Fonctionnalités :**
- Confirmation de suppression
- Protection contre suppressions accidentelles
- Animations fluides

---

## 📱 Responsive Design

### Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Mobile large */
md: 768px   /* Tablette */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop large */
2xl: 1536px /* Desktop XL */
```

### Stratégie mobile-first

1. **Design mobile par défaut**
2. **Progressive enhancement**
3. **Touch-friendly interfaces**
4. **Optimisation des performances**

### Composants adaptatifs

- Navigation collapsible
- Tableaux avec scroll horizontal
- Formulaires stack sur mobile
- Modales full-screen sur petit écran

---

## ⚡ Performance et Optimisation

### Lazy Loading

```typescript
// Chargement différé des pages
const ClientsIndex = lazy(() => import('@/pages/clients/index'));
const DevisCreate = lazy(() => import('@/pages/devis/create'));

// Wrapper avec Suspense
<Suspense fallback={<Skeleton />}>
    <ClientsIndex />
</Suspense>
```

### Memoization

```typescript
// Mémorisation des calculs coûteux
const calculatedTotals = useMemo(() => {
    return lignes.reduce((totals, ligne) => {
        const subtotal = ligne.quantite * ligne.prix_unitaire;
        return {
            sousTotal: totals.sousTotal + subtotal,
            tva: (totals.sousTotal + subtotal) * 0.2,
            total: (totals.sousTotal + subtotal) * 1.2,
        };
    }, { sousTotal: 0, tva: 0, total: 0 });
}, [lignes]);

// Mémorisation des composants
const OptimizedTableRow = memo(({ client, onEdit, onDelete }: TableRowProps) => {
    return (
        <TableRow>
            <TableCell>{client.nom}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>
                <Button onClick={() => onEdit(client.id)}>Éditer</Button>
                <Button onClick={() => onDelete(client.id)}>Supprimer</Button>
            </TableCell>
        </TableRow>
    );
});
```

---

## 🧪 Tests et Qualité

### Structure de tests

```
tests/Frontend/
├── components/
│   ├── ui/
│   │   ├── button.test.tsx
│   │   └── table.test.tsx
│   ├── app-header.test.tsx
│   └── notifications-dropdown.test.tsx
├── pages/
│   ├── clients.test.tsx
│   └── devis.test.tsx
└── hooks/
    ├── use-appearance.test.tsx
    └── use-initials.test.tsx
```

### Exemple de test

```typescript
// components/ui/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
    it('renders correctly with default props', () => {
        render(<Button>Test Button</Button>);
        
        const button = screen.getByRole('button', { name: /test button/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-primary');
    });

    it('applies variant classes correctly', () => {
        render(<Button variant="destructive">Delete</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-destructive');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows disabled state correctly', () => {
        render(<Button disabled>Disabled</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:opacity-50');
    });
});
```

---

## 📋 Bonnes Pratiques

### 1. Structure des composants

```typescript
// Ordre recommandé dans un composant
function MonComposant({ prop1, prop2 }: MonComposantProps) {
    // 1. Hooks d'état
    const [state, setState] = useState();
    
    // 2. Hooks d'effet
    useEffect(() => {
        // logic
    }, []);
    
    // 3. Méthodes
    const handleAction = useCallback(() => {
        // logic
    }, []);
    
    // 4. Mémoizations
    const memoizedValue = useMemo(() => {
        return calculation();
    }, [dependencies]);
    
    // 5. Conditions de rendu précoce
    if (!data) return <Skeleton />;
    
    // 6. JSX principal
    return (
        <div>
            {/* contenu */}
        </div>
    );
}
```

### 2. Nommage des composants

- **PascalCase** pour les composants
- **camelCase** pour les props et variables
- **kebab-case** pour les fichiers CSS
- Préfixes descriptifs (`App`, `Page`, `Form`, etc.)

### 3. Gestion des états

```typescript
// États locaux pour l'UI
const [isLoading, setIsLoading] = useState(false);
const [errors, setErrors] = useState<Record<string, string>>({});

// Formulaires avec Inertia
const { data, setData, post, processing, errors: formErrors } = useForm({
    nom: '',
    email: '',
});

// États globaux avec Context si nécessaire
const { appearance, setAppearance } = useAppearance();
```

### 4. Accessibilité

```typescript
// Labels associés
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" aria-describedby="email-error" />
{errors.email && (
    <p id="email-error" className="text-destructive">
        {errors.email}
    </p>
)}

// Navigation au clavier
<Button
    onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleAction();
        }
    }}
>
    Action
</Button>

// Textes alternatifs
<Avatar>
    <AvatarImage src={user.avatar} alt={`Photo de ${user.name}`} />
    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
</Avatar>
```

---

## 🎉 Conclusion

Le système de composants React du Dashboard Madinia offre :

- **Architecture modulaire** avec composants réutilisables
- **Design system cohérent** basé sur shadcn/ui
- **Performance optimisée** avec lazy loading et memoization
- **Accessibilité intégrée** avec ARIA et navigation clavier
- **Responsive design** mobile-first
- **Type safety** complet avec TypeScript
- **Facilité de maintenance** avec structure claire

Cette architecture permet un développement rapide et maintenable tout en garantissant une expérience utilisateur excellente sur tous les appareils.