# Module 7 : Système d'Emails et Templates

## Introduction

Le système d'emails et templates du Dashboard Madinia permet de gérer et personnaliser tous les emails envoyés aux clients. Ce module vous permet de créer, modifier et organiser vos templates d'emails avec un système de variables dynamiques et de catégorisation.

## Structure des Templates

### Informations de Base
- **Nom** : Nom du template
- **Catégorie** : Type d'email (envoi initial, rappel, relance, confirmation)
- **Sous-catégorie** : Style spécifique du template
- **Sujet** : Objet de l'email
- **Corps** : Contenu de l'email
- **Description** : Description détaillée du template
- **Statut** : Actif/Inactif
- **Par défaut** : Template par défaut pour sa catégorie

### Catégories Disponibles
1. **Envoi initial de devis**
   - Promotionnel
   - Concis et direct
   - Standard professionnel
   - Détaillé avec étapes
   - Personnalisé et chaleureux

2. **Rappel de devis**
   - Rappel avec offre spéciale
   - Rappel avec date d'expiration
   - Rappel standard

3. **Relance de devis**
   - Suivi standard
   - Suivi avec ajustements possibles
   - Suivi avec demande de feedback

4. **Confirmation de devis accepté**
   - Confirmation avec demande d'informations
   - Confirmation avec étapes suivantes
   - Confirmation standard

## Variables Disponibles

### Variables Générales
- `{client_nom}` : Nom du client
- `{entreprise_nom}` : Nom de l'entreprise
- `{contact_nom}` : Nom du contact
- `{contact_email}` : Email du contact
- `{contact_telephone}` : Téléphone du contact

### Variables Devis
- `{devis_numero}` : Numéro du devis
- `{devis_montant}` : Montant du devis
- `{devis_date}` : Date de création
- `{devis_validite}` : Date de validité

### Variables Facture
- `{facture_numero}` : Numéro de la facture
- `{facture_montant}` : Montant de la facture
- `{facture_date}` : Date de création
- `{facture_echeance}` : Date d'échéance

## Gestion des Templates

### Création d'un Template
1. Accédez à la page "Modèles d'Email"
2. Cliquez sur "Nouveau Template"
3. Remplissez les champs obligatoires :
   - Nom du template
   - Catégorie et sous-catégorie
   - Sujet de l'email
   - Corps du message
4. Ajoutez une description (optionnel)
5. Définissez le statut (actif/inactif)
6. Choisissez si c'est le template par défaut
7. Cliquez sur "Créer"

### Modification d'un Template
1. Accédez à la liste des templates
2. Cliquez sur le template à modifier
3. Cliquez sur "Modifier"
4. Mettez à jour les informations nécessaires
5. Cliquez sur "Enregistrer"

### Duplication de Template
1. Accédez à la fiche du template
2. Cliquez sur "Dupliquer"
3. Un nouveau template est créé avec :
   - Le même nom + "(Copie)"
   - Statut inactif par défaut
   - Non défini comme template par défaut

### Définition comme Template par Défaut
1. Accédez à la fiche du template
2. Cliquez sur "Définir comme par défaut"
3. Le template devient le modèle par défaut pour sa catégorie
4. Les autres templates de la même catégorie perdent leur statut par défaut

## Prévisualisation et Test

### Prévisualisation
1. Accédez à la fiche du template
2. Cliquez sur "Prévisualiser"
3. Le template s'affiche avec des données de test
4. Vous pouvez modifier les données de test pour voir différents scénarios

### Données de Test
- Client fictif : M. Dupont
- Entreprise : Votre Entreprise
- Devis : DEV-2023-001
- Montant : 1 250,00 €
- Dates : Date actuelle et +30 jours
- Contact : Jean Martin

## Utilisation dans l'Application

### Envoi de Devis
1. Dans le formulaire d'envoi de devis
2. Sélectionnez la catégorie d'email
3. Choisissez un template spécifique ou utilisez le par défaut
4. Les variables sont automatiquement remplacées
5. Envoyez l'email

### Envoi de Factures
1. Dans le formulaire d'envoi de facture
2. Sélectionnez la catégorie d'email
3. Choisissez un template spécifique ou utilisez le par défaut
4. Les variables sont automatiquement remplacées
5. Envoyez l'email

## Bonnes Pratiques

### Organisation
- Utilisez des noms clairs et descriptifs
- Maintenez les descriptions à jour
- Désactivez les templates obsolètes
- Gardez un template par défaut par catégorie

### Contenu
- Testez les templates avec différents scénarios
- Vérifiez le rendu sur mobile
- Gardez un ton professionnel
- Incluez toujours les informations essentielles

### Variables
- Utilisez les variables disponibles
- Testez avec des données réelles
- Vérifiez le format des dates et montants
- Ajoutez des variables personnalisées si nécessaire

## Export et Import

### Export des Templates
1. Accédez à la page "Modèles d'Email"
2. Cliquez sur "Exporter"
3. Choisissez le format (JSON)
4. Téléchargez le fichier

### Import de Templates
1. Accédez à la page "Modèles d'Email"
2. Cliquez sur "Importer"
3. Sélectionnez le fichier
4. Vérifiez les données
5. Confirmez l'import

## Sécurité et Permissions

### Niveaux d'Accès
- **Lecture** : Consultation des templates
- **Écriture** : Création/modification de templates
- **Administration** : Gestion complète (activation/désactivation, par défaut)

### Restrictions
- Impossible de supprimer un template par défaut
- Modification des templates tracée dans l'historique
- Validation des variables avant enregistrement

## Support et Assistance

### Ressources Disponibles
- Guide d'utilisation détaillé
- Tutoriels vidéo
- Support technique
- FAQ

### Contact
Pour toute question concernant les Templates d'Email :
- Support technique : support@madinia.fr
- Téléphone : +33 1 23 45 67 89
- Horaires : 9h-18h (Lun-Ven) 
