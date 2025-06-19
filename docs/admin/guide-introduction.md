# 🚀 Guide d'Introduction et Prise en Main
## Dashboard Madinia - Documentation Administrateurs

---

## 📋 Table des matières

1. [Qu'est-ce que le Dashboard Madinia ?](#quest-ce-que-le-dashboard-madinia)
2. [Première connexion](#première-connexion)
3. [Les rôles et permissions](#les-rôles-et-permissions)
4. [Interface générale et navigation](#interface-générale-et-navigation)
5. [Terminologie et concepts de base](#terminologie-et-concepts-de-base)
6. [Premiers pas recommandés](#premiers-pas-recommandés)

---

## 🎯 Qu'est-ce que le Dashboard Madinia ?

Le **Dashboard Madinia** est une application web de **gestion commerciale complète** conçue pour simplifier et automatiser la gestion de votre activité commerciale.

### 🏢 Fonctionnalités principales

- **📊 Tableau de bord intelligent** - Vue d'ensemble de votre activité avec statistiques et graphiques
- **👥 Gestion clients & entreprises** - Base de données commerciale centralisée
- **📄 Devis professionnels** - Création, envoi et suivi des devis avec PDFs automatiques
- **🧾 Facturation intégrée** - Gestion complète des factures et suivi des paiements
- **🛍️ Catalogue de services** - Gestion centralisée de vos prestations et tarifs
- **📧 Emails personnalisés** - Templates d'emails avec variables dynamiques
- **📈 Analytics & rapports** - Suivi de performance et aide à la décision

### 🎪 Qui peut utiliser ce dashboard ?

Ce dashboard est destiné aux **équipes commerciales et administratives** de l'entreprise Madinia, incluant :
- Dirigeants et responsables commerciaux
- Équipes de vente et relation client
- Équipes administratives et comptables
- Support technique et maintenance

---

## 🔐 Première connexion

### 📧 Obtenir ses identifiants

Vos identifiants de connexion vous sont fournis par un **Super Administrateur**. Vous recevrez :
- **Adresse email** : Votre email professionnel
- **Mot de passe temporaire** : À changer dès la première connexion

> ⚠️ **Important** : Pour des raisons de sécurité, changez votre mot de passe dès votre première connexion.

### 🌐 Accéder au dashboard

1. **Ouvrez votre navigateur web** (Chrome, Firefox, Safari, Edge)
2. **Saisissez l'URL** fournie par votre administrateur
3. **Arrivée sur la page de connexion**

### 📝 Se connecter

1. **Saisissez votre email** dans le champ "Adresse e-mail"
2. **Entrez votre mot de passe** dans le champ "Mot de passe"
3. **Cochez "Se souvenir de moi"** (optionnel) pour rester connecté
4. **Cliquez sur "Connexion"**

> 💡 **Astuce** : Si vous avez oublié votre mot de passe, cliquez sur "Mot de passe oublié ?" pour le réinitialiser.

### ✅ Première connexion réussie

Après votre première connexion, vous arriverez sur le **tableau de bord principal** qui affiche :
- Un aperçu de l'activité commerciale
- Les statistiques principales (clients, devis, factures)
- Les actions rapides les plus utilisées

---

## 👤 Les rôles et permissions

Le dashboard utilise un **système de rôles** pour contrôler l'accès aux fonctionnalités selon votre fonction dans l'entreprise.

### 🔴 Super Administrateur
**Accès complet au système**

**Permissions :**
- ✅ Toutes les fonctionnalités standard
- ✅ Gestion des utilisateurs (création, modification, suppression)
- ✅ Configuration système et paramètres avancés
- ✅ Outils de maintenance et monitoring
- ✅ Accès aux données sensibles et rapports complets

**Qui a ce rôle :** Dirigeants, responsables IT, administrateurs système

### 🟠 Administrateur
**Accès étendu aux fonctionnalités métier**

**Permissions :**
- ✅ Gestion complète des clients et entreprises
- ✅ Création et gestion des devis/factures
- ✅ Accès au catalogue de services
- ✅ Configuration des templates d'emails
- ✅ Visualisation des tableaux de bord et statistiques
- ❌ Gestion des utilisateurs (lecture seule)
- ❌ Configuration système avancée

**Qui a ce rôle :** Responsables commerciaux, managers, comptables

### 🟢 Gestionnaire
**Accès aux fonctionnalités quotidiennes**

**Permissions :**
- ✅ Gestion des clients (selon attribution)
- ✅ Création de devis et factures
- ✅ Consultation du catalogue de services
- ✅ Envoi d'emails clients
- ✅ Accès aux statistiques de base
- ❌ Configuration système
- ❌ Gestion d'autres utilisateurs

**Qui a ce rôle :** Commerciaux, assistants, gestionnaires de compte

### 🔍 Comment connaître votre rôle ?

Votre rôle est affiché dans le **menu utilisateur** en haut à droite de l'interface. Cliquez sur votre avatar ou nom pour voir vos permissions.

---

## 🧭 Interface générale et navigation

### 📱 Structure de l'interface

Le dashboard est organisé en **4 zones principales** :

```
┌─────────────────────────────────────────────────────┐
│ 1. HEADER (En-tête)                                 │
│   - Logo Madinia                                    │
│   - Breadcrumbs (fil d'Ariane)                     │
│   - Menu utilisateur                                │
├─────────────┬───────────────────────────────────────┤
│ 2. SIDEBAR  │ 3. CONTENU PRINCIPAL                  │
│   (Menu     │   - Page active                       │
│   latéral)  │   - Formulaires                       │
│   - Dashboard│   - Tableaux                         │
│   - Clients │   - Graphiques                       │
│   - Devis   │                                       │
│   - etc.    │                                       │
├─────────────┼───────────────────────────────────────┤
│             │ 4. NOTIFICATIONS                      │
│             │   - Toasts (en haut à droite)         │
└─────────────┴───────────────────────────────────────┘
```

### 🎨 Navigation principale (Sidebar)

Le **menu latéral gauche** contient tous les modules accessibles selon votre rôle :

#### 📊 **Dashboard**
- Vue d'ensemble de l'activité
- Statistiques et graphiques
- Actions rapides

#### 🏢 **Madin.IA**
- Informations sur l'entreprise
- Configuration des coordonnées
- Paramètres généraux

#### 👥 **Clients**
- Liste des clients
- Création et modification
- Historique des interactions

#### 🏬 **Entreprises**
- Gestion des entreprises clientes
- Informations de facturation
- Contacts associés

#### 🛍️ **Services**
- Catalogue des prestations
- Tarification et unités
- Gestion des codes services

#### 📄 **Devis**
- Création et envoi de devis
- Suivi des statuts
- Transformation en factures

#### 🧾 **Factures**
- Gestion des factures
- Suivi des paiements
- Relances automatiques

#### 📧 **Modèles d'Email**
- Templates personnalisés
- Variables dynamiques
- Prévisualisation

#### 👤 **Utilisateurs** *(Super Admin uniquement)*
- Gestion des comptes
- Attribution des rôles
- Permissions

#### 🔧 **Monitoring** *(Super Admin uniquement)*
- Outils de diagnostic
- Tests système
- Maintenance

### 🗺️ Navigation secondaire

#### **Fil d'Ariane (Breadcrumbs)**
Affiché en haut de chaque page, il vous indique où vous êtes :
```
Dashboard > Clients > Modifier client : Jean Dupont
```

#### **Menu utilisateur**
Cliquez sur votre avatar (en haut à droite) pour accéder à :
- **Profil** : Modifier vos informations personnelles
- **Paramètres** : Configuration de votre compte
- **Déconnexion** : Quitter le dashboard

#### **Actions contextuelles**
Sur chaque page, vous trouverez des boutons d'action :
- **Boutons principaux** : Créer, Modifier, Supprimer
- **Actions rapides** : Dupliquer, Envoyer par email, Exporter
- **Filtres** : Recherche, tri, période

---

## 📚 Terminologie et concepts de base

### 🎯 Concepts commerciaux

#### **👤 Client**
Une personne physique ou contact principal d'une entreprise. Un client peut être associé à une entreprise ou être indépendant.

#### **🏢 Entreprise**
Une société cliente pouvant avoir plusieurs contacts/clients associés. Contient les informations de facturation.

#### **📄 Devis**
Document commercial proposant des services avec tarification. Un devis peut avoir les statuts :
- **Brouillon** : En cours de rédaction
- **Envoyé** : Transmis au client
- **Accepté** : Validé par le client
- **Refusé** : Décliné par le client
- **Expiré** : Dépassé la date limite

#### **🧾 Facture**
Document comptable émis après acceptation d'un devis ou prestation. Statuts possibles :
- **Brouillon** : En préparation
- **Envoyée** : Transmise au client
- **Payée** : Règlement reçu
- **En retard** : Dépassée l'échéance
- **Annulée** : Annulée

#### **🛍️ Service**
Prestation proposée par Madinia (consultation, développement, maintenance, etc.) avec :
- **Code** : Identifiant unique
- **Tarif** : Prix unitaire
- **Unité** : Heure, jour, forfait, mois, licence, etc.

### 🎨 Éléments d'interface

#### **📊 Dashboard/Tableau de bord**
Page d'accueil avec vue d'ensemble de l'activité et statistiques.

#### **🎛️ Filtres**
Outils pour affiner l'affichage des données (période, statut, client, etc.).

#### **📈 Widgets**
Petits modules d'information (graphiques, compteurs, alertes).

#### **🔔 Notifications/Toasts**
Messages temporaires d'information, succès, avertissement ou erreur.

#### **📋 Formulaires**
Interfaces de saisie pour créer ou modifier des données.

#### **📊 Tableaux**
Listes structurées avec possibilités de tri, recherche et pagination.

---

## 🎯 Premiers pas recommandés

### ✅ Checklist de démarrage

#### **1. Sécuriser votre compte** *(5 minutes)*
- [ ] Modifier votre mot de passe temporaire
- [ ] Compléter vos informations de profil
- [ ] Ajouter un avatar (optionnel)

#### **2. Explorer l'interface** *(10 minutes)*
- [ ] Naviguer dans chaque section du menu
- [ ] Consulter le tableau de bord principal
- [ ] Tester les filtres temporels

#### **3. Comprendre les données existantes** *(15 minutes)*
- [ ] Parcourir la liste des clients
- [ ] Examiner quelques devis exemples
- [ ] Consulter le catalogue de services

#### **4. Tester les fonctionnalités de base** *(20 minutes)*
- [ ] Créer un client de test
- [ ] Rédiger un devis simple
- [ ] Générer un PDF de prévisualisation

### 🎓 Formation progressive

#### **Semaine 1 : Prise en main**
- Familiarisation avec l'interface
- Gestion de base des clients
- Consultation des données existantes

#### **Semaine 2 : Création de contenu**
- Création de devis simples
- Utilisation du catalogue de services
- Envoi d'emails basiques

#### **Semaine 3 : Fonctionnalités avancées**
- Gestion complète du cycle devis → facture
- Personnalisation des templates d'emails
- Utilisation des statistiques et filtres

#### **Semaine 4 : Maîtrise**
- Optimisation du workflow
- Utilisation des fonctionnalités avancées
- Formation d'autres utilisateurs

### 📞 Obtenir de l'aide

#### **🆘 En cas de problème**
1. **Consultez cette documentation** - La plupart des réponses s'y trouvent
2. **Utilisez la recherche** - Ctrl+F pour trouver rapidement
3. **Contactez un Super Administrateur** - Pour les problèmes techniques
4. **Signalez les bugs** - Pour améliorer le système

#### **📖 Documentation connexe**
- [Gestion des Utilisateurs et Permissions](gestion-utilisateurs.md)
- [Gestion Clients et Entreprises](gestion-clients-entreprises.md)
- [Création et Gestion des Devis](gestion-devis.md)
- [Dépannage et FAQ](depannage-faq.md)

#### **📧 Contacts utiles**
- **Support technique** : s.jacques@madin-ia.com
- **Questions métier** : [Responsable commercial]
- **Formation** : [Responsable formation]

---

## 🎉 Félicitations !

Vous êtes maintenant prêt(e) à utiliser le Dashboard Madinia efficacement. 

### 🚀 Étapes suivantes recommandées :
1. **Sécurisez votre compte** en changeant votre mot de passe
2. **Explorez le tableau de bord** pour comprendre l'activité actuelle
3. **Consultez les modules** correspondant à votre rôle
4. **Créez votre premier devis** de test pour vous familiariser

> 💡 **Conseil** : N'hésitez pas à expérimenter avec des données de test avant de travailler sur de vrais clients. Le système est robuste et vous guidera à chaque étape.

---

*Guide créé le : [Date]*  
*Dernière mise à jour : [Date]*  
*Version : 1.0* 