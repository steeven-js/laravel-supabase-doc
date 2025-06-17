# Module 6 : Catalogue de Services

## Introduction

Le Catalogue de Services est un élément central du Dashboard Madinia qui permet de gérer l'ensemble des services proposés par votre entreprise. Ce module vous permet de créer, modifier et organiser vos services de manière efficace, avec un système de codification automatique et une gestion des unités de mesure.

## Structure des Services

### Informations de Base
- **Nom** : Nom commercial du service
- **Code** : Code unique généré automatiquement (format : SRV-25-001)
- **Description** : Description détaillée du service
- **Prix HT** : Prix unitaire hors taxes
- **Quantité par défaut** : Quantité par défaut lors de l'ajout à un devis/facture
- **Unité** : Type d'unité de mesure (heure, journée, semaine, mois, unité, forfait, licence)
- **Statut** : Actif/Inactif

### Système de Codification
Le système génère automatiquement des codes uniques pour chaque service selon le format :
- Préfixe : SRV
- Année : 2 derniers chiffres (ex: 25)
- Numéro séquentiel : 3 chiffres (ex: 001)
- Exemple : SRV-25-001

## Gestion des Services

### Création d'un Service
1. Accédez à la page "Services"
2. Cliquez sur "Nouveau Service"
3. Remplissez les champs obligatoires :
   - Nom du service
   - Description
   - Prix HT
   - Quantité par défaut
   - Unité de mesure
4. Le code est généré automatiquement
5. Cliquez sur "Créer"

### Modification d'un Service
1. Accédez à la liste des services
2. Cliquez sur le service à modifier
3. Cliquez sur "Modifier"
4. Mettez à jour les informations nécessaires
5. Cliquez sur "Enregistrer"

### Désactivation/Activation
- Pour désactiver un service : Cliquez sur l'icône de désactivation
- Pour réactiver : Cliquez sur l'icône d'activation
- Les services inactifs n'apparaissent pas dans le catalogue client

### Duplication de Service
1. Accédez à la fiche du service
2. Cliquez sur "Dupliquer"
3. Un nouveau service est créé avec :
   - Le même nom + "(Copie)"
   - Un nouveau code unique
   - Statut inactif par défaut

## Utilisation dans les Devis et Factures

### Ajout à un Devis
1. Dans le formulaire de devis
2. Sélectionnez "Ajouter un service"
3. Choisissez dans le catalogue
4. La quantité par défaut est pré-remplie
5. Le prix est calculé automatiquement

### Ajout à une Facture
1. Dans le formulaire de facture
2. Sélectionnez "Ajouter un service"
3. Choisissez dans le catalogue
4. La quantité par défaut est pré-remplie
5. Le prix est calculé automatiquement

## Statistiques et Suivi

### Indicateurs Disponibles
- Nombre total de services
- Services actifs/inactifs
- Chiffre d'affaires total par service
- Quantité totale vendue
- Prix moyen de vente
- Dernière utilisation

### Historique des Modifications
- Suivi complet des modifications
- Utilisateur ayant effectué la modification
- Date et heure de modification
- Données avant/après modification

## Bonnes Pratiques

### Organisation
- Utilisez des noms clairs et descriptifs
- Maintenez les descriptions à jour
- Désactivez les services obsolètes plutôt que de les supprimer
- Utilisez les unités appropriées pour chaque service

### Prix et Quantités
- Vérifiez régulièrement les prix
- Ajustez les quantités par défaut selon l'usage
- Documentez les changements de prix importants

### Maintenance
- Révision régulière du catalogue
- Archivage des services inactifs
- Mise à jour des descriptions
- Vérification des statistiques d'utilisation

## Export et Import

### Export du Catalogue
1. Accédez à la page "Services"
2. Cliquez sur "Exporter"
3. Choisissez le format (JSON/CSV)
4. Téléchargez le fichier

### Import de Services
1. Accédez à la page "Services"
2. Cliquez sur "Importer"
3. Sélectionnez le fichier
4. Vérifiez les données
5. Confirmez l'import

## Sécurité et Permissions

### Niveaux d'Accès
- **Lecture** : Consultation du catalogue
- **Écriture** : Création/modification de services
- **Administration** : Gestion complète (activation/désactivation)

### Restrictions
- Impossible de supprimer un service utilisé dans des devis/factures
- Modification des prix tracée dans l'historique
- Validation des données avant enregistrement

## Support et Assistance

### Ressources Disponibles
- Guide d'utilisation détaillé
- Tutoriels vidéo
- Support technique
- FAQ

### Contact
Pour toute question concernant le Catalogue de Services :
- Support technique : support@madinia.fr
- Téléphone : +33 1 23 45 67 89
- Horaires : 9h-18h (Lun-Ven) 
