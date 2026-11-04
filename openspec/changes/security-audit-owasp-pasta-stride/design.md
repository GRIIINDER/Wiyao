# Design

## Context

Motivation et périmètre : voir `proposal.md`. Exigences : voir `specs/security/*/spec.md`.

Point de départ, observé sur `main` (commit `1f4ccf5`, en production, PR #8 fusionnée) :

- **Site** : 20 pages statiques, sans backend, compte ni cookie.
  - Données dans `js/data.js` ; les pages Écosystème, Bourses, Stages, Actualités, Témoignages et FAQ sont lues par `fetch` et `DOMParser` (index de recherche dans `app.js`, fenêtre légale dans `nav.js`).
  - `escapeHtml()` et `safeUrl()` couvrent `app.js` et l'assistant.
  - `innerHTML` reste utilisé : par `i18n.js` (textes d'interface, ligne 1667), par `nav.js` (fenêtre légale et boutons, lignes 220, 473 et 487) et pour le squelette de l'assistant.
- **Configuration de déploiement** (`vercel.json`) : CSP sans `unsafe-inline` pour les scripts, un seul script en ligne (JSON-LD) autorisé par son empreinte, HSTS, COOP/CORP, `form-action 'self' mailto:`. Production ajoute `Access-Control-Allow-Origin: *` (comportement par défaut de Vercel pour les fichiers statiques, à évaluer).
- **CI** :
  - `ci-security-hygiene.js` vérifie déjà la syntaxe JS, la validité des JSON, 6 en-têtes et l'absence d'`unsafe-eval`, les API dangereuses, les ressources en HTTP clair, l'épinglage des actions et la présence de `SECURITY.md` / `.well-known/security.txt`.
  - `devsecops.yml` lance Gitleaks (binaire vérifié par empreinte, tout l'historique), la revue de dépendances, Trivy et zizmor ; s'y ajoutent CodeQL et Scorecard.
  - Les workflows retirent déjà les permissions par défaut ; le seul jeton en écriture hors analyse est `issues: write` (rapport de fraîcheur).
- **Non vérifié automatiquement aujourd'hui** :
  - l'empreinte du JSON-LD dans la CSP ;
  - l'intégrité de `js/vendor/gsap.min.js` ;
  - les en-têtes COOP/CORP ;
  - `unsafe-inline` dans `script-src` ;
  - les permissions au niveau du workflow.

Contraintes du dépôt : zéro build, une seule bibliothèque tierce, dépôt public, déploiement automatique sur `main`, règles de CLAUDE.md (cache-busting, `CACHE_NAME`, test sur cache vierge, contenu sourcé).

## Goals / Non-Goals

**Goals:**
- Un modèle de menaces que l'on peut relire en une heure et tenir à jour à chaque PR qui touche une frontière.
- Chaque menace mitigée renvoie à une preuve dans le dépôt, de préférence un contrôle CI qui échoue en cas de régression.
- Des contrôles CI sans dépendance nouvelle, en Node standard, dans le script existant.

**Non-Goals:**
- Test d'intrusion actif contre la production (fuzzing, charge, attaques sur Vercel ou GitHub).
- Audit des sites tiers liés, des comptes des mainteneurs (2FA, récupération) ou de Vercel et GitHub eux-mêmes. Ils sont cités comme hypothèses de confiance, pas évalués.
- Ajout d'un outil d'analyse dynamique (ZAP, Burp) dans la CI : le coût dépasse le gain pour un site statique sans saisie côté serveur.
- Protection de branche sur `main` : elle relève des réglages du dépôt, pas du code. Elle est recommandée dans le registre si l'analyse le justifie.

## Decisions

**1. Ordre des méthodes : PASTA encadre, STRIDE détaille, OWASP vérifie.**

PASTA donne le cadre de risque :
- étapes 1 à 3 : objectifs, périmètre technique, décomposition et diagramme de flux ;
- étape 4 : menaces, produites par STRIDE appliqué à chaque élément du diagramme ;
- étape 5 : faiblesses, issues de la revue du code et des constats OWASP ;
- étapes 6 et 7 : scénarios d'attaque, puis risque mesuré par rapport aux objectifs.

L'OWASP Top 10 sert de liste de contrôle croisée, qui garantit qu'aucune famille classique n'est oubliée.

*Alternative écartée* : trois analyses indépendantes. Elles produiraient trois listes redondantes sans priorisation commune.

**2. STRIDE par élément (STRIDE-per-element) plutôt que par interaction.**

Le diagramme comporte une dizaine d'éléments. L'analyse par interaction multiplierait les lignes sans révéler de menace nouvelle sur un site sans état côté serveur.

**3. Gravité : risque qualitatif (probabilité × impact sur l'objectif PASTA) plutôt que CVSS.**

CVSS note des vulnérabilités logicielles isolées et rend mal compte d'un risque comme « fausse information publiée ». L'échelle critique, élevée, moyenne, faible, info est définie dans `docs/security/threat-model.md`. Elle fait de l'intégrité du contenu l'impact maximal.

**4. Documents en Markdown dans `docs/security/`, pas sur le site.**

Ils s'adressent aux mainteneurs et aux chercheurs en sécurité, et `SECURITY.md` y renvoie. Les publier comme pages du site imposerait FR/EN, i18n, bandeaux et cache-busting sans bénéfice pour les bacheliers. Le diagramme de flux est écrit en Mermaid, rendu par GitHub, donc sans image à maintenir.

**5. Divulgation : avis de sécurité GitHub privés pour les constats ouverts.**

Le dépôt est public et le registre est publié. Un constat exploitable non corrigé n'y apparaît que sous forme d'identifiant (voir la spec `security/threat-model`). L'avis privé permet ensuite la publication coordonnée.

*Alternative écartée* : un registre privé hors dépôt. Il deviendrait vite invisible et désynchronisé.

**6. Garde-fous dans `scripts/ci-security-hygiene.js`, pas dans un nouvel outil.**

Le script tourne déjà sur chaque PR, avec le style « erreurs » et « avertissements ». On y ajoute :
- **(a)** le calcul de l'empreinte SHA-256 de chaque `<script>` en ligne des pages, comparée à `script-src` ;
- **(b)** l'empreinte de `js/vendor/gsap.min.js`, comparée à une valeur de référence consignée avec la version, la source npm et la date ;
- **(c)** COOP et CORP ajoutés aux en-têtes requis, et `unsafe-inline` interdit dans `script-src` ;
- **(d)** chaque workflow doit déclarer `permissions` au niveau du workflow.

Les déclencheurs dangereux (`pull_request_target`) restent du ressort de zizmor, qui les détecte déjà : on ne duplique pas.

*Alternative écartée* : du SRI (`integrity=`) sur la balise GSAP. Le fichier est servi par le même domaine, donc la protection utile se place à l'entrée du dépôt (CI), pas au chargement.

**7. Le calcul d'empreinte du JSON-LD reproduit celui du navigateur.**

Le navigateur calcule l'empreinte sur le contenu exact entre les balises, espaces et fins de ligne compris. Or le dépôt convertit les fins de ligne (CRLF sur Windows, LF dans Git). Le contrôle calcule donc l'empreinte sur le contenu avec fins de ligne LF, comme servi par Vercel, et l'auteur doit le tester sur les deux.

**8. Corrections dans le même changement, une PR distincte par constat élevé si nécessaire.**

Les documents et les garde-fous forment une PR. Un correctif qui touche des pages suit les règles de cache-busting et peut partir dans sa propre PR, pour garder une revue lisible.

## Risks / Trade-offs

- [Le modèle de menaces se périme dès la PR suivante] → règle de réévaluation dans la spec, rappel dans CLAUDE.md et dans `SECURITY.md`, et liste des déclencheurs en tête du document.
- [Faux sentiment de sécurité : « audit fait »] → le registre date chaque évaluation et indique le commit audité ; il reste explicitement hors périmètre ce que la section Non-Goals écarte.
- [Le contrôle d'empreinte du JSON-LD diffère du navigateur à cause des fins de ligne] → calcul sur la forme LF ; si un doute subsiste, test dans un navigateur (console sans violation CSP) avant la fusion de la première PR.
- [Une mise à jour légitime de GSAP fait échouer la CI] → c'est voulu ; la procédure de CLAUDE.md (vérification `integrity` npm) indique de mettre à jour l'empreinte de référence dans le même commit.
- [`Access-Control-Allow-Origin: *` envoyé par Vercel] → probablement sans risque pour un site public sans authentification ni cookie ; à confirmer dans l'analyse et à consigner comme accepté ou à retirer par en-tête.
- [Publication involontaire d'un détail exploitable] → relecture des documents avant fusion avec la question explicite « un constat ouvert est-il décrit ? ».

## Migration Plan

1. PR « audit » : `docs/security/*`, nouveaux contrôles CI, liens dans `SECURITY.md` et CLAUDE.md. Aucun changement visible pour les visiteurs : pas de `?v=` ni de `CACHE_NAME` à changer, sauf si un fichier du site est modifié.
2. Corrections des constats critiques ou élevés : une PR chacune si elles touchent des pages, avec les règles habituelles (cache-busting, test sur cache vierge).
3. Retour arrière : les contrôles CI se désactivent en annulant leur commit ; les documents n'ont pas d'effet sur le site.

## Open Questions

- Liste exacte des catégories de l'OWASP Top 10:2025 dans sa version finale. À vérifier sur owasp.org lors de la rédaction : le nombre de catégories et la méthode n'en dépendent pas.
- L'avis de sécurité privé de GitHub est-il activé sur le dépôt (« Private vulnerability reporting ») ? Sinon, le mainteneur l'active ; cela ne change pas le plan.
