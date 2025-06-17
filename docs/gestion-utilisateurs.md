# 👥 Gestion des Utilisateurs et Permissions
## Dashboard Madinia - Documentation Super Administrateurs

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Accéder à la gestion des utilisateurs](#accéder-à-la-gestion-des-utilisateurs)
3. [Créer un nouvel utilisateur](#créer-un-nouvel-utilisateur)
4. [Modifier un utilisateur existant](#modifier-un-utilisateur-existant)
5. [Gestion des rôles et permissions](#gestion-des-rôles-et-permissions)
6. [Sécurité et bonnes pratiques](#sécurité-et-bonnes-pratiques)
7. [Gestion des profils et avatars](#gestion-des-profils-et-avatars)
8. [Suppression d'utilisateurs](#suppression-dutilisateurs)

---

## 🎯 Vue d'ensemble

> ⚠️ **Attention** : Cette section est **réservée aux Super Administrateurs** uniquement. Seuls les utilisateurs avec le rôle "Super Administrateur" peuvent gérer les comptes utilisateurs.

La gestion des utilisateurs vous permet de :
- **Créer** de nouveaux comptes utilisateurs
- **Modifier** les informations et rôles existants
- **Configurer** les permissions selon les fonctions
- **Superviser** l'activité des administrateurs
- **Maintenir** la sécurité du système

### 🔐 Qui peut gérer les utilisateurs ?

**Super Administrateurs uniquement :**
- Peuvent créer, modifier et supprimer tous les utilisateurs
- Peuvent changer les rôles et permissions
- Ont accès à toutes les fonctionnalités de gestion

**Administrateurs :**
- Peuvent voir la liste des utilisateurs (lecture seule)
- Ne peuvent pas modifier les comptes ou rôles
- Peuvent uniquement gérer leur propre profil

**Gestionnaires :**
- N'ont pas accès à la gestion des utilisateurs
- Peuvent uniquement gérer leur propre profil

---

## 🚪 Accéder à la gestion des utilisateurs

### 📍 Navigation

1. **Connectez-vous** avec un compte Super Administrateur
2. **Cliquez sur "Utilisateurs"** dans le menu latéral gauche
3. **Vous arrivez** sur la page de gestion des utilisateurs

### 📊 Interface principale

L'interface de gestion des utilisateurs affiche :

```
┌─────────────────────────────────────────────────────────┐
│ 🏆 Gestion des utilisateurs                             │
│ X utilisateurs au total                                 │
│                               [+ Nouvel utilisateur]   │
├─────────────────────────────────────────────────────────┤
│ 📋 Liste des utilisateurs                              │
│                                                         │
│ Utilisateur    | Email              | Rôle     | Actions│
│ ─────────────────────────────────────────────────────── │
│ 👤 Jean Dupont | jean@madinia.com  | Admin    | ⋯      │
│ 👤 Marie L.    | marie@madinia.com | S.Admin  | ⋯      │
│ 👤 Paul M.     | paul@madinia.com  | Admin    | ⋯      │
│                                                         │
│                        [Pagination]                    │
└─────────────────────────────────────────────────────────┘
```

### 🎨 Éléments de l'interface

#### **👤 Avatar coloré**
- **Violet** : Super Administrateur
- **Bleu** : Administrateur
- **Lettre** : Première lettre du prénom

#### **🏷️ Badges de rôle**
- **Super Administrateur** : Badge violet
- **Administrateur** : Badge bleu

#### **⚙️ Menu Actions (⋯)**
- **👁️ Voir** : Consulter le profil complet
- **✏️ Modifier** : Éditer les informations
- **🗑️ Supprimer** : Supprimer le compte (avec confirmation)

---

## ➕ Créer un nouvel utilisateur

### 🚀 Démarrer la création

1. **Cliquez sur "Nouvel utilisateur"** (bouton bleu en haut à droite)
2. **Remplissez le formulaire** de création
3. **Configurez les permissions** appropriées
4. **Enregistrez** le nouveau compte

### 📝 Formulaire de création

#### **Informations obligatoires**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Nom complet** | Prénom et nom de l'utilisateur | `Jean Dupont` |
| **Adresse email** | Email professionnel (unique) | `jean.dupont@madinia.com` |
| **Mot de passe** | Minimum 8 caractères | `MotDePasse123!` |
| **Confirmer mot de passe** | Répétition pour validation | `MotDePasse123!` |
| **Rôle** | Super Admin ou Administrateur | `Administrateur` |

#### **Informations optionnelles**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Téléphone** | Numéro de contact | `01 23 45 67 89` |
| **Adresse** | Adresse postale | `123 Rue de la Tech` |
| **Code postal** | Code postal | `75001` |
| **Ville** | Ville de résidence | `Paris` |
| **Pays** | Pays | `France` |

### ✅ Validation et création

#### **Vérifications automatiques**
- **Email unique** : L'email ne doit pas déjà exister
- **Mot de passe fort** : Minimum 8 caractères
- **Champs obligatoires** : Tous les champs requis remplis

#### **Après création réussie**
- ✅ **Notification de succès** : "Utilisateur créé avec succès"
- 📧 **Email automatique** : L'utilisateur reçoit ses identifiants
- 🔄 **Redirection** : Retour à la liste des utilisateurs
- 👤 **Nouveau compte** : Visible immédiatement dans la liste

### 💡 Bonnes pratiques pour la création

#### **🎯 Conventions de nommage**
- **Email** : `prenom.nom@madinia.com`
- **Nom complet** : `Prénom NOM`
- **Cohérence** : Respecter la même structure

#### **🔐 Sécurité des mots de passe**
- **Temporaire fort** : `password123` puis changement obligatoire
- **Complexité** : Majuscules, minuscules, chiffres, symboles
- **Unique** : Ne pas réutiliser de mots de passe

#### **📋 Attribution des rôles**
- **Administrateur** : Pour la majorité des utilisateurs
- **Super Administrateur** : Uniquement pour les responsables IT/dirigeants
- **Principe du moindre privilège** : Donner les permissions minimales nécessaires

---

## ✏️ Modifier un utilisateur existant

### 🎯 Accéder à la modification

1. **Trouvez l'utilisateur** dans la liste
2. **Cliquez sur les actions (⋯)** à droite de la ligne
3. **Sélectionnez "Modifier"**
4. **Le formulaire d'édition** s'ouvre

### 📝 Formulaire de modification

Le formulaire de modification contient les mêmes champs que la création, avec quelques spécificités :

#### **Champs modifiables**
- ✅ **Nom complet**
- ✅ **Adresse email** (doit rester unique)
- ✅ **Téléphone, adresse, ville, pays**
- ✅ **Rôle** (Super Admin uniquement)

#### **Mot de passe**
- **Laisser vide** : Conserver le mot de passe actuel
- **Remplir** : Définir un nouveau mot de passe
- **Confirmation** : Obligatoire si modification

### 🔄 Changement de rôle

#### **Restrictions importantes**
- ⚠️ **Dernier Super Admin** : Impossible de changer le rôle du dernier Super Administrateur
- 🔒 **Auto-protection** : Empêche l'auto-verrouillage du système
- ✅ **Validation** : Confirmation requise pour les changements de rôle

#### **Processus de changement**
1. **Sélectionnez le nouveau rôle** dans le menu déroulant
2. **Confirmez** le changement
3. **Validation automatique** : Le système vérifie les contraintes
4. **Application immédiate** : Le nouveau rôle est actif instantanément

---

## 🔐 Gestion des rôles et permissions

### 🎭 Système de rôles

Le dashboard utilise un système de rôles à **3 niveaux** :

#### **🔴 Super Administrateur**
**Permissions complètes :**
- ✅ Gestion des utilisateurs (CRUD complet)
- ✅ Configuration système avancée
- ✅ Outils de maintenance et monitoring
- ✅ Toutes les fonctionnalités métier
- ✅ Accès aux données sensibles

**Responsabilités :**
- Gestion des comptes et permissions
- Maintenance technique du système
- Configuration des paramètres avancés
- Supervision générale

#### **🟠 Administrateur**
**Permissions métier étendues :**
- ✅ Gestion complète clients/entreprises
- ✅ Création et gestion devis/factures
- ✅ Configuration des services et emails
- ✅ Accès aux statistiques et rapports
- ❌ Gestion des utilisateurs (lecture seule)
- ❌ Configuration système

**Responsabilités :**
- Gestion commerciale quotidienne
- Relation client et facturation
- Configuration des templates métier
- Reporting et analyses

#### **🟢 Gestionnaire**
**Permissions opérationnelles :**
- ✅ Gestion des clients assignés
- ✅ Création de devis et factures
- ✅ Consultation du catalogue services
- ✅ Envoi d'emails clients
- ❌ Configuration avancée
- ❌ Gestion d'autres utilisateurs

**Responsabilités :**
- Activité commerciale de base
- Suivi des clients assignés
- Création de documents commerciaux
- Communication client

### 🔄 Attribution et modification des rôles

#### **Stratégies d'attribution**

**Nouveau collaborateur :**
1. **Commencer par "Gestionnaire"**
2. **Formation et accompagnement**
3. **Évaluation des besoins**
4. **Évolution vers "Administrateur" si nécessaire**

**Responsable d'équipe :**
1. **Rôle "Administrateur"**
2. **Accès aux statistiques complètes**
3. **Gestion étendue des données**

**Dirigeant/IT :**
1. **Rôle "Super Administrateur"**
2. **Accès complet au système**
3. **Responsabilité de la maintenance**

### 🛡️ Sécurité des permissions

#### **Principe du moindre privilège**
- Attribuer uniquement les permissions nécessaires
- Réévaluer régulièrement les besoins
- Supprimer les accès non utilisés

#### **Séparation des responsabilités**
- Administrateurs métier ≠ Administrateurs système
- Contrôles multiples pour les actions critiques
- Traçabilité des modifications importantes

---

## 🔒 Sécurité et bonnes pratiques

### 🎯 Politique de mots de passe

#### **Exigences minimales**
- **Longueur** : Minimum 8 caractères
- **Complexité** : Majuscules + minuscules + chiffres
- **Unicité** : Différent des mots de passe précédents
- **Expiration** : Changement recommandé tous les 6 mois

#### **Mots de passe temporaires**
Pour les nouveaux utilisateurs :
- **Temporaire** : `password123` (à changer immédiatement)
- **Communication sécurisée** : Transmission par canal sécurisé
- **Changement obligatoire** : À la première connexion

### 🔐 Gestion des accès

#### **Révision périodique**
- **Mensuelle** : Vérification des comptes actifs
- **Trimestrielle** : Révision des rôles et permissions
- **Annuelle** : Audit complet des accès

#### **Suppression des comptes inactifs**
- **Départ d'employé** : Suppression immédiate
- **Inactivité prolongée** : Désactivation après 90 jours
- **Comptes de test** : Nettoyage régulier

### 🚨 Procédures d'urgence

#### **Compromission de compte**
1. **Immédiat** : Changement du mot de passe
2. **Vérification** : Contrôle des activités récentes
3. **Communication** : Information des autres administrateurs
4. **Documentation** : Traçabilité de l'incident

#### **Protection du dernier Super Admin**
- **Interdiction** : Suppression du dernier compte Super Admin
- **Sauvegarde** : Toujours maintenir au moins 2 Super Admins
- **Procédure** : Process de récupération en cas de perte

---

## 🎨 Gestion des profils et avatars

### 👤 Informations de profil

#### **Données personnelles**
Chaque utilisateur peut gérer :
- **Nom et prénom**
- **Email professionnel**
- **Téléphone de contact**
- **Adresse complète**

#### **Photo de profil / Avatar**
- **Upload d'image** : JPG, PNG, GIF (max 2MB)
- **Avatar automatique** : Initiales si pas d'image
- **Couleur** : Basée sur le rôle (violet/bleu)

### ✏️ Modification de profil

#### **Par l'utilisateur lui-même**
Via le menu utilisateur (coin supérieur droit) :
1. **Clic sur l'avatar** ou le nom
2. **Sélection "Profil"**
3. **Modification des champs autorisés**
4. **Sauvegarde** des changements

#### **Par un Super Administrateur**
Via la gestion des utilisateurs :
1. **Accès au formulaire complet**
2. **Modification de tous les champs**
3. **Changement de rôle possible**
4. **Réinitialisation du mot de passe**

---

## 🗑️ Suppression d'utilisateurs

### ⚠️ Considérations importantes

La suppression d'un utilisateur est une **action irréversible** qui :
- **Supprime définitivement** le compte
- **Conserve les données** créées par cet utilisateur (devis, factures, etc.)
- **Met à jour les références** vers "Utilisateur supprimé"

### 🚨 Restrictions de sécurité

#### **Dernier Super Administrateur**
- ❌ **Impossible** de supprimer le dernier Super Admin
- 🛡️ **Protection** contre l'auto-verrouillage
- ✅ **Alternative** : Créer d'abord un autre Super Admin

#### **Utilisateur avec données**
- ⚠️ **Avertissement** : "Cet utilisateur a créé X devis et Y factures"
- 🔄 **Conservation** : Les documents restent accessibles
- 📝 **Attribution** : Les futurs documents ne pourront plus être créés

### 📋 Processus de suppression

#### **Étapes recommandées**
1. **Vérification** : S'assurer que la suppression est nécessaire
2. **Sauvegarde** : Exporter les données importantes si besoin
3. **Communication** : Informer l'équipe du changement
4. **Action** : Procéder à la suppression
5. **Vérification** : Contrôler que les données métier sont préservées

#### **Interface de suppression**
1. **Menu actions (⋯)** sur la ligne de l'utilisateur
2. **Clic sur "Supprimer"** (icône corbeille rouge)
3. **Fenêtre de confirmation** : `Êtes-vous sûr de vouloir supprimer l'utilisateur "Nom" ?`
4. **Validation** : Clic sur "Confirmer"
5. **Notification** : "Utilisateur supprimé avec succès"

### 🔄 Alternatives à la suppression

#### **Changement de rôle**
Au lieu de supprimer, considérer :
- **Rétrograder** vers un rôle inférieur
- **Gestionnaire** → **Lecture seule** (si cette fonctionnalité existe)

#### **Désactivation temporaire**
Pour les absences prolongées :
- **Changement de mot de passe** (non communiqué)
- **Documentation** de la désactivation temporaire
- **Réactivation** lors du retour

---

## ✅ Checklist Super Administrateur

### 🎯 Tâches hebdomadaires
- [ ] Vérifier les nouveaux comptes créés
- [ ] Contrôler les connexions inhabituelles
- [ ] Valider les changements de rôles récents

### 📅 Tâches mensuelles
- [ ] Révision complète de la liste des utilisateurs
- [ ] Vérification des comptes inactifs
- [ ] Mise à jour des informations de contact

### 🔍 Tâches trimestrielles
- [ ] Audit des permissions et rôles
- [ ] Nettoyage des comptes de test
- [ ] Révision des procédures de sécurité

### 📊 Tâches annuelles
- [ ] Audit de sécurité complet
- [ ] Mise à jour des politiques d'accès
- [ ] Formation des nouveaux Super Admins

---

## 🆘 Résolution de problèmes

### ❗ Problèmes courants

#### **"Impossible de supprimer le dernier Super Admin"**
**Solution :**
1. Créer un nouveau compte Super Admin
2. Attendre la validation
3. Procéder à la suppression

#### **"Email déjà utilisé"**
**Solution :**
1. Vérifier dans la liste des utilisateurs
2. Contacter l'utilisateur existant
3. Utiliser un email différent

#### **"Erreur lors de la création"**
**Solution :**
1. Vérifier tous les champs obligatoires
2. Contrôler la complexité du mot de passe
3. Tester avec un email différent

### 📞 Obtenir de l'aide

#### **Support technique**
- **Email** : s.jacques@madin-ia.com
- **Urgence** : Contacter directement le développeur
- **Documentation** : Consulter le [Dépannage et FAQ](depannage-faq.md)

---

## 🎉 Résumé

En tant que **Super Administrateur**, vous maîtrisez maintenant :

✅ **Création** de nouveaux comptes utilisateurs  
✅ **Modification** des informations et rôles  
✅ **Attribution** des permissions appropriées  
✅ **Sécurisation** des accès au système  
✅ **Maintenance** de la base d'utilisateurs  

### 🚀 Prochaines étapes
1. **Pratiquer** avec des comptes de test
2. **Former** d'autres Super Admins si nécessaire
3. **Mettre en place** les procédures de révision
4. **Consulter** les autres modules de documentation

---

*Guide créé le : [Date]*  
*Dernière mise à jour : [Date]*  
*Version : 1.0* 