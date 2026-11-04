# Politique de sécurité / Security policy

WIYAO est un site statique public (HTML/CSS/JS, sans backend ni base de données).
Merci de signaler toute vulnérabilité de façon **privée** — pas via une issue GitHub publique.

WIYAO is a public static site (HTML/CSS/JS, no backend or database).
Please report vulnerabilities **privately** — do not open a public GitHub issue.

## Signalement / Reporting

- Email : [wiya.info@gmail.com](mailto:wiya.info@gmail.com)
- Formulaire : [https://wiyao.vercel.app/contact.html](https://wiyao.vercel.app/contact.html)
- `security.txt` : [https://wiyao.vercel.app/.well-known/security.txt](https://wiyao.vercel.app/.well-known/security.txt)

Langues préférées / preferred languages : français, English.

Inclus si possible / please include if you can :

- une description du problème et de son impact ;
- les étapes pour le reproduire, ou une preuve de concept ;
- l’URL / le fichier concerné.

## Périmètre / Scope

In scope : le site [wiyao.vercel.app](https://wiyao.vercel.app), le dépôt [GRIIINDER/Wiyao](https://github.com/GRIIINDER/Wiyao), les en-têtes HTTP (`vercel.json`), le service worker, et les workflows GitHub Actions.

Hors périmètre / out of scope : les sites tiers liés depuis le contenu (écoles, bourses, employeurs), le phishing social, et les dénis de service volumétriques.

## Ce que nous demandons / What we ask

- Ne pas exploiter une faille au-delà de ce qui est nécessaire pour la démontrer.
- Ne pas exfiltrer de données d’autres personnes (WIYAO n’en collecte pas côté serveur ; la progression vit dans `localStorage`).
- Nous laisser le temps de corriger avant toute divulgation publique.

Do not exploit a finding beyond what is needed to demonstrate it, and give us time to fix it before public disclosure.

## Réponse / Response

Nous lisons les signalements et répondons dès que possible. Il n’y a pas de programme de bug bounty.

We read reports and reply as soon as we can. There is no bug bounty program.

## Modèle de menaces / Threat model

Dernier audit / last audit : **2026-11-04** (PASTA, STRIDE, OWASP Top 10:2025), commit `1f4ccf5`.

- [Modèle de menaces / threat model](docs/security/threat-model.md)
- [Correspondance OWASP Top 10:2025 / OWASP mapping](docs/security/owasp-top10.md)
- [Registre des constats / findings register](docs/security/findings.md)

Toute modification d’une frontière de confiance (nouvel appel réseau, nouveau tiers, nouveau workflow ou permission, nouvelle donnée stockée ou envoyée) met à jour ce modèle dans la même PR.

Any change to a trust boundary (new network call, third party, workflow or permission, or new stored or sent data) updates the threat model in the same pull request.
