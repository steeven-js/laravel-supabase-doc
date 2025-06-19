# 🗄️ Module 3 : Base de Données & Structure Métier

## 📋 Vue d'ensemble

Le système de gestion des entreprises utilise une structure de base de données optimisée pour les besoins métier B2B, avec des champs spécialisés pour l'identification administrative française (SIRET, SIREN) et une approche flexible pour l'internationalisation.

## 🏗️ Migration Principal

### 📁 Fichier : `create_entreprises_table.php`

```php
Schema::create('entreprises', function (Blueprint $table) {
    $table->id();
    
    // ✅ IDENTIFICATION DE BASE
    $table->string('nom');                    // OBLIGATOIRE - Raison sociale
    $table->string('nom_commercial')->nullable(); // Nom commercial (optionnel)
    
    // 🏛️ IDENTIFICATION ADMINISTRATIVE FRANÇAISE
    $table->string('siret')->nullable()->unique(); // SIRET unique
    $table->string('siren')->nullable();           // SIREN (9 premiers du SIRET)
    $table->string('secteur_activite')->nullable(); // Secteur d'activité libre
    
    // 📍 ADRESSE COMPLÈTE
    $table->text('adresse')->nullable();
    $table->string('ville')->nullable();
    $table->string('code_postal')->nullable();
    $table->string('pays')->nullable()->default('France'); // Par défaut France
    
    // 📞 CONTACT
    $table->string('telephone')->nullable();
    $table->string('email')->nullable();
    $table->string('site_web')->nullable();
    
    // 🔄 GESTION & MÉTADONNÉES
    $table->boolean('active')->default(true);  // Statut actif/inactif
    $table->text('notes')->nullable();         // Notes libres
    $table->timestamps();                      // created_at, updated_at
});
```

### 🎯 Caractéristiques Clés

#### **1. Flexibilité Obligatoire/Optionnel**
```php
// SEUL CHAMP OBLIGATOIRE
'nom' => 'required|string|max:255'

// TOUT LE RESTE EST OPTIONNEL
'nom_commercial' => 'nullable|string|max:255'
'siret' => 'nullable|string|unique:entreprises,siret'
```

Cette approche permet :
- ✅ Création rapide avec juste le nom
- ✅ Enrichissement progressif des données
- ✅ Adaptation aux entreprises internationales
- ✅ Saisie partielle puis complétion ultérieure

#### **2. Contrainte d'Unicité SIRET**
```php
$table->string('siret')->nullable()->unique();
```

**Pourquoi cette contrainte ?**
- 🇫🇷 Le SIRET est unique en France par définition
- 🚫 Évite les doublons d'entreprises françaises
- ✅ Permet les entreprises sans SIRET (internationales)
- 🔄 Validation automatique côté base de données

#### **3. Défaut "France" pour le Pays**
```php
$table->string('pays')->nullable()->default('France');
```

**Logique métier :**
- 🎯 Dashboard principalement pour clients français
- ⚡ Évite la ressaisie constante de "France"
- 🌍 Reste ouvert à l'international si besoin

## 🔗 Relations avec Autres Tables

### **📊 Relation Clients (One-to-Many)**

Dans la migration clients :
```php
$table->foreignId('entreprise_id')
    ->nullable()
    ->constrained('entreprises')
    ->onDelete('set null');
```

**Stratégie CASCADE :**
- ✅ `onDelete('set null')` : Préserve les clients si l'entreprise est supprimée
- 🔒 Évite la perte de données critiques
- 🔄 Permet la réassignation ultérieure

### **📈 Impact sur les Performances**

```php
// Index automatique sur entreprise_id dans clients
// Index unique automatique sur siret
// Optimisation des requêtes avec relations
```

## 🌱 Système de Seeders

### 📁 Fichier : `EntrepriseSeeder.php`

Le seeder génère des données réalistes pour le développement et les tests :

#### **1. Entreprises Prédéfinies (5)**
```php
$typesEntreprises = [
    ['nom' => 'Tech Solutions SARL', 'secteur' => 'IT'],
    ['nom' => 'Digital Innovation SAS', 'secteur' => 'Numérique'],
    ['nom' => 'Consulting Group', 'secteur' => 'Conseil'],
    ['nom' => 'Marketing Agency', 'secteur' => 'Marketing'],
    ['nom' => 'Web Development', 'secteur' => 'Développement'],
];
```

#### **2. Génération Automatique (15)**
```php
for ($i = 0; $i < 15; $i++) {
    $secteurs = [
        'Informatique', 'Marketing', 'Conseil', 'E-commerce', 'Design',
        'Formation', 'Événementiel', 'Communication', 'Finance', 'Logistique'
    ];
    
    $secteur = $faker->randomElement($secteurs);
    $nomBase = $faker->company;
    $suffixe = $faker->randomElement(['SARL', 'SAS', 'SA', 'EURL']);
}
```

#### **3. Données Réalistes avec Faker FR**
```php
$faker = Faker::create('fr_FR'); // Locale française

// Génération réaliste
'siret' => $faker->siret(false),           // SIRET valide français
'siren' => substr($faker->siret(false), 0, 9), // SIREN dérivé
'telephone' => $faker->phoneNumber,        // Format français
'email' => $faker->unique()->companyEmail, // Email d'entreprise
'adresse' => $faker->streetAddress,        // Adresse française
'ville' => $faker->city,                   // Ville française
'code_postal' => $faker->postcode,         // Code postal français
```

#### **4. Variabilité Contrôlée**
```php
// 95% d'entreprises actives (réaliste)
'active' => $faker->boolean(95),

// 70% ont un nom commercial différent
'nom_commercial' => $faker->optional(0.7)->passthrough($nomBase),

// 80% ont un site web
'site_web' => $faker->optional(0.8)->url,

// 20% ont des notes
'notes' => $faker->optional(0.2)->sentence(),
```

## 📊 Schéma de Données Métier

### **🔍 Types de Secteurs d'Activité**

Le système utilise des secteurs libres (pas d'enum) pour la flexibilité :

```php
// Secteurs principaux générés
'Informatique', 'Marketing', 'Conseil', 'E-commerce', 'Design',
'Formation', 'Événementiel', 'Communication', 'Finance', 'Logistique'

// Secteurs spécialisés créés manuellement
'IT', 'Numérique', 'Développement'
```

**Avantages de l'approche libre :**
- ✅ Pas de limitation par enum
- ✅ Évolution naturelle des secteurs
- ✅ Saisie libre pour nouveaux secteurs
- ✅ Filtrage possible côté frontend

### **📋 Format des Données d'Identification**

#### **Format SIRET/SIREN**
```php
// SIRET : 14 chiffres (9 SIREN + 5 établissement)
'siret' => '12345678901234'

// SIREN : 9 premiers chiffres du SIRET
'siren' => '123456789'
```

#### **Format Noms d'Entreprise**
```php
// Nom (raison sociale) : Obligatoire, souvent avec forme juridique
'nom' => 'Digital Innovation SAS'

// Nom commercial : Optionnel, plus court et marketing
'nom_commercial' => 'Digital Innovation'
```

## 🔄 Évolution et Maintenance

### **📈 Scalabilité Prévue**

La structure est conçue pour évoluer :

```sql
-- Ajouts possibles futurs :
ALTER TABLE entreprises ADD COLUMN code_naf VARCHAR(10);
ALTER TABLE entreprises ADD COLUMN effectif_range VARCHAR(50);
ALTER TABLE entreprises ADD COLUMN chiffre_affaires DECIMAL(15,2);
ALTER TABLE entreprises ADD COLUMN date_creation DATE;
```

### **🔧 Optimisations Possibles**

```sql
-- Index composites pour recherches fréquentes
CREATE INDEX idx_entreprises_secteur_active ON entreprises(secteur_activite, active);
CREATE INDEX idx_entreprises_ville_active ON entreprises(ville, active);

-- Index de recherche textuelle
CREATE INDEX idx_entreprises_nom_search ON entreprises USING gin(to_tsvector('french', nom));
```

### **📋 Commandes de Maintenance**

```bash
# Import des données Firebase
php artisan firebase:import

# Reset et reseed complet
php artisan migrate:fresh --seed

# Seeder spécifique entreprises
php artisan db:seed --class=EntrepriseSeeder

# Vérification intégrité
php artisan check:integrity
```

## 🎯 Bonnes Pratiques Implémentées

### **1. Validation Métier**
- ✅ SIRET unique seulement si fourni
- ✅ Email validé au format email
- ✅ URL validée pour site_web
- ✅ Champs optionnels pour flexibilité

### **2. Internationalisation**
- ✅ Pays par défaut configurable
- ✅ Support d'entreprises sans SIRET
- ✅ Champs adresse adaptables

### **3. Performance**
- ✅ Index automatiques sur clés étrangères
- ✅ Contrainte unique sur SIRET
- ✅ Type de données optimisés

### **4. Extensibilité**
- ✅ Structure extensible sans breaking changes
- ✅ Champ notes pour données ad-hoc
- ✅ Système de timestamps standard Laravel

---

## 📚 Références

- **Migration** : `database/migrations/2025_06_10_214614_create_entreprises_table.php`
- **Seeder** : `database/seeders/EntrepriseSeeder.php`
- **Modèle** : `app/Models/Entreprise.php` (voir Module 2)
- **Faker FR** : Documentation FakerPHP pour locale française

---

*Module 3 terminé - Structure de base de données et aspects métier documentés* 