# 🔧 Module 3 : Système d'Unités & Enum ServiceUnite

> **Dashboard Madinia** - Documentation Technique Services  
> **Phase 1 : Fondations & Métier** - Module 3/8  
> **Dernière mise à jour** : 19 janvier 2025

---

## 📋 Présentation du Module

### **🎯 Objectif**
Documenter le système sophistiqué d'unités du Dashboard Madinia, basé sur l'enum PHP 8.1+ `ServiceUnite`, qui permet de gérer intelligemment les différents types d'unités de facturation avec formatage automatique singulier/pluriel.

### **🔍 Périmètre**
- Enum ServiceUnite avec 7 types d'unités
- Méthodes de formatage automatique
- Intégration avec le modèle Service
- Migration d'ajout des unités
- Utilisation dans formulaires et PDF
- Extensibilité du système

---

## 🏗️ Vue d'ensemble du Système d'Unités

### **🎯 Philosophie**
Le système d'unités permet de facturer des services selon différentes modalités (temps, forfait, licence, etc.) avec un formatage professionnel automatique qui s'adapte à la quantité.

### **📊 Types d'Unités Supportés**

| **Unité** | **Utilisation** | **Exemples** | **Secteur** |
|-----------|-----------------|--------------|-------------|
| **Heure** | Prestations horaires | Consultation, support | Conseil |
| **Jour** | Prestations journalières | Formation, audit | Expertise |
| **Semaine** | Missions courtes | Développement, intégration | Technique |
| **Mois** | Abonnements, maintenance | Hébergement, TMA | Récurrent |
| **Unité** | Produits, licences | Logiciels, matériel | Commercial |
| **Forfait** | Projets à prix fixe | Site web, application | Projet |
| **Licence** | Droits d'utilisation | SaaS, logiciels | Licensing |

---

## 🔧 Enum ServiceUnite - Structure Technique

### **📋 Définition Complète**

```php
<?php

namespace App;

enum ServiceUnite: string
{
    case HEURE = 'heure';
    case JOUR = 'jour';
    case SEMAINE = 'semaine';
    case MOIS = 'mois';
    case UNITE = 'unite';
    case FORFAIT = 'forfait';
    case LICENCE = 'licence';

    /**
     * Libellé singulier de l'unité
     */
    public function getSingulier(): string
    {
        return match($this) {
            self::HEURE => 'heure',
            self::JOUR => 'jour',
            self::SEMAINE => 'semaine',
            self::MOIS => 'mois',
            self::UNITE => 'unité',
            self::FORFAIT => 'forfait',
            self::LICENCE => 'licence',
        };
    }

    /**
     * Libellé pluriel de l'unité
     */
    public function getPluriel(): string
    {
        return match($this) {
            self::HEURE => 'heures',
            self::JOUR => 'jours',
            self::SEMAINE => 'semaines',
            self::MOIS => 'mois',
            self::UNITE => 'unités',
            self::FORFAIT => 'forfaits',
            self::LICENCE => 'licences',
        };
    }

    /**
     * Libellé formaté selon la quantité
     */
    public function getLibelle(int $quantite = 1): string
    {
        return $quantite <= 1 ? $this->getSingulier() : $this->getPluriel();
    }

    /**
     * Toutes les unités disponibles
     */
    public static function toArray(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    /**
     * Unités avec libellés pour formulaires
     */
    public static function getOptions(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => ucfirst($case->getSingulier())
        ], self::cases());
    }
}
```

### **🎯 Fonctionnalités Avancées**

#### **1. Formatage Automatique Intelligent**

```php
$unite = ServiceUnite::HEURE;

// Formatage selon la quantité
echo $unite->getLibelle(1);    // "heure"
echo $unite->getLibelle(0);    // "heure" (singulier par défaut)
echo $unite->getLibelle(2);    // "heures"
echo $unite->getLibelle(24);   // "heures"

// Accès direct aux formes
echo $unite->getSingulier();   // "heure"
echo $unite->getPluriel();     // "heures"
```

#### **2. Méthodes Utilitaires**

```php
// Toutes les valeurs enum
$unites = ServiceUnite::toArray();
// ['heure', 'jour', 'semaine', 'mois', 'unite', 'forfait', 'licence']

// Options pour formulaires
$options = ServiceUnite::getOptions();
// [
//     ['value' => 'heure', 'label' => 'Heure'],
//     ['value' => 'jour', 'label' => 'Jour'],
//     // ...
// ]
```

---

## 🔗 Intégration avec le Modèle Service

### **🎯 Casting Automatique**

```php
// Dans le modèle Service
protected $casts = [
    'unite' => ServiceUnite::class,  // Casting automatique
    // ...
];
```

**Avantages du casting :**
- **Type Safety** : Garantit que l'unité est valide
- **Méthodes Enum** : Accès direct aux méthodes getSingulier(), getPluriel()
- **Validation** : Erreur automatique si valeur invalide

### **📊 Utilisation dans le Modèle**

```php
// Méthode dans Service.php
public function getUniteLibelle(?int $quantite = null): string
{
    $qte = $quantite ?? $this->qte_defaut ?? 1;
    return $this->unite ? $this->unite->getLibelle($qte) : 'unité';
}

// Utilisation
$service = Service::find(1);
echo $service->getUniteLibelle();     // "heure" ou "heures"
echo $service->getUniteLibelle(3);    // "heures"
```

### **🔄 Exemples Pratiques**

```php
// Service de consultation
$consultation = Service::create([
    'nom' => 'Consultation Web',
    'prix_ht' => 150.00,
    'qte_defaut' => 2,
    'unite' => ServiceUnite::HEURE,  // Enum directement
]);

// Formatage automatique
echo $consultation->getUniteLibelle();  // "heures" (car qte_defaut = 2)

// Service forfaitaire
$projet = Service::create([
    'nom' => 'Site Web Vitrine',
    'prix_ht' => 2500.00,
    'qte_defaut' => 1,
    'unite' => ServiceUnite::FORFAIT,
]);

echo $projet->getUniteLibelle();       // "forfait"
```

---

## 📊 Migration et Évolution du Schéma

### **🏗️ Migration d'Ajout des Unités**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->enum('unite', [
                'heure',
                'jour', 
                'semaine',
                'mois',
                'unite',
                'forfait',
                'licence'
            ])->default('heure')->after('qte_defaut');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('unite');
        });
    }
};
```

### **📈 Évolution des Données**

```php
// Mise à jour des services existants
DB::table('services')->update([
    'unite' => 'heure'  // Valeur par défaut
]);

// Mise à jour spécifique par type
DB::table('services')
    ->where('nom', 'like', '%forfait%')
    ->update(['unite' => 'forfait']);

DB::table('services')
    ->where('nom', 'like', '%maintenance%')
    ->update(['unite' => 'mois']);
```

---

## 🎨 Utilisation dans l'Interface

### **📝 Formulaires React**

```typescript
// Types TypeScript
interface ServiceUniteOption {
    value: string;
    label: string;
}

// Composant Select
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function ServiceUniteSelect({ value, onChange }: {
    value: string;
    onChange: (value: string) => void;
}) {
    const unites = [
        { value: 'heure', label: 'Heure' },
        { value: 'jour', label: 'Jour' },
        { value: 'semaine', label: 'Semaine' },
        { value: 'mois', label: 'Mois' },
        { value: 'unite', label: 'Unité' },
        { value: 'forfait', label: 'Forfait' },
        { value: 'licence', label: 'Licence' },
    ];

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder="Sélectionner une unité" />
            </SelectTrigger>
            <SelectContent>
                {unites.map((unite) => (
                    <SelectItem key={unite.value} value={unite.value}>
                        {unite.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
```

### **🎯 Affichage Formaté**

```typescript
// Fonction utilitaire pour formatage
function formatUniteService(unite: string, quantite: number): string {
    const unites = {
        'heure': { sing: 'heure', plur: 'heures' },
        'jour': { sing: 'jour', plur: 'jours' },
        'semaine': { sing: 'semaine', plur: 'semaines' },
        'mois': { sing: 'mois', plur: 'mois' },
        'unite': { sing: 'unité', plur: 'unités' },
        'forfait': { sing: 'forfait', plur: 'forfaits' },
        'licence': { sing: 'licence', plur: 'licences' },
    };

    const u = unites[unite as keyof typeof unites];
    return quantite <= 1 ? u.sing : u.plur;
}

// Utilisation dans composants
function ServiceLine({ service, quantite }: { service: Service, quantite: number }) {
    return (
        <div className="flex justify-between">
            <span>{service.nom}</span>
            <span>
                {quantite} {formatUniteService(service.unite, quantite)} 
                × {service.prix_ht}€ HT
            </span>
        </div>
    );
}
```

---

## 📄 Utilisation dans les PDF

### **🎯 Génération PDF avec Unités**

```typescript
// Dans DevisPdfPreview.tsx et FacturePdfPreview.tsx
import { formatUnite } from '@/lib/utils';

function LigneService({ ligne }: { ligne: LigneDevis }) {
    return (
        <View style={styles.ligneService}>
            <Text style={styles.nomService}>{ligne.service.nom}</Text>
            <Text style={styles.quantite}>
                {ligne.quantite} {formatUnite(ligne.service.unite, ligne.quantite)}
            </Text>
            <Text style={styles.prixUnitaire}>
                {ligne.prix_unitaire_ht}€ HT
            </Text>
            <Text style={styles.montantTotal}>
                {ligne.montant_ttc}€ TTC
            </Text>
        </View>
    );
}

// Fonction utilitaire
function formatUnite(unite: string, quantite: number): string {
    // Même logique que côté serveur
    const formatters = {
        'heure': (q: number) => q <= 1 ? 'heure' : 'heures',
        'jour': (q: number) => q <= 1 ? 'jour' : 'jours',
        'forfait': (q: number) => q <= 1 ? 'forfait' : 'forfaits',
        // ...
    };
    
    return formatters[unite]?.(quantite) || unite;
}
```

### **📊 Exemple Rendu PDF**

```
DEVIS #DV-25-0001
─────────────────────────────────────────────

Service                 Qté    Prix Unit.    Total
─────────────────────────────────────────────
Consultation Web        2 heures    150€ HT    300€ HT
Développement App       1 forfait  2500€ HT   2500€ HT
Maintenance Site        6 mois       80€ HT    480€ HT
Licence CMS             3 unités    200€ HT    600€ HT
─────────────────────────────────────────────
                              TOTAL HT: 3880€ HT
                              TVA 20%:   776€
                              TOTAL TTC: 4656€ TTC
```

---

## 🔍 Validation et Contrôles

### **⚡ Validation Formulaires**

```php
// Dans ServiceController
public function store(Request $request)
{
    $validated = $request->validate([
        'nom' => 'required|string|max:255',
        'prix_ht' => 'required|numeric|min:0',
        'qte_defaut' => 'required|integer|min:1',
        'unite' => ['required', 'string', Rule::in(ServiceUnite::toArray())],
        'actif' => 'boolean',
    ]);

    // ServiceUnite::from() va automatiquement valider et convertir
    $service = Service::create($validated);
    
    return redirect()->route('services.index')
        ->with('success', 'Service créé avec succès');
}
```

### **🔒 Sécurité et Type Safety**

```php
// Validation automatique par l'enum
try {
    $unite = ServiceUnite::from($input['unite']);
} catch (ValueError $e) {
    // Valeur d'unité invalide
    return back()->withErrors(['unite' => 'Unité invalide']);
}

// Impossible d'avoir une valeur d'unité non prévue
$service->unite = ServiceUnite::HEURE;  // ✅ Valide
$service->unite = ServiceUnite::from('heure');  // ✅ Valide  
$service->unite = 'invalid_unit';  // ❌ Erreur PHP
```

---

## 📊 Statistiques par Unité

### **📈 Métriques Métier**

```php
// Statistiques d'utilisation par unité
$statsUnites = Service::selectRaw('
    unite,
    COUNT(*) as nb_services,
    SUM(CASE WHEN actif = 1 THEN 1 ELSE 0 END) as nb_actifs,
    AVG(prix_ht) as prix_moyen,
    SUM(prix_ht) as ca_potentiel
')
->groupBy('unite')
->get();

// Exemple de résultat
foreach ($statsUnites as $stat) {
    echo "Unité: {$stat->unite}\n";
    echo "Services: {$stat->nb_services} (dont {$stat->nb_actifs} actifs)\n";
    echo "Prix moyen: {$stat->prix_moyen}€ HT\n";
    echo "CA potentiel: {$stat->ca_potentiel}€ HT\n\n";
}
```

### **🔍 Analyse Devis/Factures par Unité**

```php
// CA réalisé par type d'unité
$caParUnite = DB::table('lignes_factures')
    ->join('services', 'lignes_factures.service_id', '=', 'services.id')
    ->join('factures', 'lignes_factures.facture_id', '=', 'factures.id')
    ->where('factures.statut', 'payee')
    ->selectRaw('
        services.unite,
        COUNT(*) as nb_lignes,
        SUM(lignes_factures.quantite) as qte_totale,
        SUM(lignes_factures.montant_ttc) as ca_ttc
    ')
    ->groupBy('services.unite')
    ->orderBy('ca_ttc', 'desc')
    ->get();

// Analyse des performances
foreach ($caParUnite as $ca) {
    $unite = ServiceUnite::from($ca->unite);
    echo "Unité: {$unite->getSingulier()}\n";
    echo "Lignes facturées: {$ca->nb_lignes}\n";
    echo "Quantité totale: {$ca->qte_totale} {$unite->getLibelle($ca->qte_totale)}\n";
    echo "CA TTC: {$ca->ca_ttc}€\n\n";
}
```

---

## 🚀 Extensibilité du Système

### **🔧 Ajout de Nouvelles Unités**

```php
// Pour ajouter une nouvelle unité :

// 1. Modifier l'enum ServiceUnite
enum ServiceUnite: string
{
    // Unités existantes...
    case TRIMESTRE = 'trimestre';  // Nouvelle unité
    case ANNEE = 'annee';          // Nouvelle unité

    public function getSingulier(): string
    {
        return match($this) {
            // Cases existantes...
            self::TRIMESTRE => 'trimestre',
            self::ANNEE => 'année',
        };
    }

    public function getPluriel(): string
    {
        return match($this) {
            // Cases existantes...
            self::TRIMESTRE => 'trimestres',
            self::ANNEE => 'années',
        };
    }
}
```

### **🗃️ Migration d'Extension**

```php
// Migration pour ajouter de nouvelles valeurs
Schema::table('services', function (Blueprint $table) {
    $table->enum('unite', [
        'heure', 'jour', 'semaine', 'mois', 'unite', 'forfait', 'licence',
        'trimestre', 'annee'  // Nouvelles valeurs
    ])->default('heure')->change();
});
```

### **🎯 Unités Spécialisées**

```php
// Possibilité d'ajouter des unités métier spécifiques
enum ServiceUnite: string
{
    // Unités génériques
    case HEURE = 'heure';
    case JOUR = 'jour';
    
    // Unités spécialisées
    case PAGE_WEB = 'page_web';
    case UTILISATEUR = 'utilisateur';
    case TRANSACTION = 'transaction';
    case GIGAOCTET = 'gigaoctet';
    
    // Méthodes spécialisées
    public function getSymbole(): ?string
    {
        return match($this) {
            self::GIGAOCTET => 'Go',
            self::HEURE => 'h',
            default => null,
        };
    }
}
```

---

## 💡 Bonnes Pratiques

### **✅ Recommandations**

1. **🎯 Cohérence** : Utiliser toujours l'enum pour garantir la cohérence
2. **🔒 Validation** : Valider les unités en entrée avec `Rule::in()`
3. **📊 Performance** : Utiliser les index sur le champ `unite` si filtrage fréquent
4. **🎨 UX** : Afficher les unités de façon claire dans l'interface
5. **📄 PDF** : Assurer la cohérence des unités dans tous les documents

### **❌ Pièges à Éviter**

1. **Hardcoding** : Ne jamais hardcoder les valeurs d'unité en dur
2. **String non typé** : Éviter les chaînes de caractères non validées
3. **Pluriel manuel** : Utiliser toujours les méthodes de l'enum
4. **Validation côté client** : Toujours valider côté serveur aussi
5. **Migration sans plan** : Prévoir la migration des données existantes

---

## 🎯 Points Clés du Système

### **💎 Avantages Techniques**

1. **🔒 Type Safety** : Enum PHP 8.1+ avec validation automatique
2. **🎯 Formatage Intelligent** : Singulier/pluriel automatique selon quantité
3. **🔗 Intégration Transparente** : Casting automatique dans Eloquent
4. **🎨 UX Optimisée** : Affichage professionnel dans toute l'application
5. **📊 Extensibilité** : Ajout facile de nouvelles unités
6. **🌍 Standardisation** : Format uniforme dans PDF, emails, interface

### **📈 Impact Métier**

- **💼 Flexibilité** : Support de tous types de prestations
- **📊 Clarté** : Devis et factures plus lisibles
- **⚡ Productivité** : Moins d'erreurs de saisie
- **🎯 Professionnalisme** : Documents clients impeccables

---

*📚 **Prochaines étapes** : Module 4 - Controller - CRUD & Fonctionnalités Avancées*

---

**🏷️ Tags** : `enum` `php8.1` `unités` `formatage` `validation` `type-safety` `ux` `métier` 