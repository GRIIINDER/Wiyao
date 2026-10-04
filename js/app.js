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

  // Couleur de couverture des cartes roadmap et des onglets de l'accueil,
  // une par domaine (voir .card-cover--* dans style.css).
  const DOMAIN_SLUGS = {
    "Développement": "dev",
    "Data & IA": "data",
    "Sécurité": "secu",
    "Produit & Design": "design",
    "Infrastructure & DevOps": "infra",
    "Marketing digital": "marketing",
    "Gestion & Management": "gestion",
  };

  function domainSlug(name) {
    return DOMAIN_SLUGS[name] || "autre";
  }

  function domainLabel(name) {
    const meta = typeof DOMAINS !== "undefined" ? DOMAINS[name] : null;
    return meta && currentLang() === "en" && meta.nameEn ? meta.nameEn : name;
  }

  function buildCard(id, rm, kind) {
    const total = countItems(rm);
    const done = getDoneCount(id);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const en = currentLang() === "en";

    const card = document.createElement("a");
    card.href = `roadmap.html?id=${id}`;
    card.className = "card roadmap-card";
    card.dataset.title = rm.title.toLowerCase();
    if (rm.domain) card.dataset.domain = rm.domain;
    const badges = badgesHtml(rm);
    const kindLabel = kind === "skill" ? (en ? "Skill roadmap" : "Roadmap · compétence") : (en ? "Role roadmap" : "Roadmap · métier");
    card.innerHTML = `
      <div class="card-cover card-cover--${domainSlug(rm.domain)}">
        <span class="card-cover-kind">${kindLabel}</span>
        <span class="card-icon" aria-hidden="true">${rm.icon}</span>
      </div>
      <div class="card-body">
        ${badges ? `<div class="card-badges">${badges}</div>` : ""}
        <h3>${tField(rm, "title")}</h3>
        <p>${tField(rm, "subtitle")}</p>
        <div class="card-meta-row"><span>${total} ${en ? "steps" : "étapes"}</span><span>${rm.domain ? domainLabel(rm.domain) : ""}</span></div>
        <div class="card-meta-divider"></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="progress-label">${pct}% ${en ? "completed" : "complété"}</span>
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

      // roadmaps.html?domaine=... (onglets de l'accueil) : préselectionne le
      // filtre correspondant, uniquement s'il existe parmi les puces.
      const wanted = new URLSearchParams(window.location.search).get("domaine");
      const chip = wanted && Array.prototype.find.call(domainFilters.querySelectorAll(".domain-chip"), (b) => b.dataset.domain === wanted);
      if (chip) {
        domainFilters.querySelectorAll(".domain-chip").forEach((b) => b.classList.remove("active"));
        chip.classList.add("active");
        applyFilters();
      }
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
    card.dataset.id = id;
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

    // Carte plus lisible (façon cartes d'espaces Gozem) : une ligne de
    // repères, une pastille frais, 3 filières, et le reste dépliable.
    const isEn = currentLang() === "en";
    const nNiv = school.niveaux.length;
    const nFil = school.filieres.length;
    const feesHidden = FEES_UNPUBLISHED.test(school.frais || "");
    const facts = document.createElement("div");
    facts.className = "school-facts";
    facts.innerHTML =
      `<span>${nNiv} ${isEn ? (nNiv > 1 ? "levels" : "level") : (nNiv > 1 ? "niveaux" : "niveau")} · ${nFil} ${isEn ? (nFil > 1 ? "programs" : "program") : (nFil > 1 ? "filières" : "filière")}</span>` +
      `<span class="fee-pill ${feesHidden ? "fee-pill--hidden" : "fee-pill--shown"}">${feesHidden ? (isEn ? "Fees not disclosed" : "Frais non communiqués") : (isEn ? "Fees shown" : "Frais indiqués")}</span>`;
    body.appendChild(facts);

    const SHOWN = 3;
    const filieres = document.createElement("ul");
    filieres.className = "school-filieres";
    filieres.innerHTML = school.filieres.slice(0, SHOWN).map((f) => `<li>${f}</li>`).join("") +
      (nFil > SHOWN ? `<li class="school-filieres-more">+${nFil - SHOWN} ${isEn ? "more" : (nFil - SHOWN > 1 ? "autres" : "autre")}</li>` : "");
    body.appendChild(filieres);

    const details = document.createElement("details");
    details.className = "school-details";
    let metaHtml = "";
    if (nFil > SHOWN) metaHtml += `<span><strong>${isEn ? "All programs" : "Toutes les filières"} :</strong> ${school.filieres.join(" · ")}</span>`;
    metaHtml += `<span><strong>Niveaux :</strong> ${school.niveaux.join(", ")}</span>`;
    if (school.duree) metaHtml += `<span><strong>Durée :</strong> ${school.duree}</span>`;
    if (school.admission) metaHtml += `<span><strong>Admission :</strong> ${school.admission}</span>`;
    if (school.frais) metaHtml += `<span><strong>Frais :</strong> ${school.frais}</span>`;
    if (school.agreeNote) metaHtml += `<span>ℹ️ ${school.agreeNote}</span>`;
    details.innerHTML = `<summary>${isEn ? "See details" : "Voir le détail"} <span class="school-details-hint">${isEn ? "admission, fees, duration" : "admission, frais, durée"}</span></summary><div class="school-meta">${metaHtml}</div>`;
    body.appendChild(details);

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

    // ecoles.html?ville=... (carte des villes de l'accueil) : préselectionne
    // la ville, uniquement si elle existe parmi les puces.
    const villeGroup = document.getElementById("ville-filters");
    const wantedVille = new URLSearchParams(window.location.search).get("ville");
    const villeChip = wantedVille && villeGroup && Array.prototype.find.call(villeGroup.querySelectorAll(".domain-chip"), (b) => b.dataset.ville === wantedVille);
    if (villeChip) {
      villeGroup.querySelectorAll(".domain-chip").forEach((b) => b.classList.remove("active"));
      villeChip.classList.add("active");
      applySchoolFilters();
    }
  }

  // Frais explicitement marqués « non communiqués » dans data.js (jamais
  // devinés) : sert au décompte du bandeau "Le comparateur en chiffres".
  const FEES_UNPUBLISHED = /^\s*(scolarité\s+)?non communiqu/i;

  const STATUT_LABELS_EN = { "public": "Public", "prive": "Private", "inter-etats": "Inter-State" };

  // "Le comparateur en chiffres" (façon La Ruche Health) : tout est calculé
  // à partir de SCHOOLS, rien n'est saisi à la main.
  function renderSchoolStats() {
    const el = document.getElementById("school-stats-grid");
    if (!el || typeof SCHOOLS === "undefined") return;
    const isEn = currentLang() === "en";
    const schools = Object.values(SCHOOLS);
    const n = schools.length;
    const villes = {};
    const statuts = { prive: 0, public: 0, "inter-etats": 0 };
    schools.forEach((s) => {
      s.ville.forEach((v) => { villes[v] = (villes[v] || 0) + 1; });
      statuts[s.statut] = (statuts[s.statut] || 0) + 1;
    });
    const nVilles = Object.keys(villes).length;
    const lome = villes["Lomé"] || 0;
    const agree = schools.filter((s) => s.agree === true).length;
    const unpublished = schools.filter((s) => FEES_UNPUBLISHED.test(s.frais || "")).length;
    const label = (k) => (isEn ? STATUT_LABELS_EN[k] : STATUT_LABELS[k]);
    const bar = ["prive", "public", "inter-etats"].filter((k) => statuts[k]).map((k) =>
      `<span class="school-stat-seg school-stat-seg--${k}" style="width:${((statuts[k] / n) * 100).toFixed(2)}%"></span>`
    ).join("");
    const legend = ["prive", "public", "inter-etats"].filter((k) => statuts[k]).map((k) =>
      `<li><span class="school-stat-dot school-stat-seg--${k}"></span>${statuts[k]} ${esc(label(k).toLowerCase())}${isEn ? "" : (statuts[k] > 1 && k !== "inter-etats" ? "s" : "")}</li>`
    ).join("");
    el.innerHTML = `
      <div class="school-stat">
        <span class="school-stat-num">${n}</span>
        <span class="school-stat-label">${isEn ? `schools and universities in ${nVilles} cities, ${lome} of them in Lomé` : `écoles et universités dans ${nVilles} villes, dont ${lome} à Lomé`}</span>
      </div>
      <div class="school-stat">
        <span class="school-stat-num">${statuts.prive}<small>/${n}</small></span>
        <span class="school-stat-label">${isEn ? "are private" : "sont privées"}</span>
        <span class="school-stat-bar" aria-hidden="true">${bar}</span>
        <ul class="school-stat-legend">${legend}</ul>
      </div>
      <div class="school-stat">
        <span class="school-stat-num">${agree}<small>/${n}</small></span>
        <span class="school-stat-label">${isEn ? "are on the Ministry's official list of accredited institutions (2026-2027)" : "figurent sur la liste officielle des établissements agréés par le Ministère (2026-2027)"}</span>
      </div>
      <div class="school-stat">
        <span class="school-stat-num">${unpublished}<small>/${n}</small></span>
        <span class="school-stat-label">${isEn ? "don't publish their tuition fees: ask them directly" : "ne publient pas leurs frais de scolarité : demande-les directement"}</span>
      </div>`;
  }

  // "Comparer côte à côte" (façon Craydel) : jusqu'à 3 écoles, sélection
  // gardée dans l'adresse (?comparer=iai-togo,esig) pour pouvoir partager le
  // lien, sans rien enregistrer dans le navigateur.
  const COMPARE_MAX = 3;

  function initSchoolCompare() {
    const grid = document.getElementById("school-grid");
    const section = document.getElementById("comparatif");
    const tableWrap = document.getElementById("school-compare-table");
    const bar = document.getElementById("compare-bar");
    if (!grid || !section || !tableWrap || !bar || typeof SCHOOLS === "undefined") return;

    const wanted = (new URLSearchParams(window.location.search).get("comparer") || "").split(",");
    let selected = wanted.filter((id, i) => SCHOOLS[id] && wanted.indexOf(id) === i).slice(0, COMPARE_MAX);
    let open = selected.length >= 2;

    function syncUrl() {
      const params = new URLSearchParams(window.location.search);
      params.delete("comparer");
      let qs = params.toString();
      if (selected.length) qs = (qs ? qs + "&" : "") + "comparer=" + selected.join(",");
      window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "") + window.location.hash);
    }

    function datesText(s, isEn) {
      const dc = s.datesCles;
      if (!dc) return isEn ? "Dates not published online" : "Dates non publiées en ligne";
      const fields = [
        [isEn ? "Applications open" : "Ouverture des candidatures", dc.ouverture],
        [isEn ? "Deadline" : "Clôture", dc.cloture],
        [isEn ? "Entrance exam" : "Concours", dc.concours],
        [isEn ? "Results" : "Résultats", dc.resultats],
        [isEn ? "Start of term" : "Rentrée", dc.rentree],
      ].filter(([, v]) => !!v);
      const lines = fields.length
        ? `<ul class="cmp-list">${fields.map(([l, v]) => `<li><strong>${esc(l)} :</strong> ${esc(v)}</li>`).join("")}</ul>`
        : (dc.note ? `<p>${esc(dc.note)}</p>` : "");
      const ref = dc.anneeReference
        ? `<p class="cmp-muted">${isEn ? `Reference: ${dc.anneeReference}` : `Repère : ${dc.anneeReference}`}${dc.aVerifier ? (isEn ? " : reconfirm with the school" : " : à reconfirmer auprès de l'école") : ""}</p>`
        : "";
      return lines + ref;
    }

    function agreeText(s, isEn) {
      if (s.agree === true) return `🏛️ ${isEn ? "State-accredited (2026-2027 list)" : "Agréé État (liste 2026-2027)"}`;
      if (s.statut === "public" && s.agree == null) return isEn ? "Public university" : "Université publique";
      return esc(s.agreeNote || (isEn ? "Not on the official list" : "Absent de la liste officielle"));
    }

    function renderTable(isEn) {
      const cols = selected.map((id) => [id, SCHOOLS[id]]);
      const statut = (k) => (isEn ? STATUT_LABELS_EN[k] : STATUT_LABELS[k]) || k;
      const rows = [
        [isEn ? "City" : "Ville", (s) => esc(s.ville.join(", "))],
        [isEn ? "Status" : "Statut", (s) => esc(statut(s.statut))],
        [isEn ? "State accreditation" : "Agrément de l'État", (s) => agreeText(s, isEn)],
        [isEn ? "Levels" : "Niveaux", (s) => esc(s.niveaux.join(", "))],
        [isEn ? "Programs" : "Filières", (s) => `<ul class="cmp-list">${s.filieres.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`],
        [isEn ? "Duration" : "Durée", (s) => esc(s.duree || "—")],
        [isEn ? "Admission" : "Admission", (s) => esc(s.admission || "—")],
        [isEn ? "Tuition fees" : "Frais de scolarité", (s) => esc(s.frais || "—")],
        [isEn ? "Key dates" : "Dates clés", (s) => datesText(s, isEn)],
        [isEn ? "Official site" : "Site officiel", (s) => (s.site ? `<a class="school-link" href="${esc(s.site)}" target="_blank" rel="noopener">${isEn ? "Visit →" : "Visiter →"}</a>` : "—")],
      ];
      tableWrap.innerHTML = `
        <table class="school-compare-table">
          <caption class="sr-only">${isEn ? "Side-by-side comparison of the selected schools" : "Comparaison côte à côte des écoles sélectionnées"}</caption>
          <thead><tr>
            <td></td>
            ${cols.map(([id, s]) => `<th scope="col"><span class="cmp-school">${esc(s.name)}</span><button type="button" class="cmp-remove" data-id="${esc(id)}" aria-label="${isEn ? `Remove ${esc(s.name)} from the comparison` : `Retirer ${esc(s.name)} du comparatif`}">×</button></th>`).join("")}
          </tr></thead>
          <tbody>
            ${rows.map(([label, fn]) => `<tr><th scope="row">${esc(label)}</th>${cols.map(([, s]) => `<td>${fn(s)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>`;
    }

    function render() {
      const isEn = currentLang() === "en";
      const full = selected.length >= COMPARE_MAX;
      grid.querySelectorAll(".school-compare-btn").forEach((btn) => {
        const on = selected.indexOf(btn.dataset.id) !== -1;
        btn.setAttribute("aria-pressed", String(on));
        btn.disabled = !on && full;
        btn.textContent = on ? (isEn ? "✓ Selected" : "✓ Sélectionnée") : (isEn ? "+ Compare" : "+ Comparer");
        btn.title = !on && full ? (isEn ? "3 schools maximum" : "3 écoles maximum") : "";
      });

      bar.hidden = selected.length === 0;
      bar.setAttribute("aria-label", isEn ? "Schools selected for comparison" : "Écoles sélectionnées pour la comparaison");
      document.body.classList.toggle("has-compare-bar", selected.length > 0);
      bar.innerHTML = `
        <p class="compare-bar-label">${isEn ? "Your selection" : "Ta sélection"} <span>${selected.length}/${COMPARE_MAX}</span></p>
        <ul class="compare-bar-chips">${selected.map((id) => `<li>${esc(schoolShortName(SCHOOLS[id].name))}<button type="button" class="cmp-remove" data-id="${esc(id)}" aria-label="${isEn ? `Remove ${esc(SCHOOLS[id].name)}` : `Retirer ${esc(SCHOOLS[id].name)}`}">×</button></li>`).join("")}</ul>
        <div class="compare-bar-actions">
          <button type="button" class="compare-bar-clear" data-action="clear">${isEn ? "Clear" : "Vider"}</button>
          <button type="button" class="btn-primary compare-bar-go" data-action="compare"${selected.length < 2 ? " disabled" : ""}>${selected.length < 2 ? (isEn ? "Pick at least 2" : "Choisis-en au moins 2") : (isEn ? "Compare →" : "Comparer →")}</button>
        </div>`;

      const showTable = open && selected.length >= 2;
      section.hidden = !showTable;
      if (showTable) renderTable(isEn);

      const share = document.getElementById("school-compare-share");
      const close = document.getElementById("school-compare-close");
      const wa = document.getElementById("school-compare-whatsapp");
      if (share) share.textContent = isEn ? "Share" : "Partager";
      if (close) close.textContent = isEn ? "Close" : "Fermer";
      if (wa) {
        const text = (isEn ? "School comparison on WIYAO: " : "Comparatif d'écoles sur WIYAO : ") + window.location.href;
        wa.href = "https://wa.me/?text=" + encodeURIComponent(text);
      }
    }

    function update() {
      syncUrl();
      render();
    }

    function remove(id) {
      selected = selected.filter((x) => x !== id);
      if (selected.length < 2) open = false;
      update();
    }

    grid.querySelectorAll(".school-card").forEach((card) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "school-compare-btn";
      btn.dataset.id = card.dataset.id;
      card.querySelector(".card-body").appendChild(btn);
    });

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".school-compare-btn");
      if (!btn) return;
      const id = btn.dataset.id;
      if (selected.indexOf(id) !== -1) remove(id);
      else if (selected.length < COMPARE_MAX) {
        selected.push(id);
        update();
      }
    });

    function goToTable() {
      open = true;
      update();
      const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      const heading = document.getElementById("school-compare-title");
      if (heading) heading.focus({ preventScroll: true });
    }

    bar.addEventListener("click", (e) => {
      const rm = e.target.closest(".cmp-remove");
      if (rm) return remove(rm.dataset.id);
      const action = e.target.closest("[data-action]");
      if (!action) return;
      if (action.dataset.action === "clear") {
        selected = [];
        open = false;
        update();
      } else if (action.dataset.action === "compare" && selected.length >= 2) {
        goToTable();
      }
    });

    section.addEventListener("click", async (e) => {
      const rm = e.target.closest(".cmp-remove");
      if (rm) return remove(rm.dataset.id);
      if (e.target.closest("#school-compare-close")) {
        open = false;
        update();
        const go = bar.querySelector(".compare-bar-go");
        if (go) go.focus();
        return;
      }
      const shareBtn = e.target.closest("#school-compare-share");
      if (!shareBtn) return;
      const isEn = currentLang() === "en";
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({ title: isEn ? "School comparison - WIYAO" : "Comparatif d'écoles - WIYAO", url });
          return;
        } catch (err) {
          if (err && err.name === "AbortError") return;
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        shareBtn.textContent = isEn ? "Link copied ✓" : "Lien copié ✓";
        setTimeout(render, 2000);
      } catch (err) {
        const field = document.getElementById("school-compare-link");
        if (field) {
          field.hidden = false;
          field.value = url;
          field.select();
        }
      }
    });

    // Nettoie aussi l'adresse d'un lien partagé (doublons, identifiants inconnus).
    update();
    new MutationObserver(() => { render(); renderSchoolStats(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
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

    // ?type=Établissement (lien "Signaler une mise à jour" de l'accueil) :
    // présélectionne le type, seulement s'il existe dans la liste.
    const wantedType = new URLSearchParams(window.location.search).get("type");
    const typeSelect = form.elements["type"];
    if (wantedType && typeSelect && [...typeSelect.options].some((o) => o.value === wantedType)) {
      typeSelect.value = wantedType;
    }

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

  // ---- Calendrier : « À venir dans l'écosystème » (façon Tikattou) ----
  // Les événements datés et à venir de actualites.html (data-start), en
  // affiches, avec le même bouton agenda que la page Actualités
  // (window.WIYAO_AGENDA, défini par js/actualites.js).
  const PIN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>';

  // Événements datés et à venir des cartes de actualites.html, traduits,
  // triés par date de début. Partagé par le Calendrier et l'accueil.
  function collectUpcoming(cards) {
    const agenda = window.WIYAO_AGENDA;
    if (!agenda) return [];
    const base = new URL("actualites.html", window.location.href).href;
    const tr = (key, fallback) => {
      const v = window.WIYAO_I18N && key ? window.WIYAO_I18N.t(key, currentLang()) : null;
      return plainText(v == null ? fallback : v);
    };
    return cards.map((card) => {
      const h3 = card.querySelector(".actu-card-title");
      const key = h3 && h3.dataset.i18nKey ? h3.dataset.i18nKey.replace(/\.h3$/, "") : "";
      const descEl = card.querySelector(".actu-card-desc");
      const catEl = card.querySelector('.actu-meta-value[data-i18n-key$=".cat"]');
      const catFr = catEl ? catEl.textContent.trim() : "";
      const ev = agenda.eventOf(card, {
        base,
        title: tr(key && key + ".h3", h3 ? h3.textContent : ""),
        desc: tr(key && key + ".p", descEl ? descEl.textContent : ""),
      });
      return ev && { ev, id: card.id, catFr, cat: tr(key && key + ".cat", catFr) };
    }).filter(Boolean).sort((a, b) => (a.ev.dtStart < b.ev.dtStart ? -1 : a.ev.dtStart > b.ev.dtStart ? 1 : 0));
  }

  // Cartes datées de actualites.html (requête partagée avec nav.js).
  function loadDatedActus() {
    return actualitesHtml()
      .then((html) => [...new DOMParser().parseFromString(html, "text/html").querySelectorAll("article.actu-card[data-start]")]);
  }

  // « 24 », « 5–8 » ou « 30 » (événement sur deux mois) + mois abrégé.
  function eventDay(ev, isEn) {
    const s = ev.start;
    const e = ev.end;
    const sameDay = s.y === e.y && s.mo === e.mo && s.d === e.d;
    const sameMonth = s.y === e.y && s.mo === e.mo;
    const month = new Intl.DateTimeFormat(isEn ? "en-GB" : "fr-FR", { timeZone: "UTC", month: "short" })
      .format(new Date(Date.UTC(s.y, s.mo - 1, s.d))).replace(".", "");
    return { day: sameDay || !sameMonth ? String(s.d) : `${s.d}–${e.d}`, month, sameDay, sameMonth };
  }

  function initUpcomingEvents() {
    const section = document.getElementById("a-venir");
    const row = document.getElementById("upcoming-row");
    if (!section || !row || !window.DOMParser || !window.WIYAO_AGENDA) return;
    const agenda = window.WIYAO_AGENDA;
    let cards = [];
    let events = [];

    const hm = (p, isEn) => (isEn ? `${p.h}:${String(p.mi).padStart(2, "0")}` : `${p.h}h${p.mi ? String(p.mi).padStart(2, "0") : ""}`);

    function render() {
      const isEn = currentLang() === "en";
      events = collectUpcoming(cards);

      section.hidden = events.length === 0;
      if (!events.length) return;
      const locale = isEn ? "en-GB" : "fr-FR";
      const fmt = (p, opt) => new Intl.DateTimeFormat(locale, Object.assign({ timeZone: "UTC" }, opt)).format(new Date(Date.UTC(p.y, p.mo - 1, p.d)));
      row.innerHTML = events.map(({ ev, id, cat, catFr }) => {
        const [tone] = NEWS_TONES[catFr] || ["1"];
        const s = ev.start;
        const e = ev.end;
        const sameDay = s.y === e.y && s.mo === e.mo && s.d === e.d;
        const sameMonth = s.y === e.y && s.mo === e.mo;
        const day = sameDay || !sameMonth ? String(s.d) : `${s.d}–${e.d}`;
        let when = sameDay
          ? fmt(s, { weekday: "long" })
          : sameMonth
            ? `${fmt(s, { weekday: "long" })} → ${fmt(e, { weekday: "long" })}`
            : `${isEn ? "until" : "jusqu'au"} ${fmt(e, { day: "numeric", month: "long" })}`;
        if (!ev.allDay) when += ` · ${hm(s, isEn)}–${hm(e, isEn)}`;
        return `
          <article class="poster">
            <div class="poster-top home-news-tone-${tone}">
              <span class="poster-month">${esc(fmt(s, { month: "short" }).replace(".", ""))}</span>
              <span class="poster-day">${esc(day)}</span>
              <span class="poster-when">${esc(when)}</span>
            </div>
            <div class="poster-body">
              <span class="poster-cat">${esc(cat)}</span>
              <h3 class="poster-title"><a href="actualites.html#${encodeURIComponent(id)}">${esc(ev.title)}</a></h3>
              ${ev.lieu ? `<p class="poster-place">${PIN_SVG}<span>${esc(ev.lieu)}</span></p>` : ""}
              <div class="poster-actions">
                <button type="button" class="poster-ics" data-id="${esc(id)}">📅 ${isEn ? "Add to calendar" : "Ajouter à l'agenda"}</button>
                <a class="poster-google" href="${esc(agenda.googleUrl(ev))}" target="_blank" rel="noopener">Google ↗</a>
              </div>
            </div>
          </article>`;
      }).join("");
    }

    row.addEventListener("click", (e) => {
      const btn = e.target.closest(".poster-ics");
      if (!btn) return;
      const found = events.find((x) => x.id === btn.dataset.id);
      if (found) agenda.download(found.ev);
    });

    loadDatedActus()
      .then((list) => {
        cards = list;
        render();
      })
      .catch(() => { section.hidden = true; });

    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  // ---- Accueil : prochains événements (façon Sneakerness « Upcoming events ») ----
  // Tuiles colorées sous les actus, cliquables vers l'actu correspondante.
  function initHomeUpcoming() {
    const box = document.getElementById("home-upcoming");
    const row = document.getElementById("home-upcoming-row");
    if (!box || !row || !window.DOMParser || !window.WIYAO_AGENDA) return;
    let cards = [];

    function render() {
      const isEn = currentLang() === "en";
      const events = collectUpcoming(cards).slice(0, 4);
      box.hidden = events.length === 0;
      row.innerHTML = events.map(({ ev, id, catFr }) => {
        const [tone] = NEWS_TONES[catFr] || ["1"];
        const d = eventDay(ev, isEn);
        return `<a class="upcoming-tile home-news-tone-${tone}" href="actualites.html#${encodeURIComponent(id)}">
          <span class="upcoming-tile-date"><span class="upcoming-tile-day">${esc(d.day)}</span><span class="upcoming-tile-month">${esc(d.month)}</span></span>
          <span class="upcoming-tile-title">${esc(ev.title)}</span>
          ${ev.lieu ? `<span class="upcoming-tile-place">${PIN_SVG}${esc(ev.lieu)}</span>` : ""}
        </a>`;
      }).join("");
    }

    loadDatedActus()
      .then((list) => {
        cards = list;
        render();
      })
      .catch(() => { box.hidden = true; });

    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  // ---- Test d'orientation : « Comment se passe le test » (façon Superpower) ----
  // Les nombres de questions viennent de QUIZ_QUESTIONS / ROLE_QUESTIONS, les
  // éléments du résultat reprennent les titres de l'écran de résultat.
  function initQuizHowto() {
    const tabs = document.getElementById("quiz-howto-tabs");
    const panel = document.getElementById("quiz-howto-panel");
    if (!tabs || !panel || typeof QUIZ_QUESTIONS === "undefined") return;
    let active = 0;
    const PRACTICAL = { niveau: ["Niveau visé", "Target level"], ville: ["Ville", "City"], statut: ["Budget", "Budget"], priorite: ["Priorité", "Priority"] };

    function steps(isEn) {
      const domainQ = QUIZ_QUESTIONS.filter((q) => q.type === "domain").length;
      const practical = QUIZ_QUESTIONS.filter((q) => q.type !== "domain");
      const roleQ = typeof ROLE_QUESTIONS !== "undefined" ? Math.max(...Object.values(ROLE_QUESTIONS).map((l) => l.length)) : 0;
      const nRoles = typeof ROLES !== "undefined" ? Object.keys(ROLES).length : 0;
      const domains = typeof DOMAINS !== "undefined" ? Object.keys(DOMAINS).map(domainLabel) : [];
      const total = domainQ + roleQ + practical.length;
      const q = (n) => (isEn ? `${n} question${n > 1 ? "s" : ""}` : `${n} question${n > 1 ? "s" : ""}`);
      return [
        {
          icon: "compass", tab: isEn ? "What you enjoy" : "Ce que tu aimes", count: q(domainQ),
          title: isEn ? "What you enjoy doing" : "Ce que tu aimes faire",
          desc: isEn
            ? `${domainQ} questions about what you like doing. Your answers score the ${domains.length} major tech fields:`
            : `${domainQ} questions sur ce que tu aimes faire. Tes réponses départagent les ${domains.length} grands domaines de la tech :`,
          chips: domains,
        },
        {
          icon: "route", tab: isEn ? "The career" : "Le métier", count: q(roleQ),
          title: isEn ? "Narrowing down the career" : "Le métier, plus précisément",
          desc: isEn
            ? `Once your leading field is known, ${roleQ} questions specific to that field point you to a precise career among the ${nRoles} on WIYAO.`
            : `Une fois ton domaine dominant identifié, ${roleQ} questions propres à ce domaine t'orientent vers un métier précis parmi les ${nRoles} de WIYAO.`,
          chips: [],
        },
        {
          icon: "school", tab: isEn ? "Your situation" : "Ta situation", count: q(practical.length),
          title: isEn ? "Your practical situation" : "Ta situation concrète",
          desc: isEn
            ? `${practical.length} practical questions so the schools suggested to you match your situation:`
            : `${practical.length} questions pratiques pour que les écoles proposées collent à ta situation :`,
          chips: practical.map((x) => (PRACTICAL[x.type] || [x.type, x.type])[isEn ? 1 : 0]),
        },
        {
          icon: "cap", tab: isEn ? "Your result" : "Ton résultat", count: isEn ? `after ${total}` : `après ${total}`,
          title: isEn ? "Your result" : "Ton résultat",
          desc: isEn
            ? `After ${total} questions: a solid starting point, not a final verdict. Compare it with real stories and the roadmap before committing to a school.`
            : `Après ${total} questions : un point de départ solide, pas un verdict définitif. Confronte-le à des parcours réels et à la roadmap avant de t'engager dans une école.`,
          chips: isEn
            ? ["Your profile", "Recommended careers", "Recommended schools", "Breakdown of your answers"]
            : ["Ton profil", "Métiers recommandés", "Écoles recommandées", "Répartition de tes réponses"],
        },
      ];
    }

    function render(focus) {
      const isEn = currentLang() === "en";
      const list = steps(isEn);
      const num = (i) => String(i + 1).padStart(2, "0");
      tabs.setAttribute("aria-label", isEn ? "Steps of the test" : "Étapes du test");
      tabs.innerHTML = list.map((s, i) =>
        `<button type="button" role="tab" class="howto-tab" id="howto-tab-${i}" aria-controls="quiz-howto-panel" aria-selected="${i === active}" tabindex="${i === active ? 0 : -1}"><span class="howto-num">${num(i)}</span><span class="howto-tab-text">${esc(s.tab)}<small>${esc(s.count)}</small></span></button>`
      ).join("");
      const s = list[active];
      panel.setAttribute("aria-labelledby", `howto-tab-${active}`);
      panel.innerHTML = `
        <div class="howto-text">
          <h3 class="howto-title">${esc(s.title)}</h3>
          <p class="howto-desc">${esc(s.desc)}</p>
          ${s.chips.length ? `<ul class="howto-chips">${s.chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}
          <a class="howto-cta" href="#quiz-section">${isEn ? "Start the test ↓" : "Commencer le test ↓"}</a>
        </div>
        <div class="howto-visual" aria-hidden="true">
          <span class="howto-big">${num(active)}</span>
          <span class="howto-icon">${ICONS[s.icon]}</span>
        </div>`;
      if (focus) {
        const tab = document.getElementById(`howto-tab-${active}`);
        if (tab) tab.focus();
      }
    }

    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest('[role="tab"]');
      if (!btn) return;
      active = Number(btn.id.replace("howto-tab-", ""));
      render(true);
    });
    tabs.addEventListener("keydown", (e) => {
      const n = tabs.querySelectorAll('[role="tab"]').length;
      if (e.key === "ArrowRight") active = (active + 1) % n;
      else if (e.key === "ArrowLeft") active = (active - 1 + n) % n;
      else if (e.key === "Home") active = 0;
      else if (e.key === "End") active = n - 1;
      else return;
      e.preventDefault();
      render(true);
    });

    render(false);
    new MutationObserver(() => render(false)).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  // ---- Stages & emploi : le guide en explorateur (façon Tikattou) ----
  // Sur grand écran, conseils numérotés à droite et détail à gauche ; la
  // liste d'origine reste la version mobile et sans JavaScript. Contenu
  // relu depuis la liste (donc déjà traduit par i18n.js).
  function initGuideExplorer() {
    const guide = document.getElementById("guide");
    const list = guide && guide.querySelector(".journey-steps");
    if (!list) return;
    const box = document.createElement("div");
    box.className = "guide-explorer";
    list.insertAdjacentElement("afterend", box);
    guide.classList.add("has-explorer");
    let active = 0;

    function render(focus) {
      const isEn = currentLang() === "en";
      const steps = [...list.querySelectorAll(".journey-step")].map((li) => ({
        title: li.querySelector("h3") ? li.querySelector("h3").innerHTML : "",
        desc: li.querySelector("p") ? li.querySelector("p").innerHTML : "",
      }));
      if (!steps.length) return;
      const num = (i) => String(i + 1).padStart(2, "0");
      box.innerHTML = `
        <div class="guide-tabs" role="tablist" aria-orientation="vertical" aria-label="${isEn ? "Tips" : "Conseils"}">
          ${steps.map((s, i) => `<button type="button" role="tab" class="guide-tab" id="guide-tab-${i}" aria-controls="guide-panel" aria-selected="${i === active}" tabindex="${i === active ? 0 : -1}"><span class="guide-num">${num(i)}</span><span class="guide-tab-title">${s.title}</span><span class="guide-arrow" aria-hidden="true">→</span></button>`).join("")}
        </div>
        <div class="guide-panel" id="guide-panel" role="tabpanel" aria-labelledby="guide-tab-${active}" tabindex="0">
          <p class="guide-kicker">${isEn ? "Selected tip" : "Conseil sélectionné"}</p>
          <span class="guide-panel-num" aria-hidden="true">${num(active)}</span>
          <h3 class="guide-panel-title">${steps[active].title}</h3>
          <p class="guide-panel-desc">${steps[active].desc}</p>
        </div>`;
      if (focus) {
        const tab = document.getElementById(`guide-tab-${active}`);
        if (tab) tab.focus();
      }
    }

    box.addEventListener("click", (e) => {
      const btn = e.target.closest('[role="tab"]');
      if (!btn) return;
      active = Number(btn.id.replace("guide-tab-", ""));
      render(true);
    });
    box.addEventListener("keydown", (e) => {
      if (!e.target.closest('[role="tab"]')) return;
      const n = box.querySelectorAll('[role="tab"]').length;
      if (e.key === "ArrowDown") active = (active + 1) % n;
      else if (e.key === "ArrowUp") active = (active - 1 + n) % n;
      else if (e.key === "Home") active = 0;
      else if (e.key === "End") active = n - 1;
      else return;
      e.preventDefault();
      render(true);
    });

    render(false);
    new MutationObserver(() => render(false)).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  // ---- À propos : « Pour qui ? » par public (façon SPI-BCEAO) ----
  // Chaque public renvoie vers ce qui existe déjà sur le site, rien de plus.
  const ABOUT_AUDIENCES = [
    {
      icon: "cap",
      tab: { fr: "Bachelier·e", en: "High-school graduate" },
      lead: { fr: "Tu viens d'avoir ton bac, ou tu le passes cette année.", en: "You just passed your bac, or you're taking it this year." },
      items: [
        ["test-orientation.html", { fr: "Le test d'orientation pour trouver ton domaine et un métier précis", en: "The orientation test to find your field and a specific career" }],
        ["roadmaps.html", { fr: "La roadmap du métier : quoi apprendre, et dans quel ordre", en: "The career roadmap: what to learn, and in what order" }],
        ["ecoles.html", { fr: "Le comparateur d'écoles, avec les frais quand ils sont publiés", en: "The school comparison tool, with fees when they're published" }],
        ["calendrier.html", { fr: "Les dates de candidature à ne pas rater", en: "Application dates not to miss" }],
      ],
    },
    {
      icon: "compass",
      tab: { fr: "Parents", en: "Parents" },
      lead: { fr: "Tu veux être sûr·e que la tech est un vrai débouché pour ton enfant.", en: "You want to be sure tech is a real career path for your child." },
      items: [
        ["temoignages.html", { fr: "Des repères chiffrés et sourcés sur le secteur", en: "Sourced figures about the sector" }],
        ["temoignages.html#portraits", { fr: "Des parcours réels de professionnels togolais", en: "Real stories of Togolese professionals" }],
        ["ecoles.html", { fr: "Les écoles agréées par l'État, frais et admission comparés", en: "State-accredited schools, with fees and admission compared" }],
        ["bourses-financement.html", { fr: "Les bourses et solutions de financement vérifiées", en: "Verified scholarships and funding options" }],
      ],
    },
    {
      icon: "route",
      tab: { fr: "En reconversion", en: "Changing careers" },
      lead: { fr: "Tu es déjà étudiant·e ou en poste, et tu veux passer à la tech.", en: "You're already studying or working, and want to move into tech." },
      items: [
        ["roadmaps.html#par-competence", { fr: "Les roadmaps par compétence, pour monter en niveau", en: "Skill roadmaps, to level up" }],
        ["ecoles.html", { fr: "Des écoles avec cours du soir, du week-end ou des formats courts", en: "Schools with evening, weekend or short formats" }],
        ["ecosysteme.html?type=ressources", { fr: "Des ressources francophones gratuites en ligne", en: "Free French-language online resources" }],
        ["faq.html", { fr: "La FAQ : « je pense m'être trompé de filière »", en: "The FAQ: “I think I chose the wrong program”" }],
      ],
    },
    {
      icon: "school",
      tab: { fr: "Écoles", en: "Schools" },
      lead: { fr: "Tu représentes une école ou un centre de formation.", en: "You represent a school or a training center." },
      items: [
        ["ecoles.html", { fr: "Vérifie ta fiche : filières, frais, admission, dates", en: "Check your profile: programs, fees, admission, dates" }],
        ["proposer.html?type=%C3%89tablissement", { fr: "Signale une mise à jour avec un lien vers la source officielle", en: "Report an update with a link to the official source" }],
        ["#verif-title", { fr: "Comment chaque info est vérifiée avant publication", en: "How each piece of information is checked before publication" }],
        ["calendrier.html", { fr: "Les dates de ton concours dans le calendrier", en: "Your entrance exam dates in the calendar" }],
      ],
    },
  ];

  function initAudienceTabs() {
    const tabs = document.getElementById("audience-tabs");
    const panel = document.getElementById("audience-panel");
    if (!tabs || !panel) return;
    let active = 0;

    function render(focus) {
      const isEn = currentLang() === "en";
      const L = isEn ? "en" : "fr";
      tabs.setAttribute("aria-label", isEn ? "Audiences" : "Publics");
      tabs.innerHTML = ABOUT_AUDIENCES.map((a, i) =>
        `<button type="button" role="tab" class="audience-tab" id="audience-tab-${i}" aria-controls="audience-panel" aria-selected="${i === active}" tabindex="${i === active ? 0 : -1}">${esc(a.tab[L])}</button>`
      ).join("");
      const a = ABOUT_AUDIENCES[active];
      panel.setAttribute("aria-labelledby", `audience-tab-${active}`);
      panel.innerHTML = `
        <span class="audience-icon" aria-hidden="true">${ICONS[a.icon]}</span>
        <div class="audience-body">
          <p class="audience-who">${esc(a.lead[L])}</p>
          <ul class="audience-list">${a.items.map(([href, t]) => `<li><a href="${href}">${esc(t[L])}<span aria-hidden="true"> →</span></a></li>`).join("")}</ul>
        </div>`;
      if (focus) {
        const tab = document.getElementById(`audience-tab-${active}`);
        if (tab) tab.focus();
      }
    }

    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest('[role="tab"]');
      if (!btn) return;
      active = Number(btn.id.replace("audience-tab-", ""));
      render(true);
    });
    tabs.addEventListener("keydown", (e) => {
      const n = ABOUT_AUDIENCES.length;
      if (e.key === "ArrowRight") active = (active + 1) % n;
      else if (e.key === "ArrowLeft") active = (active - 1 + n) % n;
      else if (e.key === "Home") active = 0;
      else if (e.key === "End") active = n - 1;
      else return;
      e.preventDefault();
      render(true);
    });

    render(false);
    new MutationObserver(() => render(false)).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
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

  // Latitude / longitude des villes où le comparateur recense des écoles :
  // place les points du sud au nord sur l'accueil (aucune frontière tracée).
  const CITY_COORDS = {
    "Lomé": [6.13, 1.22],
    "Atakpamé": [7.53, 1.13],
    "Sokodé": [8.98, 1.13],
    "Bassar": [9.25, 0.78],
    "Kara": [9.55, 1.19],
  };

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

  const ICONS = {
    compass: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>',
    route: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path><circle cx="18" cy="5" r="3"></circle></svg>',
    school: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"></line><line x1="6" y1="18" x2="6" y2="11"></line><line x1="10" y1="18" x2="10" y2="11"></line><line x1="14" y1="18" x2="14" y2="11"></line><line x1="18" y1="18" x2="18" y2="11"></line><polygon points="12 2 20 7 4 7"></polygon></svg>',
    cap: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
    coins: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="9" cy="7" rx="6" ry="3"></ellipse><path d="M3 7v5c0 1.66 2.69 3 6 3s6-1.34 6-3V7"></path><path d="M9 18c0 1.66 2.69 3 6 3s6-1.34 6-3v-5c0-1.66-2.69-3-6-3"></path></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    briefcase: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
    rocket: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  };

  // "Je suis ici pour…" (façon Duplo) : chaque intention renvoie vers la page
  // qui y répond ; les descriptions reprennent ce que disent ces pages.
  const HOME_INTENTS = [
    {
      icon: "compass",
      label: { fr: "trouver ma voie dans la tech", en: "find my path in tech" },
      title: { fr: "Commence par le test d'orientation", en: "Start with the orientation test" },
      desc: {
        fr: "14 questions pour identifier le domaine tech, et le métier précis, qui te correspond. Le résultat te renvoie vers la roadmap de ce métier.",
        en: "14 questions to identify the tech field, and the specific career, that fits you. The result points you to that career's roadmap.",
      },
      href: "test-orientation.html",
      cta: { fr: "Faire le test →", en: "Take the test →" },
      more: [["temoignages.html", { fr: "Lire des parcours réels", en: "Read real stories" }], ["roadmaps.html", { fr: "Parcourir les métiers", en: "Browse careers" }]],
    },
    {
      icon: "route",
      label: { fr: "apprendre un métier pas à pas", en: "learn a career step by step" },
      title: { fr: "Suis une roadmap", en: "Follow a roadmap" },
      desc: {
        fr: "Pour chaque métier ou compétence, la roadmap te montre quoi apprendre, et dans quel ordre. Ta progression reste enregistrée sur ton appareil.",
        en: "For each career or skill, the roadmap shows you what to learn, and in what order. Your progress stays saved on your device.",
      },
      href: "roadmaps.html",
      cta: { fr: "Voir les roadmaps →", en: "See the roadmaps →" },
      more: [["ecosysteme.html", { fr: "Ressources et communautés", en: "Resources and communities" }], ["test-orientation.html", { fr: "Pas sûr·e du métier ? Fais le test", en: "Not sure which career? Take the test" }]],
    },
    {
      icon: "school",
      label: { fr: "choisir mon école", en: "choose my school" },
      title: { fr: "Compare les écoles et universités", en: "Compare schools and universities" },
      desc: {
        fr: "{n} écoles et universités togolaises comparées : filières, niveaux, admission, frais de scolarité quand ils sont publiés, et dates clés.",
        en: "{n} Togolese schools and universities compared: programs, levels, admission, tuition fees when published, and key dates.",
      },
      href: "ecoles.html",
      cta: { fr: "Comparer les écoles →", en: "Compare schools →" },
      more: [["calendrier.html", { fr: "Dates des concours", en: "Entrance exam dates" }], ["bourses-financement.html", { fr: "Bourses disponibles", en: "Available scholarships" }]],
    },
    {
      icon: "coins",
      label: { fr: "financer mes études", en: "fund my studies" },
      title: { fr: "Trouve une bourse ou une aide", en: "Find a scholarship or aid" },
      desc: {
        fr: "Bourses, réductions et solutions de financement vérifiées, accessibles à un·e bachelier·ère togolais·e, écoles comprises.",
        en: "Verified scholarships, discounts and funding options open to Togolese high-school graduates, schools included.",
      },
      href: "bourses-financement.html",
      cta: { fr: "Voir les bourses →", en: "See scholarships →" },
      more: [["ecoles.html", { fr: "Comparer les frais des écoles", en: "Compare school fees" }], ["calendrier.html", { fr: "Dates à ne pas rater", en: "Dates not to miss" }]],
    },
    {
      icon: "calendar",
      label: { fr: "ne rater aucune date", en: "never miss a deadline" },
      title: { fr: "Garde un œil sur le calendrier", en: "Keep an eye on the calendar" },
      desc: {
        fr: "Le calendrier type d'une candidature au Togo, puis les dates connues école par école : concours, clôtures, rentrées.",
        en: "The typical application calendar in Togo, then known dates school by school: entrance exams, deadlines, start dates.",
      },
      href: "calendrier.html",
      cta: { fr: "Voir le calendrier →", en: "See the calendar →" },
      more: [["actualites.html", { fr: "Dernières actualités", en: "Latest news" }], ["ecoles.html", { fr: "Comparer les écoles", en: "Compare schools" }]],
    },
    {
      icon: "briefcase",
      label: { fr: "trouver un stage ou un emploi", en: "find an internship or a job" },
      title: { fr: "Prépare ton entrée dans la vie pro", en: "Get ready for working life" },
      desc: {
        fr: "Où chercher un stage ou un premier emploi tech au Togo, les employeurs qui recrutent des profils tech, et comment mettre toutes les chances de ton côté.",
        en: "Where to look for an internship or a first tech job in Togo, employers hiring tech profiles, and how to give yourself the best chance.",
      },
      href: "stages-emploi.html",
      cta: { fr: "Voir stages & emploi →", en: "See internships & jobs →" },
      more: [["ecosysteme.html", { fr: "Communautés et hubs", en: "Communities and hubs" }], ["roadmaps.html", { fr: "Renforcer tes compétences", en: "Build your skills" }]],
    },
  ];

  // Catégories des actus (texte FR de actualites.html) → teinte + icône.
  const NEWS_TONES = {
    "Formation": ["1", "cap"], "Éducation": ["1", "cap"], "Événement": ["2", "calendar"],
    "Startups": ["3", "rocket"], "Écosystème": ["3", "rocket"], "Cybersécurité": ["4", "shield"], "Gouvernement": ["5", "school"],
  };

  // Texte brut d'une chaîne HTML, sans rien exécuter ni charger.
  // actualites.html, chargée une seule fois par page (actus de l'accueil,
  // prochains événements, rangée « À venir » du Calendrier).
  let actualitesPromise = null;
  function actualitesHtml() {
    if (!actualitesPromise) {
      actualitesPromise = fetch("actualites.html").then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))));
    }
    return actualitesPromise;
  }

  function plainText(html) {
    // Espace insécable avant « : ; ! ? » (typographie française) : évite
    // qu'un deux-points se retrouve seul en début de ligne.
    return new DOMParser().parseFromString(String(html), "text/html").body.textContent
      .replace(/\s+/g, " ").trim().replace(/ ([:;!?»])/g, " $1");
  }

  // Chiffres [data-stat] (accueil, frise de la page À propos) : calculés
  // depuis data.js pour ne jamais diverger du contenu réel.
  function fillStats() {
    const counts = {
      roadmaps: () => Object.keys(ROLES).length + Object.keys(SKILLS).length,
      ecoles: () => Object.keys(SCHOOLS).length,
      metiers: () => Object.keys(ROLES).length,
      competences: () => Object.keys(SKILLS).length,
      domaines: () => Object.keys(DOMAINS).length,
      togo: () => Object.values(ROLES).filter((r) => r.togoVerified).length,
    };
    document.querySelectorAll("[data-stat]").forEach((el) => {
      const count = counts[el.dataset.stat];
      if (!count) return;
      try {
        el.textContent = count();
      } catch (e) {
        // data.js absent de la page : on garde le chiffre écrit dans le HTML.
      }
    });
  }

  function initHome() {
    const hero = document.getElementById("home-hero");
    if (!hero) return;

    const input = document.getElementById("home-search-input");
    const submit = document.getElementById("home-search-btn");
    const word = document.getElementById("home-rotator-word");
    const pauseBtn = document.getElementById("home-rotator-pause");
    const roles = HOME_ROLES.filter((r) => typeof ROLES === "undefined" || ROLES[r.id]);
    let current = 0;
    let paused = false;
    let held = false;

    const roleLabel = () => (roles.length ? (currentLang() === "en" ? roles[current].en : roles[current].fr) : "");

    // Onglets "Explorer par domaine" (modèle ARIA tablist : clic, flèches,
    // Début/Fin). Contenu tiré de DOMAINS et ROLES, jamais figé.
    const tabsEl = document.getElementById("home-domain-tabs");
    const panelEl = document.getElementById("home-domain-panel");
    const domainNames = typeof DOMAINS !== "undefined" ? Object.keys(DOMAINS) : [];
    let activeDomain = domainNames[0];

    function renderDomains(isEn) {
      if (!tabsEl || !panelEl || !domainNames.length || typeof ROLES === "undefined") return;
      tabsEl.setAttribute("aria-label", isEn ? "Tech fields" : "Domaines tech");
      tabsEl.innerHTML = domainNames.map((name, i) => {
        const sel = name === activeDomain;
        return `<button type="button" role="tab" class="home-tab" id="home-tab-${i}" aria-controls="home-domain-panel" aria-selected="${sel}" tabindex="${sel ? 0 : -1}" data-domain="${esc(name)}"><span class="home-tab-icon" aria-hidden="true">${DOMAINS[name].icon}</span><span>${esc(domainLabel(name))}</span></button>`;
      }).join("");

      const meta = DOMAINS[activeDomain];
      const ids = Object.keys(ROLES).filter((id) => ROLES[id].domain === activeDomain);
      const cards = ids.slice(0, 6).map((id) => {
        const r = ROLES[id];
        const verified = r.togoVerified ? ` · ✓ ${isEn ? "Togo-verified" : "Vérifié Togo"}` : "";
        return `<a class="home-role-card" href="roadmap.html?id=${encodeURIComponent(id)}"><span class="home-role-icon" aria-hidden="true">${r.icon}</span><span class="home-role-body"><span class="home-role-title">${esc(tField(r, "title"))}</span><span class="home-role-meta">${esc(levelLabel(r.level))} · ${countItems(r)} ${isEn ? "steps" : "étapes"}${verified}</span></span></a>`;
      }).join("");
      panelEl.setAttribute("aria-labelledby", `home-tab-${domainNames.indexOf(activeDomain)}`);
      panelEl.className = `home-tabpanel home-tabpanel--${domainSlug(activeDomain)}`;
      panelEl.innerHTML = `
        <div class="home-domain-intro">
          <p class="home-domain-name"><span class="home-domain-icon" aria-hidden="true">${meta.icon}</span>${esc(domainLabel(activeDomain))}</p>
          <p class="home-domain-desc">${esc(tField(meta, "description"))}</p>
          ${meta.presenceTogo ? `<p class="home-domain-presence">🇹🇬 ${esc(tField(meta, "presenceTogo"))}</p>` : ""}
          <a class="home-feature-link" href="roadmaps.html?domaine=${encodeURIComponent(activeDomain)}#par-metier">${isEn ? `See the ${ids.length} roadmaps →` : `Voir les ${ids.length} roadmaps →`}</a>
        </div>
        <div class="home-role-grid">${cards}</div>`;
    }

    function renderCities(isEn) {
      const list = document.getElementById("home-city-list");
      const map = document.getElementById("home-map");
      if (!list || !map || typeof SCHOOLS === "undefined") return;
      const counts = {};
      Object.values(SCHOOLS).forEach((s) => (s.ville || []).forEach((v) => { counts[v] = (counts[v] || 0) + 1; }));
      const lat = (c) => (CITY_COORDS[c] ? CITY_COORDS[c][0] : 99);
      const cities = Object.keys(counts).sort((a, b) => lat(a) - lat(b));
      const word = (n) => (isEn ? (n > 1 ? "schools" : "school") : (n > 1 ? "écoles" : "école"));
      list.innerHTML = cities.map((c) =>
        `<li><a href="ecoles.html?ville=${encodeURIComponent(c)}"><span class="home-city-name">${esc(c)}</span><span class="home-city-count">${counts[c]} ${word(counts[c])} →</span></a></li>`
      ).join("");

      const W = 360, H = 460, PAD = 52, LAT = [5.8, 10.0], LON = [0.4, 1.6];
      const pts = cities.filter((c) => CITY_COORDS[c]).map((c) => {
        const [la, lo] = CITY_COORDS[c];
        return {
          c, n: counts[c], r: 8 + 6 * Math.sqrt(counts[c]),
          x: PAD + ((lo - LON[0]) / (LON[1] - LON[0])) * (W - 2 * PAD),
          y: PAD + ((LAT[1] - la) / (LAT[1] - LAT[0])) * (H - 2 * PAD),
        };
      });
      // Étiquette à droite du point, sauf si elle chevaucherait un autre point.
      const labels = pts.map((p) => {
        const width = (p.c.length + String(p.n).length + 3) * 8.4;
        const clash = pts.some((q) => q !== p && q.x - q.r < p.x + p.r + 8 + width && q.x + q.r > p.x && Math.abs(q.y - p.y) < q.r + 10);
        return clash
          ? `<text class="map-label" x="${(p.x - p.r - 8).toFixed(1)}" y="${(p.y + 5).toFixed(1)}" text-anchor="end">${esc(p.c)} <tspan class="map-count">${p.n}</tspan></text>`
          : `<text class="map-label" x="${(p.x + p.r + 8).toFixed(1)}" y="${(p.y + 5).toFixed(1)}">${esc(p.c)} <tspan class="map-count">${p.n}</tspan></text>`;
      });
      map.innerHTML = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <line class="map-axis" x1="22" y1="${PAD - 14}" x2="22" y2="${H - PAD + 14}"></line>
        <text class="map-axis-label" x="22" y="${PAD - 22}" text-anchor="middle">N ↑</text>
        <text class="map-axis-label" x="22" y="${H - PAD + 30}" text-anchor="middle">S</text>
        ${pts.map((p) => `<circle class="map-halo" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(p.r * 1.7).toFixed(1)}"></circle><circle class="map-pin" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}"></circle>`).join("")}
        ${labels.join("")}
        <text class="map-coast" x="${W / 2}" y="${H - 14}" text-anchor="middle">${isEn ? "Gulf of Guinea" : "Golfe de Guinée"}</text>
      </svg>`;
    }

    function renderPhone(isEn) {
      const screen = document.getElementById("home-phone-screen");
      if (!screen) return;
      screen.innerHTML = `
        <div class="phone-status"><span>9:41</span><span class="phone-notch"></span><span class="phone-bars"><i></i><i></i><i></i><i></i></span></div>
        <div class="phone-header"><img src="icons/logo-white.png?v=1" alt=""><span class="phone-menu"></span></div>
        <div class="phone-hero">
          <span class="phone-badge">${isEn ? "100% free" : "100 % gratuit"}</span>
          <p class="phone-title">${isEn ? "Become" : "Deviens"}<br><span class="phone-role">${esc(roleLabel())}</span><br>${isEn ? "in Togo" : "au Togo"}</p>
          <div class="phone-search">${isEn ? "Search WIYAO…" : "Cherche sur WIYAO…"}</div>
          <span class="phone-btn">${isEn ? "Take the test →" : "Faire le test →"}</span>
        </div>
        <div class="phone-cards"><span></span><span></span></div>`;
    }

    const intentSelect = document.getElementById("home-intent-select");
    const intentResult = document.getElementById("home-intent-result");
    let activeIntent = 0;

    function renderIntent(isEn, withOptions = true) {
      if (!intentSelect || !intentResult) return;
      const L = isEn ? "en" : "fr";
      const nSchools = typeof SCHOOLS !== "undefined" ? Object.keys(SCHOOLS).length : 32;
      if (withOptions) {
        intentSelect.innerHTML = HOME_INTENTS.map((it, i) =>
          `<option value="${i}"${i === activeIntent ? " selected" : ""}>${esc(it.label[L])}</option>`
        ).join("");
      }
      const it = HOME_INTENTS[activeIntent];
      intentResult.innerHTML = `
        <div class="home-intent-card">
          <span class="home-intent-icon" aria-hidden="true">${ICONS[it.icon]}</span>
          <div class="home-intent-body">
            <h3 class="home-intent-title">${esc(it.title[L])}</h3>
            <p class="home-intent-desc">${esc(it.desc[L].replace("{n}", nSchools))}</p>
            <ul class="home-intent-more">${it.more.map(([href, t]) => `<li><a href="${href}">${esc(t[L])}</a></li>`).join("")}</ul>
          </div>
          <a class="btn-primary home-intent-cta" href="${it.href}">${esc(it.cta[L])}</a>
        </div>`;
    }

    if (intentSelect) {
      intentSelect.addEventListener("change", () => {
        activeIntent = Math.min(HOME_INTENTS.length - 1, Math.max(0, Number(intentSelect.value) || 0));
        renderIntent(currentLang() === "en", false);
      });
    }

    // Actualités : les 4 premières cartes de actualites.html (l'ordre choisi
    // sur cette page), relues à chaque visite : rien à ressaisir ici.
    const newsSection = document.getElementById("actus");
    const newsGrid = document.getElementById("home-news-grid");
    let newsItems = null;

    // Champ de la carte → suffixe de sa clé i18n (actu.t19.h3, actu.t19.p…).
    const NEWS_KEYS = { title: "h3", desc: "p", date: "date", cat: "cat" };

    function newsText(item, field, isEn) {
      const tr = window.WIYAO_I18N && item.key ? window.WIYAO_I18N.t(`${item.key}.${NEWS_KEYS[field]}`, isEn ? "en" : "fr") : null;
      return plainText(tr == null ? item[field] : tr);
    }

    function renderNews(isEn) {
      if (!newsGrid || !newsItems || !newsItems.length) return;
      const view = newsItems.map((n) => {
        const [tone, icon] = NEWS_TONES[n.cat] || ["1", "cap"];
        return { n, tone, icon, title: newsText(n, "title", isEn), desc: newsText(n, "desc", isEn), date: newsText(n, "date", isEn), cat: newsText(n, "cat", isEn) };
      });
      const [f, ...rest] = view;
      const href = (v) => `actualites.html${v.n.id ? `#${encodeURIComponent(v.n.id)}` : ""}`;
      const source = /^https?:\/\//.test(f.n.source)
        ? `<a class="home-news-source" href="${esc(f.n.source)}" target="_blank" rel="noopener">${isEn ? "Source ↗" : "Source ↗"}</a>`
        : "";
      newsGrid.innerHTML = `
        <article class="home-news-feature">
          <div class="home-news-cover home-news-tone-${f.tone}" aria-hidden="true">${ICONS[f.icon]}<span class="home-news-cover-cat">${esc(f.cat)}</span></div>
          <div class="home-news-body">
            <h3 class="home-news-title"><a href="${href(f)}">${esc(f.title)}</a></h3>
            <p class="home-news-desc">${esc(f.desc)}</p>
            <p class="home-news-date">${ICONS.calendar}<span>${esc(f.date)}</span></p>
            <p class="home-news-links"><a class="home-feature-link" href="${href(f)}">${isEn ? "Read on WIYAO →" : "Lire sur WIYAO →"}</a>${source}</p>
          </div>
        </article>
        <ul class="home-news-list">${rest.map((v) => `
          <li><a class="home-news-item" href="${href(v)}">
            <span class="home-news-thumb home-news-tone-${v.tone}" aria-hidden="true">${ICONS[v.icon]}</span>
            <span class="home-news-item-text"><span class="home-news-item-title">${esc(v.title)}</span><span class="home-news-item-date">${esc(v.date)}</span></span>
          </a></li>`).join("")}
        </ul>`;
    }

    function loadNews() {
      if (!newsGrid || !window.fetch || !window.DOMParser) return;
      // Requête déjà lancée par js/nav.js pour le bandeau d'annonce, si présente.
      actualitesHtml()
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, "text/html");
          const pick = (a, sel) => { const el = a.querySelector(sel); return el ? el.textContent.trim() : ""; };
          newsItems = [...doc.querySelectorAll("article.actu-card")].slice(0, 4).map((a) => {
            const h3 = a.querySelector(".actu-card-title");
            const src = a.querySelector(".actu-card-btn");
            return {
              id: a.id || "",
              key: h3 && h3.dataset.i18nKey ? h3.dataset.i18nKey.replace(/\.h3$/, "") : "",
              title: h3 ? h3.textContent.trim() : "",
              desc: pick(a, ".actu-card-desc"),
              date: pick(a, '.actu-meta-value[data-i18n-key$=".date"]'),
              cat: pick(a, '.actu-meta-value[data-i18n-key$=".cat"]'),
              source: src ? src.getAttribute("href") || "" : "",
            };
          }).filter((n) => n.title);
          if (!newsItems.length) throw new Error("empty");
          renderNews(currentLang() === "en");
        })
        .catch(() => { if (newsSection) newsSection.hidden = true; });
    }

    // FAQ question / réponse (façon Chowdeck) : sur grand écran, questions à
    // gauche et réponse dans un panneau à droite ; l'accordéon reste la
    // version mobile et sans JavaScript. Contenu relu depuis les <details>
    // (donc déjà traduit par i18n.js).
    const faqSection = document.querySelector(".home-faq");
    const faqSplit = document.getElementById("home-faq-split");
    let activeFaq = 0;

    function renderFaq(isEn) {
      if (!faqSection || !faqSplit) return;
      const items = [...faqSection.querySelectorAll(".home-faq-list .faq-item")];
      if (!items.length) return;
      const num = (i) => String(i + 1).padStart(2, "0");
      const part = (d, sel) => { const el = d.querySelector(sel); return el ? el.innerHTML : ""; };
      faqSplit.innerHTML = `
        <div class="home-faq-tabs" role="tablist" aria-orientation="vertical" aria-label="${isEn ? "Frequently asked questions" : "Questions fréquentes"}">
          ${items.map((d, i) => `<button type="button" role="tab" class="home-faq-tab" id="home-faq-tab-${i}" aria-controls="home-faq-panel" aria-selected="${i === activeFaq}" tabindex="${i === activeFaq ? 0 : -1}"><span class="home-faq-num" aria-hidden="true">${num(i)}</span><span class="home-faq-q">${part(d, "summary")}</span></button>`).join("")}
        </div>
        <div class="home-faq-panel" id="home-faq-panel" role="tabpanel" aria-labelledby="home-faq-tab-${activeFaq}" tabindex="0">
          <span class="home-faq-mark" aria-hidden="true">${num(activeFaq)}</span>
          <p class="home-faq-answer">${part(items[activeFaq], "p")}</p>
        </div>`;
      faqSplit.hidden = false;
      faqSection.classList.add("is-split");
    }

    function selectFaq(i) {
      activeFaq = i;
      renderFaq(currentLang() === "en");
      const tab = document.getElementById(`home-faq-tab-${i}`);
      if (tab) tab.focus();
    }

    if (faqSplit) {
      faqSplit.addEventListener("click", (e) => {
        const btn = e.target.closest('[role="tab"]');
        if (btn) selectFaq(Number(btn.id.replace("home-faq-tab-", "")));
      });
      faqSplit.addEventListener("keydown", (e) => {
        if (!e.target.closest('[role="tab"]')) return;
        const n = faqSplit.querySelectorAll('[role="tab"]').length;
        let i = activeFaq;
        if (e.key === "ArrowDown") i = (i + 1) % n;
        else if (e.key === "ArrowUp") i = (i - 1 + n) % n;
        else if (e.key === "Home") i = 0;
        else if (e.key === "End") i = n - 1;
        else return;
        e.preventDefault();
        selectFaq(i);
      });
    }

    function selectDomain(i) {
      activeDomain = domainNames[i];
      renderDomains(currentLang() === "en");
      const tab = document.getElementById(`home-tab-${i}`);
      if (tab) tab.focus();
    }

    if (tabsEl) {
      tabsEl.addEventListener("click", (e) => {
        const btn = e.target.closest('[role="tab"]');
        if (btn) selectDomain(domainNames.indexOf(btn.dataset.domain));
      });
      tabsEl.addEventListener("keydown", (e) => {
        const n = domainNames.length;
        let i = domainNames.indexOf(activeDomain);
        if (e.key === "ArrowRight") i = (i + 1) % n;
        else if (e.key === "ArrowLeft") i = (i - 1 + n) % n;
        else if (e.key === "Home") i = 0;
        else if (e.key === "End") i = n - 1;
        else return;
        e.preventDefault();
        selectDomain(i);
      });
    }

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
      renderIntent(isEn);
      renderDomains(isEn);
      renderCities(isEn);
      renderNews(isEn);
      renderPhone(isEn);
      renderFaq(isEn);
    }

    // Bouton "Installer WIYAO" : affiché seulement si le navigateur propose
    // l'installation (PWA) ; sinon les étapes manuelles restent visibles.
    const installBtn = document.getElementById("home-install-btn");
    let installPrompt = null;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      installPrompt = e;
      if (installBtn) installBtn.hidden = false;
    });
    window.addEventListener("appinstalled", () => { if (installBtn) installBtn.hidden = true; });
    if (installBtn) {
      installBtn.addEventListener("click", async () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        await installPrompt.userChoice;
        installPrompt = null;
        installBtn.hidden = true;
      });
    }

    render();
    loadNews();
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
        const phoneRole = document.querySelector(".phone-role");
        if (phoneRole) phoneRole.textContent = roleLabel();
        word.classList.remove("is-leaving");
        word.classList.add("is-entering");
        void word.offsetWidth;
        word.classList.remove("is-entering");
      }, 320);
    }, 2800);
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillStats();
    initHome();
    renderGrid();
    renderDomainPrimer();
    initFilters();
    initGlobalSearch();
    initSearchSuggestions();
    renderRoadmap();
    renderSchools();
    initSchoolFilters();
    renderSchoolStats();
    initSchoolCompare();
    initQuiz();
    renderAcademicTimeline();
    renderSchoolDates();
    initUpcomingEvents();
    initHomeUpcoming();
    initAudienceTabs();
    initQuizHowto();
    initGuideExplorer();
    initContactForm();
    initProposerForm();
  });

  // Exposé pour js/assistant.js : réutilise la même normalisation et le même
  // index de recherche que la page Recherche, pas de logique dupliquée.
  window.WIYAO_SEARCH = { buildGlobalIndex, normalize, currentLang };
})();
