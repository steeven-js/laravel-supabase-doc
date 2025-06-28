# Planning Rédaction - Module Devis

## 📊 Analyse Architecturale - Module Devis

> **Statut** : Module le plus complexe du système
> **Complexité** : ⭐⭐⭐⭐⭐ (5/5 - Très Élevée)
> **Priorité** : Critique (centre du métier)

### Vue d'Ensemble
Le module Devis est le **cœur métier** du Dashboard Madinia. Il gère l'ensemble du cycle de vie commercial : création, envoi, acceptation, refus, et transformation en factures. C'est le module le plus sophistiqué avec une machine à états complexe et des fonctionnalités avancées.

---

## 🏗️ Architecture Backend (PHP/Laravel)

### Modèles de Données

#### 1. Modèle Principal : `Devis.php` (484 lignes)
- **20 champs fillable** avec castings avancés
- **Auto-génération** numéros : `DV-25-{ID}` via hooks `boot()`
- **6 statuts métier** : brouillon, en_attente, envoyé, accepté, refusé, expiré
- **Relations** : Client, User (admin), Facture, LigneDevis
- **Méthodes métier** : `accepter()`, `refuser()`, `transformerEnFacture()`, `calculerMontants()`
- **Scopes** : actifs, par statut, expirés, par client
- **Traits** : `SendsNotifications`, `HasHistorique`

#### 2. Modèle Lignes : `LigneDevis.php` (76 lignes)
- **Calculs automatiques** : montant_ht, montant_tva, montant_ttc
- **Relations** : Devis, Service
- **Ordre** : gestion position des lignes

### Contrôleur Principal : `DevisController.php` (1808 lignes)

#### Méthodes CRUD Étendues
- `index()` - Liste avec filtres et relations
- `create()` - Formulaire avec clients, services, madinia
- `store()` - Création avec lignes et PDF automatique
- `storeBrouillon()` - Sauvegarde brouillon
- `show()` - Détail complet avec actions
- `edit()` - Édition avec données existantes
- `update()` - Mise à jour avec recalculs
- `destroy()` - Suppression avec vérifications

#### Méthodes Statuts
- `accepter()` - Acceptation avec notifications
- `refuser()` - Refus avec raisons
- `changerStatut()` - Changement état général

#### Méthodes Emails
- `afficherEnvoiEmail()` - Interface envoi
- `envoyerEmail()` - Envoi client + admin
- `envoyerEmailClient()` / `envoyerEmailAdmin()` - Méthodes privées

#### Méthodes PDF
- `voirPdf()` / `telechargerPdf()` - Consultation
- `generateReactPdf()` - Génération React
- `saveReactPdf()` - Sauvegarde côté client
- Méthodes privées : sauvegarde locale + Supabase

#### Transformation
- `transformerEnFacture()` - Interface transformation
- `confirmerTransformationFacture()` - Processus complet avec logs

### Service PDF : `DevisPdfService.php` (329 lignes)
- **Gestion fichiers** : local + Supabase Storage
- **URLs publiques** : génération automatique
- **Synchronisation** : entre stockages
- **Nettoyage** : suppression coordonnée

### Routes Spécialisées (18 routes)
```php
// CRUD standard
Route::resource('devis', DevisController::class)

// Actions métier
Route::post('devis/store-brouillon')
Route::patch('devis/{devis}/accepter')
Route::patch('devis/{devis}/refuser')
Route::patch('devis/{devis}/changer-statut')

// Emails
Route::get('devis/{devis}/envoyer-email')
Route::post('devis/{devis}/envoyer-email')

// Transformation
Route::get('devis/{devis}/transformer-facture')
Route::post('devis/{devis}/confirmer-transformation')

// PDF avancé
Route::get('devis/{devis}/pdf')
Route::get('devis/{devis}/telecharger-pdf')
Route::post('devis/{devis}/save-react-pdf')
Route::get('devis/{devis}/generate-react-pdf')
Route::post('devis/{devis}/ensure-pdf')
Route::get('devis/{devis}/pdf-status')
```

---

## 🎨 Architecture Frontend (React/TypeScript)

### Pages Principales (6156+ lignes total)

#### 1. `index.tsx` (867 lignes)
- **Liste avancée** avec filtres par statut
- **Recherche** et tri multiples
- **Actions rapides** : voir, éditer, PDF, email
- **Badges colorés** par statut
- **Informations client** avec entreprise

#### 2. `create.tsx` (1035 lignes)
- **Formulaire complexe** multi-sections
- **Sélection client** avec auto-complétion
- **Catalogue services** avec quantités/prix
- **Calculs temps réel** montants HT/TTC
- **Gestion unités** (heure, jour, forfait...)
- **Conditions** et notes personnalisées

#### 3. `edit.tsx` (1085 lignes)
- **Édition complète** avec historique
- **Gestion lignes** : ajout, suppression, réorganisation
- **PDF temps réel** avec `DevisPdfPreview`
- **Actions contextuelles** : statuts, envoi, transformation
- **Sauvegarde PDF** automatique côté client

#### 4. `show.tsx` (965 lignes)
- **Vue détaillée** avec toutes les informations
- **Historique complet** des actions
- **Boutons d'action** contextuels selon statut
- **Prévisualisation PDF** intégrée
- **Informations client** et administrateur

#### 5. `envoyer-email.tsx` (1134 lignes)
- **Interface envoi** sophistiquée
- **Templates email** personnalisables
- **Gestion pièces jointes** PDF
- **Prévisualisation** email avant envoi
- **Logs envoi** en temps réel

#### 6. `transformer-facture.tsx` (893 lignes)
- **Assistant transformation** étape par étape
- **Paramètres transformation** : dates, conditions
- **Prévisualisation facture** avant création
- **Copie lignes** automatique
- **Logs transformation** détaillés

#### 7. `generate-pdf.tsx` (177 lignes)
- **Générateur PDF** autonome
- **Interface simple** pour tests
- **Intégration** `DevisPdfPreview`

### Composant PDF : `DevisPdfPreview.tsx` (775 lignes)
- **Template React PDF** ultra-optimisé
- **Design professionnel** avec logo Madinia
- **Gestion unités** dynamique (heure/jour/forfait)
- **Calculs automatiques** HT/TTC
- **Formatage** devises et dates
- **Responsive** pour différentes tailles

---

## 📋 Planning de Rédaction Détaillé

### Phase 1 : Architecture Générale (4-5 jours)
**Durée estimée** : 4-5 jours
**Complexité** : Élevée

#### Module 1.1 : Vue d'Ensemble du Système Devis (1 jour)
- Cycle de vie complet d'un devis
- Machine à états et transitions
- Intégrations avec autres modules
- Diagrammes de flux métier

#### Module 1.2 : Modèle de Données (1,5 jour)
- Structure table `devis` (20 champs)
- Relations avec `clients`, `users`, `factures`
- Modèle `LigneDevis` et calculs
- Contraintes et validations

#### Module 1.3 : Gestion des Statuts (1,5 jour)
- 6 statuts métier détaillés
- Transitions autorisées/interdites
- Méthodes métier : accepter/refuser
- Notifications automatiques

#### Module 1.4 : Auto-génération Numéros (0,5-1 jour)
- Format `DV-25-{ID}`
- Hooks Laravel `boot()`
- Gestion des numéros temporaires
- Migration des anciens formats

### Phase 2 : Backend Avancé (6-8 jours)
**Durée estimée** : 6-8 jours
**Complexité** : Très Élevée

#### Module 2.1 : DevisController - CRUD (2 jours)
- Méthodes standard étendues
- Validation complexe des données
- Gestion des lignes de devis
- Calculs automatiques montants

#### Module 2.2 : Gestion des Statuts Backend (1,5 jour)
- Méthodes `accepter()`, `refuser()`, `changerStatut()`
- Vérifications métier et sécurité
- Historique automatique des changements
- Notifications admin/client

#### Module 2.3 : Système d'Emails (2 jours)
- Templates dynamiques (devis, acceptation, refus)
- Envoi client + admin simultané
- Gestion pièces jointes PDF
- Logs et traçabilité EmailLogService

#### Module 2.4 : DevisPdfService (1,5-2 jours)
- Génération PDF React côté serveur
- Stockage dual : local + Supabase
- URLs publiques et sécurisées
- Synchronisation et nettoyage

### Phase 3 : Frontend Complexe (7-9 jours)
**Durée estimée** : 7-9 jours
**Complexité** : Très Élevée

#### Module 3.1 : Pages Liste et Détail (2 jours)
- `index.tsx` : filtres et recherche avancée
- `show.tsx` : vue complète avec actions
- Gestion états et loading
- Intégration notifications

#### Module 3.2 : Formulaires Création/Édition (2,5 jours)
- `create.tsx` et `edit.tsx` complexes
- Gestion catalogue services
- Calculs temps réel HT/TTC
- Validation côté client

#### Module 3.3 : Interface PDF React (2 jours)
- `DevisPdfPreview.tsx` détaillé
- Optimisation pour une page
- Gestion unités dynamiques
- Formatage professionnel

#### Module 3.4 : Fonctionnalités Avancées (1,5-2 jours)
- `envoyer-email.tsx` : interface envoi
- `transformer-facture.tsx` : assistant
- Logs en temps réel
- États de chargement

### Phase 4 : Intégrations et Workflows (3-4 jours)
**Durée estimée** : 3-4 jours
**Complexité** : Élevée

#### Module 4.1 : Transformation en Factures (1,5 jour)
- Processus `confirmerTransformationFacture()`
- Copie des lignes de devis
- Paramètres transformation
- TransformationLogService

#### Module 4.2 : Système de Notifications (1 jour)
- Notifications automatiques (SendsNotifications)
- Types : création, acceptation, refus, envoi
- Destinataires : admins, super_admins
- Intégration frontend

#### Module 4.3 : Historique et Traçabilité (1-1,5 jour)
- HasHistorique trait usage
- Logs spécialisés : EmailLogService, TransformationLogService
- Audit trail complet
- Interface consultation

### Phase 5 : Tests et Optimisation (2-3 jours)
**Durée estimée** : 2-3 jours
**Complexité** : Moyenne

#### Module 5.1 : Tests Backend (1 jour)
- Tests unitaires modèles
- Tests intégration contrôleur
- Tests services PDF/Email
- Mocks et factories

#### Module 5.2 : Tests Frontend (1 jour)
- Tests composants React
- Tests intégration PDF
- Tests workflows complets
- Tests e2e

#### Module 5.3 : Performance et Optimisation (0,5-1 jour)
- Optimisation requêtes DB
- Gestion cache PDF
- Lazy loading composants
- Monitoring performances

---

## 📊 Estimations Globales

### Répartition par Complexité
- **Architecture Générale** : 4-5 jours (Élevée)
- **Backend Avancé** : 6-8 jours (Très Élevée) 
- **Frontend Complexe** : 7-9 jours (Très Élevée)
- **Intégrations** : 3-4 jours (Élevée)
- **Tests/Optimisation** : 2-3 jours (Moyenne)

### Total Estimé : 22-29 jours

### Facteurs de Complexité Majeurs
1. **Machine à états** à 6 statuts avec transitions complexes
2. **Génération PDF React** avec optimisations avancées
3. **Système d'emails** dual (client + admin) avec templates
4. **Transformation factures** avec logs détaillés
5. **Interface utilisateur** riche avec calculs temps réel
6. **Intégrations multiples** : clients, services, factures, notifications

### Recommandations
- **Prioriser** les modules 1-2 (architecture/backend) avant le frontend
- **Documenter** en parallèle du développement pour les futures évolutions
- **Créer** des diagrammes UML pour la machine à états
- **Établir** des conventions pour les futures fonctionnalités
- **Prévoir** une documentation utilisateur séparée pour les workflows

---

## 🎯 Modules Prioritaires

### Priorité 1 (Critique)
- Module 1.3 : Gestion des Statuts
- Module 2.2 : Statuts Backend  
- Module 2.3 : Système d'Emails
- Module 4.1 : Transformation Factures

### Priorité 2 (Important)
- Module 1.2 : Modèle de Données
- Module 2.1 : DevisController CRUD
- Module 3.3 : Interface PDF React

### Priorité 3 (Utile)
- Module 3.1-3.2 : Pages Frontend
- Module 4.2-4.3 : Notifications/Historique
- Module 5 : Tests et Optimisation

> **Note** : Le module Devis étant le centre névralgique du système, sa documentation complète est **essentielle** pour la maintenance et les évolutions futures. 