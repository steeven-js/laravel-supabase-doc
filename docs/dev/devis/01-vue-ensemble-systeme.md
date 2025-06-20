# Module 1.1 : Vue d'Ensemble du Système Devis

## 📋 Introduction

Le système de devis constitue le **cœur métier** du Dashboard Madinia. Il gère l'ensemble du cycle de vie commercial, depuis la création jusqu'à la transformation en facture, en passant par l'envoi, l'acceptation ou le refus par le client.

> **Complexité** : ⭐⭐⭐⭐⭐ (5/5 - Très Élevée)  
> **Statut** : Module central du système  
> **Entités liées** : Clients, Entreprises, Services, Factures, Utilisateurs

## 🔄 Cycle de Vie Complet d'un Devis

### Vue d'Ensemble
Le cycle de vie d'un devis suit un processus structuré en 7 étapes principales :

1. **🎯 Création** - Rédaction initiale du devis
2. **💾 Sauvegarde** - Stockage en brouillon ou en attente
3. **📤 Envoi** - Transmission au client
4. **⏳ Attente** - Période de validation client
5. **✅ Décision** - Acceptation ou refus
6. **🔄 Transformation** - Conversion en facture (si accepté)
7. **📊 Archivage** - Finalisation du processus

### Statuts du Devis
Le système gère **6 statuts principaux** :

| Statut | Code | Description | Actions possibles |
|--------|------|-------------|------------------|
| 🟡 **Brouillon** | `brouillon` | Création en cours, non finalisé | Éditer, Envoyer, Supprimer |
| 🔵 **En attente** | `en_attente` | Prêt à être envoyé | Envoyer, Éditer, Changer statut |
| 🟣 **Envoyé** | `envoye` | Transmis au client | Accepter, Refuser, Renvoyer |
| 🟢 **Accepté** | `accepte` | Validé par le client | Transformer en facture |
| 🔴 **Refusé** | `refuse` | Rejeté par le client | Consulter, Archiver |
| ⚫ **Expiré** | `expire` | Date de validité dépassée | Consulter, Archiver |

### Statuts d'Envoi
Le système suit également **3 statuts d'envoi** :

| Statut | Code | Description |
|--------|------|-------------|
| ⭕ **Non envoyé** | `non_envoye` | Pas encore transmis |
| ✅ **Envoyé** | `envoye` | Transmis avec succès |
| ❌ **Échec d'envoi** | `echec_envoi` | Erreur lors de la transmission |

## 🔄 Machine à États et Transitions

### Diagramme de Transition des États

```mermaid
stateDiagram-v2
    [*] --> Brouillon : Création
    
    Brouillon --> En_attente : Finalisation
    Brouillon --> Envoyé : Envoi direct
    Brouillon --> [*] : Suppression
    
    En_attente --> Envoyé : Envoi au client
    En_attente --> Brouillon : Retour en édition
    En_attente --> [*] : Suppression
    
    Envoyé --> Accepté : Validation client
    Envoyé --> Refusé : Rejet client
    Envoyé --> Expiré : Date limite atteinte
    Envoyé --> Envoyé : Renvoi
    
    Accepté --> Facturé : Transformation
    Refusé --> [*] : Archivage
    Expiré --> [*] : Archivage
    
    Facturé --> [*] : Finalisation
    
    note right of Accepté
        Seul statut permettant
        la transformation en facture
    end note
    
    note right of Expiré
        Transition automatique
        via cron job ou vérification
    end note
```

### Transitions Autorisées

#### Depuis Brouillon
- ✅ **Vers En attente** : `store()` avec validation complète
- ✅ **Vers Envoyé** : `envoyerEmail()` avec envoi immédiat
- ✅ **Vers Supprimé** : `destroy()` si non envoyé

#### Depuis En attente
- ✅ **Vers Envoyé** : `envoyerEmail()` au client
- ✅ **Vers Brouillon** : `changerStatut()` pour corrections
- ✅ **Vers Supprimé** : `destroy()` si non envoyé

#### Depuis Envoyé
- ✅ **Vers Accepté** : `accepter()` via client ou admin
- ✅ **Vers Refusé** : `refuser()` avec raison
- ✅ **Vers Expiré** : vérification automatique date
- ✅ **Vers Envoyé** : `envoyerEmail()` pour renvoi

#### Depuis Accepté
- ✅ **Vers Facturé** : `transformerEnFacture()` uniquement
- ❌ **Autres transitions** : Statut terminal

#### Depuis Refusé/Expiré
- ❌ **Aucune transition** : Statuts terminaux

### Méthodes de Transition

```php
// Méthodes principales du modèle Devis
public function accepter(): bool              // brouillon/en_attente/envoyé → accepté
public function refuser(): bool               // envoyé → refusé  
public function marquerEnvoye(): bool         // brouillon/en_attente → envoyé
public function marquerExpire(): bool         // envoyé → expiré
public function transformerEnFacture(): Facture // accepté → facturé
```

## 🔗 Intégrations avec Autres Modules

### Intégrations Principales

#### 1. **Module Clients** 🤝
```mermaid
graph LR
    D[Devis] --> C[Client]
    C --> E[Entreprise]
    
    D --> |relation BelongsTo| C
    C --> |relation BelongsTo| E
    
    style D fill:#e1f5fe
    style C fill:#f3e5f5
    style E fill:#e8f5e8
```

**Relations :**
- `Devis::client()` → `BelongsTo Client`
- `Client::devis()` → `HasMany Devis`

**Dépendances :**
- Sélection client obligatoire à la création
- Envoi d'emails automatique au client
- Affichage des informations entreprise

#### 2. **Module Services** 🛠️
```mermaid
graph LR
    D[Devis] --> LD[LigneDevis]
    LD --> S[Service]
    
    D --> |relation HasMany| LD
    LD --> |relation BelongsTo| S
    
    style D fill:#e1f5fe
    style LD fill:#fff3e0
    style S fill:#e8f5e8
```

**Relations :**
- `Devis::lignes()` → `HasMany LigneDevis`
- `LigneDevis::service()` → `BelongsTo Service`

**Fonctionnalités :**
- Catalogue de services disponibles
- Calculs automatiques (HT, TVA, TTC)
- Gestion des unités (heure, jour, forfait)

#### 3. **Module Factures** 💰
```mermaid
graph LR
    D[Devis] --> |transformation| F[Facture]
    F --> LF[LigneFacture]
    
    D --> |relation HasOne| F
    F --> |relation HasMany| LF
    
    style D fill:#e1f5fe
    style F fill:#fff8e1
    style LF fill:#fff3e0
```

**Processus de Transformation :**
1. Vérification `peutEtreTransformeEnFacture()`
2. Création facture via `Facture::creerDepuisDevis()`
3. Copie automatique de toutes les lignes
4. Génération PDF facture
5. Logging complet via `TransformationLogService`

#### 4. **Module Utilisateurs** 👥
```mermaid
graph LR
    D[Devis] --> U[User/Admin]
    U --> |notifications| N[AdminNotification]
    
    D --> |relation BelongsTo| U
    U --> |trait SendsNotifications| N
    
    style D fill:#e1f5fe
    style U fill:#f3e5f5
    style N fill:#ffebee
```

**Rôles :**
- **Administrateur assigné** : Responsable du devis
- **Super Admin** : Accès complet, notifications
- **Admin** : Notifications de changements d'état

#### 5. **Module Emails** 📧
```mermaid
graph LR
    D[Devis] --> ET[EmailTemplate]
    D --> EM[Email Mailable]
    EM --> |logs| ELS[EmailLogService]
    
    style D fill:#e1f5fe
    style ET fill:#e8f5e8
    style EM fill:#fff3e0
    style ELS fill:#f3e5f5
```

**Types d'emails :**
- `DevisClientMail` : Envoi au client
- `DevisAdminMail` : Notification admin
- `DevisAccepteMail` : Confirmation acceptation
- `DevisAccepteAdminMail` : Notification acceptation admin

### Intégrations Système

#### 1. **Système de Notifications** 🔔
```php
// Trait SendsNotifications dans le modèle Devis
use SendsNotifications;

// Notifications automatiques sur :
- Création de devis
- Changement de statut
- Acceptation/Refus
- Transformation en facture
```

#### 2. **Système d'Historique** 📝
```php
// Trait HasHistorique dans le modèle Devis
use HasHistorique;

// Historique automatique pour :
- Création/Modification
- Changements de statut
- Envois d'emails
- Acceptation/Refus
- Transformation
```

#### 3. **Système de Stockage** 💾
```mermaid
graph LR
    D[Devis] --> PDF[PDF React]
    PDF --> LS[Local Storage]
    PDF --> SB[Supabase]
    
    style D fill:#e1f5fe
    style PDF fill:#fff3e0
    style LS fill:#e8f5e8
    style SB fill:#f3e5f5
```

**Stockage dual :**
- **Local** : `storage/app/devis/`
- **Supabase** : Bucket public avec URLs

## 📊 Diagrammes de Flux Métier

### 1. Flux de Création de Devis

```mermaid
flowchart TD
    START([Démarrage]) --> FORM[Formulaire de création]
    FORM --> VALIDATE{Validation}
    VALIDATE -->|❌ Erreur| FORM
    VALIDATE -->|✅ OK| CHOICE{Type de sauvegarde}
    
    CHOICE -->|💾 Brouillon| SAVE_DRAFT[Statut: brouillon]
    CHOICE -->|📤 Direct| SAVE_FINAL[Statut: en_attente]
    
    SAVE_DRAFT --> CREATE_DEVIS[Créer devis]
    SAVE_FINAL --> CREATE_DEVIS
    
    CREATE_DEVIS --> CREATE_LINES[Créer lignes]
    CREATE_LINES --> CALC_AMOUNTS[Calculer montants]
    CALC_AMOUNTS --> GENERATE_PDF[Générer PDF React]
    GENERATE_PDF --> NOTIFY[Notifications]
    NOTIFY --> END([Devis créé])
    
    style START fill:#e8f5e8
    style END fill:#e8f5e8
    style VALIDATE fill:#fff3e0
    style CHOICE fill:#f3e5f5
```

### 2. Flux d'Envoi de Devis

```mermaid
flowchart TD
    START([Demande d'envoi]) --> CHECK{Peut être envoyé?}
    CHECK -->|❌ Non| ERROR[Erreur: Statut invalide]
    CHECK -->|✅ Oui| FORM[Interface d'envoi]
    
    FORM --> SELECT_TEMPLATE[Sélection template]
    SELECT_TEMPLATE --> PREVIEW[Prévisualisation]
    PREVIEW --> SEND[Envoi email]
    
    SEND --> SEND_CLIENT[Email client]
    SEND --> SEND_ADMIN[Email admin]
    
    SEND_CLIENT --> STATUS_CLIENT{Succès?}
    SEND_ADMIN --> STATUS_ADMIN{Succès?}
    
    STATUS_CLIENT -->|✅ OK| UPDATE_STATUS[Marquer envoyé]
    STATUS_CLIENT -->|❌ Erreur| MARK_ERROR[Marquer échec]
    
    STATUS_ADMIN -->|✅ OK| UPDATE_STATUS
    STATUS_ADMIN -->|❌ Erreur| LOG_ERROR[Logger erreur admin]
    
    UPDATE_STATUS --> HISTORY[Historique]
    MARK_ERROR --> HISTORY
    LOG_ERROR --> HISTORY
    
    HISTORY --> NOTIFY[Notifications]
    NOTIFY --> END([Envoi terminé])
    
    style START fill:#e8f5e8
    style END fill:#e8f5e8
    style CHECK fill:#fff3e0
    style SEND fill:#f3e5f5
```

### 3. Flux de Transformation en Facture

```mermaid
flowchart TD
    START([Devis accepté]) --> CHECK{Peut transformer?}
    CHECK -->|❌ Non| ERROR[Erreur: Conditions non remplies]
    CHECK -->|✅ Oui| FORM[Formulaire transformation]
    
    FORM --> PARAMS[Paramètres transformation]
    PARAMS --> PREVIEW[Prévisualisation facture]
    PREVIEW --> CONFIRM{Confirmation}
    
    CONFIRM -->|❌ Non| FORM
    CONFIRM -->|✅ Oui| START_LOG[🚀 Démarrer session log]
    
    START_LOG --> CREATE_FACTURE[Créer facture]
    CREATE_FACTURE --> LOG_FACTURE[📧 Logger facture créée]
    
    LOG_FACTURE --> COPY_LINES[Copier lignes devis]
    COPY_LINES --> LOG_LINES[📋 Logger lignes copiées]
    
    LOG_LINES --> CALC_AMOUNTS[Calculer montants]
    CALC_AMOUNTS --> LOG_AMOUNTS[💰 Logger montants]
    
    LOG_AMOUNTS --> GENERATE_PDF[Générer PDF facture]
    GENERATE_PDF --> SAVE_PDF[Sauvegarder PDF]
    
    SAVE_PDF --> SEND_EMAIL{Envoyer email?}
    SEND_EMAIL -->|✅ Oui| EMAIL_PROCESS[Processus email]
    SEND_EMAIL -->|❌ Non| SKIP_EMAIL[Ignorer email]
    
    EMAIL_PROCESS --> LOG_EMAIL[📧 Logger email]
    LOG_EMAIL --> OPTIMIZE_NOTIF[🔔 Optimiser notifications]
    SKIP_EMAIL --> OPTIMIZE_NOTIF
    
    OPTIMIZE_NOTIF --> LOG_NOTIF[Logger optimisation]
    LOG_NOTIF --> PERF_LOG[⚡ Logger performances]
    
    PERF_LOG --> END_LOG[🏁 Terminer session log]
    END_LOG --> SUCCESS[✅ Transformation réussie]
    
    ERROR --> FAILURE[❌ Transformation échouée]
    
    style START fill:#e8f5e8
    style SUCCESS fill:#e8f5e8
    style FAILURE fill:#ffebee
    style CHECK fill:#fff3e0
    style CONFIRM fill:#f3e5f5
```

### 4. Flux de Gestion des Statuts

```mermaid
flowchart TD
    DEVIS[Devis existant] --> ACTION{Action demandée}
    
    ACTION -->|✅ Accepter| ACCEPT_CHECK{Peut accepter?}
    ACTION -->|❌ Refuser| REFUSE_CHECK{Peut refuser?}
    ACTION -->|🔄 Changer| CHANGE_CHECK{Statut valide?}
    ACTION -->|⏰ Expirer| EXPIRE_CHECK{Est expiré?}
    
    ACCEPT_CHECK -->|✅ Oui| ACCEPT_PROCESS[Processus acceptation]
    ACCEPT_CHECK -->|❌ Non| ERROR[Erreur: Transition invalide]
    
    REFUSE_CHECK -->|✅ Oui| REFUSE_PROCESS[Processus refus]
    REFUSE_CHECK -->|❌ Non| ERROR
    
    CHANGE_CHECK -->|✅ Oui| CHANGE_PROCESS[Changement statut]
    CHANGE_CHECK -->|❌ Non| ERROR
    
    EXPIRE_CHECK -->|✅ Oui| EXPIRE_PROCESS[Marquer expiré]
    EXPIRE_CHECK -->|❌ Non| ERROR
    
    ACCEPT_PROCESS --> SEND_ACCEPT_EMAILS[Emails acceptation]
    REFUSE_PROCESS --> LOG_REFUSE[Logger refus]
    CHANGE_PROCESS --> LOG_CHANGE[Logger changement]
    EXPIRE_PROCESS --> LOG_EXPIRE[Logger expiration]
    
    SEND_ACCEPT_EMAILS --> UPDATE_STATUS[Mise à jour statut]
    LOG_REFUSE --> UPDATE_STATUS
    LOG_CHANGE --> UPDATE_STATUS
    LOG_EXPIRE --> UPDATE_STATUS
    
    UPDATE_STATUS --> HISTORY[Historique]
    HISTORY --> NOTIFICATIONS[Notifications]
    NOTIFICATIONS --> SUCCESS[✅ Succès]
    
    ERROR --> FAILURE[❌ Échec]
    
    style DEVIS fill:#e1f5fe
    style SUCCESS fill:#e8f5e8
    style FAILURE fill:#ffebee
    style ERROR fill:#ffebee
```

## 🎯 Points Clés du Système

### Forces du Système
1. **Machine à états robuste** avec transitions contrôlées
2. **Logging complet** de toutes les actions
3. **Intégration email** dual (client + admin)
4. **Génération PDF React** professionnelle
5. **Système de notifications** automatiques
6. **Historique détaillé** de tous les changements
7. **Transformation facture** fluide et tracée

### Contraintes Métier
1. **Statut accepté** : Seul statut permettant la transformation
2. **Devis unique** : Un devis ne peut générer qu'une seule facture
3. **Date de validité** : Expiration automatique des devis
4. **Workflow strict** : Transitions d'états contrôlées
5. **Traçabilité** : Toutes les actions sont loggées

### Optimisations
1. **Calculs automatiques** des montants
2. **Stockage dual** PDF (local + cloud)
3. **Notifications groupées** pour éviter le spam
4. **Gestion des timeouts** pour les emails
5. **Lazy loading** des relations

## 📈 Métriques et Monitoring

### Indicateurs Clés
- **Taux de conversion** : % devis acceptés
- **Délai de réponse** : Temps entre envoi et acceptation
- **Performance envoi** : Succès/échecs emails
- **Utilisation PDF** : Téléchargements et consultations

### Logs Spécialisés
- **EmailLogService** : Tous les envois d'emails
- **TransformationLogService** : Transformations en factures
- **Historique** : Toutes les modifications

---

> **Note** : Ce module constitue la fondation de la documentation technique des devis. Il sera complété par les modules suivants couvrant l'architecture détaillée, les composants backend et frontend, et les optimisations avancées. 