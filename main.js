/* A&P Real Estate — landing alquiler por habitaciones para propietarios
   Interacciones: reveal, nav sticky, acordeón FAQ, tabs de ciudad,
   progreso de pasos, captura de UTMs, WhatsApp y el formulario de
   estudio de rentabilidad con su evento de conversión. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* -------- año -------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* -------- UTMs: capturar de la URL y preparar enlaces/campos -------- */
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var params = new URLSearchParams(window.location.search);
  var utm = {};
  UTM_KEYS.forEach(function (k) {
    var v = params.get(k);
    if (v) utm[k] = v;
    document.querySelectorAll('.' + k).forEach(function (field) { if (v) field.value = v; });
  });
  var utmQuery = Object.keys(utm).map(function (k) { return k + '=' + encodeURIComponent(utm[k]); }).join('&');

  // Conservar UTMs al navegar por anclas internas (listo para medición).
  if (utmQuery) {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) { a.setAttribute('data-utm', utmQuery); });
  }

  /* -------- WhatsApp (número principal: Pedro) -------- */
  var WA_NUMBER = '34605449916';
  function buildWa(text) {
    var msg = text;
    if (utmQuery) msg += ' [' + utmQuery + ']';
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }
  function buildWaLinks() {
    var waFloat = document.getElementById('waFloat');
    var waStudy = document.getElementById('waStudyBtn');
    if (waFloat) waFloat.href = buildWa('Hola, tengo un piso y quiero saber cuánto rentaría por habitaciones.');
    if (waStudy) waStudy.href = buildWa('Hola, quiero pedir un estudio de rentabilidad por habitaciones de mi piso.');
  }

  /* -------- nav sticky -------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* -------- reveal on scroll -------- */
  var reveals = document.querySelectorAll('.reveal, .step');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* -------- FAQ acordeón -------- */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var panel = item.querySelector('.faq__a');
      var open = item.classList.toggle('is-open');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    });
  });

  /* -------- tabs de ciudad + sincronía con anclas -------- */
  var tabs = document.querySelectorAll('.citytab');
  var panels = document.querySelectorAll('.citypanel');
  function activateCity(name, scroll) {
    var found = false;
    tabs.forEach(function (t) { t.classList.toggle('is-active', t.dataset.tab === name); });
    panels.forEach(function (p) {
      var on = p.dataset.panel === name;
      p.classList.toggle('is-active', on);
      if (on) found = true;
    });
    if (found && scroll) {
      var sec = document.getElementById('ciudades');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return found;
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { activateCity(t.dataset.tab, false); });
  });
  document.querySelectorAll('a[href="#madrid"],a[href="#valladolid"],a[href="#valencia"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var name = a.getAttribute('href').slice(1);
      e.preventDefault();
      activateCity(name, true);
      if (history.replaceState) history.replaceState(null, '', '#' + name);
    });
  });
  var h = (window.location.hash || '').slice(1);
  if (['madrid', 'valladolid', 'valencia'].indexOf(h) !== -1) {
    activateCity(h, false);
    setTimeout(function () {
      var sec = document.getElementById('ciudades');
      if (sec) sec.scrollIntoView({ block: 'start' });
    }, 60);
  }

  /* ============================================================
     CONVERSIÓN — el estudio se pide por WhatsApp
     Al pulsar el botón de WhatsApp registramos el lead.
     ============================================================ */
  var waStudy = document.getElementById('waStudyBtn');
  if (waStudy) {
    waStudy.addEventListener('click', function () {
      // === PLACEHOLDER PÍXEL DE CONVERSIÓN ===
      // Ej. Meta:   fbq('track','Lead',{content_name:'estudio'});
      // Ej. Google: gtag('event','conversion',{send_to:'AW-XXX/estudio'});
      try {
        if (typeof window.trackConversion === 'function') {
          window.trackConversion('estudio', utm);
        }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'lead', lead_type: 'estudio' });
      } catch (err) { /* noop */ }
      // =======================================
    });
  }

  /* -------- arranque -------- */
  buildWaLinks();
  onScroll();
})();
