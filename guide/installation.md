# 🚀 Installation

Guide d'installation complet pour configurer l'environnement Laravel-Supabase de A à Z.

## 📋 Vue d'ensemble

Ce guide vous accompagne dans l'installation complète du projet Laravel-Supabase, depuis les prérequis jusqu'à la vérification finale.

### 🎯 Objectifs

- **Installer tous les prérequis** nécessaires
- **Configurer l'environnement** de développement
- **Démarrer les services** Docker
- **Vérifier l'installation** et tester l'application

---

## 🔧 Prérequis

### Système d'exploitation

| OS | Version minimum | Recommandé |
|----|-----------------|------------|
| **Ubuntu** | 20.04 LTS | 22.04 LTS |
| **macOS** | 11.0 (Big Sur) | 13.0+ (Ventura) |
| **Windows** | 10 Pro/Enterprise | 11 Pro + WSL2 |

### Ressources système

| Composant | Minimum | Recommandé |
|-----------|---------|------------|
| **RAM** | 4 GB | 8 GB+ |
| **CPU** | 2 cores | 4+ cores |
| **Stockage** | 10 GB libre | 20 GB+ SSD |
| **Réseau** | Connexion Internet | Haut débit |

---

## 📦 Installation des dépendances

### 1. Docker et Docker Compose

#### Ubuntu/Debian
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installation Docker Compose
sudo apt install docker-compose-plugin

# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

# Redémarrer la session (ou se déconnecter/reconnecter)
newgrp docker

# Vérifier l'installation
docker --version
docker compose version
```

#### macOS
```bash
# Installer Docker Desktop pour Mac
# Télécharger depuis : https://www.docker.com/products/docker-desktop

# Ou avec Homebrew
brew install --cask docker

# Démarrer Docker Desktop et vérifier
docker --version
docker compose version
```

#### Windows (WSL2)
```powershell
# Installer WSL2 d'abord
wsl --install

# Installer Docker Desktop pour Windows
# Télécharger depuis : https://www.docker.com/products/docker-desktop

# Vérifier dans WSL2
docker --version
docker compose version
```

### 2. Git

#### Ubuntu/Debian
```bash
sudo apt install git -y
git --version
```

#### macOS
```bash
# Git est généralement pré-installé
# Ou avec Homebrew
brew install git
git --version
```

#### Windows
```bash
# Dans WSL2
sudo apt install git -y
git --version
```

### 3. Node.js (pour les assets frontend)

#### Ubuntu/Debian
```bash
# Installation Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Vérifier l'installation
node --version
npm --version
```

#### macOS
```bash
# Avec Homebrew
brew install node@18

# Ou avec nvm (recommandé)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Windows (WSL2)
```bash
# Dans WSL2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

---

## 📁 Clonage du projet

### 1. Cloner les repositories

```bash
# Créer un dossier de travail
mkdir ~/laravel-supabase-project
cd ~/laravel-supabase-project

# Cloner le repository principal
git clone https://github.com/steeven-js/laravel-supabase.git

# Cloner le repository Supabase officiel
git clone --depth 1 https://github.com/supabase/supabase

# Structure finale
# ~/laravel-supabase-project/
# ├── laravel-supabase/          # Application principale
# └── supabase/                  # Code source Supabase
```

### 2. Préparer les projets Supabase

```bash
# Créer les dossiers pour les environnements Supabase
mkdir supabase-project-dev      # Développement
mkdir supabase-project          # Production

# Copier les fichiers de configuration Supabase
cp -r supabase/docker/* supabase-project-dev/
cp -r supabase/docker/* supabase-project/

# Copier les fichiers d'environnement
cp supabase/docker/.env.example supabase-project-dev/.env
cp supabase/docker/.env.example supabase-project/.env
```

---

## ⚙️ Configuration

### 1. Configuration Laravel

```bash
cd laravel-supabase

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application Laravel
docker run --rm -v $(pwd):/app -w /app php:8.4-cli php artisan key:generate --show

# Ou si vous avez PHP installé localement
php artisan key:generate
```

### 2. Configuration Supabase développement

```bash
cd ../supabase-project-dev

# Éditer le fichier .env
nano .env
```

**Contenu du fichier `.env` (développement) :**
```env
############
# Secrets
# YOU MUST CHANGE THESE BEFORE GOING INTO PRODUCTION
############

POSTGRES_PASSWORD=your-super-secret-and-long-postgres-password
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

############
# Database
############

POSTGRES_HOST=db
POSTGRES_DB=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres

############
# API Proxy
############

KONG_HTTP_PORT=8000
KONG_HTTPS_PORT=8443

############
# API
############

API_EXTERNAL_URL=http://localhost:8000

############
# Auth
############

SITE_URL=http://localhost:8080
ADDITIONAL_REDIRECT_URLS=
JWT_EXPIRY=3600
DISABLE_SIGNUP=false
API_EXTERNAL_URL=http://localhost:8000

############
# Studio
############

STUDIO_DEFAULT_ORGANIZATION=Default Organization
STUDIO_DEFAULT_PROJECT=Default Project

STUDIO_PORT=3000
# replace if you intend to use Studio outside of localhost
SUPABASE_PUBLIC_URL=http://localhost:8000

############
# Misc
############

ENABLE_EMAIL_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=true
ENABLE_PHONE_SIGNUP=true
ENABLE_PHONE_AUTOCONFIRM=true
```

### 3. Configuration Supabase production

```bash
cd ../supabase-project

# Copier la configuration de dev comme base
cp ../supabase-project-dev/.env .env

# Modifier pour la production
nano .env
```

**Modifications pour la production :**
```env
# Changer les secrets (IMPORTANT!)
POSTGRES_PASSWORD=your-production-super-secret-password
JWT_SECRET=your-production-super-secret-jwt-token

# URLs de production
SITE_URL=https://your-domain.com
API_EXTERNAL_URL=https://your-supabase-domain.com
SUPABASE_PUBLIC_URL=https://your-supabase-domain.com

# Désactiver l'auto-confirmation
ENABLE_EMAIL_AUTOCONFIRM=false
ENABLE_PHONE_AUTOCONFIRM=false
```

### 4. Configuration Laravel avec Supabase

```bash
cd ../laravel-supabase

# Éditer le fichier .env
nano .env
```

**Ajouter les variables Supabase :**
```env
# Configuration Supabase
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Configuration Docker
UID=1000
GID=1000
NGINX_PORT=8080
VITE_PORT=5173

# Configuration XDebug (développement)
XDEBUG_ENABLED=true
XDEBUG_HOST=host.docker.internal
XDEBUG_IDE_KEY=VSCODE
```

---

## 🚀 Démarrage des services

### 1. Démarrer Supabase (développement)

```bash
cd ~/laravel-supabase-project/supabase-project-dev

# Télécharger les images Docker
docker compose pull

# Démarrer tous les services Supabase
docker compose up -d

# Vérifier que tous les services sont démarrés
docker compose ps

# Attendre que tous les services soient "healthy"
echo "⏳ Attente du démarrage de Supabase..."
sleep 30

# Vérifier les logs si nécessaire
docker compose logs kong
```

### 2. Démarrer Laravel

```bash
cd ~/laravel-supabase-project/laravel-supabase

# Télécharger et construire les images
docker compose -f compose.dev.yaml build

# Démarrer l'application Laravel
docker compose -f compose.dev.yaml up -d

# Vérifier l'état des services
docker compose -f compose.dev.yaml ps
```

### 3. Installation des dépendances

```bash
# Installer les dépendances PHP
docker compose -f compose.dev.yaml exec workspace composer install

# Installer les dépendances JavaScript
docker compose -f compose.dev.yaml exec workspace npm install

# Générer la clé d'application (si pas fait)
docker compose -f compose.dev.yaml exec php-fpm php artisan key:generate

# Lancer les migrations (si nécessaire)
docker compose -f compose.dev.yaml exec php-fpm php artisan migrate

# Compiler les assets pour le développement
docker compose -f compose.dev.yaml exec workspace npm run dev
```

---

## ✅ Vérification de l'installation

### 1. Vérifier les services

```bash
# Vérifier tous les conteneurs Laravel
docker compose -f compose.dev.yaml ps

# Vérifier tous les conteneurs Supabase
cd ../supabase-project-dev
docker compose ps

# Retourner dans Laravel
cd ../laravel-supabase
```

**Sortie attendue :**
```
✅ Tous les services doivent être "Up" et "healthy"
```

### 2. Tester les URLs

```bash
# Tester l'application Laravel
curl -I http://localhost:8080

# Tester Supabase Studio
curl -I http://localhost:8000

# Tester l'API Supabase
curl -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0" \
     http://localhost:8000/rest/v1/
```

### 3. Accès aux interfaces

**Laravel Application :**
- URL : http://localhost:8080
- Status : Page d'accueil Laravel

**Supabase Studio :**
- URL : http://localhost:8000
- Username : `supabase`
- Password : `this_password_is_insecure_and_should_be_updated`

**Vite Dev Server :**
- URL : http://localhost:5173
- Status : Hot Module Replacement actif

---

## 🔧 Configuration avancée

### 1. Configuration IDE (VS Code)

**Extensions recommandées :**
```bash
# Installer les extensions VS Code
code --install-extension ms-vscode-remote.remote-containers
code --install-extension bradlc.vscode-tailwindcss
code --install-extension bmewburn.vscode-intelephense-client
code --install-extension ms-vscode.vscode-typescript-next
```

**Configuration XDebug :**
```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for XDebug",
            "type": "php",
            "request": "launch",
            "port": 9003,
            "pathMappings": {
                "/var/www": "${workspaceFolder}"
            }
        }
    ]
}
```

### 2. Aliases pratiques

```bash
# Ajouter à ~/.bashrc ou ~/.zshrc
echo '
# Laravel Supabase Aliases
alias lsdev="cd ~/laravel-supabase-project/laravel-supabase && docker compose -f compose.dev.yaml"
alias lsworkspace="docker compose -f compose.dev.yaml exec workspace"
alias lsartisan="docker compose -f compose.dev.yaml exec php-fpm php artisan"
alias lscomposer="docker compose -f compose.dev.yaml exec php-fpm composer"
alias lsnpm="docker compose -f compose.dev.yaml exec workspace npm"

# Supabase Aliases
alias supadev="cd ~/laravel-supabase-project/supabase-project-dev && docker compose"
alias supaprod="cd ~/laravel-supabase-project/supabase-project && docker compose"
' >> ~/.bashrc

# Recharger le shell
source ~/.bashrc
```

### 3. Scripts utiles

**Script de démarrage complet :**
```bash
#!/bin/bash
# start-dev.sh

echo "🚀 Démarrage environnement Laravel-Supabase..."

# Vérifier que Docker fonctionne
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas démarré"
    exit 1
fi

# Démarrer Supabase
echo "📊 Démarrage Supabase..."
cd ~/laravel-supabase-project/supabase-project-dev
docker compose up -d

# Attendre que Supabase soit prêt
echo "⏳ Attente Supabase (30s)..."
sleep 30

# Démarrer Laravel
echo "🎨 Démarrage Laravel..."
cd ~/laravel-supabase-project/laravel-supabase
docker compose -f compose.dev.yaml up -d

# Attendre que Laravel soit prêt
echo "⏳ Attente Laravel (10s)..."
sleep 10

# Vérifier l'état
echo "✅ Vérification des services..."
docker compose -f compose.dev.yaml ps

echo "🎉 Environnement prêt !"
echo "📱 Laravel: http://localhost:8080"
echo "📊 Supabase: http://localhost:8000"
```

**Rendre le script exécutable :**
```bash
chmod +x start-dev.sh
```

---

## 🚨 Dépannage

### Problèmes courants

| Problème | Symptôme | Solution |
|----------|----------|----------|
| **Port 8080 occupé** | `bind: address already in use` | `sudo lsof -ti:8080 \| xargs kill -9` |
| **Permission denied** | `permission denied while trying to connect` | `sudo usermod -aG docker $USER && newgrp docker` |
| **Out of space** | `no space left on device` | `docker system prune -a --volumes` |
| **Build failed** | `failed to build` | `docker compose build --no-cache` |

### Commandes de diagnostic

```bash
# Vérifier l'installation Docker
docker --version && docker compose version

# Vérifier les services qui tournent
docker ps

# Vérifier l'espace disque Docker
docker system df

# Voir les logs d'un service
docker compose logs service-name

# Réinitialiser complètement
docker compose down -v
docker system prune -a --volumes
```

### Logs utiles

```bash
# Logs Laravel
docker compose -f compose.dev.yaml logs php-fpm
docker compose -f compose.dev.yaml logs web

# Logs Supabase
cd ../supabase-project-dev
docker compose logs kong
docker compose logs auth
docker compose logs rest

# Logs système Docker
sudo journalctl -u docker.service
```

---

## 🎉 Prochaines étapes

### 1. Explorer l'application

- ✅ **Page d'accueil** : http://localhost:8080
- ✅ **Supabase Studio** : http://localhost:8000
- ✅ **Documentation** : Consultez les autres guides

### 2. Développement

- 📖 **[Guide de configuration](./configuration)** - Personnaliser l'application
- 🐳 **[Commandes Docker](../docker/commands)** - Maîtriser Docker
- 🗄️ **[Configuration Supabase](../supabase/configuration)** - Approfondir Supabase

### 3. Production

- 🏭 **[Déploiement production](../deployment/production)** - Mise en ligne
- 🔒 **[SSL/HTTPS](../deployment/ssl)** - Sécuriser l'application

---

## 📞 Support

### En cas de problème

1. **Vérifiez les logs** avec les commandes ci-dessus
2. **Consultez la documentation** des composants
3. **Ouvrez une issue** sur GitHub avec les logs
4. **Rejoignez la communauté** pour obtenir de l'aide

### Ressources utiles

- 🐙 **Repository** : https://github.com/steeven-js/laravel-supabase
- 📚 **Documentation** : https://laravel-supabase-docs.vercel.app
- 💬 **Discussions** : Section GitHub Discussions

---

**🎊 Félicitations ! Votre environnement Laravel-Supabase est maintenant prêt !** 