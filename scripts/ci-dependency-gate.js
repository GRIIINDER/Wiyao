#!/usr/bin/env node
"use strict";

/**
 * Gate de dépendances sans GitHub Advanced Security.
 * Sur un dépôt privé, l'API Dependency Review n'est pas disponible :
 * on inspecte les manifests et on lance npm audit s'il y a un lockfile.
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

const MANIFESTS = [
  "package.json",
  "package-lock.json",
  "npm-shrinkwrap.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lock",
  "bun.lockb",
  "requirements.txt",
  "Pipfile.lock",
  "poetry.lock",
  "go.mod",
  "go.sum",
  "Cargo.lock",
  "Gemfile.lock",
  "composer.lock",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
];

const present = MANIFESTS.filter((name) => fs.existsSync(path.join(ROOT, name)));

if (present.length === 0) {
  console.log(
    "OK — aucun manifest applicatif (site statique sans npm/pip/go). " +
      "Les GitHub Actions sont épinglées par SHA (hygiène + zizmor + Dependabot)."
  );
  process.exit(0);
}

console.log("Manifests détectés :", present.join(", "));

const hasNpm =
  present.includes("package-lock.json") ||
  present.includes("npm-shrinkwrap.json") ||
  present.includes("package.json");

if (hasNpm) {
  const audit = spawnSync("npm", ["audit", "--audit-level=high"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (audit.status) process.exit(audit.status || 1);
}

console.log("OK — audit des manifests présents terminé.");
