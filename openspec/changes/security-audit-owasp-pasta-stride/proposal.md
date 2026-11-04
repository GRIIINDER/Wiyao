# Proposal

## Why

WIYAO a reçu des durcissements ponctuels (en-têtes et CSP, échappement HTML, garde anti-SSRF, workflows DevSecOps), mais aucun audit d'ensemble ni modèle de menaces écrit : la revue de la PR #2 a montré qu'un correctif de sécurité peut lui-même être contournable (adresses IPv6 `::ffff:`) sans que rien ne le détecte. Le bien le plus précieux du site est la **fiabilité de ses informations** pour des bacheliers togolais (frais, dates, bourses) : une altération du contenu ou d'un lien a un impact direct sur des décisions d'orientation. Un audit structuré par trois méthodes complémentaires donne une base vérifiable et des garde-fous durables, maintenant que la PR #8 a établi le niveau de référence en production.

## What Changes

- **Audit de sécurité complet** de `main` (référence : commit déployé en production, après fusion de la PR #8) selon trois méthodes :
  - **PASTA** (7 étapes) pour relier les menaces aux objectifs du site : intégrité de l'information, disponibilité, absence de collecte de données ;
  - **STRIDE** appliqué à chaque élément du diagramme de flux : navigateur, CDN Vercel, service worker et Cache Storage, `localStorage`, passage à la messagerie (`mailto:`), dépôt GitHub, GitHub Actions, script de fraîcheur, intégration Vercel, bibliothèque GSAP embarquée ;
  - **OWASP Top 10:2025**, chaque catégorie étant évaluée, même celle qui ne s'applique pas (l'absence d'authentification et de backend doit être justifiée, pas supposée).
- **Documents publiés dans le dépôt** (`docs/security/`) : modèle de menaces, diagramme de flux avec ses frontières de confiance, correspondance OWASP, registre des constats avec gravité, statut et justification des risques acceptés.
- **Divulgation responsable** : un constat exploitable non corrigé n'est jamais détaillé dans le dépôt public. Il va dans un avis de sécurité GitHub privé jusqu'à sa correction, conformément à `SECURITY.md`.
- **Correction des constats de gravité critique ou élevée** dans ce même changement. Les constats moyens ou faibles sont consignés avec un plan ou une acceptation motivée.
- **Garde-fous de non-régression en CI** (`scripts/ci-security-hygiene.js`), pour des contrôles aujourd'hui manuels ou absents :
  - empreinte SHA-256 du JSON-LD d'`index.html` présente dans la CSP ;
  - empreinte de `js/vendor/gsap.min.js` égale à la valeur de référence ;
  - en-têtes COOP/CORP requis ;
  - pas de `unsafe-inline` dans `script-src`.
- **Déclencheurs de réévaluation** : le modèle de menaces est mis à jour quand une frontière de confiance change (nouvel appel réseau, nouveau tiers, nouveau workflow, nouvelle donnée stockée).

## Capabilities

### New Capabilities
- `security/threat-model` : modèle de menaces et registre des constats du site (PASTA, STRIDE, OWASP Top 10), leur tenue à jour et les règles de divulgation.
- `security/browser-hardening` : protections côté navigateur.
  - En-têtes HTTP et CSP.
  - Encodage des données insérées dans la page et filtrage des liens.
  - Formulaires sans fuite de données personnelles, et cache du service worker.
  - Absence de cookies et de traceurs.
- `security/ci-supply-chain` : intégrité de la chaîne de production.
  - Workflows GitHub Actions à privilèges minimaux, actions épinglées.
  - Intégrité des bibliothèques embarquées.
  - Garde anti-SSRF du script de fraîcheur.
  - Contrôles de sécurité automatisés en CI.

### Modified Capabilities
<!-- Aucune : le projet n'a pas encore de spécification OpenSpec. -->

## Impact

- **Nouveaux fichiers** : `docs/security/threat-model.md`, `docs/security/owasp-top10.md`, `docs/security/findings.md`.
- **Fichiers modifiés** :
  - `scripts/ci-security-hygiene.js` (nouveaux contrôles) ;
  - `SECURITY.md` (lien vers le modèle de menaces) ;
  - `CLAUDE.md` (règle de réévaluation) ;
  - le code concerné par d'éventuels constats critiques ou élevés : `js/*.js`, `sw.js`, `vercel.json`, `.github/workflows/*`.
- **Aucun changement visible pour les visiteurs**, sauf correction d'un constat. Toute modification d'une page ou d'un script suit les règles du dépôt : `?v=N` sur toutes les pages qui chargent le fichier, `CACHE_NAME`, test sur cache vierge.
- **Hypothèses retenues** (à confirmer à la revue) :
  - le périmètre est celui de `SECURITY.md` : site, dépôt, en-têtes, service worker, workflows ; les sites tiers liés en sont exclus ;
  - pas de test d'intrusion actif contre la production au-delà de requêtes HTTP ordinaires ;
  - la liste des catégories OWASP Top 10:2025 est vérifiée sur owasp.org avant usage.
