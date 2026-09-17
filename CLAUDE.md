# WIYAO — notes pour Claude Code

WIYAO n'est pas qu'un catalogue de roadmaps : c'est un guide qui accompagne le bachelier togolais à chaque étape de son parcours tech — orientation, choix de domaine, de filière, d'université — puis roadmaps de carrière, comparateur d'écoles, calendrier, bourses/financement, stages/emploi, écosystème tech togolais. Site statique (aucun backend, aucune base de données), déployé sur Vercel via l'intégration GitHub (push sur `main` = déploiement auto), dépôt public `GRIIINDER/Wiyao`.

## Stack

Zéro dépendance, zéro build. HTML/CSS/JS vanilla servis tels quels :
- `js/data.js` — source de vérité du contenu : `ROLES`, `SKILLS`, `SCHOOLS`, `DOMAINS`.
- `js/app.js` — rendu (roadmaps, écoles, recherche, quiz d'orientation, formulaire contact) + enregistrement du service worker.
- `js/i18n.js` — toutes les chaînes FR/EN, indexées par `data-i18n-key`.
- `js/nav.js` — menu mobile (chargé sur les 19 pages, contrairement à `app.js`).
- `js/assistant.js` — widget d'assistant.
- `sw.js` — service worker stale-while-revalidate (offline + PWA installable).

## Règles à ne jamais oublier

**Cache-busting.** Chaque `<script src="...">` / `<link href="...">` porte un `?v=N`. Dès qu'un fichier JS/CSS change, bump son `?v=N` sur **les 19 pages HTML** qui le référencent (pas seulement celle qu'on vient d'éditer). Vérifier après coup avec `grep -c` qu'aucune page n'est restée sur l'ancienne version.

**Service worker.** Bump `CACHE_NAME` dans `sw.js` à chaque changement qui touche une page ou un asset précaché. Ajouter les nouveaux assets statiques à `PRECACHE_URLS`. Comportement connu et normal : le tout premier chargement après un déploiement peut encore servir une version en cache le temps de la revalidation en arrière-plan — ce n'est pas un bug si un deuxième chargement affiche le bon contenu.

**i18n.** Toujours faire `node --check js/i18n.js` après une édition — une apostrophe non échappée dans une chaîne EN a déjà cassé la syntaxe. Garder FR et EN synchronisés : une traduction anglaise oubliée après une correction du texte français a déjà introduit une désinformation (badge "Agréé État" avec une liste d'écoles obsolète côté EN).

**Contenu vérifié, jamais deviné.** Aucun fait publié (frais, dates, personnes, statistiques, plateformes, employeurs) sans source citable (site officiel, PDF, article de presse, page gouvernementale). Une piste non confirmée s'exclut et se signale à l'utilisateur plutôt que de se retrouver sur le site avec un chiffre plausible mais inventé.

**Test avant commit.** Ajouter temporairement une deuxième entrée à `.claude/launch.json` (port libre, ex. `wiyao-static-fresh`) pour tester sur un cache vraiment vierge via le navigateur, puis **la retirer avant de committer** — vérifier avec `git diff .claude/launch.json` que le fichier revient à son état d'origine.

**Commit + push.** Committer et pousser sur `origin/main` après chaque changement vérifié, sans demander confirmation à chaque fois (sauf action destructrice/inhabituelle : force-push, réécriture d'historique, suppression de fichiers).

**CSP.** `vercel.json` applique une Content-Security-Policy stricte sur `script-src` (liste blanche par hash SHA-256, pas de `unsafe-inline`). Si le contenu du JSON-LD d'`index.html` (seul script inline restant sur le site) change, il faut recalculer son hash SHA-256 et mettre à jour `vercel.json`, sinon le script sera silencieusement bloqué en production. `style-src` autorise `unsafe-inline` (nécessaire pour les barres de progression, dont la largeur est appliquée en style inline par `app.js`).

**Pas de mode clair.** Le site est volontairement dark-only (aucun bouton de bascule, aucune variable CSS `[data-theme="light"]`) : c'est un choix de design assumé, pas un oubli. Ne pas réintroduire de thème clair sans demande explicite.

**Aucune collecte de données.** WIYAO ne collecte rien côté serveur : la progression sur les roadmaps reste dans `localStorage` du navigateur, et la page Contact ouvre le client email de l'utilisateur (`mailto:`) plutôt que d'envoyer à un serveur. La newsletter (Buttondown) a été retirée le 2026-09-14 : si elle revient un jour, il faudra resynchroniser la politique de confidentialité (section 2 : "Deux actions" → "Trois actions", section 3 base légale, sections 5/6/7) en plus du texte du formulaire.

**Vérification quotidienne de fraîcheur.** `.github/workflows/daily-freshness-check.yml` lance chaque jour `scripts/check-freshness.js` : vérifie que tous les liens externes du site répondent toujours, et liste les écoles actuellement marquées `urgent: true` dans `js/data.js` pour reconfirmation. Ce script **ne modifie jamais le contenu** : il publie un rapport dans une issue GitHub persistante (« 🔍 Rapport de fraîcheur automatique ») pour revue humaine. Catégorisation volontairement prudente : seuls les 404/410 sont listés comme "probablement morts" ; tout le reste (403, timeout, erreurs réseau) va dans "à vérifier manuellement", car beaucoup de sites bloquent ce script sans être réellement hors service (vécu plusieurs fois en recherche manuelle). Ne jamais faire confiance au rapport pour corriger un lien sans l'avoir vérifié soi-même dans un navigateur d'abord. Déclenchement manuel possible depuis l'onglet Actions du dépôt (`workflow_dispatch`).

## Pas encore en place

Pas de tests automatisés, pas de protection de branche sur `main` — la vérification fonctionnelle (contenu, accessibilité, régression visuelle) se fait manuellement à chaque session, en testant le site réel dans le navigateur avant de pousser. Le seul contrôle automatisé est la vérification de fraîcheur des liens/échéances décrite ci-dessus, qui informe mais ne bloque rien.
