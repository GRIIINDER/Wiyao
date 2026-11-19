# WIYAO

Le guide qui accompagne les bacheliers togolais qui se lancent dans la tech, à chaque étape : orientation, choix de domaine, de filière, d'université, roadmaps de carrière, bourses et stages/emploi.

**Site en ligne :** [wiyao.app](https://wiyao.app)

## Le projet

WIYAO n'est pas qu'un catalogue de roadmaps : c'est un guide qui suit le bachelier togolais tout au long de son orientation tech, étape par étape.

- **Roadmaps** — plus de 80 métiers et compétences tech, avec les ressources d'apprentissage et le suivi de progression.
- **Écoles & universités** — comparateur des établissements togolais formant à l'informatique, filtrable par ville et statut.
- **Test d'orientation** — 14 questions pour identifier un domaine puis un métier tech précis.
- **Calendrier** — dates clés d'inscription et de concours, école par école.
- **Bourses & financement**, **Stages & emploi**, **Écosystème tech togolais** — communautés, hubs, institutions, cybersécurité, ressources francophones.

Chaque fait publié (frais, dates, employeurs, statistiques) est vérifié auprès d'une source citable — voir [about.html](about.html) pour la méthodologie complète.

## Stack technique

Site statique sans dépendance ni étape de build : HTML/CSS/JS vanilla, publié sur [Cloudflare](https://www.cloudflare.com) (Worker `wiyao`, domaine wiyao.app) par le workflow `.github/workflows/deploy.yml` : chaque push sur `main` lance `wrangler deploy` (configuration `wrangler.jsonc`).

- Progressive Web App installable (`manifest.json` + `sw.js`, cache stale-while-revalidate).
- Bilingue FR/EN (`js/i18n.js`).
- Thème clair/sombre.
- Aucune base de données : le contenu vit dans `js/data.js` et la progression de l'utilisateur reste en local (`localStorage`). Seuls les formulaires Contact et Proposer envoient un message, par e-mail, via le Worker `worker/index.js` (Cloudflare + Resend, secrets `RESEND_API_KEY` et `CONTACT_TO` dans le tableau de bord Cloudflare) — voir [politique-confidentialite.html](politique-confidentialite.html).

Pour les conventions de développement (versioning des assets, discipline de vérification des faits, service worker), voir [CLAUDE.md](CLAUDE.md).

## Lancer le projet en local

Aucune installation nécessaire — n'importe quel serveur statique fonctionne :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Signaler une erreur

Une erreur, une école ou un événement manquant ? Passe par le [formulaire de contact](https://wiyao.app/contact.html) ou la page [Proposer un contenu](https://wiyao.app/proposer.html) du site.

## Droits

Code : tous droits réservés. Contenus rédigés par WIYAO : réutilisables à titre non commercial en citant la source (voir les [mentions légales](https://wiyao.app/mentions-legales.html)).
