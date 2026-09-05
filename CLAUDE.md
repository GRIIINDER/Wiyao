# WIYAO — notes pour Claude Code

WIYAO est une plateforme d'orientation tech pour les bacheliers togolais : roadmaps de carrière, comparateur d'écoles, calendrier, bourses/financement, stages/emploi, écosystème tech togolais. Site statique (aucun backend, aucune base de données), déployé sur Vercel via l'intégration GitHub (push sur `main` = déploiement auto), dépôt public `GRIIINDER/Wiyao`.

## Stack

Zéro dépendance, zéro build. HTML/CSS/JS vanilla servis tels quels :
- `js/data.js` — source de vérité du contenu : `ROLES`, `SKILLS`, `SCHOOLS`, `DOMAINS`.
- `js/app.js` — rendu (roadmaps, écoles, recherche, quiz d'orientation, formulaire contact) + enregistrement du service worker.
- `js/i18n.js` — toutes les chaînes FR/EN, indexées par `data-i18n-key`.
- `js/nav.js` — menu mobile (chargé sur les 17 pages, contrairement à `app.js`).
- `js/theme.js` — bascule clair/sombre (`document.documentElement.dataset.theme`).
- `js/assistant.js` — widget d'assistant.
- `sw.js` — service worker stale-while-revalidate (offline + PWA installable).

## Règles à ne jamais oublier

**Cache-busting.** Chaque `<script src="...">` / `<link href="...">` porte un `?v=N`. Dès qu'un fichier JS/CSS change, bump son `?v=N` sur **les 17 pages HTML** qui le référencent (pas seulement celle qu'on vient d'éditer). Vérifier après coup avec `grep -c` qu'aucune page n'est restée sur l'ancienne version.

**Service worker.** Bump `CACHE_NAME` dans `sw.js` à chaque changement qui touche une page ou un asset précaché. Ajouter les nouveaux assets statiques à `PRECACHE_URLS`. Comportement connu et normal : le tout premier chargement après un déploiement peut encore servir une version en cache le temps de la revalidation en arrière-plan — ce n'est pas un bug si un deuxième chargement affiche le bon contenu.

**i18n.** Toujours faire `node --check js/i18n.js` après une édition — une apostrophe non échappée dans une chaîne EN a déjà cassé la syntaxe. Garder FR et EN synchronisés : une traduction anglaise oubliée après une correction du texte français a déjà introduit une désinformation (badge "Agréé État" avec une liste d'écoles obsolète côté EN).

**Contenu vérifié, jamais deviné.** Aucun fait publié (frais, dates, personnes, statistiques, plateformes, employeurs) sans source citable (site officiel, PDF, article de presse, page gouvernementale). Une piste non confirmée s'exclut et se signale à l'utilisateur plutôt que de se retrouver sur le site avec un chiffre plausible mais inventé.

**Test avant commit.** Ajouter temporairement une deuxième entrée à `.claude/launch.json` (port libre, ex. `wiyao-static-fresh`) pour tester sur un cache vraiment vierge via le navigateur, puis **la retirer avant de committer** — vérifier avec `git diff .claude/launch.json` que le fichier revient à son état d'origine.

**Commit + push.** Committer et pousser sur `origin/main` après chaque changement vérifié, sans demander confirmation à chaque fois (sauf action destructrice/inhabituelle : force-push, réécriture d'historique, suppression de fichiers).

**CSP.** `vercel.json` applique une Content-Security-Policy stricte sur `script-src` (liste blanche par hash SHA-256, pas de `unsafe-inline`). Si le contenu du script inline dans `<head>` (anti-flash de thème) ou le JSON-LD d'`index.html` change, il faut recalculer son hash SHA-256 et mettre à jour `vercel.json`, sinon le script sera silencieusement bloqué en production. `style-src` autorise `unsafe-inline` (nécessaire pour les barres de progression, dont la largeur est appliquée en style inline par `app.js`).

## Pas encore en place

Pas de CI/CD (aucun GitHub Action), pas de tests automatisés, pas de protection de branche sur `main` — toute la vérification (fonctionnelle, accessibilité, régression) se fait manuellement à chaque session, en testant le site réel dans le navigateur avant de pousser.
