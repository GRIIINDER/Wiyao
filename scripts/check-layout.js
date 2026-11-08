#!/usr/bin/env node
"use strict";

/**
 * Contrôle automatique de mise en page de WIYAO (2026-11-08), sans dépendance
 * npm. Ce script sert une copie locale du site, lance un Chrome sans
 * interface et le pilote par le protocole DevTools (client WebSocket intégré
 * à Node 22 et plus). Il vérifie ce que les sessions mesuraient à la main :
 *
 *   1. Haut d'une roadmap : les 89 roadmaps, en français et en anglais,
 *      tiennent dans le premier écran avec le bandeau défilant visible en
 *      entier (375×740, 375×667 et 360×640, voir CLAUDE.md) ;
 *   2. Bouton pause du bandeau (WCAG 2.2.2) : jamais recouvert par un bouton
 *      flottant (bulle de l'assistant, « haut de page »...), ni au premier
 *      écran ni quand le bandeau arrive en bas de l'écran, sur les 20 pages
 *      et une roadmap (360×640 et 375×812) ;
 *   3. Aucun débordement horizontal sur mobile (320×568, 360×640, 375×812).
 *
 * Tout le réseau extérieur est coupé dans le navigateur : seul le site local
 * répond. Rien n'est modifié dans le dépôt.
 *
 * Usage : node scripts/check-layout.js
 * Variable facultative : CHROME_PATH (chemin d'un Chrome, Chromium ou Edge).
 * Code de sortie 1 si une vérification échoue.
 */

const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

// Tailles d'écran (zone d'affichage du navigateur, en px).
const FIT_SIZES = [[375, 740], [375, 667], [360, 640]];
const PAUSE_SIZES = [[360, 640], [375, 812]];
const OVERFLOW_ONLY_SIZES = [[320, 568]];
const LANGS = ["fr", "en"];

// ---- Serveur local ---------------------------------------------------------
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function startServer() {
  const server = http.createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    } catch (e) {
      res.writeHead(400).end();
      return;
    }
    if (pathname.endsWith("/")) pathname += "index.html";
    // Jamais de fichier caché (.git, .github...) ni de sortie du dépôt.
    const file = path.resolve(ROOT, "." + pathname);
    const inside = file.startsWith(ROOT + path.sep);
    const hidden = pathname.split("/").some((part) => part.startsWith("."));
    if (!inside || hidden) {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("404");
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" }).end("404");
        return;
      }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    });
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

// ---- Navigateur -------------------------------------------------------------
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.CHROME_BIN,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);
  return candidates.find((p) => {
    try {
      return fs.statSync(p).isFile();
    } catch (e) {
      return false;
    }
  });
}

function launchChrome(exe, userDataDir) {
  const args = [
    "--headless=new",
    "--remote-debugging-port=0",
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--disable-sync",
    "--disable-background-networking",
    "--mute-audio",
    // Réseau extérieur coupé : seul le site local (127.0.0.1) répond.
    "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1",
    "about:blank",
  ];
  // Runner CI jetable, qui ne charge que le site local : le bac à sable de
  // Chrome n'y démarre pas toujours (espaces de noms restreints).
  if (process.env.CI) args.push("--no-sandbox");
  const proc = spawn(exe, args, { stdio: ["ignore", "ignore", "pipe"] });
  return new Promise((resolve, reject) => {
    let log = "";
    const timer = setTimeout(() => reject(new Error("Chrome n'a pas donné son adresse DevTools en 30 s.\n" + log.slice(-2000))), 30000);
    proc.stderr.on("data", (chunk) => {
      log += chunk;
      const m = log.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) {
        clearTimeout(timer);
        resolve({ proc, wsUrl: m[1] });
      }
    });
    proc.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome s'est arrêté (code ${code}).\n` + log.slice(-2000)));
    });
  });
}

// ---- Client DevTools minimal -------------------------------------------------
class Cdp {
  static connect(url) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      ws.addEventListener("open", () => resolve(new Cdp(ws)));
      ws.addEventListener("error", () => reject(new Error("connexion DevTools impossible")));
    });
  }

  constructor(ws) {
    this.ws = ws;
    this.nextId = 0;
    this.pending = new Map();
    this.listeners = new Set();
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(typeof event.data === "string" ? event.data : Buffer.from(event.data).toString());
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const listener of [...this.listeners]) listener(msg);
      }
    });
  }

  send(method, params = {}, sessionId) {
    const id = ++this.nextId;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
    });
  }

  waitFor(method, sessionId, timeoutMs) {
    return new Promise((resolve, reject) => {
      const listener = (msg) => {
        if (msg.method === method && msg.sessionId === sessionId) {
          this.listeners.delete(listener);
          clearTimeout(timer);
          resolve(msg.params);
        }
      };
      const timer = setTimeout(() => {
        this.listeners.delete(listener);
        reject(new Error(`délai dépassé en attendant ${method}`));
      }, timeoutMs);
      this.listeners.add(listener);
    });
  }

  close() {
    try {
      this.ws.close();
    } catch (e) {
      // déjà fermé
    }
  }
}

class Page {
  constructor(cdp, sessionId) {
    this.cdp = cdp;
    this.sessionId = sessionId;
  }

  static async open(cdp) {
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    await cdp.send("Page.enable", {}, sessionId);
    return new Page(cdp, sessionId);
  }

  send(method, params) {
    return this.cdp.send(method, params, this.sessionId);
  }

  async viewport(width, height) {
    const mobile = width < 768;
    await this.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
    await this.send("Emulation.setTouchEmulationEnabled", { enabled: mobile, maxTouchPoints: mobile ? 5 : 1 });
  }

  async goto(url) {
    const loaded = this.cdp.waitFor("Page.loadEventFired", this.sessionId, 30000);
    const res = await this.send("Page.navigate", { url });
    if (res.errorText) throw new Error(`${url} : ${res.errorText}`);
    await loaded;
  }

  async run(expression) {
    const res = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (res.exceptionDetails) {
      const ex = res.exceptionDetails.exception;
      throw new Error((ex && ex.description) || res.exceptionDetails.text);
    }
    return res.result.value;
  }
}

// ---- Mesures, exécutées dans la page ------------------------------------------
// Positions lues dans la mise en page (offsetTop), sans les transformations
// des animations d'arrivée.
const FIT_EXPR = `(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const sel = "#roadmap-detail > .roadmap-header h1";
  for (let i = 0; i < 100 && !(document.querySelector(sel) && document.querySelector(".marquee")); i++) await wait(50);
  await document.fonts.ready;
  window.scrollTo(0, 0);
  await wait(30);
  const h1 = document.querySelector(sel), mq = document.querySelector(".marquee");
  if (!h1 || !mq) return { error: "titre ou bandeau introuvable" };
  let top = 0;
  for (let el = mq; el; el = el.offsetParent) top += el.offsetTop;
  return {
    title: h1.textContent.trim(),
    marqueeBottom: top + mq.offsetHeight,
    screen: window.innerHeight,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth
  };
})()`;

const OVERFLOW_EXPR = `(async () => {
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 30));
  return document.documentElement.scrollWidth - document.documentElement.clientWidth;
})()`;

// Le bouton pause est « atteignable » si un appui en son centre tombe bien
// sur lui. Les boutons flottants s'effacent après un court délai (nav.js) :
// on laisse jusqu'à 4 s pour que tout se mette en place.
const PAUSE_EXPR = `(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  await document.fonts.ready;
  const pause = document.querySelector(".marquee-pause");
  if (!pause) return { skip: "pas de bandeau" };
  if (!pause.getClientRects().length) return { skip: "bouton pause masqué" };
  const name = (el) => {
    if (!el) return "rien";
    if (el.closest(".wiyao-assistant-toggle")) return "la bulle de l'assistant";
    if (el.closest(".back-to-top")) return "le bouton « haut de page »";
    if (el.closest(".cta-float")) return "le bouton flottant du test";
    const cls = typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\\s+/)[0] : "";
    return el.tagName.toLowerCase() + cls;
  };
  const probe = () => {
    const r = pause.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= window.innerHeight) return { state: "offscreen" };
    const hit = document.elementFromPoint(r.left + r.width / 2, Math.min(r.top + r.height / 2, window.innerHeight - 1));
    return hit && hit.closest(".marquee-pause") ? { state: "ok" } : { state: "covered", by: name(hit) };
  };
  const settle = async () => {
    let p = probe();
    for (let i = 0; i < 40 && p.state === "covered"; i++) {
      await wait(100);
      p = probe();
    }
    return p;
  };
  window.scrollTo(0, 0);
  await wait(50);
  const atRest = await settle();
  const mq = pause.closest(".marquee");
  let top = 0;
  for (let el = mq; el; el = el.offsetParent) top += el.offsetTop;
  const target = top + mq.offsetHeight - window.innerHeight;
  let atBottom = { state: "same" };
  if (target > 0) {
    window.scrollTo(0, target);
    await wait(50);
    atBottom = await settle();
    window.scrollTo(0, 0);
  }
  return { atRest, atBottom };
})()`;

// ---- Déroulé ---------------------------------------------------------------
async function setLang(page, base, lang) {
  await page.goto(`${base}/index.html`);
  await page.run(`localStorage.setItem("wiyao-lang", ${JSON.stringify(lang)}); true`);
}

async function checkRoadmaps(page, base, failures) {
  await page.viewport(FIT_SIZES[0][0], FIT_SIZES[0][1]);
  await page.goto(`${base}/roadmaps.html`);
  const ids = await page.run(`Object.keys(ROLES).concat(Object.keys(SKILLS))`);
  let checks = 0;
  for (const lang of LANGS) {
    await setLang(page, base, lang);
    for (const id of ids) {
      await page.viewport(FIT_SIZES[0][0], FIT_SIZES[0][1]);
      await page.goto(`${base}/roadmap.html?id=${encodeURIComponent(id)}`);
      for (const [w, h] of FIT_SIZES) {
        await page.viewport(w, h);
        const m = await page.run(FIT_EXPR);
        checks++;
        const where = `roadmap ${id} (${lang}, ${w}×${h})`;
        if (m.error) failures.push(`${where} : ${m.error}`);
        else if (m.marqueeBottom > m.screen + 1) {
          failures.push(`${where} : le bandeau dépasse de l'écran de ${m.marqueeBottom - m.screen} px (« ${m.title} »)`);
        }
        if (m.overflowX > 0) failures.push(`${where} : débordement horizontal de ${m.overflowX} px`);
      }
      for (const [w, h] of OVERFLOW_ONLY_SIZES) {
        await page.viewport(w, h);
        const overflow = await page.run(OVERFLOW_EXPR);
        checks++;
        if (overflow > 0) failures.push(`roadmap ${id} (${lang}, ${w}×${h}) : débordement horizontal de ${overflow} px`);
      }
    }
  }
  return { roadmaps: ids.length, checks };
}

async function checkPages(page, base, failures) {
  const pages = fs
    .readdirSync(ROOT)
    .filter((f) => f.endsWith(".html"))
    .sort()
    .map((f) => (f === "roadmap.html" ? "roadmap.html?id=web-dev" : f));
  let checks = 0;
  for (const lang of LANGS) {
    await setLang(page, base, lang);
    for (const p of pages) {
      for (const [w, h] of PAUSE_SIZES) {
        await page.viewport(w, h);
        await page.goto(`${base}/${p}`);
        const m = await page.run(PAUSE_EXPR);
        checks++;
        const where = `${p} (${lang}, ${w}×${h})`;
        if (m.skip) failures.push(`${where} : ${m.skip}`);
        else {
          if (m.atRest.state === "covered") failures.push(`${where} : au premier écran, le bouton pause est recouvert par ${m.atRest.by}`);
          if (m.atBottom.state === "covered") failures.push(`${where} : bandeau en bas de l'écran, le bouton pause est recouvert par ${m.atBottom.by}`);
        }
        const overflow = await page.run(OVERFLOW_EXPR);
        if (overflow > 0) failures.push(`${where} : débordement horizontal de ${overflow} px`);
      }
      for (const [w, h] of OVERFLOW_ONLY_SIZES) {
        await page.viewport(w, h);
        const overflow = await page.run(OVERFLOW_EXPR);
        checks++;
        if (overflow > 0) failures.push(`${p} (${lang}, ${w}×${h}) : débordement horizontal de ${overflow} px`);
      }
    }
  }
  return { pages: pages.length, checks };
}

async function main() {
  if (typeof WebSocket !== "function") {
    throw new Error("Node 22 ou plus est nécessaire (client WebSocket intégré).");
  }
  const exe = findChrome();
  if (!exe) throw new Error("Aucun Chrome, Chromium ou Edge trouvé : indique son chemin dans CHROME_PATH.");

  const server = await startServer();
  const base = `http://127.0.0.1:${server.address().port}`;
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "wiyao-layout-"));
  let chrome;
  let cdp;
  const failures = [];
  const started = Date.now();
  try {
    chrome = await launchChrome(exe, userDataDir);
    cdp = await Cdp.connect(chrome.wsUrl);
    const page = await Page.open(cdp);

    console.log("1/2 Haut des roadmaps et débordements...");
    const r = await checkRoadmaps(page, base, failures);
    console.log(`    ${r.roadmaps} roadmaps, ${r.checks} mesures.`);
    console.log("2/2 Bouton pause du bandeau et débordements sur les pages...");
    const p = await checkPages(page, base, failures);
    console.log(`    ${p.pages} pages, ${p.checks} mesures.`);
  } finally {
    if (cdp) cdp.close();
    if (chrome) chrome.proc.kill();
    server.close();
    // Chrome garde parfois ses fichiers ouverts un instant après l'arrêt.
    await new Promise((r) => setTimeout(r, 500));
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch (e) {
      // dossier temporaire : tant pis s'il reste
    }
  }

  const seconds = Math.round((Date.now() - started) / 1000);
  if (failures.length) {
    console.log(`\n${failures.length} problème(s) de mise en page (${seconds} s) :`);
    for (const f of failures) console.log(`- ${f}`);
    process.exitCode = 1;
  } else {
    console.log(`\nMise en page OK (${seconds} s).`);
  }
}

main().catch((err) => {
  console.error("Échec du contrôle de mise en page :", err.message || err);
  process.exit(1);
});
