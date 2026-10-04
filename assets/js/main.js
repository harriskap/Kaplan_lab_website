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

/* ---- Homepage title emphasis ---- */
(function () {
  var title = document.querySelector('.hero__lab-title');
  if (!title) return;
  title.style.setProperty('-webkit-text-stroke', '1.2px var(--navy)');
}());

/* ---- Keep homepage subtitle at no more than 60% of title size ---- */
(function () {
  var title = document.querySelector('.hero__lab-title');
  var subtitle = document.querySelector('.hero__headline');
  if (!title || !subtitle) return;

  function capSubtitleSize() {
    subtitle.style.fontSize = '';
    var titleSize = parseFloat(window.getComputedStyle(title).fontSize);
    var subtitleSize = parseFloat(window.getComputedStyle(subtitle).fontSize);
    var maxSubtitleSize = titleSize * 0.60;

    if (subtitleSize > maxSubtitleSize) {
      subtitle.style.fontSize = maxSubtitleSize + 'px';
    }
  }

  capSubtitleSize();
  window.addEventListener('resize', capSubtitleSize);
}());

/* ---- PubMed profile links ---- */
(function () {
  var pubmedUrl = 'https://pubmed.ncbi.nlm.nih.gov/?term=harris+s+kaplan&sort=date';
  document.querySelectorAll('a[href*="pubmed.ncbi.nlm.nih.gov"]').forEach(function (a) {
    a.href = pubmedUrl;
  });
}());

/* ---- Left-align Nature publication image ---- */
(function () {
  var pubHero = document.querySelector('#publications .pub-hero');
  if (!pubHero) return;
  pubHero.style.justifyContent = 'flex-start';
}());

/* ---- Harris Kaplan UVA Biology link ---- */
(function () {
  var cards = document.querySelectorAll('.member-card');
  var harrisCard = null;
  cards.forEach(function (card) {
    var name = card.querySelector('.member-card__name');
    if (name && name.textContent.trim() === 'Harris Kaplan') harrisCard = card;
  });
  if (!harrisCard || harrisCard.querySelector('.member-card__uva-biology')) return;

  var role = harrisCard.querySelector('.member-card__role');
  if (!role) return;

  var roleLink = role.querySelector('.member-card__role-link');
  if (!roleLink) return;

  var institution = document.createElement('p');
  institution.className = 'member-card__role member-card__uva-biology';

  var link = document.createElement('a');
  link.href = 'https://bio.as.virginia.edu/people/harris-kaplan';
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'member-card__role-link';
  link.textContent = 'UVA Biology';

  institution.appendChild(link);
  role.insertAdjacentElement('afterend', institution);

  [roleLink, link].forEach(function (item) {
    item.style.textDecoration = 'underline';
    item.style.textUnderlineOffset = '0.16em';
  });
}());

/* ---- Additional lab members ---- */
(function () {
  var grid = document.querySelector('#team .member-grid');
  if (!grid) return;

  function hasMember(name) {
    return Array.from(grid.querySelectorAll('.member-card__name')).some(function (el) {
      return el.textContent.trim() === name;
    });
  }

  function addMember(name, role, email, imagePath) {
    if (hasMember(name)) return;

    var card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML =
      '<div class="member-card__photo">' +
        '<img src="' + imagePath + '" alt="' + name + ', ' + role + '">' +
      '</div>' +
      '<div class="member-card__info">' +
        '<h3 class="member-card__name">' + name + '</h3>' +
        '<p class="member-card__role">' + role + '</p>' +
        '<p class="member-card__email">' +
          '<a href="mailto:' + email + '" class="member-card__email-link" aria-label="Email ' + name + '">E-mail</a>' +
        '</p>' +
      '</div>';

    grid.appendChild(card);
  }

  addMember('Maria Longenecker', 'Lab technician', 'ngr8tk@virginia.edu', 'assets/images/Maria_Longenecker.jpg');
  addMember('Joanne Li', 'Undergraduate', 'fzx3xh@virginia.edu', 'assets/images/Joanne_Li.JPG');
}());

/* ---- Additional news items, newest first ---- */
(function () {
  var timeline = document.querySelector('#news .news-timeline');
  if (!timeline) return;

  function findNewsItem(title) {
    return Array.from(timeline.querySelectorAll('.tl-item')).find(function (item) {
      var heading = item.querySelector('h4');
      return heading && heading.textContent.trim() === title;
    });
  }

  function makeNewsItem(title, text) {
    var item = document.createElement('div');
    item.className = 'tl-item';
    item.innerHTML =
      '<div class="tl-item__date">August 2026</div>' +
      '<h4>' + title + '</h4>' +
      '<p>' + text + '</p>';
    return item;
  }

  var benItem = findNewsItem('Ben Bellanger joins the lab!');
  if (!benItem) return;

  var mariaItem = findNewsItem('Maria Longenecker joins the lab!');
  if (!mariaItem) {
    mariaItem = makeNewsItem(
      'Maria Longenecker joins the lab!',
      'Maria Longenecker joins the Kaplan Lab as a lab technician. Welcome, Maria!'
    );
  }

  var joanneItem = findNewsItem('Joanne Li joins the lab!');
  if (!joanneItem) {
    joanneItem = makeNewsItem(
      'Joanne Li joins the lab!',
      'Joanne Li joins the Kaplan Lab as an undergraduate researcher. Welcome, Joanne!'
    );
  }

  // Top-to-bottom order should be Joanne, Maria, Ben, then the lab opening item.
  timeline.insertBefore(mariaItem, benItem);
  timeline.insertBefore(joanneItem, mariaItem);
}());
/* ---- Remove trailing exclamation points from news titles ---- */
(function () {
  document.querySelectorAll('#news .tl-item h4').forEach(function (heading) {
    heading.textContent = heading.textContent.replace(/!$/, '');
  });
}());
