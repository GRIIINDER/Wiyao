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

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function toggleItem(roadmapId, itemKey) {
    const progress = loadProgress();
    if (!progress[roadmapId]) progress[roadmapId] = [];
    const idx = progress[roadmapId].indexOf(itemKey);
    if (idx >= 0) {
      progress[roadmapId].splice(idx, 1);
    } else {
      progress[roadmapId].push(itemKey);
    }
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
    return (progress[roadmapId] || []).length;
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

  function buildCard(id, rm) {
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
    card.innerHTML = `
      <div class="card-icon">${rm.icon}</div>
      ${badges ? `<div class="card-badges">${badges}</div>` : ""}
      <h3>${tField(rm, "title")}</h3>
      <p>${tField(rm, "subtitle")}</p>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <span class="progress-label">${pct}% ${cardLabel}</span>
    `;
    return card;
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

      orderedDomains.forEach((domainName) => {
        const meta = typeof DOMAINS !== "undefined" ? DOMAINS[domainName] : null;

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
        byDomain[domainName].forEach((id) => subGrid.appendChild(buildCard(id, ROLES[id])));
        group.appendChild(subGrid);

        roleGrid.appendChild(group);
      });
    }
    if (skillGrid && typeof SKILLS !== "undefined") {
      Object.keys(SKILLS).forEach((id) => skillGrid.appendChild(buildCard(id, SKILLS[id])));
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

      const heading = document.createElement("h4");
      heading.textContent = meta.icon ? `${meta.icon} ${domainLabel}` : domainLabel;
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
      grid.querySelectorAll(".domain-group").forEach((group) => {
        const anyVisible = Array.prototype.some.call(group.querySelectorAll(".card"), (c) => !c.hidden);
        group.hidden = !anyVisible;
      });
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
    related.forEach((rid) => grid.appendChild(buildCard(rid, ROLES[rid])));
    section.appendChild(grid);

    return section;
  }

  // ---- Page roadmap détail ----
  function renderRoadmap() {
    const container = document.getElementById("roadmap-detail");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const rm = typeof ALL_ROADMAPS !== "undefined" ? ALL_ROADMAPS[id] : null;

    if (!rm) {
      container.innerHTML = `<p>Roadmap introuvable. <a href="index.html">Retour à l'accueil</a></p>`;
      return;
    }

    document.title = `${tField(rm, "title")} — WIYAO`;

    const total = countItems(rm);
    let progress = loadProgress();
    if (!progress[id]) progress[id] = [];

    const isEn = currentLang() === "en";
    const typeLabel = rm.type === "skill" ? (isEn ? "Skill roadmap" : "Roadmap par compétence") : (isEn ? "Role roadmap" : "Roadmap par métier");
    const categoryLabel = rm.type === "skill" ? (isEn ? "By skill" : "Par compétence") : (isEn ? "By role" : "Par métier");
    const categoryHref = rm.type === "skill" ? "index.html#par-competence" : "index.html#par-metier";

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
      const done = (loadProgress()[id] || []).length;
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
        const done = progress[id].includes(key);

        const itemEl = document.createElement("div");
        itemEl.className = "item" + (done ? " done" : "") + (item.level === "option" ? " optional" : "");

        const check = document.createElement("button");
        check.className = "check";
        check.type = "button";
        check.setAttribute("aria-label", "Marquer comme fait");
        check.textContent = done ? "✓" : "";
        check.addEventListener("click", () => {
          progress = toggleItem(id, key);
          itemEl.classList.toggle("done");
          check.textContent = itemEl.classList.contains("done") ? "✓" : "";
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

    const helpLinks = document.createElement("p");
    helpLinks.className = "category-desc";
    helpLinks.innerHTML = isEn
      ? 'School fees shouldn\'t be what stops you: see <a href="bourses-financement.html">scholarships &amp; funding</a>. Question about this path? Check the <a href="faq.html">FAQ</a>.'
      : 'Les frais de scolarité ne doivent pas être ce qui t\'arrête : voir les <a href="bourses-financement.html">bourses &amp; financement</a>. Une question sur ce parcours ? Regarde la <a href="faq.html">FAQ</a>.';
    container.appendChild(helpLinks);

    const relatedSection = buildRelatedSection(id, rm);
    if (relatedSection) container.appendChild(relatedSection);

    const resetBtn = document.getElementById("reset-progress");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const confirmMsg =
          currentLang() === "en"
            ? "Reset progress for this roadmap?"
            : "Réinitialiser la progression pour cette roadmap ?";
        if (confirm(confirmMsg)) {
          const p = loadProgress();
          p[id] = [];
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

  function buildSchoolCard(id, school) {
    const card = document.createElement("div");
    card.className = "card school-card";
    card.dataset.title = school.name.toLowerCase() + " " + school.filieres.join(" ").toLowerCase();
    card.dataset.ville = school.ville.join(",");
    card.dataset.statut = school.statut;

    const badges = document.createElement("div");
    badges.className = "card-badges school-badges";
    badges.innerHTML =
      `<span class="badge status-${school.statut === "public" ? "public" : "prive"}">${STATUT_LABELS[school.statut] || school.statut}</span>` +
      school.ville.map((v) => `<span class="badge ville-badge">${v}</span>`).join("") +
      (school.agree === true ? `<span class="badge status-public">🏛️ Agréé État</span>` : "");
    card.appendChild(badges);

    const title = document.createElement("h3");
    title.textContent = school.name;
    card.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.className = "school-subtitle";
    subtitle.textContent = school.description;
    card.appendChild(subtitle);

    const filieres = document.createElement("ul");
    filieres.className = "school-filieres";
    filieres.innerHTML = school.filieres.map((f) => `<li>${f}</li>`).join("");
    card.appendChild(filieres);

    const meta = document.createElement("div");
    meta.className = "school-meta";
    let metaHtml = `<span><strong>Niveaux :</strong> ${school.niveaux.join(", ")}</span>`;
    if (school.duree) metaHtml += `<span><strong>Durée :</strong> ${school.duree}</span>`;
    if (school.admission) metaHtml += `<span><strong>Admission :</strong> ${school.admission}</span>`;
    if (school.frais) metaHtml += `<span><strong>Frais :</strong> ${school.frais}</span>`;
    if (school.agreeNote) metaHtml += `<span>ℹ️ ${school.agreeNote}</span>`;
    meta.innerHTML = metaHtml;
    card.appendChild(meta);

    if (school.site) {
      const link = document.createElement("a");
      link.className = "school-link";
      link.href = school.site;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Voir le site officiel →";
      card.appendChild(link);
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
    const activeVilleChip = document.querySelector("#ville-filters .domain-chip.active");
    const activeVille = activeVilleChip ? activeVilleChip.dataset.ville : "all";
    const activeStatutChip = document.querySelector("#statut-filters .domain-chip.active");
    const activeStatut = activeStatutChip ? activeStatutChip.dataset.statut : "all";

    let visibleCount = 0;
    grid.querySelectorAll(".school-card").forEach((card) => {
      const matchesQuery = !query || card.dataset.title.indexOf(query) !== -1;
      const matchesVille = activeVille === "all" || card.dataset.ville.split(",").indexOf(activeVille) !== -1;
      const matchesStatut = activeStatut === "all" || card.dataset.statut === activeStatut;
      const visible = matchesQuery && matchesVille && matchesStatut;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    const noResults = document.getElementById("school-no-results");
    if (noResults) noResults.hidden = visibleCount !== 0;
  }

  function initSchoolFilters() {
    const searchInput = document.getElementById("school-search");
    if (searchInput) searchInput.addEventListener("input", applySchoolFilters);

    ["ville-filters", "statut-filters"].forEach((groupId) => {
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
  // — une fois le domaine dominant connu — 2 questions spécifiques à ce domaine
  // qui affinent la recommandation vers un métier précis (au lieu des 3 premiers
  // métiers du domaine par ordre d'insertion), avant les questions pratiques
  // (niveau, ville, budget, priorité). 14 questions au total, quel que soit le
  // profil.
  let quizIndex = 0;
  let quizScores = {};
  let quizRoleScores = {};
  let quizPractical = { niveau: null, ville: null, statut: null, priorite: null };
  let quizFlow = typeof QUIZ_QUESTIONS !== "undefined" ? QUIZ_QUESTIONS.filter((q) => q.type === "domain") : [];
  const quizDomainCount = quizFlow.length;

  function renderQuizQuestion() {
    const questionEl = document.getElementById("quiz-question");
    if (!questionEl || typeof QUIZ_QUESTIONS === "undefined") return;

    const progressFill = document.getElementById("quiz-progress-fill");
    const progressLabel = document.getElementById("quiz-progress-label");
    const total = quizFlow.length;
    const q = quizFlow[quizIndex];

    if (progressFill) progressFill.style.width = Math.round((quizIndex / total) * 100) + "%";
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
  }

  function answerQuiz(type, value, roles) {
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
    if (quizIndex === quizDomainCount) {
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
    // deuxième niveau (voir ROLE_QUESTIONS) plutôt que par ordre d'insertion —
    // les métiers jamais boostés (score 0) ne sont proposés que s'il n'y a pas
    // assez de métiers mieux notés pour remplir les 3 recommandations.
    const matchingRoles = typeof ROLES !== "undefined"
      ? Object.keys(ROLES)
          .filter((id) => ROLES[id].domain === top)
          .sort((a, b) => (quizRoleScores[b] || 0) - (quizRoleScores[a] || 0))
          .slice(0, 3)
      : [];
    const schoolMatches = computeSchoolMatches(top);
    const isEn = currentLang() === "en";
    const topLabel = isEn && topMeta.nameEn ? topMeta.nameEn : top;

    let html = `
      <p class="quiz-disclaimer">${
        isEn
          ? 'This result is a starting point, not a verdict — 14 questions can\'t know you 100%. Compare it against a <a href="temoignages.html">real testimonial</a> from someone in the role, and try the roadmap before committing financially to a school.'
          : 'Ce résultat est un point de départ, pas un verdict — 14 questions ne peuvent pas te connaître à 100 %. Confronte-le à un <a href="temoignages.html">témoignage réel</a> de quelqu\'un du métier, et teste la roadmap avant de t\'engager financièrement dans une école.'
      }</p>
      <h2>${isEn ? "Your profile" : "Ton profil"} : ${topMeta.icon} ${topLabel}</h2>
      <p class="category-desc">${tField(topMeta, "description")}</p>
    `;

    if (matchingRoles.length) {
      html += `<div class="grid" id="quiz-role-grid"></div>`;
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
            ? "Based on your domain and your answers about level, city and budget — every checked criterion is verified, not guessed."
            : "D'après ton domaine et tes réponses sur le niveau, la ville et le budget — chaque critère coché est vérifié, pas deviné."
        }</p>
        <div class="grid" id="quiz-school-grid"></div>
        <p class="quiz-secondary">
          <a href="ecoles.html">${isEn ? "See all schools →" : "Voir toutes les écoles →"}</a>
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
      matchingRoles.forEach((id) => roleGrid.appendChild(buildCard(id, ROLES[id])));
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

  // ---- Page Contact (message ou proposition de contenu) ----
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const modeButtons = document.querySelectorAll("#contact-mode-filters .domain-chip");
    const modeFields = document.querySelectorAll(".contact-mode-fields");
    const introTitle = document.getElementById("contact-intro-title");
    const submitBtn = document.getElementById("contact-submit-btn");
    const messageFieldIds = ["contact-subject", "contact-message"];
    const proposerFieldIds = ["proposal-type", "proposal-nom", "proposal-lien", "proposal-description"];

    function setMode(mode) {
      modeButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === mode));
      modeFields.forEach((block) => {
        block.hidden = block.dataset.modeFields !== mode;
      });
      const isProposer = mode === "proposer";
      messageFieldIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.required = !isProposer;
      });
      proposerFieldIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.required = isProposer;
      });
      if (introTitle) introTitle.innerHTML = isProposer ? "Proposer un<br>événement ou une communauté" : "Nous laisser<br>un message";
      if (submitBtn) submitBtn.innerHTML = isProposer ? 'Envoyer la proposition <span aria-hidden="true">↗</span>' : 'Envoyer <span aria-hidden="true">↗</span>';
    }

    modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => setMode(btn.dataset.mode));
    });

    if (window.location.hash === "#proposer") setMode("proposer");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const currentMode = document.querySelector("#contact-mode-filters .domain-chip.active").dataset.mode;
      const name = form.elements["name"].value.trim();
      const email = form.elements["email"].value.trim();

      if (currentMode === "proposer") {
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
          `Date (si événement) : ${date || "non précisée"}`,
          "",
          "Description :",
          description,
          "",
          `— Proposé par ${name} (${email})`,
        ];
        window.location.href = `mailto:wiya.info@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
        return;
      }

      const subject = form.elements["subject"].value.trim();
      const message = form.elements["message"].value.trim();
      const body = `${message}\n\n— ${name} (${email})`;
      window.location.href = `mailto:wiya.info@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

      const fields = dc
        ? [
            ["Ouverture des candidatures", dc.ouverture],
            ["Clôture", dc.cloture],
            ["Concours", dc.concours],
            ["Résultats", dc.resultats],
            ["Rentrée", dc.rentree]
          ].filter(([, value]) => !!value)
        : [];

      if (fields.length) {
        bodyHtml += `<ul class="dates-list">` + fields.map(([label, value]) => `<li><strong>${label} :</strong> ${value}</li>`).join("") + `</ul>`;
      }

      if (dc && dc.anneeReference) {
        bodyHtml += `<p class="dates-ref-note">Repère de calendrier (${dc.anneeReference})${dc.aVerifier ? " — à reconfirmer directement auprès de l'école" : ""}.</p>`;
      }

      if (dc && dc.contact) {
        bodyHtml += `<p class="dates-ref-note">Contact direct : ${dc.contact}</p>`;
      }

      if (!dc) {
        bodyHtml = `<p class="dates-note">Dates non publiées en ligne — vérifie directement sur le site de l'école.</p>`;
      }

      row.innerHTML = `
        <h3>${school.name}</h3>
        ${bodyHtml}
        ${school.site ? `<a class="school-link" href="${school.site}" target="_blank" rel="noopener">Voir le site officiel →</a>` : ""}
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
    const parts = [(school.filieres || []).join(" "), (school.niveaux || []).join(" ")];
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
            const section = item.closest("section[id]");
            index.push({
              title: heading.textContent.trim(),
              description: desc ? desc.textContent.trim() : "",
              category: page.category,
              url: section ? `${page.url}#${section.id}` : page.url,
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
      status.textContent = matches.length
        ? (isEn ? `${matches.length} result${matches.length > 1 ? "s" : ""}` : `${matches.length} résultat${matches.length > 1 ? "s" : ""}`)
        : (isEn ? "No results. Try a different keyword." : "Aucun résultat. Essaie un autre mot-clé.");

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

  document.addEventListener("DOMContentLoaded", function () {
    renderGrid();
    renderDomainPrimer();
    initFilters();
    initGlobalSearch();
    renderRoadmap();
    renderSchools();
    initSchoolFilters();
    initQuiz();
    renderAcademicTimeline();
    renderSchoolDates();
    initContactForm();
  });

  // Exposé pour js/assistant.js — réutilise la même normalisation et le même
  // index de recherche que la page Recherche, pas de logique dupliquée.
  window.WIYAO_SEARCH = { buildGlobalIndex, normalize, currentLang };
})();
