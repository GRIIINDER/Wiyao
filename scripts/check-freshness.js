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

// ---- Garde anti-SSRF ----
// Le script tourne sur un runner GitHub Actions : un lien (ou une redirection)
// vers une adresse privée, locale ou de métadonnées cloud ne doit jamais être
// contacté. net.BlockList compare aussi les adresses IPv4 écrites en IPv6
// (::ffff:7f00:1 = 127.0.0.1), forme que l'analyseur d'URL produit toujours.
const BLOCKED_HOSTS = new Set(["localhost", "metadata.google.internal", "metadata.goog"]);
const BLOCKED_IPS = new net.BlockList();
[
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8],
  ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.168.0.0", 16],
  ["198.18.0.0", 15], ["224.0.0.0", 3],
  ["168.63.129.16", 32], // service interne Azure, joignable depuis les runners GitHub
].forEach(([addr, prefix]) => BLOCKED_IPS.addSubnet(addr, prefix, "ipv4"));
[
  ["::", 96], // ::, ::1 et IPv4 « compatibles » (::7f00:1)
  ["64:ff9b::", 96], // NAT64
  ["fc00::", 7], ["fe80::", 10], ["ff00::", 8],
].forEach(([addr, prefix]) => BLOCKED_IPS.addSubnet(addr, prefix, "ipv6"));

function isBlockedIp(ip) {
  return BLOCKED_IPS.check(ip, net.isIPv6(ip) ? "ipv6" : "ipv4");
}

// "ok" : adresse publique ; "blocked" : privée, locale ou non http(s) ;
// "dns" : nom introuvable. (Limite connue : fetch résout le nom une seconde
// fois, un DNS piégé pourrait changer de réponse entre les deux.)
async function gateUrl(urlStr) {
  let parsed;
  try {
    parsed = new URL(urlStr);
  } catch (e) {
    return "blocked";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "blocked";
  if (parsed.username || parsed.password) return "blocked";
  const host = parsed.hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
  if (!host || BLOCKED_HOSTS.has(host) || /\.(localhost|local|internal)$/.test(host)) return "blocked";
  if (net.isIP(host)) return isBlockedIp(host) ? "blocked" : "ok";
  try {
    const records = await dns.lookup(host, { all: true });
    if (!records.length) return "dns";
    return records.some((r) => isBlockedIp(r.address)) ? "blocked" : "ok";
  } catch (e) {
    return "dns";
  }
}

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
const REDIRECT_CODES = [301, 302, 303, 307, 308];

// Cookies reçus pendant une chaîne de redirections. Certains sites posent un
// cookie de session puis redirigent vers la même page, et bouclent tant
// qu'on ne le leur renvoie pas (page carrières d'Ecobank, signalée à tort
// « trop de redirections » chaque jour jusqu'au 2026-11-08) ; un navigateur
// le renvoie, d'où la fausse alerte. Le bocal ne vit que le temps d'une
// chaîne (rien n'est gardé d'un lien à l'autre) et un cookie n'est renvoyé
// qu'à l'hôte exact qui l'a posé.
function storeCookies(jar, host, res) {
  const lines = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  if (!lines.length) return;
  const cookies = jar.get(host) || new Map();
  for (const line of lines) {
    const pair = line.split(";", 1)[0];
    const eq = pair.indexOf("=");
    if (eq <= 0) continue;
    cookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
  jar.set(host, cookies);
}

function cookieHeader(jar, host) {
  const cookies = jar.get(host);
  if (!cookies || !cookies.size) return null;
  return [...cookies].map(([name, value]) => `${name}=${value}`).join("; ");
}

// Suit les redirections à la main avec une seule méthode, pour repasser
// chaque étape par la garde anti-SSRF. Une adresse refusée n'est jamais
// contactée, mais le lien reste dans le rapport (« à vérifier
// manuellement »), jamais écarté.
async function followChain(url, method, signal) {
  let current = url;
  const jar = new Map();
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const gate = await gateUrl(current);
    if (gate === "blocked") {
      return { url, status: null, ok: false, refused: true, error: hop === 0
        ? "adresse privée, locale ou non http(s) : non vérifiée"
        : "redirige vers une adresse privée, locale ou non http(s) : non suivie" };
    }
    if (gate === "dns") return { url, status: null, ok: false, refused: true, error: "résolution DNS impossible" };

    const host = new URL(current).hostname.toLowerCase();
    const cookie = cookieHeader(jar, host);
    const headers = cookie ? { ...FETCH_HEADERS, Cookie: cookie } : FETCH_HEADERS;
    const res = await fetch(current, { method, redirect: "manual", signal, headers });
    storeCookies(jar, host, res);
    if (!REDIRECT_CODES.includes(res.status)) return { url, status: res.status, ok: res.ok };
    const location = res.headers.get("location");
    if (!location) return { url, status: res.status, ok: false };
    current = new URL(location, current).href;
  }
  return { url, status: null, ok: false, error: "trop de redirections" };
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const head = await followChain(url, "HEAD", controller.signal);
    if (head.ok || head.refused) return head;
    // Beaucoup de sites (Google, GitHub, Salesforce Trailhead vécu en 2026-09-27)
    // répondent au HEAD par un 404 sur des pages qui existent bien en GET, au
    // lieu du 405 attendu -- confirmé sur 11/11 liens signalés "probablement
    // morts" ce jour-là, tous vivants une fois rechargés en GET. On retente
    // donc en GET dès que HEAD n'est pas ok, pas seulement sur 405, avant de
    // conclure -- cohérent avec la prudence volontaire du reste du script.
    // Le GET repart de l'adresse d'origine : Trailhead redirige le HEAD vers
    // une page en 404 mais répond 200 au GET (vu le 2026-11-03).
    return await followChain(url, "GET", controller.signal);
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
// Fausses alertes connues, vérifiées à la main : le lien reste listé (une
// vraie panne doit rester visible), avec une note pour la personne qui
// relit. Une nouvelle fausse alerte confirmée dans un navigateur s'ajoute ici.
const KNOWN_QUIRKS = {
  "tcc.hyver.org": "fausse alerte connue : le serveur répond 500 aux scripts, la page s'affiche normalement dans un navigateur",
  "www.tcc.hyver.org": "fausse alerte connue : le serveur répond 500 aux scripts, la page s'affiche normalement dans un navigateur",
  "www.rmo-jobcenter.com": "fausse alerte connue : son DNS annonce aussi une adresse IPv6 locale (fe80::), refusée par la garde anti-SSRF ; le site répond normalement",
  "univ-lome.tg": "fausse alerte connue : injoignable depuis les serveurs de GitHub, le site répond normalement dans un navigateur (vérifié le 2026-11-09)",
};

function knownQuirk(url) {
  try {
    return KNOWN_QUIRKS[new URL(url).hostname] || null;
  } catch (e) {
    return null;
  }
}

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
      const quirk = knownQuirk(r.url);
      md += `- [ ] ${r.url} → ${label}${quirk ? ` _(${quirk})_` : ""}\n`;
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

// Lancé directement (workflow quotidien) : vérifie tout. Chargé par
// require() : expose seulement de quoi tester une URL, sans rien lancer
// (gateUrl est aussi utilisé par scripts/watch-sources.js, la veille
// hebdomadaire, pour ne jamais contacter d'adresse privée ou locale).
if (require.main === module) {
  main().catch((err) => {
    console.error("Échec du script de vérification :", err);
    process.exit(1);
  });
} else {
  module.exports = { checkUrl, gateUrl, storeCookies, cookieHeader, knownQuirk, buildReport };
}
