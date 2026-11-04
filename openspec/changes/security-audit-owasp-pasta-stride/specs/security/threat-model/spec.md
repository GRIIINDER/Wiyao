# Spec Delta

## Purpose

Garantir que la sécurité de WIYAO repose sur un modèle de menaces écrit, vérifiable et tenu à jour (PASTA, STRIDE, OWASP Top 10), et que chaque constat d'audit a un statut traçable sans exposer publiquement une faille non corrigée.

## ADDED Requirements

### Requirement: Modèle de menaces publié
Le dépôt MUST contenir un modèle de menaces décrivant le périmètre de `SECURITY.md`. Il comprend un diagramme de flux de données, avec chaque élément (acteur, processus, stockage, flux) et chaque frontière de confiance nommés.

#### Scenario: Éléments du système tous représentés
- **WHEN** un relecteur compare le diagramme de flux au dépôt
- **THEN** il y trouve au minimum : le navigateur du visiteur, le CDN Vercel, le service worker et Cache Storage, `localStorage`, le passage à la messagerie (`mailto:`), le dépôt GitHub, GitHub Actions, le script de fraîcheur, l'intégration de déploiement Vercel et la bibliothèque GSAP embarquée

#### Scenario: Frontières de confiance explicites
- **WHEN** un flux franchit une frontière de confiance (visiteur ↔ site, contributeur ↔ dépôt, runner ↔ Internet, site ↔ sites tiers liés)
- **THEN** le modèle nomme cette frontière et indique quelles données la traversent

### Requirement: Analyse STRIDE par élément
Chaque élément du diagramme de flux MUST être analysé selon les six catégories STRIDE (usurpation, altération, répudiation, divulgation, déni de service, élévation de privilèges). Chaque catégorie reçoit une menace identifiée avec sa mitigation, ou une justification de non-applicabilité.

#### Scenario: Aucune catégorie laissée vide
- **WHEN** on parcourt l'analyse STRIDE d'un élément
- **THEN** chacune des six catégories porte soit au moins une menace et sa mitigation existante ou prévue, soit une phrase expliquant pourquoi elle ne s'applique pas

#### Scenario: Mitigation vérifiable
- **WHEN** une menace est déclarée mitigée
- **THEN** la mitigation renvoie à un élément vérifiable du dépôt (fichier, en-tête, contrôle CI ou réglage documenté)

### Requirement: Analyse PASTA en sept étapes
Le modèle de menaces MUST dérouler les sept étapes de PASTA, de l'objectif métier jusqu'à l'analyse de risque et d'impact. L'intégrité de l'information publiée doit y figurer comme actif principal.

#### Scenario: Objectifs métier reliés aux risques
- **WHEN** un scénario d'attaque est classé à l'étape 7
- **THEN** son impact est exprimé par rapport à un objectif de l'étape 1 (fiabilité de l'information, disponibilité, absence de collecte de données)

#### Scenario: Scénarios d'attaque fondés sur les constats
- **WHEN** l'étape 6 (modélisation des attaques) décrit un scénario
- **THEN** ce scénario s'appuie sur une menace de l'étape 4 et une faiblesse de l'étape 5 identifiées dans le dépôt

### Requirement: Correspondance OWASP Top 10
L'audit MUST évaluer chacune des dix catégories de l'OWASP Top 10 en vigueur, dont la liste a été vérifiée sur owasp.org. Chaque catégorie reçoit un verdict (applicable avec constats, applicable sans constat, non applicable) et sa justification.

#### Scenario: Catégorie non applicable justifiée
- **WHEN** une catégorie est déclarée non applicable (par exemple l'authentification, absente du site)
- **THEN** la justification cite le fait observable qui l'écarte (aucun compte, aucun backend, aucun cookie)

#### Scenario: Version de référence citée
- **WHEN** on lit la correspondance OWASP
- **THEN** elle indique l'édition utilisée et le lien de la source officielle

### Requirement: Registre des constats
Chaque constat d'audit MUST figurer dans un registre avec un identifiant stable, la méthode qui l'a révélé, une gravité (critique, élevée, moyenne, faible, info) et un statut (corrigé, accepté, planifié).

#### Scenario: Constat corrigé
- **WHEN** un constat passe au statut « corrigé »
- **THEN** le registre cite le commit ou la PR de correction

#### Scenario: Risque accepté
- **WHEN** un constat passe au statut « accepté »
- **THEN** le registre explique pourquoi le risque résiduel est acceptable et quand le réexaminer

### Requirement: Correction des constats graves
Un constat de gravité critique ou élevée MUST être corrigé avant la clôture de l'audit. Il ne peut pas être accepté sans l'accord explicite du mainteneur, consigné dans le registre.

#### Scenario: Constat élevé ouvert
- **WHEN** l'audit va être clôturé alors qu'un constat élevé est encore « planifié »
- **THEN** la clôture est bloquée jusqu'à sa correction ou à une acceptation écrite du mainteneur

### Requirement: Divulgation responsable
Un constat exploitable et non corrigé MUST NOT être détaillé dans un fichier, une issue ou une PR publics. Il est suivi dans un avis de sécurité GitHub privé jusqu'à sa correction.

#### Scenario: Faille ouverte
- **WHEN** un constat exploitable reste non corrigé au moment de publier les documents
- **THEN** le registre public ne mentionne que son identifiant, sa gravité et « détails privés », et les détails sont dans un avis de sécurité privé

#### Scenario: Faille corrigée
- **WHEN** la correction est en production
- **THEN** les détails peuvent être publiés dans le registre public

### Requirement: Réévaluation lors d'un changement de frontière
Le modèle de menaces MUST être mis à jour dans le même changement que toute modification d'une frontière de confiance : nouvel appel réseau, nouveau tiers, nouveau workflow ou permission, nouvelle donnée stockée ou envoyée.

#### Scenario: Nouveau tiers
- **WHEN** une PR ajoute une ressource ou un service tiers (script, police, API, outil de mesure)
- **THEN** cette PR met aussi à jour le diagramme de flux et l'analyse STRIDE de l'élément concerné
