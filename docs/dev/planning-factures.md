# Planning Rédaction - Module Factures

## 📊 Analyse Architecturale - Module Factures

> **Statut** : Module de gestion financière critique
> **Complexité** : ⭐⭐⭐⭐ (4/5 - Élevée)
> **Priorité** : Critique (finalisation commerciale)

### Vue d'Ensemble
Le module Factures complète le cycle commercial initié par les devis. Il gère la facturation finale, le suivi des paiements, et l'envoi des documents fiscaux aux clients. Bien que similaire aux devis, il possède des spécificités métier importantes (paiements, échéances, statuts fiscaux).

---

## 🏗️ Architecture Backend (PHP/Laravel)

### Modèles de Données

#### 1. Modèle Principal : `Facture.php` (428 lignes)
- **24 champs fillable** avec castings avancés (4 de plus que les devis)
- **Auto-génération** numéros : `FACT-2025-{numero}` via méthode statique
- **5 statuts métier** : brouillon, en_attente, envoyee, payee, en_retard
- **Relations** : Client, User (admin), Devis (origine), LigneFacture
- **Méthodes métier** : `marquerPayee()`, `marquerEnvoyee()`, `calculerMontants()`
- **Méthode spéciale** : `creerDepuisDevis()` pour transformation automatique
- **Scopes** : actives, par statut, en retard, par client
- **Traits** : `SendsNotifications`, `HasHistorique`

#### 2. Modèle Lignes : `LigneFacture.php` (76 lignes)
- **Identique** au système devis : calculs automatiques
- **Relations** : Facture, Service
- **Ordre** : gestion position des lignes

#### 3. Spécificités Factures vs Devis
- **Champs paiement** : `date_paiement`, `mode_paiement`, `reference_paiement`
- **Gestion échéances** : `date_echeance`, calcul retards automatique
- **URL PDF** : `pdf_url` pour intégration Supabase
- **Pas de transformation** : les factures sont finales

### Contrôleur Principal : `FactureController.php` (1270 lignes)

#### Méthodes CRUD Étendues
- `index()` - Liste avec filtres par statut/retard
- `create()` - Formulaire avec clients, services, madinia
- `store()` - Création avec lignes et calculs
- `show()` - Détail complet avec historique paiements
- `edit()` - Édition avec données existantes
- `update()` - Mise à jour avec recalculs
- `destroy()` - Suppression avec vérifications

#### Méthodes Spécifiques Factures
- `changerStatut()` - Changement état avec historique
- `marquerPayee()` - Marquage paiement avec références
- `envoyerEmailForm()` / `envoyerEmail()` - Envoi emails fiscaux

#### Méthodes PDF Avancées
- `voirPdf()` / `telechargerPdf()` - Consultation
- `saveReactPdf()` - Sauvegarde React côté client
- `syncSupabase()` - Synchronisation stockage cloud
- **Intégration pdf_url** : stockage URL Supabase en base

#### Spécificités vs Devis
- **Pas de brouillon** : création directe
- **Pas de transformation** : document final
- **Focus paiements** : suivi échéances et retards
- **PDF obligatoire** : document fiscal

### Service PDF : `FacturePdfService.php` (331 lignes)
- **Architecture identique** au `DevisPdfService`
- **Stockage dual** : local + Supabase Storage
- **URLs publiques** : génération automatique
- **Synchronisation** : méthode `synchroniserVersSupabase()`
- **Nommage** : `facture_{numero_facture}.pdf`

### Routes Spécialisées (16 routes)
```php
// CRUD standard
Route::resource('factures', FactureController::class)

// Actions métier spécifiques
Route::patch('factures/{facture}/changer-statut')
Route::patch('factures/{facture}/marquer-payee')

// Emails fiscaux
Route::get('factures/{facture}/envoyer-email')
Route::post('factures/{facture}/envoyer-email')
Route::patch('factures/{facture}/envoyer')

// PDF fiscal
Route::get('factures/{facture}/pdf')
Route::get('factures/{facture}/telecharger-pdf')
Route::post('factures/{facture}/regenerer-pdf')
Route::post('factures/{facture}/save-react-pdf')

// Synchronisation cloud
Route::get('factures/{facture}/sync-supabase')
```

---

## 🎨 Architecture Frontend (React/TypeScript)

### Pages Principales (3780+ lignes total)

#### 1. `index.tsx` (893 lignes)
- **Liste avancée** avec filtres par statut et retard
- **Indicateurs visuels** : retards, paiements en cours
- **Actions rapides** : marquer payée, PDF, email
- **Badges colorés** par statut fiscal
- **Informations client** et montants TTC

#### 2. `create.tsx` (756 lignes)
- **Formulaire complet** avec sections client/services
- **Calculs temps réel** HT/TTC avec TVA
- **Gestion échéances** : dates automatiques
- **Conditions paiement** personnalisables
- **Génération PDF** immédiate après création

#### 3. `edit.tsx` (508 lignes)
- **Édition limitée** (factures = documents fiscaux)
- **Gestion lignes** : modification contrôlée
- **Mise à jour PDF** automatique
- **Validation** : contraintes fiscales

#### 4. `show.tsx` (993 lignes)
- **Vue détaillée** avec informations paiement
- **Historique complet** des actions/paiements
- **Actions contextuelles** : paiement, envoi, PDF
- **Prévisualisation PDF** intégrée
- **Liens devis** d'origine si applicable

#### 5. `envoyer-email.tsx` (630 lignes)
- **Interface envoi** emails fiscaux
- **Templates spécialisés** pour factures
- **Gestion pièces jointes** PDF obligatoires
- **Logs envoi** avec traçabilité
- **Validation** : documents fiscaux

### Composant PDF : `FacturePdfPreview.tsx` (680 lignes)
- **Template React PDF** professionnel
- **Design fiscal** avec mentions légales
- **Formatage** : numéros facture, échéances
- **Calculs précis** : HT/TVA/TTC
- **Informations paiement** : conditions, références
- **Lien devis** d'origine si transformation

---

## 📋 Planning de Rédaction Détaillé

### Phase 1 : Architecture Spécialisée (3-4 jours)
**Durée estimée** : 3-4 jours
**Complexité** : Élevée

#### Module 1.1 : Spécificités Factures vs Devis (1 jour)
- Différences architecturales majeures
- Workflow fiscal et contraintes légales
- Intégrations avec système de devis
- Cycle de vie complet d'une facture

#### Module 1.2 : Modèle de Données Factures (1 jour)
- Structure table `factures` (24 champs vs 20 devis)
- Champs spécifiques : paiement, échéances, pdf_url
- Relations : Client, Devis (origine), LigneFacture
- Méthode `creerDepuisDevis()` détaillée

#### Module 1.3 : Gestion Paiements et Échéances (1-1,5 jour)
- 5 statuts métier et transitions
- Calcul automatique des retards
- Méthodes `marquerPayee()`, `marquerEnvoyee()`
- Suivi des références de paiement

#### Module 1.4 : Auto-génération Numéros Fiscaux (0,5 jour)
- Format `FACT-2025-{numero}` séquentiel
- Génération via `genererNumeroFacture()`
- Contraintes fiscales et unicité
- Migration formats existants

### Phase 2 : Backend Financier (4-5 jours)
**Durée estimée** : 4-5 jours
**Complexité** : Élevée

#### Module 2.1 : FactureController - CRUD Fiscal (1,5 jour)
- Méthodes création avec contraintes fiscales
- Validation données financières
- Gestion lignes avec calculs TVA
- Limitation édition (document fiscal)

#### Module 2.2 : Gestion Paiements Backend (1,5 jour)
- Méthode `marquerPayee()` avec références
- Suivi échéances et calculs retards
- Historique paiements complet
- Notifications automatiques

#### Module 2.3 : Système Emails Fiscaux (1,5 jour)
- Templates spécialisés factures
- Pièces jointes PDF obligatoires
- Envoi dual client + admin
- Logs et conformité fiscale

#### Module 2.4 : FacturePdfService Avancé (0,5-1 jour)
- Stockage dual avec pdf_url en base
- Synchronisation Supabase automatique
- URLs publiques sécurisées
- Gestion documents fiscaux

### Phase 3 : Frontend Financier (5-6 jours)
**Durée estimée** : 5-6 jours
**Complexité** : Élevée

#### Module 3.1 : Pages Liste et Détail (1,5 jour)
- `index.tsx` avec filtres retards/paiements
- `show.tsx` avec informations fiscales
- Indicateurs visuels statuts
- Actions paiement contextuelles

#### Module 3.2 : Formulaires Financiers (2 jours)
- `create.tsx` avec calculs fiscaux
- `edit.tsx` avec contraintes légales
- Gestion échéances automatiques
- Validation côté client stricte

#### Module 3.3 : Interface PDF Fiscale (1,5 jour)
- `FacturePdfPreview.tsx` avec mentions légales
- Formatage numéros fiscaux
- Calculs précis TVA
- Informations paiement complètes

#### Module 3.4 : Envoi Emails Fiscaux (1 jour)
- `envoyer-email.tsx` spécialisé
- Templates factures obligatoires
- Validation documents fiscaux
- Traçabilité envois

### Phase 4 : Intégrations Financières (2-3 jours)
**Durée estimée** : 2-3 jours
**Complexité** : Élevée

#### Module 4.1 : Transformation Devis→Factures (1 jour)
- Méthode `creerDepuisDevis()` complète
- Copie lignes et calculs
- Historique transformation
- Liens bidirectionnels

#### Module 4.2 : Notifications Financières (0,5 jour)
- Types : création, paiement, retard, envoi
- Destinataires spécialisés
- Intégration SendsNotifications
- Alertes échéances

#### Module 4.3 : Historique et Traçabilité Fiscale (1-1,5 jour)
- HasHistorique pour conformité
- Audit trail paiements
- Logs spécialisés EmailLogService
- Consultation historique complète

### Phase 5 : Conformité et Tests (2 jours)
**Durée estimée** : 2 jours
**Complexité** : Moyenne

#### Module 5.1 : Tests Backend Financiers (1 jour)
- Tests calculs fiscaux
- Tests transformations devis
- Tests paiements et échéances
- Mocks services PDF

#### Module 5.2 : Tests Frontend et Optimisation (1 jour)
- Tests interfaces financières
- Tests PDF fiscaux
- Validation workflows
- Performance calculs

---

## 📊 Estimations Globales

### Répartition par Complexité
- **Architecture Spécialisée** : 3-4 jours (Élevée)
- **Backend Financier** : 4-5 jours (Élevée)
- **Frontend Financier** : 5-6 jours (Élevée)
- **Intégrations** : 2-3 jours (Élevée)
- **Conformité/Tests** : 2 jours (Moyenne)

### Total Estimé : 16-20 jours

### Facteurs de Complexité Spécifiques
1. **Contraintes fiscales** : documents légaux non modifiables
2. **Gestion paiements** : suivi échéances et retards automatiques
3. **Transformation devis** : logique métier complexe
4. **PDF fiscaux** : templates avec mentions légales
5. **Stockage dual** : local + Supabase avec pdf_url
6. **Historique fiscal** : traçabilité obligatoire

### Comparaison avec les Devis
| Aspect | Devis | Factures | Différence |
|--------|-------|----------|------------|
| **Complexité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Factures plus simple |
| **Statuts** | 6 statuts | 5 statuts | -1 statut |
| **Transformation** | Vers factures | Document final | Factures = endpoint |
| **Édition** | Libre | Contrôlée (fiscal) | Contraintes légales |
| **Échéances** | Date validité | Date échéance + retards | Gestion avancée |
| **PDF** | Optionnel | Obligatoire (fiscal) | Contrainte légale |

### Recommandations
- **Documenter** les différences avec les devis en priorité
- **Détailler** les contraintes fiscales et légales
- **Expliquer** les workflows de transformation
- **Créer** des diagrammes pour les statuts et paiements
- **Inclure** des exemples de calculs fiscaux

---

## 🎯 Modules Prioritaires

### Priorité 1 (Critique)
- Module 1.1 : Spécificités vs Devis
- Module 2.2 : Gestion Paiements Backend
- Module 4.1 : Transformation Devis→Factures

### Priorité 2 (Important)
- Module 1.2 : Modèle de Données
- Module 2.1 : FactureController CRUD
- Module 3.3 : Interface PDF Fiscale

### Priorité 3 (Utile)
- Module 3.1-3.2 : Pages Frontend
- Module 4.2-4.3 : Notifications/Historique
- Module 5 : Tests et Conformité

---

## 📈 Liens avec Autres Modules

### Intégrations Critiques
- **Devis** : transformation automatique via `creerDepuisDevis()`
- **Clients** : informations fiscales et facturation
- **Services** : catalogue pour lignes de facture
- **PDF** : génération documents fiscaux obligatoires
- **Emails** : envoi factures avec conformité légale

### Dépendances Techniques
- **DevisPdfService** : architecture similaire pour FacturePdfService
- **SendsNotifications** : notifications paiements et retards
- **HasHistorique** : traçabilité fiscale obligatoire
- **Supabase** : stockage pdf_url pour documents permanents

> **Note** : Le module Factures clôture le cycle commercial. Sa documentation doit mettre l'accent sur les **contraintes fiscales**, la **transformation depuis les devis**, et la **gestion des paiements** qui le distinguent du système de devis. 