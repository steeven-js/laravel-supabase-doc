import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Documentation Dashboard Madinia",
  description: "Documentation complète pour les administrateurs du Dashboard Madinia",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Guide Introduction', link: '/guide-introduction' },
      { text: 'Planning', link: '/planning-redaction' }
    ],

    sidebar: [
      {
        text: '📋 Planning & Organisation',
        items: [
          { text: '📋 Planning de Rédaction', link: '/planning-redaction' }
        ]
      },
      {
        text: '🚀 Phase 1 : Fondations',
        items: [
          { text: '✅ Introduction et Prise en Main', link: '/guide-introduction' },
          { text: '✅ Gestion des Utilisateurs', link: '/gestion-utilisateurs' }
        ]
      },
      {
        text: '💼 Phase 2 : Cœur Métier',
        items: [
          { text: '✅ Clients et Entreprises', link: '/gestion-clients-entreprises' },
          { text: '✅ Gestion des Devis', link: '/gestion-devis' },
          { text: '✅ Gestion des Factures', link: '/gestion-factures' }
        ]
      },
      {
        text: '🛠️ Phase 3 : Support et Outils',
        items: [
          { text: '✅ Catalogue de Services', link: '/catalogue-services' },
          { text: '📊 Tableaux de Bord', link: '/tableaux-de-bord' },
          { text: '📧 Emails et Templates', link: '/emails-et-templates' }
        ]
      },
      {
        text: '🔧 Phase 4 : Maintenance',
        items: [
          { text: '🆘 Dépannage et FAQ', link: '/depannage-faq' },
          { text: '🔧 Maintenance Système', link: '/maintenance-et-commandes' }
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
      { icon: 'github', link: 'https://github.com/madinia/dashboard' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Documentation Dashboard Madinia',
      copyright: 'Copyright © 2025 Madinia'
    }
  }
})
