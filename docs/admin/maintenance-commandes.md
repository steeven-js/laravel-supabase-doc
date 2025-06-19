# 🔧 Module 10 : Maintenance et Commandes Administratives

## Vue d'ensemble

Ce module final couvre tous les aspects de la maintenance technique du Dashboard Madinia. Il s'adresse principalement aux **super administrateurs** et au **support technique** pour assurer le bon fonctionnement de l'application.

## 🎯 À qui s'adresse ce module ?

- **🔑 Super Administrateurs** - Maintenance quotidienne et surveillance
- **👨‍💻 Support Technique** - Diagnostic avancé et résolution d'incidents
- **⚙️ DevOps** - Déploiement et optimisation système

---

## 🚀 Commandes essentielles de maintenance

### 📋 Vue d'ensemble des commandes

| Catégorie | Commande | Description | Fréquence |
|-----------|----------|-------------|-----------|
| **📧 Emails** | `mail:diagnose` | Diagnostic complet SMTP | Quotidienne |
| **📄 PDFs** | `devis:generate-pdfs` | Régénération des PDFs devis | Hebdomadaire |
| **🧾 Factures** | `factures:generate-pdfs` | Régénération des PDFs factures | Hebdomadaire |
| **🔄 Synchronisation** | `pdfs:sync-supabase` | Sync Supabase Storage | Quotidienne |
| **🧹 Nettoyage** | `optimize:clear` | Effacer tous les caches | Selon besoin |
| **🔍 Diagnostic** | `supabase:test` | Test connexion Supabase | Quotidienne |

---

## 📧 Maintenance des Emails

### Diagnostic complet SMTP

```bash
# Test de la configuration mail complète
php artisan mail:diagnose

# Test d'envoi à une adresse spécifique
php artisan mail:diagnose admin@madinia.com
```

**Résultats attendus :**
- ✅ Configuration SMTP affichée
- ✅ Test de connexion réussi
- ✅ Email de test envoyé

### Tests d'emails spécialisés

```bash
# Test email simple (sans pièce jointe)
php artisan email:test-simple destinataire@email.com

# Test email devis avec PDF
php artisan email:test-devis destinataire@email.com

# Test email facture
php artisan mail:test-facture destinataire@email.com --admin

# Test email production (complet)
php artisan email:test-production destinataire@email.com
```

### Résolution des problèmes emails

#### Problème : Emails non envoyés
```bash
# 1. Vérifier la configuration
php artisan mail:diagnose

# 2. Tester avec un email simple
php artisan email:test-simple test@madinia.com

# 3. Vérifier les logs
tail -f storage/logs/laravel.log
```

#### Problème : PDFs non attachés
```bash
# 1. Vérifier l'existence des PDFs
php artisan diagnostic:pdf-supabase

# 2. Régénérer si nécessaire
php artisan devis:generate-pdfs --force
```

---

## 📄 Maintenance des PDFs

### Génération et synchronisation

```bash
# Générer tous les PDFs manquants (devis)
php artisan devis:generate-pdfs

# Forcer la régénération complète
php artisan devis:generate-pdfs --force --sync-supabase

# Générer tous les PDFs factures
php artisan factures:generate-pdfs

# Synchronisation globale vers Supabase
php artisan pdfs:sync-supabase --force --generate
```

### Diagnostic PDF avancé

```bash
# Diagnostic pour un devis spécifique
php artisan diagnostic:pdf-supabase 123

# Diagnostic global de configuration
php artisan diagnostic:pdf-supabase

# Debug du stockage Supabase
php artisan debug:supabase-storage
```

### Nettoyage et optimisation

```bash
# Synchroniser avec statistiques
php artisan pdf:sync --stats

# Nettoyer les anciens PDFs (>30 jours)
php artisan pdf:sync --cleanup

# Mettre à jour les URLs Supabase
php artisan pdfs:update-urls --force
```

---

## 🗄️ Maintenance de la Base de Données

### Commandes de base

```bash
# Migrer la base de données
php artisan migrate

# Rollback de la dernière migration
php artisan migrate:rollback

# Statut des migrations
php artisan migrate:status

# Optimiser la base
php artisan db:optimize
```

### Seeders et données de test

```bash
# Réinitialiser avec données de base
php artisan migrate:fresh --seed

# Seeder spécifique
php artisan db:seed --class=ServiceSeeder

# Import depuis Firebase
php artisan firebase:import --fresh --force
```

### Vérifications d'intégrité

```bash
# Vérifier les services
php artisan check:services

# Rafraîchir les codes services
php artisan services:refresh-codes --dry-run
php artisan services:refresh-codes --force

# Mettre à jour les formats de codes
php artisan services:update-codes
```

---

## 🔄 Synchronisation et Cache

### Gestion du cache

```bash
# Vider tous les caches
php artisan optimize:clear

# Commandes spécifiques
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimiser pour la production
php artisan optimize
```

### Synchronisation Supabase

```bash
# Test de connexion Supabase
php artisan supabase:test

# Synchronisation globale PDFs
php artisan pdfs:sync-supabase

# Synchronisation par type
php artisan pdf:sync --type=devis
php artisan pdf:sync --type=factures
```

---

## 🔍 Monitoring et Diagnostic

### Interface de monitoring

L'application dispose d'une interface de monitoring accessible en mode développement :

**URL :** `/monitoring` (uniquement en environnement local)

**Fonctionnalités :**
- 📊 Statistiques générales
- 📧 Test des emails
- 🗄️ Vérification base de données
- 🧹 Effacement du cache
- 📋 Diagnostics système

### Commandes de diagnostic

```bash
# Diagnostic PDF Supabase
php artisan diagnostic:pdf-supabase

# Diagnostic configuration mail
php artisan mail:diagnose

# Test connexion Supabase
php artisan supabase:test

# Debug stockage Supabase
php artisan debug:supabase-storage
```

### Logs et surveillance

```bash
# Surveiller les logs en temps réel
tail -f storage/logs/laravel.log

# Logs avec filtre d'erreurs
grep -i "error" storage/logs/laravel.log

# Logs des dernières 24h
find storage/logs/ -name "laravel-*.log" -mtime -1 -exec cat {} \;
```

---

## ⚡ Procédures d'urgence

### Mode maintenance

```bash
# Activer le mode maintenance
php artisan down --secret="urgence-2025"

# Message personnalisé
php artisan down --message="Maintenance en cours - Retour dans 15 minutes"

# Désactiver le mode maintenance
php artisan up
```

### Restauration rapide

#### Problème : Application inaccessible

```bash
# 1. Vérifier les permissions
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/

# 2. Régénérer les clés
php artisan key:generate

# 3. Effacer tous les caches
php artisan optimize:clear

# 4. Redémarrer les services
sudo systemctl restart nginx
sudo systemctl restart php8.3-fpm
```

#### Problème : Base de données corrompue

```bash
# 1. Mode maintenance
php artisan down

# 2. Sauvegarde actuelle
pg_dump -h localhost -U user madinia > backup_urgence.sql

# 3. Restaurer depuis sauvegarde
psql -h localhost -U user madinia < backup_propre.sql

# 4. Migrer si nécessaire
php artisan migrate

# 5. Sortir du mode maintenance
php artisan up
```

#### Problème : PDFs tous cassés

```bash
# 1. Diagnostic global
php artisan diagnostic:pdf-supabase

# 2. Régénération forcée
php artisan devis:generate-pdfs --force
php artisan factures:generate-pdfs --force

# 3. Resynchronisation Supabase
php artisan pdfs:sync-supabase --force --generate

# 4. Vérification
php artisan supabase:test
```

---

## 🛠️ Optimisation des performances

### Cache et optimisation

```bash
# Optimisation complète pour production
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Effacement pour développement
php artisan optimize:clear
```

### Base de données

```bash
# Analyser les requêtes lentes
php artisan db:monitor

# Indexation (si disponible)
php artisan db:optimize

# Vacuum PostgreSQL (depuis le serveur)
VACUUM ANALYZE;
```

### Fichiers et stockage

```bash
# Nettoyer les anciens PDFs
php artisan pdf:sync --cleanup

# Statistiques de stockage
php artisan pdf:sync --stats

# Optimiser les images (si applicable)
php artisan media:optimize
```

---

## 🔐 Sécurité et Sauvegarde

### Sauvegardes automatisées

```bash
# Script de sauvegarde quotidienne
#!/bin/bash

# Variables
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/madinia"
DB_NAME="madinia"

# Sauvegarde base de données
pg_dump -h localhost -U user $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Sauvegarde fichiers
tar -czf $BACKUP_DIR/files_$DATE.tar.gz storage/ public/

# Nettoyer les anciennes sauvegardes (>7 jours)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Sauvegarde terminée : $DATE"
```

### Vérifications de sécurité

```bash
# Vérifier les permissions
find storage/ -type f -not -perm 644 -exec chmod 644 {} \;
find storage/ -type d -not -perm 755 -exec chmod 755 {} \;

# Vérifier la configuration
php artisan config:show

# Logs de sécurité
grep -i "unauthorized\|failed\|error" storage/logs/laravel.log
```

---

## 📊 Tableaux de bord de maintenance

### KPIs à surveiller quotidiennement

| Métrique | Commande | Seuil d'alerte |
|----------|----------|---------------|
| **Emails en échec** | `grep "failed" logs/` | > 5% |
| **PDFs manquants** | `pdf:sync --stats` | > 2% |
| **Erreurs 500** | `grep "ERROR" logs/` | > 10/jour |
| **Espace disque** | `df -h` | > 85% |
| **Connexions DB** | Monitoring DB | > 80% |

### Rapport de santé hebdomadaire

```bash
#!/bin/bash
echo "=== RAPPORT SANTÉ MADINIA ==="
echo "Date: $(date)"
echo ""

echo "📧 EMAILS:"
php artisan mail:diagnose | grep -E "(✅|❌)"

echo ""
echo "📄 PDFS:"
php artisan pdf:sync --stats

echo ""
echo "🗄️ BASE DE DONNÉES:"
php artisan db:show --counts

echo ""
echo "🔄 CACHE:"
php artisan cache:table

echo ""
echo "💾 STOCKAGE:"
df -h storage/

echo "=== FIN RAPPORT ==="
```

---

## 🎯 Checklist de maintenance

### Quotidienne ✅

- [ ] **Emails** : `php artisan mail:diagnose`
- [ ] **PDFs** : `php artisan pdf:sync --stats`
- [ ] **Logs** : Vérifier `storage/logs/laravel.log`
- [ ] **Supabase** : `php artisan supabase:test`
- [ ] **Monitoring** : Consulter `/monitoring`

### Hebdomadaire ✅

- [ ] **PDFs** : `php artisan devis:generate-pdfs --force`
- [ ] **Cache** : `php artisan optimize:clear && php artisan optimize`
- [ ] **Nettoyage** : `php artisan pdf:sync --cleanup`
- [ ] **Services** : `php artisan check:services`
- [ ] **Sauvegardes** : Vérifier les backups automatiques

### Mensuelle ✅

- [ ] **Base de données** : Analyse des performances
- [ ] **Sécurité** : Vérification des permissions
- [ ] **Updates** : Mise à jour des dépendances
- [ ] **Documentation** : Mise à jour si changements
- [ ] **Tests** : Tests complets de bout en bout

---

## 🆘 Support et escalade

### Niveaux d'intervention

#### Niveau 1 - Auto-résolution
- Cache corrompu → `php artisan optimize:clear`
- PDF manquant → `php artisan devis:generate-pdfs --force`
- Email en échec → `php artisan mail:diagnose`

#### Niveau 2 - Support technique
- Problème de synchronisation Supabase
- Corruption de base de données
- Problème de performances

#### Niveau 3 - Développement
- Bug applicatif
- Nouvelle fonctionnalité
- Migration complexe

### Informations à collecter pour le support

```bash
# Générer un rapport complet
{
  echo "=== INFORMATIONS SYSTÈME ==="
  php artisan about
  echo ""
  echo "=== CONFIGURATION ==="
  php artisan config:show | grep -E "(app|database|mail|filesystems)"
  echo ""
  echo "=== LOGS RÉCENTS ==="
  tail -50 storage/logs/laravel.log
  echo ""
  echo "=== ÉTAT DES SERVICES ==="
  php artisan mail:diagnose
  php artisan supabase:test
} > rapport_support_$(date +%Y%m%d_%H%M%S).txt
```

---

## 📚 Ressources techniques

### Documentation Laravel

- **Artisan Console** : https://laravel.com/docs/artisan
- **Cache** : https://laravel.com/docs/cache
- **Database** : https://laravel.com/docs/database
- **Mail** : https://laravel.com/docs/mail

### Outils externes

- **Supabase Docs** : https://supabase.com/docs
- **PostgreSQL** : https://www.postgresql.org/docs/
- **Redis** : https://redis.io/documentation

### Commandes de référence

```bash
# Lister toutes les commandes disponibles
php artisan list

# Aide sur une commande spécifique
php artisan help devis:generate-pdfs

# Informations système
php artisan about

# Version de l'application
php artisan --version
```

---

## ✅ Conclusion du Module 10

Ce module final complète la documentation complète du Dashboard Madinia. Vous disposez maintenant d'un guide exhaustif pour :

- ✅ **Maintenance quotidienne** avec les commandes essentielles
- ✅ **Diagnostic avancé** pour résoudre tous les problèmes
- ✅ **Procédures d'urgence** pour les situations critiques
- ✅ **Optimisation** pour maintenir les performances
- ✅ **Sécurité** et sauvegarde des données

### Modules connexes
- **Module 9** : Dépannage et FAQ (problèmes courants)
- **Module 8** : Tableaux de bord (surveillance métiers)
- **Module 7** : Emails et templates (configuration détaillée)

---

**📋 Documentation complète terminée !**  
**10/10 modules ✅ | 100% de couverture fonctionnelle** 