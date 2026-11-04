#!/usr/bin/env node
"use strict";

/**
 * Contrôles de sécurité locaux, sans dépendance npm.
 * À lancer via `node scripts/ci-security-hygiene.js` (CI DevSecOps + local).
 *
 * 1. Syntaxe JS              6. Actions épinglées sur un SHA
 * 2. JSON de configuration   7. SECURITY.md et security.txt présents
 * 3. En-têtes de sécurité    8. Empreinte de chaque script en ligne dans la CSP
 *    et CSP des scripts      9. Intégrité des bibliothèques de js/vendor/
 * 4. APIs JS dangereuses    10. `permissions` déclarées par chaque workflow
 * 5. Ressources en HTTP clair
 *
 * Les empreintes (8, 9) sont calculées sur la forme à fins de ligne LF, celle
 * que Git stocke et que Vercel sert : le résultat est le même sous Windows.
 * Voir docs/security/threat-model.md pour les menaces que ces contrôles
 * couvrent.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
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
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
];

let scriptSrc = null; // directive script-src de la CSP, reprise au contrôle 8

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
  if (csp) {
    const directive = csp.value.split(";").map((d) => d.trim()).find((d) => /^script-src\s/i.test(d));
    if (!directive) {
      errors.push("vercel.json : CSP sans directive script-src");
    } else {
      scriptSrc = directive;
      if (/'unsafe-inline'/i.test(directive)) errors.push("vercel.json : script-src contient 'unsafe-inline'");
    }
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

// Contenu d'un fichier texte sous sa forme LF (octet pour octet, sans
// réinterpréter l'encodage), pour calculer la même empreinte que le serveur.
function lfBytes(buffer) {
  return Buffer.from(buffer.toString("latin1").replace(/\r\n/g, "\n"), "latin1");
}

// --- 8. Empreinte de chaque script en ligne présente dans la CSP -----------
// Un script en ligne modifié sans mettre à jour son empreinte est bloqué en
// silence par le navigateur en production.
for (const file of htmlFiles) {
  const html = lfBytes(fs.readFileSync(file)).toString("utf8");
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/i.test(m[1])) continue;
    const hash = "sha256-" + crypto.createHash("sha256").update(m[2], "utf8").digest("base64");
    if (scriptSrc && !scriptSrc.includes(`'${hash}'`)) {
      errors.push(`${rel(file)} : empreinte du script en ligne absente de script-src (attendue : '${hash}')`);
    }
  }
}

// --- 9. Intégrité des bibliothèques copiées dans js/vendor/ ---------------
// Mise à jour : télécharger l'archive npm, vérifier son empreinte `integrity`
// publiée par le registre, remplacer le fichier, puis reporter ici la version,
// la date et la nouvelle empreinte (procédure de CLAUDE.md, « Animations »).
const VENDOR_FILES = {
  "js/vendor/gsap.min.js": {
    version: "gsap 3.15.0",
    source: "https://registry.npmjs.org/gsap/-/gsap-3.15.0.tgz (package/dist/gsap.min.js)",
    checked: "2026-11-04",
    sha256: "92bb9a96476f983d212a2bc4f54c889039c1696dd4461d40a736860938570fbb",
  },
};

const vendorFiles = files.filter((f) => rel(f).split(path.sep).slice(0, 2).join("/") === "js/vendor");
for (const file of vendorFiles) {
  const key = rel(file).split(path.sep).join("/");
  const ref = VENDOR_FILES[key];
  if (!ref) {
    errors.push(`${key} : bibliothèque sans empreinte de référence (à ajouter dans VENDOR_FILES)`);
    continue;
  }
  const actual = crypto.createHash("sha256").update(lfBytes(fs.readFileSync(file))).digest("hex");
  if (actual !== ref.sha256) {
    errors.push(`${key} : empreinte ${actual} différente de la référence ${ref.sha256} (${ref.version})`);
  }
}
for (const key of Object.keys(VENDOR_FILES)) {
  if (!fs.existsSync(path.join(ROOT, key))) errors.push(`${key} : listé dans VENDOR_FILES mais absent du dépôt`);
}

// --- 10. Permissions déclarées au niveau de chaque workflow -----------------
// Sans `permissions:` en tête, le jeton du workflow reçoit les droits par
// défaut du dépôt, souvent en écriture.
for (const file of workflowFiles) {
  if (!/^permissions\s*:/m.test(read(file))) {
    errors.push(`${rel(file)} : pas de « permissions: » au niveau du workflow`);
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
