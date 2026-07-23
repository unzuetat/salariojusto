/* SalarioJusto · Banner de consentimiento de cookies (self-hosted, sin dependencias)
 * Opción C: Google Consent Mode v2. Default 'denied' se fija en el <head> de cada
 * página ANTES de cargar GA4; este script solo pinta el banner y, al aceptar,
 * dispara gtag('consent','update', ... 'granted'). Base sobre la que luego se
 * monta la opción A (mensaje GDPR de Google). Decisión persistida en localStorage.
 */
(function () {
  "use strict";

  var KEY = "sj_consent";           // 'granted' | 'denied'
  var g = window.gtag || function () { (window.dataLayer = window.dataLayer || []).push(arguments); };

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  // Ya hay decisión previa → no mostramos nada (el <head> ya aplicó el estado).
  if (read()) return;

  function grant() {
    g("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted"
    });
  }

  // --- Estilos (inyectados, alineados con el design system del sitio) ---
  var css = [
    "#sj-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483647;",
    "background:#2D2520;color:#F7F0E6;border:1px solid rgba(217,160,106,.35);",
    "box-shadow:0 6px 28px rgba(45,37,32,.35);padding:18px 20px;max-width:560px;margin:0 auto;",
    "font-family:'DM Sans',system-ui,-apple-system,sans-serif;line-height:1.55;",
    "animation:sjccUp .28s ease-out;}",
    "@keyframes sjccUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}",
    "#sj-cc p{margin:0 0 14px;font-size:13.5px;color:rgba(247,240,230,.82);}",
    "#sj-cc a{color:#D9A06A;text-decoration:underline;}",
    "#sj-cc .sj-cc-row{display:flex;gap:10px;flex-wrap:wrap;}",
    "#sj-cc button{flex:1 1 auto;min-width:130px;cursor:pointer;border:none;",
    "font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.06em;",
    "text-transform:uppercase;padding:12px 16px;transition:background .15s,opacity .15s;}",
    "#sj-cc .sj-cc-accept{background:#C17B3E;color:#fff;}",
    "#sj-cc .sj-cc-accept:hover{background:#A0622A;}",
    "#sj-cc .sj-cc-reject{background:transparent;color:#F7F0E6;border:1px solid rgba(247,240,230,.4);}",
    "#sj-cc .sj-cc-reject:hover{background:rgba(247,240,230,.08);}",
    "@media(max-width:480px){#sj-cc .sj-cc-row{flex-direction:column-reverse;}}"
  ].join("");
  var style = document.createElement("style");
  style.id = "sj-cc-style";
  style.textContent = css;
  document.head.appendChild(style);

  // --- Banner ---
  var box = document.createElement("div");
  box.id = "sj-cc";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-live", "polite");
  box.setAttribute("aria-label", "Aviso de cookies");
  box.innerHTML =
    '<p>Usamos cookies propias y de terceros para medir el uso del sitio con Google Analytics ' +
    'y, en el futuro, mostrar publicidad. Puedes aceptarlas o rechazarlas. ' +
    'Más información en nuestra <a href="/privacidad.html">política de privacidad</a>.</p>' +
    '<div class="sj-cc-row">' +
    '<button type="button" class="sj-cc-reject">Rechazar</button>' +
    '<button type="button" class="sj-cc-accept">Aceptar</button>' +
    "</div>";
  document.body.appendChild(box);

  function close() { box.remove(); }

  box.querySelector(".sj-cc-accept").addEventListener("click", function () {
    save("granted");
    grant();
    close();
  });
  box.querySelector(".sj-cc-reject").addEventListener("click", function () {
    save("denied"); // el estado ya es 'denied' por defecto; solo persistimos la elección
    close();
  });
})();
