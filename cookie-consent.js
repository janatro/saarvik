(function () {
  'use strict';

  var STORAGE_KEY = 'saarvik_cookie_consent';
  var MATOMO_URL = 'https://saarvik.matomo.cloud/';
  var MATOMO_SCRIPT = 'https://cdn.matomo.cloud/saarvik.matomo.cloud/matomo.js';
  var MATOMO_SITE_ID = '1';

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function loadMatomo() {
    if (window.__saarvikMatomoLoaded) return;
    window.__saarvikMatomoLoaded = true;
    window._paq = window._paq || [];
    window._paq.push(['setTrackerUrl', MATOMO_URL + 'matomo.php']);
    window._paq.push(['setSiteId', MATOMO_SITE_ID]);
    window._paq.push(['trackPageView']);
    window._paq.push(['enableLinkTracking']);

    var d = document;
    var g = d.createElement('script');
    var s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.defer = true;
    g.src = MATOMO_SCRIPT;
    s.parentNode.insertBefore(g, s);
  }

  function injectStyles() {
    if (document.getElementById('saarvik-cookie-style')) return;
    var style = document.createElement('style');
    style.id = 'saarvik-cookie-style';
    style.textContent = '\n' +
      '.saarvik-cookie{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:99999;display:flex;justify-content:center;pointer-events:none;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}\n' +
      '.saarvik-cookie__box{width:min(760px,100%);background:#061b35;color:#fff;border:1px solid rgba(255,255,255,.18);border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.28);padding:1.15rem;pointer-events:auto;}\n' +
      '.saarvik-cookie__title{font-size:1.05rem;font-weight:800;margin:0 0 .45rem;color:#fff;}\n' +
      '.saarvik-cookie__text{font-size:.93rem;line-height:1.55;margin:0;color:rgba(255,255,255,.82);}\n' +
      '.saarvik-cookie__text a{color:#f2c14e;text-decoration:underline;text-underline-offset:3px;}\n' +
      '.saarvik-cookie__actions{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1rem;}\n' +
      '.saarvik-cookie__btn{appearance:none;border:0;border-radius:999px;padding:.72rem 1rem;font-weight:800;cursor:pointer;font:inherit;transition:transform .18s ease,box-shadow .18s ease,background .18s ease;}\n' +
      '.saarvik-cookie__btn:focus-visible{outline:3px solid #f2c14e;outline-offset:3px;}\n' +
      '.saarvik-cookie__btn:hover{transform:translateY(-1px);}\n' +
      '.saarvik-cookie__btn--accept{background:#d49a2a;color:#061b35;box-shadow:0 10px 22px rgba(212,154,42,.25);}\n' +
      '.saarvik-cookie__btn--necessary{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.28);}\n' +
      '.saarvik-cookie-settings{display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(6,27,53,.25);background:#fff;color:#061b35;border-radius:999px;padding:.72rem 1rem;font-weight:800;cursor:pointer;margin-top:.8rem;}\n' +
      '@media (max-width:640px){.saarvik-cookie{left:.75rem;right:.75rem;bottom:.75rem}.saarvik-cookie__box{border-radius:16px;padding:1rem}.saarvik-cookie__actions{flex-direction:column}.saarvik-cookie__btn{width:100%;}}\n';
    document.head.appendChild(style);
  }

  function removeBanner() {
    var existing = document.getElementById('saarvik-cookie-consent');
    if (existing) existing.remove();
  }

  function showBanner() {
    injectStyles();
    removeBanner();
    var banner = document.createElement('section');
    banner.id = 'saarvik-cookie-consent';
    banner.className = 'saarvik-cookie';
    banner.setAttribute('aria-label', 'Datenschutz und Cookie-Einstellungen');
    banner.innerHTML = '' +
      '<div class="saarvik-cookie__box" role="dialog" aria-modal="false" aria-labelledby="saarvik-cookie-title">' +
      '<h2 class="saarvik-cookie__title" id="saarvik-cookie-title">Datenschutz & Cookies</h2>' +
      '<p class="saarvik-cookie__text">Wir verwenden technisch notwendige Funktionen, damit diese Website funktioniert. Mit Ihrer Zustimmung verwenden wir zusätzlich Matomo, um die Nutzung anonymisiert zu analysieren und unser Angebot zu verbessern. Weitere Informationen finden Sie in unserer <a href="/datenschutz.html">Datenschutzerklärung</a>.</p>' +
      '<div class="saarvik-cookie__actions">' +
      '<button class="saarvik-cookie__btn saarvik-cookie__btn--necessary" type="button" data-cookie-necessary>Nur notwendige Cookies</button>' +
      '<button class="saarvik-cookie__btn saarvik-cookie__btn--accept" type="button" data-cookie-accept>Analyse akzeptieren</button>' +
      '</div>' +
      '</div>';
    document.body.appendChild(banner);
    var necessary = banner.querySelector('[data-cookie-necessary]');
    var accept = banner.querySelector('[data-cookie-accept]');
    necessary.addEventListener('click', function () {
      setConsent('necessary');
      removeBanner();
    });
    accept.addEventListener('click', function () {
      setConsent('analytics');
      removeBanner();
      loadMatomo();
    });
  }

  function attachSettingsButtons() {
    var buttons = document.querySelectorAll('[data-cookie-settings]');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        window.__saarvikMatomoLoaded = false;
        showBanner();
      });
    });
  }

  window.saarvikCookieConsent = {
    open: showBanner,
    loadMatomo: loadMatomo
  };

  function init() {
    attachSettingsButtons();
    var consent = getConsent();
    if (consent === 'analytics') {
      loadMatomo();
    } else if (consent !== 'necessary') {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
