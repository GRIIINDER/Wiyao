#!/usr/bin/env node
"use strict";

/**
 * Contrôles de sécurité locaux, sans dépendance npm.
 * À lancer via `node scripts/ci-security-hygiene.js` (CI DevSecOps + local).
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const errors = [];
const warnings = [];

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function rel(file) {
  return path.relative(ROOT, file);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

const files = walk(ROOT);
const jsFiles = files.filter((f) => f.endsWith(".js"));
const htmlFiles = files.filter((f) => f.endsWith(".html"));
const workflowFiles = files.filter(
  (f) =>
    f.includes(`${path.sep}.github${path.sep}workflows${path.sep}`) &&
    (f.endsWith(".yml") || f.endsWith(".yaml"))
);

// --- 1. Syntaxe JS (node --check) ------------------------------------------
for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (err) {
    const detail = (err.stderr || err.stdout || err.message).toString().trim();
    errors.push(`${rel(file)} : syntaxe JS invalide\n${detail}`);
  }
}

// --- 2. JSON de configuration ----------------------------------------------
const jsonFiles = ["vercel.json", "manifest.json"];
for (const name of jsonFiles) {
  const file = path.join(ROOT, name);
  if (!fs.existsSync(file)) {
    errors.push(`Fichier JSON manquant : ${name}`);
    continue;
  }
  try {
    JSON.parse(read(file));
  } catch (err) {
    errors.push(`${name} : JSON invalide (${err.message})`);
  }
}

// --- 3. En-têtes de sécurité Vercel ----------------------------------------
const requiredHeaders = [
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Strict-Transport-Security",
  "Content-Security-Policy",
];

try {
  const vercel = JSON.parse(read(path.join(ROOT, "vercel.json")));
  const headerList = (vercel.headers || []).flatMap((entry) => entry.headers || []);
  const keys = new Set(headerList.map((h) => h.key));
  for (const name of requiredHeaders) {
    if (!keys.has(name)) errors.push(`vercel.json : en-tête manquant ${name}`);
  }
  const csp = headerList.find((h) => h.key === "Content-Security-Policy");
  if (csp && /unsafe-eval/i.test(csp.value)) {
    errors.push("vercel.json : CSP contient 'unsafe-eval'");
  }
} catch (err) {
  errors.push(`Impossible de valider vercel.json : ${err.message}`);
}

// --- 4. APIs JS dangereuses ------------------------------------------------
const dangerous = [
  { re: /\beval\s*\(/, label: "eval(" },
  { re: /\bnew\s+Function\s*\(/, label: "new Function(" },
  { re: /\bdocument\.write(?:ln)?\s*\(/, label: "document.write(" },
];

for (const file of jsFiles) {
  if (path.basename(file) === "ci-security-hygiene.js") continue;
  const lines = read(file).split(/\r?\n/);
  lines.forEach((line, i) => {
    const stripped = line.replace(/\/\/.*$/, "");
    for (const rule of dangerous) {
      if (rule.re.test(stripped)) {
        errors.push(`${rel(file)}:${i + 1} : API dangereuse ${rule.label}`);
      }
    }
  });
}

// --- 5. Scripts / feuilles en HTTP clair dans le HTML ----------------------
for (const file of htmlFiles) {
  const html = read(file);
  const httpAssets = html.matchAll(
    /<(?:script|link)[^>]+(?:src|href)=["']http:\/\/[^"']+/gi
  );
  for (const match of httpAssets) {
    errors.push(`${rel(file)} : ressource chargée en HTTP clair (${match[0]})`);
  }
}

// --- 6. Actions GitHub épinglées sur un SHA --------------------------------
const shaPin = /^[0-9a-f]{40}$/i;
const digestPin = /^sha256:[0-9a-f]{64}$/i;

for (const file of workflowFiles) {
  const lines = read(file).split(/\r?\n/);
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("#")) return;
    const uses = trimmed.match(/^uses:\s*(.+)$/);
    if (!uses) return;
    const ref = uses[1]
      .trim()
      .replace(/\s+#.*$/, "")
      .replace(/^['"]|['"]$/g, "");
    if (ref.startsWith("./")) return;
    if (ref.startsWith("docker://")) {
      const image = ref.slice("docker://".length);
      const at = image.lastIndexOf("@");
      const pin = at >= 0 ? image.slice(at + 1) : "";
      if (!digestPin.test(pin)) {
        errors.push(
          `${rel(file)}:${i + 1} : image Docker non épinglée par digest (${ref})`
        );
      }
      return;
    }
    const at = ref.lastIndexOf("@");
    const pin = at >= 0 ? ref.slice(at + 1) : "";
    if (!shaPin.test(pin)) {
      errors.push(
        `${rel(file)}:${i + 1} : action non épinglée sur un SHA 40 caractères (${ref})`
      );
    }
  });
}

// --- 7. Artefacts de divulgation -------------------------------------------
for (const required of ["SECURITY.md", path.join(".well-known", "security.txt")]) {
  if (!fs.existsSync(path.join(ROOT, required))) {
    errors.push(`Fichier de divulgation manquant : ${required}`);
  }
}

if (warnings.length) {
  console.log("Avertissements :");
  for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length) {
  console.error(`Échec : ${errors.length} contrôle(s) de sécurité.\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `OK — ${jsFiles.length} JS, ${htmlFiles.length} HTML, ${workflowFiles.length} workflow(s).`
);
