# 📊 Module 8 : Tableaux de Bord et Analytics

## Vue d'ensemble

Le tableau de bord de Madinia offre une vue complète de votre activité commerciale avec des statistiques en temps réel, des graphiques interactifs et des métriques clés pour piloter votre entreprise.

## 🎯 À quoi sert le tableau de bord ?

Le tableau de bord vous permet de :
- **Visualiser** vos performances commerciales en un coup d'œil
- **Analyser** l'évolution de votre activité par période
- **Identifier** les tendances et opportunités
- **Surveiller** les indicateurs critiques (retards, taux d'acceptation)
- **Accéder rapidement** aux actions courantes

---

## 🏠 Accéder au tableau de bord

### Navigation
1. **Connexion** → Le tableau de bord s'affiche automatiquement
2. **Menu principal** → Cliquer sur "Dashboard" dans la barre latérale
3. **Logo Madinia** → Cliquer sur le logo pour revenir au tableau de bord

> 💡 **Astuce** : Le tableau de bord est la page d'accueil par défaut après connexion.

---

## 🔍 Filtres temporels

### Sélection de période

Le système de filtres vous permet d'analyser vos données sur différentes périodes :

#### Types de filtres
- **Par mois** : Analyse mensuelle détaillée
- **Par année** : Vue d'ensemble annuelle

#### Comment filtrer ?

1. **Sélectionner le type de filtre** :
   - Dans la section "Période d'analyse"
   - Choisir "Mois" ou "Année" dans le menu déroulant

2. **Choisir l'année** :
   - Menu déroulant avec les 5 dernières années
   - Année actuelle sélectionnée par défaut

3. **Sélectionner le mois** (si filtre mensuel) :
   - Menu déroulant avec tous les mois
   - Mois actuel sélectionné par défaut

4. **Revenir au mois actuel** :
   - Bouton "Revenir au mois actuel" pour réinitialiser

### Exemples d'usage

| Objectif | Filtre recommandé |
|----------|-------------------|
| Analyser le mois en cours | Mois actuel |
| Comparer avec le mois précédent | Changer le mois |
| Bilan annuel | Filtre par année |
| Performance trimestrielle | Changer les mois du trimestre |

---

## 📈 Métriques principales

### 1. Clients totaux
- **Nombre** : Total des clients actifs
- **Détail** : Nombre d'entreprises associées
- **Couleur** : Bleu
- **Note** : Cette métrique n'est pas filtrée par période

### 2. Devis de la période
- **Nombre** : Total des devis pour la période sélectionnée
- **Détail** : Pourcentage de devis acceptés
- **Couleur** : Orange
- **Calcul** : (Devis acceptés ÷ Total devis) × 100

### 3. Factures de la période
- **Nombre** : Total des factures pour la période sélectionnée
- **Détail** : Pourcentage de factures payées
- **Couleur** : Vert
- **Calcul** : (Factures payées ÷ Total factures) × 100

### 4. Chiffre d'affaires
- **Montant** : CA total de la période (toutes factures)
- **Détail** : Montant réellement encaissé (factures payées)
- **Couleur** : Violet
- **Format** : Euros avec formatage français

### Interprétation des métriques

| Métrique | Bon indicateur | À surveiller |
|----------|----------------|--------------|
| Taux d'acceptation devis | > 60% | < 40% |
| Taux de paiement factures | > 80% | < 60% |
| Évolution du CA | Croissance régulière | Baisse continue |

---

## ⚠️ Alertes et notifications

### Alerte factures en retard

Une alerte rouge s'affiche automatiquement si des factures sont en retard de paiement :

#### Contenu de l'alerte
- **Icône** : Triangle d'avertissement rouge
- **Message** : "Attention aux retards de paiement"
- **Détail** : Nombre de factures en retard pour la période
- **Action** : Bouton "Voir les factures" → accès direct à la liste filtrée

#### Quand l'alerte apparaît-elle ?
- Dès qu'une ou plusieurs factures passent en statut "en_retard"
- Visible selon le filtre temporel sélectionné
- Mise à jour en temps réel

#### Actions recommandées
1. **Cliquer** sur "Voir les factures"
2. **Examiner** les factures en retard
3. **Contacter** les clients concernés
4. **Mettre à jour** les statuts après paiement

---

## 📊 Graphiques de répartition

### Graphique des devis (Camembert)

#### Informations affichées
- **Répartition** par statut des devis
- **Pourcentages** sur chaque segment
- **Couleurs** :
  - Gris : Brouillon
  - Bleu : Envoyé
  - Vert : Accepté
  - Rouge : Refusé
  - Orange : Expiré

#### Interprétation
- **Beaucoup de brouillons** → Finaliser et envoyer
- **Taux de refus élevé** → Revoir la stratégie tarifaire
- **Peu d'envoyés** → Améliorer le suivi client

#### État vide
Si aucun devis pour la période :
- Icône de document grisée
- Message "Aucun devis pour cette période"

### Graphique des factures (Camembert)

#### Informations affichées
- **Répartition** par statut des factures
- **Pourcentages** sur chaque segment
- **Couleurs** :
  - Jaune : Brouillon
  - Bleu : Envoyée
  - Vert : Payée
  - Rouge : En retard
  - Gris : Annulée

#### Interprétation
- **Trop de brouillons** → Finaliser et envoyer
- **Beaucoup en retard** → Relancer les clients
- **Bon taux de payées** → Excellente gestion

#### Actions depuis les graphiques
- **Bouton "Voir tous les devis"** → Accès à la liste complète
- **Bouton "Voir toutes les factures"** → Accès à la liste complète

---

## 📈 Graphique d'évolution annuelle

### Vue d'ensemble
- **Type** : Graphique en barres groupées
- **Période** : Année complète (janvier à décembre)
- **Données** : Nombre de devis et factures par mois

### Éléments du graphique

#### Barres
- **Orange** : Nombre de devis créés par mois
- **Vert** : Nombre de factures créées par mois

#### Axes
- **X (horizontal)** : Mois abrégés (Jan, Fév, Mar...)
- **Y (vertical)** : Nombre de documents

#### Fonctionnalités interactives
- **Survol** : Affichage des valeurs exactes
- **Légende** : Identification des types de barres
- **Grille** : Facilite la lecture des valeurs

### Interprétation des tendances

| Pattern observé | Signification | Action recommandée |
|----------------|---------------|-------------------|
| Croissance régulière | Développement sain | Maintenir le rythme |
| Pics saisonniers | Activité cyclique | Prévoir les ressources |
| Baisse continue | Problème commercial | Analyser les causes |
| Déséquilibre devis/factures | Problème de conversion | Améliorer le suivi |

---

## ⚡ Actions rapides

### Section "Actions rapides"

Interface permettant d'accéder directement aux actions courantes :

#### Actions principales (4 boutons)

1. **Nouveau client**
   - Icône : Plus bleu
   - Action : Création d'un nouveau client
   - Destination : `/clients/create`

2. **Nouvelle entreprise**
   - Icône : Bâtiment violet
   - Action : Création d'une nouvelle entreprise
   - Destination : `/entreprises/create`

3. **Nouveau devis**
   - Icône : Document orange
   - Action : Création d'un nouveau devis
   - Destination : `/devis/create`

4. **Nouvelle facture**
   - Icône : Reçu vert
   - Action : Création d'une nouvelle facture
   - Destination : `/factures/create`

#### Accès rapides (2 boutons)

1. **Clients** → Liste complète des clients
2. **Entreprises** → Liste complète des entreprises

### Utilisation recommandée
- **Workflow quotidien** : Créer rapidement les documents essentiels
- **Navigation express** : Éviter de passer par les menus
- **Productivité** : Actions les plus fréquentes en un clic

---

## 🔧 Fonctionnalités avancées

### Pour les Super Administrateurs

#### Boutons de développement (mode local uniquement)
Visibles seulement si :
- Application en mode local (développement)
- Utilisateur avec rôle "super_admin"

##### Actions disponibles
1. **Reset données** :
   - Conserve l'utilisateur connecté
   - Supprime toutes les données business
   - Utile pour les tests

2. **Reset tout** :
   - Suppression complète de la base
   - Attention : Action irréversible
   - Confirmation requise

#### Démonstration des toasts
- Section visible uniquement pour les super admins
- Test des notifications système
- Validation des composants UI

---

## 📱 Responsivité et affichage

### Adaptation mobile
- **Grilles flexibles** : Adaptation automatique selon la taille d'écran
- **Cartes empilées** : Réorganisation verticale sur mobile
- **Graphiques redimensionnés** : Taille optimisée pour chaque appareil

### Thème sombre
- **Adaptation automatique** : Respect des préférences système
- **Couleurs ajustées** : Lisibilité optimale dans tous les modes
- **Graphiques compatibles** : Couleurs adaptées au thème

---

## 🎯 Bonnes pratiques d'utilisation

### Routine quotidienne recommandée

1. **Matin** :
   - Vérifier le tableau de bord (mois en cours)
   - Examiner les alertes factures en retard
   - Consulter les métriques de performance

2. **Fin de semaine** :
   - Analyser l'évolution hebdomadaire
   - Comparer avec la semaine précédente
   - Planifier les actions de la semaine suivante

3. **Fin de mois** :
   - Bilan mensuel complet
   - Comparaison avec les mois précédents
   - Analyse des tendances annuelles

### Métriques à surveiller en priorité

| Fréquence | Métriques essentielles |
|-----------|------------------------|
| **Quotidienne** | Factures en retard, nouvelles activités |
| **Hebdomadaire** | Taux d'acceptation devis, évolution CA |
| **Mensuelle** | Performance globale, tendances |
| **Trimestrielle** | Croissance, objectifs |

### Signaux d'alerte

#### 🔴 Urgent
- Factures en retard > 10% du CA mensuel
- Taux d'acceptation devis < 30%
- Baisse de CA > 20% par rapport au mois précédent

#### 🟡 À surveiller
- Taux de paiement factures < 80%
- Trop de devis en brouillon (> 20%)
- Évolution CA stagnante

#### 🟢 Bon niveau
- Taux d'acceptation devis > 60%
- Factures payées > 85%
- Croissance CA régulière

---

## 🔄 Mise à jour des données

### Actualisation automatique
- **Temps réel** : Les données se mettent à jour à chaque rechargement
- **Navigation** : Retour au dashboard actualise les statistiques
- **Actions** : Création/modification met à jour immédiatement

### Actualisation manuelle
- **F5** ou **Ctrl+R** : Rechargement complet de la page
- **Navigation** : Cliquer sur "Dashboard" dans le menu
- **Logo** : Cliquer sur le logo Madinia

### Délai de mise à jour
- **Immédiat** : Nouvelles créations
- **< 1 minute** : Modifications de statut
- **Temps réel** : Filtres temporels

---

## ❓ Résolution de problèmes

### Problèmes courants

#### Les graphiques ne s'affichent pas
**Causes possibles** :
- Aucune donnée pour la période sélectionnée
- Problème de connexion réseau
- Erreur JavaScript

**Solutions** :
1. Vérifier la période sélectionnée
2. Actualiser la page (F5)
3. Changer de période pour tester
4. Vérifier la console développeur (F12)

#### Les statistiques semblent incorrectes
**Vérifications** :
1. Confirmer la période sélectionnée
2. Vérifier les filtres appliqués
3. Comparer avec les listes détaillées
4. Actualiser les données

#### L'alerte factures en retard ne disparaît pas
**Action** :
1. Vérifier les statuts des factures concernées
2. Mettre à jour les factures payées
3. Actualiser le tableau de bord

---

## 📚 Pour aller plus loin

### Modules complémentaires
- **Module 4** : Gestion des devis → Comprendre les statuts
- **Module 5** : Gestion des factures → Maîtriser le processus
- **Module 3** : Clients et entreprises → Analyser la base client

### Fonctionnalités avancées
- Export des données (à venir)
- Rapports personnalisés (à venir)
- Alertes configurables (à venir)

---

## 📞 Support et assistance

### En cas de problème
1. **Vérifier** ce guide de résolution de problèmes
2. **Consulter** le Module 10 (Dépannage et FAQ)
3. **Contacter** l'équipe technique si problème persistant

### Suggestions d'améliorations
Les retours sur les fonctionnalités du tableau de bord sont les bienvenus pour améliorer l'expérience utilisateur.

---

*Ce module fait partie de la documentation complète du Dashboard Madinia. Pour une formation complète, consultez l'ensemble des 10 modules disponibles.* 