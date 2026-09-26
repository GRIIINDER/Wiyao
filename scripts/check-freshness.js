#!/usr/bin/env node
/**
 * Vérification quotidienne de fraîcheur pour WIYAO.
 *
 * Ce script NE MODIFIE JAMAIS le contenu du site. Il se contente de :
 *   1. Vérifier que chaque lien externe cité sur le site répond toujours.
 *   2. Lister les écoles actuellement marquées "urgent" dans js/data.js,
 *      pour qu'un humain reconfirme que l'échéance est toujours valide.
 *
 * Toute décision de correction reste manuelle : ce script ne fait que
 * produire un rapport (freshness-report.md) qu'un humain doit relire.
 *
 * Catégorisation volontairement prudente : un site peut répondre 403/999
 * ou expirer sur un simple timeout à cause d'une protection anti-bot, sans
 * être réellement mort (vécu plusieurs fois cette session avec des sites
 * bien réels). Seuls les 404/410 -- une réponse explicite du serveur disant
 * "cette page n'existe pas" -- sont classés comme "probablement mort".
 * Le reste va dans "à vérifier manuellement", jamais présenté comme confirmé.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TIMEOUT_MS = 10000;
const CONCURRENCY = 8;

// ---- 1. Collecte des fichiers à scanner ----
function listHtmlFiles() {
  return fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
}

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

// ---- 2. Extraction des URLs externes (regex volontairement simple : on ne
// cherche pas à comprendre la structure JS/HTML, juste à trouver toute URL
// http(s) citée quelque part, comme on l'a fait à la main toute la session) ----
function extractUrls(text) {
  const matches = text.match(/https?:\/\/[^\s"'<>)\]]+/g) || [];
  return matches.map((u) => u.replace(/[.,;:]+$/, "")); // trailing punctuation
}

function collectAllUrls() {
  const urls = new Set();
  for (const file of listHtmlFiles()) {
    for (const u of extractUrls(readFile(file))) urls.add(u);
  }
  for (const jsFile of ["js/data.js", "js/i18n.js"]) {
    for (const u of extractUrls(readFile(jsFile))) urls.add(u);
  }
  // Domaines volontairement exclus : ressources du site lui-même, et
  // wiyao.vercel.app (interne, pas la peine de se vérifier soi-même).
  return [...urls].filter((u) => !u.includes("wiyao.vercel.app"));
}

// ---- 3. Vérification HTTP d'une URL ----
async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; WiyaoFreshnessCheck/1.0)" },
    });
    // Certains serveurs refusent HEAD (405) : on retente en GET.
    if (res.status === 405) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; WiyaoFreshnessCheck/1.0)" },
      });
    }
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return { url, status: null, ok: false, error: err.message || String(err) };
  } finally {
    clearTimeout(timer);
  }
}

async function checkAllUrls(urls) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < urls.length) {
      const idx = i++;
      results[idx] = await checkUrl(urls[idx]);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

// ---- 4. Écoles actuellement marquées "urgent" dans data.js ----

// Parseur de date française volontairement conservateur : ne matche que
// "JJ mois AAAA" avec année explicite (ex: "11 septembre 2026, 15h00").
// Les formats sans année ("26 septembre (référence)") ou ambigus ne sont
// jamais interprétés -- pas de fausse date plutôt qu'une date devinée,
// cohérent avec la philosophie prudente du reste de ce script.
const FR_MONTHS = {
  janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11,
};

function parseFrenchDate(text) {
  if (!text) return null;
  const re = /(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i;
  const m = text.match(re);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const month = FR_MONTHS[m[2].toLowerCase()];
  const year = parseInt(m[3], 10);
  if (month === undefined || Number.isNaN(day) || Number.isNaN(year)) return null;
  const d = new Date(year, month, day, 23, 59, 59);
  return Number.isNaN(d.getTime()) ? null : d;
}

function findUrgentSchools() {
  const src = readFile("js/data.js");
  const startsIdx = src.indexOf("const SCHOOLS = {");
  if (startsIdx === -1) return [];
  const endIdx = src.indexOf("\nconst VILLES", startsIdx);
  const schoolsSrc = endIdx === -1 ? src.slice(startsIdx) : src.slice(startsIdx, endIdx);

  const entries = [];
  // Découpe grossière par entrée de premier niveau ("id-ecole": { ... }),
  // en comptant les accolades pour trouver la fin de chaque bloc.
  const idRe = /"([a-z0-9-]+)":\s*\{/g;
  let m;
  const blocks = [];
  const idxs = [];
  while ((m = idRe.exec(schoolsSrc))) idxs.push({ id: m[1], start: m.index });
  for (let k = 0; k < idxs.length; k++) {
    const start = idxs[k].start;
    const end = k + 1 < idxs.length ? idxs[k + 1].start : schoolsSrc.length;
    blocks.push({ id: idxs[k].id, text: schoolsSrc.slice(start, end) });
  }
  const today = new Date();
  for (const b of blocks) {
    if (/urgent:\s*true/.test(b.text)) {
      const noteMatch = b.text.match(/urgentNote:\s*"([^"]*)"/);
      const nameMatch = b.text.match(/name:\s*"([^"]*)"/);
      const clotureMatch = b.text.match(/cloture:\s*"([^"]*)"/);
      const clotureText = clotureMatch ? clotureMatch[1] : null;
      const clotureDate = parseFrenchDate(clotureText);
      entries.push({
        id: b.id,
        name: nameMatch ? nameMatch[1] : b.id,
        note: noteMatch ? noteMatch[1] : "(pas de urgentNote trouvée)",
        cloture: clotureText,
        expired: clotureDate ? clotureDate < today : null,
      });
    }
  }
  return entries;
}

// ---- 5. Rapport ----
function buildReport(results, urgentSchools) {
  const dead = results.filter((r) => r.status === 404 || r.status === 410);
  const uncertain = results.filter(
    (r) => !r.ok && r.status !== 404 && r.status !== 410
  );
  const ok = results.filter((r) => r.ok);

  const today = new Date().toISOString().slice(0, 10);
  let md = `# Rapport de fraîcheur WIYAO — ${today}\n\n`;
  md += `Vérification automatique, informative uniquement : rien n'a été modifié sur le site. `;
  md += `Chaque point ci-dessous doit être confirmé par un humain avant toute correction.\n\n`;
  md += `**Résumé** : ${results.length} liens vérifiés — ${ok.length} OK, `;
  md += `${dead.length} probablement morts (404/410), ${uncertain.length} à vérifier manuellement.\n\n`;

  if (dead.length) {
    md += `## 🔴 Liens probablement morts (${dead.length})\n\n`;
    md += `Réponse HTTP 404/410 explicite du serveur — signal fiable, mais à confirmer par un clic avant de corriger.\n\n`;
    for (const r of dead) md += `- [ ] ${r.url} → \`${r.status}\`\n`;
    md += `\n`;
  }

  if (uncertain.length) {
    md += `## 🟡 À vérifier manuellement (${uncertain.length})\n\n`;
    md += `Erreur réseau, timeout, ou statut autre que 404/410 : peut être un vrai problème, `;
    md += `ou une protection anti-bot qui bloque ce script sans que le site soit mort `;
    md += `(vécu plusieurs fois avec des sites bien réels). Ne pas corriger sans vérifier soi-même dans un vrai navigateur.\n\n`;
    for (const r of uncertain) {
      const label = r.status ? `HTTP ${r.status}` : `erreur réseau (${r.error})`;
      md += `- [ ] ${r.url} → ${label}\n`;
    }
    md += `\n`;
  }

  const expiredUrgent = urgentSchools.filter((s) => s.expired === true);
  const otherUrgent = urgentSchools.filter((s) => s.expired !== true);

  if (expiredUrgent.length) {
    md += `## 🔴 Écoles "urgent" dont la date de clôture est déjà passée (${expiredUrgent.length})\n\n`;
    md += `Détecté automatiquement (date de \`cloture\` comparée à aujourd'hui) : ce sont des candidats quasi certains `;
    md += `au même bug que l'ENP en septembre 2026 (bandeau "dernière ligne droite" resté affiché après la date limite). `;
    md += `À vérifier en premier, avant le reste du rapport.\n\n`;
    for (const s of expiredUrgent) md += `- [ ] **${s.name}** (\`${s.id}\`) — clôture : ${s.cloture} — ${s.note}\n`;
    md += `\n`;
  }

  md += `## 📅 Écoles actuellement marquées "urgent"\n\n`;
  if (urgentSchools.length) {
    md += `Reconfirmer que chaque échéance ci-dessous est toujours d'actualité — un \`urgent: true\` oublié après sa date `;
    md += `a déjà causé une fausse alerte sur le site (école IAI-Togo, corrigé en septembre 2026). `;
    md += `Les échéances déjà passées (détection automatique) sont listées séparément ci-dessus.\n\n`;
    for (const s of otherUrgent) {
      const dateInfo = s.cloture ? ` (clôture : ${s.cloture})` : "";
      md += `- [ ] **${s.name}** (\`${s.id}\`)${dateInfo} — ${s.note}\n`;
    }
  } else {
    md += `Aucune école actuellement marquée urgente. Rien à reconfirmer.\n`;
  }

  if (!dead.length && !uncertain.length) {
    md += `\n✅ Tous les liens externes répondent normalement.\n`;
  }

  return md;
}

// ---- Exécution ----
async function main() {
  console.log("Collecte des URLs...");
  const urls = collectAllUrls();
  console.log(`${urls.length} URLs uniques trouvées, vérification en cours...`);
  const results = await checkAllUrls(urls);
  const urgentSchools = findUrgentSchools();
  const report = buildReport(results, urgentSchools);

  fs.writeFileSync(path.join(ROOT, "freshness-report.md"), report, "utf8");
  console.log("Rapport écrit dans freshness-report.md");
  console.log(report);
}

main().catch((err) => {
  console.error("Échec du script de vérification :", err);
  process.exit(1);
});
