// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const menuIcon = document.querySelector('.menu-icon');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    if (menuIcon) menuIcon.textContent = isOpen ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      if (menuIcon) menuIcon.textContent = '☰';
    });
  });
}

// Auto-update footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Active nav link highlighting
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));
}

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 480);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Navbar shadow on scroll
// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  });
}

const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  });
}


// Dark / light theme toggle (remembers choice, defaults to system preference)
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
})();


// Count-up animation for stat badges (runs once when scrolled into view)
(function () {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  nums.forEach((el) => io.observe(el));
})();
