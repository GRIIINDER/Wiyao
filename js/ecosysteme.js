// Page Écosystème - WIYAO
// Filtres par type (façon onglets d'espaces Gozem) : la rangée de liens
// .eco-jump-nav devient une rangée de filtres, chacun avec son nombre
// d'entrées compté sur la page. Sans JavaScript, les liens d'ancre restent.
(function () {
  "use strict";

  const nav = document.querySelector(".eco-jump-nav");
  if (!nav) return;

  const isEn = () => document.documentElement.lang === "en";

  // Une entrée par filtre : soit une section entière, soit un groupe à
  // l'intérieur d'une section (Communautés / Événements).
  const TYPES = [
    { key: "communautes", section: "communautes", group: "communautes", fr: "Communautés", en: "Communities" },
    { key: "evenements", section: "communautes", group: "evenements", fr: "Événements", en: "Events" },
    { key: "femmes-tech", section: "femmes-tech", fr: "Femmes dans la tech", en: "Women in tech" },
    { key: "hubs", section: "hubs", fr: "Hubs & incubateurs", en: "Hubs & incubators" },
    { key: "startups", section: "startups", fr: "Startups", en: "Startups" },
    { key: "institutions", section: "institutions", fr: "Institutions & employeurs", en: "Institutions & employers" },
    { key: "cybersecurite", section: "cybersecurite", fr: "Cybersécurité", en: "Cybersecurity" },
    { key: "ressources", section: "ressources", fr: "Ressources en ligne", en: "Online resources" },
  ].filter((t) => document.getElementById(t.section));

  const sections = Array.from(document.querySelectorAll("main .eco-section"));
  const groupList = (g) => document.querySelector(`.eco-list[data-group="${g}"]`);
  const count = (t) => {
    const scope = t.group ? groupList(t.group) : document.getElementById(t.section);
    return scope ? scope.querySelectorAll(".eco-item").length : 0;
  };
  const total = document.querySelectorAll("main .eco-section .eco-item").length;

  let active = new URLSearchParams(window.location.search).get("type") || "all";
  if (active !== "all" && !TYPES.some((t) => t.key === active)) active = "all";

  function esc(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function renderNav() {
    nav.classList.add("eco-filters");
    nav.setAttribute("role", "group");
    nav.setAttribute("aria-label", isEn() ? "Filter by type" : "Filtrer par type");
    const chip = (key, label, n) =>
      `<button type="button" class="domain-chip${active === key ? " active" : ""}" data-type="${esc(key)}" aria-pressed="${active === key}">${esc(label)} <span class="actu-filter-count">${n}</span></button>`;
    nav.innerHTML = chip("all", isEn() ? "All" : "Tous", total) + TYPES.map((t) => chip(t.key, isEn() ? t.en : t.fr, count(t))).join("");
  }

  function apply() {
    const t = TYPES.find((x) => x.key === active);
    sections.forEach((s) => { s.hidden = !!t && s.id !== t.section; });
    // Dans la section Communautés : n'afficher que le groupe choisi.
    document.querySelectorAll(".eco-list[data-group]").forEach((list) => {
      const show = !t || !t.group || list.dataset.group === t.group;
      list.hidden = !show;
      const heading = list.previousElementSibling;
      if (heading && heading.classList.contains("eco-subheading")) heading.hidden = !show;
    });
  }

  function syncUrl() {
    const params = new URLSearchParams(window.location.search);
    if (active === "all") params.delete("type");
    else params.set("type", active);
    const qs = params.toString();
    window.history.replaceState(null, "", window.location.pathname + (qs ? "?" + qs : "") + window.location.hash);
  }

  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-type]");
    if (!btn) return;
    active = btn.dataset.type;
    syncUrl();
    renderNav();
    apply();
    const again = nav.querySelector(`[data-type="${active}"]`);
    if (again) again.focus();
  });

  renderNav();
  apply();
  new MutationObserver(renderNav).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
