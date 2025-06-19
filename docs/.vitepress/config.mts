import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Documentation Dashboard Madinia",
  description: "📚 Documentation complète pour les administrateurs et développeurs du Dashboard Madinia",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '🏠 Accueil', link: '/' },
      { text: '👥 Administrateurs', link: '/admin/guide-introduction' },
      { text: '🛠️ Développeurs', link: '/dev/' },
      { text: '📋 Planning (100%)', link: '/admin/planning-redaction' }
    ],

    sidebar: {
      // Sidebar pour la documentation développeurs
      '/dev/': [
        {
          text: '🛠️ Documentation Développeurs',
          items: [
            { text: '🏠 Accueil Développeurs', link: '/dev/' }
          ]
        },
        {
          text: '📋 Plannings de Rédaction',
          items: [
            { text: '👥 Planning Clients', link: '/dev/planning-clients' },
            { text: '🏢 Planning Entreprises', link: '/dev/planning-entreprises' },
            { text: '⚙️ Planning Services', link: '/dev/planning-services' },
            { text: '📄 Planning Devis', link: '/dev/planning-devis' },
            { text: '🧾 Planning Factures', link: '/dev/planning-factures' },
            { text: '📧 Planning Emails & Templates', link: '/dev/planning-emails' }
          ]
        }
      ],

      // Sidebar pour la documentation administrateurs
      '/admin/': [
        {
          text: '📋 Planning & Organisation (100% ✅)',
          items: [
            { text: '📋 Planning de Rédaction - Projet Finalisé', link: '/admin/planning-redaction' }
          ]
        },
        {
          text: '🚀 Phase 1 : Fondations (Terminée ✅)',
          items: [
            { text: '✅ Introduction et Prise en Main', link: '/admin/guide-introduction' },
            { text: '✅ Gestion des Utilisateurs', link: '/admin/gestion-utilisateurs' }
          ]
        },
        {
          text: '💼 Phase 2 : Cœur Métier (Terminée ✅)',
          items: [
            { text: '✅ Clients et Entreprises', link: '/admin/gestion-clients-entreprises' },
            { text: '✅ Gestion des Devis', link: '/admin/gestion-devis' },
            { text: '✅ Gestion des Factures', link: '/admin/gestion-factures' }
          ]
        },
        {
          text: '🛠️ Phase 3 : Support et Outils (Terminée ✅)',
          items: [
            { text: '✅ Catalogue de Services', link: '/admin/catalogue-services' },
            { text: '✅ Tableaux de Bord', link: '/admin/tableaux-de-bord' },
            { text: '✅ Emails et Templates', link: '/admin/emails-et-templates' }
          ]
        },
        {
          text: '🔧 Phase 4 : Maintenance (Terminée ✅)',
          items: [
            { text: '✅ Dépannage et FAQ', link: '/admin/depannage-faq' },
            { text: '✅ Maintenance Système', link: '/admin/maintenance-commandes' }
          ]
        },
        {
          text: 'Exemples (Archive)',
          items: [
            { text: 'Markdown Examples', link: '/admin/markdown-examples' },
            { text: 'Runtime API Examples', link: '/admin/api-examples' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/steeven-js/laravel-supabase' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: '📚 Documentation Dashboard Madinia - Administrateurs & Développeurs',
      copyright: 'Copyright © 2025 Madinia | Documentation complète'
    }
  }
})
