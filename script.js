/* Tejas Choudhar — Portfolio interactions */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var themeBtn = $('#themeToggle');
  var themeMeta = $('meta[name="theme-color"]');

  function syncThemeColor() {
    if (!themeMeta) return;
    themeMeta.setAttribute('content', root.getAttribute('data-theme') === 'dark' ? '#151912' : '#FAF7F0');
  }
  syncThemeColor();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeColor();
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menuToggle');
  var navLinks = $('#navLinks');

  function setMenu(open) {
    if (!menuBtn || !navLinks) return;
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      setMenu(!navLinks.classList.contains('open'));
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navbar')) setMenu(false);
    });
  }

  /* ---------- Scroll-driven UI (one throttled handler) ---------- */
  var progress = $('#scrollProgress');
  var navbar = $('#navbar');
  var toTop = $('#backToTop');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (navbar) navbar.classList.toggle('scrolled', y > 8);
    if (toTop) toTop.classList.toggle('visible', y > 480);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Active nav link ---------- */
  var sections = $$('main section[id]');
  var anchors = $$('.nav-links a');

  if (sections.length && anchors.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        anchors.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Stat count-up (once, when visible) ---------- */
  var nums = $$('.stat-num[data-count]');
  if (nums.length && 'IntersectionObserver' in window && !reduceMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        runCount(entry.target);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { countObserver.observe(el); });
  }

  function runCount(el) {
    var raw = el.getAttribute('data-count');
    var target = parseFloat(raw);
    var decimals = (raw.split('.')[1] || '').length;
    var start = performance.now();
    var duration = 1100;
    (function tick(now) {
      var t = Math.min((now - start) / duration, 1);
      el.textContent = (target * (1 - Math.pow(1 - t, 3))).toFixed(decimals);
      if (t < 1) window.requestAnimationFrame(tick);
    })(start);
  }

  /* ---------- Copy email ---------- */
  var copyBtn = $('#copyEmail');
  var copyLabel = $('#copyLabel');

  if (copyBtn && copyLabel) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      var done = function (text) {
        copyLabel.textContent = text;
        setTimeout(function () { copyLabel.textContent = 'Copy email'; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done('Copied!'); }, function () { done(email); });
      } else {
        done(email);
      }
    });
  }
})();
