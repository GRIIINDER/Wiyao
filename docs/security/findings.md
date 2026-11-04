# Registre des constats de sécurité

Audit du 2026-11-04, commit `1f4ccf5`. Méthode et échelle de gravité : [threat-model.md](threat-model.md). Correspondance OWASP : [owasp-top10.md](owasp-top10.md).

**Règle de divulgation** : un constat exploitable non corrigé n'est jamais détaillé ici. Le registre n'en donne que l'identifiant, la gravité et la mention « détails privés », et il est suivi dans un [avis de sécurité privé](https://github.com/GRIIINDER/Wiyao/security/advisories) jusqu'à sa correction. Le signalement privé de vulnérabilités doit d'abord être activé : voir WIY-SEC-008.

## Bilan

| Gravité | Corrigé | Accepté | Planifié |
|---|---|---|---|
| Critique | 0 | 0 | 0 |
| Élevée | 0 | 0 | 0 |
| Moyenne | 4 | 1 | 0 |
| Faible | 4 | 3 | 1 |
| Info | 1 | 1 | 1 |

**Aucun constat critique ou élevé** au commit audité. Les quatre constats moyens corrigés l'ont été par la PR #8 (avant l'audit) ou par la PR de cet audit.

## Constats

| ID | Constat | Méthode | OWASP | Gravité | Statut | Preuve |
|---|---|---|---|---|---|---|
| WIY-SEC-001 | La garde anti-SSRF du script de fraîcheur était absente, puis contournable par les adresses IPv4 écrites en IPv6 (`::ffff:a9fe:a9fe`) dans la version proposée par la PR #2. | Revue de code, STRIDE E8-T | A01 | Moyenne | Corrigé | PR #8 (`net.BlockList`, redirections revérifiées) ; 21 adresses testées |
| WIY-SEC-002 | Les valeurs de `js/data.js` étaient insérées en `innerHTML` sans encodage (XSS par une donnée). | Revue de code, STRIDE E1-T | A05 | Moyenne | Corrigé | PR #8 (`escapeHtml()`) ; injection rejouée le 2026-11-04 : 0 exécution sur 6 pages |
| WIY-SEC-003 | Les liens construits à partir des données n'étaient pas filtrés (`javascript:`, `data:`). | Revue de code, STRIDE E1-T | A05 | Moyenne | Corrigé | PR #8 (`safeUrl()`) ; 0 lien `javascript:` dans le DOM après injection |
| WIY-SEC-004 | Sans JavaScript, les formulaires Contact et Proposer partaient en `GET`, nom et e-mail dans l'adresse, adresse que le service worker mettait en cache. | STRIDE E3-I, E5-I | A05 | Faible | Corrigé | PR #8 (`POST` vers `mailto:`, pages avec paramètres jamais mises en cache) ; vérifié : 0 entrée `.html?` dans Cache Storage |
| WIY-SEC-005 | Aucun modèle de menaces écrit : un correctif pouvait être contourné sans que rien ne le détecte. | PASTA étape 1 | A06 | Faible | Corrigé | PR de cet audit (`docs/security/`, règle de réévaluation dans CLAUDE.md et `SECURITY.md`) |
| WIY-SEC-006 | Si le navigateur refuse l'accès au stockage, `app.js` et `i18n.js` lèvent une exception : roadmaps, écoles, test et calendrier ne s'affichent plus. | STRIDE E1-D, E4-D ; test dans le navigateur | A10 | Moyenne | Corrigé | PR de cet audit (accès au stockage protégés) ; avant : 0 carte affichée ; après : 89 cartes, 32 écoles, 32 dates, 0 erreur |
| WIY-SEC-007 | `main` n'a aucune règle de branche, et tout push y est déployé en production sans contrôle obligatoire. Un compte ou un jeton volé parmi les deux qui peuvent pousser suffirait à publier une fausse information. Les commits poussés en ligne de commande ne sont pas signés. | STRIDE E6-S, E9-T ; scénario A5 | A01, A08 | Moyenne | Accepté | Décision du mainteneur du 2026-11-04 : flux de travail actuel conservé, protection reposant sur la 2FA des deux comptes. **Réexamen : 2027-02-04** (envisager une règle exigeant une PR et les contrôles DevSecOps) |
| WIY-SEC-008 | Le signalement privé de vulnérabilités est désactivé, alors que `SECURITY.md` demande un signalement privé. L'état du *secret scanning* et de la protection à la poussée n'est pas visible avec un compte non administrateur. | Revue des réglages | A02 | Faible | Planifié | À activer par l'administrateur (GRIIINDER) : Settings → Security → *Private vulnerability reporting* ; vérifier *Secret scanning* et *Push protection* au même endroit. **Échéance : 2026-11-30** |
| WIY-SEC-009 | Le workflow de fraîcheur utilisait Node 20, en fin de vie depuis le 2026-04-30 ([calendrier Node.js](https://github.com/nodejs/Release/blob/main/schedule.json)), avec un jeton `issues: write`. | STRIDE E8-E | A03 | Faible | Corrigé | PR de cet audit (Node 24, maintenu jusqu'au 2028-04-30) |
| WIY-SEC-010 | Aucun contrôle automatique ne vérifiait l'empreinte du JSON-LD dans la CSP, l'intégrité de GSAP, les en-têtes COOP/CORP, l'absence de `unsafe-inline` dans `script-src` ni les `permissions` des workflows. | STRIDE E6-T, E7-E, E10-T | A03, A08 | Faible | Corrigé | PR de cet audit (`scripts/ci-security-hygiene.js`, contrôles 3, 8, 9 et 10) ; chaque contrôle échoue sur une copie altérée et passe sur l'arbre réel, y compris en CRLF |
| WIY-SEC-011 | Vercel envoie `Access-Control-Allow-Origin: *` : n'importe quel site peut lire les pages par `fetch`. | STRIDE E2-I | A01 | Info | Accepté | Pages publiques, sans cookie ni authentification : rien de privé à lire. **Réexamen** dès qu'une donnée non publique ou un cookie apparaît |
| WIY-SEC-012 | `style-src 'unsafe-inline'` dans la CSP. | Revue de configuration | A02 | Faible | Accepté | Nécessaire aux largeurs des barres de progression (CLAUDE.md, « CSP ») ; les scripts restent interdits en ligne. **Réexamen** si ces largeurs passent en classes ou en variables CSS |
| WIY-SEC-013 | Une progression enregistrée avec un mauvais type (stockage modifié à la main) provoquait une erreur au clic sur une case. | Test dans le navigateur | A10 | Info | Corrigé | PR de cet audit (seules les listes sont reprises) ; vérifié : clic sans erreur |
| WIY-SEC-014 | Le script de fraîcheur résout un nom deux fois (vérification, puis requête) : un DNS piégé pourrait répondre une adresse publique puis privée. | STRIDE E8-T | A01 | Faible | Accepté | Limite documentée dans le script ; requêtes `HEAD`/`GET` sans en-tête personnalisé, seul le code de statut revient. **Réexamen : 2027-05-04** |
| WIY-SEC-015 | Le comportement des déploiements de prévisualisation Vercel pour les PR venant de dépôts dérivés n'a pas pu être vérifié (pas d'accès au tableau de bord Vercel). | STRIDE E9-S | A06 | Info | Planifié | À vérifier par le mainteneur dans Vercel → Settings → Git (protection des dépôts dérivés activée). **Échéance : 2026-11-30** |
| WIY-SEC-016 | Aucune alerte ne prévient d'un push inattendu sur `main` ni d'un changement du contenu servi hors d'un commit attendu. | PASTA étape 7, scénario A5 | A09 | Faible | Accepté | Les notifications GitHub des deux mainteneurs en tiennent lieu. **Réexamen : 2027-02-04**, avec WIY-SEC-007 |

## Vérifications d'ensemble (2026-11-04)

- **Navigateur, 20 pages**, puis test d'orientation, recherche, assistant, case de roadmap, changement de langue et fenêtre légale :
  - `document.cookie` vide, 0 cookie dans le navigateur ;
  - **0 requête vers un autre domaine** ;
  - `localStorage` limité à `wiyao-lang` et `wiyao-progress` ;
  - 0 erreur JavaScript.
- **Production** (`curl -I`) : les 8 en-têtes exigés (CSP, HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP, CORP) sont présents sur les 20 pages et sur les fichiers statiques testés (GSAP, police, manifeste).
- **Divulgation** : relecture des trois documents le 2026-11-04 avec la question « un constat exploitable ouvert est-il décrit publiquement ? ». Réponse : non. Les constats encore ouverts (WIY-SEC-007, 008, 015, 016) sont des réglages ou des risques acceptés, pas des failles exploitables. Aucun avis privé n'a donc été nécessaire.
