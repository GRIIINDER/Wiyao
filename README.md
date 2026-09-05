# WIYAO

Roadmaps de carrière, comparateur d'écoles et opportunités de stages/emploi pour les bacheliers togolais qui se lancent dans la tech.

**Site en ligne :** [wiyao.vercel.app](https://wiyao.vercel.app)

## Le projet

WIYAO couvre tout le parcours d'orientation tech au Togo :

- **Roadmaps** — plus de 80 métiers et compétences tech, avec les ressources d'apprentissage et le suivi de progression.
- **Écoles & universités** — comparateur des établissements togolais formant à l'informatique, filtrable par ville et statut.
- **Test d'orientation** — 14 questions pour identifier un domaine puis un métier tech précis.
- **Calendrier** — dates clés d'inscription et de concours, école par école.
- **Bourses & financement**, **Stages & emploi**, **Écosystème tech togolais** — communautés, hubs, institutions, cybersécurité, ressources francophones.

Chaque fait publié (frais, dates, employeurs, statistiques) est vérifié auprès d'une source citable — voir [about.html](about.html) pour la méthodologie complète.

## Stack technique

Site statique sans dépendance ni étape de build : HTML/CSS/JS vanilla, déployé sur [Vercel](https://vercel.com) via l'intégration GitHub (chaque push sur `main` déclenche un déploiement).

- Progressive Web App installable (`manifest.json` + `sw.js`, cache stale-while-revalidate).
- Bilingue FR/EN (`js/i18n.js`).
- Thème clair/sombre.
- Aucune base de données : le contenu vit dans `js/data.js`, la progression de l'utilisateur reste en local (`localStorage`) — aucune donnée personnelle collectée (voir [politique-confidentialite.html](politique-confidentialite.html)).

Pour les conventions de développement (versioning des assets, discipline de vérification des faits, service worker), voir [CLAUDE.md](CLAUDE.md).

## Lancer le projet en local

Aucune installation nécessaire — n'importe quel serveur statique fonctionne :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Contribuer

Une erreur, une école ou un événement manquant ? [Ouvre une issue](https://github.com/GRIIINDER/Wiyao/issues) ou passe par le [formulaire de contact](https://wiyao.vercel.app/contact.html) du site.

## Licence

[MIT](LICENSE)
