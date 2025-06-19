# 🗄️ Module 3 : Base de Données & Migrations

## 📋 Objectif du Module

Ce module documente la structure de base de données complète pour le système clients, incluant toutes les migrations, contraintes, index et l'évolution du schéma au fil du temps.

---

## 📊 Vue d'Ensemble des Tables Clients

### **Tables Principales**

| **Table** | **Migration** | **Date** | **Rôle** | **Relations** |
|-----------|---------------|----------|----------|---------------|
| `clients` | `create_clients_table.php` | 2025-06-10 | Table principale | 7 relations sortantes |
| `client_emails` | `create_client_emails_table.php` | 2025-06-12 | Tracking emails | Relation vers clients/users |

### **Tables Liées**

| **Table** | **Relation** | **Type** | **Cascade** | **Usage** |
|-----------|--------------|----------|-------------|-----------|
| `entreprises` | `clients.entreprise_id` | N:1 | `set null` | Entreprise parente |
| `devis` | `devis.client_id` | 1:N | `cascade` | Propositions commerciales |
| `factures` | `factures.client_id` | 1:N | `cascade` | Facturation |
| `opportunities` | `opportunities.client_id` | 1:N | `cascade` | Pipeline CRM |
| `tickets` | `tickets.client_id` | 1:N | `cascade` | Support |
| `todos` | `todos.client_id` | 1:N | `cascade` | Tâches |

---

## 🏗️ Migration Principale : `create_clients_table.php`

### **Code Complet de la Migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('nom'); // Obligatoire
            $table->string('prenom')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('telephone')->nullable();
            $table->text('adresse')->nullable();
            $table->string('ville')->nullable();
            $table->string('code_postal')->nullable();
            $table->string('pays')->nullable()->default('France');
            $table->boolean('actif')->default(true);
            $table->text('notes')->nullable();
            $table->foreignId('entreprise_id')->nullable()->constrained('entreprises')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
```

### **Analyse des Champs**

#### **Champs Obligatoires**
- `id` : Clé primaire auto-incrémentée
- `nom` : Nom de famille obligatoire
- `created_at`, `updated_at` : Timestamps automatiques

#### **Champs avec Défaut**
- `pays` : Défaut 'France'
- `actif` : Défaut `true`

#### **Champs Optionnels**
- `prenom`, `email`, `telephone`, `adresse`, `ville`, `code_postal`, `notes`
- `entreprise_id` : Relation optionnelle vers entreprises

#### **Contraintes**
- `email` : Unique si renseigné
- `entreprise_id` : Clé étrangère avec ON DELETE SET NULL

---

## 📧 Migration Emails : `create_client_emails_table.php`

### **Code Complet**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('client_emails', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('objet');
            $table->text('contenu');
            $table->enum('statut', ['envoye', 'echec'])->default('envoye');
            $table->timestamp('date_envoi');
            $table->timestamps();

            $table->index(['client_id', 'user_id']);
            $table->index('date_envoi');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_emails');
    }
};
```

### **Caractéristiques**

#### **Relations**
- `client_id` : Relation obligatoire vers clients (CASCADE)
- `user_id` : Relation obligatoire vers users (CASCADE)

#### **Champs Métier**
- `objet` : Sujet de l'email
- `contenu` : Corps du message
- `statut` : enum ['envoye', 'echec']
- `date_envoi` : Timestamp d'envoi

#### **Index**
- Index composite sur `[client_id, user_id]`
- Index sur `date_envoi` pour tri chronologique

---

## 🔄 Évolution du Schéma

### **1. Ajout CC (2025-06-18)**

```php
// Migration: add_cc_to_client_emails_table.php
public function up(): void
{
    Schema::table('client_emails', function (Blueprint $table) {
        $table->text('cc')->nullable()->after('contenu');
    });
}
```

**Ajout :**
- Champ `cc` de type `text`
- Nullable pour emails multiples optionnels
- Positionné après `contenu`

### **2. Ajout Pièces Jointes (2025-06-18)**

```php
// Migration: add_attachments_to_client_emails_table.php
public function up(): void
{
    Schema::table('client_emails', function (Blueprint $table) {
        $table->json('attachments')->nullable()->after('cc')->comment('Informations des pièces jointes en JSON');
    });
}
```

**Ajout :**
- Champ `attachments` de type `json`
- Stockage métadonnées fichiers
- Commentaire explicatif

#### **Structure JSON Attachments**

```json
[
    {
        "original_name": "document.pdf",
        "stored_name": "attachments/uuid-filename.pdf",
        "mime_type": "application/pdf",
        "size": 2048576,
        "path": "/storage/attachments/uuid-filename.pdf"
    }
]
```

---

## 🔗 Relations avec Autres Tables

### **Tables avec client_id**

| **Table** | **Relation** | **Cascade** | **Usage** |
|-----------|--------------|-------------|-----------|
| `devis` | `client_id` FK | CASCADE | Propositions commerciales |
| `factures` | `client_id` FK | CASCADE | Facturation |
| `opportunities` | `client_id` FK | CASCADE | Pipeline CRM |
| `tickets` | `client_id` FK | CASCADE | Support client |
| `todos` | `client_id` FK | CASCADE | Tâches et rappels |
| `client_emails` | `client_id` FK | CASCADE | Communications |

### **Règles de Suppression**

#### **Suppression Client**
Supprime automatiquement :
- Tous ses emails
- Tous ses devis
- Toutes ses factures
- Toutes ses opportunités
- Tous ses tickets
- Tous ses todos

#### **Suppression Entreprise**
- Met `entreprise_id` à NULL
- Préserve les clients

---

## 🗂️ Index et Performance

### **Index Existants**

#### **Table clients**
- PRIMARY KEY sur `id`
- UNIQUE sur `email`
- INDEX sur `entreprise_id` (automatique FK)

#### **Table client_emails**
- PRIMARY KEY sur `id`
- INDEX composite sur `[client_id, user_id]`
- INDEX sur `date_envoi`
- INDEX sur `client_id` (automatique FK)
- INDEX sur `user_id` (automatique FK)

### **Optimisations Suggérées**

```sql
-- Recherche par nom/prénom
ALTER TABLE clients ADD INDEX idx_nom_prenom (nom, prenom);

-- Filtrage par statut actif
ALTER TABLE clients ADD INDEX idx_actif_created (actif, created_at);

-- Recherche géographique
ALTER TABLE clients ADD INDEX idx_ville (ville);

-- Statut emails
ALTER TABLE client_emails ADD INDEX idx_statut (statut);
```

---

## 🛠️ Commandes Utiles

### **Migration**

```bash
# Exécuter migrations
php artisan migrate

# Statut migrations
php artisan migrate:status

# Rollback
php artisan migrate:rollback

# Reset complet
php artisan migrate:fresh --seed
```

### **Création Migrations Clients**

```bash
# Nouvelle migration table clients
php artisan make:migration add_column_to_clients_table --table=clients

# Nouvelle migration emails
php artisan make:migration modify_client_emails_table --table=client_emails
```

---

## 🎯 Bonnes Pratiques

### **✅ Points Forts**

1. **Relations cohérentes** : CASCADE approprié selon contexte
2. **Évolution progressive** : Migrations séparées
3. **Index optimaux** : Performance requêtes fréquentes
4. **Flexibilité** : Champs nullable pour données optionnelles
5. **Intégrité** : Contraintes FK et unicité
6. **Documentation** : Commentaires en base

### **🔄 Améliorations Possibles**

1. **Soft Deletes** : Suppression logique avec `deleted_at`
2. **Index géographiques** : Optimisation recherches ville/région
3. **Validation JSON** : Contraintes structure attachments
4. **Archivage** : Table séparée anciens emails
5. **Partitioning** : Par date si gros volume

---

*Documentation générée le 19 janvier 2025 - Dashboard Madinia v2.0* 