# 🔄 Routine de Versioning - Dashboard Madinia

## 📋 Vue d'ensemble

Cette routine standardise le processus de versioning pour maintenir la cohérence, la traçabilité et la qualité des releases du Dashboard Madinia. Elle s'applique à tous les environnements de développement et de production.

---

## 🎯 Objectifs du Versioning

### **Traçabilité**
- Historique complet des modifications
- Identification claire des responsables
- Lien entre fonctionnalités et versions

### **Qualité**
- Validation systématique avant release
- Tests de régression automatisés
- Documentation synchronisée

### **Communication**
- Changelog automatique et lisible
- Notifications équipe et stakeholders
- Planning de déploiement transparent

---

## 📊 Stratégie de Versioning

### **Semantic Versioning (SemVer)**

Nous suivons le standard [SemVer 2.0.0](https://semver.org/) :

```
MAJOR.MINOR.PATCH-PRE_RELEASE+BUILD_METADATA
```

#### **Exemples concrets :**
- `v1.0.0` - Release initiale de production
- `v1.1.0` - Nouvelle fonctionnalité (ajout module factures)
- `v1.1.1` - Correction bug (fix calcul TVA)
- `v1.2.0-beta.1` - Version beta avec nouvelles fonctionnalités
- `v1.1.1-hotfix.1+build.123` - Hotfix critique avec métadonnées

### **Règles d'incrémentation :**

| Type de modification | Version | Exemples |
|---------------------|---------|----------|
| **Breaking Changes** | MAJOR | Refonte architecture, suppression APIs |
| **Nouvelles fonctionnalités** | MINOR | Nouveau module, nouvelle API endpoint |
| **Corrections de bugs** | PATCH | Fix calculs, corrections UI |
| **Versions de test** | PRE-RELEASE | alpha.1, beta.2, rc.1 |

---

## 🚀 Cycle de Release

### **Planning Trimestriel**

#### **Q1 2025 :**
- `v1.1.0` - Module Email Templates finalisé
- `v1.1.1` - Optimisations performance
- `v1.2.0` - Conformité e-facture 2026

#### **Q2 2025 :**
- `v1.3.0` - Paiements en ligne intégrés
- `v1.4.0` - API REST publique
- `v1.4.1` - Tests E2E complets

#### **Q3-Q4 2025 :**
- `v2.0.0` - Évolution SaaS multi-tenant
- `v2.1.0` - Application mobile
- `v2.2.0` - IA génération devis

### **Types de Releases :**

| Type | Fréquence | Objectif | Exemples |
|------|-----------|----------|----------|
| **Major** | Trimestrielle | Évolutions majeures | v1.0.0 → v2.0.0 |
| **Minor** | Mensuelle | Nouvelles fonctionnalités | v1.1.0 → v1.2.0 |
| **Patch** | Hebdomadaire | Corrections et améliorations | v1.1.0 → v1.1.1 |
| **Hotfix** | À la demande | Corrections critiques | v1.1.1-hotfix.1 |

---

## 🔄 Processus de Release

### **1. Préparation (J-7)**
```bash
# Création de la branche release
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Mise à jour des versions
npm version minor --no-git-tag-version
composer show --latest

# Tests complets
npm run test:full
php artisan test --coverage
```

### **2. Validation (J-3)**
```bash
# Tests d'intégration
npm run test:e2e
php artisan test:integration

# Vérification documentation
npm run docs:build
npm run docs:test

# Review sécurité
npm audit
composer audit
```

### **3. Release (J-0)**
```bash
# Merge vers main
git checkout main
git merge release/v1.2.0 --no-ff

# Tag et signature
git tag -s v1.2.0 -m "Release v1.2.0: Module Email Templates"
git push origin v1.2.0

# Déploiement production
npm run deploy:production
```

### **4. Post-Release (J+1)**
```bash
# Merge vers develop
git checkout develop
git merge main --no-ff

# Nettoyage
git branch -d release/v1.2.0
git push origin --delete release/v1.2.0

# Monitoring
npm run monitoring:post-release
```

---

## 📝 Standards de Documentation

### **Changelog Automatique**

Le changelog est généré automatiquement depuis les commits suivant [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### **Types standardisés :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Formatage, point-virgules, etc.
- `refactor`: Refactorisation sans changement fonctionnel
- `perf`: Amélioration de performance
- `test`: Ajout ou modification de tests
- `chore`: Maintenance, dépendances, etc.

#### **Exemples :**
```bash
feat(factures): ajouter paiements en ligne Stripe
fix(devis): corriger calcul TVA pour montants décimaux
docs(api): mettre à jour documentation endpoints
perf(dashboard): optimiser requêtes avec cache Redis
```

### **Release Notes**

Chaque release génère automatiquement :

```markdown
# Release v1.2.0 - Email Templates & Performance

## 🚀 Nouvelles Fonctionnalités
- Module Email Templates complet avec éditeur WYSIWYG
- Cache Redis pour optimisation performance (+40% vitesse)
- API endpoints pour gestion templates

## 🐛 Corrections
- Fix calcul TVA pour montants décimaux
- Correction génération PDF avec caractères spéciaux
- Résolution timeout lors d'envois emails groupés

## 🔧 Améliorations
- Interface utilisateur plus responsive
- Logs centralisés avec rotation automatique
- Tests unitaires couverture 85%

## 📚 Documentation
- Guide complet Email Templates
- API documentation OpenAPI 3.0
- Tutoriels vidéo pour admins

## ⚠️ Breaking Changes
Aucun breaking change dans cette version

## 🔄 Migration
Aucune migration manuelle requise
```

---

## 🎯 Métriques et KPIs

### **Métriques de Qualité**
- **Couverture de tests** : > 80%
- **Bugs critiques** : 0 en production
- **Temps de build** : < 10 minutes
- **Temps de déploiement** : < 5 minutes

### **Métriques de Performance**
- **Temps de chargement** : < 2 secondes
- **Disponibilité** : > 99.9%
- **Temps de réponse API** : < 200ms
- **Satisfaction utilisateur** : NPS > 70

### **Métriques de Processus**
- **Lead time** : Idée → Production < 2 semaines
- **Cycle time** : Dev → Production < 3 jours
- **MTTR (Mean Time To Recovery)** : < 1 heure
- **Fréquence de déploiement** : Multiple/semaine

---

## 🚨 Gestion des Urgences

### **Processus Hotfix**

Pour les corrections critiques en production :

```bash
# 1. Création branche hotfix depuis main
git checkout main
git checkout -b hotfix/v1.1.2-critical-security-fix

# 2. Développement et tests express
# ... fix du problème ...
npm run test:critical
php artisan test --group=critical

# 3. Release express
git checkout main
git merge hotfix/v1.1.2-critical-security-fix
git tag v1.1.2
npm run deploy:production:emergency

# 4. Communication immédiate
slack-notify "🚨 Hotfix v1.1.2 déployé - Correction sécurité critique"
```

### **Critères Hotfix :**
- Faille de sécurité critique
- Perte de données utilisateur
- Indisponibilité totale du service
- Bug affectant > 80% des utilisateurs

---

## 📞 Responsabilités

### **Product Owner**
- Validation fonctionnelle des releases
- Priorisation des corrections
- Communication vers les stakeholders

### **Tech Lead**
- Architecture et cohérence technique
- Validation des pull requests critiques
- Décision sur les breaking changes

### **DevOps**
- Automatisation du processus
- Monitoring post-déploiement
- Gestion des environnements

### **QA**
- Tests de régression complets
- Validation des critères d'acceptation
- Certification qualité releases

---

## 🔗 Outils et Intégrations

### **Outils de Versioning**
- **Git** : Gestion du code source
- **GitHub** : Collaboration et reviews
- **Semantic Release** : Automation versioning
- **Conventional Changelog** : Génération changelog

### **CI/CD Pipeline**
- **GitHub Actions** : Tests et builds automatisés
- **Docker** : Containerisation pour cohérence
- **Vercel** : Déploiement documentation
- **Monitoring** : Sentry, LogRocket pour observabilité

---

## 📅 Planning 2025

### **Objectifs Versioning Q1-Q4**

| Trimestre | Versions Cibles | Objectifs Clés |
|-----------|----------------|----------------|
| **Q1** | v1.1.0 - v1.2.0 | Finalisation documentation, performance |
| **Q2** | v1.3.0 - v1.4.0 | Paiements intégrés, API publique |
| **Q3** | v1.5.0 - v1.6.0 | Mobile app, facturation récurrente |
| **Q4** | v2.0.0 | Évolution SaaS multi-tenant |

### **Jalons Critiques**
- **Mars 2025** : Documentation 100% complète
- **Juin 2025** : API REST finalisée et documentée
- **Septembre 2025** : Application mobile en beta
- **Décembre 2025** : Version SaaS en production

---

*Dernière mise à jour : Janvier 2025*
*Prochaine révision : Avril 2025*