# 🏢 Gestion Commerciale - Clients et Entreprises
## Dashboard Madinia - Documentation Administrateurs

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Gestion des Entreprises](#gestion-des-entreprises)
3. [Gestion des Clients](#gestion-des-clients)
4. [Relations Clients-Entreprises](#relations-clients-entreprises)
5. [Système d'Opportunités](#système-dopportunités)
6. [Gestion des Tickets de Support](#gestion-des-tickets-de-support)
7. [Système de Todos par Client](#système-de-todos-par-client)
8. [Communication Client (Emails)](#communication-client-emails)
9. [Historique et Traçabilité](#historique-et-traçabilité)

---

## 🎯 Vue d'ensemble

La gestion commerciale est le **cœur du Dashboard Madinia**. Elle vous permet de centraliser toutes les informations sur vos clients et les entreprises avec lesquelles vous travaillez.

### 🏗️ Architecture commerciale

```
🏢 ENTREPRISES
    ├── 👤 Client 1 (Contact principal)
    ├── 👤 Client 2 (Contact secondaire)
    └── 👤 Client 3 (Autre contact)
        ├── 📄 Devis
        ├── 🧾 Factures  
        ├── 💼 Opportunités
        ├── 🎫 Tickets
        ├── ✅ Todos
        └── 📧 Emails
```

### 📊 Fonctionnalités principales

#### **🏢 Entreprises**
- **Base de données** des sociétés clientes
- **Informations légales** (SIRET, SIREN, secteur)
- **Coordonnées complètes** et contacts
- **Historique** des interactions

#### **👥 Clients**
- **Contacts personnels** liés aux entreprises
- **Clients indépendants** (sans entreprise)
- **Profils complets** avec coordonnées
- **Suivi personnalisé** par client

#### **🔄 Outils de suivi**
- **Opportunités commerciales** en cours
- **Tickets de support** et SAV
- **Todos** et tâches à réaliser
- **Historique** complet des actions

---

## 🏢 Gestion des Entreprises

### 🎯 Accès aux entreprises

1. **Cliquez sur "Entreprises"** dans le menu latéral
2. **Consultez la liste** des entreprises existantes
3. **Utilisez les filtres** et la recherche

### 📊 Interface de liste

```
┌─────────────────────────────────────────────────────────┐
│ 🏢 Entreprises                    [+ Nouvelle entreprise]│
│ Gérez vos entreprises clientes                          │
├─────────────────────────────────────────────────────────┤
│ 🔍 [Recherche...]         [Filtres] [Actions]          │
├─────────────────────────────────────────────────────────┤
│ Entreprise         | Secteur    | Clients | Actions    │
│ ─────────────────────────────────────────────────────── │
│ 🏢 Tech Solutions  | IT         | 3       | 👁️ ✏️ 🗑️  │
│ 🏢 Design Corp     | Marketing  | 1       | 👁️ ✏️ 🗑️  │
│ 🏢 Startup Inc     | Tech       | 2       | 👁️ ✏️ 🗑️  │
└─────────────────────────────────────────────────────────┘
```

### ➕ Créer une nouvelle entreprise

#### **🚀 Démarrer la création**
1. **Cliquez sur "Nouvelle entreprise"** (bouton vert)
2. **Remplissez le formulaire** de création
3. **Enregistrez** les informations

#### **📝 Formulaire de création**

##### **Informations obligatoires**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Nom** | Raison sociale officielle | `TechCorp SARL` |

##### **Informations recommandées**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Nom commercial** | Nom d'usage public | `TechCorp` |
| **Secteur d'activité** | Domaine d'activité | `Développement logiciel` |
| **SIRET** | Numéro d'identification | `12345678901234` |
| **SIREN** | Code entreprise | `123456789` |

##### **Coordonnées**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Adresse** | Adresse complète | `123 Rue de la Tech` |
| **Code postal** | Code postal | `75001` |
| **Ville** | Ville | `Paris` |
| **Pays** | Pays | `France` |
| **Téléphone** | Numéro principal | `01 23 45 67 89` |
| **Email** | Email général | `contact@techcorp.com` |
| **Site web** | URL du site | `https://techcorp.com` |

##### **Informations complémentaires**

| Champ | Description |
|-------|-------------|
| **Notes** | Informations internes, observations, historique |

#### **✅ Validation et enregistrement**
- **Vérifications** : Unicité du SIRET, format email/site web
- **Sauvegarde** : L'entreprise apparaît immédiatement dans la liste
- **Notification** : Confirmation de création

### ✏️ Modifier une entreprise

#### **🎯 Accéder à la modification**
1. **Trouvez l'entreprise** dans la liste
2. **Cliquez sur "Modifier"** (icône crayon)
3. **Modifiez** les informations nécessaires
4. **Enregistrez** les changements

#### **🔄 Champs modifiables**
- ✅ Toutes les informations saisies à la création
- ✅ **Statut actif/inactif** (pour archiver)
- ✅ Mise à jour des coordonnées
- ✅ Modification des notes

### 👁️ Consulter les détails d'une entreprise

#### **📋 Vue détaillée**
La page de détails affiche :

##### **📊 Informations générales**
- Raison sociale et nom commercial
- Coordonnées complètes
- Informations légales (SIRET, secteur)

##### **👥 Clients associés**
- Liste des contacts dans l'entreprise
- Nombre total de clients
- Liens directs vers les profils clients

##### **📈 Statistiques commerciales**
- Nombre de devis créés
- Montant total des affaires
- Devis en cours et acceptés

##### **📝 Historique des actions**
- Toutes les modifications apportées
- Qui a fait quoi et quand
- Traçabilité complète

### 🗑️ Supprimer une entreprise

#### **⚠️ Considérations importantes**
- La suppression est **irréversible**
- Les **clients associés** restent mais perdent le lien entreprise
- Les **devis et factures** sont conservés

#### **🚨 Restrictions**
- ❌ Impossible si des **clients actifs** sont associés
- ⚠️ Avertissement si des **données commerciales** existent

#### **🔄 Alternative recommandée**
Au lieu de supprimer, **désactiver** l'entreprise :
1. **Modifier** l'entreprise
2. **Décocher "Active"**
3. **Ajouter une note** expliquant l'archivage

---

## 👥 Gestion des Clients

### 🎯 Accès aux clients

1. **Cliquez sur "Clients"** dans le menu latéral
2. **Explorez la liste** avec filtres avancés
3. **Recherchez** par nom, email, ville, entreprise

### 📊 Interface de liste avancée

```
┌─────────────────────────────────────────────────────────┐
│ 👥 Clients                          [+ Nouveau client] │
│ Gérez vos clients et leurs informations                │
├─────────────────────────────────────────────────────────┤
│ 🔍 [Recherche...]  📊[Statut] 🏙️[Ville] 📄[10/page]    │
├─────────────────────────────────────────────────────────┤
│ ☑️ Client           | Entreprise    | Ville | Actions  │
│ ─────────────────────────────────────────────────────── │
│ ☑️ 👤 Jean Dupont   | TechCorp      | Paris | 👁️ ✏️ 🗑️ │
│ ☑️ 👤 Marie Martin  | Design Corp   | Lyon  | 👁️ ✏️ 🗑️ │
│ ☑️ 👤 Paul Durand   | (Indépendant) | Nice  | 👁️ ✏️ 🗑️ │
├─────────────────────────────────────────────────────────┤
│                    [< Précédent] 1/3 [Suivant >]       │
└─────────────────────────────────────────────────────────┘
```

### 🔍 Fonctionnalités de recherche et filtres

#### **🔎 Recherche intelligente**
La recherche fonctionne sur :
- **Nom et prénom** du client
- **Adresse email**
- **Numéro de téléphone**
- **Ville de résidence**
- **Nom de l'entreprise** associée

#### **📊 Filtres disponibles**
- **Statut** : Actif, Inactif, Tous
- **Ville** : Filtre par ville (menu déroulant dynamique)
- **Entreprise** : Clients d'une entreprise spécifique

#### **🎛️ Options d'affichage**
- **Pagination** : 10, 25, 50, 100 clients par page
- **Tri** : Par nom, prénom, date de création
- **Sélection multiple** : Cases à cocher pour actions groupées

### ➕ Créer un nouveau client

#### **🚀 Processus de création**
1. **Cliquez sur "Nouveau client"**
2. **Choisissez** s'il est lié à une entreprise
3. **Remplissez** les informations personnelles
4. **Enregistrez** le profil

#### **📝 Formulaire de création**

##### **Informations obligatoires**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Prénom** | Prénom du client | `Jean` |
| **Nom** | Nom de famille | `Dupont` |
| **Email** | Adresse email (unique) | `jean.dupont@email.com` |

##### **Informations recommandées**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Téléphone** | Numéro de contact | `06 12 34 56 78` |
| **Entreprise** | Sélection dans la liste | `TechCorp SARL` |

##### **Adresse complète**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Adresse** | Rue et numéro | `123 Avenue des Clients` |
| **Code postal** | Code postal | `75001` |
| **Ville** | Ville | `Paris` |
| **Pays** | Pays | `France` |

##### **Informations internes**

| Champ | Description |
|-------|-------------|
| **Notes** | Observations, préférences, historique informel |

#### **🏢 Association à une entreprise**
- **Nouvelle entreprise** : Créer d'abord l'entreprise
- **Entreprise existante** : Sélectionner dans la liste déroulante
- **Client indépendant** : Laisser vide ou sélectionner "Aucune entreprise"

### 👁️ Profil détaillé d'un client

#### **📋 Vue d'ensemble**
Le profil client affiche un **tableau de bord complet** :

```
┌─────────────────────────────────────────────────────────┐
│ 👤 Jean Dupont                              [Modifier] │
│ jean.dupont@email.com | 📞 06 12 34 56 78              │
│ 🏢 TechCorp SARL                                        │
├─────────────────────────────────────────────────────────┤
│ 📊 Résumé                                               │
│ • 3 devis (2 acceptés, 1 en cours)                     │
│ • 2 factures (1 payée, 1 en attente)                   │
│ • CA total : 15 450 € HT                               │
├─────────────────────────────────────────────────────────┤
│ 📄 [Devis] 💼 [Opportunités] 🎫 [Tickets] ✅ [Todos]    │
│ 📧 [Emails] 📈 [Historique]                            │
└─────────────────────────────────────────────────────────┘
```

#### **📊 Sections du profil**

##### **📄 Devis associés**
- Liste des devis créés pour ce client
- Statuts et montants
- Liens directs vers les devis

##### **🧾 Factures liées**
- Factures émises pour ce client
- Suivi des paiements
- Accès aux documents PDF

##### **💼 Opportunités commerciales**
- Projets en cours de négociation
- Pipelines commercial
- Probabilités et montants

##### **🎫 Tickets de support**
- Demandes d'assistance
- Problèmes techniques
- Statuts de résolution

##### **✅ Todos et tâches**
- Actions à réaliser pour ce client
- Suivi des engagements
- Planification des relances

##### **📧 Historique d'emails**
- Emails envoyés au client
- Templates utilisés
- Traçabilité des communications

### ✏️ Modifier un client

#### **🎯 Accès à la modification**
1. **Depuis la liste** : Cliquer sur "Modifier" (icône crayon)
2. **Depuis le profil** : Bouton "Modifier" en haut à droite

#### **🔄 Informations modifiables**
- ✅ **Toutes les informations** saisies à la création
- ✅ **Changement d'entreprise** (réassociation)
- ✅ **Statut actif/inactif**
- ✅ **Mise à jour des coordonnées**
- ✅ **Modification des notes**

#### **⚠️ Restrictions**
- ❌ **Email unique** : Ne peut pas être utilisé par un autre client
- 🔒 **Conservation des données** : Les devis/factures restent liés

### 📧 Envoyer un email à un client

#### **✉️ Depuis le profil client**
1. **Ouvrez le profil** du client
2. **Cliquez sur "Envoyer un email"**
3. **Rédigez votre message**
4. **Envoyez** et tracez automatiquement

#### **📝 Interface d'envoi**

```
┌─────────────────────────────────────────────────────────┐
│ 📧 Nouvel email pour Jean Dupont                        │
│ Destinataire : jean.dupont@email.com                   │
├─────────────────────────────────────────────────────────┤
│ Objet : [___________________________________]           │
├─────────────────────────────────────────────────────────┤
│ Message :                                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │ Rédigez votre message ici...                       │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                          [Annuler] [Envoyer]           │
└─────────────────────────────────────────────────────────┘
```

#### **🎯 Fonctionnalités d'email**
- **Envoi immédiat** vers l'email du client
- **Sauvegarde automatique** dans l'historique
- **Templates** prédéfinis (si configurés)
- **Traçabilité** : Qui, quand, quoi

---

## 🔗 Relations Clients-Entreprises

### 🏗️ Modèle de relation

#### **Structure hiérarchique**
```
🏢 ENTREPRISE (ex: TechCorp SARL)
    ├── 👤 Contact Principal (ex: Jean Dupont - Directeur)
    ├── 👤 Contact Technique (ex: Marie Martin - CTO)
    ├── 👤 Contact Financier (ex: Paul Durand - DAF)
    └── 👤 Autres contacts (ex: équipe projet)
```

#### **📊 Avantages de la relation**
- **Vision globale** : Tous les contacts d'une même société
- **Facturation centralisée** : Adresse de facturation unique
- **Historique complet** : Toutes les interactions par entreprise
- **Reporting avancé** : CA par entreprise

### 🔄 Gérer les associations

#### **🏢 Associer un client à une entreprise**
1. **Modifier le client**
2. **Sélectionner l'entreprise** dans le menu déroulant
3. **Enregistrer** la modification

#### **🔄 Changer d'entreprise**
1. **Éditer le profil** client
2. **Choisir la nouvelle entreprise**
3. **Confirmer** le changement
4. **Historique conservé** : L'ancienne association est tracée

#### **🚫 Retirer l'association**
1. **Modifier le client**
2. **Sélectionner "Aucune entreprise"**
3. **Le client devient indépendant**

### 📊 Vue enterprise

#### **👥 Depuis le profil entreprise**
- **Liste des clients** associés
- **Statistiques globales** (CA, nombre de devis)
- **Actions groupées** possibles

#### **🎯 Cas d'usage**
- **Entreprise avec plusieurs contacts** : Directeur + équipe
- **Holding** : Plusieurs filiales et contacts
- **Partenaire** : Contacts multiples selon les projets

---

## 💼 Système d'Opportunités

### 🎯 Qu'est-ce qu'une opportunité ?

Une **opportunité commerciale** représente :
- **Projet potentiel** en cours de négociation
- **Lead qualifié** avec un besoin identifié
- **Affaire en cours** avec une probabilité de succès
- **Pipeline commercial** pour le suivi

### ➕ Créer une opportunité

#### **🚀 Depuis le profil client**
1. **Ouvrez le profil** du client concerné
2. **Cliquez sur l'onglet "Opportunités"**
3. **Bouton "Nouvelle opportunité"**
4. **Remplissez** les informations

#### **📝 Formulaire d'opportunité**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Titre** | Nom du projet/opportunité | `Refonte site web` |
| **Description** | Détails du besoin | `Modernisation de leur site e-commerce` |
| **Montant estimé** | Valeur potentielle (HT) | `15 000 €` |
| **Probabilité** | Chance de succès (%) | `75%` |
| **Date de clôture** | Échéance de décision | `2024-03-15` |
| **Statut** | Étape actuelle | `Négociation` |

#### **📊 Statuts d'opportunité**
- **🟢 Qualification** : Besoin identifié
- **🔵 Proposition** : Devis en préparation
- **🟠 Négociation** : Discussion prix/conditions
- **✅ Gagnée** : Affaire conclue
- **❌ Perdue** : Opportunité échouée
- **⏸️ En attente** : Temporairement suspendue

### 📈 Suivi des opportunités

#### **📊 Vue globale**
```
💼 Opportunités en cours

┌─────────────────────────────────────────────────────────┐
│ Client          | Projet        | Montant | Prob. | 📅  │
│ ─────────────────────────────────────────────────────── │
│ 👤 Jean Dupont  | Site web      | 15k€    | 75%   | 15/03│
│ 👤 Marie M.     | App mobile    | 25k€    | 50%   | 20/03│
│ 👤 Paul D.      | Maintenance   | 5k€     | 90%   | 10/03│
├─────────────────────────────────────────────────────────┤
│ 💰 Total pipeline : 45 000 € | ⚡ Pondéré : 32 250 €   │
└─────────────────────────────────────────────────────────┘
```

#### **🎯 Actions disponibles**
- **✏️ Modifier** : Mettre à jour statut, probabilité, montant
- **📄 Convertir en devis** : Créer directement un devis
- **📧 Envoyer un email** : Communication liée à l'opportunité
- **🗑️ Archiver** : Marquer comme perdue ou annulée

### 🔄 Workflow opportunité → devis

#### **🎯 Conversion automatique**
1. **Opportunité qualifiée** et acceptée
2. **Clic sur "Convertir en devis"**
3. **Pré-remplissage** avec les données de l'opportunité
4. **Ajout des services** depuis le catalogue
5. **Génération du devis** professionnel

---

## 🎫 Gestion des Tickets de Support

### 🎯 Qu'est-ce qu'un ticket ?

Un **ticket de support** permet de :
- **Tracer les demandes** d'assistance client
- **Organiser le SAV** et la maintenance
- **Suivre les problèmes** techniques
- **Mesurer la satisfaction** client

### ➕ Créer un ticket

#### **🚀 Depuis le profil client**
1. **Accédez au profil** client
2. **Onglet "Tickets"**
3. **"Nouveau ticket"**
4. **Décrivez** le problème

#### **📝 Informations du ticket**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Titre** | Résumé du problème | `Bug connexion utilisateur` |
| **Description** | Détails techniques | `Les utilisateurs ne peuvent plus se connecter depuis hier matin...` |
| **Priorité** | Urgence du problème | `Haute`, `Moyenne`, `Basse` |
| **Catégorie** | Type de demande | `Bug`, `Demande`, `Information` |

### 📊 Statuts de ticket

#### **🎛️ Cycle de vie**
```
🟢 Ouvert → 🔵 En cours → ⏸️ En attente → ✅ Résolu → 🔒 Fermé
              ↓
          🟠 Escaladé
```

#### **📋 Détail des statuts**
- **🟢 Ouvert** : Nouveau ticket à traiter
- **🔵 En cours** : Pris en charge par un technicien
- **🟠 Escaladé** : Transféré à un niveau supérieur
- **⏸️ En attente** : Attente d'informations client
- **✅ Résolu** : Problème corrigé
- **🔒 Fermé** : Ticket clôturé définitivement

### 👷 Attribution et suivi

#### **🎯 Assignation**
- **Attribution manuelle** : Choisir le technicien responsable
- **Attribution automatique** : Selon la charge de travail
- **Réassignation** : Changer de responsable si nécessaire

#### **📈 Progression**
- **Pourcentage d'avancement** : 0% → 100%
- **Temps estimé** vs **temps passé**
- **Commentaires internes** : Notes techniques
- **Commentaires client** : Communication externe

### 🔄 Actions sur les tickets

#### **💬 Communication**
- **Commentaires internes** : Visible par l'équipe uniquement
- **Messages au client** : Envoyés par email automatiquement
- **Historique complet** : Toutes les interactions tracées

#### **⏰ Gestion du temps**
- **Estimation initiale** : Temps prévu pour résoudre
- **Temps passé** : Heures réellement travaillées
- **Facturation** : Transformation en lignes de facture si besoin

---

## ✅ Système de Todos par Client

### 🎯 Utilité des Todos

Les **Todos** permettent de :
- **Planifier** les actions à réaliser pour chaque client
- **Suivre** les engagements pris
- **Organiser** les relances et rappels
- **Collaborer** en équipe sur les tâches

### ➕ Créer un Todo

#### **🚀 Depuis le profil client**
1. **Profil client** → Onglet "Todos"
2. **"Nouvelle tâche"**
3. **Définir** l'action à réaliser

#### **📝 Informations du Todo**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Titre** | Action à réaliser | `Relancer pour signature devis` |
| **Description** | Détails optionnels | `Le client doit signer le devis avant vendredi` |
| **Date d'échéance** | Quand réaliser | `2024-03-15` |
| **Priorité** | Importance | `Haute`, `Normale`, `Basse` |
| **Assigné à** | Responsable | `Marie Martin` |

### 📅 Planification et rappels

#### **🎯 Types de Todos fréquents**
- **📞 Rappeler le client** pour suivi
- **📧 Envoyer la documentation** promise
- **📄 Préparer le devis** pour le projet X
- **🧾 Relancer facture** impayée
- **🔄 Planifier réunion** de validation

#### **⏰ Gestion des échéances**
- **Aujourd'hui** : Tâches du jour en priorité
- **Cette semaine** : Planning hebdomadaire
- **En retard** : Todos dépassés (alerte rouge)
- **À venir** : Planification future

### ✅ Marquer comme terminé

#### **🎯 Validation des tâches**
1. **Cocher la case** ✅ du Todo
2. **Ajouter un commentaire** de finalisation (optionnel)
3. **Archive automatique** : Le Todo reste visible mais inactif

#### **📊 Statistiques**
- **Tâches réalisées** : Suivi de performance
- **Temps moyen** : Analyse de productivité
- **Taux de réalisation** : Par utilisateur et par client

### 🔄 Organisation et tri

#### **📋 Affichage personnalisable**
- **Tri par priorité** : Hautes en premier
- **Tri par échéance** : Urgences en tête
- **Tri par assigné** : Voir ses propres tâches
- **Filtres** : Par statut, date, responsable

#### **🏷️ Catégories de Todos**
- **🚨 Urgent** : À faire immédiatement
- **📅 Planifié** : Date précise définie
- **🔄 Récurrent** : Tâches répétitives
- **📋 Projet** : Liées à un projet spécifique

---

## 📧 Communication Client (Emails)

### 📨 Système d'emails intégré

Le Dashboard Madinia inclut un **système de communication** complet pour :
- **Envoyer des emails** personnalisés aux clients
- **Tracer toutes les communications**
- **Utiliser des templates** prédéfinis
- **Centraliser l'historique** par client

### ✉️ Envoyer un email

#### **🎯 Depuis le profil client**
1. **Ouvrir le profil** du client destinataire
2. **Bouton "Envoyer un email"** ou onglet "Emails"
3. **Rédiger** le message
4. **Envoyer** et tracer automatiquement

#### **📝 Interface de rédaction**
```
┌─────────────────────────────────────────────────────────┐
│ 📧 Nouvel email                                         │
│ À : jean.dupont@email.com (Jean Dupont)                │
├─────────────────────────────────────────────────────────┤
│ Objet : [________________________________]              │
├─────────────────────────────────────────────────────────┤
│ 📝 Message :                                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Bonjour Jean,                                       │ │
│ │                                                     │ │
│ │ J'espère que vous allez bien...                     │ │
│ │                                                     │ │
│ │ Cordialement,                                       │ │
│ │ [Votre signature]                                   │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│                          [Annuler] [Envoyer]           │
└─────────────────────────────────────────────────────────┘
```

### 📋 Templates d'emails

#### **🎨 Types de templates**
Si des modèles d'emails sont configurés, vous pourrez utiliser :
- **Email de relance** : Pour rappels clients
- **Email de remerciement** : Après signature
- **Email de suivi** : Après livraison
- **Email personnalisé** : Selon vos besoins

#### **🔄 Variables automatiques**
Les templates peuvent inclure :
- `{nom_client}` : Nom du client
- `{prenom_client}` : Prénom du client
- `{entreprise}` : Nom de l'entreprise
- `{montant_devis}` : Montant du dernier devis
- `{date}` : Date du jour

### 📚 Historique des emails

#### **📊 Traçabilité complète**
Chaque email envoyé est **automatiquement enregistré** avec :
- **Date et heure** d'envoi
- **Expéditeur** (utilisateur qui a envoyé)
- **Objet** et **contenu** complets
- **Statut** : Envoyé, Échoué, etc.

#### **🔍 Consultation de l'historique**
```
📧 Historique des emails - Jean Dupont

┌─────────────────────────────────────────────────────────┐
│ 📅 15/03/2024 14:30 | Par : Marie Martin               │
│ 📧 Objet : Relance pour signature devis                │
│ ✅ Statut : Envoyé avec succès                          │
├─────────────────────────────────────────────────────────┤
│ 📅 10/03/2024 09:15 | Par : Paul Durand               │
│ 📧 Objet : Proposition commerciale                     │
│ ✅ Statut : Envoyé avec succès                          │
├─────────────────────────────────────────────────────────┤
│ 📅 05/03/2024 16:45 | Par : Jean Admin                │
│ 📧 Objet : Première prise de contact                   │
│ ✅ Statut : Envoyé avec succès                          │
└─────────────────────────────────────────────────────────┘
```

### 🔔 Notifications et alertes

#### **📬 Gestion des retours**
- **Envoi réussi** : Notification verte confirmant l'envoi
- **Échec d'envoi** : Alerte rouge avec détails de l'erreur
- **Email invalide** : Warning si l'adresse est incorrecte

#### **📊 Statistiques d'emails**
- **Nombre d'emails** envoyés par client
- **Fréquence** de communication
- **Dernière interaction** par email

---

## 📝 Historique et Traçabilité

### 🎯 Système d'historique

Le Dashboard Madinia **trace automatiquement** toutes les actions pour :
- **Compliance** et auditabilité
- **Suivi des modifications**
- **Analyse des comportements**
- **Résolution de problèmes**

### 📊 Types d'actions tracées

#### **👥 Actions sur les clients**
- **Création** : Nouveau client ajouté
- **Modification** : Informations mises à jour
- **Suppression** : Client archivé/supprimé
- **Association** : Lien avec une entreprise
- **Communication** : Emails envoyés

#### **🏢 Actions sur les entreprises**
- **Création** et **modification** d'entreprises
- **Changements de statut** (actif/inactif)
- **Mise à jour** des coordonnées
- **Ajout/suppression** de clients

#### **💼 Actions commerciales**
- **Création d'opportunités**
- **Changements de statut** des opportunités
- **Conversion** opportunité → devis
- **Création et modification** de tickets

### 📅 Consultation de l'historique

#### **📋 Interface d'historique**
```
📝 Historique - Jean Dupont

┌─────────────────────────────────────────────────────────┐
│ 📅 15/03/2024 14:30 | 👤 Marie Martin                  │
│ 📧 Email envoyé                                         │
│ "Relance pour signature devis"                         │
├─────────────────────────────────────────────────────────┤
│ 📅 10/03/2024 09:15 | 👤 Paul Durand                  │
│ ✏️ Informations modifiées                               │
│ Téléphone : 06 12 34 56 78 → 06 87 65 43 21           │
├─────────────────────────────────────────────────────────┤
│ 📅 05/03/2024 16:45 | 👤 Jean Admin                   │
│ 💼 Opportunité créée                                    │
│ "Refonte site web - 15 000€ - Prob. 75%"              │
├─────────────────────────────────────────────────────────┤
│ 📅 01/03/2024 10:00 | 👤 Marie Martin                  │
│ 👤 Client créé                                          │
│ Ajout du client avec email jean.dupont@email.com       │
└─────────────────────────────────────────────────────────┘
```

#### **🔍 Filtres d'historique**
- **Par utilisateur** : Voir les actions d'une personne
- **Par type d'action** : Emails, modifications, créations
- **Par période** : Dernière semaine, mois, etc.
- **Par entité** : Client, entreprise, opportunité

### 📊 Informations détaillées

#### **🔎 Détails des modifications**
Pour chaque changement, l'historique affiche :
- **Valeur avant** la modification
- **Valeur après** la modification
- **Utilisateur** qui a effectué le changement
- **Date et heure** précises
- **Commentaires** additionnels si disponibles

#### **📈 Analyse de l'activité**
- **Fréquence des interactions** par client
- **Utilisateurs les plus actifs**
- **Types d'actions** les plus fréquents
- **Évolution** dans le temps

---

## ✅ Bonnes Pratiques

### 🎯 Organisation des données

#### **🏢 Pour les entreprises**
- **Créer l'entreprise d'abord** avant les clients
- **Renseigner le SIRET** pour l'identification officielle
- **Mettre à jour régulièrement** les coordonnées
- **Utiliser les notes** pour les informations importantes

#### **👥 Pour les clients**
- **Email unique et valide** obligatoire
- **Associer à l'entreprise** si applicable
- **Compléter l'adresse** pour la facturation
- **Ajouter des notes** sur les préférences/historique

### 📋 Gestion du cycle commercial

#### **💼 Workflow recommandé**
1. **Opportunité** → Qualification du besoin
2. **Todo** → Planifier les actions de suivi
3. **Email** → Maintenir le contact
4. **Devis** → Conversion de l'opportunité
5. **Ticket** → Support post-vente si nécessaire

#### **🔄 Suivi régulier**
- **Mettre à jour** les statuts des opportunités
- **Marquer les Todos** comme terminés
- **Documenter** les échanges importants
- **Relancer** régulièrement selon le planning

### 🔒 Sécurité et maintenance

#### **📞 Contacts d'urgence**
- **Maintenir** des informations de contact à jour
- **Tester** régulièrement les emails
- **Avoir plusieurs contacts** par entreprise importante

#### **🗑️ Nettoyage périodique**
- **Archiver** les clients inactifs plutôt que supprimer
- **Nettoyer** les Todos obsolètes
- **Fermer** les tickets résolus
- **Réviser** les opportunités perdues

---

## 🆘 Résolution de problèmes

### ❗ Problèmes courants

#### **"Email déjà utilisé"**
**Solutions :**
1. Vérifier qu'un autre client n'utilise pas déjà cet email
2. Modifier l'email existant si c'est un doublon
3. Utiliser un email alternatif (+1, +contact, etc.)

#### **"Impossible d'associer à l'entreprise"**
**Solutions :**
1. Vérifier que l'entreprise existe et est active
2. Créer l'entreprise d'abord si nécessaire
3. Rafraîchir la page et réessayer

#### **"Erreur d'envoi d'email"**
**Solutions :**
1. Vérifier l'adresse email du destinataire
2. Contrôler la configuration SMTP du système
3. Réessayer après quelques minutes

### 📞 Support

Pour toute assistance :
- **Documentation** : Consulter les autres modules
- **Support technique** : s.jacques@madin-ia.com
- **Formation** : Demander une session avec l'équipe

---

## 🎉 Résumé

Vous maîtrisez maintenant la **gestion commerciale complète** du Dashboard Madinia avec les entreprises, clients, opportunités, tickets, todos et communications !

### 🚀 Prochaines étapes
1. **Créer** vos premières entreprises et clients
2. **Explorer** la création de devis (Module 4)
3. **Tester** les fonctionnalités avancées

---

*Guide créé le : [Date]*  
*Dernière mise à jour : [Date]*  
*Version : 1.0* 