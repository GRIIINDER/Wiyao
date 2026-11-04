# Spec Delta

## Purpose

Définir les protections que le site WIYAO garantit dans le navigateur du visiteur : en-têtes HTTP, politique de contenu, affichage sûr des données, liens, formulaires, cache hors ligne et absence de suivi.

## ADDED Requirements

### Requirement: En-têtes de sécurité sur chaque réponse
Chaque réponse du site MUST porter les en-têtes `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin` et `Cross-Origin-Resource-Policy: same-origin`.

#### Scenario: Page HTML
- **WHEN** un navigateur charge n'importe quelle page du site
- **THEN** la réponse contient tous ces en-têtes avec les valeurs déclarées dans la configuration de déploiement

#### Scenario: Fichier statique
- **WHEN** un navigateur charge un script, une feuille de style, une police ou le manifeste
- **THEN** la réponse porte les mêmes en-têtes

### Requirement: Scripts limités au site
La politique de contenu MUST n'autoriser que les scripts servis par le site lui-même et les scripts en ligne listés par leur empreinte SHA-256. Elle MUST NOT contenir `unsafe-inline` ni `unsafe-eval` dans `script-src`.

#### Scenario: Script en ligne modifié
- **WHEN** le contenu d'un script en ligne change sans que son empreinte soit mise à jour dans la politique
- **THEN** la vérification automatisée échoue avant le déploiement

#### Scenario: Script tiers injecté
- **WHEN** une page tente de charger un script depuis un autre domaine
- **THEN** le navigateur le bloque

### Requirement: Données affichées comme du texte
Toute donnée de contenu MUST s'afficher comme du texte et jamais être interprétée comme du HTML. Cela vaut pour le catalogue (roadmaps, écoles, dates, communautés, questions du test) et pour les éléments lus dans d'autres pages pour la recherche. Seuls les textes d'interface écrits dans le code du site peuvent contenir du balisage.

#### Scenario: Balise dans une donnée
- **WHEN** une valeur du catalogue contient `<img src=x onerror=alert(1)>`
- **THEN** la page affiche ce texte tel quel et n'exécute aucun script

#### Scenario: Caractères spéciaux légitimes
- **WHEN** une valeur contient `&`, `<` ou des guillemets (par exemple « Hack & Defend »)
- **THEN** ils s'affichent correctement, sans entité visible comme `&amp;`

### Requirement: Liens filtrés
Un lien construit à partir d'une donnée MUST être un lien `http:`, `https:` ou `mailto:`, ou un chemin relatif du site. Tout autre schéma (`javascript:`, `data:`…) et toute adresse qui sortirait du site sans schéma (`//hôte`, avec tabulation ou retour à la ligne) MUST être refusés.

#### Scenario: Schéma dangereux
- **WHEN** une donnée fournit `javascript:alert(1)` comme lien
- **THEN** aucun lien cliquable n'est créé

#### Scenario: Repli sur la page du site
- **WHEN** le lien externe d'un résultat de recherche ou de l'assistant est refusé
- **THEN** le résultat renvoie à la page du site où vit l'élément, et ne s'affiche jamais sans lien

### Requirement: Liens externes isolés
Un lien qui ouvre un autre site dans un nouvel onglet MUST empêcher la page ouverte d'agir sur WIYAO (`noopener`) et de connaître la page d'origine (`noreferrer`).

#### Scenario: Ouverture d'un site d'école
- **WHEN** le visiteur ouvre le site officiel d'une école depuis sa fiche
- **THEN** la nouvelle page n'a pas accès à `window.opener` et ne reçoit pas l'adresse de la page WIYAO

### Requirement: Formulaires sans fuite de données personnelles
Les formulaires Contact et Proposer MUST transmettre leurs données uniquement à la messagerie du visiteur. Les données personnelles (nom, e-mail, message) MUST NOT apparaître dans l'adresse d'une page ni être envoyées à un serveur, même sans JavaScript.

#### Scenario: Envoi avec JavaScript
- **WHEN** le visiteur valide le formulaire
- **THEN** sa messagerie s'ouvre avec le sujet et le message pré-remplis, et aucune requête réseau ne part vers un serveur

#### Scenario: Envoi sans JavaScript
- **WHEN** JavaScript est désactivé et le visiteur valide le formulaire
- **THEN** les données partent vers la messagerie, et l'adresse de la page ne contient ni nom ni e-mail

#### Scenario: Envoi vers un autre site
- **WHEN** un formulaire vise une destination autre que le site ou `mailto:`
- **THEN** la politique de contenu bloque l'envoi

### Requirement: Cache hors ligne sans données personnelles
Le service worker MUST mettre en cache uniquement des réponses `GET` du site lui-même. Il MUST NOT stocker une page HTML dont l'adresse contient des paramètres. Hors ligne, une telle page est servie à partir de la même page sans paramètres.

#### Scenario: Page avec paramètres
- **WHEN** le visiteur ouvre `contact.html?name=…` ou `roadmap.html?id=…`
- **THEN** aucune entrée de Cache Storage ne contient cette adresse

#### Scenario: Hors ligne
- **WHEN** le visiteur hors ligne ouvre `roadmap.html?id=backend` alors que `roadmap.html` est en cache
- **THEN** la roadmap s'affiche

### Requirement: Aucun suivi ni cookie
Le site MUST NOT déposer de cookie ni charger d'outil de mesure ou de publicité tiers. Le stockage local du navigateur MUST se limiter à la langue choisie et à la progression sur les roadmaps.

#### Scenario: Visite complète
- **WHEN** un visiteur parcourt toutes les pages et utilise le test, la recherche et l'assistant
- **THEN** `document.cookie` reste vide, aucune requête ne part vers un autre domaine, et `localStorage` ne contient que les clés de langue et de progression

### Requirement: Contenu de pages lu sur le site seulement
Les fonctions qui lisent d'autres pages pour les réutiliser (index de recherche, fenêtre « Informations légales ») MUST ne lire que des pages du site lui-même. Ce qu'elles en reprennent MUST suivre la règle « Données affichées comme du texte », sauf les sections légales, insérées comme contenu du site.

#### Scenario: Index de recherche
- **WHEN** la recherche lit `stages-emploi.html` pour construire son index
- **THEN** titres et descriptions sont repris comme du texte, et seul l'attribut `href` des liens est conservé, après filtrage
