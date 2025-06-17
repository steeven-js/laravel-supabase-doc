import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Documentation Dashboard Madinia",
  description: "📚 Documentation complète pour les administrateurs du Dashboard Madinia - 10/10 modules terminés ✅",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '🏠 Accueil', link: '/' },
      { text: '🚀 Guide Introduction', link: '/guide-introduction' },
      { text: '📋 Planning (100%)', link: '/planning-redaction' }
    ],

    sidebar: [
      {
        text: '📋 Planning & Organisation (100% ✅)',
        items: [
          { text: '📋 Planning de Rédaction - Projet Finalisé', link: '/planning-redaction' }
        ]
      },
      {
        text: '🚀 Phase 1 : Fondations (Terminée ✅)',
        items: [
          { text: '✅ Introduction et Prise en Main', link: '/guide-introduction' },
          { text: '✅ Gestion des Utilisateurs', link: '/gestion-utilisateurs' }
        ]
      },
      {
        text: '💼 Phase 2 : Cœur Métier (Terminée ✅)',
        items: [
          { text: '✅ Clients et Entreprises', link: '/gestion-clients-entreprises' },
          { text: '✅ Gestion des Devis', link: '/gestion-devis' },
          { text: '✅ Gestion des Factures', link: '/gestion-factures' }
        ]
      },
      {
        text: '🛠️ Phase 3 : Support et Outils (Terminée ✅)',
        items: [
          { text: '✅ Catalogue de Services', link: '/catalogue-services' },
          { text: '✅ Tableaux de Bord', link: '/tableaux-de-bord' },
          { text: '✅ Emails et Templates', link: '/emails-et-templates' }
        ]
      },
      {
        text: '🔧 Phase 4 : Maintenance (Terminée ✅)',
        items: [
          { text: '✅ Dépannage et FAQ', link: '/depannage-faq' },
          { text: '✅ Maintenance Système', link: '/maintenance-commandes' }
        ]
      },
      {
        text: 'Exemples (Archive)',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/steeven-js/laravel-supabase' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: '📚 Documentation Dashboard Madinia - Projet finalisé à 100% ✅',
      copyright: 'Copyright © 2025 Madinia | 10/10 modules terminés'
    }
  }
})
