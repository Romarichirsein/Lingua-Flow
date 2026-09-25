# LinguaFlow — Plateforme SaaS E-Learning Multi-Écoles (Allemand & Italien)

LinguaFlow est une plateforme d'apprentissage linguistique B2B moderne conçue pour les écoles de langues, les centres de formation et les instituts linguistiques spécialisés dans l'enseignement de l'Allemand (DACH 🇩🇪 🇦🇹 🇨🇭) et de l'Italien (🇮🇹).

## Fonctionnalités Principales

- **Architecture Multi-Écoles (Multi-Tenant)** : Espaces hermétiquement isolés pour le Super Admin, les Directeurs d'Écoles et les Apprenants.
- **Portail Élève Avancé** :
  - Lecteur de cours vidéo sécurisé avec filigrane dynamique anti-copie.
  - Cartes mémo (flashcards) avec synthèse vocale native pour chaque leçon.
  - Quiz interactifs de validation à passage séquentiel obligatoire.
- **Coach Linguistique Interactif & Dédié** :
  - Coaching grammatical et conversationnel en temps réel calibré automatiquement sur le niveau CECRL de l'élève (A1 à C2).
  - Mode Analyse Approfondie pour l'explication des 4 cas allemands, des déclinaisons et des tournures idiomatiques.
  - Délai de réponse ultra-rapide (< 5 secondes).
- **Atelier d'Expression Écrite (Writing Studio)** :
  - Éditeur de rédaction avec comptage de mots, analyse de structure et barème pédagogique officiel (4x25 points).
  - Historique complet des rédactions et versions corrigées annotées.
- **Entraînement Officiel aux Examens (Prüfung CECRL)** :
  - Préparation aux 5 épreuves types : *Lesen*, *Sprachbausteine*, *Hören*, *Schreiben*, *Sprechen* et *Wortschatz*.
  - Génération d'attestations et certificats de réussite infalsifiables avec QR code de vérification.
- **Intégration Sanity CMS** : Synchronisation fluide des modules de cours, syllabus et médias.

## Installation & Démarrage Local

### Prérequis
- Node.js (version 18+ recommandée)
- npm ou pnpm

### Démarrage Rapide

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement** :
   Copiez `.env.example` vers `.env` et renseignez vos clés de service.
   ```bash
   cp .env.example .env
   ```

3. **Lancer le serveur de développement** :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000`.

4. **Vérification & Tests** :
   ```bash
   npm run lint
   npm run diagnostics
   ```

5. **Compiler pour la production** :
   ```bash
   npm run build
   npm start
   ```
