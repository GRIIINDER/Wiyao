# Spec Delta

## Purpose

Protéger la chaîne qui va du dépôt GitHub à la production (workflows, actions tierces, bibliothèques embarquées, script de fraîcheur), afin qu'une contribution ou une dépendance compromise ne puisse ni altérer le site ni détourner l'environnement d'intégration continue.

## ADDED Requirements

### Requirement: Privilèges minimaux des workflows
Chaque workflow GitHub Actions MUST retirer toutes les permissions par défaut au niveau du workflow. Il accorde ensuite à chaque tâche uniquement les permissions dont elle a besoin.

#### Scenario: Nouveau workflow
- **WHEN** une PR ajoute un workflow sans `permissions` restreintes au niveau du workflow
- **THEN** le contrôle d'hygiène de sécurité échoue

#### Scenario: Écriture limitée
- **WHEN** on liste les permissions en écriture de tous les workflows
- **THEN** chacune est justifiée dans le modèle de menaces (par exemple `issues: write` pour le rapport de fraîcheur)

### Requirement: Actions tierces épinglées
Chaque action tierce MUST être référencée par l'empreinte complète d'un commit, jamais par une étiquette ou une branche modifiable.

#### Scenario: Étiquette modifiable
- **WHEN** un workflow utilise `uses: owner/action@v4`
- **THEN** le contrôle d'hygiène de sécurité échoue

### Requirement: Pas d'exécution de code non fiable avec des secrets
Un workflow MUST NOT exécuter le code d'une PR venant d'un dépôt dérivé dans un contexte qui a accès aux secrets ou à un jeton en écriture (`pull_request_target`, `workflow_run` avec extraction du code de la PR).

#### Scenario: Déclencheur dangereux
- **WHEN** un workflow combine `pull_request_target` et l'extraction du code de la PR
- **THEN** l'analyse des workflows le signale comme bloquant

### Requirement: Intégrité des bibliothèques embarquées
Chaque bibliothèque tierce copiée dans le dépôt MUST avoir une empreinte SHA-256 de référence, consignée avec sa version et sa source, et un contrôle automatique MUST vérifier qu'elle n'a pas changé.

#### Scenario: Fichier modifié
- **WHEN** une PR modifie `js/vendor/gsap.min.js` sans mettre à jour son empreinte de référence
- **THEN** le contrôle d'hygiène de sécurité échoue

#### Scenario: Mise à jour légitime
- **WHEN** le mainteneur met à jour la bibliothèque en suivant la procédure documentée (archive du registre, empreinte `integrity` vérifiée)
- **THEN** il met à jour l'empreinte de référence dans le même changement, et le contrôle passe

### Requirement: Empreinte du script en ligne vérifiée
Un contrôle automatique MUST vérifier que l'empreinte SHA-256 de chaque script en ligne des pages figure dans la politique de contenu.

#### Scenario: JSON-LD modifié
- **WHEN** une PR modifie le JSON-LD d'`index.html` sans mettre à jour la politique de contenu
- **THEN** le contrôle échoue en indiquant l'empreinte attendue

### Requirement: En-têtes de sécurité vérifiés
Le contrôle d'hygiène de sécurité MUST vérifier la présence de chaque en-tête exigé par la capacité `security/browser-hardening`. Il MUST aussi vérifier l'absence de `unsafe-inline` et de `unsafe-eval` dans `script-src`.

#### Scenario: En-tête retiré
- **WHEN** une PR retire `Cross-Origin-Opener-Policy` de la configuration
- **THEN** le contrôle échoue

### Requirement: Le script de fraîcheur ne contacte que des adresses publiques
Le script de vérification des liens MUST refuser de contacter une adresse privée, locale, réservée ou de métadonnées cloud, quelle que soit son écriture (IPv4, IPv6, IPv4 inscrite dans IPv6, nom résolu vers une telle adresse). Il MUST revérifier chaque étape d'une redirection.

#### Scenario: Redirection vers les métadonnées
- **WHEN** un lien public redirige vers `http://[::ffff:a9fe:a9fe]/`
- **THEN** cette adresse n'est jamais contactée, et le lien apparaît dans « à vérifier manuellement »

#### Scenario: Lien vers une adresse privée
- **WHEN** le site contient un lien vers une adresse privée
- **THEN** le lien n'est pas contacté, mais il reste dans le rapport sous « à vérifier manuellement », jamais écarté en silence

### Requirement: Secrets absents du dépôt
Aucun secret (jeton, clé, mot de passe) MUST NOT figurer dans le dépôt ni dans son historique. Un contrôle automatique MUST analyser chaque PR et chaque poussée.

#### Scenario: Secret ajouté
- **WHEN** une PR contient un jeton d'API
- **THEN** l'analyse des secrets échoue avant fusion
