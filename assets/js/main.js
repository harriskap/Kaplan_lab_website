/* ============================================================
   Kaplan Lab — main.js
   ============================================================ */

/* ---- Nav: transparent → frosted on scroll ---- */
(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;
  function update() { nav.classList.toggle('scrolled', window.scrollY > 60); }
  window.addEventListener('scroll', update, { passive: true });
  update();
}());

/* ---- Mobile navigation ---- */
(function () {
  var hamburger = document.querySelector('.site-nav__hamburger');
  var navLinks  = document.querySelector('.site-nav__links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', open);
    var spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(function (s) { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { navLinks.classList.remove('is-open'); });
  });
}());

/* ---- Active nav link (scrollspy on single-page, pathname on multi-page) ---- */
(function () {
  var navLinks = document.querySelectorAll('.site-nav__links a');
  var isOnePage = !!document.querySelector('.site-nav__links a[href^="#"]');

  if (isOnePage) {
    var sections = document.querySelectorAll('section[id]');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (a) {
            var href = a.getAttribute('href');
            a.classList.toggle('active', href === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  } else {
    var page = location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }
}());

/* ---- Scroll reveal ---- */
(function () {
  var els = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (!els.length || !('IntersectionObserver' in window)) {
    // Fallback: show all immediately
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { observer.observe(el); });
}());
