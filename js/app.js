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
      ? `<span class="badge level-badge level-${levelSlug(rm.level)}">${levelLabel(rm.level)}</span>`
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
    card.href = `roadmap.html?id=${id}`;
    card.className = "card";
    card.dataset.title = rm.title.toLowerCase();
    if (rm.domain) card.dataset.domain = rm.domain;
    const badges = badgesHtml(rm);
    const cardLabel = currentLang() === "en" ? "completed" : "complété";
    const kindLabel = kind === "skill" ? "Roadmap · compétence" : "Roadmap · métier";
    card.innerHTML = `
      <div class="card-kind-bar">${kindLabel}</div>
      <div class="card-body">
        <div class="card-icon">${rm.icon}</div>
        ${badges ? `<div class="card-badges">${badges}</div>` : ""}
        <h3>${tField(rm, "title")}</h3>
        <p>${tField(rm, "subtitle")}</p>
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
    if (toggle.dataset.kind === "skill") {
      toggle.textContent = en ? `See ${n} skills ▾` : `Voir les ${n} compétences ▾`;
    } else {
      toggle.textContent = en
        ? `See ${n} roadmap${n === "1" ? "" : "s"} ▾`
        : `Voir ${n === "1" ? "la" : "les"} ${n} roadmap${n === "1" ? "" : "s"} ▾`;
    }
  }

  function setGroupOpen(toggle, subGrid, isOpen) {
    subGrid.hidden = !isOpen;
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

  // ---- Page d'accueil : deux grilles, par métier et par compétence ----
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
        heading.textContent = meta && meta.icon ? `${meta.icon} ${domainLabel}` : domainLabel;
        group.appendChild(heading);

        if (meta && meta.description) {
          const desc = document.createElement("p");
          desc.className = "domain-group-desc";
          desc.textContent = tField(meta, "description");
          group.appendChild(desc);
        }

        const subGrid = document.createElement("div");
        subGrid.className = "grid";
        subGrid.id = `domain-grid-${index}`;
        subGrid.hidden = true;
        ids.forEach((id) => subGrid.appendChild(buildCard(id, ROLES[id], "role")));

        const toggle = buildGroupToggle("roadmap", ids.length, subGrid.id);
        toggle.addEventListener("click", () => setGroupOpen(toggle, subGrid, subGrid.hidden));
        group.appendChild(toggle);
        group.appendChild(subGrid);

        roleGrid.appendChild(group);
      });
    }
    if (skillGrid && typeof SKILLS !== "undefined") {
      const skillIds = Object.keys(SKILLS);
      skillIds.forEach((id) => skillGrid.appendChild(buildCard(id, SKILLS[id], "skill")));
      skillGrid.hidden = true;

      const skillToggle = buildGroupToggle("skill", skillIds.length, "skill-grid");
      skillToggle.addEventListener("click", () => setGroupOpen(skillToggle, skillGrid, skillGrid.hidden));
      skillGrid.insertAdjacentElement("beforebegin", skillToggle);
    }
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

      if (meta.icon) {
        const icon = document.createElement("div");
        icon.className = "domain-primer-icon";
        icon.textContent = meta.icon;
        item.appendChild(icon);
      }

      const heading = document.createElement("h4");
      heading.textContent = domainLabel;
      item.appendChild(heading);

      const desc = document.createElement("p");
      desc.textContent = tField(meta, "description");
      item.appendChild(desc);

      if (meta.presenceTogo) {
        const presence = document.createElement("p");
        presence.className = "domain-primer-presence";
        presence.textContent = `🇹🇬 ${tField(meta, "presenceTogo")}`;
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
            if (subGrid && toggle && subGrid.hidden) setGroupOpen(toggle, subGrid, true);
          }
        });
      } else if (filtering && visibleCount > 0 && grid.hidden) {
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
      const h4 = document.createElement("h4");
      h4.textContent = c.name;
      item.appendChild(h4);
      const p = document.createElement("p");
      p.innerHTML = isEn ? c.noteEn : c.note;
      item.appendChild(p);
      if (c.url) {
        const a = document.createElement("a");
        a.className = "eco-link";
        a.href = c.url;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = c.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
        item.appendChild(a);
      }
      list.appendChild(item);
    });
    section.appendChild(list);

    return section;
  }

  // ---- Page roadmap détail ----
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
      container.innerHTML = `<p>Roadmap introuvable. <a href="index.html">Retour à l'accueil</a></p>`;
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
      <span class="breadcrumb-current">${tField(rm, "title")}</span>
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
      <h1>${rm.icon} ${tField(rm, "title")}</h1>
      <p class="subtitle">${tField(rm, "subtitle")}</p>
      ${togoNotice}
      <div class="progress-bar large"><div class="progress-fill" id="global-fill"></div></div>
      <span class="progress-label" id="global-label"></span>
    `;
    container.appendChild(header);

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
      titleEl.textContent = section.title;
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
        label.textContent = item.label;
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
          note.textContent = item.note;
          labelWrap.appendChild(note);
        }

        if (item.resource) {
          const link = document.createElement("a");
          link.className = "item-resource";
          link.href = item.resource.url;
          link.textContent = "📎 " + item.resource.label;
          if (!item.resource.url.startsWith("roadmap.html")) {
            link.target = "_blank";
            link.rel = "noopener";
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
            ? "Reset progress for this roadmap?"
            : "Réinitialiser la progression pour cette roadmap ?";
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
  const STATUT_LABELS = {
    "public": "Publique",
    "prive": "Privée",
    "inter-etats": "Inter-États"
  };

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
    card.dataset.title = school.name.toLowerCase() + " " + school.filieres.join(" ").toLowerCase();
    card.dataset.ville = school.ville.join(",");
    card.dataset.statut = school.statut;
    card.dataset.domaine = matchSchoolDomains(school).join(",");

    const body = document.createElement("div");
    body.className = "card-body";
    card.appendChild(body);

    const badges = document.createElement("div");
    badges.className = "card-badges school-badges";
    badges.innerHTML =
      `<span class="badge status-${school.statut}">${STATUT_LABELS[school.statut] || school.statut}</span>` +
      school.ville.map((v) => `<span class="badge ville-badge">${v}</span>`).join("") +
      (school.agree === true ? `<span class="badge status-public">🏛️ Agréé État</span>` : "");
    body.appendChild(badges);

    const title = document.createElement("h3");
    title.textContent = school.name;
    body.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.className = "school-subtitle";
    subtitle.textContent = school.description;
    body.appendChild(subtitle);

    const filieres = document.createElement("ul");
    filieres.className = "school-filieres";
    filieres.innerHTML = school.filieres.map((f) => `<li>${f}</li>`).join("");
    body.appendChild(filieres);

    const meta = document.createElement("div");
    meta.className = "school-meta";
    let metaHtml = `<span><strong>Niveaux :</strong> ${school.niveaux.join(", ")}</span>`;
    if (school.duree) metaHtml += `<span><strong>Durée :</strong> ${school.duree}</span>`;
    if (school.admission) metaHtml += `<span><strong>Admission :</strong> ${school.admission}</span>`;
    if (school.frais) metaHtml += `<span><strong>Frais :</strong> ${school.frais}</span>`;
    if (school.agreeNote) metaHtml += `<span>ℹ️ ${school.agreeNote}</span>`;
    meta.innerHTML = metaHtml;
    body.appendChild(meta);

    if (school.site) {
      const link = document.createElement("a");
      link.className = "school-link";
      link.href = school.site;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Voir le site officiel →";
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
      <h2 class="quiz-question-title">${tField(q, "question")}</h2>
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

    return Object.keys(SCHOOLS)
      .map((id) => {
        const school = SCHOOLS[id];
        const filieresText = school.filieres.join(" ").toLowerCase();
        const checks = [];

        checks.push({
          ok: keywords.some((kw) => filieresText.indexOf(kw) !== -1),
          label: `Filière liée à ${topDomain}`
        });

        if (quizPractical.niveau && quizPractical.niveau !== "peu-importe") {
          const niveauText = school.niveaux.join(" ").toLowerCase();
          let ok = false;
          if (quizPractical.niveau === "court") ok = /bts|brevet de technicien/.test(niveauText);
          if (quizPractical.niveau === "licence") ok = /licence/.test(niveauText);
          if (quizPractical.niveau === "long") ok = /master|ingénieur/.test(niveauText);
          checks.push({ ok, label: "Niveau qui correspond" });
        }

        if (quizPractical.ville && quizPractical.ville !== "peu-importe") {
          checks.push({ ok: school.ville.indexOf(quizPractical.ville) !== -1, label: `À ${quizPractical.ville}` });
        }

        if (quizPractical.statut && quizPractical.statut !== "peu-importe") {
          checks.push({
            ok: school.statut === quizPractical.statut,
            label: quizPractical.statut === "public" ? "Statut public" : "Statut privé"
          });
        }

        if (quizPractical.priorite && quizPractical.priorite !== "peu-importe") {
          let ok = false;
          if (quizPractical.priorite === "agree") ok = school.agree === true;
          if (quizPractical.priorite === "pratique") ok = /pratique|stage/i.test(school.description);
          checks.push({
            ok,
            label: quizPractical.priorite === "agree" ? "Diplôme agréé par l'État" : "Formation orientée pratique"
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
      .map((c) => `<span class="${c.ok ? "match-ok" : "match-no"}">${c.ok ? "✓" : "✗"} ${c.label}</span>`)
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
    const topLabel = isEn && topMeta.nameEn ? topMeta.nameEn : top;

    let html = `
      <p class="quiz-disclaimer">${
        isEn
          ? 'This result is a starting point, not a verdict : 14 questions can\'t know you 100%. Compare it against a <a href="temoignages.html">real testimonial</a> from someone in the role, and try the roadmap before committing financially to a school.'
          : 'Ce résultat est un point de départ, pas un verdict : 14 questions ne peuvent pas te connaître à 100 %. Confronte-le à un <a href="temoignages.html">témoignage réel</a> de quelqu\'un du métier, et teste la roadmap avant de t\'engager financièrement dans une école.'
      }</p>
      <h2>${isEn ? "Your profile" : "Ton profil"} : ${topMeta.icon} ${topLabel}</h2>
      <p class="category-desc">${tField(topMeta, "description")}</p>
    `;

    if (matchingRoles.length) {
      html += `
        <h3 class="quiz-scores-title">${isEn ? "Recommended roles" : "Métiers recommandés"}</h3>
        ${bestRoleIds.length ? `<p class="category-desc" style="text-align:center;">${
          isEn
            ? "The metier(s) below marked “Best match” fit your role-specific answers best; the others belong to the same field but scored lower."
            : "Le(s) métier(s) ci-dessous marqués « Meilleure correspondance » collent le mieux à tes réponses sur le métier précis ; les autres restent dans le même domaine mais ont obtenu un score plus faible."
        }</p>` : ""}
        <div class="grid" id="quiz-role-grid"></div>
      `;
    }

    if (isCloseCall) {
      const secondMeta = DOMAINS[second];
      const secondLabel = isEn && secondMeta.nameEn ? secondMeta.nameEn : second;
      html += `<p class="quiz-secondary">${
        isEn
          ? `Close call: <strong>${secondMeta.icon} ${secondLabel}</strong> suits you almost as much as ${topLabel}. Worth exploring both before choosing.`
          : `Résultat serré : <strong>${secondMeta.icon} ${secondLabel}</strong> te correspond presque autant que ${topLabel}. Vaut le coup d'explorer les deux avant de choisir.`
      }</p>`;
    }

    if (schoolMatches.length) {
      html += `
        <h3 class="quiz-scores-title">${isEn ? "Schools recommended for you" : "Écoles recommandées pour toi"}</h3>
        <p class="category-desc" style="text-align:center;">${
          isEn
            ? "Based on your domain and your answers about level, city and budget : every checked criterion is verified, not guessed."
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
            bestBadge.textContent = isEn ? "\u{1F3AF} Best match" : "\u{1F3AF} Meilleure correspondance";
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
        <span class="quiz-score-label">${meta.icon} ${domainLabel}</span>
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
        <div class="timeline-period">${tField(step, "periode")}</div>
        <div class="timeline-content">
          <h3>${tField(step, "titre")}</h3>
          <p>${tField(step, "description")}</p>
        </div>
      `;
      container.appendChild(item);
    });
  }

  // ---- Page Contact (message) ----
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.elements["name"].value.trim();
      const email = form.elements["email"].value.trim();
      const subject = form.elements["subject"].value.trim();
      const message = form.elements["message"].value.trim();
      const body = `${message}\n\n${name} (${email})`;
      window.location.href = `mailto:wiya.info@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // ---- Page Proposer un contenu ----
  function initProposerForm() {
    const form = document.getElementById("proposer-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.elements["name"].value.trim();
      const email = form.elements["email"].value.trim();
      const type = form.elements["type"].value.trim();
      const ville = form.elements["ville"].value.trim();
      const nom = form.elements["nom"].value.trim();
      const lien = form.elements["lien"].value.trim();
      const date = form.elements["date"].value.trim();
      const description = form.elements["description"].value.trim();
      const subject = `[Proposition ${type}] ${nom}`;
      const bodyLines = [
        `Type : ${type}`,
        `Nom : ${nom}`,
        `Ville : ${ville || "non précisée"}`,
        `Lien / source : ${lien}`,
        `Date (si applicable) : ${date || "non précisée"}`,
        "",
        "Description :",
        description,
        "",
        `Proposé par ${name} (${email})`,
      ];
      window.location.href = `mailto:wiya.info@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
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
        bodyHtml += `<p class="dates-urgent-note">⏰ ${dc.urgentNote}</p>`;
      }
      if (dc && dc.note) {
        bodyHtml += `<p class="dates-note">${dc.note}</p>`;
      }

      // Les libellés de champ sont traduits ; les valeurs elles-mêmes (dates,
      // notes) restent telles qu'écrites/vérifiées dans data.js — c'est ce que
      // #i18n-notice signale honnêtement aux utilisateurs EN, pas une erreur.
      const fields = dc
        ? [
            [isEn ? "Applications open" : "Ouverture des candidatures", dc.ouverture],
            [isEn ? "Deadline" : "Clôture", dc.cloture],
            [isEn ? "Entrance exam" : "Concours", dc.concours],
            [isEn ? "Results" : "Résultats", dc.resultats],
            [isEn ? "Start of term" : "Rentrée", dc.rentree]
          ].filter(([, value]) => !!value)
        : [];

      if (fields.length) {
        bodyHtml += `<ul class="dates-list">` + fields.map(([label, value]) => `<li><strong>${label} :</strong> ${value}</li>`).join("") + `</ul>`;
      }

      if (dc && dc.anneeReference) {
        bodyHtml += `<p class="dates-ref-note">${
          isEn
            ? `Calendar reference (${dc.anneeReference})${dc.aVerifier ? " : reconfirm directly with the school" : ""}.`
            : `Repère de calendrier (${dc.anneeReference})${dc.aVerifier ? " : à reconfirmer directement auprès de l'école" : ""}.`
        }</p>`;
      }

      if (dc && dc.contact) {
        bodyHtml += `<p class="dates-ref-note">${isEn ? "Direct contact" : "Contact direct"} : ${dc.contact}</p>`;
      }

      if (!dc) {
        bodyHtml = `<p class="dates-note">${
          isEn
            ? "Dates not published online : check directly on the school's website."
            : "Dates non publiées en ligne : vérifie directement sur le site de l'école."
        }</p>`;
      }

      row.innerHTML = `
        <h3>${school.name}</h3>
        ${bodyHtml}
        ${school.site ? `<a class="school-link" href="${school.site}" target="_blank" rel="noopener">${isEn ? "See official site →" : "Voir le site officiel →"}</a>` : ""}
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
  function flattenRoadmapKeywords(rm) {
    return (rm.sections || [])
      .map((section) => section.title + " " + (section.items || []).map((item) => item.label).join(" "))
      .join(" ");
  }

  // Résume les dates clés d'une école en texte cherchable (concours,
  // ouverture, clôture, rentrée) sans dupliquer la logique d'affichage
  // dédiée de calendrier.html.
  function flattenSchoolKeywords(school) {
    const parts = [(school.filieres || []).join(" "), (school.niveaux || []).join(" "), (school.ville || []).join(" ")];
    const dc = school.datesCles;
    if (dc) {
      parts.push([dc.ouverture, dc.cloture, dc.concours, dc.resultats, dc.rentree, dc.note].filter(Boolean).join(" "));
    }
    return parts.join(" ");
  }

  function buildGlobalIndex() {
    const index = [];

    if (typeof ROLES !== "undefined") {
      Object.keys(ROLES).forEach((id) => {
        const r = ROLES[id];
        index.push({ title: r.title, description: r.description || "", category: "Roadmap · métier", url: `roadmap.html?id=${id}`, keywords: flattenRoadmapKeywords(r) });
      });
    }
    if (typeof SKILLS !== "undefined") {
      Object.keys(SKILLS).forEach((id) => {
        const s = SKILLS[id];
        index.push({ title: s.title, description: s.description || "", category: "Roadmap · compétence", url: `roadmap.html?id=${id}`, keywords: flattenRoadmapKeywords(s) });
      });
    }
    if (typeof SCHOOLS !== "undefined") {
      Object.keys(SCHOOLS).forEach((id) => {
        const sc = SCHOOLS[id];
        index.push({ title: sc.name, description: sc.description || "", category: "École", url: "ecoles.html", keywords: flattenSchoolKeywords(sc) });
      });
    }

    const pagesToScan = [
      { url: "ecosysteme.html", category: "Écosystème togolais", itemSelector: ".eco-item" },
      { url: "bourses-financement.html", category: "Bourses & financement", itemSelector: ".eco-item" },
      { url: "stages-emploi.html", category: "Stages & emploi", itemSelector: ".eco-item" },
      { url: "actualites.html", category: "Actualités", itemSelector: ".timeline-item" },
      { url: "temoignages.html", category: "Témoignages", itemSelector: ".eco-item" },
      { url: "faq.html", category: "FAQ", itemSelector: ".faq-item", headingSelector: "summary", linkSelector: null }
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
            index.push({
              title: heading.textContent.trim(),
              description: desc ? desc.textContent.trim() : "",
              category: page.category,
              url: anchorId ? `${page.url}#${anchorId}` : page.url,
              externalUrl: link ? link.getAttribute("href") : null
            });
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

    // Recherche lancée depuis l'accueil (formulaire GET ou raccourcis) :
    // recherche.html?q=... pré-remplit le champ. Affecté via .value, jamais
    // injecté en HTML.
    const initialQuery = new URLSearchParams(window.location.search).get("q");
    if (initialQuery) input.value = initialQuery.slice(0, 80);

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
        const targetUrl = item.externalUrl || item.url;
        card.href = targetUrl;
        if (item.externalUrl) {
          card.target = "_blank";
          card.rel = "noopener";
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
        chip.textContent = meta.icon ? `${meta.icon} ${label}` : label;
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

  // ---- Page d'accueil : métier qui tourne dans le titre, chiffres calculés
  // depuis data.js (jamais figés dans le HTML) et mini-interfaces des 6
  // étapes, construites à partir des vraies données du site. ----
  // Libellés limités à 18 caractères : au-delà, le titre passe sur deux
  // lignes sur mobile (voir .home-title dans style.css).
  const HOME_ROLES = [
    { id: "web-dev", fr: "développeur·se web", en: "a web developer" },
    { id: "data-analyst", fr: "data analyst", en: "a data analyst" },
    { id: "cyber", fr: "expert·e cyber", en: "a cyber expert" },
    { id: "ux-ui", fr: "designer UX/UI", en: "a UX/UI designer" },
    { id: "devops", fr: "ingénieur·e DevOps", en: "a DevOps engineer" },
    { id: "data-ia", fr: "spécialiste IA", en: "an AI specialist" },
  ];
  // Noms repris des pages Stages & emploi et Écosystème.
  const HOME_JOB_SITES = ["Emploi.tg", "Novojob (Togo)", "JobRelais", "ANPE"];
  const HOME_COMMUNITIES = ["GDG Lomé", "TDEV", "CoTIA", "Women Techmakers", "Djanta Tech Hub", "UniPod"];
  const ARROW_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="8 7 17 7 17 16"></polyline></svg>';

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function schoolShortName(name) {
    const m = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    if (!m) return name;
    return m[2].length <= 14 ? m[2] : m[1];
  }

  const HOME_MOCKS = {
    quiz(isEn) {
      if (typeof QUIZ_QUESTIONS === "undefined" || !QUIZ_QUESTIONS.length) return "";
      const q = QUIZ_QUESTIONS[0];
      const options = q.options.slice(0, 3).map((o, i) =>
        `<li class="mock-item${i === 0 ? " is-selected" : ""}"><span class="mock-radio"></span>${esc(isEn && o.labelEn ? o.labelEn : o.label)}</li>`
      ).join("");
      return `<div class="mock-card">
        <div class="mock-row mock-muted"><span>${isEn ? "Question 1 of 14" : "Question 1 / 14"}</span><span>${isEn ? "Orientation test" : "Test d'orientation"}</span></div>
        <div class="mock-bar"><span style="width:7%"></span></div>
        <p class="mock-question">${esc(isEn && q.questionEn ? q.questionEn : q.question)}</p>
        <ul class="mock-list">${options}</ul>
      </div>`;
    },
    roadmap(isEn) {
      const rm = typeof ROLES !== "undefined" ? ROLES["web-dev"] : null;
      if (!rm) return "";
      const total = rm.sections.reduce((n, s) => n + s.items.length, 0);
      const done = 2;
      const first = rm.sections[0];
      const checks = first.items.slice(0, 4).map((it, i) =>
        `<li class="mock-check${i < done ? " is-done" : ""}"><span class="mock-box"></span><span class="mock-ellipsis">${esc(tField(it, "label"))}</span></li>`
      ).join("");
      return `<div class="mock-card">
        <div class="mock-row"><strong class="mock-title">${esc(tField(rm, "title"))}</strong><span class="mock-badge">${isEn ? "Role roadmap" : "Roadmap par métier"}</span></div>
        <div class="mock-bar"><span style="width:${Math.max(4, Math.round((done / total) * 100))}%"></span></div>
        <p class="mock-muted">${isEn ? `${done} / ${total} steps completed` : `${done} / ${total} étapes complétées`}</p>
        <p class="mock-section">${esc(tField(first, "title"))}</p>
        <ul class="mock-list">${checks}</ul>
      </div>`;
    },
    ecoles(isEn) {
      if (typeof SCHOOLS === "undefined") return "";
      const statut = { public: isEn ? "Public" : "Publique", prive: isEn ? "Private" : "Privée", "inter-etats": isEn ? "Inter-State" : "Inter-États" };
      const rows = ["iai-togo", "esig", "universite-kara"].filter((id) => SCHOOLS[id]).map((id) => {
        const s = SCHOOLS[id];
        const chips = [statut[s.statut] || s.statut, (s.ville || []).join(" · ")];
        if (s.agree) chips.push(isEn ? "State-accredited" : "Agréé État");
        const n = (s.filieres || []).length;
        return `<li class="mock-item mock-school"><div><strong>${esc(schoolShortName(s.name))}</strong><span class="mock-chips">${chips.map((c) => `<span class="mock-chip">${esc(c)}</span>`).join("")}</span></div><span class="mock-count">${n} ${isEn ? (n > 1 ? "tracks" : "track") : (n > 1 ? "filières" : "filière")}</span></li>`;
      }).join("");
      return `<div class="mock-card">
        <div class="mock-row mock-muted"><span>${isEn ? "School comparison" : "Comparateur d'écoles"}</span><span>${Object.keys(SCHOOLS).length} ${isEn ? "schools" : "écoles"}</span></div>
        <ul class="mock-list" style="margin-top:14px">${rows}</ul>
      </div>`;
    },
    calendrier(isEn) {
      if (typeof ACADEMIC_TIMELINE === "undefined") return "";
      const rows = ACADEMIC_TIMELINE.slice(0, 4).map((s) =>
        `<li class="mock-date"><span class="mock-period">${esc(isEn ? s.periodeEn : s.periode)}</span><span class="mock-date-title">${esc(isEn ? s.titreEn : s.titre)}</span></li>`
      ).join("");
      return `<div class="mock-card">
        <div class="mock-row mock-muted" style="margin-bottom:16px"><span>${isEn ? "Key dates" : "Dates clés"}</span><span>${isEn ? "Academic year" : "Année académique"}</span></div>
        <ul class="mock-list mock-timeline">${rows}</ul>
      </div>`;
    },
    stages(isEn) {
      const rows = HOME_JOB_SITES.map((name) =>
        `<li class="mock-item mock-link"><span class="mock-favicon">${esc(name.charAt(0))}</span><strong>${esc(name)}</strong>${ARROW_SVG}</li>`
      ).join("");
      return `<div class="mock-card">
        <div class="mock-row mock-muted" style="margin-bottom:14px"><span>${isEn ? "Job platforms in Togo" : "Plateformes d'emploi au Togo"}</span></div>
        <ul class="mock-list">${rows}</ul>
      </div>`;
    },
    ecosysteme(isEn) {
      return `<div class="mock-card">
        <div class="mock-row mock-muted"><span>${isEn ? "Communities &amp; hubs" : "Communautés &amp; hubs"}</span><span>Togo</span></div>
        <div class="mock-cloud">${HOME_COMMUNITIES.map((c) => `<span class="mock-pill">${esc(c)}</span>`).join("")}</div>
      </div>`;
    },
  };

  function initHome() {
    const hero = document.getElementById("home-hero");
    if (!hero) return;

    document.querySelectorAll("[data-stat]").forEach((el) => {
      if (el.dataset.stat === "roadmaps" && typeof ROLES !== "undefined" && typeof SKILLS !== "undefined") {
        el.textContent = Object.keys(ROLES).length + Object.keys(SKILLS).length;
      } else if (el.dataset.stat === "ecoles" && typeof SCHOOLS !== "undefined") {
        el.textContent = Object.keys(SCHOOLS).length;
      }
    });

    const input = document.getElementById("home-search-input");
    const submit = document.getElementById("home-search-btn");
    const word = document.getElementById("home-rotator-word");
    const pauseBtn = document.getElementById("home-rotator-pause");
    const roles = HOME_ROLES.filter((r) => typeof ROLES === "undefined" || ROLES[r.id]);
    let current = 0;
    let paused = false;
    let held = false;

    const roleLabel = () => (roles.length ? (currentLang() === "en" ? roles[current].en : roles[current].fr) : "");

    function updatePauseLabel() {
      if (!pauseBtn) return;
      const isEn = currentLang() === "en";
      pauseBtn.setAttribute("aria-label", paused
        ? (isEn ? "Resume the animation" : "Relancer l'animation")
        : (isEn ? "Pause the animation" : "Mettre l'animation en pause"));
    }

    function render() {
      const isEn = currentLang() === "en";
      if (input) input.placeholder = isEn ? "Search for a school, a career, a scholarship…" : "Cherche une école, un métier, une bourse…";
      if (submit) submit.setAttribute("aria-label", isEn ? "Search" : "Rechercher");
      if (word) word.textContent = roleLabel();
      updatePauseLabel();
      document.querySelectorAll(".home-visual[data-mock]").forEach((el) => {
        const build = HOME_MOCKS[el.dataset.mock];
        el.innerHTML = build ? build(isEn) : "";
      });
    }

    render();
    // i18n.js change l'attribut lang de <html> à chaque bascule FR/EN.
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!word || roles.length < 2 || reduceMotion) return;

    if (pauseBtn) {
      pauseBtn.hidden = false;
      pauseBtn.addEventListener("click", () => {
        paused = !paused;
        pauseBtn.setAttribute("aria-pressed", String(paused));
        pauseBtn.classList.toggle("is-paused", paused);
        updatePauseLabel();
      });
    }
    hero.addEventListener("mouseenter", () => { held = true; });
    hero.addEventListener("mouseleave", () => { held = false; });
    hero.addEventListener("focusin", (e) => { if (e.target !== pauseBtn) held = true; });
    hero.addEventListener("focusout", () => { held = false; });

    setInterval(() => {
      if (paused || held || document.hidden) return;
      word.classList.add("is-leaving");
      setTimeout(() => {
        current = (current + 1) % roles.length;
        word.textContent = roleLabel();
        word.classList.remove("is-leaving");
        word.classList.add("is-entering");
        void word.offsetWidth;
        word.classList.remove("is-entering");
      }, 320);
    }, 2800);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHome();
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

  // Exposé pour js/assistant.js : réutilise la même normalisation et le même
  // index de recherche que la page Recherche, pas de logique dupliquée.
  window.WIYAO_SEARCH = { buildGlobalIndex, normalize, currentLang };
})();
