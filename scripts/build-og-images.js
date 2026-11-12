#!/usr/bin/env node
"use strict";

/**
 * Images d'aperçu par page (og:image, 1200×630) de WIYAO (2026-11-10, plan
 * marketing) : ce que montrent WhatsApp, Facebook, LinkedIn ou X quand on
 * partage un lien du site. Une image par page, au style du site : fond vert,
 * logo WIYAO blanc (la règle du site pour l'image de partage), titre en
 * capitales Bricolage Grotesque avec un mot sur un bloc jaune, sous-titre
 * en Urbanist, bande vert nuit avec l'adresse du site.
 *
 * Les textes reprennent ceux des pages (titre, introduction, chiffres
 * publiés) : rien d'inventé. Si un titre ou un chiffre change sur le site,
 * modifier PAGES puis relancer le script.
 *
 * Rendu par Chrome (ou Edge) sans interface, sans dépendance npm :
 *   node scripts/build-og-images.js           toutes les pages
 *   node scripts/build-og-images.js ecoles    une seule (nom du fichier sans .html)
 * Variable facultative : CHROME_PATH. Les images vont dans icons/og/.
 * Les pages HTML les déclarent dans og:image et twitter:image.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "icons", "og");

const PAGES = [
  { file: "index", l1: "Après le bac,", hl: "la tech ?", sub: "Ton guide des études et des métiers tech au Togo" },
  { file: "test-orientation", l1: "Pas sûr·e de ta voie ?", hl: "Test d'orientation", sub: "14 questions · gratuit · sans compte" },
  { file: "roadmaps", l1: "Choisis ta", hl: "roadmap", sub: "89 roadmaps : 60 métiers et 29 compétences tech" },
  { file: "roadmap", l1: "Ta roadmap,", hl: "étape par étape", sub: "Ce qu'il faut apprendre, dans l'ordre, avec des ressources et des écoles au Togo" },
  { file: "ecoles", l1: "Trouve l'école", hl: "qu'il te faut", sub: "33 écoles et universités tech du Togo comparées" },
  { file: "calendrier", l1: "Après le bac :", hl: "les dates clés", sub: "Résultats, inscriptions, concours et rentrée, école par école" },
  { file: "bourses-financement", l1: "Comment financer", hl: "tes études ?", sub: "Bourse d'État, bourses des écoles et autres solutions vérifiées" },
  { file: "stages-emploi", l1: "Et après", hl: "la formation ?", sub: "Où chercher un stage ou un premier emploi dans la tech au Togo" },
  { file: "ecosysteme", l1: "Écosystème", hl: "tech togolais", sub: "Écoles, communautés, pôles d'innovation et institutions" },
  { file: "actualites", l1: "Ce qui se passe", hl: "dans la tech togolaise", sub: "Événements, lancements, startups, financements : sourcés et datés" },
  { file: "temoignages", l1: "Convaincs", hl: "tes parents", sub: "Les chiffres du numérique togolais et des parcours vérifiés" },
  { file: "faq", l1: "Questions", hl: "fréquentes", sub: "Les questions les plus fréquentes sur WIYAO, et leurs réponses" },
  { file: "recherche", l1: "Cherche n'importe quoi", hl: "sur WIYAO", sub: "Roadmaps, écoles, bourses, stages, actualités et FAQ, en une recherche" },
  { file: "about", l1: "À propos", hl: "& méthodologie", sub: "Comment chaque information est conçue, vérifiée et tenue à jour" },
  { file: "contact", l1: "Une question ?", hl: "Écris-nous", sub: "Une question, une remarque ou une correction à signaler" },
  { file: "proposer", l1: "Une école, un événement", hl: "manque ?", sub: "Propose-le : chaque suggestion est vérifiée avant d'être publiée" },
  { file: "mentions-legales", l1: "WIYAO", hl: "Mentions légales", sub: "Le guide des études et des métiers de la tech au Togo" },
  { file: "politique-confidentialite", l1: "WIYAO", hl: "Confidentialité", sub: "Aucune collecte de données, sauf les messages que tu nous envoies" },
  { file: "conditions-utilisation", l1: "WIYAO", hl: "Conditions d'utilisation", sub: "Le guide des études et des métiers de la tech au Togo" },
];

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error("Chrome introuvable : définir CHROME_PATH.");
  return found;
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function html(page) {
  const font = (f) => "file:///" + path.join(ROOT, "fonts", f).replace(/\\/g, "/");
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>
@font-face { font-family: "Bricolage Grotesque"; font-weight: 200 800; src: url("${font("bricolage-grotesque-variable-latin.woff2")}") format("woff2"); }
@font-face { font-family: "Urbanist"; font-weight: 100 900; src: url("${font("urbanist-variable-latin.woff2")}") format("woff2"); }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { background: #006a4e; color: #ffffff; font-family: "Urbanist", sans-serif; display: flex; flex-direction: column; }
.main { flex: 1; padding: 56px 72px 0; display: flex; flex-direction: column; }
.logo { font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; font-size: 40px; letter-spacing: 0.18em; line-height: 1; }
.title { margin-top: auto; font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; text-transform: uppercase; line-height: 1.04; font-size: 84px; }
.title .hl { display: inline-block; margin-top: 10px; padding: 0 16px; background: #ffce00; color: #0b3a2c; border: 4px solid #0b3a2c; box-shadow: 10px 10px 0 #0b3a2c; }
.sub { margin: 34px 0 52px; font-size: 32px; font-weight: 600; line-height: 1.25; max-width: 1020px; }
.bar { height: 70px; background: #0b3a2c; display: flex; align-items: center; padding: 0 72px; font-size: 27px; font-weight: 700; letter-spacing: 0.02em; }
</style></head><body>
<div class="main">
  <div class="logo">WIYAO</div>
  <div class="title" id="t">${page.l1 ? esc(page.l1) + "<br>" : ""}<span class="hl">${esc(page.hl)}</span></div>
  <p class="sub">${esc(page.sub)}</p>
</div>
<div class="bar">wiyao.vercel.app</div>
<script>
  // Le titre rétrécit jusqu'à tenir sur la largeur et sur trois lignes au plus.
  document.fonts.ready.then(function () {
    var t = document.getElementById("t");
    var size = 84;
    function fits() {
      var hl = t.querySelector(".hl");
      return t.scrollWidth <= 1056 && hl.getBoundingClientRect().right <= 1128 && t.getBoundingClientRect().height <= size * 1.04 * 2 + 30;
    }
    while (!fits() && size > 44) { size -= 2; t.style.fontSize = size + "px"; }
    document.body.setAttribute("data-ready", "1");
  });
</script>
</body></html>`;
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

function main() {
  const only = process.argv[2];
  const pages = only ? PAGES.filter((p) => p.file === only) : PAGES;
  if (!pages.length) throw new Error("Page inconnue : " + only);
  const chrome = findChrome();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "wiyao-og-"));
  fs.mkdirSync(OUT, { recursive: true });
  for (const page of pages) {
    if (!fs.existsSync(path.join(ROOT, page.file + ".html"))) throw new Error("Page absente du site : " + page.file);
    const src = path.join(tmp, page.file + ".html");
    fs.writeFileSync(src, html(page));
    const out = path.join(OUT, page.file + ".png");
    execFileSync(chrome, [
      "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
      "--allow-file-access-from-files", "--user-data-dir=" + path.join(tmp, "profile"),
      "--window-size=1200,630", "--virtual-time-budget=4000", "--screenshot=" + out,
      "file:///" + src.replace(/\\/g, "/"),
    ], { stdio: "ignore" });
    const [w, h] = pngSize(out);
    if (w !== 1200 || h !== 630) throw new Error(`${page.file}.png fait ${w}×${h} au lieu de 1200×630`);
    console.log(`icons/og/${page.file}.png (${Math.round(fs.statSync(out).size / 1024)} Ko)`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

module.exports = { PAGES };
