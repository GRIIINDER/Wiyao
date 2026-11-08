// Logique de rendu - WIYAO
(function () {
  "use strict";

  const STORAGE_KEY = "wiyao-progress";

  // Traduction du contenu dynamique (data.js) : chaque objet peut porter un
  // champ "xxxEn" à côté de "xxx" ; tField renvoie la version anglaise si elle
  // existe et que la langue courante est "en", sinon la version française.
  function currentLang() {
    return localStorage.getItem("wiyao-lang") === "en" ? "en" : "fr";
  }

  function tField(obj, field) {
    if (!obj) return "";
    const en = obj[field + "En"];
    return currentLang() === "en" && en ? en : obj[field];
  }

  // Même chose pour une liste (filières, niveaux) : "filieresEn" à côté de
  // "filieres". Pour l'affichage seulement : les correspondances (test
  // d'orientation, domaines d'une école) lisent toujours la liste française.
  function tList(obj, field) {
    if (!obj) return [];
    const en = obj[field + "En"];
    return currentLang() === "en" && Array.isArray(en) && en.length ? en : obj[field] || [];
  }

  // Ressources des roadmaps : en anglais, un lien vers la version française
  // d'une documentation multilingue mène à la même page en anglais
  // (correspondances vérifiées le 2026-11-07). Les ressources qui n'existent
  // qu'en français portent la mention "(in French)" dans leur libellé anglais.
  const EN_URL_RULES = [
    [/^https:\/\/developer\.mozilla\.org\/fr\//, "https://developer.mozilla.org/en-US/"],
    [/^https:\/\/nodejs\.org\/fr\//, "https://nodejs.org/en/"],
    [/^https:\/\/docs\.github\.com\/fr\//, "https://docs.github.com/en/"],
    [/^https:\/\/kubernetes\.io\/fr\//, "https://kubernetes.io/"],
    [/^(https:\/\/support\.google\.com\/[^?]*\?(?:.*&)?hl=)fr\b/, "$1en"],
    [/^https:\/\/help\.tableau\.com\/(.*)\/fr-fr\//, "https://help.tableau.com/$1/en-us/"],
    [/^https:\/\/www\.tableau\.com\/fr-fr\//, "https://www.tableau.com/"],
    [/^https:\/\/git-scm\.com\/book\/fr\/v2\/.*$/, "https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup"],
    [/^https:\/\/docs\.python\.org\/fr\//, "https://docs.python.org/"],
    [/^https:\/\/expressjs\.com\/fr\//, "https://expressjs.com/en/"],
    [/^https:\/\/www\.php\.net\/manual\/fr\//, "https://www.php.net/manual/en/"],
    [/^https:\/\/fr\.khanacademy\.org\/math\/statistics-probability\//, "https://www.khanacademy.org/math/statistics-probability/"]
  ];

  function localizeUrl(url) {
    if (!url || currentLang() !== "en") return url;
    for (let i = 0; i < EN_URL_RULES.length; i++) {
      if (EN_URL_RULES[i][0].test(url)) return url.replace(EN_URL_RULES[i][0], EN_URL_RULES[i][1]);
    }
    return url;
  }

  // Toute valeur de data.js insérée dans du HTML (innerHTML) passe par ici.
  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Liens sûrs seulement : http(s), mailto, ou chemin relatif du site.
  // Refuse javascript:, data:, etc. Les tabulations et retours à la ligne
  // sont retirés d'abord, comme le fait le navigateur (sinon "/\t/site.com"
  // passerait pour un chemin relatif et mènerait vers un autre site).
  function safeUrl(url) {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.replace(/[\t\n\r]/g, "").trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.indexOf("\\") !== -1) return "";
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
      return trimmed.indexOf(":") === -1 ? trimmed : "";
    }
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === "https:" || parsed.protocol === "http:" || parsed.protocol === "mailto:") return parsed.href;
    } catch (e) {}
    return "";
  }

  // Minuscules + suppression des accents, pour un matching de recherche
  // insensible à la casse et aux accents (partagé par la recherche globale
  // et l'assistant).
  function normalize(str) {
    const decomposed = str.toLowerCase().normalize("NFD");
    let out = "";
    for (let i = 0; i < decomposed.length; i++) {
      const code = decomposed.charCodeAt(i);
      if (code < 0x0300 || code > 0x036f) out += decomposed[i];
    }
    return out;
  }

  // Map plutôt qu'objet littéral : une clé de roadmap ne peut jamais
  // interagir avec Object.prototype (ex. "__proto__" via roadmap.html?id=...).
  function loadProgress() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return new Map(Object.entries(parsed || {}));
    } catch (e) {
      return new Map();
    }
  }

  function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(progress)));
  }

  function toggleItem(roadmapId, itemKey) {
    const progress = loadProgress();
    const items = progress.get(roadmapId) || [];
    const idx = items.indexOf(itemKey);
    if (idx >= 0) {
      items.splice(idx, 1);
    } else {
      items.push(itemKey);
    }
    progress.set(roadmapId, items);
    saveProgress(progress);
    return progress;
  }

  function countItems(roadmap) {
    let total = 0;
    roadmap.sections.forEach((s) => (total += s.items.length));
    return total;
  }

  function getDoneCount(roadmapId) {
    const progress = loadProgress();
    return (progress.get(roadmapId) || []).length;
  }

  // Libellé accessible de la case à cocher d'une étape de roadmap : dépend à
  // la fois de la langue courante et de l'état (une case déjà cochée doit
  // annoncer qu'un clic la décochera, pas l'inverse).
  function checkAriaLabel(isDone) {
    const en = currentLang() === "en";
    if (isDone) return en ? "Mark as not done" : "Décocher comme fait";
    return en ? "Mark as done" : "Marquer comme fait";
  }

  function levelSlug(level) {
    if (level === "Débutant") return "debutant";
    if (level === "Intermédiaire") return "intermediaire";
    if (level === "Avancé") return "avance";
    return "";
  }

  function levelLabel(level) {
    if (currentLang() !== "en") return level;
    if (level === "Débutant") return "Beginner";
    if (level === "Intermédiaire") return "Intermediate";
    if (level === "Avancé") return "Advanced";
    return level;
  }

  function badgesHtml(rm) {
    const levelBadge = rm.level
      ? `<span class="badge level-badge level-${levelSlug(rm.level)}">${escapeHtml(levelLabel(rm.level))}</span>`
      : "";
    const togoBadge = rm.togoVerified
      ? `<span class="badge togo-badge">✓ ${currentLang() === "en" ? "Togo-verified" : "Vérifié Togo"}</span>`
      : "";
    return levelBadge + togoBadge;
  }

  function buildCard(id, rm, kind) {
    const total = countItems(rm);
    const done = getDoneCount(id);
    const pct = total ? Math.round((done / total) * 100) : 0;

    const card = document.createElement("a");
    card.href = `roadmap.html?id=${encodeURIComponent(id)}`;
    card.className = "card";
    card.dataset.title = rm.title.toLowerCase();
    if (rm.domain) card.dataset.domain = rm.domain;
    const badges = badgesHtml(rm);
    const cardLabel = currentLang() === "en" ? "completed" : "complété";
    card.innerHTML = `
      <div class="card-body">
        <div class="card-icon">${roadmapIcon(rm.icon, "ico-roadmap")}</div>
        ${badges ? `<div class="card-badges">${badges}</div>` : ""}
        <h3>${escapeHtml(tField(rm, "title"))}</h3>
        <p>${escapeHtml(tField(rm, "subtitle"))}</p>
        <div class="card-meta-divider"></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="progress-label">${pct}% ${cardLabel}</span>
      </div>
    `;
    return card;
  }

  // ---- Bouton "Voir les N roadmaps/compétences" : replié par défaut pour
  // éviter un scroll de ~70 cartes d'un coup sur l'accueil. Le texte se lit
  // sur les attributs posés à la création (kind, count), pas sur des
  // paramètres passés à chaque appel, pour rester correct après un clic. ----
  function updateGroupToggleLabel(toggle) {
    const n = toggle.dataset.count;
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    const en = currentLang() === "en";
    if (isOpen) {
      toggle.textContent = en ? "Show less ▴" : "Réduire ▴";
      return;
    }
    const one = n === "1";
    if (toggle.dataset.kind === "skill") {
      toggle.textContent = en
        ? `See ${n} more skill${one ? "" : "s"} ▾`
        : (one ? "Voir l'autre compétence ▾" : `Voir les ${n} autres compétences ▾`);
    } else {
      toggle.textContent = en
        ? `See ${n} more roadmap${one ? "" : "s"} ▾`
        : (one ? "Voir l'autre roadmap ▾" : `Voir les ${n} autres roadmaps ▾`);
    }
  }

  function setGroupOpen(toggle, subGrid, isOpen) {
    subGrid.classList.toggle("is-collapsed", !isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    updateGroupToggleLabel(toggle);
  }

  function buildGroupToggle(kind, count, controlsId) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "domain-group-toggle";
    if (kind === "skill") toggle.classList.add("skill-grid-toggle");
    toggle.dataset.kind = kind;
    toggle.dataset.count = String(count);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", controlsId);
    updateGroupToggleLabel(toggle);
    return toggle;
  }

  // ---- Page Roadmaps : deux grilles, par métier et par compétence ----
  // Aperçu visible avant « Voir les N autres » : une rangée de cartes par
  // domaine, deux rangées de compétences.
  const ROLE_PREVIEW = 3;
  const SKILL_PREVIEW = 6;

  function renderGrid() {
    const roleGrid = document.getElementById("role-grid");
    const skillGrid = document.getElementById("skill-grid");
    if (!roleGrid && !skillGrid) return;

    if (roleGrid && typeof ROLES !== "undefined") {
      const byDomain = {};
      Object.keys(ROLES).forEach((id) => {
        const domain = ROLES[id].domain || "Autres";
        if (!byDomain[domain]) byDomain[domain] = [];
        byDomain[domain].push(id);
      });

      const domainOrder = typeof DOMAINS !== "undefined" ? Object.keys(DOMAINS) : [];
      const orderedDomains = domainOrder.filter((d) => byDomain[d]);
      Object.keys(byDomain).forEach((d) => {
        if (orderedDomains.indexOf(d) === -1) orderedDomains.push(d);
      });

      orderedDomains.forEach((domainName, index) => {
        const meta = typeof DOMAINS !== "undefined" ? DOMAINS[domainName] : null;
        const ids = byDomain[domainName];

        const group = document.createElement("div");
        group.className = "domain-group";

        const domainLabel = meta && currentLang() === "en" && meta.nameEn ? meta.nameEn : domainName;
        const heading = document.createElement("h3");
        heading.className = "domain-group-title";
        heading.textContent = domainLabel;
        heading.insertAdjacentHTML("afterbegin", domainIcon(domainName));
        group.appendChild(heading);

        if (meta && meta.description) {
          const desc = document.createElement("p");
          desc.className = "domain-group-desc";
          desc.textContent = tField(meta, "description");
          group.appendChild(desc);
        }

        // Les 3 premières roadmaps du domaine sont visibles dès le chargement
        // (avant : 0, tout était replié derrière « Voir les N roadmaps »).
        const subGrid = document.createElement("div");
        subGrid.className = "grid";
        subGrid.id = `domain-grid-${index}`;
        ids.forEach((id, i) => {
          const card = buildCard(id, ROLES[id], "role");
          if (i >= ROLE_PREVIEW) card.classList.add("card-extra");
          subGrid.appendChild(card);
        });
        group.appendChild(subGrid);

        if (ids.length > ROLE_PREVIEW) {
          subGrid.classList.add("is-collapsed");
          const toggle = buildGroupToggle("roadmap", ids.length - ROLE_PREVIEW, subGrid.id);
          toggle.addEventListener("click", () => setGroupOpen(toggle, subGrid, subGrid.classList.contains("is-collapsed")));
          group.appendChild(toggle);
        }

        roleGrid.appendChild(group);
      });
    }
    if (skillGrid && typeof SKILLS !== "undefined") {
      const skillIds = Object.keys(SKILLS);
      skillIds.forEach((id, i) => {
        const card = buildCard(id, SKILLS[id], "skill");
        if (i >= SKILL_PREVIEW) card.classList.add("card-extra");
        skillGrid.appendChild(card);
      });

      if (skillIds.length > SKILL_PREVIEW) {
        skillGrid.classList.add("is-collapsed");
        const skillToggle = buildGroupToggle("skill", skillIds.length - SKILL_PREVIEW, "skill-grid");
        skillToggle.addEventListener("click", () => setGroupOpen(skillToggle, skillGrid, skillGrid.classList.contains("is-collapsed")));
        skillGrid.insertAdjacentElement("afterend", skillToggle);
      }
    }
  }

  // ---- Icônes au trait (SVG, même famille que celles du menu) ----
  // Remplacent les emoji d'interface, qui s'affichent différemment selon le
  // téléphone (et en lettres « TG » / « GB » sous Windows). Les 89 roadmaps
  // aussi depuis le 2026-11-07 (clé `icon` de js/data.js) : le site n'a plus
  // que les 4 couleurs du drapeau, et les emoji arrivaient avec les leurs.
  const ICON_PATHS = {
    "code": "<polyline points=\"16 18 22 12 16 6\"></polyline><polyline points=\"8 6 2 12 8 18\"></polyline>",
    "chart": "<line x1=\"12\" y1=\"20\" x2=\"12\" y2=\"10\"></line><line x1=\"18\" y1=\"20\" x2=\"18\" y2=\"4\"></line><line x1=\"6\" y1=\"20\" x2=\"6\" y2=\"16\"></line>",
    "shield": "<path d=\"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z\"></path>",
    "pen": "<path d=\"M12 19l7-7 3 3-7 7-3-3z\"></path><path d=\"M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z\"></path><path d=\"M2 2l7.586 7.586\"></path><circle cx=\"11\" cy=\"11\" r=\"2\"></circle>",
    "cloud": "<path d=\"M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z\"></path>",
    "megaphone": "<path d=\"m3 11 18-5v12L3 14v-3z\"></path><path d=\"M11.6 16.8a3 3 0 1 1-5.8-1.6\"></path>",
    "briefcase": "<rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"></rect><path d=\"M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"></path>",
    "landmark": "<line x1=\"3\" y1=\"22\" x2=\"21\" y2=\"22\"></line><line x1=\"6\" y1=\"18\" x2=\"6\" y2=\"11\"></line><line x1=\"10\" y1=\"18\" x2=\"10\" y2=\"11\"></line><line x1=\"14\" y1=\"18\" x2=\"14\" y2=\"11\"></line><line x1=\"18\" y1=\"18\" x2=\"18\" y2=\"11\"></line><polygon points=\"12 2 20 7 4 7\"></polygon>",
    "info": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"></line>",
    "clip": "<path d=\"M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48\"></path>",
    "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>",
    "pin": "<path d=\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\"></path><circle cx=\"12\" cy=\"10\" r=\"3\"></circle>",
    "chevron": "<polyline points=\"6 9 12 15 18 9\"></polyline>",
    "printer": "<polyline points=\"6 9 6 2 18 2 18 9\"></polyline><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"></path><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"></rect>",
    "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"></line><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"></path>",
    "server": "<rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect><rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"></rect><line x1=\"6\" y1=\"6\" x2=\"6.01\" y2=\"6\"></line><line x1=\"6\" y1=\"18\" x2=\"6.01\" y2=\"18\"></line>",
    "infinity": "<path d=\"M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4z\"></path>",
    "lock": "<rect x=\"3\" y=\"11\" width=\"18\" height=\"11\" rx=\"2\" ry=\"2\"></rect><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"></path>",
    "cpu": "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\" ry=\"2\"></rect><rect x=\"9\" y=\"9\" width=\"6\" height=\"6\"></rect><line x1=\"9\" y1=\"1\" x2=\"9\" y2=\"4\"></line><line x1=\"15\" y1=\"1\" x2=\"15\" y2=\"4\"></line><line x1=\"9\" y1=\"20\" x2=\"9\" y2=\"23\"></line><line x1=\"15\" y1=\"20\" x2=\"15\" y2=\"23\"></line><line x1=\"20\" y1=\"9\" x2=\"23\" y2=\"9\"></line><line x1=\"20\" y1=\"14\" x2=\"23\" y2=\"14\"></line><line x1=\"1\" y1=\"9\" x2=\"4\" y2=\"9\"></line><line x1=\"1\" y1=\"14\" x2=\"4\" y2=\"14\"></line>",
    "smartphone": "<rect x=\"5\" y=\"2\" width=\"14\" height=\"20\" rx=\"2\" ry=\"2\"></rect><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"></line>",
    "tablet": "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\" ry=\"2\"></rect><line x1=\"12\" y1=\"18\" x2=\"12.01\" y2=\"18\"></line>",
    "compass": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polygon points=\"16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76\"></polygon>",
    "layout": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"3\" y1=\"9\" x2=\"21\" y2=\"9\"></line><line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"9\"></line>",
    "trending-up": "<polyline points=\"23 6 13.5 15.5 8.5 10.5 1 18\"></polyline><polyline points=\"17 6 23 6 23 12\"></polyline>",
    "monitor": "<rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"></rect><line x1=\"8\" y1=\"21\" x2=\"16\" y2=\"21\"></line><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"21\"></line>",
    "clipboard": "<path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"></path><rect x=\"8\" y=\"2\" width=\"8\" height=\"4\" rx=\"1\" ry=\"1\"></rect>",
    "check-square": "<polyline points=\"9 11 12 14 22 4\"></polyline><path d=\"M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11\"></path>",
    "hard-drive": "<line x1=\"22\" y1=\"12\" x2=\"2\" y2=\"12\"></line><path d=\"M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"></path><line x1=\"6\" y1=\"16\" x2=\"6.01\" y2=\"16\"></line><line x1=\"10\" y1=\"16\" x2=\"10.01\" y2=\"16\"></line>",
    "radio": "<circle cx=\"12\" cy=\"12\" r=\"2\"></circle><path d=\"M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14\"></path>",
    "layers": "<polygon points=\"12 2 2 7 12 12 22 7 12 2\"></polygon><polyline points=\"2 17 12 22 22 17\"></polyline><polyline points=\"2 12 12 17 22 12\"></polyline>",
    "grid": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"></rect><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"></rect><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"></rect>",
    "wifi": "<path d=\"M5 12.55a11 11 0 0 1 14.08 0\"></path><path d=\"M1.42 9a16 16 0 0 1 21.16 0\"></path><path d=\"M8.53 16.11a6 6 0 0 1 6.95 0\"></path><line x1=\"12\" y1=\"20\" x2=\"12.01\" y2=\"20\"></line>",
    "link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>",
    "message": "<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"></path>",
    "book-open": "<path d=\"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z\"></path><path d=\"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z\"></path>",
    "book": "<path d=\"M4 19.5A2.5 2.5 0 0 1 6.5 17H20\"></path><path d=\"M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\"></path>",
    "shuffle": "<polyline points=\"16 3 21 3 21 8\"></polyline><line x1=\"4\" y1=\"20\" x2=\"21\" y2=\"3\"></line><polyline points=\"21 16 21 21 16 21\"></polyline><line x1=\"15\" y1=\"15\" x2=\"21\" y2=\"21\"></line><line x1=\"4\" y1=\"4\" x2=\"9\" y2=\"9\"></line>",
    "tool": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"></path>",
    "database": "<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"></ellipse><path d=\"M21 12c0 1.66-4 3-9 3s-9-1.34-9-3\"></path><path d=\"M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5\"></path>",
    "table": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect><path d=\"M3 9h18\"></path><path d=\"M3 15h18\"></path><path d=\"M12 3v18\"></path>",
    "image": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><circle cx=\"8.5\" cy=\"8.5\" r=\"1.5\"></circle><polyline points=\"21 15 16 10 5 21\"></polyline>",
    "sliders": "<line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\"></line><line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\"></line><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\"></line><line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\"></line><line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\"></line><line x1=\"1\" y1=\"14\" x2=\"7\" y2=\"14\"></line><line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\"></line><line x1=\"17\" y1=\"16\" x2=\"23\" y2=\"16\"></line>",
    "cart": "<circle cx=\"9\" cy=\"21\" r=\"1\"></circle><circle cx=\"20\" cy=\"21\" r=\"1\"></circle><path d=\"M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6\"></path>",
    "settings": "<circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"></path>",
    "search": "<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><line x1=\"21\" y1=\"21\" x2=\"16.65\" y2=\"16.65\"></line>",
    "scale": "<path d=\"M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z\"></path><path d=\"M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z\"></path><path d=\"M7 21h10\"></path><path d=\"M12 3v18\"></path><path d=\"M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2\"></path>",
    "refresh": "<polyline points=\"23 4 23 10 17 10\"></polyline><polyline points=\"1 20 1 14 7 14\"></polyline><path d=\"M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15\"></path>",
    "repeat": "<polyline points=\"17 1 21 5 17 9\"></polyline><path d=\"M3 11V9a4 4 0 0 1 4-4h14\"></path><polyline points=\"7 23 3 19 7 15\"></polyline><path d=\"M21 13v2a4 4 0 0 1-4 4H3\"></path>",
    "workflow": "<rect x=\"3\" y=\"3\" width=\"8\" height=\"8\" rx=\"2\"></rect><path d=\"M7 11v4a2 2 0 0 0 2 2h4\"></path><rect x=\"13\" y=\"13\" width=\"8\" height=\"8\" rx=\"2\"></rect>",
    "edit": "<path d=\"M12 20h9\"></path><path d=\"M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z\"></path>",
    "activity": "<polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"></polyline>",
    "box": "<path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path><polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline><line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line>",
    "package": "<line x1=\"16.5\" y1=\"9.4\" x2=\"7.5\" y2=\"4.21\"></line><path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path><polyline points=\"3.27 6.96 12 12.01 20.73 6.96\"></polyline><line x1=\"12\" y1=\"22.08\" x2=\"12\" y2=\"12\"></line>",
    "presentation": "<path d=\"M2 3h20\"></path><path d=\"M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3\"></path><path d=\"M7 21l5-5 5 5\"></path>",
    "file-text": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><polyline points=\"14 2 14 8 20 8\"></polyline><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"></line><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"></line><polyline points=\"10 9 9 9 8 9\"></polyline>",
    "file-code": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"></path><polyline points=\"14 2 14 8 20 8\"></polyline><polyline points=\"10 12.5 8 15 10 17.5\"></polyline><polyline points=\"14 12.5 16 15 14 17.5\"></polyline>",
    "mic": "<path d=\"M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z\"></path><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"></path><line x1=\"12\" y1=\"19\" x2=\"12\" y2=\"23\"></line><line x1=\"8\" y1=\"23\" x2=\"16\" y2=\"23\"></line>",
    "alert": "<path d=\"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z\"></path><line x1=\"12\" y1=\"9\" x2=\"12\" y2=\"13\"></line><line x1=\"12\" y1=\"17\" x2=\"12.01\" y2=\"17\"></line>",
    "crosshair": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"22\" y1=\"12\" x2=\"18\" y2=\"12\"></line><line x1=\"6\" y1=\"12\" x2=\"2\" y2=\"12\"></line><line x1=\"12\" y1=\"6\" x2=\"12\" y2=\"2\"></line><line x1=\"12\" y1=\"22\" x2=\"12\" y2=\"18\"></line>",
    "eye-off": "<path d=\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\"></path><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"></line>",
    "eye": "<path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"></path><circle cx=\"12\" cy=\"12\" r=\"3\"></circle>",
    "list": "<line x1=\"8\" y1=\"6\" x2=\"21\" y2=\"6\"></line><line x1=\"8\" y1=\"12\" x2=\"21\" y2=\"12\"></line><line x1=\"8\" y1=\"18\" x2=\"21\" y2=\"18\"></line><line x1=\"3\" y1=\"6\" x2=\"3.01\" y2=\"6\"></line><line x1=\"3\" y1=\"12\" x2=\"3.01\" y2=\"12\"></line><line x1=\"3\" y1=\"18\" x2=\"3.01\" y2=\"18\"></line>",
    "users": "<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path>",
    "flag": "<path d=\"M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z\"></path><line x1=\"4\" y1=\"22\" x2=\"4\" y2=\"15\"></line>",
    "folder": "<path d=\"M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z\"></path>",
    "pie-chart": "<path d=\"M21.21 15.89A10 10 0 1 1 8 2.83\"></path><path d=\"M22 12A10 10 0 0 0 12 2v10z\"></path>",
    "gamepad": "<line x1=\"6\" y1=\"11\" x2=\"10\" y2=\"11\"></line><line x1=\"8\" y1=\"9\" x2=\"8\" y2=\"13\"></line><line x1=\"15\" y1=\"12\" x2=\"15.01\" y2=\"12\"></line><line x1=\"18\" y1=\"10\" x2=\"18.01\" y2=\"10\"></line><path d=\"M17.32 5H6.68a4 4 0 0 0-3.98 3.59C2.6 9.42 2 14.46 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.41-1.41A2 2 0 0 1 9.83 16h4.34a2 2 0 0 1 1.41.59L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.55-.6-6.58-.69-7.26A4 4 0 0 0 17.32 5z\"></path>",
    "star": "<polygon points=\"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\"></polygon>",
    "glasses": "<circle cx=\"6\" cy=\"15\" r=\"4\"></circle><circle cx=\"18\" cy=\"15\" r=\"4\"></circle><path d=\"M14 15a2 2 0 0 0-4 0\"></path><path d=\"M2.5 13L5 7c.7-1.3 1.4-2 3-2\"></path><path d=\"M21.5 13L19 7c-.7-1.3-1.5-2-3-2\"></path>",
    "bot": "<path d=\"M12 8V4H8\"></path><rect x=\"4\" y=\"8\" width=\"16\" height=\"12\" rx=\"2\"></rect><path d=\"M2 14h2\"></path><path d=\"M20 14h2\"></path><path d=\"M15 13v2\"></path><path d=\"M9 13v2\"></path>",
    "calculator": "<rect x=\"4\" y=\"2\" width=\"16\" height=\"20\" rx=\"2\"></rect><line x1=\"8\" y1=\"6\" x2=\"16\" y2=\"6\"></line><line x1=\"16\" y1=\"14\" x2=\"16\" y2=\"18\"></line><path d=\"M16 10h.01\"></path><path d=\"M12 10h.01\"></path><path d=\"M8 10h.01\"></path><path d=\"M12 14h.01\"></path><path d=\"M8 14h.01\"></path><path d=\"M12 18h.01\"></path><path d=\"M8 18h.01\"></path>",
    "percent": "<line x1=\"19\" y1=\"5\" x2=\"5\" y2=\"19\"></line><circle cx=\"6.5\" cy=\"6.5\" r=\"2.5\"></circle><circle cx=\"17.5\" cy=\"17.5\" r=\"2.5\"></circle>",
    "rocket": "<path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z\"></path><path d=\"M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z\"></path><path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0\"></path><path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\"></path>",
    "target": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><circle cx=\"12\" cy=\"12\" r=\"6\"></circle><circle cx=\"12\" cy=\"12\" r=\"2\"></circle>",
    "git-branch": "<line x1=\"6\" y1=\"3\" x2=\"6\" y2=\"15\"></line><circle cx=\"18\" cy=\"6\" r=\"3\"></circle><circle cx=\"6\" cy=\"18\" r=\"3\"></circle><path d=\"M18 9a9 9 0 0 1-9 9\"></path>",
    "terminal": "<polyline points=\"4 17 10 11 4 5\"></polyline><line x1=\"12\" y1=\"19\" x2=\"20\" y2=\"19\"></line>",
    "braces": "<path d=\"M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1\"></path><path d=\"M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1\"></path>",
    "share": "<circle cx=\"18\" cy=\"5\" r=\"3\"></circle><circle cx=\"6\" cy=\"12\" r=\"3\"></circle><circle cx=\"18\" cy=\"19\" r=\"3\"></circle><line x1=\"8.59\" y1=\"13.51\" x2=\"15.42\" y2=\"17.49\"></line><line x1=\"15.41\" y1=\"6.51\" x2=\"8.59\" y2=\"10.49\"></line>",
    "atom": "<circle cx=\"12\" cy=\"12\" r=\"1\"></circle><path d=\"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.52-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.52 4.52 9.87 6.54 11.9 4.5z\"></path><path d=\"M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5z\"></path>",
    "vue": "<polyline points=\"2 4 12 21 22 4\"></polyline><polyline points=\"7 4 12 13 17 4\"></polyline>",
    "type": "<polyline points=\"4 7 4 4 20 4 20 7\"></polyline><line x1=\"9\" y1=\"20\" x2=\"15\" y2=\"20\"></line><line x1=\"12\" y1=\"4\" x2=\"12\" y2=\"20\"></line>",
    "hexagon": "<path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"></path>",
    "coffee": "<path d=\"M18 8h1a4 4 0 0 1 0 8h-1\"></path><path d=\"M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z\"></path><line x1=\"6\" y1=\"1\" x2=\"6\" y2=\"4\"></line><line x1=\"10\" y1=\"1\" x2=\"10\" y2=\"4\"></line><line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"4\"></line>",
    "plus-square": "<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"16\"></line><line x1=\"8\" y1=\"12\" x2=\"16\" y2=\"12\"></line>",
    "zap": "<polygon points=\"13 2 3 14 12 14 11 22 21 10 12 10 13 2\"></polygon>",
    "helm": "<circle cx=\"12\" cy=\"12\" r=\"8\"></circle><circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M12 1v8M12 15v8M1 12h8M15 12h8M4.22 4.22l5.66 5.66M14.12 14.12l5.66 5.66M4.22 19.78l5.66-5.66M14.12 9.88l5.66-5.66\"></path>",
    "map": "<polygon points=\"1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6\"></polygon><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"18\"></line><line x1=\"16\" y1=\"6\" x2=\"16\" y2=\"22\"></line>",
    "feather": "<path d=\"M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z\"></path><line x1=\"16\" y1=\"8\" x2=\"2\" y2=\"22\"></line><line x1=\"17.5\" y1=\"15\" x2=\"9\" y2=\"15\"></line>",
    "leaf": "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z\"></path><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"></path>",
    "triangle": "<path d=\"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z\"></path>",
    "network": "<circle cx=\"5\" cy=\"6\" r=\"2\"></circle><circle cx=\"5\" cy=\"18\" r=\"2\"></circle><circle cx=\"12\" cy=\"12\" r=\"2\"></circle><circle cx=\"19\" cy=\"6\" r=\"2\"></circle><circle cx=\"19\" cy=\"18\" r=\"2\"></circle><path d=\"M6.5 7.5l4 3M6.5 16.5l4-3M13.5 10.5l4-3M13.5 13.5l4 3\"></path>",
    "binary": "<rect x=\"14\" y=\"14\" width=\"4\" height=\"6\" rx=\"2\"></rect><rect x=\"6\" y=\"4\" width=\"4\" height=\"6\" rx=\"2\"></rect><path d=\"M6 20h4\"></path><path d=\"M14 10h4\"></path><path d=\"M6 14h2v6\"></path><path d=\"M14 4h2v6\"></path>",
    "plug": "<path d=\"M12 22v-5\"></path><path d=\"M9 8V2\"></path><path d=\"M15 8V2\"></path><path d=\"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z\"></path>"
  };
  const DOMAIN_ICON_KEYS = {
    "Développement": "code",
    "Data & IA": "chart",
    "Sécurité": "shield",
    "Produit & Design": "pen",
    "Infrastructure & DevOps": "cloud",
    "Marketing digital": "megaphone",
    "Gestion & Management": "briefcase"
  };

  function icon(key) {
    const paths = ICON_PATHS[key];
    if (!paths) return "";
    return `<svg class="ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
  }

  // Icône d'une roadmap, plus grande que les icônes d'interface (taille
  // fixée en CSS) : sur les cartes et devant le titre d'une roadmap.
  function roadmapIcon(key, cls) {
    const paths = ICON_PATHS[key];
    if (!paths) return "";
    return `<svg class="ico ${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
  }

  function domainIcon(domainName) {
    return icon(DOMAIN_ICON_KEYS[domainName]);
  }

  // ---- Primer "l'informatique en 7 domaines" (page test d'orientation) ----
  function renderDomainPrimer() {
    const container = document.getElementById("domain-primer-grid");
    if (!container || typeof DOMAINS === "undefined") return;

    Object.keys(DOMAINS).forEach((domainName) => {
      const meta = DOMAINS[domainName];
      const domainLabel = currentLang() === "en" && meta.nameEn ? meta.nameEn : domainName;
      const item = document.createElement("div");
      item.className = "domain-primer-item";

      // Icône sur la ligne du titre (une pastille au-dessus de chaque titre
      // est le tic de gabarit relevé par la revue impeccable).
      const heading = document.createElement("h3");
      heading.textContent = domainLabel;
      heading.insertAdjacentHTML("afterbegin", domainIcon(domainName));
      item.appendChild(heading);

      const desc = document.createElement("p");
      desc.textContent = tField(meta, "description");
      item.appendChild(desc);

      if (meta.presenceTogo) {
        const presence = document.createElement("p");
        presence.className = "domain-primer-presence";
        presence.textContent = tField(meta, "presenceTogo");
        presence.insertAdjacentHTML("afterbegin", icon("pin"));
        item.appendChild(presence);
      }

      container.appendChild(item);
    });
  }

  // ---- Recherche + filtres par domaine (page d'accueil) ----
  function applyFilters() {
    const searchInput = document.getElementById("roadmap-search");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const activeChip = document.querySelector(".domain-chip.active");
    const activeDomain = activeChip ? activeChip.dataset.domain : "all";

    function filterGrid(grid, useDomain) {
      if (!grid) return;
      let visibleCount = 0;
      grid.querySelectorAll(".card").forEach((card) => {
        const matchesQuery = !query || card.dataset.title.indexOf(query) !== -1;
        const matchesDomain = !useDomain || activeDomain === "all" || card.dataset.domain === activeDomain;
        const visible = matchesQuery && matchesDomain;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      // Recherche/filtre actifs : déplie automatiquement les catégories
      // repliées qui contiennent un résultat, pour ne pas cacher un match
      // derrière un bouton fermé.
      const filtering = !!query || (useDomain && activeDomain !== "all");
      const domainGroups = grid.querySelectorAll(".domain-group");
      if (domainGroups.length) {
        domainGroups.forEach((group) => {
          const anyVisible = Array.prototype.some.call(group.querySelectorAll(".card"), (c) => !c.hidden);
          group.hidden = !anyVisible;
          if (filtering && anyVisible) {
            const subGrid = group.querySelector(".grid");
            const toggle = group.querySelector(".domain-group-toggle");
            if (subGrid && toggle && subGrid.classList.contains("is-collapsed")) setGroupOpen(toggle, subGrid, true);
          }
        });
      } else if (filtering && visibleCount > 0 && grid.classList.contains("is-collapsed")) {
        const toggle = document.querySelector(`.domain-group-toggle[aria-controls="${grid.id}"]`);
        if (toggle) setGroupOpen(toggle, grid, true);
      }

      const noResults = grid.parentElement.querySelector(".no-results");
      if (noResults) noResults.hidden = visibleCount !== 0;
    }

    filterGrid(document.getElementById("role-grid"), true);
    filterGrid(document.getElementById("skill-grid"), false);
  }

  function initFilters() {
    const searchInput = document.getElementById("roadmap-search");
    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    const domainFilters = document.getElementById("domain-filters");
    if (domainFilters) {
      domainFilters.addEventListener("click", (e) => {
        const btn = e.target.closest(".domain-chip");
        if (!btn) return;
        domainFilters.querySelectorAll(".domain-chip").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilters();
      });
    }
  }

  // ---- Roadmaps liées (même domaine, pas déjà citées sur la page) ----
  function buildRelatedSection(id, rm) {
    if (!rm.domain || typeof ROLES === "undefined") return null;

    const citedIds = new Set([id]);
    rm.sections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.resource && item.resource.url && item.resource.url.indexOf("roadmap.html?id=") === 0) {
          citedIds.add(item.resource.url.split("id=")[1]);
        }
      });
    });

    const related = Object.keys(ROLES)
      .filter((rid) => ROLES[rid].domain === rm.domain && !citedIds.has(rid))
      .slice(0, 3);

    if (!related.length) return null;

    const section = document.createElement("div");
    section.className = "related-section";

    const heading = document.createElement("h2");
    heading.textContent = currentLang() === "en" ? "Related roadmaps" : "Roadmaps liées";
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "grid";
    related.forEach((rid) => grid.appendChild(buildCard(rid, ROLES[rid], "role")));
    section.appendChild(grid);

    return section;
  }

  // ---- Communautés du domaine (mentorat/réseau, pas juste des roadmaps) ----
  function buildCommunitySection(rm) {
    if (!rm.domain || typeof COMMUNITY_BY_DOMAIN === "undefined") return null;
    const items = COMMUNITY_BY_DOMAIN[rm.domain];
    if (!items || !items.length) return null;

    const isEn = currentLang() === "en";
    const section = document.createElement("div");
    section.className = "related-section";

    const heading = document.createElement("h2");
    heading.textContent = isEn ? "Join the community" : "Rejoins la communauté";
    section.appendChild(heading);

    const intro = document.createElement("p");
    intro.className = "category-desc";
    intro.innerHTML = isEn
      ? 'These active Togolese communities are a concrete way to meet people already working in this field and find an informal mentor. More on the <a href="ecosysteme.html#communautes">Togolese ecosystem</a> page.'
      : 'Ces communautés togolaises actives sont un moyen concret de rencontrer des personnes déjà dans ce métier et de trouver un mentor informel. Plus de communautés sur la page <a href="ecosysteme.html#communautes">Écosystème togolais</a>.';
    section.appendChild(intro);

    const list = document.createElement("div");
    list.className = "eco-list";
    items.forEach((c) => {
      const item = document.createElement("div");
      item.className = "eco-item";
      const title = document.createElement("h3");
      title.textContent = tField(c, "name");
      item.appendChild(title);
      const p = document.createElement("p");
      p.textContent = tField(c, "note");
      item.appendChild(p);
      const href = safeUrl(c.url);
      if (href) {
        const a = document.createElement("a");
        a.className = "eco-link";
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = href.replace(/^https?:\/\//, "").replace(/\/$/, "");
        item.appendChild(a);
      }
      list.appendChild(item);
    });
    section.appendChild(list);

    return section;
  }

  // ---- Page roadmap détail ----
  // Bandeau défilant (même structure que ceux écrits dans les pages HTML).
  function buildMarquee(words, isEn) {
    const band = document.createElement("div");
    band.className = "marquee";
    band.setAttribute("data-marquee", "");
    const track = document.createElement("div");
    track.className = "marquee-track";
    track.setAttribute("aria-hidden", "true");
    const list = document.createElement("ul");
    list.className = "marquee-list";
    words.forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word;
      list.appendChild(li);
    });
    track.appendChild(list);
    band.appendChild(track);
    const pause = document.createElement("button");
    pause.type = "button";
    pause.className = "marquee-pause";
    pause.setAttribute("aria-pressed", "false");
    pause.setAttribute("data-i18n-aria-label", "marquee.pause");
    pause.setAttribute("aria-label", isEn ? "Pause the scrolling banner" : "Mettre en pause le bandeau défilant");
    pause.innerHTML =
      '<svg class="ico-pause" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14"></rect><rect x="14" y="5" width="4" height="14"></rect></svg>' +
      '<svg class="ico-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7 5v14l12-7z"></path></svg>';
    band.appendChild(pause);
    return band;
  }

  function renderRoadmap() {
    const container = document.getElementById("roadmap-detail");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const rm =
      typeof ALL_ROADMAPS !== "undefined" && Object.prototype.hasOwnProperty.call(ALL_ROADMAPS, id)
        ? ALL_ROADMAPS[id]
        : null;

    if (!rm) {
      container.innerHTML = currentLang() === "en"
        ? `<p>Roadmap not found. <a href="index.html">Back to home</a></p>`
        : `<p>Roadmap introuvable. <a href="index.html">Retour à l'accueil</a></p>`;
      return;
    }

    document.title = `${tField(rm, "title")} - WIYAO`;

    const total = countItems(rm);
    let progress = loadProgress();
    if (!progress.get(id)) progress.set(id, []);

    const isEn = currentLang() === "en";
    const typeLabel = rm.type === "skill" ? (isEn ? "Skill roadmap" : "Roadmap par compétence") : (isEn ? "Role roadmap" : "Roadmap par métier");
    const categoryLabel = rm.type === "skill" ? (isEn ? "By skill" : "Par compétence") : (isEn ? "By role" : "Par métier");
    const categoryHref = rm.type === "skill" ? "roadmaps.html#par-competence" : "roadmaps.html#par-metier";

    const breadcrumb = document.createElement("nav");
    breadcrumb.className = "breadcrumb";
    breadcrumb.setAttribute("aria-label", isEn ? "Breadcrumb" : "Fil d'Ariane");
    breadcrumb.innerHTML = `
      <a href="index.html">WIYAO</a>
      <span class="breadcrumb-sep">›</span>
      <a href="${categoryHref}">${categoryLabel}</a>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-current">${escapeHtml(tField(rm, "title"))}</span>
    `;
    container.appendChild(breadcrumb);

    const badges = badgesHtml(rm);
    const togoNotice =
      rm.type === "role" && !rm.togoVerified
        ? `<div class="togo-notice">${
            isEn
              ? "This role doesn't yet have confirmed data on the Togolese market, but the skills below are transferable and in demand internationally."
              : "Ce métier n'a pas encore de données confirmées sur le marché togolais, mais les compétences ci-dessous sont transférables et recherchées à l'international."
          }</div>`
        : "";

    const header = document.createElement("div");
    header.className = "roadmap-header";
    header.innerHTML = `
      <span class="badge type-badge">${typeLabel}</span>
      ${badges}
      <h1>${roadmapIcon(rm.icon, "ico-roadmap-title")}${escapeHtml(tField(rm, "title"))}</h1>
      <p class="subtitle">${escapeHtml(tField(rm, "subtitle"))}</p>
      ${togoNotice}
      <div class="progress-bar large"><div class="progress-fill" id="global-fill"></div></div>
      <span class="progress-label" id="global-label"></span>
    `;
    container.appendChild(header);
    // Boutons Imprimer / Réinitialiser sous la barre de progression, au lieu
    // de flotter seuls au-dessus de la page.
    const toolbar = document.querySelector(".roadmap-toolbar");
    if (toolbar) header.appendChild(toolbar);

    // Bandeau défilant façon MoonShot : les étapes de cette roadmap, sans
    // leur numéro (mise en mouvement par nav.js).
    const marquee = buildMarquee(rm.sections.map((s) => tField(s, "title").replace(/^\d+\.\s*/, "")), isEn);
    container.appendChild(marquee);
    if (window.wiyaoMarquee) window.wiyaoMarquee(marquee);

    function updateGlobal() {
      const done = (loadProgress().get(id) || []).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      document.getElementById("global-fill").style.width = pct + "%";
      document.getElementById("global-label").textContent = isEn
        ? `${done} / ${total} steps completed (${pct}%)`
        : `${done} / ${total} étapes complétées (${pct}%)`;
    }

    const track = document.createElement("div");
    track.className = "track";

    rm.sections.forEach((section, sIdx) => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "section";

      const titleEl = document.createElement("h2");
      titleEl.textContent = tField(section, "title");
      sectionEl.appendChild(titleEl);

      const list = document.createElement("div");
      list.className = "item-list";

      section.items.forEach((item, iIdx) => {
        const key = `${sIdx}_${iIdx}`;
        const done = progress.get(id).includes(key);

        const itemEl = document.createElement("div");
        itemEl.className = "item" + (done ? " done" : "") + (item.level === "option" ? " optional" : "");

        const check = document.createElement("button");
        check.className = "check";
        check.type = "button";
        check.setAttribute("aria-label", checkAriaLabel(done));
        check.textContent = done ? "✓" : "";
        check.addEventListener("click", () => {
          progress = toggleItem(id, key);
          itemEl.classList.toggle("done");
          const nowDone = itemEl.classList.contains("done");
          check.textContent = nowDone ? "✓" : "";
          check.setAttribute("aria-label", checkAriaLabel(nowDone));
          updateGlobal();
        });

        const labelWrap = document.createElement("div");
        labelWrap.className = "item-label-wrap";

        const label = document.createElement("span");
        label.className = "item-label";
        label.textContent = tField(item, "label");
        labelWrap.appendChild(label);

        if (item.level === "option") {
          const badge = document.createElement("span");
          badge.className = "badge";
          badge.textContent = currentLang() === "en" ? "optional" : "optionnel";
          labelWrap.appendChild(badge);
        }

        if (item.note) {
          const note = document.createElement("div");
          note.className = "item-note";
          note.textContent = tField(item, "note");
          labelWrap.appendChild(note);
        }

        const resourceHref = item.resource ? safeUrl(localizeUrl(item.resource.url)) : "";
        if (resourceHref) {
          const link = document.createElement("a");
          link.className = "item-resource";
          link.href = resourceHref;
          link.textContent = tField(item.resource, "label");
          link.insertAdjacentHTML("afterbegin", icon("clip"));
          if (!resourceHref.startsWith("roadmap.html")) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }
          labelWrap.appendChild(link);
        }

        itemEl.appendChild(check);
        itemEl.appendChild(labelWrap);
        list.appendChild(itemEl);
      });

      sectionEl.appendChild(list);
      track.appendChild(sectionEl);
    });

    container.appendChild(track);
    updateGlobal();

    const communitySection = buildCommunitySection(rm);
    if (communitySection) container.appendChild(communitySection);

    const relatedSection = buildRelatedSection(id, rm);
    if (relatedSection) container.appendChild(relatedSection);

    const printBtn = document.getElementById("print-roadmap");
    if (printBtn) printBtn.addEventListener("click", () => window.print());

    const resetBtn = document.getElementById("reset-progress");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const confirmMsg =
          currentLang() === "en"
            ? "Clear your progress on this roadmap? All checked steps will be unchecked."
            : "Effacer ta progression sur cette roadmap ? Toutes les étapes cochées seront décochées.";
        if (confirm(confirmMsg)) {
          const p = loadProgress();
          p.set(id, []);
          saveProgress(p);
          window.location.reload();
        }
      });
    }
  }

  // ---- Page écoles & universités ----
  // Badges et libellés des fiches écoles, traduits (statuts : mêmes clés que
  // les filtres de la page) : chaque libellé porte data-i18n-key pour suivre
  // aussi un changement de langue sans recharger.
  const STATUT_LABELS = {
    "public": { key: "ecoles.filter.public", fr: "Publique", en: "Public" },
    "prive": { key: "ecoles.filter.prive", fr: "Privée", en: "Private" },
    "inter-etats": { key: "ecoles.filter.interetats", fr: "Inter-États", en: "Inter-state" }
  };

  function i18nLabel(key, fr, en) {
    return `<span data-i18n-key="${key}">${currentLang() === "en" ? en : fr}</span>`;
  }

  function statutBadgeLabel(statut) {
    const s = STATUT_LABELS[statut];
    return s ? i18nLabel(s.key, s.fr, s.en) : escapeHtml(statut);
  }

  // Mêmes mots-clés que le rattachement écoles ↔ domaine du test d'orientation
  // (computeSchoolMatches) : une école peut correspondre à plusieurs domaines.
  function matchSchoolDomains(school) {
    if (typeof DOMAIN_KEYWORDS === "undefined") return [];
    const filieresText = school.filieres.join(" ").toLowerCase();
    return Object.keys(DOMAIN_KEYWORDS).filter((domain) =>
      DOMAIN_KEYWORDS[domain].some((kw) => filieresText.indexOf(kw) !== -1)
    );
  }

  function buildSchoolCard(id, school) {
    const card = document.createElement("div");
    card.className = "card school-card";
    // Recherche dans les deux langues : un nom de filière tapé en anglais
    // trouve aussi l'école.
    card.dataset.title = (school.name + " " + (school.nameEn || "") + " " + school.filieres.join(" ") + " " + (school.filieresEn || []).join(" ")).toLowerCase();
    card.dataset.ville = school.ville.join(",");
    card.dataset.statut = school.statut;
    card.dataset.domaine = matchSchoolDomains(school).join(",");

    const body = document.createElement("div");
    body.className = "card-body";
    card.appendChild(body);

    const badges = document.createElement("div");
    badges.className = "card-badges school-badges";
    badges.innerHTML =
      `<span class="badge status-${escapeHtml(school.statut)}">${statutBadgeLabel(school.statut)}</span>` +
      school.ville.map((v) => `<span class="badge ville-badge">${escapeHtml(v)}</span>`).join("") +
      (school.agree === true ? `<span class="badge status-public">${icon("landmark")}${i18nLabel("ecoles.badge.agree", "Agréé État", "State-accredited")}</span>` : "");
    body.appendChild(badges);

    const title = document.createElement("h3");
    title.textContent = tField(school, "name");
    body.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.className = "school-subtitle";
    subtitle.textContent = tField(school, "description");
    body.appendChild(subtitle);

    // Filières en une ligne de texte plutôt qu'en pastilles : même
    // information, trois fois moins de hauteur.
    const filieres = document.createElement("p");
    filieres.className = "school-filieres-line";
    filieres.innerHTML = `<strong>${i18nLabel("ecoles.card.filieres", "Filières :", "Programs:")}</strong> ${escapeHtml(tList(school, "filieres").join(" · "))}`;
    body.appendChild(filieres);

    const meta = document.createElement("div");
    meta.className = "school-meta";
    let metaHtml = `<span><strong>${i18nLabel("ecoles.card.niveaux", "Niveaux :", "Levels:")}</strong> ${escapeHtml(tList(school, "niveaux").join(", "))}</span>`;
    meta.innerHTML = metaHtml;
    body.appendChild(meta);

    // Fiche compacte : le détail (durée, admission, frais, notes) s'ouvre au
    // clic, pour parcourir et comparer les 32 écoles sans pavés de texte.
    let detailsHtml = "";
    if (school.duree) detailsHtml += `<span><strong>${i18nLabel("ecoles.card.duree", "Durée :", "Duration:")}</strong> ${escapeHtml(tField(school, "duree"))}</span>`;
    if (school.admission) detailsHtml += `<span><strong>${i18nLabel("ecoles.card.admission", "Admission :", "Admission:")}</strong> ${escapeHtml(tField(school, "admission"))}</span>`;
    if (school.frais) detailsHtml += `<span><strong>${i18nLabel("ecoles.card.frais", "Frais :", "Fees:")}</strong> ${escapeHtml(tField(school, "frais"))}</span>`;
    if (school.agreeNote) detailsHtml += `<span>${icon("info")}${escapeHtml(tField(school, "agreeNote"))}</span>`;
    if (detailsHtml) {
      const details = document.createElement("details");
      details.className = "school-details";
      details.innerHTML = `<summary>${i18nLabel("ecoles.card.details", "Admission, durée et frais", "Admission, duration and fees")}${icon("chevron")}</summary><div class="school-details-body">${detailsHtml}</div>`;
      body.appendChild(details);
    }

    const siteHref = safeUrl(school.site);
    if (siteHref) {
      const link = document.createElement("a");
      link.className = "school-link";
      link.href = siteHref;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = i18nLabel("ecoles.card.site", "Voir le site officiel →", "See official site →");
      body.appendChild(link);
    }

    return card;
  }

  function renderSchools() {
    const grid = document.getElementById("school-grid");
    if (!grid || typeof SCHOOLS === "undefined") return;
    Object.keys(SCHOOLS).forEach((id) => grid.appendChild(buildSchoolCard(id, SCHOOLS[id])));
  }

  function applySchoolFilters() {
    const grid = document.getElementById("school-grid");
    if (!grid) return;
    const searchInput = document.getElementById("school-search");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const activeDomaineChip = document.querySelector("#domaine-filters .domain-chip.active");
    const activeDomaine = activeDomaineChip ? activeDomaineChip.dataset.domaine : "all";
    const activeVilleChip = document.querySelector("#ville-filters .domain-chip.active");
    const activeVille = activeVilleChip ? activeVilleChip.dataset.ville : "all";
    const activeStatutChip = document.querySelector("#statut-filters .domain-chip.active");
    const activeStatut = activeStatutChip ? activeStatutChip.dataset.statut : "all";

    let visibleCount = 0;
    grid.querySelectorAll(".school-card").forEach((card) => {
      const matchesQuery = !query || card.dataset.title.indexOf(query) !== -1;
      const matchesDomaine = activeDomaine === "all" || card.dataset.domaine.split(",").indexOf(activeDomaine) !== -1;
      const matchesVille = activeVille === "all" || card.dataset.ville.split(",").indexOf(activeVille) !== -1;
      const matchesStatut = activeStatut === "all" || card.dataset.statut === activeStatut;
      const visible = matchesQuery && matchesDomaine && matchesVille && matchesStatut;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    const noResults = document.getElementById("school-no-results");
    if (noResults) noResults.hidden = visibleCount !== 0;
  }

  function initSchoolFilters() {
    const searchInput = document.getElementById("school-search");
    if (searchInput) searchInput.addEventListener("input", applySchoolFilters);

    ["domaine-filters", "ville-filters", "statut-filters"].forEach((groupId) => {
      const group = document.getElementById(groupId);
      if (!group) return;
      group.addEventListener("click", (e) => {
        const btn = e.target.closest(".domain-chip");
        if (!btn) return;
        group.querySelectorAll(".domain-chip").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applySchoolFilters();
      });
    });
  }

  // ---- Test d'orientation ----
  // Le test est adaptatif en deux temps : 8 questions de domaine d'abord, puis
  // : une fois le domaine dominant connu : 2 questions spécifiques à ce domaine
  // qui affinent la recommandation vers un métier précis (au lieu des 3 premiers
  // métiers du domaine par ordre d'insertion), avant les questions pratiques
  // (niveau, ville, budget, priorité). 14 questions au total, quel que soit le
  // profil.
  let quizIndex = 0;
  let quizScores = {};
  let quizRoleScores = {};
  let quizPractical = { niveau: null, ville: null, statut: null, priorite: null };
  let quizFlow = typeof QUIZ_QUESTIONS !== "undefined" ? QUIZ_QUESTIONS.filter((q) => q.type === "domain") : [];
  // Une entrée par question déjà répondue (indexée comme quizFlow), pour
  // pouvoir annuler une réponse quand on revient en arrière ou qu'on la change.
  let quizHistory = [];
  const quizDomainCount = quizFlow.length;

  function renderQuizQuestion() {
    const questionEl = document.getElementById("quiz-question");
    if (!questionEl || typeof QUIZ_QUESTIONS === "undefined") return;

    const progressBar = document.getElementById("quiz-progress-bar");
    const progressLabel = document.getElementById("quiz-progress-label");
    const total = quizFlow.length;
    const q = quizFlow[quizIndex];

    if (progressBar) {
      progressBar.innerHTML = "";
      for (let i = 0; i < total; i += 1) {
        const seg = document.createElement("span");
        seg.className = "progress-seg" + (i <= quizIndex ? " is-done" : "");
        progressBar.appendChild(seg);
      }
    }
    if (progressLabel) progressLabel.textContent = `Question ${quizIndex + 1} / ${total}`;

    questionEl.innerHTML = `
      <h2 class="quiz-question-title">${escapeHtml(tField(q, "question"))}</h2>
      <div class="quiz-options"></div>
    `;
    const optionsWrap = questionEl.querySelector(".quiz-options");
    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = tField(opt, "label");
      btn.addEventListener("click", () => answerQuiz(q.type, opt.domain || opt.value, opt.roles));
      optionsWrap.appendChild(btn);
    });

    if (quizIndex > 0) {
      const back = document.createElement("button");
      back.type = "button";
      back.className = "quiz-back";
      back.textContent = currentLang() === "en" ? "← Previous question" : "← Question précédente";
      back.addEventListener("click", goBackQuiz);
      questionEl.appendChild(back);
    }
  }

  // Retire la contribution d'une réponse déjà enregistrée (score de domaine,
  // score de métier ou réponse pratique), pour permettre de revenir en
  // arrière ou de changer une réponse sans fausser le résultat.
  function undoQuizAnswer(entry) {
    if (!entry) return;
    if (entry.type === "domain") {
      quizScores[entry.value] = (quizScores[entry.value] || 0) - 1;
    } else if (entry.type === "role") {
      (entry.roles || []).forEach((r) => {
        quizRoleScores[r] = (quizRoleScores[r] || 0) - 1;
      });
    } else {
      quizPractical[entry.type] = null;
    }
  }

  function answerQuiz(type, value, roles) {
    // Si cette question a déjà été répondue (retour en arrière puis nouveau
    // choix), on annule d'abord l'ancienne contribution avant d'appliquer la
    // nouvelle, pour ne jamais compter une question deux fois.
    undoQuizAnswer(quizHistory[quizIndex]);
    quizHistory[quizIndex] = { type, value, roles };

    if (type === "domain") {
      quizScores[value] = (quizScores[value] || 0) + 1;
    } else if (type === "role") {
      (roles || []).forEach((r) => {
        quizRoleScores[r] = (quizRoleScores[r] || 0) + 1;
      });
    } else {
      quizPractical[type] = value;
    }
    quizIndex += 1;

    // Juste après la dernière question de domaine : le domaine dominant est
    // déjà connu, on insère ses questions de métier avant les questions
    // pratiques (niveau/ville/statut/priorité), qui restent communes à tous.
    // (Ce point ne se déclenche qu'une fois : un retour en arrière dans les
    // questions de domaine tronque quizFlow, voir goBackQuiz.)
    if (quizIndex === quizDomainCount && quizFlow.length === quizDomainCount) {
      const leadingDomain = Object.keys(quizScores).sort((a, b) => (quizScores[b] || 0) - (quizScores[a] || 0))[0];
      const roleQuestions = (typeof ROLE_QUESTIONS !== "undefined" && ROLE_QUESTIONS[leadingDomain]) || [];
      const practicalQuestions = QUIZ_QUESTIONS.filter((q) => q.type !== "domain");
      quizFlow = quizFlow.concat(roleQuestions, practicalQuestions);
    }

    if (quizIndex >= quizFlow.length) {
      showQuizResults();
    } else {
      renderQuizQuestion();
    }
  }

  function goBackQuiz() {
    if (quizIndex === 0) return;
    quizIndex -= 1;

    // Revenir dans les questions de domaine après que le domaine dominant a
    // déjà été résolu : les questions de métier/pratiques injectées peuvent
    // ne plus correspondre (le domaine dominant peut changer). On les retire
    // et on annule leurs réponses ; elles seront recalculées quand la
    // frontière sera de nouveau atteinte.
    if (quizIndex < quizDomainCount && quizFlow.length > quizDomainCount) {
      for (let i = quizDomainCount; i < quizHistory.length; i += 1) {
        undoQuizAnswer(quizHistory[i]);
      }
      quizFlow = quizFlow.slice(0, quizDomainCount);
      quizHistory = quizHistory.slice(0, quizDomainCount);
    }

    renderQuizQuestion();
  }

  // Relie le domaine dominant + les réponses pratiques (niveau, ville, budget,
  // priorité) aux écoles réelles, avec une checklist transparente par école
  // plutôt qu'un score caché.
  function computeSchoolMatches(topDomain) {
    if (typeof SCHOOLS === "undefined") return [];
    const keywords = (typeof DOMAIN_KEYWORDS !== "undefined" && DOMAIN_KEYWORDS[topDomain]) || [];
    const isEn = currentLang() === "en";
    const topMeta = typeof DOMAINS !== "undefined" ? DOMAINS[topDomain] : null;
    const topName = isEn && topMeta && topMeta.nameEn ? topMeta.nameEn : topDomain;

    return Object.keys(SCHOOLS)
      .map((id) => {
        const school = SCHOOLS[id];
        const filieresText = school.filieres.join(" ").toLowerCase();
        const checks = [];

        checks.push({
          ok: keywords.some((kw) => filieresText.indexOf(kw) !== -1),
          label: isEn ? `Program related to ${topName}` : `Filière liée à ${topName}`
        });

        if (quizPractical.niveau && quizPractical.niveau !== "peu-importe") {
          const niveauText = school.niveaux.join(" ").toLowerCase();
          let ok = false;
          if (quizPractical.niveau === "court") ok = /bts|brevet de technicien/.test(niveauText);
          if (quizPractical.niveau === "licence") ok = /licence/.test(niveauText);
          if (quizPractical.niveau === "long") ok = /master|ingénieur/.test(niveauText);
          checks.push({ ok, label: isEn ? "Matching level" : "Niveau qui correspond" });
        }

        if (quizPractical.ville && quizPractical.ville !== "peu-importe") {
          checks.push({ ok: school.ville.indexOf(quizPractical.ville) !== -1, label: `${isEn ? "In" : "À"} ${quizPractical.ville}` });
        }

        if (quizPractical.statut && quizPractical.statut !== "peu-importe") {
          checks.push({
            ok: school.statut === quizPractical.statut,
            label: quizPractical.statut === "public"
              ? (isEn ? "Public school" : "Statut public")
              : (isEn ? "Private school" : "Statut privé")
          });
        }

        if (quizPractical.priorite && quizPractical.priorite !== "peu-importe") {
          let ok = false;
          if (quizPractical.priorite === "agree") ok = school.agree === true;
          if (quizPractical.priorite === "pratique") ok = /pratique|stage/i.test(school.description);
          checks.push({
            ok,
            label: quizPractical.priorite === "agree"
              ? (isEn ? "State-accredited degree" : "Diplôme agréé par l'État")
              : (isEn ? "Hands-on training" : "Formation orientée pratique")
          });
        }

        const score = checks.filter((c) => c.ok).length;
        return { id, school, checks, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  function buildSchoolMatchCard(match) {
    const card = buildSchoolCard(match.id, match.school);
    const checklist = document.createElement("div");
    checklist.className = "quiz-match-checklist";
    checklist.innerHTML = match.checks
      .map((c) => `<span class="${c.ok ? "match-ok" : "match-no"}">${c.ok ? "✓" : "✗"} ${escapeHtml(c.label)}</span>`)
      .join("");
    card.insertBefore(checklist, card.firstChild);
    return card;
  }

  function showQuizResults() {
    const quizSection = document.getElementById("quiz-section");
    const resultsSection = document.getElementById("quiz-results");
    if (!resultsSection || typeof DOMAINS === "undefined") return;
    if (quizSection) quizSection.hidden = true;
    resultsSection.hidden = false;

    const domains = Object.keys(DOMAINS);
    const ranked = domains.slice().sort((a, b) => (quizScores[b] || 0) - (quizScores[a] || 0));
    const top = ranked[0];
    const second = ranked[1];
    const totalAnswers = quizDomainCount;
    const topMeta = DOMAINS[top];
    const topScore = quizScores[top] || 0;
    const secondScore = second ? (quizScores[second] || 0) : 0;
    const isCloseCall = !!second && topScore > 0 && topScore - secondScore <= 1;

    // Métiers du domaine dominant, classés par le score des questions de
    // deuxième niveau (voir ROLE_QUESTIONS) plutôt que par ordre d'insertion.
    // Les métiers jamais boostés (score 0) ne sont proposés que s'il n'y a pas
    // assez de métiers mieux notés pour remplir les 3 recommandations.
    const matchingRoles = typeof ROLES !== "undefined"
      ? Object.keys(ROLES)
          .filter((id) => ROLES[id].domain === top)
          .sort((a, b) => (quizRoleScores[b] || 0) - (quizRoleScores[a] || 0))
          .slice(0, 3)
      : [];
    // N'affiche le badge "meilleure correspondance" que si les questions de
    // métier ont réellement départagé les rôles (score max > 0) : sinon ce
    // serait un ordre d'insertion présenté à tort comme un signal.
    const maxRoleScore = matchingRoles.length
      ? Math.max(...matchingRoles.map((id) => quizRoleScores[id] || 0))
      : 0;
    const bestRoleIds = maxRoleScore > 0
      ? matchingRoles.filter((id) => (quizRoleScores[id] || 0) === maxRoleScore)
      : [];
    const schoolMatches = computeSchoolMatches(top);
    const isEn = currentLang() === "en";
    const topLabel = escapeHtml(isEn && topMeta.nameEn ? topMeta.nameEn : top);

    let html = `
      <p class="quiz-disclaimer">${
        isEn
          ? 'This result is a starting point, not a verdict: 14 questions can\'t know you 100%. Compare it against a <a href="temoignages.html">real testimonial</a> from someone in the role, and try the roadmap before committing financially to a school.'
          : 'Ce résultat est un point de départ, pas un verdict : 14 questions ne peuvent pas te connaître à 100 %. Confronte-le à un <a href="temoignages.html">témoignage réel</a> de quelqu\'un du métier, et teste la roadmap avant de t\'engager financièrement dans une école.'
      }</p>
      <h2>${isEn ? "Your profile:" : "Ton profil :"} ${domainIcon(top)}${topLabel}</h2>
      <p class="category-desc">${escapeHtml(tField(topMeta, "description"))}</p>
    `;

    if (matchingRoles.length) {
      html += `
        <h3 class="quiz-scores-title">${isEn ? "Recommended roles" : "Métiers recommandés"}</h3>
        ${bestRoleIds.length ? `<p class="category-desc" style="text-align:center;">${
          isEn
            ? "The role(s) below marked “Best match” fit your role-specific answers best; the others belong to the same field but scored lower."
            : "Le(s) métier(s) ci-dessous marqués « Meilleure correspondance » collent le mieux à tes réponses sur le métier précis ; les autres restent dans le même domaine mais ont obtenu un score plus faible."
        }</p>` : ""}
        <div class="grid" id="quiz-role-grid"></div>
      `;
    }

    if (isCloseCall) {
      const secondMeta = DOMAINS[second];
      const secondLabel = escapeHtml(isEn && secondMeta.nameEn ? secondMeta.nameEn : second);
      html += `<p class="quiz-secondary">${
        isEn
          ? `Close call: <strong>${domainIcon(second)}${secondLabel}</strong> suits you almost as much as ${topLabel}. Worth exploring both before choosing.`
          : `Résultat serré : <strong>${domainIcon(second)}${secondLabel}</strong> te correspond presque autant que ${topLabel}. Vaut le coup d'explorer les deux avant de choisir.`
      }</p>`;
    }

    if (schoolMatches.length) {
      html += `
        <h3 class="quiz-scores-title">${isEn ? "Schools recommended for you" : "Écoles recommandées pour toi"}</h3>
        <p class="category-desc" style="text-align:center;">${
          isEn
            ? "Based on your field and your answers about level, city and budget: every checked criterion is verified, not guessed."
            : "D'après ton domaine et tes réponses sur le niveau, la ville et le budget : chaque critère coché est vérifié, pas deviné."
        }</p>
        <div class="grid" id="quiz-school-grid"></div>
        <p class="quiz-secondary">
          <a href="ecoles.html">${isEn ? "See all schools →" : "Voir toutes les écoles →"}</a>
          &nbsp;·&nbsp;
          <a href="calendrier.html">${isEn ? "See application dates →" : "Voir les dates de candidature →"}</a>
          &nbsp;·&nbsp;
          <a href="bourses-financement.html">${isEn ? "See available scholarships →" : "Voir les bourses disponibles →"}</a>
        </p>
      `;
    }

    html += `
      <h3 class="quiz-scores-title">${isEn ? "Breakdown of your answers" : "Répartition de tes réponses"}</h3>
      <div class="quiz-scores"></div>
      <button class="btn" id="quiz-restart" type="button">${isEn ? "Retake the test" : "Refaire le test"}</button>
    `;

    resultsSection.innerHTML = html;

    const roleGrid = document.getElementById("quiz-role-grid");
    if (roleGrid) {
      matchingRoles.forEach((id) => {
        const card = buildCard(id, ROLES[id], "role");
        if (bestRoleIds.indexOf(id) !== -1) {
          const badges = card.querySelector(".card-badges");
          if (badges) {
            const bestBadge = document.createElement("span");
            bestBadge.className = "badge best-match-badge";
            bestBadge.textContent = isEn ? "Best match" : "Meilleure correspondance";
            badges.insertBefore(bestBadge, badges.firstChild);
          }
        }
        roleGrid.appendChild(card);
      });
    }

    const schoolGrid = document.getElementById("quiz-school-grid");
    if (schoolGrid) {
      schoolMatches.forEach((match) => schoolGrid.appendChild(buildSchoolMatchCard(match)));
    }

    const scoresWrap = resultsSection.querySelector(".quiz-scores");
    ranked.forEach((domain) => {
      const score = quizScores[domain] || 0;
      const pct = Math.round((score / totalAnswers) * 100);
      const meta = DOMAINS[domain];
      const domainLabel = isEn && meta.nameEn ? meta.nameEn : domain;
      const row = document.createElement("div");
      row.className = "quiz-score-row";
      row.innerHTML = `
        <span class="quiz-score-label">${domainIcon(domain)}${escapeHtml(domainLabel)}</span>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="quiz-score-value">${score}/${totalAnswers}</span>
      `;
      scoresWrap.appendChild(row);
    });

    const restartBtn = document.getElementById("quiz-restart");
    if (restartBtn) restartBtn.addEventListener("click", restartQuiz);
  }

  function restartQuiz() {
    quizIndex = 0;
    quizScores = {};
    quizRoleScores = {};
    quizPractical = { niveau: null, ville: null, statut: null, priorite: null };
    quizFlow = QUIZ_QUESTIONS.filter((q) => q.type === "domain");
    quizHistory = [];
    const quizSection = document.getElementById("quiz-section");
    const resultsSection = document.getElementById("quiz-results");
    if (resultsSection) resultsSection.hidden = true;
    if (quizSection) quizSection.hidden = false;
    renderQuizQuestion();
  }

  function initQuiz() {
    const questionEl = document.getElementById("quiz-question");
    if (!questionEl) return;
    renderQuizQuestion();
  }

  // ---- Calendrier des dates clés ----
  function renderAcademicTimeline() {
    const container = document.getElementById("timeline-general");
    if (!container || typeof ACADEMIC_TIMELINE === "undefined") return;
    ACADEMIC_TIMELINE.forEach((step) => {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.innerHTML = `
        <div class="timeline-period">${escapeHtml(tField(step, "periode"))}</div>
        <div class="timeline-content">
          <h3>${escapeHtml(tField(step, "titre"))}</h3>
          <p>${escapeHtml(tField(step, "description"))}</p>
        </div>
      `;
      container.appendChild(item);
    });
  }

  // ---- Formulaires Contact et Proposer : envoi direct depuis la page ----
  // Le message part vers la fonction /api/contact (Vercel), qui l'envoie
  // par e-mail à WIYAO via Resend. Si l'envoi échoue (service pas encore
  // configuré, réseau coupé), la page propose d'ouvrir la messagerie avec
  // le même message, comme avant le 2026-11-07.
  const CONTACT_INBOX = "wiya.info@gmail.com";

  function contactMailto(d) {
    return `mailto:${CONTACT_INBOX}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(`${d.message}\n\n${d.name} (${d.email})`)}`;
  }

  function proposalMailto(d) {
    const lines = [
      `Type : ${d.type}`,
      `Nom : ${d.nom}`,
      `Ville : ${d.ville || "non précisée"}`,
      `Lien / source : ${d.lien}`,
      `Date (si applicable) : ${d.date || "non précisée"}`,
      "",
      "Description :",
      d.description,
      "",
      `Proposé par ${d.name} (${d.email})`,
    ];
    return `mailto:${CONTACT_INBOX}?subject=${encodeURIComponent(`[Proposition ${d.type}] ${d.nom}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  function wireDirectForm(formId, kind, buildMailto, sent) {
    const form = document.getElementById(formId);
    if (!form) return;
    const button = form.querySelector('button[type="submit"]');
    const status = document.createElement("p");
    status.className = "form-status";
    status.setAttribute("role", "status");
    status.hidden = true;
    button.insertAdjacentElement("afterend", status);

    // Les libellés passent par i18nLabel (textes fixes du site) ; le lien de
    // secours est construit par le DOM, jamais en HTML avec les saisies.
    function show(state, mailto) {
      status.hidden = false;
      status.dataset.state = state;
      if (state === "sending") status.innerHTML = i18nLabel("form.status.sending", "Envoi en cours…", "Sending…");
      else if (state === "sent") status.innerHTML = i18nLabel(sent.key, sent.fr, sent.en);
      else if (state === "rate") status.innerHTML = i18nLabel("form.status.rate", "Tu as envoyé plusieurs messages en peu de temps : réessaie dans quelques minutes.", "You sent several messages in a short time: try again in a few minutes.");
      else {
        status.innerHTML = i18nLabel("form.status.error", "L'envoi n'a pas abouti. Réessaie dans un instant, ou", "Sending failed. Try again in a moment, or") + " ";
        const link = document.createElement("a");
        link.href = mailto;
        link.innerHTML = i18nLabel("form.status.mailto", "ouvre ta messagerie avec ce message", "open your email app with this message");
        status.appendChild(link);
        status.appendChild(document.createTextNode("."));
      }
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (form.dataset.sending === "1") return;
      const data = { form: kind };
      Array.from(form.elements).forEach((el) => {
        if (el.name) data[el.name] = el.value.trim();
      });
      form.dataset.sending = "1";
      button.disabled = true;
      show("sending");
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          form.reset();
          show("sent");
        } else {
          show(response.status === 429 ? "rate" : "error", buildMailto(data));
        }
      } catch (err) {
        show("error", buildMailto(data));
      } finally {
        form.dataset.sending = "";
        button.disabled = false;
      }
    });
  }

  function initContactForm() {
    wireDirectForm("contact-form", "contact", contactMailto, {
      key: "form.status.sent.contact",
      fr: "Merci, ton message est bien parti : on te répond à l'adresse e-mail que tu as indiquée.",
      en: "Thanks, your message has been sent: we'll reply to the email address you entered.",
    });
  }

  function initProposerForm() {
    wireDirectForm("proposer-form", "proposer", proposalMailto, {
      key: "form.status.sent.proposer",
      fr: "Merci, ta proposition est bien partie : on la vérifie avant de l'ajouter, et on te répond à l'adresse e-mail que tu as indiquée.",
      en: "Thanks, your suggestion has been sent: we'll check it before adding it, and reply to the email address you entered.",
    });
  }

  function schoolDatesRank(school) {
    const dc = school.datesCles;
    if (dc && dc.urgent) return 0;
    if (dc && dc.mode === "campagne") return 1;
    if (dc && dc.mode === "continue") return 2;
    return 3;
  }

  function renderSchoolDates() {
    const container = document.getElementById("school-dates-list");
    if (!container || typeof SCHOOLS === "undefined") return;
    const isEn = currentLang() === "en";

    const ids = Object.keys(SCHOOLS).sort((a, b) => schoolDatesRank(SCHOOLS[a]) - schoolDatesRank(SCHOOLS[b]));

    ids.forEach((id) => {
      const school = SCHOOLS[id];
      const dc = school.datesCles;
      const row = document.createElement("div");
      row.className = "dates-row" + (dc && dc.urgent ? " dates-row-urgent" : "");

      let bodyHtml = "";
      if (dc && dc.urgent && dc.urgentNote) {
        bodyHtml += `<p class="dates-urgent-note">${icon("clock")}${escapeHtml(tField(dc, "urgentNote"))}</p>`;
      }
      if (dc && dc.note) {
        bodyHtml += `<p class="dates-note">${escapeHtml(tField(dc, "note"))}</p>`;
      }

      // Libellés et valeurs traduits : chaque date de data.js porte sa
      // version anglaise ("clotureEn" à côté de "cloture", etc.).
      const fields = dc
        ? [
            [isEn ? "Applications open" : "Ouverture des candidatures", tField(dc, "ouverture")],
            [isEn ? "Deadline" : "Clôture", tField(dc, "cloture")],
            [isEn ? "Entrance exam" : "Concours", tField(dc, "concours")],
            [isEn ? "Results" : "Résultats", tField(dc, "resultats")],
            [isEn ? "Start of term" : "Rentrée", tField(dc, "rentree")]
          ].filter(([, value]) => !!value)
        : [];

      if (fields.length) {
        bodyHtml += `<ul class="dates-list">` + fields.map(([label, value]) => `<li><strong>${label}${isEn ? ":" : " :"}</strong> ${escapeHtml(value)}</li>`).join("") + `</ul>`;
      }

      if (dc && dc.anneeReference) {
        bodyHtml += `<p class="dates-ref-note">${
          isEn
            ? `Calendar reference (${escapeHtml(dc.anneeReference)})${dc.aVerifier ? ": reconfirm directly with the school" : ""}.`
            : `Repère de calendrier (${escapeHtml(dc.anneeReference)})${dc.aVerifier ? " : à reconfirmer directement auprès de l'école" : ""}.`
        }</p>`;
      }

      if (dc && dc.contact) {
        bodyHtml += `<p class="dates-ref-note">${isEn ? "Direct contact:" : "Contact direct :"} ${escapeHtml(tField(dc, "contact"))}</p>`;
      }

      if (!dc) {
        bodyHtml = `<p class="dates-note">${
          isEn
            ? "Dates not published online: check directly on the school's website."
            : "Dates non publiées en ligne : vérifie directement sur le site de l'école."
        }</p>`;
      }

      const siteHref = safeUrl(school.site);
      row.innerHTML = `
        <h3>${escapeHtml(tField(school, "name"))}</h3>
        ${bodyHtml}
        ${siteHref ? `<a class="school-link" href="${escapeHtml(siteHref)}" target="_blank" rel="noopener noreferrer">${isEn ? "See official site →" : "Voir le site officiel →"}</a>` : ""}
      `;
      container.appendChild(row);
    });
  }

  // ---- Recherche transversale (page recherche.html) ----
  // Indexe roadmaps/écoles depuis js/data.js, et scanne les .eco-item / .timeline-item
  // des autres pages via fetch + DOMParser pour rester la seule source de vérité
  // (pas de duplication de contenu à maintenir en double).
  // Aplatit le contenu détaillé d'une roadmap (titres de section + libellés
  // d'étapes) en un seul texte, pour que la recherche trouve une compétence
  // citée à l'intérieur d'une roadmap et pas seulement dans son titre.
  // L'index est bilingue : titre, description et catégorie s'affichent dans
  // la langue courante, mais le texte cherchable réunit le français et
  // l'anglais, pour qu'un mot tapé dans l'une ou l'autre langue trouve le
  // même contenu.
  function flattenRoadmapKeywords(rm) {
    return (rm.sections || [])
      .map((section) =>
        [section.title, section.titleEn]
          .concat((section.items || []).map((item) => item.label + " " + (item.labelEn || "")))
          .join(" ")
      )
      .join(" ");
  }

  // Résume les dates clés d'une école en texte cherchable (concours,
  // ouverture, clôture, rentrée) sans dupliquer la logique d'affichage
  // dédiée de calendrier.html.
  function flattenSchoolKeywords(school) {
    const parts = ["filieres", "filieresEn", "niveaux", "niveauxEn"].map((f) => (school[f] || []).join(" "));
    const dc = school.datesCles;
    if (dc) {
      ["ouverture", "cloture", "concours", "resultats", "rentree", "note"].forEach((f) => {
        parts.push(dc[f] || "", dc[f + "En"] || "");
      });
    }
    return parts.join(" ");
  }

  // Texte d'une clé de js/i18n.js dans une langue, sans balises (pour les
  // éléments des autres pages lus par fetch : leur HTML est en français).
  function i18nText(el, lang) {
    if (!el || !el.dataset || !el.dataset.i18nKey || typeof window.wiyaoText !== "function") return "";
    const html = window.wiyaoText(el.dataset.i18nKey, lang);
    if (!html) return "";
    return new DOMParser().parseFromString(html, "text/html").body.textContent.trim();
  }

  function indexEntry(fr, en, extra) {
    const isEn = currentLang() === "en";
    const pick = (a, b) => (isEn && b ? b : a);
    return Object.assign({}, extra, {
      title: pick(fr.title, en.title),
      description: pick(fr.description || "", en.description),
      category: pick(fr.category, en.category),
      keywords: [extra.keywords || "", isEn ? fr.title : en.title || "", isEn ? fr.description || "" : en.description || ""].join(" ")
    });
  }

  function buildGlobalIndex() {
    const index = [];

    [["ROLES", "Roadmap · métier", "Roadmap · career"], ["SKILLS", "Roadmap · compétence", "Roadmap · skill"]].forEach(([group, catFr, catEn]) => {
      const list = group === "ROLES" ? (typeof ROLES !== "undefined" ? ROLES : null) : (typeof SKILLS !== "undefined" ? SKILLS : null);
      if (!list) return;
      Object.keys(list).forEach((id) => {
        const r = list[id];
        index.push(indexEntry(
          { title: r.title, description: r.subtitle, category: catFr },
          { title: r.titleEn, description: r.subtitleEn, category: catEn },
          { url: `roadmap.html?id=${encodeURIComponent(id)}`, keywords: flattenRoadmapKeywords(r) }
        ));
      });
    });
    if (typeof SCHOOLS !== "undefined") {
      Object.keys(SCHOOLS).forEach((id) => {
        const sc = SCHOOLS[id];
        index.push(indexEntry(
          { title: sc.name, description: sc.description, category: "École" },
          { title: sc.nameEn || sc.name, description: sc.descriptionEn, category: "School" },
          { url: "ecoles.html", keywords: flattenSchoolKeywords(sc) }
        ));
      });
    }

    const pagesToScan = [
      { url: "ecosysteme.html", category: "Écosystème togolais", categoryEn: "Togolese ecosystem", itemSelector: ".eco-item" },
      { url: "bourses-financement.html", category: "Bourses & financement", categoryEn: "Scholarships & funding", itemSelector: ".eco-item" },
      { url: "stages-emploi.html", category: "Stages & emploi", categoryEn: "Internships & jobs", itemSelector: ".eco-item" },
      { url: "actualites.html", category: "Actualités", categoryEn: "News", itemSelector: ".timeline-item" },
      { url: "temoignages.html", category: "Témoignages", categoryEn: "Testimonials", itemSelector: ".eco-item" },
      { url: "faq.html", category: "FAQ", categoryEn: "FAQ", itemSelector: ".faq-item", headingSelector: "summary", linkSelector: null }
    ];

    const fetches = pagesToScan.map((page) =>
      fetch(page.url)
        .then((res) => res.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, "text/html");
          doc.querySelectorAll(page.itemSelector).forEach((item) => {
            const heading = item.querySelector(page.headingSelector || "h3, h4");
            const desc = item.querySelector("p");
            const link = page.linkSelector === null ? null : item.querySelector(page.linkSelector || "a.eco-link");
            if (!heading) return;
            // L'ancre peut être portée par l'item lui-même (ex. faq.html : les
            // <details> ciblés par d'autres pages ont leur propre id, pas de
            // <section id> autour) ou par une <section id> englobante (ex.
            // bourses-financement.html : une section par sous-thème).
            const section = item.closest("section[id]");
            const anchorId = item.id || (section && section.id);
            index.push(indexEntry(
              { title: heading.textContent.trim(), description: desc ? desc.textContent.trim() : "", category: page.category },
              { title: i18nText(heading, "en"), description: i18nText(desc, "en"), category: page.categoryEn },
              { url: anchorId ? `${page.url}#${anchorId}` : page.url, externalUrl: link ? link.getAttribute("href") : null }
            ));
          });
        })
        .catch(function () {})
    );

    return Promise.all(fetches).then(() => index);
  }

  function initGlobalSearch() {
    const input = document.getElementById("global-search-input");
    const results = document.getElementById("global-search-results");
    const status = document.getElementById("global-search-status");
    if (!input || !results || !status) return;

    let index = null;
    buildGlobalIndex().then((idx) => {
      idx.forEach((item) => {
        item.searchText = normalize(item.title + " " + item.description + " " + (item.keywords || ""));
      });
      index = idx;
      status.textContent = currentLang() === "en"
        ? `${idx.length} indexed resources. Start typing to search.`
        : `${idx.length} ressources indexées. Tape pour chercher.`;
      if (input.value.trim()) runSearch();
    });

    function runSearch() {
      results.innerHTML = "";
      const query = normalize(input.value.trim());
      const isEn = currentLang() === "en";
      if (!query) {
        status.textContent = index
          ? (isEn ? `${index.length} indexed resources. Start typing to search.` : `${index.length} ressources indexées. Tape pour chercher.`)
          : (isEn ? "Loading search index..." : "Chargement de l'index de recherche...");
        return;
      }
      if (!index) return;

      const matches = index.filter((item) => item.searchText.indexOf(query) !== -1);
      const shownCount = Math.min(matches.length, 60);
      status.textContent = !matches.length
        ? (isEn ? "No results. Try a different keyword." : "Aucun résultat. Essaie un autre mot-clé.")
        : matches.length > 60
        ? (isEn ? `${shownCount} of ${matches.length} results shown` : `${shownCount} résultats affichés sur ${matches.length}`)
        : (isEn ? `${matches.length} result${matches.length > 1 ? "s" : ""}` : `${matches.length} résultat${matches.length > 1 ? "s" : ""}`);

      matches.slice(0, 60).forEach((item) => {
        const card = document.createElement("a");
        card.className = "search-result";
        const externalHref = safeUrl(item.externalUrl);
        const targetUrl = externalHref || safeUrl(item.url);
        if (!targetUrl) return;
        card.href = targetUrl;
        if (externalHref) {
          card.target = "_blank";
          card.rel = "noopener noreferrer";
        }

        const cat = document.createElement("span");
        cat.className = "search-result-category";
        cat.textContent = item.category;
        card.appendChild(cat);

        const title = document.createElement("h3");
        title.textContent = item.title;
        card.appendChild(title);

        if (item.description) {
          const desc = document.createElement("p");
          desc.textContent = item.description;
          card.appendChild(desc);
        }

        results.appendChild(card);
      });
    }

    input.addEventListener("input", runSearch);
  }

  // ---- Suggestions de recherche (page recherche.html) : raccourcis vers
  // les 7 domaines et les rubriques du site, affichés tant que le champ est
  // vide (pas de "recherches populaires" : WIYAO ne suit aucune statistique
  // d'usage, ces suggestions sont éditoriales). ----
  const SEARCH_CATEGORIES = [
    { label: "Roadmaps", labelEn: "Roadmaps", url: "roadmaps.html" },
    { label: "Test d'orientation", labelEn: "Orientation test", url: "test-orientation.html" },
    { label: "Écoles & universités", labelEn: "Schools & universities", url: "ecoles.html" },
    { label: "Calendrier", labelEn: "Calendar", url: "calendrier.html" },
    { label: "Bourses & financement", labelEn: "Scholarships & funding", url: "bourses-financement.html" },
    { label: "Stages & emploi", labelEn: "Internships & jobs", url: "stages-emploi.html" },
    { label: "Écosystème togolais", labelEn: "Togolese ecosystem", url: "ecosysteme.html" },
    { label: "Actualités", labelEn: "News", url: "actualites.html" },
    { label: "Témoignages", labelEn: "Testimonials", url: "temoignages.html" },
    { label: "FAQ", labelEn: "FAQ", url: "faq.html" },
  ];

  function initSearchSuggestions() {
    const input = document.getElementById("global-search-input");
    const suggestionsGroup = document.getElementById("search-suggestions-group");
    const suggestionsRow = document.getElementById("search-suggestions");
    const categoriesGroup = document.getElementById("search-categories-group");
    const categoriesRow = document.getElementById("search-categories");
    if (!input || !suggestionsRow || !categoriesRow) return;

    if (typeof DOMAINS !== "undefined") {
      Object.keys(DOMAINS).forEach((domainName) => {
        const meta = DOMAINS[domainName];
        const label = currentLang() === "en" && meta.nameEn ? meta.nameEn : domainName;
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "domain-chip";
        chip.textContent = label;
        chip.insertAdjacentHTML("afterbegin", domainIcon(domainName));
        chip.addEventListener("click", () => {
          input.value = domainName;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.focus();
        });
        suggestionsRow.appendChild(chip);
      });
    }

    SEARCH_CATEGORIES.forEach((cat) => {
      const a = document.createElement("a");
      a.href = cat.url;
      a.textContent = currentLang() === "en" ? cat.labelEn : cat.label;
      categoriesRow.appendChild(a);
    });

    function toggleSuggestions() {
      const hasQuery = input.value.trim().length > 0;
      if (suggestionsGroup) suggestionsGroup.hidden = hasQuery;
      if (categoriesGroup) categoriesGroup.hidden = hasQuery;
    }
    input.addEventListener("input", toggleSuggestions);
    toggleSuggestions();
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderGrid();
    renderDomainPrimer();
    initFilters();
    initGlobalSearch();
    initSearchSuggestions();
    renderRoadmap();
    renderSchools();
    initSchoolFilters();
    initQuiz();
    renderAcademicTimeline();
    renderSchoolDates();
    initContactForm();
    initProposerForm();
  });

  // Changement de langue (i18n.js) : les textes fixes se traduisent sur
  // place, mais les contenus tirés de data.js (roadmaps, écoles, dates,
  // recherche) sont construits une seule fois au chargement : la page se
  // recharge pour les reconstruire dans la nouvelle langue. Le test
  // d'orientation est redessiné sur place, pour ne pas perdre les réponses.
  const DATA_ROOTS = ["role-grid", "skill-grid", "roadmap-detail", "school-grid", "school-dates-list", "timeline-general", "global-search-results"];
  document.addEventListener("wiyao:langchange", function () {
    if (document.getElementById("quiz-question")) {
      const primer = document.getElementById("domain-primer-grid");
      if (primer) {
        primer.innerHTML = "";
        renderDomainPrimer();
      }
      const results = document.getElementById("quiz-results");
      if (results && !results.hidden) showQuizResults();
      else renderQuizQuestion();
      return;
    }
    if (DATA_ROOTS.some((id) => document.getElementById(id))) window.location.reload();
  });

  // Exposé pour js/assistant.js : réutilise la même normalisation et le même
  // index de recherche que la page Recherche, pas de logique dupliquée.
  window.WIYAO_SEARCH = { buildGlobalIndex, normalize, currentLang, safeUrl };
})();
