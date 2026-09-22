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
const dns = require("dns").promises;
const net = require("net");

const ROOT = path.resolve(__dirname, "..");
const TIMEOUT_MS = 10000;
const CONCURRENCY = 8;
const MAX_REDIRECTS = 5;
const FETCH_HEADERS = { "User-Agent": "Mozilla/5.0 (compatible; WiyaoFreshnessCheck/1.0)" };
const BLOCKED_HOSTS = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.google.com",
  "metadata.goog",
]);

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

function isPrivateIp(ip) {
  if (!ip) return true;
  if (net.isIPv4(ip)) {
    const p = ip.split(".").map(Number);
    if (p[0] === 0 || p[0] === 10 || p[0] === 127) return true;
    if (p[0] === 169 && p[1] === 254) return true;
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
    if (p[0] === 192 && p[1] === 168) return true;
    if (p[0] === 100 && p[1] >= 64 && p[1] <= 127) return true;
    if (p[0] >= 224) return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    const n = ip.toLowerCase();
    if (n === "::1" || n === "::") return true;
    if (n.startsWith("fe80:") || n.startsWith("fc") || n.startsWith("fd")) return true;
    if (n.startsWith("::ffff:")) {
      const v4 = n.slice("::ffff:".length);
      if (net.isIPv4(v4)) return isPrivateIp(v4);
    }
    return false;
  }
  return true;
}

function isBlockedHostname(host) {
  if (!host) return true;
  if (BLOCKED_HOSTS.has(host)) return true;
  if (host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return true;
  return false;
}

// Refuse localhost / RFC1918 / link-local / metadata so a merged URL cannot
// turn this checker into an SSRF gadget against the Actions runner.
async function classifyPublicHttpUrl(urlStr) {
  let parsed;
  try {
    parsed = new URL(urlStr);
  } catch (e) {
    return { allow: false, skip: true };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return { allow: false, skip: true };
  if (parsed.username || parsed.password) return { allow: false, skip: true };
  const host = parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (isBlockedHostname(host)) return { allow: false, skip: true };
  if (net.isIP(host)) {
    return isPrivateIp(host) ? { allow: false, skip: true } : { allow: true };
  }
  try {
    const records = await dns.lookup(host, { all: true });
    if (!records.length) return { allow: false, skip: false };
    if (records.some((r) => isPrivateIp(r.address))) return { allow: false, skip: true };
    return { allow: true };
  } catch (e) {
    return { allow: false, skip: false };
  }
}

async function fetchNoFollow(url, method, signal) {
  return fetch(url, {
    method,
    redirect: "manual",
    signal,
    headers: FETCH_HEADERS,
  });
}

// ---- 3. Vérification HTTP d'une URL ----
async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let current = url;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const gate = await classifyPublicHttpUrl(current);
      if (!gate.allow) {
        if (gate.skip) return { url, skipped: true };
        return { url, status: null, ok: false, error: "résolution DNS impossible" };
      }
      let res = await fetchNoFollow(current, "HEAD", controller.signal);
      if (res.status === 405) {
        res = await fetchNoFollow(current, "GET", controller.signal);
      }
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) return { url, status: res.status, ok: false };
        current = new URL(loc, current).href;
        continue;
      }
      return { url, status: res.status, ok: res.ok };
    }
    return { url, status: null, ok: false, error: "trop de redirections" };
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
  for (const b of blocks) {
    if (/urgent:\s*true/.test(b.text)) {
      const noteMatch = b.text.match(/urgentNote:\s*"([^"]*)"/);
      const nameMatch = b.text.match(/name:\s*"([^"]*)"/);
      entries.push({
        id: b.id,
        name: nameMatch ? nameMatch[1] : b.id,
        note: noteMatch ? noteMatch[1] : "(pas de urgentNote trouvée)",
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

  md += `## 📅 Écoles actuellement marquées "urgent"\n\n`;
  if (urgentSchools.length) {
    md += `Reconfirmer que chaque échéance ci-dessous est toujours d'actualité — un \`urgent: true\` oublié après sa date `;
    md += `a déjà causé une fausse alerte sur le site (école IAI-Togo, corrigé en septembre 2026).\n\n`;
    for (const s of urgentSchools) md += `- [ ] **${s.name}** (\`${s.id}\`) — ${s.note}\n`;
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
  const results = (await checkAllUrls(urls)).filter((r) => !r.skipped);
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
