/* ============================================================
   Kaplan Lab — main.js v2
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
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
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

/* ---- Publication filter ---- */
(function () {
  var filters = document.querySelectorAll('.pub-filter');
  var items   = document.querySelectorAll('.pub-item');
  var groups  = document.querySelectorAll('.pub-year-group');
  if (!filters.length) return;

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      items.forEach(function (item) {
        item.style.display = (filter === 'all' || item.dataset.type === filter) ? '' : 'none';
      });
      groups.forEach(function (group) {
        var visible = Array.from(group.querySelectorAll('.pub-item')).some(function (i) {
          return i.style.display !== 'none';
        });
        group.style.display = visible ? '' : 'none';
      });
    });
  });
}());

/* ---- Neural canvas animation ---- */
(function () {
  var canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var nodes = [], pulses = [], W, H, raf, fireTimer;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initNodes() {
    nodes = []; pulses = [];
    var count = Math.max(38, Math.min(80, Math.round(W * H / 13000)));
    for (var i = 0; i < count; i++) {
      nodes.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26,
        r:  Math.random() * 1.6 + 1.4,
        p:  0
      });
    }
  }

  function fire() {
    if (!nodes.length) return;
    var n = nodes[Math.floor(Math.random() * nodes.length)];
    n.p = 1.0;
    var MAX = 165;
    nodes.forEach(function (other) {
      if (other === n) return;
      var dx = other.x - n.x, dy = other.y - n.y;
      var d  = Math.sqrt(dx * dx + dy * dy);
      if (d < MAX && Math.random() < 0.45) {
        var delay = (d / MAX) * 420 * Math.random();
        setTimeout(function () {
          pulses.push({ from: n, to: other, t: 0, spd: 0.016 + Math.random() * 0.016 });
        }, delay);
      }
    });
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    var MAX = 165;

    nodes.forEach(function (n) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.p = Math.max(0, n.p - 0.014);
    });

    ctx.lineWidth = 0.65;
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = b.x - a.x, dy = b.y - a.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX) {
          ctx.strokeStyle = 'rgba(160,195,240,' + ((1 - d / MAX) * 0.13) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    pulses = pulses.filter(function (p) {
      p.t += p.spd;
      if (p.t >= 1) { p.to.p = Math.max(p.to.p, 0.65); return false; }
      var x = p.from.x + (p.to.x - p.from.x) * p.t;
      var y = p.from.y + (p.to.y - p.from.y) * p.t;
      var g = ctx.createRadialGradient(x, y, 0, x, y, 6);
      g.addColorStop(0, 'rgba(200,135,10,0.95)');
      g.addColorStop(1, 'rgba(200,135,10,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      return true;
    });

    nodes.forEach(function (n) {
      if (n.p > 0.05) {
        var g2 = ctx.createRadialGradient(n.x, n.y, n.r, n.x, n.y, n.r + 14);
        g2.addColorStop(0, 'rgba(200,135,10,' + (n.p * 0.22) + ')');
        g2.addColorStop(1, 'rgba(200,135,10,0)');
        ctx.fillStyle = g2;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 14, 0, Math.PI * 2); ctx.fill();
      }
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.p > 0.05
        ? 'rgba(200,135,10,' + (0.7 + n.p * 0.3) + ')'
        : 'rgba(155,190,235,0.52)';
      ctx.fill();
    });

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf) cancelAnimationFrame(raf);
    if (fireTimer) clearInterval(fireTimer);
    resize(); initNodes(); frame();
    fireTimer = setInterval(fire, 720 + Math.random() * 360);
  }

  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(start, 180);
  });

  start();
}());
