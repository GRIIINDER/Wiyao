#!/usr/bin/env node
/**
 * Veille hebdomadaire des sources publiques pour WIYAO.
 *
 * Ce script NE MODIFIE JAMAIS le contenu du site. Il relève les nouveautés
 * de quelques sources publiques togolaises (flux RSS et pages publiques) et
 * les liste dans watch-report.md, que le workflow weekly-watch.yml publie
 * dans une issue GitHub persistante. Chaque ligne est une PISTE : elle ne
 * peut entrer sur le site qu'après vérification à sa source d'origine
 * (règle « contenu vérifié, jamais deviné », voir CLAUDE.md).
 *
 * Pourquoi pas LinkedIn : ses conditions d'utilisation interdisent la
 * collecte automatisée, et ce qui y circule vient le plus souvent de ces
 * mêmes sources publiques. Une piste vue sur LinkedIn se signale à la main.
 *
 * Mémoire d'une semaine à l'autre : le rapport précédent (corps de l'issue,
 * passé en argument) contient en commentaire HTML caché les empreintes des
 * liens déjà signalés ; seuls les liens jamais vus sont listés.
 *
 * Usage : node scripts/watch-sources.js [rapport-précédent.md]
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { gateUrl, storeCookies, cookieHeader } = require("./check-freshness.js");

const ROOT = path.resolve(__dirname, "..");
const REPORT = path.join(ROOT, "watch-report.md");
const WINDOW_DAYS = 8; // exécution hebdomadaire + un jour de marge
const TIMEOUT_MS = 20000;
const MAX_BYTES = 3 * 1024 * 1024;
const MAX_REDIRECTS = 5;
const MAX_SEEN = 3000; // ~33 Ko de commentaire caché, sous la limite de 65 536 caractères d'une issue
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; WiyaoWatch/1.0; +https://wiyao.vercel.app/about.html)",
  Accept: "application/rss+xml, application/atom+xml, application/xml, text/html;q=0.9, */*;q=0.8",
};

// ---- Filtres de pertinence (comparés sans accents ni majuscules) ----
const TECH = /\b(informati\w*|numerique\w*|digital\w*|developpeu\w*|developpement (web|mobile|logiciel|d.applications?)|logiciels?|programm(ation|eur|euse)s?|codage|coding|data|donnees|intelligence artificielle|cyber\w*|reseaux? informatiques?|telecom\w*|cloud|devops|hackathons?|startups?|tech|technolog\w*|fintech\w*|webmaster|web|robotique|ia|tic|ntic|ux|ui|it)\b/;
const BOURSE = /\b(bourses?|scholarships?)\b/;
const TOGO = /\b(togo\w*|lome|kara|sokode|kpalime|atakpame|dapaong|aneho|tsevie|notse|bassar)\b/;
const EDU = /\b(concours|admissions?|inscriptions?|orientation|bacheliers?|baccalaureat|accredit\w*|etablissements? (prives?|d.enseignement superieur)|universit\w*)\b/;

// ---- Sources suivies ----
// filter : null (source déjà centrée sur la tech) ou liste de motifs dont
// l'un doit apparaître ; on : "title" (titre seul) ou "text" (titre + résumé).
const SOURCES = [
  { name: "Togo First : TIC", kind: "feed", url: "https://www.togofirst.com/fr/tic?format=feed&type=rss", filter: null },
  { name: "Togo First : Formation", kind: "feed", url: "https://www.togofirst.com/fr/formation?format=feed&type=rss", filter: [TECH, BOURSE], on: "text" },
  { name: "techs.tg (articles sur le Togo)", kind: "feed", url: "https://techs.tg/feed/", filter: [TOGO], on: "titleurl", wpPages: 3 },
  { name: "ANCy (Agence nationale de la cybersécurité)", kind: "feed", url: "https://ancy.gouv.tg/feed/", filter: null },
  { name: "Cyber Defense Africa", kind: "feed", url: "https://www.cda.tg/feed/", filter: null },
  { name: "GDG Lomé : événements", kind: "page", url: "https://gdg.community.dev/gdg-lome/", link: /^https:\/\/gdg\.community\.dev\/events\/details\/[a-z0-9-]+\/$/ },
  { name: "Agence Togo Digital : recrutements", kind: "page", url: "https://digital.gouv.tg/recrutements", link: /^https:\/\/digital\.gouv\.tg\/recrutements\/\d+\/details$/, titleAttr: "data-title" },
  { name: "Ministère de l'Enseignement supérieur", kind: "feed", url: "https://edusup.gouv.tg/feed/", filter: [TECH, BOURSE, EDU], on: "text" },
  { name: "Ministère de l'Éducation nationale", kind: "feed", url: "https://education.gouv.tg/feed/", filter: [TECH, BOURSE], on: "text" },
  { name: "Campus Togo", kind: "feed", url: "https://www.campus-togo.com/feed/", filter: [TECH, BOURSE], on: "text", wpPages: 3,
    quirk: "fausse alerte connue : injoignable depuis les serveurs de GitHub (« fetch failed »), alors que le flux répond normalement dans un navigateur et depuis Lomé (vérifié les 10 et 11 novembre 2026)" },
  { name: "Afri-carrières", kind: "feed", url: "https://afri-carrieres.com/feed/", filter: [TECH, BOURSE], on: "title", wpPages: 3 },
  { name: "EmploiTogo.info (offres tech)", kind: "feed", url: "https://www.emploitogo.info/feed/", filter: [TECH], on: "title", wpPages: 12 },
];

// ---- Téléchargement prudent : chaque étape de redirection repasse par la
// garde anti-SSRF de check-freshness.js, taille et durée bornées ----
async function safeGet(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let current = url;
    const jar = new Map();
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const gate = await gateUrl(current);
      if (gate !== "ok") throw new Error(gate === "dns" ? "résolution DNS impossible" : "adresse refusée par la garde anti-SSRF");
      const host = new URL(current).hostname.toLowerCase();
      const cookie = cookieHeader(jar, host);
      const res = await fetch(current, { redirect: "manual", signal: controller.signal, headers: cookie ? { ...HEADERS, Cookie: cookie } : HEADERS });
      storeCookies(jar, host, res);
      if ([301, 302, 303, 307, 308].includes(res.status)) {
        const location = res.headers.get("location");
        if (!location) throw new Error(`redirection ${res.status} sans destination`);
        current = new URL(location, current).href;
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const chunks = [];
      let size = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > MAX_BYTES) { controller.abort(); throw new Error("réponse trop volumineuse"); }
        chunks.push(value);
      }
      return { url: current, text: Buffer.concat(chunks).toString("utf8") };
    }
    throw new Error("trop de redirections");
  } finally {
    clearTimeout(timer);
  }
}

// ---- Lecture des flux RSS / Atom (expressions simples, sans dépendance) ----
function decodeEntities(s) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", hellip: "…", ndash: "–", mdash: "—", laquo: "«", raquo: "»", eacute: "é", egrave: "è", agrave: "à", ccedil: "ç" };
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in named ? named[n.toLowerCase()] : m));
}
function clean(s) {
  return decodeEntities(String(s || "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function tag(block, names) {
  for (const n of names) {
    const m = block.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)</${n}>`, "i"));
    if (m) return m[1];
  }
  return "";
}
function parseFeed(xml) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map((b) => {
    let link = clean(tag(b, ["link"]));
    if (!link) {
      const href = b.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i) || b.match(/<link[^>]*href=["']([^"']+)["']/i);
      link = href ? decodeEntities(href[1]) : "";
    }
    const dateText = clean(tag(b, ["pubDate", "published", "updated", "dc:date"]));
    const date = dateText ? new Date(dateText) : null;
    return {
      title: clean(tag(b, ["title"])),
      link: link.trim(),
      date: date && !isNaN(date) ? date : null,
      summary: clean(tag(b, ["description", "summary", "content:encoded", "content"])).slice(0, 600),
    };
  });
}

// ---- Lecture d'une page publique : liens qui correspondent au motif ----
function parsePage(html, source) {
  const items = new Map();
  const anchors = html.match(/<a\s[^>]*href=["'][^"']+["'][^>]*>[\s\S]*?<\/a>/gi) || [];
  for (const a of anchors) {
    const href = a.match(/href=["']([^"']+)["']/i)[1];
    let link;
    try { link = new URL(decodeEntities(href), source.url).href; } catch (e) { continue; }
    link = link.split("#")[0];
    if (!source.link.test(link) || items.has(link)) continue;
    let title = "";
    if (source.titleAttr) {
      const t = a.match(new RegExp(`${source.titleAttr}=["']([^"']+)["']`, "i"));
      if (t) title = clean(t[1]);
    }
    if (!title) {
      title = clean(a.replace(/^<a[^>]*>|<\/a>$/gi, ""))
        .replace(/^\d{1,2}\s+\S+\s+(de\s+)?\S*\s*(de\s+)?\d{4}\s*/i, "") // date en tête (langue variable)
        .replace(/^(External|Free|Paid) registration\s*/i, "");
    }
    if (!title || title.length > 200 || /^(→|view details|voir)/i.test(title)) {
      const slug = link.replace(/\/$/, "").split("/").pop();
      title = slug.replace(/^google-gdg-lome-presents-/, "").replace(/-/g, " ");
    }
    items.set(link, { title, link, date: null, summary: "" });
  }
  return [...items.values()];
}

// ---- Pertinence, nouveauté ----
function fold(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
function relevant(item, source) {
  if (!source.filter) return true;
  // "titleurl" : titre + adresse (techs.tg ajoute « Togo » au résumé de
  // tous ses articles, d'où un filtre sur le titre et l'adresse seulement).
  const text = fold(source.on === "title" ? item.title : source.on === "titleurl" ? `${item.title} ${item.link.replace(/[/_-]+/g, " ")}` : `${item.title} ${item.summary}`);
  return source.filter.some((re) => re.test(text));
}
function fingerprint(link) {
  return crypto.createHash("sha1").update(link.replace(/^http:/, "https:").replace(/\/$/, "")).digest("hex").slice(0, 10);
}
function readSeen(previousFile) {
  if (!previousFile || !fs.existsSync(previousFile)) return [];
  const m = fs.readFileSync(previousFile, "utf8").match(/<!-- wiyao-watch-seen: ([0-9a-f,]*) -->/);
  return m && m[1] ? m[1].split(",") : [];
}

async function collect(source, cutoff) {
  if (source.kind === "page") return parsePage((await safeGet(source.url)).text, source);
  const all = [];
  const pages = source.wpPages || 1;
  for (let p = 1; p <= pages; p++) {
    const url = p === 1 ? source.url : `${source.url}${source.url.includes("?") ? "&" : "?"}paged=${p}`;
    let items;
    try {
      items = parseFeed((await safeGet(url)).text);
    } catch (e) {
      if (p === 1) throw e;
      break; // page suivante absente : fin du flux
    }
    if (!items.length) break;
    all.push(...items);
    const oldest = items.reduce((min, i) => (i.date && (!min || i.date < min) ? i.date : min), null);
    if (!oldest || oldest < cutoff) break;
  }
  return all;
}

// ---- Rapport (Markdown publié dans une issue publique) ----
function md(s) {
  return String(s)
    .replace(/[\\`*_[\]<>|]/g, (c) => `\\${c}`)
    .replace(/@/g, "@​") // jamais de mention GitHub involontaire
    .replace(/#(?=\d)/g, "#​"); // ni de lien vers une issue
}
function frDate(d) {
  return d ? d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "";
}

// ---- Actualités dont la date vient de passer (2026-11-11) ----
// Une actualité annonce souvent un événement ou une échéance (« le 18
// novembre », « candidatures jusqu'au… ») : une fois la date passée, son
// texte doit passer au passé ou dire « clos ». Le rapport liste celles qui
// ont franchi leur date depuis le relevé précédent, et celles qui la
// franchiront dans les deux semaines. Rien n'est modifié sur le site.
const FR_MONTHS = { janvier: 0, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5, juillet: 6, aout: 7, septembre: 8, octobre: 9, novembre: 10, decembre: 11 };

// Dernière date complète d'un texte (« Du 5 au 7 novembre 2026 » : le 7 ;
// « 5-8 octobre 2026 » : le 8) ; un mois sans jour (« Début août 2026 »)
// compte jusqu'à sa fin.
function lastFrenchDate(text) {
  const t = fold(text.replace(/(\d)(?:ᵉʳ|er)\b/g, "$1")); // « 1ᵉʳ octobre » → « 1 octobre »
  let best = null;
  const re = /(?:(\d{1,2})\s+)?(janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre)\s+(\d{4})/g;
  for (const m of t.matchAll(re)) {
    const month = FR_MONTHS[m[2]];
    const year = Number(m[3]);
    const day = m[1] ? Number(m[1]) : new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const d = new Date(Date.UTC(year, month, day, 23, 59));
    if (!best || d > best) best = d;
  }
  return best;
}

function datedActualites() {
  const html = fs.readFileSync(path.join(ROOT, "actualites.html"), "utf8");
  const cards = html.split('<article class="card actu-card">').slice(1);
  return cards.map((card) => {
    const title = card.match(/class="actu-card-title"[^>]*>([\s\S]*?)<\/h3>/);
    const date = card.match(/data-i18n-key="actu\.t\d+\.date">([\s\S]*?)<\/span>/);
    return { title: title ? clean(title[1]) : "", dateText: date ? clean(date[1]) : "", end: date ? lastFrenchDate(clean(date[1])) : null };
  }).filter((c) => c.title && c.end);
}

async function main() {
  const now = new Date();
  const cutoff = new Date(now.getTime() - WINDOW_DAYS * 864e5);
  const seen = readSeen(process.argv[2]);
  const seenSet = new Set(seen);
  const sections = [];
  const failures = [];
  const newPrints = [];
  let total = 0;

  for (const source of SOURCES) {
    let items;
    try {
      items = await collect(source, cutoff);
    } catch (e) {
      failures.push(`- ${md(source.name)} : ${md(e.message || String(e))} (${source.url})${source.quirk ? ` _(${md(source.quirk)})_` : ""}`);
      console.log(`! ${source.name} : ${e.message}`);
      continue;
    }
    const fresh = [];
    const links = new Set();
    for (const item of items) {
      if (!/^https?:\/\//.test(item.link) || links.has(item.link)) continue;
      links.add(item.link);
      const print = fingerprint(item.link);
      if (seenSet.has(print)) continue;
      if (item.date && item.date < cutoff) continue;
      newPrints.push(print); // même hors sujet : ne pas le réexaminer la semaine suivante
      if (!relevant(item, source)) continue;
      fresh.push(item);
    }
    console.log(`${source.name} : ${items.length} lus, ${fresh.length} nouveaux et pertinents`);
    if (!fresh.length) continue;
    total += fresh.length;
    fresh.sort((a, b) => (b.date || 0) - (a.date || 0));
    const href = (u) => u.replace(/[()\s<>]/g, (c) => encodeURIComponent(c));
    sections.push(`## ${md(source.name)} (${fresh.length})\n\n` + fresh.map((i) => `- [ ] [${md(i.title || i.link)}](${href(i.link)})${i.date ? ` : ${frDate(i.date)}` : ""}`).join("\n"));
  }

  const keep = [...newPrints, ...seen.filter((p) => !newPrints.includes(p))].slice(0, MAX_SEEN);
  const firstRun = seen.length === 0;

  const soon = new Date(now.getTime() + 14 * 864e5);
  const actus = datedActualites();
  const crossed = actus.filter((a) => a.end >= cutoff && a.end < now).sort((a, b) => a.end - b.end);
  const upcoming = actus.filter((a) => a.end >= now && a.end <= soon).sort((a, b) => a.end - b.end);
  const actuLine = (a) => `- [ ] ${md(a.title)} : ${md(a.dateText)}`;
  const actuSection = [];
  if (crossed.length) {
    actuSection.push(`## Actualités à relire : date passée depuis le relevé précédent (${crossed.length})`, "",
      "Sur https://wiyao.vercel.app/actualites.html : passer le texte au passé, ou indiquer « clos » pour une inscription ou une candidature.", "",
      ...crossed.map(actuLine), "");
  }
  if (upcoming.length) {
    actuSection.push(`## Actualités dont la date arrive dans les deux semaines (${upcoming.length})`, "",
      "Rien à faire pour l'instant : elles seront à relire au relevé suivant leur date.", "",
      ...upcoming.map(actuLine), "");
  }
  console.log(`Actualités : ${actus.length} datées, ${crossed.length} à relire, ${upcoming.length} à venir sous 14 jours`);
  const lines = [
    `# Veille WIYAO : ${frDate(now)}`,
    "",
    "Pistes relevées automatiquement dans des sources publiques togolaises. Ce rapport ne modifie rien sur le site : chaque piste doit être vérifiée à sa source d'origine avant d'entrer sur WIYAO (règle « contenu vérifié, jamais deviné »). Cocher une case ne déclenche rien ; c'est un simple pense-bête.",
    "",
    firstRun
      ? `**Premier relevé** : ${total} piste(s) de moins de ${WINDOW_DAYS} jours, et toutes celles des pages sans date.`
      : `**${total} nouvelle(s) piste(s)** depuis le relevé précédent.`,
    "",
    ...actuSection,
    ...(sections.length ? sections.flatMap((s) => [s, ""]) : ["Aucune nouvelle piste cette semaine.", ""]),
  ];
  if (failures.length) {
    lines.push("## Sources injoignables cette semaine", "", "Souvent passager (protection anti-robot, serveur lent) : à vérifier dans un navigateur avant de conclure qu'une source a disparu.", "", ...failures, "");
  }
  lines.push(
    "## Comment s'en servir",
    "",
    "- Une piste intéressante : ouvre-la, retrouve la source officielle (organisateur, école, ministère), puis ajoute l'information à la seule page où elle doit vivre (voir « Une information = une seule page » dans CLAUDE.md).",
    "- Une piste vue sur LinkedIn ou ailleurs : colle son lien dans une session Claude Code ou passe par le formulaire Proposer du site.",
    `- Sources suivies : ${SOURCES.map((s) => md(s.name)).join(", ")}. Pour en ajouter une : liste SOURCES de scripts/watch-sources.js.`,
    "",
    `<!-- wiyao-watch-seen: ${keep.join(",")} -->`,
    ""
  );
  fs.writeFileSync(REPORT, lines.join("\n"), "utf8");
  // Phrase reprise telle quelle dans le commentaire hebdomadaire de l'issue.
  const summary = `${total} nouvelle(s) piste(s)` + (crossed.length ? `, ${crossed.length} actualité(s) à relire (date passée)` : "");
  fs.writeFileSync(path.join(ROOT, "watch-summary.txt"), `${summary}\n`, "utf8");
  console.log(`\n${total} piste(s), rapport écrit dans watch-report.md`);
}

main().catch((err) => {
  console.error("Échec de la veille :", err);
  process.exit(1);
});
