#!/usr/bin/env node
"use strict";

/**
 * Plan du site (sitemap.xml) de WIYAO, généré à partir du dépôt (2026-11-10).
 *
 * Contenu : les pages HTML du site (sauf 404.html et roadmap.html sans
 * paramètre, qui n'affiche rien seule) puis une adresse par roadmap
 * (roadmap.html?id=…), lue dans ROLES et SKILLS de js/data.js. Pas de
 * <lastmod> : une date de dernière modification n'aide Google que si elle
 * est exacte, et le contenu d'une page vient aussi de js/i18n.js et de
 * js/data.js. Pas de <changefreq> ni de <priority> : Google les ignore.
 *
 * Usage :
 *   node scripts/build-sitemap.js           réécrit sitemap.xml
 *   node scripts/build-sitemap.js --check   code de sortie 1 si sitemap.xml
 *                                           n'est plus à jour (nouvelle page,
 *                                           nouvelle roadmap…)
 * Aucune dépendance npm.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://wiyao.vercel.app/";

// Ordre d'importance pour un bachelier ; toute page HTML absente de cette
// liste (et de EXCLUDED) fait échouer le script, pour qu'une nouvelle page
// ne soit jamais oubliée.
const PAGES = [
  "index.html",
  "test-orientation.html",
  "roadmaps.html",
  "ecoles.html",
  "calendrier.html",
  "bourses-financement.html",
  "stages-emploi.html",
  "ecosysteme.html",
  "actualites.html",
  "temoignages.html",
  "faq.html",
  "recherche.html",
  "about.html",
  "contact.html",
  "proposer.html",
  "mentions-legales.html",
  "politique-confidentialite.html",
  "conditions-utilisation.html",
];
const EXCLUDED = ["404.html", "roadmap.html"];

function roadmapIds() {
  const src = fs.readFileSync(path.join(ROOT, "js", "data.js"), "utf8");
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(src + "\n;this.__ids = Object.keys(ROLES).concat(Object.keys(SKILLS));", ctx);
  return ctx.__ids;
}

function build() {
  const onDisk = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
  const unknown = onDisk.filter((f) => !PAGES.includes(f) && !EXCLUDED.includes(f));
  const missing = PAGES.filter((f) => !onDisk.includes(f));
  if (unknown.length || missing.length) {
    if (unknown.length) console.error("Pages absentes de la liste PAGES de scripts/build-sitemap.js : " + unknown.join(", "));
    if (missing.length) console.error("Pages listées mais introuvables : " + missing.join(", "));
    process.exit(1);
  }

  const ids = roadmapIds();
  const bad = ids.filter((id) => !/^[a-z0-9-]+$/.test(id));
  if (bad.length) {
    console.error("Identifiants de roadmap inattendus : " + bad.join(", "));
    process.exit(1);
  }

  const urls = PAGES.map((f) => (f === "index.html" ? SITE : SITE + f))
    .concat(ids.map((id) => SITE + "roadmap.html?id=" + id));

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => "  <url><loc>" + u + "</loc></url>\n").join("") +
    "</urlset>\n"
  );
}

const out = build();
const file = path.join(ROOT, "sitemap.xml");

if (process.argv.includes("--check")) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") : "";
  if (current !== out) {
    console.error("sitemap.xml n'est plus à jour : lancer node scripts/build-sitemap.js puis committer le résultat.");
    process.exit(1);
  }
  console.log("sitemap.xml à jour (" + (out.match(/<loc>/g) || []).length + " adresses).");
} else {
  fs.writeFileSync(file, out);
  console.log("sitemap.xml écrit (" + (out.match(/<loc>/g) || []).length + " adresses).");
}
