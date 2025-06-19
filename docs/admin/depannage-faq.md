# 🆘 Module 9 : Dépannage et FAQ

## Vue d'ensemble

Ce module vous guide dans la résolution des problèmes les plus courants du Dashboard Madinia. Il contient des solutions étape par étape, des commandes de diagnostic et des procédures de dépannage.

## 🎯 À qui s'adresse ce module ?

- **Tous les administrateurs** confrontés à des problèmes techniques
- **Super administrateurs** pour le diagnostic avancé
- **Support technique** pour la résolution d'incidents

---

## 🚨 Problèmes les plus fréquents

### Ordre de priorité de résolution

1. **🔴 Urgent** - Application inaccessible, erreurs de base de données
2. **🟡 Important** - PDFs non générés, emails non envoyés
3. **🟢 Mineur** - Problèmes d'affichage, lenteurs ponctuelles

---

## 📧 Problèmes d'envoi d'emails

### Symptômes
- Emails non reçus par les clients
- Erreur lors de l'envoi de devis/factures
- Messages d'erreur de type "SMTP timeout" ou "Connection failed"

### Diagnostic étape par étape

#### 1. Vérifier la configuration email

**Via commande diagnostic :**
```bash
php artisan mail:diagnose
```

**Vérifications manuelles :**
- Variables d'environnement `.env` :
  ```
  MAIL_MAILER=smtp
  MAIL_HOST=votre-serveur-smtp.com
  MAIL_PORT=587
  MAIL_USERNAME=votre-email@domaine.com
  MAIL_PASSWORD=votre-mot-de-passe
  MAIL_ENCRYPTION=tls
  MAIL_FROM_ADDRESS=votre-email@domaine.com
  MAIL_FROM_NAME="Madinia"
  ```

#### 2. Tester l'envoi d'email simple

```bash
# Test de base
php artisan mail:diagnose votre-email@test.com

# Test avec email simple
php artisan email:test-simple votre-email@test.com
```

#### 3. Tester avec un vrai devis

```bash
# Remplacer [ID_DEVIS] par un ID réel
php artisan test:devis-mail [ID_DEVIS] votre-email@test.com
```

### Solutions courantes

#### ❌ Erreur "Connection timeout"
**Cause :** Serveur SMTP inaccessible ou port bloqué

**Solutions :**
1. Vérifier le port SMTP (587 pour TLS, 465 pour SSL)
2. Essayer port alternatif :
   ```
   MAIL_PORT=587  # ou 465 ou 25
   ```
3. Vérifier les paramètres auprès de votre fournisseur email

#### ❌ Erreur "Authentication failed"
**Cause :** Identifiants incorrects

**Solutions :**
1. Vérifier `MAIL_USERNAME` et `MAIL_PASSWORD`
2. Pour Gmail : utiliser un "mot de passe d'application"
3. Vérifier que l'authentification 2FA n'interfère pas

#### ❌ Erreur "SSL certificate problem"
**Cause :** Problème de certificat SSL

**Solutions :**
1. Utiliser TLS au lieu de SSL :
   ```
   MAIL_ENCRYPTION=tls
   MAIL_PORT=587
   ```
2. En derniers recours (développement uniquement) :
   ```
   MAIL_ENCRYPTION=null
   ```

#### ❌ Emails en spam
**Cause :** Configuration SPF/DKIM manquante

**Solutions :**
1. Configurer SPF dans votre DNS
2. Utiliser un service email professionnel (SendGrid, Mailgun)
3. Éviter les mots-clés "spam" dans les objets

### Commandes de diagnostic email

| Commande | Usage | Description |
|----------|-------|-------------|
| `php artisan mail:diagnose` | Configuration générale | Vérifie config et connectivité |
| `php artisan email:test-simple {email}` | Test basique | Envoi email minimal |
| `php artisan email:test-production {email}` | Test complet | Diagnostic avancé production |
| `php artisan test:devis-mail {id} {email}` | Test devis | Email avec pièce jointe PDF |

---

## 📄 Problèmes de génération de PDFs

### Symptômes
- Bouton "Sauvegarder PDF" ne fonctionne pas
- Erreur "PDF non trouvé" lors du téléchargement
- Fichiers PDFs corrompus ou vides

### Diagnostic étape par étape

#### 1. Vérifier les permissions

**Dossiers à vérifier :**
```bash
# Permissions lecture/écriture requises
storage/app/pdfs/
storage/logs/
storage/framework/cache/
```

**Commande de correction :**
```bash
chmod -R 755 storage/
chmod -R 777 storage/logs/
chmod -R 777 storage/app/
```

#### 2. Vérifier React PDF

**Erreurs JavaScript :**
1. Ouvrir la console développeur (F12)
2. Vérifier les erreurs lors du clic "Sauvegarder PDF"
3. Regarder l'onglet "Network" pour les échecs de requête

#### 3. Tester la génération PDF

```bash
# Régénérer tous les PDFs devis
php artisan devis:generate-pdfs --force

# Régénérer tous les PDFs factures
php artisan factures:generate-pdfs --force

# Pour un devis spécifique
php artisan diagnostic:pdf-supabase [ID_DEVIS]
```

### Solutions courantes

#### ❌ Erreur "PDF blob invalid"
**Cause :** Problème lors de la génération React

**Solutions :**
1. Actualiser la page (F5)
2. Vider le cache navigateur
3. Vérifier les données du devis/facture (pas de caractères spéciaux)

#### ❌ Erreur "File not found"
**Cause :** PDF non sauvegardé ou chemin incorrect

**Solutions :**
1. Régénérer le PDF via l'interface
2. Commande de réparation :
   ```bash
   php artisan devis:generate-pdfs --force
   php artisan factures:generate-pdfs --force
   ```

#### ❌ PDFs corrompus ou vides
**Cause :** Données manquantes ou erreur de génération

**Solutions :**
1. Vérifier que le devis/facture a des lignes
2. Vérifier les informations client et entreprise
3. Régénérer depuis l'interface

#### ❌ Problème synchronisation Supabase
**Cause :** Configuration ou connexion Supabase

**Solutions :**
1. Tester la connexion :
   ```bash
   php artisan diagnostic:pdf-supabase
   ```
2. Vérifier les variables d'environnement :
   ```
   SUPABASE_URL=https://votre-projet.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=votre-clé-service
   ```
3. Resynchroniser :
   ```bash
   php artisan pdfs:sync-supabase --force
   ```

### Commandes de diagnostic PDF

| Commande | Usage | Description |
|----------|-------|-------------|
| `php artisan diagnostic:pdf-supabase` | Configuration Supabase | Test connexion et bucket |
| `php artisan diagnostic:pdf-supabase {id}` | PDF spécifique | Diagnostic devis particulier |
| `php artisan devis:generate-pdfs --force` | Régénération | Force la création des PDFs |
| `php artisan pdfs:sync-supabase` | Synchronisation | Upload vers Supabase |

---

## 🗄️ Problèmes de base de données

### Symptômes
- Page blanche ou erreur 500
- Message "Database connection failed"
- Données manquantes ou incohérentes

### Diagnostic étape par étape

#### 1. Vérifier la connexion

**Interface de monitoring :**
- Aller sur `/monitoring` (mode développement)
- Vérifier le statut de la base de données

**Commande de test :**
```bash
php artisan tinker
# Puis taper :
DB::connection()->getPdo();
# Si pas d'erreur, la connexion fonctionne
```

#### 2. Vérifier la configuration

**Variables d'environnement `.env` :**
```
DB_CONNECTION=pgsql
DB_HOST=votre-host-supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=votre-mot-de-passe
```

#### 3. Vérifier les migrations

```bash
# Voir les migrations manquantes
php artisan migrate:status

# Exécuter les migrations en attente
php artisan migrate
```

### Solutions courantes

#### ❌ Erreur "Connection refused"
**Cause :** Base de données inaccessible

**Solutions :**
1. Vérifier l'état du serveur Supabase
2. Vérifier les paramètres de connexion
3. Tester depuis un autre outil (pgAdmin, DBeaver)

#### ❌ Erreur "Authentication failed"
**Cause :** Identifiants incorrects

**Solutions :**
1. Vérifier `DB_USERNAME` et `DB_PASSWORD`
2. Régénérer le mot de passe dans Supabase
3. Vérifier les restrictions IP

#### ❌ Erreur "Database does not exist"
**Cause :** Base de données ou schéma inexistant

**Solutions :**
1. Vérifier le nom de la base dans `DB_DATABASE`
2. Créer la base si nécessaire
3. Vérifier les permissions de l'utilisateur

---

## 🔄 Problèmes de synchronisation

### Symptômes
- Données obsolètes dans les graphiques
- PDFs non visibles côté client
- Désynchronisation entre local et Supabase

### Solutions

#### Cache Laravel
```bash
# Vider tous les caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Ou via l'interface monitoring
/monitoring → "Clear Cache"
```

#### Synchronisation PDFs
```bash
# Synchroniser tous les PDFs
php artisan pdfs:sync-supabase --generate

# Force la resynchronisation
php artisan pdfs:sync-supabase --force
```

#### Rechargement des données
```bash
# Recalculer les statistiques
php artisan optimize

# Régénérer les autoloads
composer dump-autoload
```

---

## 🚫 Problèmes d'accès et permissions

### Symptômes
- Page "403 Forbidden"
- Fonctionnalités manquantes dans l'interface
- Erreur "Unauthorized access"

### Solutions

#### Vérification des rôles utilisateur
1. **Vérifier votre rôle** dans la base :
   ```sql
   SELECT u.name, ur.name as role 
   FROM users u 
   JOIN user_roles ur ON u.role_id = ur.id 
   WHERE u.email = 'votre-email@domaine.com';
   ```

2. **Rôles disponibles** :
   - `super_admin` : Accès total
   - `admin` : Gestion courante
   - `user` : Consultation limitée

#### Correction des permissions
```bash
# Si vous êtes le premier utilisateur
php artisan user:make-super-admin votre-email@domaine.com

# Créer un admin de sauvegarde
php artisan user:create-admin
```

---

## 🐛 Messages d'erreur fréquents

### Erreurs Inertia.js

#### ❌ "The page expired, please refresh and try again"
**Cause :** Session expirée ou token CSRF invalide

**Solutions :**
1. Actualiser la page (F5)
2. Se reconnecter
3. Vider le cache navigateur

#### ❌ "Server Error 500"
**Cause :** Erreur PHP non gérée

**Solutions :**
1. Consulter les logs : `storage/logs/laravel.log`
2. Activer le debug : `APP_DEBUG=true` (temporairement)
3. Vérifier les permissions de fichiers

### Erreurs React/TypeScript

#### ❌ "Cannot read property of undefined"
**Cause :** Données manquantes côté frontend

**Solutions :**
1. Actualiser la page
2. Vérifier les données côté serveur
3. Console développeur pour plus de détails

---

## 🔧 Outils de diagnostic avancés

### Mode monitoring (développement)

**Accès :** `/monitoring`

**Fonctionnalités :**
- Vue d'ensemble système (PHP, Laravel, BDD)
- Test d'envoi d'emails
- Diagnostic de configuration
- Nettoyage du cache

### Commandes de maintenance

```bash
# Diagnostic complet email
php artisan mail:diagnose votre-email@test.com

# Diagnostic PDF Supabase
php artisan diagnostic:pdf-supabase

# Test de production email
php artisan email:test-production votre-email@test.com

# Régénération PDFs avec sync
php artisan devis:generate-pdfs --force --sync-supabase
php artisan factures:generate-pdfs --force --sync-supabase

# Nettoyage général
php artisan optimize:clear
```

### Logs importants

| Fichier | Contenu | Localisation |
|---------|---------|--------------|
| `laravel.log` | Erreurs applicatives | `storage/logs/` |
| `access.log` | Requêtes web | Serveur web |
| `error.log` | Erreurs serveur | Serveur web |

**Consultation des logs :**
```bash
# Dernières erreurs
tail -f storage/logs/laravel.log

# Recherche d'erreurs spécifiques
grep "ERROR" storage/logs/laravel.log

# Logs des dernières 24h
grep "$(date '+%Y-%m-%d')" storage/logs/laravel.log
```

---

## 🔍 Procédures de diagnostic

### Méthodologie de résolution

#### 1. Identification du problème
- **Qui ?** Utilisateur(s) affecté(s)
- **Quoi ?** Fonctionnalité en panne
- **Quand ?** Depuis quand le problème existe
- **Où ?** Page/section concernée

#### 2. Reproduction du problème
- Essayer de reproduire l'erreur
- Noter les étapes exactes
- Capturer les messages d'erreur

#### 3. Diagnostic initial
- Consulter les logs récents
- Vérifier les services externes (email, Supabase)
- Tester les commandes de diagnostic

#### 4. Application de la solution
- Commencer par les solutions simples
- Tester après chaque action
- Documenter les changements

#### 5. Validation
- Confirmer que le problème est résolu
- Tester les fonctionnalités connexes
- Communiquer la résolution

### Checklist de diagnostic rapide

- [ ] **Cache vidé** → `php artisan cache:clear`
- [ ] **Logs consultés** → `storage/logs/laravel.log`
- [ ] **Configuration vérifiée** → Variables `.env`
- [ ] **Permissions correctes** → Dossiers `storage/`
- [ ] **Services externes** → Email, Supabase
- [ ] **Console navigateur** → Erreurs JavaScript
- [ ] **Migrations à jour** → `php artisan migrate:status`

---

## 📞 Escalade et support

### Niveaux de support

#### Niveau 1 : Auto-résolution
- Utiliser ce guide de dépannage
- Commandes de diagnostic automatiques
- Solutions documentées

#### Niveau 2 : Support technique
- Problèmes non résolus par la documentation
- Erreurs complexes nécessitant une analyse
- Configuration d'environnement spécifique

#### Niveau 3 : Développement
- Bugs applicatifs
- Nouvelles fonctionnalités
- Modifications de code

### Informations à fournir en cas d'escalade

#### Informations système
```bash
# Collecter les informations système
php artisan about

# Version Laravel et PHP
php artisan --version
php --version

# Statut des migrations
php artisan migrate:status

# Configuration actuelle (masquer les mots de passe !)
php artisan config:show mail
```

#### Logs d'erreurs
- Dernières erreurs dans `storage/logs/laravel.log`
- Screenshots des erreurs dans l'interface
- Étapes de reproduction détaillées

#### Contexte
- Quand le problème a commencé
- Changements récents effectués
- Nombre d'utilisateurs affectés
- Impact sur l'activité

---

## 📋 Maintenance préventive

### Contrôles réguliers (hebdomadaires)

- [ ] **Logs d'erreurs** : Vérifier les nouvelles erreurs
- [ ] **Espace disque** : Surveiller l'espace disponible
- [ ] **Sauvegardes** : Vérifier la sauvegarde automatique
- [ ] **Tests emails** : Envoyer un email de test
- [ ] **PDFs** : Vérifier la génération sur quelques devis

### Contrôles mensuels

- [ ] **Mises à jour** : Vérifier les mises à jour disponibles
- [ ] **Performance** : Analyser les temps de réponse
- [ ] **Sécurité** : Vérifier les logs d'accès
- [ ] **Nettoyage** : Purger les anciens logs et caches

### Bonnes pratiques

#### Sauvegarde avant intervention
```bash
# Sauvegarde de la base de données
pg_dump -h host -U user -d database > backup_$(date +%Y%m%d).sql

# Sauvegarde des fichiers
tar -czf backup_files_$(date +%Y%m%d).tar.gz storage/ public/
```

#### Test en mode maintenance
```bash
# Activer le mode maintenance
php artisan down --secret="token-secret"

# Faire les modifications...

# Désactiver le mode maintenance
php artisan up
```

---

## 🎯 Résumé des commandes essentielles

### Diagnostic rapide
```bash
# Configuration email
php artisan mail:diagnose

# Test email simple
php artisan email:test-simple votre-email@test.com

# Diagnostic PDF
php artisan diagnostic:pdf-supabase

# Vider le cache
php artisan cache:clear
```

### Réparation courante
```bash
# Régénérer PDFs
php artisan devis:generate-pdfs --force
php artisan factures:generate-pdfs --force

# Synchroniser Supabase
php artisan pdfs:sync-supabase --force

# Nettoyer complètement
php artisan optimize:clear
```

### Urgence
```bash
# Mode maintenance ON
php artisan down

# Restaurer depuis sauvegarde
# (selon votre procédure)

# Mode maintenance OFF
php artisan up
```

---

## 📚 Ressources complémentaires

### Documentation technique
- **Laravel** : https://laravel.com/docs
- **Inertia.js** : https://inertiajs.com/
- **React PDF** : https://react-pdf.org/
- **Supabase** : https://supabase.com/docs

### Logs et monitoring
- Logs Laravel : `storage/logs/laravel.log`
- Interface monitoring : `/monitoring` (mode dev)
- Console navigateur : F12

### Modules connexes
- **Module 10** : Maintenance et commandes administratives
- **Module 8** : Tableaux de bord (pour analyser les performances)
- **Module 7** : Système d'emails (configuration détaillée)

---

*Ce module fait partie de la documentation complète du Dashboard Madinia. En cas de problème non résolu par ce guide, consultez le Module 10 ou contactez le support technique.* 