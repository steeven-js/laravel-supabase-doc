import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Laravel-Supabase Documentation",
  description: "Documentation complète du projet Laravel avec Supabase - Environnements Docker, déploiement et configuration",
  ignoreDeadLinks: true,
  // Configuration pour développement local et déploiement Vercel
  vite: {
    server: {
      port: 5174,
      host: '0.0.0.0'
    }
  },
  
  // Configuration pour déploiement
  base: '/',
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Architecture', link: '/architecture-roadmap' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Docker', link: '/docker/' },
      { text: 'Supabase', link: '/supabase/' },
      { text: 'Déploiement', link: '/deployment/' }
    ],

    sidebar: {
      '/': [
        {
          text: '🏗️ Architecture',
          items: [
            { text: 'Roadmap Architecture', link: '/architecture-roadmap' }
          ]
        },
        {
          text: 'Démarrage Rapide',
          items: [
            { text: 'Guide de Démarrage Rapide', link: '/guide/quick-start' },
            { text: 'Configuration des Ports', link: '/guide/port-configuration' },
            { text: 'Documentation Projet', link: '/README-REPO' }
          ]
        }
      ],
      '/guide/': [
        {
          text: '🏗️ Architecture',
          items: [
            { text: 'Roadmap Architecture', link: '/architecture-roadmap' }
          ]
        },
        {
          text: 'Guide Utilisateur',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Démarrage Rapide', link: '/guide/quick-start' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Configuration des Ports', link: '/guide/port-configuration' }
          ]
        },
        {
          text: 'Exemples',
          items: [
            { text: 'Exemples API', link: '/guide/examples/api-examples' },
            { text: 'Exemples Markdown', link: '/guide/examples/markdown-examples' }
          ]
        }
      ],
      '/docker/': [
        {
          text: '🏗️ Architecture',
          items: [
            { text: 'Roadmap Architecture', link: '/architecture-roadmap' }
          ]
        },
        {
          text: 'Docker',
          items: [
            { text: 'Commandes Docker', link: '/docker/commands' },
            { text: 'Gestion des Images', link: '/docker/images' },
            { text: 'Configuration Réseau', link: '/docker/network' },
            { text: 'Docker Compose', link: '/docker/compose' }
          ]
        },
        {
          text: 'Gestion Avancée',
          items: [
            { text: 'Docker Hub Management', link: '/docker/hub-management' },
            { text: 'Configuration Réseau Avancée', link: '/docker/network-config' }
          ]
        }
      ],
      '/supabase/': [
        {
          text: '🏗️ Architecture',
          items: [
            { text: 'Roadmap Architecture', link: '/architecture-roadmap' }
          ]
        },
        {
          text: 'Supabase',
          items: [
            { text: 'Introduction', link: '/supabase/' },
            { text: 'Configuration', link: '/supabase/configuration' },
            { text: 'Migrations', link: '/supabase/migrations' },
            { text: 'Authentification', link: '/supabase/auth' }
          ]
        }
      ],
      '/deployment/': [
        {
          text: '🏗️ Architecture',
          items: [
            { text: 'Roadmap Architecture', link: '/architecture-roadmap' }
          ]
        },
        {
          text: 'Déploiement',
          items: [
            { text: 'Production', link: '/deployment/production' },
            { text: 'Développement', link: '/deployment/development' },
            { text: 'Gestion des Environnements', link: '/deployment/environments' },
            { text: 'SSL/HTTPS', link: '/deployment/ssl' },
            { text: 'Maintenance', link: '/deployment/maintenance' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/steeven08/laravel-supabase' }
    ],

    footer: {
      message: 'Documentation Laravel-Supabase',
      copyright: 'Copyright © 2024 Laravel-Supabase Project'
    },

    search: {
      provider: 'local'
    },

    docFooter: {
      prev: 'Page précédente',
      next: 'Page suivante'
    },

    outline: {
      level: [2, 3],
      label: 'Table des matières'
    }
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'og:title', content: 'Laravel Supabase Documentation' }],
    ['meta', { name: 'og:description', content: 'Documentation du projet Laravel avec Supabase' }]
  ],

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
