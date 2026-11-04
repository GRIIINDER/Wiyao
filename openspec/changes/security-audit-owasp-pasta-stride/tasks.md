# Tasks

## 1. Cadrage de l'audit

- [x] 1.1 Noter le commit audité (le SHA déployé en production) et la date en tête de `docs/security/threat-model.md`. Vérification : le SHA correspond au dernier déploiement « Production » (`gh api repos/GRIIINDER/Wiyao/deployments`).
- [x] 1.2 Vérifier sur owasp.org la liste officielle des catégories de l'OWASP Top 10:2025 et noter le lien de la source. Vérification : les 10 intitulés et le lien figurent en tête de `docs/security/owasp-top10.md`.
- [ ] 1.3 Vérifier que le signalement privé de vulnérabilités est activé sur le dépôt (`gh api repos/GRIIINDER/Wiyao/private-vulnerability-reporting`). S'il ne l'est pas, demander au mainteneur de l'activer. Vérification : la réponse vaut `"enabled": true`.

## 2. PASTA étapes 1 à 3 : objectifs, périmètre, décomposition

- [x] 2.1 Rédiger l'étape 1 (objectifs métier et actifs) dans `docs/security/threat-model.md` : l'intégrité de l'information publiée est l'actif principal, puis la disponibilité et l'absence de collecte de données. Y définir l'échelle de gravité (critique → info). Vérification : chaque actif est relié à au moins un objectif.
- [x] 2.2 Rédiger l'étape 2 (périmètre technique) : pages, scripts, `vercel.json`, `sw.js`, workflows, script de fraîcheur, GSAP embarqué. Lister à part les éléments hors périmètre et les hypothèses de confiance (Vercel, GitHub, comptes des mainteneurs). Vérification : le périmètre est identique à celui de `SECURITY.md`.
- [x] 2.3 Dessiner le diagramme de flux en Mermaid avec ses frontières de confiance, et nommer chaque flux et ses données (étape 3). Vérification : l'aperçu GitHub du fichier rend le diagramme, et les 10 éléments exigés par la spec `security/threat-model` y figurent.

## 3. STRIDE par élément (PASTA étape 4)

- [x] 3.1 Remplir la table STRIDE pour les éléments du site (navigateur, CDN Vercel, service worker et Cache Storage, `localStorage`, passage `mailto:`, lecture de pages par `fetch`/`DOMParser`). Vérification : aucune des 6 colonnes n'est vide pour chaque élément.
- [x] 3.2 Remplir la table STRIDE pour la chaîne de production (dépôt et contributions par PR, GitHub Actions et jetons, script de fraîcheur, intégration de déploiement Vercel avec ses déploiements de prévisualisation, GSAP embarqué, Dependabot). Vérification : chaque mitigation citée renvoie à un fichier, un en-tête, un contrôle CI ou un réglage.

## 4. Analyse des faiblesses et correspondance OWASP (PASTA étape 5)

- [x] 4.1 Relire chaque insertion de HTML restante (`i18n.js` ligne 1667, `nav.js` lignes 220, 473 et 487, squelette de l'assistant) et confirmer que seul du contenu écrit dans le code du site y passe. Classer tout cas contraire comme constat. Vérification : chaque insertion est listée dans `docs/security/owasp-top10.md` (catégorie Injection) avec son verdict.
- [x] 4.2 Prouver l'encodage des données dans le navigateur : servir localement une copie de `data.js` modifiée à la volée (interception Playwright) avec `<img src=x onerror=alert(1)>` dans un nom d'école, une note de communauté et une question du test, et un lien `javascript:` dans `site`. Vérification : aucune boîte de dialogue, le texte s'affiche tel quel, aucun lien `javascript:` dans le DOM.
- [x] 4.3 Contrôler la fenêtre « Informations légales » et l'index de recherche (lecture de pages du site par `DOMParser`). Vérifier qu'aucune adresse lue ne peut viser un autre domaine et que le contenu inséré provient des 4 pages légales. Vérification : verdict consigné, et constat ouvert si une adresse dépend d'une donnée.
- [x] 4.4 Évaluer `Access-Control-Allow-Origin: *` envoyé par Vercel, la portée du service worker et l'empoisonnement possible de son cache, ainsi que la lecture de `localStorage` (valeurs corrompues ou clé `__proto__`). Vérification : chaque point a un verdict et, si besoin, un constat dans le registre.
- [x] 4.5 Évaluer la chaîne de production : permissions de chaque workflow, déclencheurs, exposition de `GITHUB_TOKEN`, déploiements de prévisualisation Vercel pour les PR de dépôts dérivés, et contenu du rapport de fraîcheur publié dans une issue (injection Markdown par une URL). Vérification : verdicts consignés, et constat ouvert pour toute permission en écriture non justifiée.
- [x] 4.6 Remplir `docs/security/owasp-top10.md` : un verdict justifié par catégorie (applicable avec constats, sans constat, non applicable), chaque catégorie non applicable citant le fait observable qui l'écarte. Vérification : 10 catégories, aucune sans justification.

## 5. Scénarios d'attaque et registre (PASTA étapes 6 et 7)

- [x] 5.1 Écrire les scénarios d'attaque (étape 6), chacun relié à une menace STRIDE et à une faiblesse de l'étape 5. Au minimum :
  - PR malveillante sur `data.js` ou `js/vendor/` ;
  - redirection SSRF via un lien externe ;
  - altération d'un lien d'inscription d'école ;
  - compromission d'une action GitHub.

  Vérification : chaque scénario cite ses références.
- [x] 5.2 Créer `docs/security/findings.md` : identifiant stable (WIY-SEC-NNN), méthode, gravité, statut, preuve. Y reporter les constats déjà corrigés par la PR #8 (SSRF IPv6, lien d'assistant, filtrage des liens) avec le lien de la PR. Vérification : chaque constat a les 5 champs, et chaque statut « corrigé » cite un commit ou une PR.
- [x] 5.3 Évaluer le risque de chaque scénario (étape 7) par rapport aux objectifs de l'étape 1, et reporter la gravité dans le registre. Vérification : aucun constat sans gravité ; les critiques et élevés sont listés en tête.
- [x] 5.4 Pour chaque constat exploitable encore ouvert : créer un avis de sécurité GitHub privé et ne laisser dans le registre public que l'identifiant, la gravité et « détails privés ». Vérification : `grep` sur les documents ne trouve aucun détail technique d'un constat ouvert.

## 6. Correction des constats critiques et élevés

- [x] 6.1 Corriger chaque constat critique ou élevé (une PR par constat s'il touche des pages), en respectant les règles du dépôt :
  - `?v=N` sur toutes les pages qui chargent le fichier, `CACHE_NAME` bumpé ;
  - test sur cache vierge ;
  - `node --check` sur les fichiers JS.

  Vérification : le scénario de la spec concernée est rejoué et passe, et le registre passe en « corrigé » avec le lien. S'il n'y a aucun constat de ce niveau, l'écrire dans le registre.
- [x] 6.2 Pour chaque constat moyen ou faible, consigner soit une correction, soit une acceptation motivée avec une date de réexamen. Vérification : aucun constat n'est « planifié » sans échéance.

## 7. Garde-fous CI dans `scripts/ci-security-hygiene.js`

- [x] 7.1 Ajouter le contrôle de l'empreinte SHA-256 de chaque script en ligne des pages, comparée à `script-src`, sur la forme à fins de ligne LF. Vérification :
  - le script passe sur l'arbre actuel ;
  - il échoue en affichant l'empreinte attendue quand le JSON-LD est modifié dans une copie temporaire ;
  - l'empreinte calculée est identique à celle qui figure dans `vercel.json`.
- [x] 7.2 Ajouter l'empreinte de référence de `js/vendor/gsap.min.js` (version, source npm, date) et son contrôle. Vérification : passe sur l'arbre actuel ; échoue si un octet du fichier change dans une copie temporaire.
- [x] 7.3 Ajouter COOP et CORP aux en-têtes requis, et interdire `unsafe-inline` dans `script-src`. Vérification : échec si l'un des deux en-têtes est retiré ou si `unsafe-inline` est ajouté dans une copie temporaire de `vercel.json`.
- [x] 7.4 Exiger la déclaration de `permissions` au niveau de chaque workflow. Vérification : passe sur les 4 workflows actuels ; échoue sur un workflow de test sans `permissions`.
- [x] 7.5 Documenter les nouveaux contrôles en tête du script et dans la section DevSecOps de CLAUDE.md, y compris la procédure de mise à jour de l'empreinte GSAP. Vérification : `node scripts/ci-security-hygiene.js` passe, et `git diff` ne montre aucun fichier temporaire de test.

## 8. Publication et règle de réévaluation

- [x] 8.1 Ajouter dans `SECURITY.md` un lien vers `docs/security/` et la date du dernier audit. Vérification : les liens fonctionnent dans l'aperçu GitHub.
- [x] 8.2 Ajouter à CLAUDE.md la règle de réévaluation : toute PR qui change une frontière de confiance met à jour le modèle de menaces dans le même changement. Lister les déclencheurs. Vérification : la règle figure dans les « Règles à ne jamais oublier ».
- [x] 8.3 Relire les trois documents avec une question unique : un constat ouvert est-il décrit publiquement ? Vérification : la réponse est non, et la relecture est notée dans le registre.

## 9. Vérification d'ensemble

- [x] 9.1 Rejouer dans un navigateur, sur cache vierge, les scénarios de `security/browser-hardening` sur les 20 pages : `document.cookie` vide, aucune requête vers un autre domaine, `localStorage` limité aux clés de langue et de progression, en-têtes présents. Vérification : résultat chiffré consigné dans le registre.
- [x] 9.2 Ouvrir la PR « audit » et vérifier que tous les workflows DevSecOps, CodeQL et le contrôle d'hygiène passent. Vérification : tous les contrôles de la PR sont au vert.
- [x] 9.3 Lancer `openspec validate security-audit-owasp-pasta-stride --strict` et corriger tout écart entre les documents livrés et les specs. Vérification : la validation passe.

## Workflow follow-up

- Archiver le change une fois la PR fusionnée et le registre à jour (`/opsx:archive`).
- Vérifier que les specs archivées dans `openspec/specs/security/` reprennent bien les trois capacités.
