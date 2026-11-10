// Langue choisie avant le premier affichage - WIYAO
// Chargé dans <head> (bloquant, mais quelques octets et précaché) : si la
// personne a choisi l'anglais, la page reste masquée jusqu'à ce que i18n.js
// l'ait traduite, au lieu de montrer d'abord le français le temps que les
// scripts arrivent (2026-11-10). Filet de sécurité : la page réapparaît au
// bout de 3,5 s même si i18n.js ne se charge pas. Sans JavaScript, rien
// n'est masqué.
(function () {
  try {
    if (localStorage.getItem("wiyao-lang") !== "en") return;
    var root = document.documentElement;
    root.lang = "en";
    root.classList.add("i18n-pending");
    window.setTimeout(function () {
      root.classList.remove("i18n-pending");
    }, 3500);
  } catch (e) {}
})();
