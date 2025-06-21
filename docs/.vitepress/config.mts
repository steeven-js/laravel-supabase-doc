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
      { text: '🚀 Améliorations & Roadmap', link: '/dev/ameliorations-dashboard' },
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
          text: '🚀 Roadmap & Améliorations',
          items: [
            { text: '🚀 Axes d\'Amélioration Dashboard', link: '/dev/ameliorations-dashboard' },
            { text: '🆚 Comparaison vs Axonaut', link: '/dev/ameliorations-dashboard#comparaison-avec-axonaut-solution-de-référence' },
            { text: '🔍 Analyse DevisIndex.tsx', link: '/dev/analyse-optimisation-devis-index' }
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
        },
        {
          text: '👥 Documentation Clients (100% ✅)',
          collapsed: true,
          items: [
            { text: '🏗️ Module 1 : Architecture Globale', link: '/dev/clients/01-architecture-overview' },
            { text: '🎯 Module 2 : Modèle & Relations', link: '/dev/clients/02-model-client-relations' },
            { text: '🗄️ Module 3 : Base de Données & Migrations', link: '/dev/clients/03-database-migrations' },
            { text: '🎮 Module 4 : ClientController - CRUD & Logique Métier', link: '/dev/clients/04-controller-crud' },
            { text: '📧 Module 5 : Système d\'Emails Clients', link: '/dev/clients/05-email-system' },
            { text: '⚛️ Module 6 : Composants React - Interface Utilisateur', link: '/dev/clients/06-react-components' },
            { text: '🛣️ Module 7 : Routes & Navigation', link: '/dev/clients/07-routes-navigation' },
            { text: '🔧 Module 8 : Traits & Fonctionnalités Avancées', link: '/dev/clients/08-traits-systemes-avances' }
          ]
        },
        {
          text: '🏢 Documentation Entreprises (100% ✅ COMPLET)',
          collapsed: true,
          items: [
            { text: '🏗️ Module 1 : Vue d\'ensemble Architecture ✅', link: '/dev/entreprises/01-architecture-overview-entreprises' },
            { text: '🎯 Module 2 : Modèle Entreprise & Relations ✅', link: '/dev/entreprises/02-model-entreprise-relations' },
            { text: '🗄️ Module 3 : Base de Données & Métier ✅', link: '/dev/entreprises/03-database-structure-metier' },
            { text: '🎮 Module 4 : Controller CRUD Simplifié ✅', link: '/dev/entreprises/04-controller-crud-simplifie' },
            { text: '⚛️ Module 5 : Interface React B2B ✅', link: '/dev/entreprises/05-interface-react-b2b' },
            { text: '📊 Module 6 : Statistiques & Analytics ✅', link: '/dev/entreprises/06-statistiques-analytics' },
            { text: '🔗 Module 7 : Intégrations & Notifications ✅', link: '/dev/entreprises/07-integrations-notifications' }
          ]
        },
        {
          text: '⚙️ Documentation Services (100% 🎉 FINALISÉE)',
          collapsed: true,
          items: [
            { text: '🏗️ Module 1 : Vue d\'ensemble Architecture ✅', link: '/dev/services/01-architecture-overview-services' },
            { text: '🤖 Module 2 : Modèle Service & Auto-génération ✅', link: '/dev/services/02-model-service-auto-generation' },
            { text: '🔧 Module 3 : Système d\'Unités & Enum ✅', link: '/dev/services/03-systeme-unites-enum' },
            { text: '🎮 Module 4 : Controller - CRUD & Fonctionnalités Avancées ✅', link: '/dev/services/04-controller-fonctionnalites-avancees' },
            { text: '🗄️ Module 5 : Base de Données & Évolution Schéma ✅', link: '/dev/services/05-database-evolution-schema' },
            { text: '⚛️ Module 6 : Interface React - 7 Pages Spécialisées ✅', link: '/dev/services/06-interface-react-7-pages' },
            { text: '📊 Module 7 : Statistiques & Analytics ✅', link: '/dev/services/07-statistiques-analytics' },
            { text: '🔗 Module 8 : Routes & Intégrations Avancées ✅', link: '/dev/services/08-routes-integrations-avancees' }
          ]
        },
        {
          text: '📄 Documentation Devis (100% 🎉 FINALISÉE + Phase 5)',
          collapsed: true,
          items: [
            { text: '🎯 Module 1.1 : Vue d\'ensemble du Système ✅', link: '/dev/devis/01-vue-ensemble-systeme' },
            { text: '🗄️ Module 1.2 : Modèles de Données ✅', link: '/dev/devis/02-modeles-donnees' },
            { text: '🔄 Module 1.3 : Gestion des Statuts ✅', link: '/dev/devis/03-gestion-statuts' },
            { text: '🔢 Module 1.4 : Auto-génération Numéros ✅', link: '/dev/devis/04-auto-generation-numeros' },
            { text: '🎮 Module 2.1 : DevisController - CRUD ✅', link: '/dev/devis/2.1-devis-controller-crud' },
            { text: '🔄 Module 2.2 : Gestion des Statuts Backend ✅', link: '/dev/devis/2.2-gestion-statuts-backend' },
            { text: '📧 Module 2.3 : Système d\'Emails ✅', link: '/dev/devis/2.3-systeme-emails' },
            { text: '📄 Module 2.4 : DevisPdfService ✅', link: '/dev/devis/2.4-devis-pdf-service' },
            { text: '📊 Module 3.1 : Pages Liste et Détail ✅', link: '/dev/devis/3.1-pages-liste-detail' },
            { text: '📝 Module 3.2 : Formulaires Création/Édition ✅', link: '/dev/devis/3.2-formulaires-creation-edition' },
            { text: '📄 Module 3.3 : Interface PDF React ✅', link: '/dev/devis/3.3-interface-pdf-react' },
            { text: '🚀 Module 3.4 : Fonctionnalités Avancées ✅', link: '/dev/devis/3.4-fonctionnalites-avancees' },
            { text: '🔄 Module 4.1 : Transformation en Factures ✅', link: '/dev/devis/4.1-transformation-factures' },
            { text: '🎮 Module 4.2 : Système de Notifications ✅', link: '/dev/devis/4.2-systeme-notifications' },
            { text: '🔗 Module 4.3 : Historique et Traçabilité ✅', link: '/dev/devis/4.3-historique-tracabilite' },
            { text: '🧪 Module 5.1 : Tests Backend ✅', link: '/dev/devis/5.1-tests-backend' },
            { text: '⚛️ Module 5.2 : Tests Frontend ✅', link: '/dev/devis/5.2-tests-frontend' },
            { text: '⚡ Module 5.3 : Performance et Optimisation ✅', link: '/dev/devis/5.3-performance-optimisation' }
          ]
        },
        {
          text: '🧾 Documentation Factures (🚀 PHASE 3 DÉMARRÉE)',
          collapsed: true,
          items: [
            { text: '🎯 Phase 1 : Architecture Spécialisée ✅', link: '/dev/factures/phase-1-architecture' },
            { text: '1.1 - Spécificités vs Devis ✅', link: '/dev/factures/1.1-specificites-factures-vs-devis' },
            { text: '1.2 - Modèle de Données ✅', link: '/dev/factures/1.2-modele-donnees-factures' },
            { text: '1.3 - Gestion Paiements ✅', link: '/dev/factures/1.3-gestion-paiements-echeances' },
            { text: '1.4 - Numéros Fiscaux ✅', link: '/dev/factures/1.4-auto-generation-numeros-fiscaux' },
            { text: '⚙️ Phase 2 : Backend et Logique Métier ✅', link: '/dev/factures/phase-2-backend' },
            { text: '2.1 - FactureController CRUD ✅', link: '/dev/factures/2.1-facture-controller-crud' },
            { text: '2.2 - FacturePdfService ✅', link: '/dev/factures/2.2-facture-pdf-service' },
            { text: '2.3 - Système Emails ✅', link: '/dev/factures/2.3-systeme-emails-factures' },
            { text: '2.4 - Services Métier ✅', link: '/dev/factures/2.4-services-metier-factures' },
            { text: '⚛️ Phase 3 : Frontend React 🚀', link: '/dev/factures/phase-3-frontend' },
            { text: '3.1 - Pages Liste et Détails ✅', link: '/dev/factures/3.1-pages-liste-details-factures' },
            { text: '📊 Planning Global', link: '/dev/planning-factures' }
          ]
        },
        {
          text: '📧 Documentation Email Templates (⚡ PHASE 2 DÉMARRÉE)',
          collapsed: true,
          items: [
            { text: '🎯 Phase 1 : Architecture Templates ✅', link: '/dev/email-templates/phase-1-architecture-templates' },
            { text: '1.1 - Système EmailTemplate ✅', link: '/dev/email-templates/1.1-systeme-emailtemplate' },
            { text: '1.2 - Méthodes Métier Templates ✅', link: '/dev/email-templates/1.2-methodes-metier-templates' },
            { text: '1.3 - Validation et Contraintes ✅', link: '/dev/email-templates/1.3-validation-contraintes' },
            { text: '1.4 - Migration et Seeders ✅', link: '/dev/email-templates/1.4-migration-seeders' },
            { text: '⚙️ Phase 2 : Backend EmailTemplate 🚀', link: '/dev/email-templates/phase-2-backend-email-templates' },
            { text: '2.1 - Contrôleurs et API Backend ✅', link: '/dev/email-templates/2.1-controllers-api-backend' },
            { text: '2.2 - Services Métier et Cache ✅', link: '/dev/email-templates/2.2-services-metier-cache' },
            { text: '2.3 - Intégration Logs et Monitoring ✅', link: '/dev/email-templates/2.3-integration-logs-monitoring' },
            { text: '📊 Planning Global', link: '/dev/planning-emails' }
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
