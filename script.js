(() => {
  'use strict';

  const sidenav = document.getElementById('sidenav');
  const toggle = document.querySelector('.menu-toggle');
  const backdrop = document.querySelector('.backdrop');
  const navLinks = Array.from(document.querySelectorAll('.sidenav__list a[data-nav]'));
  const sections = Array.from(document.querySelectorAll('section.section'));

  /* ---------- Mobile sidenav ---------- */
  const isMobile = () => window.matchMedia('(max-width: 860px)').matches;

  const openNav = () => {
    sidenav.classList.add('is-open');
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add('is-visible'));
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    sidenav.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!sidenav.classList.contains('is-open')) backdrop.hidden = true;
    }, 350);
  };

  toggle.addEventListener('click', () => {
    if (sidenav.classList.contains('is-open')) closeNav();
    else openNav();
  });

  backdrop.addEventListener('click', closeNav);

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (isMobile()) closeNav();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidenav.classList.contains('is-open')) closeNav();
  });

  window.addEventListener('resize', () => {
    if (!isMobile() && sidenav.classList.contains('is-open')) closeNav();
  });

  /* ---------- Scroll reveal ---------- */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Current section highlight in side nav ---------- */
  const linkById = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));

  const setCurrent = (id) => {
    navLinks.forEach((a) => a.classList.remove('is-current'));
    const link = linkById.get(id);
    if (link) {
      link.classList.add('is-current');
      // Keep current item visible inside the nav scroller.
      if (!isMobile()) {
        const rect = link.getBoundingClientRect();
        const navRect = sidenav.getBoundingClientRect();
        if (rect.top < navRect.top + 40 || rect.bottom > navRect.bottom - 40) {
          link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }
  };

  if ('IntersectionObserver' in window) {
    const visibility = new Map();
    const currentObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, entry.intersectionRatio);
        });
        let topId = null;
        let topRatio = 0;
        visibility.forEach((ratio, id) => {
          if (ratio > topRatio) {
            topRatio = ratio;
            topId = id;
          }
        });
        if (topId) setCurrent(topId);
      },
      {
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
        rootMargin: '-30% 0px -40% 0px',
      }
    );
    sections.forEach((s) => currentObserver.observe(s));
  }
})();
