// Thème clair/sombre — WIYAO
// La détection initiale (localStorage ou préférence système) tourne dans un
// script inline en tête de <head> pour éviter un flash du mauvais thème ;
// ce fichier ne gère que le bouton de bascule et sa persistance.
(function () {
  "use strict";

  var STORAGE_KEY = "wiyao-theme";

  function currentTheme() {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  }

  function applyThemeColor(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#eef1f7" : "#0a0d1c");
  }

  applyThemeColor(currentTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var next = currentTheme() === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      applyThemeColor(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        // stockage indisponible (navigation privée, quota) — le thème reste actif pour la session
      }
    });
  });
})();
