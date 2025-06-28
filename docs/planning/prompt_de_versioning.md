# Prompt de Versioning Laravel - Routine de Développement

## Instructions pour Cursor

Effectue la routine complète de versioning pour mon projet Laravel en suivant ces étapes dans l'ordre :

### 1. Analyse de l'historique
- Remonte dans l'historique Git jusqu'à la dernière modification du fichier `CHANGELOG.md`
- Identifie tous les commits depuis cette dernière modification
- Analyse également l'historique de notre conversation pour identifier les modifications récentes

### 2. Génération de la nouvelle version
- Lis la version actuelle dans `package.json`
- Détermine le type de version à créer (patch, minor, major) selon les modifications
- Incrémente la version appropriée

### 3. Mise à jour du CHANGELOG
- Crée une nouvelle entrée dans `CHANGELOG.md` avec :
  - La nouvelle version et la date
  - Liste des **Ajouts** (nouvelles fonctionnalités)
  - Liste des **Modifications** (améliorations)
  - Liste des **Corrections** (bug fixes)  
  - Liste des **Suppressions** (si applicable)

### 4. Mise à jour de package.json
- Modifie la version dans `package.json` avec la nouvelle version

### 5. Vérification du code
Exécute dans l'ordre :
```bash
npm run lint:fix
composer pint
composer pint:check
composer pint:dirty
```
- Si des erreurs sont détectées, les corriger avant de continuer
- Vérifier que tous les tests de style passent

### 6. Commit et Push
- Faire un commit avec le message : `chore: bump version to vX.X.X`
- Push les modifications vers le repository

### Format attendu du CHANGELOG
```markdown
## [X.X.X] - YYYY-MM-DD

### Ajoutés
- Nouvelle fonctionnalité A
- Nouvelle fonctionnalité B

### Modifiés
- Amélioration de la fonctionnalité C
- Optimisation de D

### Corrigés
- Correction du bug E
- Fix de F

### Supprimés
- Suppression de la fonctionnalité obsolète G
```

---

**Note importante** : Vérifie bien que tous les linters passent avant de faire le commit. En cas d'erreur dans les vérifications de code, corrige-les et relance les vérifications.

Procède maintenant à cette routine complète.