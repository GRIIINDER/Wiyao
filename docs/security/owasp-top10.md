# Correspondance OWASP Top 10:2025

**Édition de référence** : OWASP Top 10:2025, liste officielle vérifiée le 2026-11-04 sur [top10.owasp.org/2025](https://top10.owasp.org/2025/).

1. A01:2025 – Broken Access Control
2. A02:2025 – Security Misconfiguration
3. A03:2025 – Software Supply Chain Failures
4. A04:2025 – Cryptographic Failures
5. A05:2025 – Injection
6. A06:2025 – Insecure Design
7. A07:2025 – Authentication Failures
8. A08:2025 – Software or Data Integrity Failures
9. A09:2025 – Security Logging and Alerting Failures
10. A10:2025 – Mishandling of Exceptional Conditions

**Commit audité** : `1f4ccf5`, voir [threat-model.md](threat-model.md). Les constats `WIY-SEC-NNN` sont détaillés dans [findings.md](findings.md).

Verdicts possibles : **applicable avec constats**, **applicable sans constat**, **non applicable** (avec le fait observable qui l'écarte).

| Catégorie | Verdict | Constats |
|---|---|---|
| A01 Broken Access Control | Applicable avec constats | WIY-SEC-001, 007, 011 |
| A02 Security Misconfiguration | Applicable avec constats | WIY-SEC-008, 012 |
| A03 Software Supply Chain Failures | Applicable avec constats | WIY-SEC-009, 010 |
| A04 Cryptographic Failures | Applicable sans constat | — |
| A05 Injection | Applicable avec constats | WIY-SEC-002, 003, 004 |
| A06 Insecure Design | Applicable avec constats | WIY-SEC-005, 015 |
| A07 Authentication Failures | Non applicable au site | — |
| A08 Software or Data Integrity Failures | Applicable avec constats | WIY-SEC-007, 010 |
| A09 Security Logging and Alerting Failures | Applicable avec constats | WIY-SEC-016 |
| A10 Mishandling of Exceptional Conditions | Applicable avec constats | WIY-SEC-006, 013 |

---

## A01:2025 – Broken Access Control

**Applicable avec constats.** Le site n'a ni compte ni zone réservée : il n'y a pas de contrôle d'accès à contourner côté visiteur. La catégorie s'applique en revanche à trois endroits.

- **Écriture sur `main`** : deux comptes peuvent pousser, et aucune règle de branche n'impose relecture ni contrôles avant le déploiement automatique (WIY-SEC-007).
- **SSRF** (CWE-918, que l'édition 2025 range dans cette catégorie) : le script de fraîcheur contacte chaque lien du site depuis le runner. La garde ajoutée par la PR #8 refuse les adresses privées, locales et de métadonnées, y compris sous forme IPv6 (WIY-SEC-001, corrigé).
- **Partage entre origines** : Vercel envoie `Access-Control-Allow-Origin: *`. Les pages sont publiques, sans cookie ni authentification, donc aucune lecture d'un autre site ne révèle quoi que ce soit (WIY-SEC-011, accepté).

## A02:2025 – Security Misconfiguration

**Applicable avec constats.** Configuration observée en production (`curl -I https://wiyao.vercel.app/`, 2026-11-04) :
- CSP sans `unsafe-inline` ni `unsafe-eval` pour les scripts, `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self' mailto:` ;
- HSTS sur 2 ans, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, COOP et CORP.

Écarts relevés :
- `style-src 'unsafe-inline'`, nécessaire aux largeurs des barres de progression (WIY-SEC-012, accepté, déjà documenté dans CLAUDE.md) ;
- signalement privé de vulnérabilités désactivé sur le dépôt, alors que `SECURITY.md` demande un signalement privé (WIY-SEC-008).

## A03:2025 – Software Supply Chain Failures

**Applicable avec constats.** Une seule bibliothèque tierce est servie aux visiteurs : GSAP 3.15.0, copiée dans `js/vendor/`. Le fichier déployé est identique, octet pour octet, à celui de l'archive npm, dont l'empreinte `integrity` a été vérifiée (détails dans le modèle de menaces, étape 5). En CI :
- toutes les actions sont épinglées sur un SHA ;
- Dependabot les met à jour chaque semaine avec un délai de 7 jours ;
- le binaire Gitleaks est vérifié par empreinte ;
- Trivy et la revue de dépendances tournent sur chaque PR.

Écarts relevés :
- le workflow de fraîcheur utilise Node 20, en fin de vie depuis le 2026-04-30 selon le [calendrier officiel de Node.js](https://github.com/nodejs/Release/blob/main/schedule.json) (WIY-SEC-009) ;
- aucun contrôle automatique ne détecte une modification de GSAP ou une empreinte de script en ligne périmée (WIY-SEC-010).

## A04:2025 – Cryptographic Failures

**Applicable sans constat.** Le site ne chiffre rien lui-même et ne stocke aucun secret ni mot de passe. Le transport est en HTTPS, imposé par Vercel et par HSTS (`max-age=63072000; includeSubDomains; preload`), et `upgrade-insecure-requests` empêche tout chargement en HTTP clair. Les seules empreintes utilisées (SHA-256 pour la CSP et l'intégrité de GSAP) sont des algorithmes actuels.

## A05:2025 – Injection

**Applicable avec constats, tous corrigés.**

- **XSS par les données** (WIY-SEC-002, corrigé par la PR #8) : les valeurs de `data.js` étaient insérées en `innerHTML` sans encodage. Depuis, `escapeHtml()` les encode, et les notes de communauté passent en `textContent`. Preuve par injection dans le navigateur : 0 exécution sur 6 pages (modèle de menaces, étape 5).
- **Liens `javascript:` ou `data:`** (WIY-SEC-003, corrigé par la PR #8) : `safeUrl()` n'accepte que `http:`, `https:`, `mailto:` et les chemins relatifs. Elle retire aussi tabulations et retours à la ligne, pour que `/\t/hôte` ne passe pas pour un chemin.
- **Formulaires** (WIY-SEC-004, corrigé par la PR #8) : sans JavaScript, ils partaient en `GET` avec nom et e-mail dans l'adresse, adresse que le service worker mettait en cache. Le lien `mailto:` construit en JavaScript encode sujet et corps (`encodeURIComponent`), ce qui empêche d'injecter un destinataire.
- **Insertions de HTML restantes** : `i18n.js` l. 1667, `nav.js` l. 220, 473 et 487, et le squelette de l'assistant n'insèrent que des chaînes écrites dans le code du site. La fenêtre légale importe 4 pages fixes du site et en retire les `<script>`. Verdict : sans constat.
- La CSP ajoute une seconde ligne de défense : même un HTML injecté ne pourrait pas exécuter de script en ligne.

## A06:2025 – Insecure Design

**Applicable avec constats.**
- Jusqu'à cet audit, aucun modèle de menaces écrit n'existait. Un correctif pouvait donc être contourné sans que rien ne le détecte : c'est arrivé avec la garde SSRF de la PR #2 (WIY-SEC-005, corrigé par ce document et sa règle de réévaluation).
- La fiabilité du contenu repose sur la relecture humaine (règle « contenu vérifié » de CLAUDE.md), sans contrôle technique du sens des données. Ce choix est assumé pour un site éditorial et consigné dans le scénario A1.
- Les déploiements de prévisualisation des PR venant de dépôts dérivés n'ont pas pu être vérifiés (WIY-SEC-015).

## A07:2025 – Authentication Failures

**Non applicable au site.** Fait observable : aucune page ne propose de compte, de connexion ni de mot de passe, aucun cookie n'est déposé (`document.cookie` vide sur les 20 pages), et il n'y a pas de backend.

L'authentification des comptes GitHub et Vercel des mainteneurs est hors périmètre. Elle reste une hypothèse de confiance (2FA, modèle de menaces, étape 2), dont dépend WIY-SEC-007.

## A08:2025 – Software or Data Integrity Failures

**Applicable avec constats.**
- **Pas de contrôle obligatoire avant la production** : tout push sur `main` est déployé, même si les contrôles CI échouent ensuite (WIY-SEC-007, accepté avec réexamen).
- **Intégrité de GSAP et des scripts en ligne** : non vérifiée automatiquement avant cet audit (WIY-SEC-010, corrigé par les nouveaux contrôles CI).
- **Cache du service worker** : il ne stocke que des réponses `GET` réussies du site. Une version corrigée remplace l'ancienne au plus tard au chargement suivant, puisque `CACHE_NAME` change à chaque déploiement. Sans constat.

## A09:2025 – Security Logging and Alerting Failures

**Applicable avec constat faible.** Il n'y a pas de serveur applicatif à journaliser. Les traces disponibles sont l'historique Git, le journal d'audit GitHub, les exécutions des Actions et les déploiements Vercel. Le rapport de fraîcheur signale chaque jour les liens morts, mais aucune alerte ne prévient si le contenu servi en production change hors d'un commit attendu, ni si un push inattendu arrive sur `main` (WIY-SEC-016, accepté : les notifications GitHub des deux mainteneurs en tiennent lieu).

## A10:2025 – Mishandling of Exceptional Conditions

**Applicable avec constats.**
- **Stockage refusé** : si le navigateur refuse l'accès à `localStorage`, `app.js` et `i18n.js` lèvent une exception et le catalogue, le test et le calendrier ne s'affichent plus (WIY-SEC-006).
- **Progression de mauvais type** : une progression enregistrée avec un mauvais type provoque une erreur au clic sur une case (WIY-SEC-013, info).
- **Échecs gérés correctement** : échec de lecture d'une page par l'index de recherche (`.catch`), échec de la fenêtre légale (message et lien direct), GSAP absent (contenu affiché sans animation), JSON de progression illisible (`try`/`catch`).
