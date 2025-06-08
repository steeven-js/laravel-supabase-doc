# 🚀 Guide de Démarrage Rapide

## Pour migrer ce projet vers une autre machine

### 🎯 Méthode recommandée : Docker Registry

1. **Aller dans le dossier de migration** :
   ```bash
   cd docker-migration
   ```

2. **Restaurer tout l'environnement** :
   ```bash
   ./restore-full-environment.sh
   ```

3. **Suivre les instructions** affichées par le script

---

### 📁 Organisation du projet

```
laravel-supabase-app/
├── 📚 README.md                    # Documentation principale
├── 📂 docker-migration/            # 🎯 Dossier de migration
│   ├── 📋 README.md                # Guide d'utilisation
│   ├── 📄 DOCKER_MIGRATION_GUIDE.md # Documentation complète
│   ├── 🔧 restore-full-environment.sh      # ⭐ SCRIPT PRINCIPAL
│   ├── 🔧 restore-from-registry.sh         # Laravel uniquement
│   ├── 🔧 restore-supabase-from-registry.sh # Supabase uniquement
│   ├── 🔧 tag-supabase-images.sh           # Tag images
│   └── 🔧 push-supabase-images.sh          # Push vers Docker Hub
├── 🐳 compose.dev.yaml             # Configuration Docker Laravel
├── ⚙️ .env                         # Configuration environnement
└── ... (autres fichiers Laravel)
```

### 📖 Documentation

- **[docker-migration/README.md](./docker-migration/README.md)** - Guide d'utilisation des scripts
- **[docker-migration/DOCKER_MIGRATION_GUIDE.md](./docker-migration/DOCKER_MIGRATION_GUIDE.md)** - Documentation technique

### 🌐 Images Docker Hub

Toutes vos images sont disponibles sur : **[hub.docker.com/u/steeven08](https://hub.docker.com/u/steeven08)**

---

## ⚡ Commandes rapides

```bash
# Migration complète
cd docker-migration && ./restore-full-environment.sh

# Développement local
docker-compose -f compose.dev.yaml up -d

# Migrations Laravel  
docker-compose -f compose.dev.yaml exec workspace php artisan migrate
```

**🎯 Tout est prêt pour la migration !** 
