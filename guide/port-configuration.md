# Configuration des Ports - Laravel-Supabase

Ce document récapitule tous les ports utilisés dans l'infrastructure pour éviter les conflits.

## 🚨 Conflit résolu

**Problème identifié** : VitePress utilisait par défaut le port `5173`, déjà utilisé par le service `workspace` Laravel (Vite).

**Solution appliquée** : VitePress configuré pour utiliser le port `5174`.

## 📊 Cartographie des ports

### Laravel - Environnement de développement
| Service | Port | Description |
|---------|------|-------------|
| web (Nginx) | 8080 | Interface web principale |
| workspace (Vite) | **5173** | ⚠️ Dev server Laravel |
| php-fpm | 9000 | PHP FastCGI |
| redis | 6379 | Cache Redis |

### Laravel - Environnement de production
| Service | Port | Description |
|---------|------|-------------|
| web (Nginx) | 80 | HTTP |
| web (Nginx) | 443 | HTTPS |
| php-fpm | 9000 | PHP FastCGI |
| redis | 6379 | Cache Redis |

### Supabase - Environnement de développement
| Service | Port | Description |
|---------|------|-------------|
| Kong API Gateway | 8001 | API publique |
| Kong HTTPS | 8444 | API HTTPS |
| PostgreSQL Pooler | 5433 | Base de données |
| PostgreSQL Session | 6544 | Sessions DB |
| Analytics | 4001 | Supabase Analytics |

### Supabase - Environnement de production
| Service | Port | Description |
|---------|------|-------------|
| Kong API Gateway | 8000 | API publique |
| Kong HTTPS | 8443 | API HTTPS |
| PostgreSQL Pooler | 5432 | Base de données |
| PostgreSQL Session | 6543 | Sessions DB |
| Analytics | 4000 | Supabase Analytics |

### Documentation (VitePress)
| Service | Port | Description |
|---------|------|-------------|
| VitePress Dev | **5174** | ✅ Documentation (résolu) |

## 🔧 Configuration appliquée

### VitePress - Configuration personnalisée

```typescript
// docs/.vitepress/config.ts
export default defineConfig({
  vite: {
    server: {
      port: 5174  // Port personnalisé pour éviter le conflit
    }
  }
})
```

### Commandes VitePress

```bash
# Développement - Accessible sur http://localhost:5174
npm run docs:dev

# Construction
npm run docs:build

# Prévisualisation
npm run docs:preview
```

## 🚦 Ports disponibles

Ports recommandés pour de futurs services :

- **5175-5180** : Disponibles pour autres outils de développement
- **3001-3010** : Disponibles pour services auxiliaires
- **9001-9010** : Disponibles pour services backend

## ⚠️ Ports à éviter

- **5173** : Utilisé par Laravel Vite (workspace)
- **8080** : Utilisé par Laravel dev (web)
- **8000-8001** : Utilisés par Supabase Kong
- **5432-5433** : Utilisés par PostgreSQL
- **4000-4001** : Utilisés par Supabase Analytics

## 🔍 Commandes utiles

### Vérifier les ports utilisés
```bash
# Voir tous les ports Docker
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Voir les ports système
netstat -tlnp | grep LISTEN

# Vérifier un port spécifique
netstat -tlnp | grep :5174
```

### Tester la connectivité
```bash
# Tester VitePress
curl -I http://localhost:5174

# Tester Laravel dev
curl -I http://localhost:8080

# Tester Supabase dev
curl -I http://localhost:8001
```

## 📝 Notes importantes

1. **Environnement de développement** : Tous les services sont accessibles via localhost
2. **Environnement de production** : Seuls les ports 80/443 sont exposés publiquement
3. **Réseaux Docker** : Les services communiquent via les réseaux internes Docker
4. **VitePress** : Configuré pour éviter les conflits avec l'infrastructure existante

## 🔄 Mise à jour future

Si vous ajoutez de nouveaux services :

1. Consultez ce document pour éviter les conflits
2. Mettez à jour cette documentation
3. Testez les ports avant le déploiement
4. Documentez les nouveaux ports utilisés 