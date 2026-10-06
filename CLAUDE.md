# WIYAO — notes pour Claude Code

WIYAO n'est pas qu'un catalogue de roadmaps : c'est un guide qui accompagne le bachelier togolais à chaque étape de son parcours tech — orientation, choix de domaine, de filière, d'université — puis roadmaps de carrière, comparateur d'écoles, calendrier, bourses/financement, stages/emploi, écosystème tech togolais. Site statique (aucun backend, aucune base de données), déployé sur Vercel via l'intégration GitHub (push sur `main` = déploiement auto), dépôt public `GRIIINDER/Wiyao`.

## Stack

Zéro dépendance, zéro build. HTML/CSS/JS vanilla servis tels quels :
- `js/data.js` — source de vérité du contenu : `ROLES`, `SKILLS`, `SCHOOLS`, `DOMAINS`.
- `js/app.js` — rendu (roadmaps, écoles, recherche, quiz d'orientation, formulaire contact) + enregistrement du service worker.
- `js/i18n.js` — toutes les chaînes FR/EN, indexées par `data-i18n-key`.
- `js/nav.js` — menu mobile (chargé sur les 19 pages, contrairement à `app.js`) + compteurs `data-count-of="sélecteur"` des bandes de chiffres sous les titres + indicateur « Défiler » + boutons `data-copy`.
- `js/ecosysteme.js` — page Écosystème uniquement : transforme la rangée de liens `.eco-jump-nav` en filtres par type (nombre compté sur la page, lien partageable `?type=`).
- `js/actualites.js` — page Actualités uniquement (expose aussi `window.WIYAO_AGENDA` : fichier .ics, lien Google Agenda) : filtres par catégorie, actu « À la une », bouton « Ajouter à mon agenda ». Ce bouton n'apparaît que sur les cartes portant `data-start` / `data-end` (`AAAA-MM-JJ` ou `AAAA-MM-JJTHH:MM`, heure de Lomé = UTC) et `data-lieu`, à poser à la main d'après le texte vérifié de la carte quand on ajoute un événement daté ; il disparaît tout seul une fois l'événement passé.
- `js/assistant.js` — widget d'assistant.
- `sw.js` — service worker stale-while-revalidate (offline + PWA installable).

## Règles à ne jamais oublier

**Cache-busting.** Chaque `<script src="...">` / `<link href="...">` porte un `?v=N`. Dès qu'un fichier JS/CSS change, bump son `?v=N` sur **les 19 pages HTML** qui le référencent (pas seulement celle qu'on vient d'éditer). Vérifier après coup avec `grep -c` qu'aucune page n'est restée sur l'ancienne version.

**Service worker.** Bump `CACHE_NAME` dans `sw.js` à chaque changement qui touche une page ou un asset précaché. Ajouter les nouveaux assets statiques à `PRECACHE_URLS`. Comportement connu et normal : le tout premier chargement après un déploiement peut encore servir une version en cache le temps de la revalidation en arrière-plan — ce n'est pas un bug si un deuxième chargement affiche le bon contenu.

**i18n.** Toujours faire `node --check js/i18n.js` après une édition — une apostrophe non échappée dans une chaîne EN a déjà cassé la syntaxe. Garder FR et EN synchronisés : une traduction anglaise oubliée après une correction du texte français a déjà introduit une désinformation (badge "Agréé État" avec une liste d'écoles obsolète côté EN).

**Contenu vérifié, jamais deviné.** Aucun fait publié (frais, dates, personnes, statistiques, plateformes, employeurs) sans source citable (site officiel, PDF, article de presse, page gouvernementale). Une piste non confirmée s'exclut et se signale à l'utilisateur plutôt que de se retrouver sur le site avec un chiffre plausible mais inventé.

**Test avant commit.** Ajouter temporairement une deuxième entrée à `.claude/launch.json` (port libre, ex. `wiyao-static-fresh`) pour tester sur un cache vraiment vierge via le navigateur, puis **la retirer avant de committer** — vérifier avec `git diff .claude/launch.json` que le fichier revient à son état d'origine.

**Lisibilité (typographie).** Texte courant en police système sans-serif (`--font-text` : Segoe UI, Roboto, San Francisco…, rien à télécharger) ; la chasse fixe JetBrains Mono (`--font-mono`) est réservée aux accents de marque (titres des bandeaux, titre de l'accueil, étiquettes « eyebrow », grands chiffres). Échelle du contenu (`main`) : 16 px par défaut, chapeau 18 px, titres de carte 18 px, titres de section 24 px, éléments secondaires 14 px, étiquettes en capitales 13 px, jamais en dessous ; titres en sans-serif en graisse 700 (le 800 donne une coupe « Black » trop lourde). Paragraphes limités à ~70 caractères par ligne (`max-width: 70ch`), pas d'italique pour le texte courant. L'ancien « aplat » 16/14/12 px en chasse fixe a été abandonné le 2026-10-06 car jugé illisible par l'utilisateur : ne pas le réintroduire. Menu « hamburger » sous 1180 px (au-delà, la barre tient sur une ligne). Mesure : rendre les pages et compter la part de texte sous 14 px et les lignes de plus de 85 caractères.

**Une information = une seule page.** Chaque contenu ne vit qu'à un endroit ; ailleurs, un renvoi d'une ligne (lien), jamais une copie. Où vit quoi : actualités et événements → Actualités ; FAQ → FAQ ; chiffres du secteur et portraits → Témoignages ; méthode de vérification et sources → À propos ; description des 7 domaines → Roadmaps ; dates par école → Calendrier ; bourses (y compris celles des écoles) → Bourses ; frais, admission, filières → Écoles. Un acteur présent sur deux pages n'y porte pas la même information (ex. Agence Togo Digital : recrutement sur Stages, rôle institutionnel sur Écosystème). L'accueil est un aiguillage, sans copie de contenu. Exceptions assumées : la page Recherche (elle cite les autres pages par nature), le bandeau d'appel final en bas des pages, et les repères courts dans une phrase (« compare 32 écoles »). Audit : rendre les 20 pages et chercher les blocs de texte identiques sur 2 pages ou plus.

**Quoi de neuf.** La section « Quoi de neuf sur WIYAO » d'`about.html` liste les nouveautés visibles, datées d'après l'historique Git (clés `about.changelog.cN.*` dans `i18n.js`, FR et EN). À chaque nouveauté visible mise en ligne, ajouter une entrée en tête et retirer la plus ancienne pour en garder six.

**Commit + push.** Committer et pousser sur `origin/main` après chaque changement vérifié, sans demander confirmation à chaque fois (sauf action destructrice/inhabituelle : force-push, réécriture d'historique, suppression de fichiers).

**CSP.** `vercel.json` applique une Content-Security-Policy stricte sur `script-src` (liste blanche par hash SHA-256, pas de `unsafe-inline`). Si le contenu du JSON-LD d'`index.html` (seul script inline restant sur le site) change, il faut recalculer son hash SHA-256 et mettre à jour `vercel.json`, sinon le script sera silencieusement bloqué en production. `style-src` autorise `unsafe-inline` (nécessaire pour les barres de progression, dont la largeur est appliquée en style inline par `app.js`).

**Pas de mode clair.** Le site est volontairement dark-only (aucun bouton de bascule, aucune variable CSS `[data-theme="light"]`) : c'est un choix de design assumé, pas un oubli. Ne pas réintroduire de thème clair sans demande explicite.

**Aucune collecte de données.** WIYAO ne collecte rien côté serveur : la progression sur les roadmaps reste dans `localStorage` du navigateur, et la page Contact ouvre le client email de l'utilisateur (`mailto:`) plutôt que d'envoyer à un serveur. Historique de la newsletter : retirée le 2026-09-14, réintroduite (Buttondown) le 2026-09-17, retirée à nouveau le 2026-09-19 après une tentative de migration vers MailerLite restée bloquée (formulaire non récupéré). Si elle revient un jour, il faudra resynchroniser la politique de confidentialité (section 2 : "Deux actions" → "Trois actions", section 3 base légale, sections 4/5/6/7) et la FAQ (`faq.c1.a4`) en plus du texte du formulaire, et remettre `form-action` dans `vercel.json` sur le domaine du prestataire choisi.

**Vérification quotidienne de fraîcheur.** `.github/workflows/daily-freshness-check.yml` lance chaque jour `scripts/check-freshness.js` : vérifie que tous les liens externes du site répondent toujours, et liste les écoles actuellement marquées `urgent: true` dans `js/data.js` pour reconfirmation. Ce script **ne modifie jamais le contenu** : il publie un rapport dans une issue GitHub persistante (« 🔍 Rapport de fraîcheur automatique ») pour revue humaine. Catégorisation volontairement prudente : seuls les 404/410 sont listés comme "probablement morts" ; tout le reste (403, timeout, erreurs réseau) va dans "à vérifier manuellement", car beaucoup de sites bloquent ce script sans être réellement hors service (vécu plusieurs fois en recherche manuelle). Ne jamais faire confiance au rapport pour corriger un lien sans l'avoir vérifié soi-même dans un navigateur d'abord. Déclenchement manuel possible depuis l'onglet Actions du dépôt (`workflow_dispatch`).

**DevSecOps.** Trois workflows de sécurité tournent en CI, avec les actions épinglées sur un SHA (Dependabot les met à jour chaque lundi) :
- `.github/workflows/devsecops.yml` — secrets (Gitleaks), hygiène statique (`scripts/ci-security-hygiene.js`), revue de dépendances (API GitHub si le dépôt est public, sinon `scripts/ci-dependency-gate.js`), Trivy, zizmor.
- `.github/workflows/codeql.yml` — SAST JavaScript + workflows Actions (l'upload vers l'onglet Security est best-effort tant que code scanning / GHAS n'est pas activé).
- `.github/workflows/scorecard.yml` — OpenSSF Scorecard (supply chain).
La divulgation des vulnérabilités est documentée dans `SECURITY.md`. Ne pas réintroduire d'actions épinglées sur un tag mutable (`@v4`) : le script d'hygiène échoue volontairement dans ce cas.

## Pas encore en place

Pas de tests fonctionnels automatisés, pas de protection de branche sur `main` — la vérification visuelle (contenu, accessibilité, régression) se fait manuellement à chaque session, en testant le site réel dans le navigateur avant de pousser. Les contrôles automatisés sont la fraîcheur des liens (informative) et les gates DevSecOps (bloquantes sur PR une fois les checks rendus required).
